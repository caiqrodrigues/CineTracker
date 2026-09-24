import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r355.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v355.js'),'utf8'),
 readFile(resolve(dist,'app-v355.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r356-actions-sports-payload.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,a,b,l)=>{const n=count(s,a);if(n!==1)throw new Error('r356 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.146';window.__ctOfficialVersion='1.0.146';",
 "const REVISION='r355-official-1.0.146';",
 "const version='1.0.146',revision='r355-official-1.0.146';",
 "window.__ctR355Marker='foryou-hard-click-owner+local-slot-only+sports-sync-always-visible'",
 "const sport255={tab:'next',sport:'all',payload:null,at:0,gen:0};",
 "boot();"
])if(!js.includes(x))throw new Error('r356 missing '+x);

/* Expose only the existing r255 Sports state/loader/painter so later fixes can reload the authoritative payload.
   This does not replace the Sports renderer. */
js=once(js,
 "const sport255={tab:'next',sport:'all',payload:null,at:0,gen:0};\nconst f1255={tab:'overview',data:null,at:0};",
 "const sport255={tab:'next',sport:'all',payload:null,at:0,gen:0};\nconst f1255={tab:'overview',data:null,at:0};\nwindow.__ctR356SportsBridge={state:sport255,load:loadSports255,paint:paintSports255,rows:sportRows255};",
 'r255 sports bridge'
);

js=once(js,"window.__ctWebBuild='1.0.146';window.__ctOfficialVersion='1.0.146';","window.__ctWebBuild='1.0.147';window.__ctOfficialVersion='1.0.147';",'version');
js=once(js,"const REVISION='r355-official-1.0.146';","const REVISION='r356-official-1.0.147';",'revision');
js=once(js,"const version='1.0.146',revision='r355-official-1.0.146';","const version='1.0.147',revision='r356-official-1.0.147';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v355.js','app-v356.js').replaceAll('app-v355.css','app-v356.css').replaceAll('v1.0.146','v1.0.147').replaceAll('r355-official-1.0.146','r356-official-1.0.147');
sw=sw.replaceAll('ct-web-1.0.146-r355','ct-web-1.0.147-r356').replaceAll('app-v355.js','app-v356.js').replaceAll('app-v355.css','app-v356.css');
css+='\n/* CineTracker Web 1.0.147 r356 — metadata-proof Pra Você actions + authoritative Sports payload repaint. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.147',revision:'r356-official-1.0.147',base:'r355-production',
 scope:'foryou-actions-metadata-proof+sports-authoritative-payload',
 discover_foryou_click_owner:'r356-via-r355-earliest-dynamic-hook',
 discover_foryou_actions:'dom-key-fallback+state-resync+local-slot-only+background-persist',
 discover_foryou_repaint:'clicked-slot-only',
 sports_payload:'r255-authoritative-bridge+forced-reload-after-sync',
 sports_upcoming:'repaint-from-fresh-payload',
 sports_manual_sync:'r356-full-sync+reload+paint',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r356 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v356.js'),js),writeFile(resolve(dist,'app-v356.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v355.js'),{force:true}),rm(resolve(dist,'app-v355.css'),{force:true})]);
console.log('WEB_R356_READY metadata-proof Pra Você actions + authoritative Sports reload/paint');
