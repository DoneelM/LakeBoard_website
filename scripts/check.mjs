import { readFile, stat, readdir } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const root = resolve(new URL('../src', import.meta.url).pathname);
const html = await readFile(`${root}/index.html`, 'utf8');
const socialImage = html.match(/property="og:image" content="[^"]*\/([^"/]+)"/)[1];
await stat(`${root}/assets/${socialImage}`);
const css = await readFile(`${root}/styles.css`, 'utf8');
const js = await readFile(`${root}/app.js`, 'utf8');
// Every published page gets the same link, anchor and accessibility checks.
const pages = ['index.html', 'agent/index.html', 'features/index.html', 'features/how-it-works/index.html'];
const generated = new Set(['agent/lakeboard.md']); // written by scripts/build.mjs
const sources = new Map();
const pageIds = new Map();
for (const page of pages) {
  const text = await readFile(`${root}/${page}`, 'utf8');
  sources.set(page, text);
  pageIds.set(page, [...text.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}
for (const [page, text] of sources) {
  const pageIdList = pageIds.get(page);
  assert.equal(new Set(pageIdList).size, pageIdList.length, `IDs must be unique in ${page}`);
  for (const match of text.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:)/.test(url) || url.startsWith('#')) continue;
    assert.ok(/^\.\.?\//.test(url), `Asset must work under project base in ${page}: ${url}`);
    const [path, anchor] = url.split('#');
    const target = resolve(dirname(resolve(root, page)), path.endsWith('/') ? `${path}index.html` : path);
    assert.ok(target.startsWith(root + sep), `Link leaves the site in ${page}: ${url}`);
    const file = relative(root, target).split(sep).join('/');
    if (!generated.has(file)) assert.ok((await stat(target)).isFile(), `Missing local asset in ${page}: ${url}`);
    if (anchor) assert.ok(pageIds.get(file)?.includes(anchor), `Broken cross-page anchor in ${page}: ${url}`);
  }
  for (const match of text.matchAll(/href="#([^"]+)"/g)) assert.ok(pageIdList.includes(match[1]), `Broken anchor ${match[1]} in ${page}`);
  for (const match of text.matchAll(/<img\b([^>]*)>/g)) assert.ok(/\balt=/.test(match[1]), `Every image needs alt text (${page})`);
  assert.equal((text.match(/<h1\b/g) || []).length, 1, `One h1 per page (${page})`);
  assert.ok(text.includes('<html lang="en">') && text.includes('name="viewport"'), `lang and viewport (${page})`);
  assert.ok(!text.includes('—'), `Use plain punctuation in visible copy (${page})`);
  assert.ok(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text), `No personal emails in ${page}`);
}
// Each feature card drills through to exactly one technical section, and each section links back.
const overview = sources.get('features/index.html');
const details = sources.get('features/how-it-works/index.html');
const drills = [...overview.matchAll(/class="feature-drill" href="\.\/how-it-works\/#([^"]+)"/g)].map((m) => m[1]);
const sections = [...details.matchAll(/<section class="tech" id="([^"]+)"/g)].map((m) => m[1]);
assert.deepEqual([...drills].sort(), [...sections].sort(), 'Feature cards and technical sections must match one to one');
for (const id of sections) {
  assert.ok(details.includes(`href="../#card-${id}"`), `Technical section ${id} needs a link back to its card`);
  assert.ok(pageIds.get('features/index.html').includes(`card-${id}`), `Card id missing for ${id}`);
}
const ids = pageIds.get('index.html');
for (const match of html.matchAll(/data-dashboard="([^"]+)"/g)) {
  assert.ok(js.includes(`'${match[1]}'`), `Gallery entry missing: ${match[1]}`);
  await stat(`${root}/assets/${match[1]}.jpg`);
}
assert.ok(css.includes('prefers-reduced-motion') && js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
assert.ok(html.includes('<dialog') && js.includes('dialog.showModal()'));
assert.ok(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(js), 'No personal emails in source');
for (const file of ['app.js', 'costs.js', 'cost-model.js', 'agent/copy.js', 'vendor/scrollcraft.js']) {
  const result = spawnSync(process.execPath, ['--check', `${root}/${file}`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
async function assetBytes(folder) {
  let bytes = 0;
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = `${folder}/${entry.name}`;
    bytes += entry.isDirectory() ? await assetBytes(path) : (await stat(path)).size;
  }
  return bytes;
}
const total = await assetBytes(`${root}/assets`);
for (const match of css.matchAll(/url\(['"]?(\.\/[^'")]+)['"]?\)/g)) await stat(resolve(root, match[1]));
assert.ok(total < 2_000_000, `Assets exceed 2MB budget: ${total}`);
console.log(`Static checks passed: ${pages.length} pages, ${sections.length} feature drill-throughs, ${ids.length} unique home IDs, local assets, anchors, gallery mappings, JS syntax, accessibility hooks. Assets: ${(total / 1024).toFixed(0)} KiB.`);
