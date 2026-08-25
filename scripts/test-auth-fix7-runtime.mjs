import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=await readFile('apps/web/patch-v073-v097-fix7.js','utf8');
const preboot=await readFile('apps/web/auth-preboot-fix7.js','utf8');
assert.match(source,/AUTH_TIMEOUT_MS = 6000/);
assert.match(source,/finally \{ setLoading\(false\); \}/);
assert.match(source,/\/auth\/v1\/signup/);
assert.match(source,/window\.__ctAuthOwner = 'fix7'/);
assert.match(source,/__ctBaseBootstrapDeferred/);
assert.ok(!source.includes('Cadastro temporariamente indisponível'));

function makeStorage(initial={},throws=false){
  const map=new Map(Object.entries(initial));
  return {
    map,
    get length(){return map.size},
    key(i){return [...map.keys()][i]??null},
    getItem(k){return map.get(k)??null},
    setItem(k,v){if(throws)throw new Error('quota');map.set(k,String(v))},
    removeItem(k){map.delete(k)}
  };
}

{
  const storage=makeStorage({
    cinetracker_session:JSON.stringify({access_token:'ghost',refresh_token:'ghost-refresh',user:{id:'ghost'}}),
    'sb-project-auth-token':'stale-supabase-token',
    unrelated:'keep-me'
  });
  const ctx={console:{...console,warn(){}},localStorage:storage};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(preboot,ctx);
  assert.equal(storage.getItem('cinetracker_session'),null,'preboot não removeu sessão canônica antes do bootstrap');
  assert.equal(storage.getItem('sb-project-auth-token'),null,'preboot não removeu chave sb fantasma');
  assert.equal(storage.getItem('unrelated'),'keep-me','preboot removeu storage não relacionado');
  assert.equal(vm.runInContext('window.__ctFix7TakeQuarantinedSession().access_token',ctx),'ghost');
}

function runtime(i,{mode='signin',storageThrows=false,timeout=false,signupNeedsConfirmation=false,loginError=false,ghost=false}={}){
  const state={home:false,fetches:0,errors:[],listeners:new Map(),removed:[],nativeSaves:0,nativeClears:0,boots:0};
  const initial=ghost?{cinetracker_session:JSON.stringify({access_token:'expired',refresh_token:'bad',expires_at:1,user:{id:'old'}}),'sb-old-auth-token':'bad'}:{};
  const localStorage=makeStorage(initial,storageThrows);
  const button={dataset:{},disabled:false,textContent:mode==='signup'?'Criar conta':'Entrar no CineTracker',setAttribute(){}};
  const form={dataset:{},querySelector(s){return s.includes('submit')||s==='.auth-submit'?button:null},closest(s){return s==='#auth-form'?this:null}};
  const email={value:`fix7-${i}@example.com`},password={value:'senha-segura'},error={textContent:''},home={};
  const document={querySelector(s){if(s==='#auth-form')return state.home?null:form;if(s==='#auth-email')return state.home?null:email;if(s==='#auth-password')return state.home?null:password;if(s==='#auth-error'||s==='.auth-error')return state.home?null:error;if(s==='.app'||s==='.content'||s==='[data-view="home"]')return state.home?home:null;return null},addEventListener(t,h,c){state.listeners.set(`d:${t}:${!!c}`,h)},removeEventListener(t,h,c){state.removed.push(`d:${t}:${!!c}`)}};
  const winListeners=new Map();
  const session={access_token:`token-${i}`,refresh_token:`refresh-${i}`,expires_in:3600,user:{id:`user-${i}`,email:email.value}};
  const ctx={console:{...console,warn(){},error(...a){state.errors.push(a.join(' '))}},document,localStorage,AbortController,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},setTimeout(fn,ms){return globalThis.setTimeout(fn,timeout&&ms===6000?30:Math.min(ms||0,1))},clearTimeout:globalThis.clearTimeout,requestAnimationFrame(fn){fn();return 1},fetch:async(url,opt={})=>{state.fetches++;if(timeout)return await new Promise((_,rej)=>opt.signal.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';rej(e)},{once:true}));if(loginError)return{ok:false,status:400,json:async()=>({message:'Credenciais inválidas'})};if(String(url).includes('/signup'))return{ok:true,status:200,json:async()=>signupNeedsConfirmation?{user:{id:`user-${i}`,email:email.value}}:session};if(String(url).includes('/auth/v1/user'))return{ok:true,status:200,json:async()=>session.user};if(String(url).includes('grant_type=refresh_token'))return{ok:false,status:400,json:async()=>({message:'refresh token inválido'})};assert.match(String(url),/token\?grant_type=password$/);return{ok:true,status:200,json:async()=>session}},__state:state};
  ctx.window=ctx;ctx.scrollTo=()=>{};ctx.addEventListener=(t,h)=>winListeners.set(t,h);ctx.removeEventListener=(t,h)=>{if(winListeners.get(t)===h)winListeners.delete(t);state.removed.push(`w:${t}`)};ctx.dispatchEvent=e=>{winListeners.get(e.type)?.(e);return true};ctx.CineTrackerNative={saveAuthSession(){state.nativeSaves++},getAuthSession(){return ''},clearAuthSession(){state.nativeClears++}};
  vm.createContext(ctx);
  vm.runInContext(`const SUPABASE_URL='https://example.supabase.co';const SUPABASE_KEY='test';let ctSession=null;let currentUser=null;let authMode='${mode}';let view='auth';let cloudConnected=false;let cloudStatus='';function render(){if(currentUser&&ctSession?.access_token&&view==='home')__state.home=true;}async function loadCloudState(){}async function primeOfficialSuggestions(){}async function signIn(){}async function signUp(){}async function restoreSession(){return false}function bindAuth(){}`,ctx);
  ctx.__ctBaseBootstrapDeferred=async()=>{state.boots++;const restored=await vm.runInContext('restoreSession()',ctx);if(!restored)vm.runInContext('render()',ctx);return restored};
  if(ghost)vm.runInContext(preboot,ctx);
  vm.runInContext(source,ctx);
  return{ctx,state,button,error,localStorage,email,password};
}

for(let i=1;i<=1000;i++){
  const r=runtime(i);
  await new Promise(resolve=>setTimeout(resolve,2));
  assert.equal(r.state.boots,1,`bootstrap ${i} executou quantidade errada`);
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,true,`login ${i} falhou`);
  assert.equal(r.state.home,true,`login ${i} não chegou à Home`);
  assert.equal(vm.runInContext('view',r.ctx),'home');
  assert.equal(vm.runInContext('currentUser.id',r.ctx),`user-${i}`);
  assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);
  assert.equal(r.state.fetches,1,`login ${i} duplicou request`);
}

{
  const r=runtime(1100,{storageThrows:true});await new Promise(resolve=>setTimeout(resolve,2));const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,true);assert.equal(r.state.home,true);assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);assert.ok(r.state.nativeSaves>=1,'fallback nativo não persistiu sessão');
}
{
  const r=runtime(1101,{timeout:true});await new Promise(resolve=>setTimeout(resolve,2));const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,false);assert.equal(r.state.home,false);assert.equal(r.button.disabled,false);assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);assert.match(r.error.textContent,/6 segundos/i);
}
{
  const r=runtime(1102,{loginError:true});await new Promise(resolve=>setTimeout(resolve,2));const beforeEmail=r.email.value,beforePassword=r.password.value;const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,false);assert.equal(r.email.value,beforeEmail,'falha apagou e-mail');assert.equal(r.password.value,beforePassword,'falha apagou senha');assert.match(r.error.textContent,/Credenciais inválidas/);assert.equal(r.button.disabled,false);
}
{
  const r=runtime(1200,{mode:'signup'});await new Promise(resolve=>setTimeout(resolve,2));const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,true);assert.equal(r.state.home,true);assert.equal(r.state.fetches,1);
}
{
  const r=runtime(1201,{mode:'signup',signupNeedsConfirmation:true});await new Promise(resolve=>setTimeout(resolve,2));const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,true);assert.equal(r.state.home,false);assert.match(r.error.textContent,/Conta criada|Confirme/i);assert.equal(r.button.disabled,false);
}
{
  const r=runtime(1300,{ghost:true});await new Promise(resolve=>setTimeout(resolve,4));assert.equal(r.state.home,false,'sessão fantasma abriu Home');assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false,'sessão fantasma deixou loading preso');assert.ok(r.state.nativeClears>=1,'sessão fantasma não limpou bridge nativa');const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);assert.equal(ok,true,'login depois de sessão fantasma falhou');assert.equal(r.state.home,true,'login depois de sessão fantasma não chegou à Home');
}
{
  const r=runtime(1400);await new Promise(resolve=>setTimeout(resolve,2));vm.runInContext('window.__ctFix7Test.dispose()',r.ctx);assert.ok(r.state.removed.includes('d:submit:true'));assert.ok(r.state.removed.includes('d:click:true'));assert.ok(r.state.removed.includes('w:cinetracker:auth-state-change'));
}
console.log('OK - FIX 7: 1000 logins chegaram à Home; preboot remove sessão fantasma; signup ativo; erro preserva campos; timeout/storage/listeners aprovados.');
