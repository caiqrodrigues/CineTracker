(() => {
'use strict';
if(window.__ct58Loaded)return;window.__ct58Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
window.__ctAndroidBuild='0.0.69';
let activeTvId=0;
const style=document.createElement('style');style.id='ct58-style';style.textContent=`
.ct58-ep-side{display:flex;align-items:center;gap:8px}.ct58-ep-score{font-size:10px;font-weight:800;color:#f2c85d;white-space:nowrap}.ct58-retry{display:block;width:100%;border:1px solid #36536a;background:#0c151c;color:#c4d7e6;border-radius:10px;padding:10px;margin-top:8px}.ct58-loading{padding:10px 0;color:#8595a1;font-size:10px}
`;
document.head.appendChild(style);

function rememberId(e){const c=e.target.closest('.ct47-card[data-id],.ct48-home-card[data-id]');if(c&&c.dataset.type!=='movie')activeTvId=Number(c.dataset.id||0)}
document.addEventListener('click',rememberId,true);

async function api(path){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language','pt-BR');
  let last;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
      const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{},signal:ctrl.signal});clearTimeout(timer);
      if(!r.ok)throw new Error(`TMDB ${r.status}`);return await r.json();
    }catch(e){last=e;if(attempt<2)await new Promise(r=>setTimeout(r,350*(attempt+1)))}
  }
  throw last||new Error('Falha ao carregar episódios');
}
async function watchedMap(id){try{const rows=await sbRpc('cinetracker_episode_state',{p_tmdb_id:id})||[];return new Map(rows.map(r=>[`${Number(r.season_number)}:${Number(r.episode_number)}`,!!r.watched]))}catch{return new Map()}}
function inferActiveId(){
  if(activeTvId)return activeTvId;
  try{if(typeof activeSeriesId!=='undefined'&&Number(activeSeriesId))return Number(activeSeriesId)}catch{}
  const c=$('.ct47-card[data-id][data-type="tv"]');return c?Number(c.dataset.id||0):0;
}
async function renderSeason(btn,box){
  const id=inferActiveId(),season=Number(btn.dataset.season||0);if(!id||!season)return;
  box.hidden=false;box.dataset.ct58Loading='1';box.innerHTML='<div class="ct58-loading">Carregando episódios…</div>';
  try{
    const [sd,map]=await Promise.all([api(`/tv/${id}/season/${season}`),watchedMap(id)]);
    const eps=sd.episodes||[];
    box.innerHTML=eps.length?eps.map(ep=>{
      const n=Number(ep.episode_number||0),seen=!!map.get(`${season}:${n}`),score=Number(ep.vote_average||0);
      return `<div class="ct47-ep" data-season="${season}" data-episode="${n}" data-name="${esc(ep.name||'Episódio')}"><div><strong>E${n} · ${esc(ep.name||'Episódio')}</strong><span>${ep.air_date?new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR'):'Sem data'}</span></div><div class="ct58-ep-side">${score?`<span class="ct58-ep-score">★ ${score.toFixed(1)}</span>`:''}<button class="ct47-seen${seen?' on':''}" type="button">${seen?'✓ Assistido':'Assistido'}</button></div></div>`;
    }).join(''):'<div class="ct58-loading">Nenhum episódio encontrado nesta temporada.</div>';
    box.dataset.loaded='1';
  }catch(e){
    box.innerHTML=`<div class="ct58-loading">Não foi possível carregar os episódios.</div><button type="button" class="ct58-retry">Tentar novamente</button>`;
    $('.ct58-retry',box)?.addEventListener('click',ev=>{ev.stopPropagation();void renderSeason(btn,box)});
  }finally{delete box.dataset.ct58Loading}
}
function bindSeasons(){
  $$('.ct47-season-btn[data-season]').forEach(btn=>{
    if(btn.dataset.ct58)return;btn.dataset.ct58='1';
    btn.addEventListener('click',()=>{
      const season=Number(btn.dataset.season||0),box=$(`#ct47-s-${season}`);if(!box)return;
      setTimeout(()=>{if(!box.hidden&&!box.dataset.loaded&&(/Carregando episódios/i.test(box.textContent||'')||!box.textContent.trim()))void renderSeason(btn,box)},700);
    },false);
  });
}
function fixBuild(){try{if(typeof view!=='undefined'&&view==='settings'){const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.69'}}catch{}}
function apply(){bindSeasons();fixBuild()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,60);setTimeout(apply,350);setTimeout(apply,1100);
})();
