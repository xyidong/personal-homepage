import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { translations } from '../dist/content.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const keys = [...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(Object.keys(translations.zh).sort(), Object.keys(translations.en).sort(), 'Both languages must have identical keys');
for (const language of ['zh', 'en']) for (const key of keys) assert.ok(translations[language][key], `Missing ${language} translation: ${key}`);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Broken anchor: ${id}`);
for (const [, asset] of html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g)) await access(path.join(root, asset));
const visibleCopy = html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<[^>]*>/g, '') + JSON.stringify(translations);
assert.ok(!/(?<!\d)1[3-9]\d{9}(?!\d)|出生年月|政治面貌/.test(visibleCopy), 'Private résumé details must not appear in public copy');
async function scan(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) await scan(file);
    else {
      assert.ok(!/\.pdf$/i.test(item.name), 'Original résumé must not be published');
      if (/\.(html|js|css|svg|xml|txt)$/i.test(item.name)) assert.ok(!/(?<!\d)1[3-9]\d{9}(?!\d)/.test(await readFile(file, 'utf8')), `Phone-like number in public asset: ${item.name}`);
    }
  }
}
await scan(root);
console.log(`PASS: ${new Set(keys).size} translated UI keys, both language dictionaries, unique IDs, internal links, local assets, and public-content boundaries.`);
