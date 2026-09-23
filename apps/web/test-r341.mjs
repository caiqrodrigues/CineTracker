import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R341_SKIP_BUILD!=='1')await import('./build-r341.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v341.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r341-discover-poster-lock.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R341_STATIC '+m)};
ok(r.version==='1.0.132'&&r.revision==='r341-official-1.0.132','identity');
ok(html.includes('app-v341.js')&&html.includes('app-v341.css'),'assets');
ok(js.includes("window.__ctR341Marker='discover-poster-lock+explicit-button-pixels+legacy-layout-writers-retired'"),'runtime marker');
ok(runtime.includes("const selectors=[\n  '.ct288-poster','.ct288-empty-poster'"),'poster-first authority missing');
ok(runtime.includes("imp(b,'flex','0 0 '+bp)")&&runtime.includes("imp(b,'width',bp)")&&runtime.includes("imp(b,'min-width',bp)")&&runtime.includes("imp(b,'max-width',bp)"),'explicit pixel button lock missing');
ok(runtime.includes("if(typeof cur.__ctR339Base==='function'")&&runtime.includes("if(typeof cur.__ctR338Base==='function'"),'legacy wrapper retirement missing');
ok(runtime.includes('new ResizeObserver')&&runtime.includes('observedPosters341'),'poster resize observer missing');
ok(runtime.includes("[40,140,320,560]"),'late settle missing');
ok(r.discover_all_tabs_actions==='rendered-poster-width+explicit-equal-pixel-buttons+late-settle+resize-observer','release geometry contract');
ok(r.discover_action_authority==='r341-poster-rect-only','release poster authority');
ok(r.discover_action_conflicts==='r338+r339-method-layout-wrappers-retired','release conflict contract');
ok(r.discover_action_validation==='desktop-1680x900+mobile-412x915','release viewport contract');
ok(r.sports_startup==='every-open-warm+force-provider-sync+auth-retry+refresh-payload','sports r340 changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R341_STATIC_OK');
