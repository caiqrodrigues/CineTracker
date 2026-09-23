import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R342_SKIP_BUILD!=='1')await import('./build-r342.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v342.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r342-discover-stable-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R342_STATIC '+m)};
ok(r.version==='1.0.133'&&r.revision==='r342-official-1.0.133','identity');
ok(html.includes('app-v342.js')&&html.includes('app-v342.css'),'assets');
ok(js.includes("window.__ctR342Marker='discover-buttons-single-owner+no-jitter+poster-width-freeze'"),'runtime marker');
ok(js.includes("function fixActions338(){return false;"),'r338 writer active');
ok(js.includes("function fixActions339(){return false;"),'r339 writer active');
ok(js.includes("function fixDiscoverActions340(){return false;"),'r340 writer active');
ok(js.includes("function fixAll341(){return false;"),'r341 writer active');
ok(js.includes("function settle341(){clearLate341();}"),'r341 delayed settle active');
ok(runtime.includes("transition:none!important")&&runtime.includes("animation:none!important"),'layout transitions still allowed');
ok(runtime.includes("visibility:hidden!important"),'unlocked rows can flash');
ok(runtime.includes("buttonWidths342"),'stable integer button sizing missing');
ok(r.discover_action_authority==='r342-single-owner','single owner release');
ok(r.discover_action_conflicts==='r338+r339+r340+r341-geometry-writers-retired','conflict retirement release');
ok(r.discover_action_timing==='one-double-raf-after-real-dom-paint+mutation-only','timing release');
ok(r.discover_action_stability==='no-resize-observer+no-delayed-settle-loop+no-width-transition','stability release');
ok(r.sports_startup==='every-open-warm+force-provider-sync+auth-retry+refresh-payload','Sports r340 changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R342_STATIC_OK');
