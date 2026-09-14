import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r279-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v279.js'),'utf8'),
 readFile(resolve(dist,'app-v279.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r280-minimal-watch-check.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r280 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r280 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r280 missing '+x)};
for(const x of[
 "window.__ctR280='minimal-watch-check+green-active';",
 "window.__ctR280Watch='check-only+muted-idle+green-on-click';",
 'function ct280MinimalWatchAction(kind,tmdb,s=0,e=0,title=',
 'async function ct280MarkWatched(action)',
 'ct279ExplicitWatchAction=ct280MinimalWatchAction;',
 'ct279MarkWatched=ct280MarkWatched;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.70';window.__ctOfficialVersion='1.0.70';","window.__ctWebBuild='1.0.71';window.__ctOfficialVersion='1.0.71';",'version');
js=once(js,"const REVISION='r279-official-1.0.70';","const REVISION='r280-official-1.0.71';",'revision');
must(js,"window.__ctR279='explicit-watched-buttons+canonical-r6-refresh'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.71 r280 — minimal watched check, muted idle and green active. */
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch]{position:static!important;inset:auto!important;transform:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important;flex:0 0 40px!important;margin:0 0 0 8px!important;padding:0!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.05)!important;color:rgba(203,213,225,.58)!important;opacity:.64!important;line-height:1!important;cursor:pointer!important;z-index:22!important;transition:opacity .16s ease,background .16s ease,border-color .16s ease,color .16s ease,transform .12s ease!important}
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch] .ct279-watch-check{font-size:15px!important;line-height:1!important;font-weight:800!important}
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch] .ct279-watch-label{display:none!important}
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch]:hover,[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch]:focus-visible{opacity:.86!important;background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.16)!important;outline:none!important}
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button.ct280-watch-active[data-ct279-watch],[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch][aria-pressed="true"],[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch][aria-busy="true"]{opacity:1!important;background:rgba(16,185,129,.20)!important;border-color:rgba(16,185,129,.40)!important;color:#6ee7b7!important;transform:scale(1.03)!important}
[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button.ct280-watch-active[data-ct279-watch]:disabled,[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch][aria-pressed="true"]:disabled{opacity:1!important;cursor:wait!important}
@media(max-width:700px){[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch]{width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important;flex-basis:40px!important;margin-left:6px!important;border-radius:12px!important}}
`;
html=html.replaceAll('app-v279.js','app-v280.js').replaceAll('app-v279.css','app-v280.css').replaceAll('CineTracker • v1.0.70','CineTracker • v1.0.71');
sw=sw.replaceAll('ct-web-1.0.70-r279','ct-web-1.0.71-r280').replaceAll('app-v279.js','app-v280.js').replaceAll('app-v279.css','app-v280.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.71',revision:'r280-official-1.0.71',base:'r279-production',home_watch_action_control:'minimal-check',home_watch_action_label:null,home_watch_action_text:false,home_watch_action_size_px:40,home_watch_action_idle:'muted',home_watch_action_click_feedback:'green',home_watch_action_event_owner:'r279+r280-visual',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v280.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v280.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v279.js'),{force:true}),rm(resolve(dist,'app-v279.css'),{force:true})]);
console.log('WEB_R280_READY watched-check=minimal-muted-click-green');
