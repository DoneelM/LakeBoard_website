import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const root = resolve(new URL('../src', import.meta.url).pathname);
const html = await readFile(`${root}/index.html`, 'utf8');
const socialImage = html.match(/property="og:image" content="[^"]*\/([^"/]+)"/)[1];
await stat(`${root}/assets/${socialImage}`);
const css = await readFile(`${root}/styles.css`, 'utf8');
const js = await readFile(`${root}/app.js`, 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|mailto:)/.test(match[1])) continue;
  assert.ok(match[1].startsWith('./'), `Asset must work under project base: ${match[1]}`);
  assert.ok((await stat(resolve(root, match[1]))).isFile(), `Missing local asset: ${match[1]}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Broken anchor ${match[1]}`);
for (const match of html.matchAll(/data-dashboard="([^"]+)"/g)) {
  assert.ok(js.includes(`'${match[1]}'`), `Gallery entry missing: ${match[1]}`);
  await stat(`${root}/assets/${match[1]}.jpg`);
}
for (const match of html.matchAll(/<img\b([^>]*)>/g)) assert.ok(/\balt=/.test(match[1]), 'Every image needs alt text');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(html.includes('<html lang="en">') && html.includes('name="viewport"'));
assert.ok(css.includes('prefers-reduced-motion') && js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
assert.ok(html.includes('<dialog') && js.includes('dialog.showModal()'));
assert.ok(!html.includes('—'), 'Use plain punctuation in visible copy');
assert.ok(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(html + js), 'No personal emails in source');
for (const file of ['app.js', 'costs.js', 'cost-model.js', 'vendor/scrollcraft.js']) {
  const result = spawnSync(process.execPath, ['--check', `${root}/${file}`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
let total = 0;
for (const name of await readdir(`${root}/assets`)) total += (await stat(`${root}/assets/${name}`)).size;
assert.ok(total < 2_000_000, `Assets exceed 2MB budget: ${total}`);
console.log(`Static checks passed: ${ids.length} unique IDs, local assets, anchors, gallery mappings, JS syntax, accessibility hooks. Assets: ${(total / 1024).toFixed(0)} KiB.`);
