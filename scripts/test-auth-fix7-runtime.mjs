import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=await readFile('apps/web/patch-v073-v097-fix7.js','utf8');
assert.match(source,/AUTH_TIMEOUT_MS=8000/);
assert.match(source,/finally\{setLoading\(false\)\}/);
assert.match(source,/signupRequest/);
assert.match(source,/window\.__ctAuthOwner = 'fix7'/);
assert.ok(!source.includes('Cadastro temporariamente indisponível'));

function runtime(i,{mode='signin',storageThrows=false,timeout=false,signupNeedsConfirmation=false}={}){
  const state={home:false,fetches:0,errors:[],listeners:new Map(),removed:[]};
  const store=new Map();
  const button={dataset:{},disabled:false,textContent:mode==='signup'?'Criar conta':'Entrar no CineTracker',setAttribute(){}};
  const form={dataset:{},querySelector(s){return s.includes('submit')||s==='.auth-submit'?button:null},closest(s){return s==='#auth-form'?this:null}};
  const email={value:`fix7-${i}@example.com`},password={value:'senha-segura'},error={textContent:''},home={};
  const document={querySelector(s){if(s==='#auth-form')return state.home?null:form;if(s==='#auth-email')return state.home?null:email;if(s==='#auth-password')return state.home?null:password;if(s==='#auth-error'||s==='.auth-error')return state.home?null:error;if(s==='.app'||s==='.content'||s==='[data-view="home"]')return state.home?home:null;if(s==='#auth-toggle')return null;return null},addEventListener(t,h,c){state.listeners.set(`d:${t}:${!!c}`,h)},removeEventListener(t,h,c){state.removed.push(`d:${t}:${!!c}`)}};
  const localStorage={getItem(k){return store.get(k)??null},setItem(k,v){if(storageThrows)throw new Error('quota');store.set(k,String(v))},removeItem(k){store.delete(k)}};
  const winListeners=new Map();
  const session={access_token:`token-${i}`,refresh_token:`refresh-${i}`,expires_in:3600,user:{id:`user-${i}`,email:email.value}};
  const ctx={console:{...console,warn(){},error(...a){state.errors.push(a.join(' '))}},document,localStorage,AbortController,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},setTimeout(fn,ms){return globalThis.setTimeout(fn,timeout&&ms===8000?30:Math.min(ms||0,1))},clearTimeout:globalThis.clearTimeout,requestAnimationFrame(fn){fn();return 1},fetch:async(url,opt={})=>{state.fetches++;if(timeout)return await new Promise((_,rej)=>opt.signal.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';rej(e)},{once:true}));if(String(url).includes('/signup')){return{ok:true,status:200,json:async()=>signupNeedsConfirmation?{user:{id:`user-${i}`,email:email.value}}:session}};assert.match(String(url),/token\?grant_type=password$/);return{ok:true,status:200,json:async()=>session}},__state:state};
  ctx.window=ctx;ctx.scrollTo=()=>{};ctx.addEventListener=(t,h)=>winListeners.set(t,h);ctx.removeEventListener=(t,h)=>{if(winListeners.get(t)===h)winListeners.delete(t);state.removed.push(`w:${t}`)};ctx.dispatchEvent=e=>{winListeners.get(e.type)?.(e);return true};
  vm.createContext(ctx);
  vm.runInContext(`const SUPABASE_URL='https://example.supabase.co';const SUPABASE_KEY='test';let ctSession=null;let currentUser=null;let authMode='${mode}';let view='auth';let cloudConnected=false;let cloudStatus='';function render(){if(currentUser&&ctSession?.access_token&&view==='home')__state.home=true;}async function loadCloudState(){}async function primeOfficialSuggestions(){}async function signIn(){}async function signUp(){}async function restoreSession(){return false}function bindAuth(){}`,ctx);
  vm.runInContext(source,ctx);
  return{ctx,state,button,error,store};
}

for(let i=1;i<=500;i++){
  const r=runtime(i);
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,true,`login ${i} falhou`);
  assert.equal(r.state.home,true,`login ${i} não chegou à Home`);
  assert.equal(vm.runInContext('view',r.ctx),'home');
  assert.equal(vm.runInContext('currentUser.id',r.ctx),`user-${i}`);
  assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);
  assert.equal(r.state.fetches,1,`login ${i} duplicou request`);
}

{
  const r=runtime(600,{storageThrows:true});
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,true);assert.equal(r.state.home,true);assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);
}
{
  const r=runtime(601,{timeout:true});
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,false);assert.equal(r.state.home,false);assert.equal(r.button.disabled,false);assert.equal(vm.runInContext('window.__ctAuthIsLoading',r.ctx),false);assert.match(r.error.textContent,/8 segundos/i);
}
{
  const r=runtime(700,{mode:'signup'});
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,true);assert.equal(r.state.home,true);assert.equal(r.state.fetches,1);
}
{
  const r=runtime(701,{mode:'signup',signupNeedsConfirmation:true});
  const ok=await vm.runInContext('window.__ctFix7Test.submit()',r.ctx);
  assert.equal(ok,true);assert.equal(r.state.home,false);assert.equal(vm.runInContext('authMode',r.ctx),'signin');assert.match(r.error.textContent,/Conta criada|Confirme/i);
}
{
  const r=runtime(800);vm.runInContext('window.__ctFix7Test.dispose()',r.ctx);assert.ok(r.state.removed.includes('d:submit:true'));assert.ok(r.state.removed.includes('w:cinetracker:auth-state-change'));
}
console.log('OK - FIX 7: 500 logins consecutivos chegaram à Home; signup funciona; timeout/storage/cleanup aprovados.');
