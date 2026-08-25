import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = await readFile('apps/web/patch-v072-v097-fix6.js', 'utf8');
assert.match(source, /AUTH_TIMEOUT_MS = 8000/);
assert.match(source, /finally \{\s*setLoading\(false\);\s*\}/);
assert.match(source, /window\.__ctFix6AuthUnsubscribe/);
assert.match(source, /removeEventListener\('cinetracker:auth-state-change'/);
assert.match(source, /safeStorageSet/);
assert.match(source, /safeStorageGet/);
assert.match(source, /navigateHomeSafely/);
assert.ok(!source.includes('location.reload('), 'FIX 6 não pode depender de reload após login');

function makeRuntime(iteration, { storageThrows = false, timeout = false } = {}) {
  const state = { home:false, fetches:0, nativeSaves:0, renderCount:0, listeners:new Map(), removed:[], errors:[] };
  const storage = new Map();
  const button = { dataset:{}, disabled:false, textContent:'Entrar no CineTracker', setAttribute(){} };
  const form = { id:'auth-form', dataset:{}, closest(sel){return sel==='#auth-form'?this:null;}, querySelector(sel){return sel==='.auth-submit'||sel==='button[type="submit"]'?button:null;} };
  const email = { value:`fix6-${iteration}@example.com` };
  const password = { value:'senha-segura' };
  const error = { textContent:'' };
  const home = { className:'app' };
  const document = {
    querySelector(sel){
      if(sel==='#auth-form') return state.home?null:form;
      if(sel==='#auth-email') return state.home?null:email;
      if(sel==='#auth-password') return state.home?null:password;
      if(sel==='#auth-error'||sel==='.auth-error') return state.home?null:error;
      if(sel==='.app'||sel==='.content'||sel==='[data-view="home"]') return state.home?home:null;
      if(sel==='#auth-toggle') return null;
      return null;
    },
    addEventListener(type,handler,capture){state.listeners.set(`document:${type}:${Boolean(capture)}`,handler);},
    removeEventListener(type,handler,capture){state.removed.push(`document:${type}:${Boolean(capture)}`);}
  };
  const localStorage = {
    getItem(key){return storage.get(key)??null;},
    setItem(key,value){if(storageThrows) throw new Error('quota exceeded'); storage.set(key,String(value));},
    removeItem(key){storage.delete(key);}
  };
  const windowListeners = new Map();
  const session = {access_token:`token-${iteration}`,refresh_token:`refresh-${iteration}`,expires_in:3600,user:{id:`user-${iteration}`,email:email.value}};
  const context = {
    console:{...console,warn(){},error(...args){state.errors.push(args.join(' '));}},
    document,localStorage,AbortController,
    CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},
    URL,setTimeout,clearTimeout,
    requestAnimationFrame(callback){callback();return 1;},
    fetch:async(url,options={})=>{
      state.fetches++;
      if(timeout){return await new Promise((resolve,reject)=>{options.signal?.addEventListener('abort',()=>{const aborted=new Error('aborted');aborted.name='AbortError';reject(aborted);},{once:true});});}
      assert.match(String(url),/auth\/v1\/token\?grant_type=password$/);
      return {ok:true,status:200,json:async()=>session};
    },
    __state:state
  };
  context.window=context;
  context.scrollTo=()=>{};
  context.addEventListener=(type,handler)=>{windowListeners.set(type,handler);};
  context.removeEventListener=(type,handler)=>{if(windowListeners.get(type)===handler)windowListeners.delete(type);state.removed.push(`window:${type}`);};
  context.dispatchEvent=event=>{windowListeners.get(event.type)?.(event);return true;};
  context.CineTrackerNative={saveSession(){state.nativeSaves++;}};
  vm.createContext(context);
  vm.runInContext(`
    const SUPABASE_URL='https://example.supabase.co';
    const SUPABASE_KEY='publishable-test';
    let ctSession=null; let currentUser=null; let authMode='signin'; let view='auth'; let cloudConnected=false; let cloudStatus='';
    function saveSession(session){const expiresAt=Math.floor(Date.now()/1000)+Number(session.expires_in||3600);ctSession={...session,expires_at:session.expires_at||expiresAt};currentUser=session.user||currentUser;localStorage.setItem('cinetracker_session',JSON.stringify(ctSession));}
    function render(){__state.renderCount++;if(currentUser&&ctSession?.access_token&&view==='home')__state.home=true;}
    async function loadCloudState(){cloudConnected=true;}
    async function primeOfficialSuggestions(){return true;}
    async function signIn(){} async function restoreSession(){return false;} function bindAuth(){}
  `,context);
  let runtimeSource=source;
  if(timeout)runtimeSource=runtimeSource.replace('const AUTH_TIMEOUT_MS = 8000;','const AUTH_TIMEOUT_MS = 40;');
  vm.runInContext(runtimeSource,context);
  return {context,state,storage,button,form,error,windowListeners};
}

for(let i=1;i<=50;i++){
  const runtime=makeRuntime(i);
  const result=await vm.runInContext('window.__ctFix6Test.submit()',runtime.context);
  assert.equal(result,true,`login ${i} não retornou sucesso`);
  assert.equal(runtime.state.home,true,`login ${i} não chegou à Home`);
  assert.equal(vm.runInContext('view',runtime.context),'home');
  assert.equal(vm.runInContext('currentUser.id',runtime.context),`user-${i}`);
  assert.equal(vm.runInContext('ctSession.access_token',runtime.context),`token-${i}`);
  assert.equal(vm.runInContext('window.__ctFix6HomeReached',runtime.context),true);
  assert.equal(runtime.state.fetches,1,`login ${i} fez chamadas duplicadas`);
  assert.equal(runtime.context.__ctAuthIsLoading,false,`login ${i} deixou loading ativo`);
  assert.equal(runtime.error.textContent,'');
  assert.equal(runtime.context.document.querySelector('#auth-form'),null,`login ${i} manteve formulário na tela`);
  vm.runInContext('window.__ctFix6Test.dispose()',runtime.context);
  assert.ok(runtime.state.removed.includes('window:cinetracker:auth-state-change'),'listener de auth não foi desinscrito');
  assert.ok(runtime.state.removed.includes('document:submit:true'),'listener de submit não foi removido no dispose');
}

{
  const runtime=makeRuntime(900,{storageThrows:true});
  const result=await vm.runInContext('window.__ctFix6Test.submit()',runtime.context);
  assert.equal(result,true,'falha de localStorage derrubou login');
  assert.equal(runtime.state.home,true,'falha de localStorage impediu Home');
  assert.equal(runtime.context.__ctAuthIsLoading,false,'falha de storage deixou loading ativo');
  assert.equal(runtime.state.nativeSaves,1,'fallback nativo de sessão não foi chamado');
}

{
  const runtime=makeRuntime(901,{timeout:true});
  const started=Date.now();
  const result=await vm.runInContext('window.__ctFix6Test.submit()',runtime.context);
  const elapsed=Date.now()-started;
  assert.equal(result,false,'timeout deveria falhar');
  assert.ok(elapsed<1000,`timeout de teste demorou demais: ${elapsed}ms`);
  assert.match(runtime.error.textContent,/8 segundos|tempo/i);
  assert.equal(runtime.button.disabled,false,'timeout deixou botão bloqueado');
  assert.equal(runtime.context.__ctAuthIsLoading,false,'timeout deixou loading ativo');
  assert.equal(runtime.state.home,false,'timeout não pode abrir Home');
}

console.log('OK - FIX 6: 50 logins completos chegaram à Home; storage failure não crasha; timeout libera loading; listeners são desinscritos.');
