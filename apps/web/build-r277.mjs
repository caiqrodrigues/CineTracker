import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r276-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v276.js'),'utf8'),
 readFile(resolve(dist,'app-v276.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r277-watch-action-fixed-sidebar.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r277 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r277 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r277 missing '+x)};
for(const x of["window.__ctR277='watch-action-host+fixed-sidebar';","window.__ctR277Watch='continue+dust+movie-watchlist-visible-right';","window.__ctR277Sidebar='desktop-fixed-full-height';",'function ct277EnsureWatchActions(root=document)','ct275PaintHome=ct277PaintHome;','paintHome=ct277PaintHome;'])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.67';window.__ctOfficialVersion='1.0.67';","window.__ctWebBuild='1.0.68';window.__ctOfficialVersion='1.0.68';",'version');
js=once(js,"const REVISION='r276-official-1.0.67';","const REVISION='r277-official-1.0.68';",'revision');
must(js,"window.__ctR276='history-above-initial-viewport+episode-card-parity'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.68 r277 — watched actions visible in-card; desktop sidebar fixed permanently. */
[data-home] .ct274-media-card.ct266-home-watch-host{position:relative!important;padding-right:44px!important}
[data-home] .ct274-media-card.ct266-home-watch-host>.ct266-watch-action{position:absolute!important;right:8px!important;top:50%!important;transform:translateY(-50%)!important;display:grid!important;place-items:center!important;z-index:8!important}
@media(min-width:701px){
 .app{grid-template-columns:136px minmax(0,1fr)!important}
 .sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:136px!important;height:100vh!important;max-height:100vh!important;overflow-y:auto!important;overscroll-behavior:contain!important}
 .content{grid-column:2!important;min-width:0!important}
}
`;
html=html.replaceAll('app-v276.js','app-v277.js').replaceAll('app-v276.css','app-v277.css').replaceAll('CineTracker • v1.0.67','CineTracker • v1.0.68');
sw=sw.replaceAll('ct-web-1.0.67-r276','ct-web-1.0.68-r277').replaceAll('app-v276.js','app-v277.js').replaceAll('app-v276.css','app-v277.css');
const release={version:'1.0.68',revision:'r277-official-1.0.68',status:'official',base:'r276-production',home_history_mode:'above-initial-viewport',home_history_toggle:false,home_history_initial_anchor:'continue',home_series_card_parity:['continue','dust','up_to_date'],home_watch_action_visible:['continue','dust','movie_watchlist'],home_watch_action_host_fixed:true,sidebar_mode:'fixed-desktop-full-height',sidebar_fixed:true,discover:'r276-preserved',detail:'r276-preserved',sports:'r276-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v277.js'),js,'utf8'),writeFile(resolve(dist,'app-v277.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v276.js'),{force:true}),rm(resolve(dist,'app-v276.css'),{force:true})]);
console.log('WEB_R277_READY watch-action=visible-right sidebar=fixed-desktop');
