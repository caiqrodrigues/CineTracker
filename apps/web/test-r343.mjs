import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R343_SKIP_BUILD!=='1')await import('./build-r343.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v343.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r343-discover-home-ready.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R343_STATIC '+m)};
ok(r.version==='1.0.134'&&r.revision==='r343-official-1.0.134','identity');
ok(html.includes('app-v343.js')&&html.includes('app-v343.css'),'assets');
ok(js.includes("window.__ctR343Marker='discover-final-dom-owner+home-enriched-before-first-paint'"),'runtime marker');
ok(js.includes("function paintForYou(){\n if(window.__ctR336?.paintForYou)return false;"),'r309 late painter alive');
ok(js.includes("function paintForYou328(){\n if(window.__ctR336?.paintForYou)return false;"),'r328 late painter alive');
ok(js.includes("function paintForYou329(){\n if(window.__ctR336?.paintForYou)return false;"),'r329 late painter alive');
ok(js.includes("const history=await ct331RefreshHistory(false);"),'Home history still background');
ok(js.includes("loading('Carregando Home completa...')"),'Home full-ready loader missing');
ok(js.includes("await window.__ctR343.prepareHomePayload(data,seq)"),'Home live prepare not awaited');
ok(js.includes("await window.__ctR343.hydrateHomeDom()"),'Home DOM metadata hydration not awaited');
ok(!js.includes("const cached=ct274Payload();\n const hasCached="),'cache-first Home survived');
ok(js.includes("setTimeout(()=>{},5000);"),'delayed startup TV refresh alive');
ok(!js.includes("setTimeout(()=>void repairVisibleEpisodes332(),80);"),'delayed pointer repaint alive');
ok(!js.includes("setTimeout(()=>void forceTvRefresh332(),900);"),'delayed forced TV repaint alive');
ok(runtime.includes("ct275ReconcileOne")&&runtime.includes("ct274HydrateHome"),'r343 Home enrichment missing');
ok(r.discover_foryou_owner==='r336-only-no-legacy-late-dom-repaint','release Discover owner');
ok(r.home_startup==='fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal','release Home startup');
ok(r.home_cache_first===false&&r.home_delayed_metadata_repaint===false,'release Home late paint contract');
ok(r.sports_startup==='every-open-warm+force-provider-sync+auth-retry+refresh-payload','Sports changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R343_STATIC_OK');
