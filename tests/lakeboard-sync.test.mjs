import test from 'node:test';
import assert from 'node:assert/strict';
import { diffRecords, parseTree, report } from '../scripts/lakeboard-sync.mjs';

const tree = [
  '100644 blob aaa\tdocs/decisions/0001-one-app.md',
  '100644 blob bbb\tdocs/decisions/0013-platform-reliability.md',
  '100644 blob ccc\tdocs/decisions/README.md',
  '',
].join('\n');

test('reads numbered records and ignores the index', () => {
  assert.deepEqual(parseTree(tree), { '0001-one-app.md': 'aaa', '0013-platform-reliability.md': 'bbb' });
});

test('an edit inside an existing record counts as a change', () => {
  const diff = diffRecords({ '0013-platform-reliability.md': 'bbb' }, { '0013-platform-reliability.md': 'bbb2' });
  assert.deepEqual(diff, { added: [], changed: ['0013-platform-reliability.md'], removed: [] });
});

test('new and removed records are reported', () => {
  const diff = diffRecords({ '0001-a.md': '1', '0002-b.md': '2' }, { '0001-a.md': '1', '0018-c.md': '3' });
  assert.deepEqual(diff, { added: ['0018-c.md'], changed: [], removed: ['0002-b.md'] });
});

test('the report passes only when nothing moved, and names what did', () => {
  const commits = { from: 'a'.repeat(40), to: 'b'.repeat(40) };
  assert.equal(report({ added: [], changed: [], removed: [] }, commits).ok, true);
  const failed = report({ added: ['0018-c.md'], changed: [], removed: [] }, commits);
  assert.equal(failed.ok, false);
  assert.match(failed.text, /added {4}0018-c\.md/);
  assert.match(failed.text, /compare\/a{40}\.\.\.b{40}/);
});
