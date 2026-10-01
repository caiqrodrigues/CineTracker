import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r416.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v416.js'),'utf8'),readFile(resolve(dist,'app-v416.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r417-home-foryou-profile-f1.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r417 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r417 forbidden runtime pattern: '+bad);
for(const need of ['window.__ctR417Marker','data-ct417-swap','cinetracker_sport_stats_v1','cinetracker_mark_watch_v0994','p_media_id:F1_MEDIA_ID','ct417HomeEntering'])if(!runtime.includes(need))throw new Error('r417 runtime missing '+need);
js=once(js,"window.__ctWebBuild='1.0.207';window.__ctOfficialVersion='1.0.207';","window.__ctWebBuild='1.0.208';window.__ctOfficialVersion='1.0.208';",'version');
js=once(js,"const REVISION='r416-official-1.0.207';","const REVISION='r417-official-1.0.208';",'revision');
js=once(js,"const version='1.0.207',revision='r416-official-1.0.207';","const version='1.0.208',revision='r417-official-1.0.208';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r417 runtime');
html=html.replaceAll('app-v416.js','app-v417.js').replaceAll('app-v416.css','app-v417.css').replaceAll('v1.0.207','v1.0.208').replaceAll('r416-official-1.0.207','r417-official-1.0.208');
sw=sw.replaceAll('ct-web-1.0.207-r416','ct-web-1.0.208-r417').replaceAll('app-v416.js','app-v417.js').replaceAll('app-v416.css','app-v417.css');
css+='\n/* CineTracker Web 1.0.208 r417 — stable series entry + visible swap owner. */\nhtml[data-ct417-home-entering="series"] [data-home-view="series"]{visibility:hidden!important;pointer-events:none!important}\n.ct417-actions{display:grid!important;gap:5px!important;width:100%!important;max-width:100%!important;overflow:visible!important}\n.ct417-actions[data-ct417-cols="3"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n.ct417-actions[data-ct417-cols="2"]{grid-template-columns:repeat(2,minmax(0,1fr))!important}\n.ct417-swap{display:flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:static!important;inset:auto!important;min-width:0!important;width:100%!important;max-width:100%!important;min-height:29px!important;height:29px!important;margin:0!important;padding:3px 5px!important;font-size:10px!important;white-space:nowrap!important}\n.ct417-f1-watched{border-color:#2f7a68!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.208',revision:'r417-official-1.0.208',base:'r416+r417-home-foryou-profile-f1',scope:'home-series-stable-entry+discover-visible-swap+profile-sports-truth+f1-series-authority',home:'series canvas stays hidden until Assistir a seguir geometry and total series view height are stable; final anchor is re-applied finitely after reveal',discover_foryou:'visible action rows are repaired directly and every populated daily/watch/fresh slot receives a functional Trocar action even after late legacy paints',profile:'approved layout unchanged; cinetracker_sport_stats_v1 repopulates Tempo assistido and Eventos assistidos after the canonical profile paint',f1:'Formula 1 media_id 865 remains the single series authority; episode marking is immediate and persists only through cinetracker_mark_watch_v0994 before optional F1-session mirroring',backend:'existing-r255-sport-stats+r0994-watch+r314-f1-session',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v417.js'),js),writeFile(resolve(dist,'app-v417.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v416.js'),{force:true}),rm(resolve(dist,'app-v416.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v417.js'),'utf8');
for(const need of ["window.__ctR417Marker='final-home-series-anchor+visible-7-swap+profile-sports-rpc+f1-media-865-series'","window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'",'cinetracker_sport_stats_v1','data-ct417-swap','p_media_id:F1_MEDIA_ID'])if(!built.includes(need))throw new Error('r417 built missing '+need);
console.log('WEB_R417_READY Home series stable + Pra Voce Trocar + Profile sports metrics + F1 series authority');
