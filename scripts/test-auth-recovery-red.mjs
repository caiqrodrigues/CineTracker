import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = await readFile('apps/web/index.html', 'utf8');
const start = html.indexOf('function bindAuth() {');
const end = html.indexOf('\nconst watchlistMedia', start);
assert.ok(start >= 0 && end > start, 'Não foi possível localizar bindAuth() no index.html');
const bindAuthSource = html.slice(start, end);

let submitHandler = null;
let renderCalls = 0;
let cloudStarted = 0;
let suggestionsStarted = 0;

const form = {
  addEventListener(type, handler) {
    if (type === 'submit') submitHandler = handler;
  }
};
const toggle = { addEventListener() {} };
const email = { value: 'recovery@example.com' };
const password = { value: 'recovery-password' };
const error = { textContent: '' };

const document = {
  querySelector(selector) {
    if (selector === '#auth-toggle') return toggle;
    if (selector === '#auth-form') return form;
    if (selector === '#auth-email') return email;
    if (selector === '#auth-password') return password;
    if (selector === '#auth-error') return error;
    return null;
  }
};

const ctx = {
  document,
  console,
  setTimeout,
  clearTimeout,
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(`
  let authMode = 'signin';
  let currentUser = null;
  let ctSession = null;
  async function signIn() {
    currentUser = { id: 'user-recovery', email: 'recovery@example.com' };
    ctSession = { access_token: 'token-recovery' };
  }
  async function signUp() { return signIn(); }
  async function loadCloudState() {
    cloudStarted += 1;
    return await new Promise(() => {});
  }
  async function primeOfficialSuggestions() {
    suggestionsStarted += 1;
    return await new Promise(() => {});
  }
  function render() { renderCalls += 1; }
`, ctx);
ctx.cloudStarted = cloudStarted;
ctx.suggestionsStarted = suggestionsStarted;
ctx.renderCalls = renderCalls;
Object.defineProperty(ctx, 'cloudStarted', { get: () => cloudStarted, set: v => { cloudStarted = v; } });
Object.defineProperty(ctx, 'suggestionsStarted', { get: () => suggestionsStarted, set: v => { suggestionsStarted = v; } });
Object.defineProperty(ctx, 'renderCalls', { get: () => renderCalls, set: v => { renderCalls = v; } });

vm.runInContext(bindAuthSource, ctx);
vm.runInContext('bindAuth()', ctx);
assert.equal(typeof submitHandler, 'function', 'bindAuth não registrou o submit do formulário');

void submitHandler({ preventDefault() {} });
await new Promise(resolve => setTimeout(resolve, 40));

assert.equal(cloudStarted, 1, 'O teste não conseguiu iniciar a carga do banco');
assert.equal(
  renderCalls,
  1,
  'REGRESSÃO CONFIRMADA: a autenticação fica presa esperando loadCloudState/TMDB antes de renderizar a Home. A Home deve renderizar imediatamente após signIn.'
);

const build = await readFile('scripts/build-web.mjs', 'utf8');
assert.ok(!build.includes('auth-preboot-fix7.js'), 'Recovery deve remover o preboot FIX 7 do runtime');
assert.ok(!build.includes('patch-v073-v097-fix7.js'), 'Recovery deve remover o FIX 7 como dono da autenticação');

const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
assert.ok(!android.includes('ct89-v097-fix7.js'), 'Android ainda injeta o FIX 7');
assert.ok(!android.includes('authrev='), 'Android ainda usa revisão artificial de autenticação');
assert.ok(!android.includes('LOAD_NO_CACHE'), 'Android ainda força LOAD_NO_CACHE no fluxo de recuperação');

console.log('OK - recovery auth: Home independe de banco/TMDB e FIX 7 não participa do runtime.');
