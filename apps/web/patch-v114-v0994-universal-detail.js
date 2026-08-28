(() => {
'use strict';
if(window.__ct0994UniversalDetailLoaded)return;
window.__ct0994UniversalDetailLoaded=true;
window.__ct0994UniversalDetail='v114-universal-media-person-detail';

const $114=(s,r=document)=>r.querySelector(s);
const $$114=(s,r=document)=>[...r.querySelectorAll(s)];
const esc114=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm114=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const img114=(p,size='w500')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
const year114=x=>Number(String(x?.release_date||x?.first_air_date||'').slice(0,4))||Number(x?.release_year||0)||0;
const date114=v=>v?new Date(`${String(v).slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR'):'Data não informada';
const fmtRuntime114=n=>Number(n)>0?`${Number(n)} min`:'Duração não informada';

const css=document.createElement('style');
css.id='ct0994-universal-detail-v114-style';
css.textContent=`
.ct114-overlay{position:fixed;inset:0;z-index:1000001;background:#02070cf5;backdrop-filter:blur(9px);overflow:auto;padding:18px}
.ct114-shell{width:min(1280px,100%);margin:0 auto 36px;border:1px solid #28536b;background:linear-gradient(145deg,#07131b,#081821);border-radius:20px;box-shadow:0 32px 100px #000d;overflow:hidden}
.ct114-topbar{position:sticky;top:0;z-index:25;display:flex;justify-content:flex-end;padding:10px 12px;background:#061018e8;backdrop-filter:blur(15px);border-bottom:1px solid #17374a}
.ct114-close{border:1px solid #315c75;background:#0b1a24;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
.ct114-loading,.ct114-error{min-height:320px;display:grid;place-items:center;padding:28px;color:#8ca4b4;text-align:center}
.ct114-hero{position:relative;display:grid;grid-template-columns:210px minmax(0,1fr);gap:22px;padding:24px;background:radial-gradient(circle at 15% 0,#123e5666,transparent 40%)}
.ct114-poster{width:210px;aspect-ratio:2/3;border-radius:16px;background:#101d26 center/cover no-repeat;box-shadow:0 16px 50px #0008}
.ct114-title{font-size:30px;line-height:1.08;margin:4px 0 10px}.ct114-tagline{color:#87a4b5;font-style:italic;margin:0 0 12px}
.ct114-meta{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0 13px}.ct114-chip{border:1px solid #28546d;background:#0a202c;color:#dff7ff;border-radius:999px;padding:5px 9px;font-size:10px}
.ct114-overview{max-width:980px;color:#bed0da;line-height:1.55;font-size:13px}.ct114-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:15px}
.ct114-btn{border:1px solid #315f78;background:#0a1b25;color:#e9f9ff;border-radius:10px;padding:9px 12px;cursor:pointer;font-weight:800}.ct114-btn:hover{border-color:#63caff;background:#0c2b3b}.ct114-btn.on{border-color:#3db483;background:#0b2c21;color:#8affc7}.ct114-btn:disabled{opacity:.45;cursor:not-allowed}
.ct114-body{padding:0 24px 26px}.ct114-section{margin-top:22px;border-top:1px solid #183b4e;padding-top:18px}.ct114-section h2{margin:0 0 12px;font-size:20px}
.ct114-seasons{display:grid;gap:12px}.ct114-season{border:1px solid #21475c;background:#08151d;border-radius:15px;overflow:hidden}
.ct114-season-head{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;background:#0b1d27;color:#eefaff;padding:13px 15px;text-align:left;cursor:pointer}
.ct114-season-head b{font-size:14px}.ct114-season-head small{color:#7f9bad}.ct114-season-body{display:none;padding:12px}.ct114-season.open .ct114-season-body{display:block}
.ct114-episodes{display:grid;gap:10px}.ct114-ep{display:grid;grid-template-columns:155px minmax(0,1fr) auto;gap:12px;border:1px solid #1d4053;background:#091821;border-radius:13px;overflow:hidden;padding:9px}
.ct114-ep-img{width:155px;aspect-ratio:16/9;border-radius:9px;background:#101e27 center/cover no-repeat}.ct114-ep-main{min-width:0}.ct114-ep-main h3{font-size:13px;margin:2px 0 5px}.ct114-ep-code{font-size:9px;color:#76c8ed;font-weight:900}.ct114-ep-meta{font-size:10px;color:#849cab;margin:0 0 6px}.ct114-ep-overview{font-size:11px;line-height:1.45;color:#b7c9d3}
.ct114-ep-actions{display:flex;flex-direction:column;justify-content:center;gap:7px;min-width:138px}.ct114-ep-actions .ct114-btn{font-size:10px;padding:7px 8px}.ct114-seen{color:#83efba;font-size:10px;font-weight:800;text-align:center}
.ct114-chart{margin-top:14px;border:1px solid #21495f;background:#06131b;border-radius:13px;padding:12px;overflow-x:auto}.ct114-chart h3{margin:0 0 4px;font-size:14px}.ct114-chart-note{font-size:9px;color:#7791a1;margin-bottom:8px}.ct114-chart svg{display:block;min-width:720px;width:100%;height:245px}
.ct114-cast{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,135px));gap:10px}.ct114-person{border:1px solid #21475d;background:#0a1720;color:#fff;border-radius:12px;overflow:hidden;padding:0;cursor:pointer;text-align:left}.ct114-person:hover{border-color:#56b9e6}.ct114-person-photo{aspect-ratio:2/3;background:#111e27 center/cover no-repeat}.ct114-person-body{padding:7px}.ct114-person-body b{display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct114-person-body small{display:block;font-size:8px;color:#7892a3;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct114-person-page{padding:20px 24px 28px}.ct114-person-hero{display:grid;grid-template-columns:190px minmax(0,1fr);gap:20px}.ct114-person-photo-lg{width:190px;aspect-ratio:2/3;border-radius:15px;background:#101d26 center/cover no-repeat}.ct114-person-bio{color:#bacbd5;font-size:12px;line-height:1.55}
.ct114-filmography{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,150px));gap:10px}.ct114-credit{border:1px solid #21465a;background:#0a1720;color:#fff;border-radius:12px;overflow:hidden;padding:0;text-align:left;cursor:pointer}.ct114-credit:hover{border-color:#55bae8}.ct114-credit-poster{aspect-ratio:2/3;background:#101d26 center/cover no-repeat}.ct114-credit-body{padding:7px}.ct114-credit-body b{display:block;font-size:10px}.ct114-credit-body small{display:block;font-size:8px;color:#7892a3;margin-top:3px}
@media(max-width:760px){.ct114-overlay{padding:0}.ct114-shell{border-radius:0;margin:0;min-height:100vh}.ct114-hero{grid-template-columns:105px minmax(0,1fr);gap:13px;padding:15px}.ct114-poster{width:105px}.ct114-title{font-size:21px}.ct114-overview{grid-column:1/-1}.ct114-body{padding:0 12px 22px}.ct114-ep{grid-template-columns:110px minmax(0,1fr);}.ct114-ep-img{width:110px}.ct114-ep-actions{grid-column:1/-1;flex-direction:row;justify-content:flex-start;min-width:0}.ct114-person-page{padding:14px}.ct114-person-hero{grid-template-columns:100px minmax(0,1fr)}.ct114-person-photo-lg{width:100px}.ct114-filmography{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

async function api114(path,params={}){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
  u.searchParams.set('path',path);
  u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');
  Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});
  if(!r.ok)throw new Error(`TMDB ${r.status}`);
  return r.json();
}
async function sb114(path,options={}){if(typeof window.sbApi!=='function'&&typeof sbApi!=='function')throw new Error('Supabase indisponível');return (window.sbApi||sbApi)(path,options)}
async function rpc114(name,body={}){if(typeof window.sbRpc!=='function'&&typeof sbRpc!=='function')throw new Error('RPC indisponível');return (window.sbRpc||sbRpc)(name,body)}

async function mediaRow114(mediaId){
  if(!Number(mediaId))return null;
  const rows=await sb114(`media?select=id,tmdb_id,media_type,title,release_year,poster_path,runtime_minutes,total_episodes,total_seasons,raw_tmdb&id=eq.${Number(mediaId)}&limit=1`).catch(()=>[]);
  return rows?.[0]||null;
}
async function findLocalByTmdb114(type,tmdbId){
  if(!Number(tmdbId))return null;
  const rows=await sb114(`media?select=id,tmdb_id,media_type,title,release_year,poster_path,runtime_minutes,total_episodes,total_seasons,raw_tmdb&media_type=eq.${type}&tmdb_id=eq.${Number(tmdbId)}&limit=1`).catch(()=>[]);
  return rows?.[0]||null;
}
async function resolveTmdb114(row,typeHint,tmdbHint){
  const type=row?.media_type||typeHint||'movie';
  let id=Number(tmdbHint||0);
  if(id<=0)id=Number(row?.tmdb_id||0);
  if(id<=0)id=Number(row?.raw_tmdb?.source_tmdb_id||row?.raw_tmdb?.id||0);
  if(id>0)return {type,id};
  if(!row?.title)throw new Error('Mídia sem identificação oficial');
  const query=String(row.title).replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();
  const params={query,include_adult:false,page:1};
  if(Number(row.release_year)>0)params[type==='movie'?'year':'first_air_date_year']=Number(row.release_year);
  const d=await api114(`/search/${type}`,params),want=norm114(query),yr=Number(row.release_year||0);
  const choices=(d.results||[]).map(x=>({x,n:norm114(x.title||x.name),y:year114(x)})).filter(z=>z.n===want||z.n.includes(want)||want.includes(z.n));
  choices.sort((a,b)=>{
    const ay=yr&&a.y===yr?1:0,by=yr&&b.y===yr?1:0;
    if(by!==ay)return by-ay;
    return Number(b.x.popularity||0)-Number(a.x.popularity||0);
  });
  const hit=choices[0]?.x||(d.results||[])[0];
  if(!hit?.id)throw new Error('Não encontrei correspondência no TMDB');
  return {type,id:Number(hit.id)};
}
function overlay114(){
  $114('#ct114-overlay')?.remove();$114('#ct91-overlay')?.remove();
  const o=document.createElement('div');o.className='ct114-overlay';o.id='ct114-overlay';
  o.innerHTML='<div class="ct114-shell"><div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div><div class="ct114-loading">Carregando detalhes…</div></div>';
  document.body.appendChild(o);
  o.querySelector('[data-ct114-close]').onclick=()=>o.remove();
  o.addEventListener('click',e=>{if(e.target===o)o.remove()});
  return o;
}
function releasedCount114(detail){
  const last=detail?.last_episode_to_air;if(!last)return 0;
  const ls=Number(last.season_number||0),le=Number(last.episode_number||0);
  return (detail.seasons||[]).filter(s=>Number(s.season_number)>0).reduce((n,s)=>{
    const sn=Number(s.season_number),cnt=Number(s.episode_count||0);
    return n+(sn<ls?cnt:sn===ls?le:0);
  },0);
}
async function progress114(mediaId){
  if(!Number(mediaId))return new Map();
  const [p,h]=await Promise.all([
    sb114(`episode_progress?select=season_number,episode_number,watched,watched_at&media_id=eq.${Number(mediaId)}&watched=eq.true`).catch(()=>[]),
    sb114(`watch_history?select=season_number,episode_number,external_ids,watched_at&media_id=eq.${Number(mediaId)}&item_type=eq.episode`).catch(()=>[])
  ]);
  const m=new Map();
  for(const x of p||[]){const k=`${Number(x.season_number)}:${Number(x.episode_number)}`;m.set(k,{watched:true,plays:1,watched_at:x.watched_at})}
  for(const x of h||[]){const k=`${Number(x.season_number)}:${Number(x.episode_number)}`,old=m.get(k)||{};m.set(k,{...old,watched:true,plays:Math.max(Number(old.plays||1),Number(x.external_ids?.plays||1)),watched_at:x.watched_at||old.watched_at})}
  return m;
}
async function ensureLocal114(type,tmdbId,detail,row=null){
  if(row?.id)return row;
  const existing=await findLocalByTmdb114(type,tmdbId);if(existing)return existing;
  const title=detail.title||detail.name||`TMDB #${tmdbId}`,releaseYear=year114(detail);
  try{
    const created=await sb114('media',{method:'POST',body:JSON.stringify({
      tmdb_id:Number(tmdbId),media_type:type,title,poster_path:detail.poster_path||null,release_year:releaseYear||null,
      runtime_minutes:type==='movie'?(Number(detail.runtime)||null):(Number((detail.episode_run_time||[])[0]||0)||null),
      total_seasons:type==='tv'?Number(detail.number_of_seasons||0)||null:null,total_episodes:type==='tv'?Number(detail.number_of_episodes||0)||null:null,raw_tmdb:detail
    })});
    return created?.[0]||await findLocalByTmdb114(type,tmdbId);
  }catch{return await findLocalByTmdb114(type,tmdbId)}
}
async function toggleWatchlist114(ctx,btn){
  const local=await ensureLocal114(ctx.type,ctx.tmdbId,ctx.detail,ctx.row);
  if(!local?.id)throw new Error('Não foi possível sincronizar a mídia');
  const states=await sb114(`media_overrides?select=id,state&media_id=eq.${local.id}&state=in.(AddedToWatchlist,WatchLater)`).catch(()=>[]);
  const on=!states.length;
  if(on)await sb114('media_overrides',{method:'POST',body:JSON.stringify({media_id:local.id,state:'AddedToWatchlist'})});
  else for(const x of states)await sb114(`media_overrides?id=eq.${x.id}`,{method:'DELETE'}).catch(()=>{});
  btn.classList.toggle('on',on);btn.textContent=on?'✓ Na Watchlist':'+ Watchlist';
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v114-watchlist',media_id:local.id}}));
}
async function markMovie114(ctx,btn){
  const local=await ensureLocal114(ctx.type,ctx.tmdbId,ctx.detail,ctx.row);if(!local?.id)throw new Error('Não foi possível sincronizar o filme');
  await rpc114('cinetracker_mark_watch_v0994',{p_media_id:local.id,p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:ctx.detail.title||ctx.row?.title||null,p_runtime_minutes:Number(ctx.detail.runtime||local.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()});
  btn.classList.add('on');btn.textContent='✓ Visto';
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'v114-movie-seen',media_id:local.id}}));
}
function castCards114(cast){
  return (cast||[]).filter(x=>x.id&&x.name).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id))===i).slice(0,15).map(x=>`<button type="button" class="ct114-person" data-ct114-person="${Number(x.id)}"><div class="ct114-person-photo"${x.profile_path?` style="background-image:url('${img114(x.profile_path,'w342')}')"`:''}></div><div class="ct114-person-body"><b>${esc114(x.name)}</b><small>${esc114(x.character||x.roles?.[0]?.character||x.known_for_department||'Elenco')}</small></div></button>`).join('');
}
function chart114(seasonNo,episodes){
  const rated=(episodes||[]).filter(e=>Number(e.vote_average)>0);
  if(!rated.length)return '<div class="ct114-chart"><h3>Notas da temporada</h3><div class="ct114-chart-note">Ainda não há avaliações suficientes no TMDB.</div></div>';
  const vals=rated.map(e=>Number(e.vote_average)),min=Math.min(...vals),max=Math.max(...vals),W=Math.max(720,rated.length*58),H=210,left=34,right=20,top=15,bottom=40,iw=W-left-right,ih=H-top-bottom;
  const x=i=>left+(rated.length===1?iw/2:(i/(rated.length-1))*iw),y=v=>top+((10-v)/10)*ih;
  const points=rated.map((e,i)=>`${x(i)},${y(Number(e.vote_average))}`).join(' ');
  const grids=[0,2,4,6,8,10].map(v=>`<line x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}" stroke="#15384a" stroke-width="1"/><text x="4" y="${y(v)+3}" fill="#718d9d" font-size="9">${v}</text>`).join('');
  const nodes=rated.map((e,i)=>{
    const v=Number(e.vote_average),best=v===max,worst=v===min,fill=best?'#48e39a':worst?'#ff5f59':'#58cfff',code=`S${String(seasonNo).padStart(2,'0')}E${String(e.episode_number).padStart(2,'0')}`;
    return `<circle cx="${x(i)}" cy="${y(v)}" r="${best||worst?5:4}" fill="${fill}" stroke="#061018" stroke-width="2"><title>${code} · ${v.toFixed(1)} · ${esc114(e.name||'')}</title></circle><text x="${x(i)}" y="${H-10}" fill="#7692a2" font-size="8" text-anchor="middle">${code}</text>`;
  }).join('');
  return `<div class="ct114-chart"><h3>Notas da temporada</h3><div class="ct114-chart-note">Melhor episódio em verde · pior episódio em vermelho · escala 0–10</div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Notas dos episódios">${grids}<polyline points="${points}" fill="none" stroke="#55cfff" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/>${nodes}</svg></div>`;
}
function episodeHtml114(ctx,ep,seasonNo,state){
  const code=`S${String(seasonNo).padStart(2,'0')}E${String(ep.episode_number).padStart(2,'0')}`,k=`${seasonNo}:${Number(ep.episode_number)}`,seen=state.get(k),score=Number(ep.vote_average||0);
  return `<article class="ct114-ep" data-ct114-episode="${seasonNo}:${Number(ep.episode_number)}"><div class="ct114-ep-img"${ep.still_path?` style="background-image:url('${img114(ep.still_path,'w500')}')"`:''}></div><div class="ct114-ep-main"><div class="ct114-ep-code">${code}</div><h3>${esc114(ep.name||`Episódio ${ep.episode_number}`)}</h3><div class="ct114-ep-meta">${date114(ep.air_date)}${score?` · ★ ${score.toFixed(1)}`:''}</div><div class="ct114-ep-overview">${esc114(ep.overview||'Sinopse não disponível.')}</div></div><div class="ct114-ep-actions">${seen?`<div class="ct114-seen">✓ Visto${Number(seen.plays||1)>1?` · ${Number(seen.plays)}x`:''}</div>`:`<button type="button" class="ct114-btn" data-ct114-watch="${seasonNo}:${Number(ep.episode_number)}">✓ Marcar como visto</button>`}${seen?`<button type="button" class="ct114-btn" data-ct114-rewatch="${seasonNo}:${Number(ep.episode_number)}">↻ Marcar como revisto</button>`:''}</div></article>`;
}
function bindEpisodeButtons114(ctx,seasonNo,box,eps){
  const body=$114('.ct114-season-body',box);if(!body)return;const byKey=new Map(eps.map(e=>[`${seasonNo}:${Number(e.episode_number)}`,e]));
  $$114('[data-ct114-watch],[data-ct114-rewatch]',body).forEach(btn=>btn.onclick=async e=>{
    e.preventDefault();e.stopPropagation();if(btn.disabled)return;btn.disabled=true;
    const key=btn.dataset.ct114Watch||btn.dataset.ct114Rewatch,ep=byKey.get(key);if(!ep){btn.disabled=false;return}
    try{
      const local=await ensureLocal114('tv',ctx.tmdbId,ctx.detail,ctx.row);if(!local?.id)throw new Error('Série não sincronizada');
      const replay=Boolean(btn.dataset.ct114Rewatch);
      const res=await rpc114('cinetracker_mark_episode_v0994',{p_media_id:local.id,p_season_number:seasonNo,p_episode_number:Number(ep.episode_number),p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||ctx.detail.episode_run_time?.[0]||local.runtime_minutes||0)||null,p_released_episodes:releasedCount114(ctx.detail)||null,p_series_status:ctx.detail.status||null,p_watched_at:new Date().toISOString()});
      ctx.row=local;ctx.progress.set(key,{watched:true,plays:Number(res?.plays||1),watched_at:res?.watched_at||new Date().toISOString()});
      const art=btn.closest('.ct114-ep');if(art)art.outerHTML=episodeHtml114(ctx,ep,seasonNo,ctx.progress);
      bindEpisodeButtons114(ctx,seasonNo,box,eps);
      window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:replay?'v114-episode-rewatch':'v114-episode-watch',media_id:local.id,season:seasonNo,episode:Number(ep.episode_number)}}));
    }catch(err){console.error('[CineTracker 0.99.4] episódio',err);btn.disabled=false}
  });
}
async function loadSeason114(ctx,seasonNo,box){
  const body=$114('.ct114-season-body',box);if(!body||body.dataset.loaded==='1')return;
  body.innerHTML='<div class="ct114-loading">Carregando episódios…</div>';
  try{
    const sd=await api114(`/tv/${ctx.tmdbId}/season/${seasonNo}`),eps=(sd.episodes||[]).filter(e=>Number(e.episode_number)>0);
    body.dataset.loaded='1';body.innerHTML=`<div class="ct114-episodes">${eps.map(ep=>episodeHtml114(ctx,ep,seasonNo,ctx.progress)).join('')||'<div class="ct114-error">Sem episódios nesta temporada.</div>'}</div>${chart114(seasonNo,eps)}`;
    bindEpisodeButtons114(ctx,seasonNo,box,eps);
  }catch(err){body.innerHTML=`<div class="ct114-error">Falha ao carregar temporada: ${esc114(err?.message||err)}</div>`}
}
function hero114(ctx){
  const d=ctx.detail,title=d.title||d.name||ctx.row?.title||'Sem título',genres=(d.genres||[]).map(g=>g.name).filter(Boolean),score=Number(d.vote_average||0),meta=[year114(d)||null,score?`★ ${score.toFixed(1)}`:null,ctx.type==='movie'?fmtRuntime114(d.runtime):(d.number_of_seasons?`${d.number_of_seasons} temporada(s)`:null),...genres.slice(0,4)].filter(Boolean);
  return `<section class="ct114-hero"><div class="ct114-poster"${d.poster_path?` style="background-image:url('${img114(d.poster_path,'w500')}')"`:''}></div><div><h1 class="ct114-title">${esc114(title)}</h1>${d.tagline?`<p class="ct114-tagline">${esc114(d.tagline)}</p>`:''}<div class="ct114-meta">${meta.map(x=>`<span class="ct114-chip">${esc114(x)}</span>`).join('')}</div><div class="ct114-overview">${esc114(d.overview||'Sinopse não disponível.')}</div><div class="ct114-actions"><button type="button" class="ct114-btn" data-ct114-watchlist>+ Watchlist</button>${ctx.type==='movie'?'<button type="button" class="ct114-btn" data-ct114-movie-seen>✓ Marcar como visto</button>':''}</div></div></section>`;
}
async function renderTv114(o,ctx,credits){
  const shell=$114('.ct114-shell',o),seasons=(ctx.detail.seasons||[]).filter(s=>Number(s.season_number)>0&&Number(s.episode_count)>0),watchedKeys=[...ctx.progress.keys()].map(k=>k.split(':').map(Number)),lastSeason=watchedKeys.length?Math.max(...watchedKeys.map(x=>x[0])):Number(ctx.detail.last_episode_to_air?.season_number||seasons[0]?.season_number||1);
  shell.innerHTML=`<div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div>${hero114(ctx)}<div class="ct114-body"><section class="ct114-section"><h2>Temporadas e episódios</h2><div class="ct114-seasons">${seasons.map(s=>`<section class="ct114-season ${Number(s.season_number)===lastSeason?'open':''}" data-ct114-season="${Number(s.season_number)}"><button type="button" class="ct114-season-head"><span><b>Temporada ${Number(s.season_number)}</b><br><small>${Number(s.episode_count)} episódios${s.air_date?` · ${date114(s.air_date)}`:''}</small></span><span data-ct114-arrow>${Number(s.season_number)===lastSeason?'−':'+'}</span></button><div class="ct114-season-body"></div></section>`).join('')||'<div class="ct114-error">Nenhuma temporada oficial encontrada.</div>'}</div></section><section class="ct114-section"><h2>Elenco principal</h2><div class="ct114-cast">${castCards114(credits.cast)||'<div class="ct114-error">Elenco não disponível.</div>'}</div></section></div>`;
  bindCommon114(o,ctx);
  $$114('[data-ct114-season]',shell).forEach(box=>{
    const n=Number(box.dataset.ct114Season),head=$114('.ct114-season-head',box);
    head.onclick=()=>{box.classList.toggle('open');$114('[data-ct114-arrow]',box).textContent=box.classList.contains('open')?'−':'+';if(box.classList.contains('open'))void loadSeason114(ctx,n,box)};
    if(box.classList.contains('open'))void loadSeason114(ctx,n,box);
  });
}
async function renderMovie114(o,ctx,credits){
  const shell=$114('.ct114-shell',o);
  shell.innerHTML=`<div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div>${hero114(ctx)}<div class="ct114-body"><section class="ct114-section"><h2>Elenco principal</h2><div class="ct114-cast">${castCards114(credits.cast)||'<div class="ct114-error">Elenco não disponível.</div>'}</div></section></div>`;
  bindCommon114(o,ctx);
}
function bindCommon114(o,ctx){
  $114('[data-ct114-close]',o).onclick=()=>o.remove();
  const wb=$114('[data-ct114-watchlist]',o);if(wb)wb.onclick=async()=>{wb.disabled=true;try{await toggleWatchlist114(ctx,wb)}finally{wb.disabled=false}};
  const mb=$114('[data-ct114-movie-seen]',o);if(mb)mb.onclick=async()=>{mb.disabled=true;try{await markMovie114(ctx,mb)}finally{mb.disabled=false}};
  $$114('[data-ct114-person]',o).forEach(b=>b.onclick=()=>void openPerson114(Number(b.dataset.ct114Person)));
}
async function open114(ref={}){
  const o=overlay114();
  try{
    let row=ref.mediaId?await mediaRow114(ref.mediaId):null;
    const resolved=await resolveTmdb114(row,ref.type,ref.tmdbId),type=resolved.type,tmdbId=resolved.id;
    if(!row)row=await findLocalByTmdb114(type,tmdbId);
    const [detail,credits]=await Promise.all([api114(`/${type}/${tmdbId}`),api114(`/${type}/${tmdbId}/credits`).catch(()=>({cast:[]}))]);
    const ctx={type,tmdbId,row,detail,progress:type==='tv'?await progress114(row?.id):new Map()};
    if(type==='tv')await renderTv114(o,ctx,credits);else await renderMovie114(o,ctx,credits);
    return true;
  }catch(err){
    console.error('[CineTracker 0.99.4] detalhe universal',err);
    const shell=$114('.ct114-shell',o);if(shell)shell.innerHTML=`<div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div><div class="ct114-error">Não foi possível carregar os detalhes agora.<br>${esc114(err?.message||err)}</div>`;
    $114('[data-ct114-close]',o).onclick=()=>o.remove();return false;
  }
}
function creditSort114(a,b){const da=String(a.release_date||a.first_air_date||'0000'),db=String(b.release_date||b.first_air_date||'0000');return db.localeCompare(da)||Number(b.popularity||0)-Number(a.popularity||0)}
function creditCards114(rows){
  return rows.map(x=>`<button type="button" class="ct114-credit" data-ct114-credit="${x.media_type}:${Number(x.id)}"><div class="ct114-credit-poster"${x.poster_path?` style="background-image:url('${img114(x.poster_path,'w342')}')"`:''}></div><div class="ct114-credit-body"><b>${esc114(x.title||x.name||'Sem título')}</b><small>${year114(x)||'—'}${x.character?` · ${esc114(x.character)}`:''}</small></div></button>`).join('');
}
async function openPerson114(id){
  const o=overlay114();const shell=$114('.ct114-shell',o);
  try{
    const [p,c]=await Promise.all([api114(`/person/${id}`),api114(`/person/${id}/combined_credits`)]),dedupe=rows=>rows.filter(x=>x.id).sort(creditSort114).filter((x,i,a)=>a.findIndex(y=>Number(y.id)===Number(x.id))===i),movies=dedupe((c.cast||[]).filter(x=>x.media_type==='movie')),tv=dedupe((c.cast||[]).filter(x=>x.media_type==='tv')),meta=[p.known_for_department,p.birthday?`Nascimento: ${date114(p.birthday)}`:null,p.place_of_birth].filter(Boolean);
    shell.innerHTML=`<div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div><div class="ct114-person-page"><section class="ct114-person-hero"><div class="ct114-person-photo-lg"${p.profile_path?` style="background-image:url('${img114(p.profile_path,'w500')}')"`:''}></div><div><h1 class="ct114-title">${esc114(p.name||'Pessoa')}</h1><div class="ct114-meta">${meta.map(x=>`<span class="ct114-chip">${esc114(x)}</span>`).join('')}</div><div class="ct114-person-bio">${esc114(p.biography||'Biografia não disponível em português.')}</div></div></section><section class="ct114-section"><h2>Filmes · mais novos primeiro</h2><div class="ct114-filmography">${creditCards114(movies)||'<div class="ct114-error">Sem filmes cadastrados.</div>'}</div></section><section class="ct114-section"><h2>Séries · mais novas primeiro</h2><div class="ct114-filmography">${creditCards114(tv)||'<div class="ct114-error">Sem séries cadastradas.</div>'}</div></section></div>`;
    $114('[data-ct114-close]',o).onclick=()=>o.remove();
    $$114('[data-ct114-credit]',o).forEach(b=>b.onclick=()=>{const [type,tmdbId]=b.dataset.ct114Credit.split(':');o.remove();void open114({type,tmdbId:Number(tmdbId)})});
  }catch(err){shell.innerHTML=`<div class="ct114-topbar"><button class="ct114-close" type="button" data-ct114-close>✕ Fechar</button></div><div class="ct114-error">Não foi possível carregar a pessoa.<br>${esc114(err?.message||err)}</div>`;$114('[data-ct114-close]',o).onclick=()=>o.remove()}
}
window.__ct0994OpenDetail=(type,id)=>open114({type,tmdbId:Number(id)});
window.__ct0994OpenMediaById=mediaId=>open114({mediaId:Number(mediaId)});
window.__ct0994OpenPerson=id=>openPerson114(Number(id));
window.ct91OpenMedia=(type,id)=>open114({type,tmdbId:Number(id)});
window.ct92OpenMedia=(type,id)=>open114({type,tmdbId:Number(id)});

document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.target.closest?.('#ct114-overlay'))return;
  const home=e.target.closest?.('[data-ct994-open]');if(home){e.preventDefault();e.stopImmediatePropagation();void open114({mediaId:Number(home.dataset.ct994Open)});return}
  const profile=e.target.closest?.('[data-card991]');if(profile){e.preventDefault();e.stopImmediatePropagation();void open114({mediaId:Number(profile.dataset.card991)});return}
  const discover=e.target.closest?.('[data-open-media991]');if(discover){const [type,id]=String(discover.dataset.openMedia991||'').split(':');if(Number(id)>0){e.preventDefault();e.stopImmediatePropagation();void open114({type,tmdbId:Number(id)})}}
},true);
})();