import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { resolve } from 'node:path';

// Final production gate: after every historical patch was emitted, strip the old 0.99.4
// bootstrap/authority layers that can still re-render Home after the 0.99.7 authority starts.
await import('./apply-web-v0997-disable-v0994-takeover.mjs');
await import('./test-web-v0997-no-legacy-takeover.mjs');

const html = await readFile(resolve(process.cwd(), 'dist/index.html'), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/);
if (!inline) throw new Error('Startup smoke: base inline script not found in dist/index.html');
const source = inline[1];

if (!source.includes('const media = [')) {
  throw new Error('Startup smoke: emitted base script lost const media = [...]');
}

// First catch syntax failures in the exact emitted startup script.
new vm.Script(source, { filename: 'cinetracker-dist-base.js' });

const app = { innerHTML: '' };
const noop = () => {};
const localStore = new Map();
const localStorage = {
  getItem: (key) => localStore.has(key) ? localStore.get(key) : null,
  setItem: (key, value) => localStore.set(key, String(value)),
  removeItem: (key) => localStore.delete(key),
  clear: () => localStore.clear()
};
const fakeElement = () => ({
  innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, className: '',
  classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
  appendChild: noop, append: noop, remove: noop, addEventListener: noop,
  setAttribute: noop, querySelector: () => null, querySelectorAll: () => [],
  closest: () => null
});
const document = {
  body: fakeElement(),
  head: fakeElement(),
  querySelector(selector) { return selector === '#app' ? app : null; },
  querySelectorAll() { return []; },
  getElementById(id) { return id === 'app' ? app : null; },
  createElement: fakeElement,
  addEventListener: noop,
  removeEventListener: noop
};

const context = {
  console,
  document,
  localStorage,
  navigator: {},
  location: { href: 'https://mycinetracker.vercel.app/', origin: 'https://mycinetracker.vercel.app', pathname: '/' },
  history: { pushState: noop, replaceState: noop, back: noop },
  fetch: async () => ({ ok: false, status: 503, json: async () => ({}), text: async () => '' }),
  AbortController,
  URL,
  URLSearchParams,
  TextEncoder,
  TextDecoder,
  Map,
  Set,
  WeakMap,
  WeakSet,
  Promise,
  Date,
  Math,
  JSON,
  RegExp,
  Object,
  Array,
  String,
  Number,
  Boolean,
  Error,
  TypeError,
  parseInt,
  parseFloat,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame: (fn) => setTimeout(fn, 0),
  cancelAnimationFrame: clearTimeout,
  CustomEvent: class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } },
  Event: class Event { constructor(type) { this.type = type; } },
  addEventListener: noop,
  removeEventListener: noop,
  scrollTo: noop,
  innerWidth: 1280,
  innerHeight: 720
};
context.window = context;
context.globalThis = context;

vm.createContext(context);
new vm.Script(source, { filename: 'cinetracker-dist-base.js' }).runInContext(context, { timeout: 5000 });

// bootstrap() is async; give its no-session branch time to render the login shell.
await new Promise(resolve => setTimeout(resolve, 30));

if (!app.innerHTML || !app.innerHTML.includes('id="auth-form"')) {
  throw new Error('Startup smoke: Web boot completed without rendering #auth-form');
}
if (!app.innerHTML.includes('Entrar no CineTracker')) {
  throw new Error('Startup smoke: login shell is incomplete');
}

console.log('Startup smoke OK: emitted Web bundle executes and renders the login screen.');
