import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R365_SKIP_BUILD!=='1')await import('./build-r365.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v365.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r365-discover-speed-foryou-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R365_STATIC '+m)};
ok(r.version==='1.0.156'&&r.revision==='r365-official-1.0.156','identity');
ok(html.includes('app-v365.js')&&html.includes('app-v365.css'),'assets');
ok(js.includes("window.__ctR365Marker='discover-warm-authority+foryou-direct-local-actions'"),'runtime marker');
ok(js.includes('Date.now()-personal.at<300000'),'personal authority ttl');
ok(js.includes('[personal319(!!force),source319(tab,force)]'),'public authority reuse');
ok(js.includes('[personal319(!!force),topRaw319(provider,force)]'),'top authority reuse');
ok(js.includes("function prefetch319(){if(routeNow()!=='discover')return;void personal319(false);for(const t of STRICT)void source319(t,false)}"),'authority prefetch');
ok(!js.includes('personalTask=null;sourceCache.clear();topCache.clear();'),'public caches must survive personal change');
ok(runtime.includes("if(m.action==='swap')")&&runtime.includes('window.__ctR363?.handle?.(m)'),'swap path');
ok(runtime.includes('window.__ctR359Test?.mutate359')&&runtime.includes('persistDirect(m.action,m.key)'),'direct state actions');
ok(runtime.includes("if(action==='watchlist'&&name.startsWith('watch:'))return null"),'saved watchlist guard');
ok(r.discover_foryou_click_owner==='r365-direct-local-owner','owner contract');
ok(r.discover_tab_loading==='cached-source+cached-authority-first','speed contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R365_STATIC_OK');
