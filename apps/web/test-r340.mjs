import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R340_SKIP_BUILD!=='1')await import('./build-r340.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v340.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r340-sports-discover-actions.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R340_STATIC '+m)};
ok(r.version==='1.0.131'&&r.revision==='r340-official-1.0.131','identity');
ok(html.includes('app-v340.js')&&html.includes('app-v340.css'),'assets');
ok(js.includes("window.__ctR340Marker='sports-every-open-auth-retry+discover-all-tabs-exact-card-width'"),'runtime marker');
ok(js.includes("body:JSON.stringify({action:'sync',date_from:from,date_to:to,force:true})"),'sports force sync missing');
ok(js.includes("setTimeout(()=>{},300);"),'old route-only sports kickoff still active');
ok(runtime.includes("const ACTION_ROWS_340='.ct336-actions,.ct329-actions,.ct328-actions,.ct309-actions,.ct319-actions'"),'all Discover action owners missing');
ok(runtime.includes("imp(row,'flex-flow','row nowrap')"),'nowrap row missing');
ok(runtime.includes("imp(row,'width',px)")&&runtime.includes("imp(row,'min-width',px)")&&runtime.includes("imp(row,'max-width',px)"),'exact row width missing');
ok(runtime.includes("imp(b,'flex','1 1 0px')")&&runtime.includes("imp(b,'width','0')"),'equal fill buttons missing');
ok(runtime.includes("new MutationObserver")&&runtime.includes("childList:true"),'scoped Discover repaint observer missing');
ok(r.sports_startup==='every-open-warm+force-provider-sync+auth-retry+refresh-payload','sports release contract');
ok(r.discover_all_tabs_actions==='measured-card-width+equal-flex+nowrap+no-overflow+no-slack','Discover all tabs contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R340_STATIC_OK');
