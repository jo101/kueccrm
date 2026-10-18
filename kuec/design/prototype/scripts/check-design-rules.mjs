// Design-rule checks the brief asks CI to fail on (part 2): raw colours,
// non-token sizes, physical CSS properties, and any Kuec pattern without a
// story. Runs in `npm run verify`; CI itself lives in uVENTURE's pipeline.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SRC = path.join(ROOT, 'src');

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);

    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = walk(SRC).filter((file) => /\.(tsx?|css)$/.test(file));
const failures = [];

// Tokens may define colours; nothing else may.
const COLOUR_ALLOWED = [path.join(SRC, 'theme', 'uventure-theme.ts')];
const RAW_COLOUR = /#(?:[0-9a-f]{3}){1,2}\b|\brgba?\(|\bhsla?\(/i;

// Physical properties and values; logical ones are required (design/theme.md section 4).
const PHYSICAL = /\b(margin-left|margin-right|padding-left|padding-right|border-left|border-right|left:|right:|text-align:\s*(left|right)|float:\s*(left|right))\b|\b(marginLeft|marginRight|paddingLeft|paddingRight|borderLeft|borderRight|textAlign:\s*'(left|right)')\b/;

// Pixel sizes in TSX props must be on the 8 px grid or one of the named token values
// (hairlines, the 6 px dot, 14/18/20/22 icon and type sizes, 36 px controls, 44 px targets, 420 px reading width).
const NAMED_PX = new Set([1, 2, 4, 6, 12, 14, 18, 20, 22, 28, 36, 44, 420]);
const isAllowedPx = (value) => value % 8 === 0 || NAMED_PX.has(value);

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file);
  const lines = text.split('\n');

  lines.forEach((line, index) => {
    const where = `${relative}:${index + 1}`;
    if (!COLOUR_ALLOWED.includes(file) && RAW_COLOUR.test(line) && !line.includes('var(--')) {
      failures.push(`${where}: raw colour (use a theme colour or a --uv-/--kuec- variable): ${line.trim()}`);
    }
    if (PHYSICAL.test(line) && !/scaleX|transform/.test(line)) {
      failures.push(`${where}: physical CSS property (use the logical one): ${line.trim()}`);
    }
    if (file.endsWith('.tsx')) {
      for (const match of line.matchAll(/(?<![A-Za-z])(?:width|height|gap|padding|margin|minWidth|maxWidth|minHeight|fontSize|size|w|h|maw|miw|mt|mb|ms|me|px|py|p)=\{(\d+)\}/g)) {
        const value = Number(match[1]);
        if (!isAllowedPx(value)) {
          failures.push(`${where}: size ${value} is not on the 8 px grid or in the token list: ${line.trim()}`);
        }
      }
    }
  });
}

// Every Kuec pattern needs a story in LTR and RTL, light and dark (the globals do the variants).
const patternDir = path.join(SRC, 'components', 'kuec');
const patterns = readdirSync(patternDir).filter((entry) => /^Kuec[A-Za-z]+\.tsx$/.test(entry));
for (const pattern of patterns) {
  const story = pattern.replace(/\.tsx$/, '.stories.tsx');
  if (!readdirSync(patternDir).includes(story)) {
    failures.push(`src/components/kuec/${pattern}: no story (${story} missing)`);
  }
}

if (failures.length > 0) {
  console.error(`Design rules: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Design rules: ${files.length} files and ${patterns.length} patterns checked, no failures.`);
