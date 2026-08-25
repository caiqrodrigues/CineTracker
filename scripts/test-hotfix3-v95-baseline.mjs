import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = await readFile('apps/web/index.html', 'utf8');
const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));

assert.ok(html.includes("const SUPABASE_URL = 'https://pjmkxryboypluleuuupp.supabase.co'"), 'baseline não aponta para o Supabase esperado');
assert.ok(html.includes("authRequest('token?grant_type=password'"), 'baseline perdeu password grant');
assert.ok(html.includes("localStorage.setItem('cinetracker_session'"), 'baseline perdeu persistência cinetracker_session');
assert.ok(html.includes('function bindAuth()'), 'baseline perdeu bindAuth');
assert.ok(html.includes("authMode === 'signup'"), 'baseline perdeu cadastro');
assert.ok(android.includes('WebSettings.LOAD_DEFAULT'), 'Android não usa LOAD_DEFAULT da v95');
assert.ok(android.includes('BuildConfig.WEB_URL'), 'Android não carrega Web remota original');
assert.ok(android.includes('ct83-v095.js'), 'Android perdeu ct83-v095');
assert.ok(!android.includes('WebViewAssetLoader'), 'HOTFIX 3 não pode conter WebViewAssetLoader');
assert.ok(!android.includes('authrev='), 'HOTFIX 3 não pode conter authrev');
assert.ok(!android.includes('fix=7'), 'HOTFIX 3 não pode conter FIX 7');
assert.ok(gradle.includes("versionName '0.0.97 HOTFIX 3'"), 'versionName HOTFIX 3 incorreto');
assert.ok(gradle.includes('versionCode 981'), 'versionCode HOTFIX 3 incorreto');
assert.equal(pkg.scripts.build, 'node scripts/build-web.mjs', 'deploy ainda está bloqueado pelo verify legado');

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
const form = { addEventListener(type, handler) { if (type === 'submit') submitHandler = handler; }, querySelector() { return button; } };
const email = { value: 'hotfix3@example.com' };
const password = { value: 'baseline-password' };
const error = { textContent: '' };
const toggle = { addEventListener() {} };
const document = { querySelector(selector) { if (selector === '#auth-form') return form; if (selector === '#auth-email') return email; if (selector === '#auth-password') return password; if (selector === '#auth-error') return error; if (selector === '#auth-toggle') return toggle; return null; } };
const ctx = {
  console, document,
  localStorage: { getItem(k) { return storage.has(k) ? storage.get(k) : null; }, setItem(k, v) { storage.set(k, v); }, removeItem(k) { storage.delete(k); } },
  fetch: async (url) => {
    state.requests.push(String(url));
    if (String(url).includes('/auth/v1/token?grant_type=password')) return { ok: true, status: 200, json: async () => ({ access_token: 'hotfix3-token', refresh_token: 'hotfix3-refresh', expires_in: 3600, user: { id: 'hotfix3-user', email: email.value } }) };
    if (String(url).includes('/auth/v1/user')) return { ok: true, status: 200, json: async () => ({ id: 'hotfix3-user', email: email.value }) };
    return { ok: true, status: 200, json: async () => ([]), text: async () => '[]' };
  },
  Date, Math, JSON, setTimeout, clearTimeout
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(authCore, ctx);
vm.runInContext(`let view='auth'; let cloudConnected=false; let cloudStatus=''; async function loadCloudState(){ __state.cloud++; cloudConnected=true; } async function primeOfficialSuggestions(){ __state.suggestions++; } function render(){ __state.renders++; }`, Object.assign(ctx, { __state: state }));
vm.runInContext(authUi, ctx);
vm.runInContext('bindAuth()', ctx);
assert.equal(typeof submitHandler, 'function', 'submit não foi registrado');
await submitHandler({ preventDefault() {} });
assert.equal(vm.runInContext('currentUser.id', ctx), 'hotfix3-user');
assert.equal(vm.runInContext('ctSession.access_token', ctx), 'hotfix3-token');
assert.ok(storage.has('cinetracker_session'));
assert.equal(state.cloud, 1);
assert.equal(state.suggestions, 1);
assert.ok(state.renders >= 1);
assert.equal(error.textContent, '');
assert.equal(state.requests.filter(x => x.includes('grant_type=password')).length, 1);
console.log('OK - HOTFIX 3 mantém integralmente o fluxo de login da v0.0.95 e remove apenas o bloqueio de deploy legado.');
