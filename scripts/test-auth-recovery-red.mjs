import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const built = await readFile('dist/index.html', 'utf8');
assert.ok(built.includes("window.__ctAuthRecovery = 'v97-base'"), 'Build não contém a recuperação da autenticação base');
assert.ok(!built.includes('auth-preboot-fix7.js'), 'FIX 7 preboot ainda está ativo no build');
assert.ok(!built.includes('patch-v073-v097-fix7.js'), 'FIX 7 ainda está ativo no build');
assert.ok(built.includes('void bootstrap();'), 'Bootstrap base recuperado não está ativo');

function slice(startMarker, endMarker) {
  const start = built.indexOf(startMarker);
  const end = built.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Não foi possível extrair ${startMarker}`);
  return built.slice(start, end);
}

const authNetworkSource = slice('async function ctFetchWithTimeout', 'function saveSession(session) {');
const saveSessionSource = slice('function saveSession(session) {', 'async function restoreSession() {');
const recoverySource = slice("window.__ctAuthRecovery = 'v97-base';", 'const watchlistMedia');
const bootstrapSource = slice('async function bootstrap() {', 'function stats()');

function makeRuntime({ signInError = null, signInDelay = 0, cloudMode = 'hang', suggestionsMode = 'hang' } = {}) {
  const state = { renderCalls: 0, signInCalls: 0, cloudCalls: 0, suggestionCalls: 0 };
  let submitHandler = null;
  const button = { disabled: false, textContent: 'Entrar no CineTracker' };
  const form = {
    dataset: {},
    addEventListener(type, handler) { if (type === 'submit') submitHandler = handler; },
    querySelector(selector) { return selector === 'button[type="submit"]' ? button : null; }
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
  const fastTimer = (fn, ms = 0) => {
    const t = globalThis.setTimeout(fn, ms > 1000 ? 60 : ms);
    t.unref?.();
    return t;
  };
  const ctx = { document, console: { ...console, warn() {} }, setTimeout: fastTimer, clearTimeout: globalThis.clearTimeout, AbortController };
  ctx.window = ctx;
  vm.createContext(ctx);
  ctx.__state = state;
  ctx.__signInError = signInError;
  ctx.__signInDelay = signInDelay;
  ctx.__cloudMode = cloudMode;
  ctx.__suggestionsMode = suggestionsMode;
  vm.runInContext(`
    let authMode = 'signin';
    let currentUser = null;
    let ctSession = null;
    let view = 'auth';
    let cloudConnected = false;
    let cloudStatus = '';
    async function signIn() {
      __state.signInCalls += 1;
      if (__signInDelay) await new Promise(resolve => setTimeout(resolve, __signInDelay));
      if (__signInError) throw new Error(__signInError);
      currentUser = { id: 'user-recovery', email: 'recovery@example.com' };
      ctSession = { access_token: 'token-recovery' };
    }
    async function signUp() { return signIn(); }
    async function loadCloudState() {
      __state.cloudCalls += 1;
      if (__cloudMode === 'hang') return await new Promise(() => {});
      if (__cloudMode === 'error') throw new Error('db down');
      cloudConnected = true;
    }
    async function primeOfficialSuggestions() {
      __state.suggestionCalls += 1;
      if (__suggestionsMode === 'hang') return await new Promise(() => {});
      if (__suggestionsMode === 'error') throw new Error('tmdb down');
    }
    function render() { __state.renderCalls += 1; }
  `, ctx);
  vm.runInContext(recoverySource, ctx);
  vm.runInContext('bindAuth()', ctx);
  assert.equal(typeof submitHandler, 'function', 'bindAuth não registrou submit');
  return { ctx, state, submitHandler, button, email, password, error };
}

{
  const r = makeRuntime({ cloudMode: 'hang' });
  void r.submitHandler({ preventDefault() {} });
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(r.state.signInCalls, 1);
  assert.equal(r.state.cloudCalls, 1);
  assert.ok(r.state.renderCalls >= 1, 'REGRESSÃO: banco pendurado ainda impede a Home');
  assert.equal(vm.runInContext('view', r.ctx), 'home');
  assert.equal(vm.runInContext('currentUser.id', r.ctx), 'user-recovery');
}

{
  const r = makeRuntime({ cloudMode: 'ok', suggestionsMode: 'hang' });
  void r.submitHandler({ preventDefault() {} });
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.ok(r.state.renderCalls >= 1, 'TMDB pendurado impediu a Home');
  assert.equal(vm.runInContext('view', r.ctx), 'home');
}

{
  const r = makeRuntime({ signInError: 'Credenciais inválidas' });
  const beforeEmail = r.email.value;
  const beforePassword = r.password.value;
  await r.submitHandler({ preventDefault() {} });
  assert.equal(r.state.renderCalls, 0);
  assert.equal(r.email.value, beforeEmail);
  assert.equal(r.password.value, beforePassword);
  assert.match(r.error.textContent, /Credenciais inválidas/);
  assert.equal(r.button.disabled, false);
}

{
  const r = makeRuntime({ signInDelay: 20, cloudMode: 'ok', suggestionsMode: 'ok' });
  const first = r.submitHandler({ preventDefault() {} });
  const second = r.submitHandler({ preventDefault() {} });
  await Promise.all([first, second]);
  assert.equal(r.state.signInCalls, 1, 'Duplo toque gerou login concorrente');
  assert.ok(r.state.renderCalls >= 1);
}

{
  const ctx = {
    console: { ...console, warn() {} },
    localStorage: { setItem() { throw new Error('quota'); } },
    Date,
    Math,
    JSON
  };
  vm.createContext(ctx);
  vm.runInContext('let ctSession=null;let currentUser=null;', ctx);
  vm.runInContext(saveSessionSource, ctx);
  assert.doesNotThrow(() => vm.runInContext("saveSession({access_token:'ok',expires_in:3600,user:{id:'u1'}})", ctx));
  assert.equal(vm.runInContext('currentUser.id', ctx), 'u1');
  assert.equal(vm.runInContext('ctSession.access_token', ctx), 'ok');
}

{
  const ctx = {
    console,
    AbortController,
    fetch: async (_url, options = {}) => await new Promise((_, reject) => {
      options.signal?.addEventListener('abort', () => {
        const e = new Error('aborted');
        e.name = 'AbortError';
        reject(e);
      }, { once: true });
    }),
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext("const SUPABASE_URL='https://example.supabase.co'; function authHeaders(){return {}};", ctx);
  vm.runInContext(authNetworkSource, ctx);
  await assert.rejects(() => vm.runInContext("ctFetchWithTimeout('https://example.invalid',{},10)", ctx), /Tempo limite de autenticação excedido/);
}

{
  const state = { renders: 0, cloud: 0 };
  const fastTimer = (fn, ms = 0) => { const t = globalThis.setTimeout(fn, ms > 1000 ? 60 : ms); t.unref?.(); return t; };
  const ctx = { console: { ...console, warn() {} }, setTimeout: fastTimer, clearTimeout: globalThis.clearTimeout };
  ctx.window = ctx;
  ctx.__state = state;
  vm.createContext(ctx);
  vm.runInContext(`
    let ctSession={access_token:'restored'};let currentUser={id:'restored-user'};let view='auth';let cloudConnected=false;let cloudStatus='';
    async function restoreSession(){return true}
    async function loadCloudState(){__state.cloud+=1;return await new Promise(()=>{})}
    async function primeOfficialSuggestions(){}
    function render(){__state.renders+=1}
  `, ctx);
  vm.runInContext(recoverySource, ctx);
  vm.runInContext(bootstrapSource, ctx);
  void vm.runInContext('bootstrap()', ctx);
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.ok(state.renders >= 1, 'Sessão restaurada ainda espera banco para abrir Home');
  assert.equal(vm.runInContext('view', ctx), 'home');
}

const build = await readFile('scripts/build-web.mjs', 'utf8');
assert.ok(!build.includes("'patch-v073-v097-fix7.js'"), 'Recovery ainda inclui FIX 7 no array de patches');
assert.ok(!build.includes("const preboot = resolve(web, 'auth-preboot-fix7.js')"), 'Recovery ainda instala preboot FIX 7');

const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
assert.ok(!android.includes('ct89-v097-fix7.js'), 'Android ainda injeta FIX 7');
assert.ok(!android.includes('authrev='), 'Android ainda usa authrev artificial');
assert.ok(!android.includes('LOAD_NO_CACHE'), 'Android ainda força LOAD_NO_CACHE');
assert.ok(android.includes('WebSettings.LOAD_DEFAULT'), 'Android não voltou ao cache original da v97');

console.log('OK - RECOVERY: login abre Home antes de banco/TMDB; timeout, erro, storage, duplo toque, restore e Android aprovados.');
