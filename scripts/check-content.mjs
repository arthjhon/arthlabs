// Fails if any built HTML still contains pending-content markers.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MARKER = 'TODO(arthur)';
const dist = join(process.cwd(), 'dist');

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

const offenders = [...walk(dist)].filter((f) => readFileSync(f, 'utf8').includes(MARKER));
if (offenders.length > 0) {
  console.error(`Found "${MARKER}" in ${offenders.length} file(s):`);
  for (const f of offenders) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('check-content: ok');
