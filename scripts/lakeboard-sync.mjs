// Tells you when the LakeBoard decision records have moved on since this site's
// features pages were last checked against them.
//
//   npm run sync:check    compare LakeBoard's records with docs/lakeboard-decisions.json
//   npm run sync:update   record the current records, after updating the site's copy
//
// Each record is identified by its git blob hash, so a new record, an edited
// record (such as a "Change, <date>" section) and a removed record all count.
// Only the file list is fetched: a shallow, blob-less clone, no API token.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY = 'DoneelM/LakeBoard';
const SNAPSHOT = fileURLToPath(new URL('../docs/lakeboard-decisions.json', import.meta.url));
const RECORD = /^docs\/decisions\/(\d{4}-[a-z0-9-]+\.md)$/;

// `git ls-tree` lines look like: "100644 blob <sha>\tdocs/decisions/0001-x.md".
export function parseTree(text) {
  const records = {};
  for (const line of text.split('\n')) {
    const [meta, path] = line.split('\t');
    const match = path && RECORD.exec(path);
    if (match) records[match[1]] = meta.split(' ')[2];
  }
  return records;
}

export function diffRecords(recorded, current) {
  const names = (o) => Object.keys(o).sort();
  return {
    added: names(current).filter((n) => !(n in recorded)),
    changed: names(current).filter((n) => n in recorded && recorded[n] !== current[n]),
    removed: names(recorded).filter((n) => !(n in current)),
  };
}

export function report(diff, { from, to }) {
  const total = diff.added.length + diff.changed.length + diff.removed.length;
  if (!total) return { ok: true, text: `LakeBoard decision records match the site (${REPOSITORY}@${to.slice(0, 7)}).` };
  const link = (name) => `https://github.com/${REPOSITORY}/blob/${to}/docs/decisions/${name}`;
  const lines = [
    `LakeBoard's decision records changed since the features pages were checked (${from.slice(0, 7)} -> ${to.slice(0, 7)}).`,
    ...diff.added.map((n) => `  added    ${n}  ${link(n)}`),
    ...diff.changed.map((n) => `  changed  ${n}  ${link(n)}`),
    ...diff.removed.map((n) => `  removed  ${n}`),
    `Full diff: https://github.com/${REPOSITORY}/compare/${from}...${to}`,
    'Review src/features/ against these records, update what changed, then run `npm run sync:update` and commit docs/lakeboard-decisions.json.',
  ];
  return { ok: false, text: lines.join('\n') };
}

function fetchCurrent(ref) {
  const dir = mkdtempSync(join(tmpdir(), 'lakeboard-'));
  try {
    const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
    git('clone', '--quiet', '--depth', '1', '--filter=blob:none', '--no-checkout', '--branch', ref,
      `https://github.com/${REPOSITORY}.git`, '.');
    return { commit: git('rev-parse', 'HEAD').trim(), records: parseTree(git('ls-tree', 'HEAD', 'docs/decisions/')) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ref = process.env.LAKEBOARD_REF || 'main';
  const current = fetchCurrent(ref);
  if (!Object.keys(current.records).length) throw new Error(`No decision records found in ${REPOSITORY}@${ref}`);
  if (process.argv.includes('--update')) {
    const snapshot = { repository: REPOSITORY, ref, commit: current.commit, records: current.records };
    writeFileSync(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`Recorded ${Object.keys(current.records).length} decision records at ${REPOSITORY}@${current.commit.slice(0, 7)}.`);
  } else {
    const recorded = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
    const { ok, text } = report(diffRecords(recorded.records, current.records), { from: recorded.commit, to: current.commit });
    console.log(text);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\`\`\`\n${text}\n\`\`\`\n`);
    if (!ok) process.exitCode = 1;
  }
}
