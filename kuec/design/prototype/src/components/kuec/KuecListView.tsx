'use client';

import { type ReactNode } from 'react';
import { DataTable, type DataTableColumn } from 'mantine-datatable';

import { useLocale } from '@/i18n/LocaleContext';
import { KUEC_CONTROL } from '@/theme/kuec-tokens';

export type KuecListColumn<TRecord> = DataTableColumn<TRecord>;

type KuecListViewProps<TRecord extends { id: string }> = {
  records: TRecord[];
  columns: KuecListColumn<TRecord>[];
  onRowClick?: (record: TRecord) => void;
  emptyState?: ReactNode;
  ariaLabel: string;
  // Sticky header needs a bounded height; lists inside a record tab use it.
  maxHeight?: number;
};

// The one list template: mantine-datatable (uVENTURE's table library, which
// supports Mantine 8; mantine-react-table does not), 36 px rows, sticky header,
// no filters shown to BD officers by default. Sorting, column chooser, saved
// views and inline edit arrive with the first full list screen (Opportunities, week 3).
export const KuecListView = <TRecord extends { id: string }>({ records, columns, onRowClick, emptyState, ariaLabel, maxHeight }: KuecListViewProps<TRecord>) => {
  const { t } = useLocale();

  return (
    <div className="kuec-list" role="region" aria-label={ariaLabel}>
      <DataTable<TRecord>
        records={records}
        columns={columns}
        idAccessor="id"
        withTableBorder={false}
        withColumnBorders={false}
        highlightOnHover={onRowClick !== undefined}
        onRowClick={onRowClick ? ({ record }) => onRowClick(record) : undefined}
        height={maxHeight}
        minHeight={records.length === 0 ? 120 : undefined}
        noRecordsText={t('list.empty')}
        emptyState={emptyState}
        verticalSpacing={0}
        horizontalSpacing="sm"
        fz="sm"
        styles={{
          header: { height: KUEC_CONTROL.listRowHeightPx, fontSize: 'var(--mantine-font-size-xs)', fontWeight: 600 },
          table: { tableLayout: 'auto' },
        }}
        rowStyle={() => ({ height: KUEC_CONTROL.listRowHeightPx })}
        rowClassName="kuec-list-row"
      />
    </div>
  );
};
