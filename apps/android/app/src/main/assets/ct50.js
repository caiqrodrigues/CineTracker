(() => {
'use strict';
if(window.__ct50Loaded)return;window.__ct50Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const img=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
let syncing=false,lastSync=0,blockedIds=new Set(),active={id:0,type:'tv'},detailKey='',episodeKeys=new Set();
const tmdbCache=new Map();

const css=document.createElement('style');css.id='ct50-style';css.textContent=`
/* One official media language across the Android app. */
.ct48-where{display:none!important}
.ct50-detail .ct47-hero{grid-template-columns:128px minmax(0,1fr)!important;gap:16px!important;align-items:start}.ct50-detail .ct47-hero-poster{border-radius:18px!important;box-shadow:0 12px 34px #0008}.ct50-detail .ct47-hero h1{font-size:27px!important;margin:1px 0 8px!important}.ct50-detail .ct47-meta{font-size:11px!important;color:#8d97a1!important;line-height:1.45!important}.ct50-ratingbar{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:15px 0 11px}.ct50-score{display:inline-flex;align-items:center;gap:6px;border:1px solid #273846;background:#0d151b;border-radius:999px;padding:8px 11px;font-weight:800;font-size:12px}.ct50-score b{color:#f2c85d}.ct50-actions{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}.ct50-actions button,.ct47-action,.ct48-next,.ct48-card-check,.js-seen,.js-watchlist{min-height:42px;border-radius:13px!important;font-weight:700!important}.ct50-action{border:1px solid #2b4051;background:#0b131a;color:#f3f6f8;padding:9px 13px}.ct50-action.primary{background:#18251c;border-color:#3f6f4a;color:#b7e6c2}.ct50-detail .ct47-overview{font-size:13px!important;line-height:1.65!important;color:#aeb6bd!important;margin:17px 0!important}.ct50-where{margin:17px 0 20px}.ct50-where h2{font-size:20px;margin:0 0 11px}.ct50-provider-track{display:grid;grid-auto-flow:column;grid-auto-columns:116px;gap:9px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 1px 8px}.ct50-provider-track::-webkit-scrollbar{display:none}.ct50-provider{scroll-snap-align:start;border:1px solid #243746;background:#0b1218;border-radius:15px;overflow:hidden;min-height:144px}.ct50-provider-logo{height:82px;background:#111 center/cover no-repeat}.ct50-provider-body{padding:9px}.ct50-provider-body strong{display:block;font-size:11px;line-height:1.2}.ct50-provider-body span{display:block;color:#8896a1;font-size:9px;margin-top:5px}.ct50-provider-link{display:inline-block;margin-top:8px;color:#75b7eb;font-size:10px;text-decoration:none}.ct50-provider-empty{border:1px solid #243746;background:#0b1218;border-radius:14px;padding:13px;color:#8c98a2;font-size:11px}.ct50-detail .ct47-season{border-color:#213544!important;background:#0b1217!important}.ct50-detail .ct47-season-btn{background:#0c151c!important;font-size:15px!important;padding:15px!important}.ct50-detail .ct47-ep{padding:13px 0!important;grid-template-columns:minmax(0,1fr) auto!important}.ct50-detail .ct47-ep strong{font-size:12px!important}.ct50-detail .ct47-ep span{font-size:10px!important}.ct50-ep-side{display:flex;align-items:center;gap:7px}.ct50-ep-score{font-size:10px;font-weight:800;color:#f2c85d;white-space:nowrap}.ct50-detail .ct47-seen{width:auto!important;height:34px!important;border-radius:999px!important;padding:0 10px!important;font-size:9px!important}.ct50-card-score{display:inline-flex;align-items:center;gap:3px;margin-left:6px;color:#f2c85d;font-weight:800;white-space:nowrap}.ct50-hidden-known{display:none!important}
body.ct48-discover .card .rating-row{font-size:10px!important}body.ct48-discover .card .rating-row>span:first-child{color:#f2c85d!important}
`;
document.head.appendChild(css);

async function tmdb(type,id,extra=''){
  const key=`${type}:${id}:${extra}`;if(tmdbCache.has(key))return tmdbCache.get(key);
  const p=(async()=>{const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}${extra}`);u.searchParams.set('language','pt-BR');const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()})();
  tmdbCache.set(key,p);try{return await p}catch(e){tmdbCache.delete(key);throw e}
}
function idKey(type,id){return `tmdb-${type}-${Number(id)}`}
async function syncBlocked(){
  if(syncing||Date.now()-lastSync<1500)return;syncing=true;lastSync=Date.now();
  try{
    const [cont,over]=await Promise.all([
      sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]),
      sbApi('media_overrides?select=state,media:media(tmdb_id,media_type)&limit=5000').catch(()=>[])
    ]);
    const ids=new Set();
    for(const r of cont||[]){if(r?.tmdb_id)ids.add(idKey('tv',r.tmdb_id))}
    for(const r of over||[]){const m=r?.media;if(m?.tmdb_id&&m?.media_type)ids.add(idKey(m.media_type,m.tmdb_id))}
    blockedIds=ids;
  }finally{syncing=false}
}
function discoverFilter(){
  if(typeof view==='undefined'||view!=='discover')return;
  const cards=$$('body.ct48-discover .card[data-media-id],#tmdb-results .card[data-media-id],.content .card[data-media-id]');
  for(const c of cards){const blocked=blockedIds.has(c.dataset.mediaId||'');c.classList.toggle('ct50-hidden-known',blocked)}
}
function cleanLegacyWhere(){
  $$('.ct48-where').forEach(x=>x.style.setProperty('display','none','important'));
  const boxes=$$('.ct50-where');for(let i=1;i<boxes.length;i++)boxes[i].remove();
}
function rememberActive(){
  document.addEventListener('click',e=>{
    const c=e.target.closest('[data-media-id].card,.ct47-card[data-id],.ct48-home-card[data-id]');if(!c)return;
    if(c.dataset.mediaId){const m=(c.dataset.mediaId||'').match(/^tmdb-(movie|tv)-(\d+)$/);if(m)active={type:m[1],id:Number(m[2])}}
    else active={type:c.dataset.type==='movie'?'movie':'tv',id:Number(c.dataset.id||0)};
  },true);
}
function providerRows(br){
  const rows=[],seen=new Set();const push=(arr,kind)=>{for(const p of arr||[]){const k=`${p.provider_id}:${kind}`;if(seen.has(k))continue;seen.add(k);rows.push({...p,kind})}};
  push(br?.flatrate,'Streaming');push(br?.free,'Grátis');push(br?.ads,'Com anúncios');push(br?.rent,'Aluguel');push(br?.buy,'Compra');return rows;
}
async function buildWhere(type,id){
  const host=$('.ct47-overview');if(!host||!id)return;
  cleanLegacyWhere();let box=$('.ct50-where');if(!box){box=document.createElement('section');box.className='ct50-where';host.after(box)}
  box.innerHTML='<h2>Onde assistir</h2><div class="ct50-provider-empty">Carregando disponibilidade no Brasil…</div>';
  try{
    const data=await tmdb(type,id,'/watch/providers'),br=data?.results?.BR||{},rows=providerRows(br);
    if(!rows.length){box.innerHTML='<h2>Onde assistir</h2><div class="ct50-provider-empty">Disponibilidade não informada no Brasil.</div>';return}
    box.innerHTML=`<h2>Onde assistir</h2><div class="ct50-provider-track">${rows.map(p=>`<article class="ct50-provider"><div class="ct50-provider-logo"${p.logo_path?` style="background-image:url('${img(p.logo_path,'w154')}')"`:''}></div><div class="ct50-provider-body"><strong>${esc(p.provider_name||'Serviço')}</strong><span>${esc(p.kind)}</span></div></article>`).join('')}</div>${br.link?`<a class="ct50-provider-link" href="${esc(br.link)}" target="_blank" rel="noopener noreferrer">Ver todas as opções</a>`:''}`;
  }catch{box.innerHTML='<h2>Onde assistir</h2><div class="ct50-provider-empty">Não foi possível consultar a disponibilidade agora.</div>'}
}
async function decorateDetail(){
  const hero=$('.ct47-hero'),content=hero?.closest('.content');if(!hero||!content||!active.id)return;
  content.classList.add('ct50-detail');const key=`${active.type}:${active.id}`;if(detailKey===key&&$('.ct50-ratingbar')){cleanLegacyWhere();return}detailKey=key;
  $$('.ct50-ratingbar,.ct50-actions').forEach(x=>x.remove());
  try{
    const d=await tmdb(active.type,active.id),score=Number(d.vote_average||0),votes=Number(d.vote_count||0);
    const rating=document.createElement('div');rating.className='ct50-ratingbar';rating.innerHTML=`<span class="ct50-score"><b>★</b> TMDB ${score?score.toFixed(1):'—'}</span>${votes?`<span class="ct50-score">${votes.toLocaleString('pt-BR')} avaliações</span>`:''}`;hero.after(rating);
    const actions=document.createElement('div');actions.className='ct50-actions';actions.innerHTML='<button class="ct50-action primary" type="button" data-ct50-seen>✓ Assistido</button><button class="ct50-action" type="button" data-ct50-watch>＋ Watchlist</button>';rating.after(actions);
    const mediaId=idKey(active.type,active.id),item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(mediaId):null;
    $('[data-ct50-seen]',actions).onclick=()=>{const existing=$(`.js-seen[data-media-id="${CSS.escape(mediaId)}"]`);if(existing){existing.click();return}if(item&&typeof persistState==='function')persistState(item,'AlreadySeen',false).then(()=>{if(typeof loadCloudState==='function')return loadCloudState()}).catch(()=>{})};
    $('[data-ct50-watch]',actions).onclick=()=>{const existing=$(`.js-watchlist[data-media-id="${CSS.escape(mediaId)}"]`);if(existing){existing.click();return}if(item&&typeof persistState==='function')persistState(item,'AddedToWatchlist',false).then(()=>{if(typeof loadCloudState==='function')return loadCloudState()}).catch(()=>{})};
  }catch{}
  await buildWhere(active.type,active.id);decorateEpisodes();
}
async function decorateEpisodes(){
  if(active.type!=='tv'||!active.id)return;const rows=$$('.ct47-ep[data-season][data-episode]');if(!rows.length)return;
  const seasons=[...new Set(rows.map(r=>Number(r.dataset.season||0)).filter(Boolean))];
  for(const s of seasons){const key=`${active.id}:${s}`;if(episodeKeys.has(key))continue;episodeKeys.add(key);try{const sd=await tmdb('tv',active.id,`/season/${s}`),map=new Map((sd.episodes||[]).map(e=>[Number(e.episode_number),e]));for(const row of rows.filter(r=>Number(r.dataset.season)===s)){const ep=map.get(Number(row.dataset.episode));if(!ep)continue;let btn=$('.ct47-seen',row);if(btn){btn.textContent=btn.classList.contains('on')?'✓ Assistido':'Assistido';let side=btn.parentElement;if(!side?.classList.contains('ct50-ep-side')){side=document.createElement('div');side.className='ct50-ep-side';btn.replaceWith(side);side.appendChild(btn)}if(ep.vote_average){const sc=document.createElement('span');sc.className='ct50-ep-score';sc.textContent=`★ ${Number(ep.vote_average).toFixed(1)}`;side.prepend(sc)}}}}catch{episodeKeys.delete(key)}}
}
async function decorateVisibleCards(){
  const cards=$$('.ct47-card[data-id],.ct48-home-card[data-id]').filter(c=>!$('.ct50-card-score',c)).slice(0,15);
  await Promise.all(cards.map(async c=>{const id=Number(c.dataset.id||0),type=c.dataset.type==='movie'?'movie':'tv';if(!id)return;try{const d=await tmdb(type,id),score=Number(d.vote_average||0);if(!score)return;const target=$('.ct47-meta,.ct48-home-meta',c);if(target&&!$('.ct50-card-score',target)){const s=document.createElement('span');s.className='ct50-card-score';s.textContent=`★ ${score.toFixed(1)}`;target.appendChild(s)}}catch{}}));
}
function standardButtons(){
  $$('.ct48-next,.ct48-card-check').forEach(b=>{if(!/Em dia|Tentar novamente/i.test(b.textContent||''))b.textContent='✓ Assistido'});
}
async function applyAsync(){await syncBlocked();discoverFilter();await decorateDetail();await decorateVisibleCards();decorateEpisodes()}
function apply(){cleanLegacyWhere();standardButtons();void applyAsync()}
rememberActive();let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,100);setTimeout(apply,600);setTimeout(apply,1500);
})();
