import { readFileSync, writeFileSync } from 'node:fs';

export type CsvTable = {
  headers: string[];
  rows: CsvRow[];
};

export type CsvRow = {
  rowNumber: number;
  values: Record<string, string>;
};

const UTF8_BYTE_ORDER_MARK = '﻿';

// Excel saves CSV with ';' or tabs in some locales; the header line tells which.
const detectDelimiter = (firstLine: string): string => {
  const counts = [',', ';', '\t'].map((delimiter) => ({
    delimiter,
    count: firstLine.split(delimiter).length - 1,
  }));

  return counts.sort((left, right) => right.count - left.count)[0].delimiter;
};

export const parseCsv = (text: string): string[][] => {
  const input = text.startsWith(UTF8_BYTE_ORDER_MARK) ? text.slice(1) : text;
  const delimiter = detectDelimiter(input.split(/\r?\n/, 1)[0] ?? '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let isInQuotes = false;

  for (let index = 0; index < input.length; index++) {
    const character = input[index];

    if (isInQuotes) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index++;
      } else if (character === '"') {
        isInQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      isInQuotes = true;
    } else if (character === delimiter) {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && input[index + 1] === '\n') {
        index++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

export const readCsvTable = (filePath: string): CsvTable => {
  const [headerCells = [], ...dataRows] = parseCsv(readFileSync(filePath, 'utf8'));
  const headers = headerCells.map((header) => header.trim());

  const rows = dataRows
    .map((cells, index) => ({
      // Spreadsheet row number: the header is row 1.
      rowNumber: index + 2,
      values: Object.fromEntries(
        headers.map((header, column) => [header, (cells[column] ?? '').trim()]),
      ),
    }))
    .filter((row) => Object.values(row.values).some((value) => value !== ''));

  return { headers, rows };
};

const quoteCsvCell = (value: string): string =>
  /[",\r\n]/.test(value) || value !== value.trim()
    ? `"${value.replaceAll('"', '""')}"`
    : value;

export const formatCsv = (rows: string[][]): string =>
  `${rows.map((cells) => cells.map(quoteCsvCell).join(',')).join('\r\n')}\r\n`;

// Files for people to open in Excel get a byte order mark so Arabic names render;
// files for Twenty's importer do not, so the first header matches exactly.
export const writeCsv = (
  filePath: string,
  rows: string[][],
  { forExcel }: { forExcel: boolean },
) => {
  writeFileSync(
    filePath,
    `${forExcel ? UTF8_BYTE_ORDER_MARK : ''}${formatCsv(rows)}`,
    'utf8',
  );
};
