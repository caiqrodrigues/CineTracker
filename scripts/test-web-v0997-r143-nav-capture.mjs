import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const nav=await readFile(resolve(root,'dist/patch-v143-v0997-nav-gate.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v143-v0997-primary-router.js'),'utf8');
const preload=await readFile(resolve(root,'dist/patch-v1196-v0997-persistent-preload.js'),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error('r143: '+msg)};
const count=(s,n)=>s.split(n).length-1;

must(nav.includes("document.addEventListener('click',onNav,true)"),'early capture listener missing');
must(nav.includes("e.stopImmediatePropagation()"),'legacy click propagation is not blocked');
must(nav.includes("cinetracker:primary-nav"),'primary nav event missing');
must(nav.includes("width=device-width,initial-scale=1,viewport-fit=cover"),'shared viewport normalization missing');
must(nav.includes('@media(max-width:850px)'),'shared responsive media rule missing');
must(nav.includes('.sidebar{display:none!important}'),'responsive sidebar hide missing');
must(nav.includes('.mobile-nav{display:grid!important}'),'responsive mobile nav reveal missing');
must(!nav.includes('ct144-phone')&&!nav.includes('userAgent')&&!nav.includes('maxTouchPoints'),'rejected phone-mode detection returned');
const navPos=index.indexOf('patch-v143-v0997-nav-gate.js');
const bootPos=index.indexOf('patch-v142-v0997-boot-gate.js');
const appPos=index.indexOf('<div id="app">');
must(navPos>index.indexOf('<body>')&&navPos<appPos,'nav gate must load before #app');
must(bootPos<0||navPos<bootPos,'nav gate must load before r142 boot gate');
must(count(index,'patch-v143-v0997-nav-gate.js')===1,'nav gate must execute once');

must(preload.includes("window.__ct0997PreloadedProfile=value"),'profile snapshot is not exposed');
must(preload.includes('window.__ct0997PersistentPreloadRpc=rpc1196'),'persistent preload RPC bridge missing');
must(primary.includes('r143-nav-capture-primary'),'r143 primary marker missing');
must(primary.includes("'X-CT-Primary':'r143'"),'r143 primary header missing');
must(primary.includes('let primaryRenderSeq=0;'),'primary sequencing missing');
must(primary.includes('if(seq!==primaryRenderSeq)return;'),'stale primary completion is not cancelled');
must(primary.includes("window.addEventListener('cinetracker:primary-nav'"),'primary nav event consumer missing');
must(primary.includes("if(primaryKey()!=='settings'){schedulePrimary(0);return}"),'stale settings recovery missing');
must(primary.includes("window.__ct0997PreloadedProfile||readPrimaryCache('profile')"),'profile does not consume persistent snapshot first');
must(primary.includes('window.__ct0997PersistentPreloadRpc||rpcDirect'),'profile persistent loader bridge missing');
must(primary.includes("v?._ct138LegacySuppressed?null:v"),'legacy-suppressed primary cache is still accepted');
must(primary.includes('function syncPrimaryNav(key)'),'route/nav synchronizer missing');
must(primary.includes("schedulePrimary(0);return}syncPrimaryNav(k)") ,'DOM route self-heal missing');
must(primary.includes("observe(app,{childList:true,subtree:true})"),'route observer does not watch nested legacy rewrites');
must(!primary.includes("new MutationObserver(()=>{if(rendering)return;const k=primaryKey()"),'rendering gate can still hide stale DOM rewrites');
must(primary.includes("if(['home','discover','profile'].includes(t))return Promise.resolve(true);"),'legacy programmatic primary navigation not frozen');
must(primary.includes("if(t==='settings'){if(primaryKey()!=='settings')return Promise.resolve(true);"),'settings legacy path is not route-scoped');
must(count(index,'patch-v143-v0997-primary-router.js')===1,'r143 primary must execute once');
must(!index.includes('patch-v142-v0997-primary-router.js'),'r142 primary still executes separately');

console.log('WEB_R143_OK viewport=shared-responsive nav=route-locked profile=snapshot settings=nonsticky legacy-clicks=blocked');