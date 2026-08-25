import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = await readFile('apps/web/index.html', 'utf8');
const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');

assert.ok(html.includes("const SUPABASE_URL = 'https://pjmkxryboypluleuuupp.supabase.co'"), 'v95 não aponta para o projeto Supabase esperado');
assert.ok(html.includes("authRequest('token?grant_type=password'"), 'v95 não contém login por password grant');
assert.ok(html.includes("localStorage.setItem('cinetracker_session'"), 'v95 não persiste cinetracker_session');
assert.ok(html.includes('function bindAuth()'), 'v95 não contém bindAuth base');
assert.ok(html.includes("authMode === 'signup'"), 'v95 perdeu fluxo de cadastro');
assert.ok(html.includes('loadCloudState'), 'v95 não contém hidratação cloud');
assert.ok(html.includes('primeOfficialSuggestions'), 'v95 não contém sugestões oficiais');
assert.ok(android.includes('WebSettings.LOAD_DEFAULT'), 'v95 Android não usa LOAD_DEFAULT');
assert.ok(android.includes('BuildConfig.WEB_URL'), 'v95 Android não carrega Web original');
assert.ok(android.includes('ct83-v095.js'), 'v95 Android não injeta módulo ct83-v095');
assert.ok(!android.includes('WebViewAssetLoader'), 'v95 contém asset loader posterior');
assert.ok(!android.includes('authrev='), 'v95 contém authrev posterior');
assert.ok(!android.includes('fix=7'), 'v95 contém FIX 7 posterior');
assert.ok(gradle.includes("versionName '0.0.95'"), 'versionName histórico não é 0.0.95');
assert.ok(gradle.includes('versionCode 95'), 'versionCode histórico não é 95');

function slice(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `não foi possível extrair ${startMarker}`);
  return html.slice(start, end);
}

const authCore = slice("const SUPABASE_URL =", 'async function sbApi');
const authUi = slice('function authScreen()', 'const watchlistMedia');

const state = { renders: 0, cloud: 0, suggestions: 0, requests: [] };
let submitHandler = null;
const storage = new Map();
const button = { disabled: false, textContent: 'Entrar no CineTracker' };
const form = {
  addEventListener(type, handler) { if (type === 'submit') submitHandler = handler; },
  querySelector() { return button; }
};
const email = { value: 'baseline@example.com' };
const password = { value: 'baseline-password' };
const error = { textContent: '' };
const toggle = { addEventListener() {} };
const document = {
  querySelector(selector) {
    if (selector === '#auth-form') return form;
    if (selector === '#auth-email') return email;
    if (selector === '#auth-password') return password;
    if (selector === '#auth-error') return error;
    if (selector === '#auth-toggle') return toggle;
    return null;
  }
};

const ctx = {
  console,
  document,
  localStorage: {
    getItem(k) { return storage.has(k) ? storage.get(k) : null; },
    setItem(k, v) { storage.set(k, v); },
    removeItem(k) { storage.delete(k); }
  },
  fetch: async (url, options = {}) => {
    state.requests.push(String(url));
    if (String(url).includes('/auth/v1/token?grant_type=password')) {
      return { ok: true, status: 200, json: async () => ({ access_token: 'v95-token', refresh_token: 'v95-refresh', expires_in: 3600, user: { id: 'v95-user', email: email.value } }) };
    }
    if (String(url).includes('/auth/v1/user')) {
      return { ok: true, status: 200, json: async () => ({ id: 'v95-user', email: email.value }) };
    }
    return { ok: true, status: 200, json: async () => ([]), text: async () => '[]' };
  },
  Date,
  Math,
  JSON,
  setTimeout,
  clearTimeout
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(authCore, ctx);
vm.runInContext(`
  let view='auth';
  let cloudConnected=false;
  let cloudStatus='';
  async function loadCloudState(){ __state.cloud++; cloudConnected=true; }
  async function primeOfficialSuggestions(){ __state.suggestions++; }
  function render(){ __state.renders++; }
`, Object.assign(ctx, { __state: state }));
vm.runInContext(authUi, ctx);
vm.runInContext('bindAuth()', ctx);
assert.equal(typeof submitHandler, 'function', 'v95 não registrou submit do login');
await submitHandler({ preventDefault() {} });
assert.equal(vm.runInContext('currentUser.id', ctx), 'v95-user', 'v95 não definiu currentUser após login');
assert.equal(vm.runInContext('ctSession.access_token', ctx), 'v95-token', 'v95 não definiu ctSession após login');
assert.ok(storage.has('cinetracker_session'), 'v95 não gravou sessão local');
assert.equal(state.cloud, 1, 'v95 não chamou loadCloudState uma vez');
assert.equal(state.suggestions, 1, 'v95 não chamou primeOfficialSuggestions uma vez');
assert.ok(state.renders >= 1, 'v95 não renderizou após login completo');
assert.equal(error.textContent, '', 'v95 exibiu erro no cenário de sucesso');
assert.equal(state.requests.filter(x => x.includes('grant_type=password')).length, 1, 'v95 disparou login duplicado no cenário simples');

console.log('OK - v0.0.95 baseline: password grant, sessão, cloud, sugestões e render executados no fluxo histórico.');
