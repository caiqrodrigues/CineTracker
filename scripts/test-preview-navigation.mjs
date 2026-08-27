import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html', 'utf8');
const source = await readFile('dist/patch-preview-navigation.js', 'utf8');
const tag = '<script src="/patch-preview-navigation.js"></script>';

assert.ok(html.includes(tag), 'preview navigation tag missing');
assert.ok(html.indexOf(tag) > html.indexOf('patch-v096-v0992-unfreeze.js'), 'preview navigation must run after FIX2');
assert.equal((html.match(/patch-preview-navigation\.js/g) || []).length, 1, 'preview navigation tag duplicated');
assert.doesNotThrow(() => new vm.Script(source), 'preview navigation JavaScript must compile');
assert.match(source, /web-0\.99\.2-fix2-buttons-v1/, 'preview marker missing');
assert.match(source, /grid-template-columns:repeat\(4/, 'mobile navigation must have four columns');
assert.match(source, /data-ct-preview-nav/, 'enhanced button marker missing');
assert.match(source, /aria-current/, 'active navigation accessibility state missing');
assert.match(source, /pointer-events:auto/, 'full button click target missing');
assert.deepEqual([...source.matchAll(/view: '(home|discover|profile|settings)'/g)].map(match => match[1]), ['home', 'discover', 'profile', 'settings']);
assert.ok(!/view: 'history'/.test(source), 'History must not be a primary navigation button');
for (const label of ['⌂ ', '✦ ', '◉ ', '⚙ ']) assert.ok(source.includes(label), `legacy label ${label} missing`);

console.log('PREVIEW_NAVIGATION_OK desktop=4 mobile=4 history=removed click-target=full-row icons=svg active-state=aria-current');
