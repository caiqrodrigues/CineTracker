import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const gate=await readFile(resolve(root,'dist/patch-v142-v0997-boot-gate.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v142-v0997-primary-router.js'),'utf8');
const discover=await readFile(resolve(root,'dist/patch-v134a-v0997-discover-final.js'),'utf8');
const live=await readFile(resolve(root,'dist/patch-v134b-v0997-live-home-calendar.js'),'utf8');
const routes=await readFile(resolve(root,'dist/patch-v134c-v0997-deeplink-details.js'),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error('r142: '+msg)};
const count=(s,n)=>s.split(n).length-1;

must(gate.includes("window.__ct0997StablePrimary137Loaded=true"),'legacy compatibility guard not prearmed');
must(gate.includes("html.ct-primary-boot #app{visibility:hidden!important}"),'legacy boot UI is not hidden');
must(gate.includes("/^r\\d{3}$/i"),'current/future primary headers are not accepted');
must(gate.includes('LEGACY_PRIMARY_RPCS'),'legacy primary RPC suppression missing');
must(gate.includes("!configs"),'settings exception missing from legacy network suppression');

const gatePos=index.indexOf('patch-v142-v0997-boot-gate.js');
const appPos=index.indexOf('<div id="app">');
must(gatePos>index.indexOf('<body>')&&gatePos<appPos,'r142 gate must execute before #app/bootstrap');
must(count(index,'patch-v142-v0997-boot-gate.js')===1,'r142 gate must execute exactly once');
must(!index.includes('patch-v141-v0997-boot-gate.js'),'r141 gate still executes');

must(primary.includes('r142-route-freeze-primary'),'r142 primary marker missing');
must(primary.includes("'X-CT-Primary':'r142'"),'r142 primary header missing');
must(primary.includes("document.documentElement.classList.remove('ct-primary-boot');return `"),'primary shell does not reveal final UI');
must(count(index,'patch-v142-v0997-primary-router.js')===1,'r142 primary must execute once');
must(!index.includes('patch-v140-v0997-profile-discover-lock.js'),'r140 primary still executes separately');

must(!discover.includes("observer.observe(app,{childList:true,subtree:true})"),'Discover autonomous subtree observer survived');
must(!discover.includes("for(const d of[0,100,350,900])"),'Discover autonomous warm timers survived');
must(discover.includes('window.__ct135RenderDiscover=renderDiscover;'),'Discover direct helper lost');
must(discover.includes('window.__ct135EnsureDiscover=ensureDiscover;'),'Discover helper export lost');

must(!live.includes("window.addEventListener('load',()=>schedule(true)"),'live runtime load scheduler survived');
must(!live.includes("setTimeout(()=>schedule(true),160)"),'live runtime boot scheduler survived');
must(live.includes('window.__ct135EnsureCalendar=ensureCalendar;'),'Calendar helper lost');
must(live.includes('window.__ct135RenderCalendar=renderCalendar;'),'Calendar render helper lost');

must(routes.includes("async function renderPrimary(key){if(window.__ct0997StablePrimary137Loaded&&key!=='settings')return false;"),'deep-link router does not reserve primary rendering to settings');
must(routes.includes("if(window.__ct0997StablePrimary137Loaded&&['home','discover','profile'].includes(t))return Promise.resolve(true);"),'legacy Home/Discover/Profile navigation is not frozen');
must(routes.includes("void go(primaryPath(t))"),'settings/deep-link navigation path was removed');

console.log('WEB_R142_OK boot=no-legacy-flash primary=single router=home+discover+profile-frozen configs=allowed discover=manual-only calendar=manual-only');
