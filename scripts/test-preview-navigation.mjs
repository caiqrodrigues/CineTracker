import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html', 'utf8');
const source = await readFile('dist/patch-preview-navigation.js', 'utf8');
const runtime = await readFile('dist/patch-preview-navigation-runtime.js', 'utf8');
const tag = '<script src="/patch-preview-navigation.js"></script>';
const runtimeTag = '<script src="/patch-preview-navigation-runtime.js"></script>';
const fixTag = '<script src="/patch-v095-v0992-fix.js"></script>';

assert.ok(html.includes(tag), 'preview navigation tag missing');
assert.ok(html.includes(runtimeTag), 'preview navigation runtime tag missing');
assert.ok(html.indexOf(runtimeTag) < html.indexOf(fixTag), 'functional runtime must capture clicks before the historical navigation gate');
assert.ok(html.indexOf(tag) > html.indexOf('patch-v096-v0992-unfreeze.js'), 'preview navigation must run after FIX2');
assert.equal((html.match(/patch-preview-navigation\.js/g) || []).length, 1, 'preview navigation tag duplicated');
assert.equal((html.match(/patch-preview-navigation-runtime\.js/g) || []).length, 1, 'preview navigation runtime tag duplicated');
assert.doesNotThrow(() => new vm.Script(source), 'preview navigation JavaScript must compile');
assert.doesNotThrow(() => new vm.Script(runtime), 'preview navigation runtime JavaScript must compile');
assert.match(source, /web-0\.99\.2-fix2-buttons-v1/, 'preview marker missing');
assert.match(runtime, /web-0\.99\.2-fix2-routes-v2/, 'functional route marker missing');
assert.match(source, /grid-template-columns:repeat\(4/, 'mobile navigation must have four columns');
assert.match(source, /data-ct-preview-nav/, 'enhanced button marker missing');
assert.match(source, /aria-current/, 'active navigation accessibility state missing');
assert.match(source, /pointer-events:auto/, 'full button click target missing');
assert.deepEqual([...source.matchAll(/view: '(home|discover|profile|settings)'/g)].map(match => match[1]), ['home', 'discover', 'profile', 'settings']);
assert.ok(!/view: 'history'/.test(source), 'History must not be a primary navigation button');
for (const label of ['⌂ ', '✦ ', '◉ ', '⚙ ']) assert.ok(source.includes(label), `legacy label ${label} missing`);

const calls = [];
const listeners = new Map();
const buttons = ['home', 'discover', 'profile', 'settings'].map(view => ({
  dataset: { view },
  classList: { toggle() {} },
  setAttribute() {},
  removeAttribute() {}
}));
const context = {
  console,
  document: {
    querySelector: selector => selector.includes('#ct991-profile') && calls.at(-1) === 'profile' ? {} : selector.includes('.ct91-settings') && calls.at(-1) === 'settings' ? {} : null,
    querySelectorAll: () => buttons
  },
  render() {},
  view: 'home'
};
context.window = {
  ct0992Navigate: target => { calls.push(target); return true; },
  ct991Navigate: target => { calls.push(target); return true; },
  addEventListener: (type, handler) => listeners.set(type, handler),
  setTimeout: handler => { handler(); return 1; },
  scrollTo() {}
};
vm.runInNewContext(runtime, context);
for (const target of ['home', 'discover', 'profile', 'settings']) {
  const event = {
    target: { closest: () => ({ dataset: { view: target } }) },
    preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {}
  };
  listeners.get('click')(event);
  assert.equal(calls.at(-1), target, `${target} must invoke its functional route`);
}
assert.equal(context.window.__ctPreviewNavigate('history'), true, 'legacy History requests must be redirected');
assert.equal(calls.at(-1), 'profile', 'History must redirect to Profile');

console.log('PREVIEW_NAVIGATION_OK routes=home,discover,profile,settings history=removed profile=open settings=open click-target=full-row icons=svg');
