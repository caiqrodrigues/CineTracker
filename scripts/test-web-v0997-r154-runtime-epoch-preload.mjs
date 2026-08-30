import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Web r154 test: '+msg)};
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const sw=await readFile(resolve(root,'dist/service-worker.js'),'utf8');
const intent=await readFile(resolve(root,'dist/patch-v1195-v0997-route-preload-core.js'),'utf8');
const persistent=await readFile(resolve(root,'dist/patch-v1196-v0997-persistent-preload.js'),'utf8');
const epoch=await readFile(resolve(root,'dist/patch-v154-v0997-runtime-epoch.js'),'utf8');
const final=await readFile(resolve(root,'dist/patch-v154-v0997-runtime-final.js'),'utf8');
const chain=await readFile(resolve(root,'scripts/apply-web-v0997-rich-movie-discover.mjs'),'utf8');

must(epoch.includes("window.__ctRuntimeEpoch='r154'"),'epoch marker missing');
must(epoch.includes("indexedDB.deleteDatabase(name)"),'old IndexedDB cleanup missing');
must(epoch.includes("k.startsWith('ct-web-')"),'old CacheStorage cleanup missing');
must(intent.includes("__ct0997IntentPreload154='r154-intent-only'"),'intent-only preload missing');
must(!intent.includes('scheduleBackgroundWarm'),'background preload survived');
must(!intent.includes('window.fetch='),'fetch wrapper survived');
must(!intent.includes('window.sbRpc='),'route preloader sbRpc wrapper survived');
must(persistent.includes("DB_NAME='cinetracker-preload-r154'"),'epoch IndexedDB missing');
must(persistent.includes('SNAPSHOT_MAX_AGE=120000'),'2 minute max snapshot missing');
must(persistent.includes("HOME_R3='cinetracker_home_live_v0997_r3'"),'canonical Home r3 missing');
must(persistent.includes('p_today:localDay()'),'local-day canonical mapping missing');
must(!persistent.includes('24*60*60*1000'),'24 hour stale cache survived');
must(!persistent.includes('window.sbRpc=rpc1196'),'persistent sbRpc wrapper survived');
must(!persistent.includes('[0,120,420,900,1800,3200]'),'multi-stage boot warmer survived');
must(final.includes("window.__ctWebRevision='r154'"),'final revision marker missing');

const localScripts=[...html.matchAll(/<script\b[^>]*\bsrc="\/(?!\/)([^"]+\.js(?:\?[^"]*)?)"/gi)].map(m=>m[1]);
must(localScripts.length>10,'unexpected local script count');
must(localScripts.every(x=>x.endsWith('?ct=r154')),'mixed local JS epoch found: '+localScripts.filter(x=>!x.endsWith('?ct=r154')).join(','));
must(localScripts.filter(x=>x.startsWith('patch-v1195-v0997-route-preload-core.js')).length===1,'route preloader duplicated');
must(localScripts.filter(x=>x.startsWith('patch-v1196-v0997-persistent-preload.js')).length===1,'persistent preloader duplicated');
must(localScripts.filter(x=>x.startsWith('patch-v154-v0997-runtime-epoch.js')).length===1,'epoch gate duplicated');
must(localScripts.filter(x=>x.startsWith('patch-v154-v0997-runtime-final.js')).length===1,'final authority duplicated');
must(html.indexOf('patch-v154-v0997-runtime-epoch.js?ct=r154')<html.indexOf('patch-v143-v0997-nav-gate.js?ct=r154'),'epoch gate is not before nav gate');
must(html.lastIndexOf('patch-v154-v0997-runtime-final.js?ct=r154')>html.lastIndexOf('patch-v153-v0997-disable-r152-regression.js?ct=r154'),'r154 final marker must load after r153');
must(!html.includes('patch-v152-v0997-sports-hub.js'),'r152 returned');
must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock missing');
must(sw.includes("VERSION='ct-web-0.99.7-r154'"),'service worker revision not r154');
must(chain.includes("await import('./apply-web-v0997-r153-disable-r152-regression.mjs');\nawait import('./apply-web-v0997-r154-runtime-epoch-preload.mjs');"),'r154 is not final chain step');

console.log('WEB_R154_TEST_OK epoch=single preload=intent+canonical snapshot=2m all-assets=cache-busted r153=preserved r152=disabled');
