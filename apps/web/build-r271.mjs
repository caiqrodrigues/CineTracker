import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r270-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v270.js'),'utf8'),
  readFile(resolve(dist,'app-v270.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r271 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r271 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};

js=replaceOnce(js,"window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';","window.__ctWebBuild='1.0.62';window.__ctOfficialVersion='1.0.62';",'web version');
js=replaceOnce(js,"const REVISION='r270-official-1.0.61';","const REVISION='r271-official-1.0.62';",'revision');

/* r270 observed every childList mutation on the entire document and repaired Home from the
   observer callback. History repainting can itself replace child nodes, creating a repaint loop
   that starves clicks/navigation. r271 makes Home reconciliation finite and idempotent. */
js=replaceOnce(js,"const ct270State={queued:false};","const ct270State={queued:false,historySig:''};",'r270 state');
js=replaceOnce(js,
`function ct270AdoptCanonicalHistory(pack=window.homeCache){
 if(!pack||pack.__ctHistoryAuthoritative!==true||typeof ct269HistoryRows!=='function')return false;
 const hist=ct269HistoryRows(pack);
 ct269State.history=hist;ct269State.historyAt=Date.now();window.__ctHomeHistoryPending=false;
 const painted=typeof ct269PaintHistory==='function'?ct269PaintHistory():false;
 ct270ShowHistoryShell();return painted||true;
}`,
`function ct271HistorySig(hist){
 const pick=x=>[x?.id||null,x?.media_id||null,x?.tmdb_id||null,x?.watched_at||'',x?.season_number||0,x?.episode_number||0,x?.plays||1];
 return JSON.stringify([(hist?.episodes||[]).map(pick),(hist?.movies||[]).map(pick)]);
}
function ct270AdoptCanonicalHistory(pack=window.homeCache){
 if(!pack||pack.__ctHistoryAuthoritative!==true||typeof ct269HistoryRows!=='function')return false;
 const hist=ct269HistoryRows(pack),sig=ct271HistorySig(hist);
 window.__ctHomeHistoryPending=false;
 if(ct270State.historySig===sig&&ct269State?.history){ct270ShowHistoryShell();return false}
 ct270State.historySig=sig;ct269State.history=hist;ct269State.historyAt=Date.now();
 const painted=typeof ct269PaintHistory==='function'?ct269PaintHistory():false;
 ct270ShowHistoryShell();return painted;
}`,'canonical history idempotence');
js=replaceOnce(js,"new MutationObserver(ct270Schedule).observe(document.documentElement,{childList:true,subtree:true});","/* r271: persistent Home MutationObserver removed; paint/render/tab finite repairs are sufficient */",'r270 persistent observer');

const runtime=String.raw`
/* CT271_HOME_RESPONSIVENESS_START */
window.__ctR271='home-no-persistent-observer+history-idempotent';
window.__ctR271Home='r270-layout-preserved+finite-reconciliation';
window.__ctR271Frozen='discover+detail+sports+android-r270-preserved';
window.__ctR271Test={observerRetired:true,repairHome:ct270RepairHome,historySig:ct271HistorySig,state:ct270State};
/* CT271_HOME_RESPONSIVENESS_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','boot insertion');

css+='\n/* CineTracker Web 1.0.62 r271 — r270 Home layout preserved; runtime reconciliation is finite. */\n';
html=html.replaceAll('app-v270.js','app-v271.js').replaceAll('app-v270.css','app-v271.css');
sw=sw.replaceAll('ct-web-1.0.61-r270','ct-web-1.0.62-r271').replaceAll('app-v270.js','app-v271.js').replaceAll('app-v270.css','app-v271.css');
const release={version:'1.0.62',revision:'r271-official-1.0.62',base:'r270-production',home_history_source:'cinetracker_profile_home_payload_v0997_r5',home_history_restored:true,home_history_first:true,home_series_watch_direct_child:true,home_series_watch_inline_right:true,home_persistent_observer:false,home_history_idempotent:true,discover:'r270-preserved',detail:'r270-preserved',sports:'r270-preserved',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v271.js'),js,'utf8'),writeFile(resolve(dist,'app-v271.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v270.js'),{force:true}),rm(resolve(dist,'app-v270.css'),{force:true})]);
console.log('WEB_R271_READY home-responsive no-persistent-observer history-idempotent layout=r270-preserved');
