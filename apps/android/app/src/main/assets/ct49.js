(() => {
'use strict';
if(window.__ct49Loaded)return;window.__ct49Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let knownSync=false,lastKnownSync=0,knownIds=new Set(),seriesMap=new Map(),activeSeriesId=0;

const css=document.createElement('style');
css.id='ct49-style';
css.textContent=`body.ct49-profile .ct33-chart{display:block!important}.ct49-build-footer{margin-top:12px;text-align:center;color:#6f7d88;font-size:10px}`;
document.head.appendChild(css);

function pt(n){return Number(n||0).toLocaleString('pt-BR')}
function remainingText(row){
  if(!row)return'';
  const total=Number(row.total_episodes||0),watched=Number(row.watched_episodes||0);
  if(!total)return'';
  const left=Math.max(0,total-watched);
  return `Faltam ${pt(left)} ${left===1?'episódio':'episódios'}`;
}
function appendRemaining(el,row){
  if(!el||!row)return;
  const extra=remainingText(row);if(!extra)return;
  const base=(el.textContent||'').replace(/\s*[·•-]\s*Faltam\s+[\d.]+\s+episódios?/i,'').trim();
  if(!base.includes(extra))el.textContent=`${base} · ${extra}`;
}
function fixSeriesButtons(){
  $$('.ct48-next,.ct48-card-check').forEach(b=>{if(!b.disabled&&!/^Em dia$/i.test((b.textContent||'').trim())&&!/Tentar novamente/i.test(b.textContent||''))b.textContent='✓ Assistido'});
  $$('button').forEach(b=>{if(/Próximo episódio/i.test(b.textContent||''))b.textContent=(b.textContent||'').replace(/✓?\s*Próximo episódio/gi,'✓ Assistido')});
}
function fixProfileChart(){
  const v=typeof view==='undefined'?'':view;
  document.body.classList.toggle('ct49-profile',v==='profile');
  if(v!=='profile')return;
  $$('.ct33-chart').forEach(el=>el.style.setProperty('display','block','important'));
}
function fixSettingsBuild(){
  if(typeof view==='undefined'||view!=='settings')return;
  const root=$('#app');if(!root)return;
  const leaves=$$('*',root).filter(el=>el.children.length===0);
  for(const el of leaves){
    const t=(el.textContent||'').trim();
    if(/^CineTracker Android\s*[•·-]?\s*build\s+0\.0\.\d+$/i.test(t))el.style.setProperty('display','none','important');
  }
  if(!$('#ct49-build-footer',root)){
    const footer=document.createElement('div');footer.id='ct49-build-footer';footer.className='ct49-build-footer';footer.textContent='CineTracker Android • build 0.0.59';
    ($('.content',root)||root).appendChild(footer);
  }
}
async function syncKnown(){
  if(knownSync||Date.now()-lastKnownSync<1800)return;
  knownSync=true;lastKnownSync=Date.now();
  try{
    const [rows,overrides]=await Promise.all([
      sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]),
      sbApi('media_overrides?select=state,media:media(tmdb_id,media_type)&state=in.(AlreadySeen,Completed,InProgress,AddedToWatchlist,WatchLater)&limit=2000').catch(()=>[])
    ]);
    const ids=new Set(),map=new Map();
    for(const r of rows||[]){const id=Number(r.tmdb_id||0);if(!id)continue;ids.add(`tmdb-tv-${id}`);map.set(id,r)}
    for(const r of overrides||[]){const m=r.media;if(m?.tmdb_id&&m?.media_type)ids.add(`tmdb-${m.media_type}-${Number(m.tmdb_id)}`)}
    knownIds=ids;seriesMap=map;
  }finally{knownSync=false}
}
function filterDiscover(){
  if(typeof view==='undefined'||view!=='discover')return;
  $$('#tmdb-results .card[data-media-id]').forEach(card=>{
    const blocked=knownIds.has(card.dataset.mediaId||'');
    if(blocked)card.style.setProperty('display','none','important');else card.style.removeProperty('display');
  });
}
function annotateSeries(){
  $$('.ct48-home-card[data-id]').forEach(card=>appendRemaining($('.ct48-home-meta',card),seriesMap.get(Number(card.dataset.id||0))));
  $$('.ct47-card[data-type="tv"][data-id],.ct47-card:not([data-type="movie"])[data-id]').forEach(card=>appendRemaining($('.ct47-meta',card),seriesMap.get(Number(card.dataset.id||0))));
  if(activeSeriesId&&$('.ct47-hero'))appendRemaining($('.ct47-hero .ct47-meta'),seriesMap.get(activeSeriesId));
}
async function applyAsync(){await syncKnown();annotateSeries();filterDiscover();fixSeriesButtons()}
function apply(){fixProfileChart();fixSettingsBuild();fixSeriesButtons();void applyAsync()}

document.addEventListener('click',e=>{const card=e.target.closest('.ct47-card[data-id]');if(card&&card.dataset.type!=='movie')activeSeriesId=Number(card.dataset.id||0)},true);
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,80);setTimeout(apply,500);setTimeout(apply,1400);
})();
