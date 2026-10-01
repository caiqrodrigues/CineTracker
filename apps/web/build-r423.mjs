import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r422.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v422.js'),'utf8'),readFile(resolve(dist,'app-v422.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r423-f1-hard-sync.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r423 forbidden '+bad);
for(const need of ['window.__ctR423Marker','cinetracker_f1_watch_sync_v423','cinetracker_f1_map_replace_v423','markSeriesF1423','toggleHub423','sportRpc423'])if(!runtime.includes(need))throw new Error('r423 runtime missing '+need);
function patchOnce(from,to,label){const n=js.split(from).length-1;if(n!==1)throw new Error(`r423 patch ${label} expected 1, got ${n}`);js=js.replace(from,to)}
function removeOwners(from,label){const n=js.split(from).length-1;if(n<1)throw new Error(`r423 owner ${label} missing`);js=js.replaceAll(from,`/* r423 removed obsolete ${label} F1 owner */`)}

/* Keep the original r284/r285 lexical handlers. Older runtimes were reassigning those identifiers after their capture listeners were created. */
removeOwners("try{if(typeof ct285Mark==='function')ct285Mark=markF1}catch{}try{if(typeof ct284Mark==='function')ct284Mark=markF1}catch{}",'r416');
removeOwners("try{ct285Mark=markF1417}catch{}try{ct284Mark=markF1417}catch{}",'r417');
removeOwners("try{ct285Mark=markSeriesF1422}catch{}try{ct284Mark=markSeriesF1422}catch{}",'r422');

/* Series: the real closure-owned handlers delegate only Formula 1 to r423; Super Bowl/other behavior stays unchanged. */
patchOnce(
 "async function ct285Mark(btn){\n if(btn.disabled)return;",
 "async function ct285Mark(btn){\n if(Number(btn?.dataset?.mediaId)===865&&window.__ctR423?.markSeriesF1)return window.__ctR423.markSeriesF1(btn);\n if(btn.disabled)return;",
 'r285 lexical series delegate'
);
patchOnce(
 "async function ct284Mark(btn){if(btn.disabled)return;",
 "async function ct284Mark(btn){if(Number(btn?.dataset?.mediaId)===865&&window.__ctR423?.markSeriesF1)return window.__ctR423.markSeriesF1(btn);if(btn.disabled)return;",
 'r284 lexical series delegate'
);

/* Sports: enrich the existing button with event context and keep r255 optimistic state while swapping only the F1 persistence call. */
patchOnce(
 `data-provider="\${esc255(e?.provider||'')}" data-watched="\${watched?'1':'0'}"`,
 `data-provider="\${esc255(e?.provider||'')}" data-sport-slug="\${esc255(e?.sport_slug||'')}" data-sport-title="\${esc255(e?.title||'')}" data-sport-starts-at="\${esc255(e?.starts_at||'')}" data-sport-season="\${esc255(e?.season||'')}" data-sport-round="\${esc255(e?.round||'')}" data-watched="\${watched?'1':'0'}"`,
 'sports event context'
);
patchOnce(
 "await sportWatchRpc255({p_provider:provider,p_provider_event_id:id,p_watched:next,p_watched_at:at,p_duration_minutes:null});",
 "const args423={p_provider:provider,p_provider_event_id:id,p_watched:next,p_watched_at:at,p_duration_minutes:null};if(window.__ctR423?.ownsSport?.(btn))await window.__ctR423.sportRpc(btn,args423);else await sportWatchRpc255(args423);",
 'sports F1 writer'
);

/* F1 Hub: bypass every legacy owner object and call r423 directly from the real capture-path function. */
patchOnce(
 "const watch=target.closest('[data-ct311-f1-watch]');if(watch){void window.__ctR421?.toggleF1?.(watch);return true}",
 "const watch=target.closest('[data-ct311-f1-watch]');if(watch){void window.__ctR423?.toggleF1Hub?.(watch);return true}",
 'F1 Hub direct click'
);
patchOnce(
 "queueMicrotask(()=>{try{window.__ctR421?.scheduleF1Sync?.()}catch{}});",
 "queueMicrotask(()=>{try{window.__ctR423?.scheduleF1Sync?.()}catch{}});",
 'F1 Hub direct paint sync'
);

js=js.replace("window.__ctWebBuild='1.0.213';window.__ctOfficialVersion='1.0.213';","window.__ctWebBuild='1.0.214';window.__ctOfficialVersion='1.0.214';")
     .replace("const REVISION='r422-official-1.0.213';","const REVISION='r423-official-1.0.214';")
     .replace("const version='1.0.213',revision='r422-official-1.0.213';","const version='1.0.214',revision='r423-official-1.0.214';");
js += `\n${runtime}\n`;
html=html.replaceAll('app-v422.js','app-v423.js').replaceAll('app-v422.css','app-v423.css').replaceAll('v1.0.213','v1.0.214').replaceAll('r422-official-1.0.213','r423-official-1.0.214');
sw=sw.replaceAll('ct-web-1.0.213-r422','ct-web-1.0.214-r423').replaceAll('app-v422.js','app-v423.js').replaceAll('app-v422.css','app-v423.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.214',revision:'r423-official-1.0.214',base:'r422+r423-f1-hard-owner',scope:'f1-series+sports+f1hub-hard-three-way-sync',f1:'Formula 1 media_id 865 uses direct lexical delegates on Series, Sports and F1 Hub; one r423 RPC writes both episode and sport state and both time counters; current-season reconciliation repairs pre-r423 divergence',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v423.js'),js),writeFile(resolve(dist,'app-v423.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v422.js'),{force:true}),rm(resolve(dist,'app-v422.css'),{force:true})]);
console.log('WEB_R423_READY');
