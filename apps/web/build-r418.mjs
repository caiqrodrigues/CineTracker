import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r417.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v417.js'),'utf8'),readFile(resolve(dist,'app-v417.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r418-home-foryou-profile-f1.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r418 forbidden '+bad);
for(const need of ['window.__ctR418Marker','data-ct418-swap','cinetracker_sport_stats_v418','cinetracker_f1_episode_watch_set_v418','data-ct311-f1-watch','ct418HomeEntering'])if(!runtime.includes(need))throw new Error('r418 runtime missing '+need);
js=js.replace("window.__ctWebBuild='1.0.208';window.__ctOfficialVersion='1.0.208';","window.__ctWebBuild='1.0.209';window.__ctOfficialVersion='1.0.209';")
     .replace("const REVISION='r417-official-1.0.208';","const REVISION='r418-official-1.0.209';")
     .replace("const version='1.0.208',revision='r417-official-1.0.208';","const version='1.0.209',revision='r418-official-1.0.209';")
     .replace('boot();',runtime+'\nboot();');
html=html.replaceAll('app-v417.js','app-v418.js').replaceAll('app-v417.css','app-v418.css').replaceAll('v1.0.208','v1.0.209').replaceAll('r417-official-1.0.208','r418-official-1.0.209');
sw=sw.replaceAll('ct-web-1.0.208-r417','ct-web-1.0.209-r418').replaceAll('app-v417.js','app-v418.js').replaceAll('app-v417.css','app-v418.css');
css+='\n/* CineTracker Web 1.0.209 r418 */\nhtml[data-ct418-home-entering="series"] [data-home-view="series"]{visibility:hidden!important;pointer-events:none!important}\n.ct418-actions{display:grid!important;gap:5px!important;width:100%!important;max-width:100%!important;overflow:visible!important}\n.ct418-actions[data-ct418-cols="3"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n.ct418-actions[data-ct418-cols="2"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n.ct418-swap{display:flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:static!important;min-width:0!important;width:100%!important;height:29px!important;margin:0!important;padding:3px 5px!important;font-size:10px!important;white-space:nowrap!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.209',revision:'r418-official-1.0.209',base:'r417+r418-hard-fix',scope:'home-preboot-entry+foryou-semantic-swap+profile-sports-v418+f1-hub-series-865',home:'series is masked before boot and only revealed already anchored at Assistir a seguir',discover_foryou:'Trocar is restored from visible action rows without depending on legacy slot wrappers',profile:'approved visual is untouched; sports time/events use cinetracker_sport_stats_v418',f1:'F1 Hub session buttons persist as media_id 865 series episodes and mirror session state',backend:'sports-stats-v418+f1-episode-watch-v418',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v418.js'),js),writeFile(resolve(dist,'app-v418.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v417.js'),{force:true}),rm(resolve(dist,'app-v417.css'),{force:true})]);
console.log('WEB_R418_READY');
