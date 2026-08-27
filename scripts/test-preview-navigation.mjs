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

assert.match(source, /web-0\.99\.2-fix2-buttons-discover-v2/, 'preview UI marker missing');
assert.match(runtime, /web-0\.99\.2-fix2-routes-discover-v3/, 'functional runtime marker missing');
assert.match(source, /grid-template-columns:repeat\(4/, 'mobile navigation must have four columns');
assert.match(source, /data-ct-preview-nav/, 'enhanced button marker missing');
assert.match(source, /aria-current/, 'active navigation accessibility state missing');
assert.match(source, /pointer-events:auto/, 'full button click target missing');
assert.match(source, /ct991-discover-tabs/, 'Discover tabs pointer guard missing');
assert.match(source, /ct991-discover-filters/, 'Discover filters pointer guard missing');
assert.match(source, /purgeHistory/, 'permanent History cleanup missing');
assert.match(source, /Nenhum título elegível/, 'Pra Você empty-state detector missing');
assert.match(source, /Atualizar recomendações/, 'Pra Você refresh fallback missing');
assert.match(source, /Importar \/ sincronizar dados/, 'Pra Você import/sync fallback missing');
assert.match(runtime, /data-dtab991/, 'Discover tab capture handler missing');
assert.match(runtime, /data-dfilter991/, 'Discover filter capture handler missing');
assert.match(runtime, /console\.log/, 'Discover/navigation click diagnostics missing');
assert.match(runtime, /unhandledrejection/, 'unhandled promise diagnostic missing');
assert.match(runtime, /window\.addEventListener\('error'/, 'window error diagnostic missing');

assert.deepEqual([...source.matchAll(/view: '(home|discover|profile|settings)'/g)].map(match => match[1]), ['home', 'discover', 'profile', 'settings']);
assert.ok(!/view: 'history'/.test(source), 'History must not be a primary navigation button');
for (const label of ['⌂ ', '✦ ', '◉ ', '⚙ ']) assert.ok(source.includes(label), `legacy label ${label} missing`);

const calls = [];
const listeners = new Map();
const navButtons = ['home', 'discover', 'profile', 'settings'].map(view => ({
  dataset: { view },
  classList: { toggle() {} },
  setAttribute() {},
  removeAttribute() {}
}));

const context = {
  console,
  document: {
    querySelector(selector) {
      if (selector.includes('#ct991-profile') && calls.at(-1) === 'profile') return {};
      if (selector.includes('.ct91-settings') && calls.at(-1) === 'settings') return {};
      if (selector.includes('#ct991-discover-results') && calls.at(-1) === 'discover') return {};
      return null;
    },
    querySelectorAll() { return navButtons; }
  },
  render() {},
  view: 'home',
  Date
};

context.window = {
  ct0992Navigate: target => { calls.push(target); return true; },
  ct991Navigate: target => { calls.push(target); return true; },
  addEventListener(type, handler) { listeners.set(type, handler); },
  setTimeout(handler) { handler(); return 1; },
  scrollTo() {}
};

vm.runInNewContext(runtime, context);
const click = listeners.get('click');
assert.equal(typeof click, 'function', 'capture click handler must be installed');

for (const target of ['home', 'discover', 'profile', 'settings']) {
  const nav = { dataset: { view: target } };
  const event = {
    target: {
      closest(selector) {
        return selector.includes('.sidebar .nav button') ? nav : null;
      }
    },
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {}
  };
  click(event);
  assert.equal(calls.at(-1), target, `${target} must invoke its functional route`);
}

assert.equal(context.window.__ctPreviewNavigate('history'), true, 'legacy History requests must be redirected');
assert.equal(calls.at(-1), 'profile', 'History must redirect to Profile');

let tabClicks = 0;
const tabButton = {
  dataset: { dtab991: 'trending' },
  onclick() { tabClicks += 1; }
};
click({
  target: {
    closest(selector) {
      return selector === '[data-dtab991]' ? tabButton : null;
    }
  },
  preventDefault() {},
  stopPropagation() {},
  stopImmediatePropagation() {}
});
assert.equal(tabClicks, 1, 'Discover tab must execute its bound handler exactly once');

let filterClicks = 0;
const filterButton = {
  dataset: { dfilter991: 'movie' },
  onclick() { filterClicks += 1; }
};
click({
  target: {
    closest(selector) {
      return selector === '[data-dfilter991]' ? filterButton : null;
    }
  },
  preventDefault() {},
  stopPropagation() {},
  stopImmediatePropagation() {}
});
assert.equal(filterClicks, 1, 'Discover filter must execute its bound handler exactly once');

assert.ok(context.window.__ctPreviewDiagnostics.clicks.some(item => item.kind === 'discover-tab' && item.target === 'trending'), 'Discover tab click must be logged');
assert.ok(context.window.__ctPreviewDiagnostics.clicks.some(item => item.kind === 'discover-filter' && item.target === 'movie'), 'Discover filter click must be logged');

console.log('PREVIEW_NAVIGATION_OK routes=home,discover,profile,settings history=removed discover-tabs=reactive discover-filters=reactive fallback=ready console-diagnostics=enabled');
