/* CineTracker 1.0.10 — visible regressions captured in user video.
 * Fixes: Pra Voce stall, F1 authenticated/robust loader, History rewatch controls,
 * mobile 3-up media cards and single-column sports event cards.
 */
(()=>{
'use strict';
if(window.__ctR216RealRegressions)return;
window.__ctR216RealRegressions='foryou-f1-rewatch-history-mobile-layout';
window.__ctV110Acceptance='video-1001745761';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const fold=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* History rewatch authority. r214 covers details/episode rows but not every rendered
   History media row. This pass creates the missing controls wherever a History section exists. */
let rwCounts=new Map(),rwAt=0,rwTask=null;
const rwKey=(kind,tmdb,s=0,e=0)=>kind==='episode'?`episode:${tmdb}:${s}:${e}`:`movie:${tmdb}`;
async function rwLoad(force=false){
  if(!force&&Date.now()-rwAt<10000)return rwCounts;
  if(rwTask)return rwTask;
  rwTask=(async()=>{try{const rows=await rpc('cinetracker_rewatch_counts_v104',{}),m=new Map();for(const x of Array.isArray(rows)?rows:[])m.set(rwKey(String(x.item_type),n(x.tmdb_id),n(x.season_number),n(x.episode_number)),Math.max(1,n(x.plays)||1));rwCounts=m;rwAt=Date.now()}catch{}return rwCounts})().finally(()=>rwTask=null);
  return rwTask;
}
function rwLabel(b,p){b.dataset.plays=String(p);b.textContent=p>1?`↻ Reassistir ${p}x`:'↻ Reassistir'}
function historySections(){return qa('section,.panel,.home-section').filter(sec=>{const t=fold(q('h1,h2,h3,.panel-head',sec)?.textContent||'');return t.includes('historico')||t.includes('filmes vistos')||sec.matches?.('[data-history]')});}
function parseEpisode(row){const text=String(q('small',row)?.textContent||row.textContent||'');const m=text.match(/S\s*0*(\d+)\s*(?:E|EP)\s*0*(\d+)/i);return m?[n(m[1]),n(m[2])]:[0,0]}
function addHistoryButton(row){
  if(!row||q('[data-ct216-rewatch]',row)||q('[data-ct214-rewatch]',row))return;
  const raw=String(row.dataset?.media||''),[type,id]=raw.split(':'),tmdb=n(id);if(!(tmdb>0))return;
  const kind=type==='movie'?'movie':'episode';let s=0,e=0;if(kind==='episode'){[s,e]=parseEpisode(row);if(!(s>0&&e>0))return}
  const b=document.createElement('button');b.type='button';b.className='btn btn-secondary ct216-rewatch';b.dataset.ct216Rewatch=kind;b.dataset.tmdb=String(tmdb);if(s)b.dataset.season=String(s);if(e)b.dataset.episode=String(e);rwLabel(b,rwCounts.get(rwKey(kind,tmdb,s,e))||1);row.appendChild(b);
}
async function syncHistoryButtons(){await rwLoad(false);for(const sec of historySections())for(const row of qa('.media-row[data-media],[data-media].history-row',sec))addHistoryButton(row)}
async function doRewatch(b){
  if(!b||b.dataset.busy==='1')return;const kind=b.dataset.ct216Rewatch,tmdb=n(b.dataset.tmdb),s=n(b.dataset.season),e=n(b.dataset.episode);if(!kind||!(tmdb>0)||(kind==='episode'&&!(s>0&&e>0)))return;
  const before=Math.max(1,n(b.dataset.plays)||rwCounts.get(rwKey(kind,tmdb,s,e))||1);b.dataset.busy='1';b.disabled=true;b.textContent='Salvando...';
  try{const m=await ensureMedia(kind==='episode'?'tv':'movie',tmdb);const payload={p_media_id:Number(m.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:q('b,strong,.title',b.closest('.media-row'))?.textContent||m.title||null,p_runtime_minutes:Number(m.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()};const r=await rpc('cinetracker_mark_watch_v0994',payload);await rwLoad(true);const plays=Math.max(before+1,n(r?.plays)||rwCounts.get(rwKey(kind,tmdb,s,e))||before+1);rwCounts.set(rwKey(kind,tmdb,s,e),plays);rwLabel(b,plays);window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'rewatch-r216',kind,tmdb,season:s,episode:e,plays}}));try{toast(`Registrado · ${plays}x`)}catch{}}
  catch(err){rwLabel(b,before);try{toast(err?.message||String(err))}catch{}}
  finally{b.disabled=false;delete b.dataset.busy}
}
document.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-ct216-rewatch]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();void doRewatch(b)},true);

/* F1 uses the canonical edge() helper so apikey/session headers are always present.
   It also keeps the last successful payload locally, avoiding a blank Hub on a transient failure. */
const F1_CACHE='ct:v110:f1:';
function f1Read(season){try{const x=JSON.parse(localStorage.getItem(F1_CACHE+season)||'null');if(x?.data&&Date.now()-n(x.at)<24*60*60*1000)return x.data}catch{}return null}
function f1Write(season,data){try{localStorage.setItem(F1_CACHE+season,JSON.stringify({at:Date.now(),data}))}catch{}return data}
window.__ctV110GetF1=async function(force=false){
  const season=new Date().getFullYear();if(!force&&typeof f1Data!=='undefined'&&f1Data&&Date.now()-n(f1At)<300000)return f1Data;
  const cached=f1Read(season);try{const d=await edge('cinetracker-f1-v1',{season},30000);if(!d||!Array.isArray(d.races))throw new Error('F1 sem calendário');f1Write(season,d);return d}catch(err){if(cached)return {...cached,stale:true};throw err}
};

/* The current r211 recommendation-state request can hang before the actual Pra Voce
   pipeline starts. A DOM watchdog never replaces recommendations with unrelated content:
   it simply retries the same tab after the stuck request has been abandoned by navigation. */
let forYouWatch=0;
function isForYouSelected(){const root=q('[data-discover]');if(!root)return false;const active=qa('button,.chip',root).find(x=>x.classList.contains('active')||x.getAttribute('aria-selected')==='true');return !!active&&fold(active.textContent).includes('pra voce')}
function armForYouWatch(){clearTimeout(forYouWatch);if(!isForYouSelected())return;const started=Date.now();forYouWatch=setTimeout(()=>{const root=q('[data-discover]');if(!root||!isForYouSelected())return;const txt=fold(root.textContent);if(!txt.includes('carregando titulos'))return;window.__ctV110ForYouRecoveredAt=Date.now();try{discoverCache?.delete?.('foryou:'+localDay())}catch{};const btn=qa('button,.chip',root).find(x=>fold(x.textContent).includes('pra voce'));if(btn){btn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))}else try{void render()}catch{}},6500);window.__ctV110ForYouWatchStarted=started}

/* Mobile layout from the recorded device: exactly three complete media cards per carousel,
   and sports events stacked full-width instead of a clipped second column. */
const style=document.createElement('style');style.id='ct216-v110-layout';style.textContent=`
.ct216-rewatch{margin-left:auto!important;flex:0 0 auto!important;min-height:32px!important;padding:6px 9px!important;white-space:nowrap!important}
@media(max-width:700px){
  .ct171-top-row,.row{gap:8px!important;scroll-padding-inline:0!important}
  .ct171-top-row>.card,.ct171-top-row>[data-media],.row>.card{flex:0 0 calc((100% - 16px)/3)!important;width:calc((100% - 16px)/3)!important;min-width:0!important;max-width:none!important}
  [data-page="sports"] .event-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important;overflow:visible!important}
  [data-page="sports"] .event-grid>.event,[data-page="sports"] .event-grid>[class*="event"]{width:100%!important;max-width:100%!important;min-width:0!important}
  [data-page="sports"]{overflow-x:hidden!important}
}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

let raf=0;function sync(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;void syncHistoryButtons();armForYouWatch()})}
new MutationObserver(sync).observe(document.documentElement,{subtree:true,childList:true});window.addEventListener('cinetracker:data-changed',sync);setTimeout(sync,0);setTimeout(sync,700);setTimeout(sync,1800);
})();