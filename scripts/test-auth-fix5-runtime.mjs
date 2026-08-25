import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const fix5 = await readFile('apps/web/patch-v071-v097-fix5.js', 'utf8');
const mainActivity = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');
const buildWeb = await readFile('scripts/build-web.mjs', 'utf8');

assert.ok(!buildWeb.includes("'patch-v069-v097-fix.js'") && !buildWeb.includes("'patch-v070-v097-fix4.js'"), 'web build ainda carrega hotfix legado');
assert.ok(buildWeb.includes("'patch-v071-v097-fix5.js'"), 'web build não carrega FIX 5');
assert.ok(mainActivity.includes('settings.setCacheMode(WebSettings.LOAD_NO_CACHE)'), 'WebView ainda pode usar JS antigo em cache');
assert.ok(mainActivity.includes('webView.clearCache(true)'), 'cache legado não é limpo no FIX 5');
assert.ok(mainActivity.includes('&fix=5&authrev=5'), 'URL Android não força a revisão FIX 5');
assert.ok(mainActivity.includes('"ct84-v097.js","ct87-v097-fix5.js"'), 'FIX 5 não é o único hotfix de autenticação injetado pelo Android');
assert.ok(!mainActivity.includes('"ct85-v097-fix.js"') && !mainActivity.includes('"ct86-v097-fix4.js"'), 'Android ainda injeta FIX 3/FIX 4');
assert.ok(gradle.includes("versionCode 975") && gradle.includes("versionName '0.0.97 FIX 5'"), 'versão Android FIX 5 incorreta');
assert.ok(gradle.includes("rename { 'ct87-v097-fix5.js' }"), 'asset FIX 5 não está configurado no Gradle');

async function executeLogin(iteration) {
  const state = { home: false, renderCount: 0, fetchCount: 0, nativeSaveCount: 0, listeners: {} };
  const storage = new Map();
  const button = { dataset: {}, disabled: false, setAttribute() {}, textContent: 'Entrar no CineTracker' };
  const form = { id: 'auth-form', dataset: {}, closest(sel) { return sel === '#auth-form' ? this : null; }, querySelector(sel) { return sel === '.auth-submit' || sel === 'button[type="submit"]' ? button : null; } };
  const email = { value: `teste${iteration}@example.com` };
  const password = { value: 'senha-segura' };
  const error = { textContent: '' };
  const home = { className: 'app' };
  const document = {
    querySelector(sel) {
      if (sel === '#auth-form') return state.home ? null : form;
      if (sel === '#auth-email') return state.home ? null : email;
      if (sel === '#auth-password') return state.home ? null : password;
      if (sel === '#auth-error' || sel === '.auth-error') return state.home ? null : error;
      if (sel === '.app' || sel === '.content' || sel === '[data-view="home"]') return state.home ? home : null;
      return null;
    },
    addEventListener(type, handler, capture) { state.listeners[`${type}:${capture ? 'capture' : 'bubble'}`] = handler; }
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  };
  const session = { access_token: `token-${iteration}`, refresh_token: `refresh-${iteration}`, expires_in: 3600, user: { id: `user-${iteration}`, email: email.value } };
  const context = {
    console,
    document,
    localStorage,
    AbortController,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    setTimeout() { return 1; },
    clearTimeout() {},
    fetch: async (url, options) => {
      state.fetchCount++;
      assert.match(String(url), /auth\/v1\/token\?grant_type=password$/);
      assert.equal(options.method, 'POST');
      return { ok: true, status: 200, json: async () => session };
    },
    URL,
  };
  context.window = context;
  context.scrollTo = () => {};
  context.dispatchEvent = () => true;
  context.CineTrackerNative = { saveSession() { state.nativeSaveCount++; } };
  vm.createContext(context);
  vm.runInContext(`
    const SUPABASE_URL='https://example.supabase.co';
    const SUPABASE_KEY='publishable-test';
    let ctSession=null;
    let currentUser=null;
    let authMode='signin';
    let view='auth';
    let cloudConnected=false;
    let cloudStatus='';
    function saveSession(session){
      const expiresAt=Math.floor(Date.now()/1000)+Number(session.expires_in||3600);
      ctSession={...session,expires_at:session.expires_at||expiresAt};
      currentUser=session.user||currentUser;
      localStorage.setItem('cinetracker_session',JSON.stringify(ctSession));
    }
    function render(){
      __state.renderCount++;
      if(currentUser && ctSession?.access_token && view==='home') __state.home=true;
    }
    async function loadCloudState(){ cloudConnected=true; }
    async function primeOfficialSuggestions(){ return true; }
  `, vm.createContext ? undefined : undefined);
}

async function makeRuntime(iteration) {
  const state = { home: false, renderCount: 0, fetchCount: 0, nativeSaveCount: 0, listeners: {} };
  const storage = new Map();
  const button = { dataset: {}, disabled: false, setAttribute() {}, textContent: 'Entrar no CineTracker' };
  const form = { id: 'auth-form', dataset: {}, closest(sel) { return sel === '#auth-form' ? this : null; }, querySelector(sel) { return sel === '.auth-submit' || sel === 'button[type="submit"]' ? button : null; } };
  const email = { value: `teste${iteration}@example.com` };
  const password = { value: 'senha-segura' };
  const error = { textContent: '' };
  const home = { className: 'app' };
  const document = {
    querySelector(sel) {
      if (sel === '#auth-form') return state.home ? null : form;
      if (sel === '#auth-email') return state.home ? null : email;
      if (sel === '#auth-password') return state.home ? null : password;
      if (sel === '#auth-error' || sel === '.auth-error') return state.home ? null : error;
      if (sel === '.app' || sel === '.content' || sel === '[data-view="home"]') return state.home ? home : null;
      return null;
    },
    addEventListener(type, handler, capture) { state.listeners[`${type}:${capture ? 'capture' : 'bubble'}`] = handler; }
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  };
  const session = { access_token: `token-${iteration}`, refresh_token: `refresh-${iteration}`, expires_in: 3600, user: { id: `user-${iteration}`, email: email.value } };
  const context = {
    console, document, localStorage, AbortController,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    setTimeout() { return 1; }, clearTimeout() {}, URL,
    fetch: async (url, options) => {
      state.fetchCount++;
      assert.match(String(url), /auth\/v1\/token\?grant_type=password$/);
      assert.equal(options.method, 'POST');
      return { ok: true, status: 200, json: async () => session };
    },
    __state: state
  };
  context.window = context;
  context.scrollTo = () => {};
  context.dispatchEvent = () => true;
  context.CineTrackerNative = { saveSession() { state.nativeSaveCount++; } };
  vm.createContext(context);
  vm.runInContext(`
    const SUPABASE_URL='https://example.supabase.co';
    const SUPABASE_KEY='publishable-test';
    let ctSession=null;
    let currentUser=null;
    let authMode='signin';
    let view='auth';
    let cloudConnected=false;
    let cloudStatus='';
    function saveSession(session){
      const expiresAt=Math.floor(Date.now()/1000)+Number(session.expires_in||3600);
      ctSession={...session,expires_at:session.expires_at||expiresAt};
      currentUser=session.user||currentUser;
      localStorage.setItem('cinetracker_session',JSON.stringify(ctSession));
    }
    function render(){
      __state.renderCount++;
      if(currentUser && ctSession?.access_token && view==='home') __state.home=true;
    }
    async function loadCloudState(){ cloudConnected=true; }
    async function primeOfficialSuggestions(){ return true; }
  `, context);
  vm.runInContext(fix5, context);
  const result = await vm.runInContext('window.__ctFix5Test.submit()', context);
  assert.equal(result, true, `iteração ${iteration}: submit não retornou sucesso`);
  assert.equal(state.home, true, `iteração ${iteration}: Home não foi renderizada`);
  assert.equal(vm.runInContext('view', context), 'home', `iteração ${iteration}: view não é home`);
  assert.equal(vm.runInContext('currentUser?.id', context), `user-${iteration}`, `iteração ${iteration}: currentUser não foi aplicado`);
  assert.equal(vm.runInContext('ctSession?.access_token', context), `token-${iteration}`, `iteração ${iteration}: ctSession não foi aplicado`);
  assert.equal(vm.runInContext('window.__ctFix5HomeReached', context), true, `iteração ${iteration}: marcador de Home não foi atingido`);
  assert.equal(document.querySelector('#auth-form'), null, `iteração ${iteration}: formulário de login continuou na tela`);
  assert.ok(document.querySelector('.app'), `iteração ${iteration}: .app da Home não existe`);
  assert.equal(state.fetchCount, 1, `iteração ${iteration}: autenticação duplicada detectada`);
  assert.equal(state.nativeSaveCount, 1, `iteração ${iteration}: sessão nativa não foi persistida uma única vez`);
  assert.ok(storage.get('cinetracker_session')?.includes(`token-${iteration}`), `iteração ${iteration}: sessão não persistiu no localStorage`);
  assert.equal(error.textContent, '', `iteração ${iteration}: erro inesperado na tela`);

  const capture = state.listeners['submit:capture'];
  assert.equal(typeof capture, 'function', 'listener capture de submit não foi registrado');
  let prevented = false, stopped = false, immediate = false;
  capture({ target: form, preventDefault(){prevented=true;}, stopPropagation(){stopped=true;}, stopImmediatePropagation(){immediate=true;} });
  assert.equal(prevented && stopped && immediate, true, 'handler legado não foi bloqueado na captura');
}

for (let i = 1; i <= 25; i++) await makeRuntime(i);
console.log('OK - FIX 5 executou 25 logins completos: resposta 200 -> saveSession -> currentUser/ctSession -> render -> Home, sem formulário de login e sem autenticação duplicada.');
