import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r268-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v268.js'),'utf8'),
  readFile(resolve(dist,'app-v268.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r269 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r269 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};

js=replaceOnce(js,"window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';","window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';",'web version');
js=replaceOnce(js,"const REVISION='r268-official-1.0.59';","const REVISION='r269-official-1.0.60';",'revision');

const runtime=String.raw`
/* CT269_HOME_RECOVERY_START */
window.__ctR269='video-history-r3+series-watch-inline';
window.__ctR269Home='canonical-r3-history+orphan-watch-reparent';
window.__ctR269Frozen='discover+detail+sports+android-r268-preserved';
const ct269State={history:null,historyAt:0,historyToken:0,queued:false};
function ct269Norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function ct269Section(view,title){return [...(view?.querySelectorAll?.('.home-section')||[])].find(sec=>ct269Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent)===title)||null}
function ct269HistoryRows(pack){return {episodes:Array.isArray(pack?.history_episodes)?pack.history_episodes:[],movies:Array.isArray(pack?.history_movies)?pack.history_movies:[]}}
function ct269HistoryEpisodeHtml(x){const s=Number(x?.season_number||0),e=Number(x?.episode_number||0),row={...x,media_type:'tv',tmdb_id:x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id};return typeof mediaRow==='function'?mediaRow(row,`S${String(s).padStart(2,'0')} E${String(e).padStart(2,'0')}`):''}
function ct269HistoryMovieHtml(x){const row={...x,media_type:'movie'};if(typeof movieRow255==='function')return movieRow255(row);return typeof mediaRow==='function'?mediaRow(row,x?.watched_at?new Date(x.watched_at).toLocaleString('pt-BR'):'Visto'):''}
function ct269PaintHistory(){
 const root=document.querySelector('[data-home]'),hist=ct269State.history;if(!root||!hist)return false;
 const sv=root.querySelector('[data-home-view="series"]'),mv=root.querySelector('[data-home-view="movies"]');
 const es=ct269Section(sv,'historico recente'),ms=ct269Section(mv,'filmes vistos');let changed=false;
 if(es){const stack=es.querySelector('.stack'),count=es.querySelector('.panel-head small');if(stack){const html=hist.episodes.slice(0,30).map(ct269HistoryEpisodeHtml).join('')||'<div class="empty">Nenhum episódio recente.</div>';if(stack.innerHTML!==html){stack.innerHTML=html;changed=true}}if(count)count.textContent=String(hist.episodes.length);es.hidden=false;es.classList.remove('hidden');delete es.dataset.ct268HistoryPending;es.dataset.ct269HistorySource='r3'}
 if(ms){const stack=ms.querySelector('.stack'),count=ms.querySelector('.panel-head small');if(stack){const html=hist.movies.slice(0,100).map(ct269HistoryMovieHtml).join('')||'<div class="empty">Nenhum filme recente.</div>';if(stack.innerHTML!==html){stack.innerHTML=html;changed=true}}if(count)count.textContent=String(hist.movies.length);ms.hidden=false;ms.classList.remove('hidden');delete ms.dataset.ct268HistoryPending;ms.dataset.ct269HistorySource='r3'}
 return changed;
}
function ct269ActionCandidate(el){
 if(!el||el.matches?.('.media-row'))return null;
 if(el.matches?.('[data-ct266-watch],.ct266-watch-action,[aria-label*="assistido" i],[title*="assistido" i]'))return el;
 const known=el.querySelector?.('[data-ct266-watch],.ct266-watch-action,[aria-label*="assistido" i],[title*="assistido" i]');if(known)return known;
 const text=String(el.textContent||'').replace(/\s+/g,'').trim();if(text==='✓'||text==='✔')return el.matches?.('button,span,[role="button"]')?el:(el.querySelector?.('button,span,[role="button"]')||el);
 return null;
}
function ct269InlineAction(row,action,wrapper=null){
 if(!row||!action)return false;
 const current=row.querySelector(':scope > [data-ct266-watch],:scope > .ct266-watch-action,:scope > .ct269-inline-watch-action');
 if(current&&current!==action){if(wrapper?.isConnected)wrapper.remove();else if(action.isConnected)action.remove();row.classList.add('ct269-inline-watch-host');current.classList.add('ct269-inline-watch-action');return true}
 if(action.parentElement!==row)row.appendChild(action);
 action.classList.add('ct269-inline-watch-action');row.classList.add('ct269-inline-watch-host');
 if(wrapper&&wrapper!==action&&wrapper.isConnected&&wrapper.children.length===0&&String(wrapper.textContent||'').trim()==='')wrapper.remove();
 return true;
}
function ct269RepairSeriesWatch(){
 const root=document.querySelector('[data-home]'),view=root?.querySelector('[data-home-view="series"]');if(!view)return false;let changed=false;
 for(const sec of view.querySelectorAll('.home-section')){
  const title=ct269Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent);if(!/assistir a seguir|juntando poeira/.test(title))continue;
  const stack=sec.querySelector('.stack');if(!stack)continue;
  for(const row of stack.querySelectorAll('.media-row')){const nested=row.querySelector('[data-ct266-watch],.ct266-watch-action');if(nested&&nested.parentElement!==row)changed=ct269InlineAction(row,nested,nested.parentElement)||changed;else if(nested){row.classList.add('ct269-inline-watch-host');nested.classList.add('ct269-inline-watch-action')}}
  for(const child of [...stack.children]){
   if(child.matches?.('.media-row'))continue;const action=ct269ActionCandidate(child);if(!action)continue;
   let row=child.previousElementSibling;while(row&&!row.matches?.('.media-row'))row=row.previousElementSibling;if(row)changed=ct269InlineAction(row,action,child)||changed;
  }
 }
 return changed;
}
function ct269RepairHome(){const a=ct269RepairSeriesWatch(),b=ct269PaintHistory();return a||b}
function ct269Schedule(){if(ct269State.queued)return;ct269State.queued=true;queueMicrotask(()=>{ct269State.queued=false;ct269RepairHome()})}
async function ct269LoadHistory(force=false){
 if(String(typeof route==='function'?route():'')!=='home')return null;
 if(!force&&ct269State.history&&Date.now()-ct269State.historyAt<30000){ct269PaintHistory();return ct269State.history}
 const token=++ct269State.historyToken;try{
  const p=await rpc('cinetracker_home_live_v0997_r3',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});if(token!==ct269State.historyToken||String(typeof route==='function'?route():'')!=='home')return null;
  ct269State.history=ct269HistoryRows(p||{});ct269State.historyAt=Date.now();window.__ctHomeHistoryPending=false;
  if(homeCache&&typeof homeCache==='object'){homeCache.history_episodes=ct269State.history.episodes;homeCache.history_movies=ct269State.history.movies;homeCache.__ctHistoryAuthoritative=true}
  ct269PaintHistory();ct269RepairSeriesWatch();return ct269State.history;
 }catch(_){return null}
}
const ct269PaintHomeBase=typeof paintHome==='function'?paintHome:null;
if(ct269PaintHomeBase)paintHome=function(...args){const out=ct269PaintHomeBase.apply(this,args);ct269Schedule();return out};
const ct269RenderHomeBase=typeof renderHome==='function'?renderHome:null;
if(ct269RenderHomeBase)renderHome=async function(...args){const out=await ct269RenderHomeBase.apply(this,args);if(String(typeof route==='function'?route():'')==='home'){ct269RepairSeriesWatch();void ct269LoadHistory(true)}return out};
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(()=>{ct269RepairHome();if(!ct269State.history)void ct269LoadHistory(false)},0)},true);
new MutationObserver(ct269Schedule).observe(document.documentElement,{childList:true,subtree:true});
window.__ctR269Test={paintHistory:ct269PaintHistory,repairSeriesWatch:ct269RepairSeriesWatch,repairHome:ct269RepairHome,loadHistory:ct269LoadHistory,state:ct269State};
/* CT269_HOME_RECOVERY_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','boot insertion');

css+=`\n/* CineTracker Web 1.0.60 r269 — video ground truth: series check stays inside row; history comes from canonical r3. */
[data-home-view="series"] .media-row.ct269-inline-watch-host{position:relative!important;padding-right:52px!important;box-sizing:border-box!important}
[data-home-view="series"] .media-row.ct269-inline-watch-host>.ct269-inline-watch-action,
[data-home-view="series"] .media-row.ct269-inline-watch-host>.ct266-watch-action{position:absolute!important;right:12px!important;left:auto!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;margin:0!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;padding:0!important;display:grid!important;place-items:center!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#bfeaff!important;z-index:5!important;line-height:1!important}
[data-home-view="series"] .media-row.ct269-inline-watch-host>.ct269-inline-watch-action:hover,
[data-home-view="series"] .media-row.ct269-inline-watch-host>.ct269-inline-watch-action:focus-visible{background:transparent!important;color:#fff!important;outline:1px solid #3d7795!important;outline-offset:2px!important}
`;
html=html.replaceAll('app-v268.js','app-v269.js').replaceAll('app-v268.css','app-v269.css');
sw=sw.replaceAll('ct-web-1.0.59-r268','ct-web-1.0.60-r269').replaceAll('app-v268.js','app-v269.js').replaceAll('app-v268.css','app-v269.css');
const release={version:'1.0.60',revision:'r269-official-1.0.60',base:'r268-production',home_history_source:'cinetracker_home_live_v0997_r3',home_history_restored:true,home_series_watch_inline:true,discover:'r268-preserved',detail:'r268-preserved',sports:'r268-preserved',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v269.js'),js,'utf8'),writeFile(resolve(dist,'app-v269.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v268.js'),{force:true}),rm(resolve(dist,'app-v268.css'),{force:true})]);
console.log('WEB_R269_READY home-history=r3-restored series-watch=inside-row-right frozen=r268');
