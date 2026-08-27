import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile('dist/index.html', 'utf8');
const pre = await readFile('dist/patch-v097-v0993-nav-pre.js', 'utf8');
const post = await readFile('dist/patch-v098-v0993-web.js', 'utf8');
const pkg = await readFile('package.json', 'utf8');
const sw = await readFile('apps/web/service-worker.js', 'utf8');
const preTag = '<script src="/patch-v097-v0993-nav-pre.js"></script>';
const fixTag = '<script src="/patch-v095-v0992-fix.js"></script>';
const unfreezeTag = '<script src="/patch-v096-v0992-unfreeze.js"></script>';
const postTag = '<script src="/patch-v098-v0993-web.js"></script>';

assert.match(pkg, /"version": "0\.99\.3"/, 'Web package must be 0.99.3');
assert.match(sw, /ct-web-0\.99\.3/, 'Web cache must be 0.99.3');
assert.ok(html.includes(preTag), '0.99.3 pre-gate missing');
assert.ok(html.includes(postTag), '0.99.3 final layer missing');
assert.ok(html.indexOf(preTag) < html.indexOf(fixTag), '0.99.3 click gate must load before 0.99.2 capture gate');
assert.ok(html.indexOf(postTag) > html.indexOf(unfreezeTag), '0.99.3 final layer must load after FIX2');
assert.equal((html.match(/patch-v097-v0993-nav-pre\.js/g) || []).length, 1, 'pre-gate duplicated');
assert.equal((html.match(/patch-v098-v0993-web\.js/g) || []).length, 1, 'final layer duplicated');
assert.doesNotThrow(() => new vm.Script(pre), '0.99.3 pre-gate must compile');
assert.doesNotThrow(() => new vm.Script(post), '0.99.3 final layer must compile');

assert.match(pre, /web-0\.99\.3-navigation-discover-pre/, 'pre-gate marker missing');
assert.match(pre, /data-dtab991/, 'Discover tab handler missing');
assert.match(pre, /data-dfilter991/, 'Discover filter handler missing');
assert.match(pre, /console\.log/, 'click diagnostics missing');
assert.match(pre, /unhandledrejection/, 'unhandled rejection diagnostics missing');
assert.match(pre, /window\.addEventListener\('error'/, 'window error diagnostics missing');
assert.match(post, /web-0\.99\.3-sidebar-discover-footer/, 'final Web marker missing');
assert.match(post, /purgeHistory993/, 'History purge missing');
assert.match(post, /pointer-events:auto/, 'Discover/nav pointer event guard missing');
assert.match(post, /Nenhum título elegível/, 'Pra Você empty detector missing');
assert.match(post, /Atualizar recomendações/, 'Pra Você refresh fallback missing');
assert.match(post, /Importar \/ sincronizar dados/, 'Pra Você sync fallback missing');
assert.match(post, /CineTracker • v0\.99\.3/, '0.99.3 footer missing');
assert.ok(!/view:'history'/.test(post), 'History must not be part of canonical navigation');

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
  Date,
  view: 'home',
  render() {},
  document: {
    querySelector(selector) {
      if (selector.includes('#ct991-profile') && calls.at(-1) === 'profile') return {};
      if (selector.includes('.ct91-settings') && calls.at(-1) === 'settings') return {};
      if (selector.includes('#ct991-discover-results') && calls.at(-1) === 'discover') return {};
      if (selector.includes('.ct992-shell') && calls.at(-1) === 'home') return {};
      return null;
    },
    querySelectorAll() { return navButtons; }
  }
};
context.window = {
  ct0992Navigate: target => { calls.push(target); return true; },
  ct991Navigate: target => { calls.push(target); return true; },
  ct98Navigate: target => { calls.push(target); return true; },
  addEventListener(type, handler) { listeners.set(type, handler); },
  setTimeout(handler) { handler(); return 1; },
  scrollTo() {}
};
vm.runInNewContext(pre, context);
const click = listeners.get('click');
assert.equal(typeof click, 'function', 'capture click handler must be installed');

for (const target of ['home', 'discover', 'profile', 'settings']) {
  const nav = { dataset: { view: target } };
  click({
    target: { closest(selector) { return selector.includes('.sidebar .nav button') ? nav : null; } },
    preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {}
  });
  assert.equal(calls.at(-1), target, `${target} must invoke its route`);
}
assert.equal(context.window.__ct0993Navigate('history'), true, 'legacy History route must redirect');
assert.equal(calls.at(-1), 'profile', 'History must redirect to Profile');

let tabClicks = 0;
const tabButton = { dataset: { dtab991: 'trending' }, onclick() { tabClicks += 1; } };
click({
  target: { closest(selector) { return selector === '[data-dtab991]' ? tabButton : null; } },
  preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {}
});
assert.equal(tabClicks, 1, 'Discover tab handler must run exactly once');

let filterClicks = 0;
const filterButton = { dataset: { dfilter991: 'movie' }, onclick() { filterClicks += 1; } };
click({
  target: { closest(selector) { return selector === '[data-dfilter991]' ? filterButton : null; } },
  preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {}
});
assert.equal(filterClicks, 1, 'Discover filter handler must run exactly once');
assert.ok(context.window.__ct0993Diagnostics.clicks.some(item => item.kind === 'discover-tab' && item.target === 'trending'), 'Discover tab click must be logged');
assert.ok(context.window.__ct0993Diagnostics.clicks.some(item => item.kind === 'discover-filter' && item.target === 'movie'), 'Discover filter click must be logged');

console.log('WEB_0993_OK routes=4 history=removed discover-tabs=reactive discover-filters=reactive fallback=ready diagnostics=enabled');
