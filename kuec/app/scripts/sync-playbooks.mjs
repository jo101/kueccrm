import { copyFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// kuec/playbooks is the source; the app bundles a copy so a deployed version carries its playbooks.
const appDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDirectory = join(appDirectory, '..', 'playbooks');
const targetDirectory = join(appDirectory, 'src', 'playbooks');

for (const fileName of readdirSync(sourceDirectory)) {
  if (fileName.endsWith('.json')) {
    copyFileSync(join(sourceDirectory, fileName), join(targetDirectory, fileName));
    console.log(`synced ${fileName}`);
  }
}
