/* r169: richer details, related media, season drawer/graphs, global back, fast Discover and combined activity */
window.__ctR169='detail-related-season-drawer-nav-fast-discover-activity';
window.__ct169Detail='rich-movie-series-no-community';
window.__ct169Related='after-cast-watchlist-seen-excluded';
window.__ct169Season='drawer-plus-futuristic-rating-carousel';
window.__ct169Back='global-previous-page';
window.__ct169Discover='instant-snapshot-preload';
window.__ct169ForYou='watchlist-fallback-compact-actions';
window.__ct169Profile='assistido-por-dia-episodes-movies-sports-15d';
window.__ct169Sports='polished-search-filter';

/* ---------- global Voltar ---------- */
let ct169NavDepth=Number(sessionStorage.getItem('ct:r169:nav-depth')||0)||0;
function ct169SaveDepth(){try{sessionStorage.setItem('ct:r169:nav-depth',String(Math.max(0,ct169NavDepth)))}catch{}}
const ct169GoBase=go;
go=function(path,replace=false){
  const dest=String(path||'').startsWith('/')?String(path):pathFor(path);
  if(!replace&&location.pathname!==dest){ct169NavDepth+=1;ct169SaveDepth()}
  return ct169GoBase(path,replace);
};
function ct169InjectBack(){
  if(!session||route()==='auth')return;
  const head=document.querySelector('.content>.header');if(!head)return;
  head.querySelector('[data-ct169-back]')?.remove();
  if(route()==='home'&&ct169NavDepth<=0)return;
  const b=document.createElement('button');
  b.type='button';b.className='ct169-back';b.dataset.ct169Back='1';b.innerHTML='<span>‹</span><b>Voltar</b>';
  head.prepend(b);
}
const ct169SetAppBase=setApp;
setApp=function(markup){ct169SetAppBase(markup);requestAnimationFrame(ct169InjectBack)};
window.addEventListener('popstate',()=>{ct169NavDepth=Math.max(0,ct169NavDepth-1);ct169SaveDepth();requestAnimationFrame(ct169InjectBack)});
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct169-back]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(ct169NavDepth>0)history.back();else go('/home',true);
},true);

/* ---------- Home silenciosa: sem "Sincronizando Home..." ---------- */
renderHome=async function(seq){
  setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home><div class="ct169-home-skeleton" aria-hidden="true"><i></i><i></i><i></i></div></div>`));
  const cached=homeCache||ct163Read('home');
  if(cached&&seq===navSeq&&route()==='home'){homeCache=cached;paintHome()}
  try{
    const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()});
    if(seq!==navSeq||route()!=='home')return;
    homeCache=data||{};ct163Write('home',homeCache);paintHome();
  }catch(e){
    if(seq!==navSeq||route()!=='home')return;
    if(cached){homeCache=cached;paintHome();return}
    const h=$('[data-home]');if(h)h.innerHTML=fail('Falha ao carregar Home: '+(e?.message||e),'home');
  }
};

/* ---------- Pra você: fallback real da Watchlist + ações compactas ---------- */
try{for(const k of Object.keys(localStorage))if(k.indexOf('cinetracker:preload:r163:discover:foryou')===0)localStorage.removeItem(k)}catch{}
const ct169WatchlistPoolsStrict=ct166WatchlistPools;
ct166WatchlistPools=function(dash){
  const strict=ct169WatchlistPoolsStrict(dash||[]);
  const fallback=(dash||[]).filter(x=>x?.is_watchlist&&!x?.is_seen&&!x?.is_completed).map(dashboardCard162).filter(x=>x&&mediaPoster(x)).sort((a,b)=>ct166Rank(b)-ct166Rank(a));
  const loose={
    movie:fallback.filter(x=>mediaType(x)==='movie'),
    series:fallback.filter(x=>mediaType(x)==='tv'&&!animeDashboard162(x)),
    anime:fallback.filter(x=>mediaType(x)==='tv'&&animeDashboard162(x))
  };
  return {
    movie:strict.movie?.length?strict.movie:loose.movie,
    series:strict.series?.length?strict.series:loose.series,
    anime:strict.anime?.length?strict.anime:loose.anime
  };
};
function ct169TuneForYou(){
  if(route()!=='discover'||discoverState.tab!=='foryou')return;
  document.querySelectorAll('[data-discover-content] .ct166-slot').forEach(slot=>{
    const card=slot.querySelector('.discover-card'),swap=slot.querySelector('.ct166-swap');if(!card||!swap)return;
    let actions=card.querySelector('.ct169-card-actions');if(!actions){actions=document.createElement('div');actions.className='ct169-card-actions';card.appendChild(actions)}
    const wl=card.querySelector('.discover-watch');if(wl&&wl.parentElement!==actions)actions.appendChild(wl);actions.appendChild(swap);
    slot.querySelector('.ct166-slot-head')?.classList.add('ct169-clean-head');
  });
}
const ct169PaintDiscoverBase=paintDiscover;
paintDiscover=function(rows){ct169PaintDiscoverBase(rows);requestAnimationFrame(ct169TuneForYou)};

/* ---------- Discover pré-carregado com snapshots leves ---------- */
function ct169SnapshotClean(rows,c,type){
  return ct166Unique((rows||[]).map(x=>type?{...x,media_type:type}:x)).filter(x=>x?.id&&mediaPoster(x)&&(!c||!ct166Known(x,c)));
}
async function ct169Snapshot(tab,c){
  if(tab==='foryou')return discoverRows('foryou');
  if(tab==='trending'){
    const d=await safeTmdb('/trending/all/week',{page:1});
    return ct169SnapshotClean((d.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv'),c);
  }
  if(tab==='popular'||tab==='top'){
    const endpoint=tab==='popular'?'popular':'top_rated';
    const [m,t]=await Promise.all([safeTmdb('/movie/'+endpoint,{page:1}),safeTmdb('/tv/'+endpoint,{page:1})]);
    return [...ct169SnapshotClean(m.results||[],c,'movie'),...ct169SnapshotClean(t.results||[],c,'tv')].sort((a,b)=>tab==='popular'?Number(b.popularity||0)-Number(a.popularity||0):Number(b.vote_average||0)-Number(a.vote_average||0));
  }
  if(tab==='new'||tab==='releases'||tab==='anticipated'){
    const lo=tab==='new'?shiftDays(-30):(tab==='anticipated'?shiftDays(1):shiftDays(-7));
    const hi=tab==='new'?localDay():(tab==='releases'?shiftDays(30):undefined);
    const mp={sort_by:tab==='new'?'primary_release_date.desc':'primary_release_date.asc',include_adult:false,'primary_release_date.gte':lo};
    const tp={sort_by:tab==='new'?'first_air_date.desc':'first_air_date.asc',include_adult:false,'first_air_date.gte':lo};
    if(hi){mp['primary_release_date.lte']=hi;tp['first_air_date.lte']=hi}
    const [m,t]=await Promise.all([safeTmdb('/discover/movie',{...mp,page:1}),safeTmdb('/discover/tv',{...tp,page:1})]);
    return [...ct169SnapshotClean(m.results||[],c,'movie'),...ct169SnapshotClean(t.results||[],c,'tv')];
  }
  return null;
}
let ct169PreloadTask=null,ct169PreloadDay='';
ct163PreloadAll=async function(){
  if(!session)return null;
  const day=localDay();if(ct169PreloadTask&&ct169PreloadDay===day)return ct169PreloadTask;ct169PreloadDay=day;
  ct169PreloadTask=(async()=>{
    try{const home=await rpc('cinetracker_home_live_v0997_r3',{p_today:day});if(home)ct163Write('home',home)}catch{}
    let c=null;try{c=await ct168Exclusions()}catch{}
    await Promise.allSettled(['foryou','trending','popular'].map(async tab=>{const v=await ct169Snapshot(tab,c);if(v)ct163Write('discover:'+tab+':all',v)}));
    await new Promise(r=>setTimeout(r,220));
    await Promise.allSettled(['new','releases','anticipated','top'].map(async tab=>{const v=await ct169Snapshot(tab,c);if(v)ct163Write('discover:'+tab+':all',v)}));
    await new Promise(r=>setTimeout(r,220));
    try{const sports=await sportsPayload(false);if(sports)ct163Write('sports',sports)}catch{}
  })().finally(()=>{ct169PreloadTask=null});
  return ct169PreloadTask;
};

/* ---------- Helpers das telas ricas de filme/série ---------- */
let ct169CurrentDetail=null,ct169DrawerState=null;
const ct169Year=d=>String(d?.release_date||d?.first_air_date||'').slice(0,4)||'—';
function ct169Runtime(kind,d){if(kind==='movie')return Number(d?.runtime||0)>0?Number(d.runtime)+' min':'';const n=Number((d?.episode_run_time||[])[0]||d?.last_episode_to_air?.runtime||0);return n>0?n+' min/ep':''}
function ct169Certification(kind,d){
  if(kind==='movie'){const rows=d?.release_dates?.results||[],r=rows.find(x=>x.iso_3166_1==='BR')||rows.find(x=>x.iso_3166_1==='US');return (r?.release_dates||[]).map(x=>x.certification).find(Boolean)||''}
  const rows=d?.content_ratings?.results||[],r=rows.find(x=>x.iso_3166_1==='BR')||rows.find(x=>x.iso_3166_1==='US');return r?.rating||'';
}
function ct169Creator(kind,d){if(kind==='movie')return (d?.credits?.crew||[]).filter(x=>x.job==='Director').map(x=>x.name).filter(Boolean).slice(0,3).join(', ');return (d?.created_by||[]).map(x=>x.name).filter(Boolean).slice(0,3).join(', ')}
function ct169ProviderRows(payload){const region=payload?.results?.BR||payload?.results?.US||{},all=[...(region.flatrate||[]),...(region.free||[]),...(region.ads||[]),...(region.rent||[]),...(region.buy||[])],seen=new Set();return all.filter(x=>{const k=Number(x.provider_id||0);if(!k||seen.has(k))return false;seen.add(k);return true}).slice(0,8)}
function ct169ProvidersHtml(payload){
  const rows=ct169ProviderRows(payload);
  return `<aside class="ct169-providers"><div class="ct169-side-title">Onde assistir</div>${rows.length?`<div class="ct169-provider-grid">${rows.map(p=>`<div class="ct169-provider"><div class="ct169-provider-logo"${p.logo_path?` style="background-image:url('${img(p.logo_path,'w154')}')"`:''}></div><small>${esc(p.provider_name||'Streaming')}</small></div>`).join('')}</div>`:'<div class="ct169-provider-empty">Sem disponibilidade informada para sua região.</div>'}</aside>`;
}
function ct169CastHtml(cast){const rows=(cast||[]).filter(x=>x?.id&&x?.name).slice(0,18);return rows.map(a=>`<article class="ct169-person-card"><button type="button" data-person="${Number(a.id)}"><div class="ct169-person-photo"${a.profile_path?` style="background-image:url('${img(a.profile_path,'w342')}')"`:''}></div><b>${esc(a.name)}</b><small>${esc(a.character||'Elenco')}</small></button></article>`).join('')||'<div class="empty">Sem elenco disponível.</div>'}
function ct169RelatedCard(x){
  const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x),score=Number(x?.vote_average||0);
  return `<article class="ct169-related-card" data-ct169-related-card="${type}:${id}"><button class="ct169-related-open" type="button" data-media="${type}:${id}"><div class="ct169-related-poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><b>${esc(mediaTitle(x))}</b><small>${esc(ct169Year(x))}${score?` · ★ ${score.toFixed(1)}`:''}</small></button><div class="ct169-related-actions"><button type="button" data-ct169-related-watch="${type}:${id}">＋ Watchlist</button><button type="button" data-ct169-related-seen="${type}:${id}">✓ Visto</button></div></article>`;
}
async function ct169Related(kind,id,rec,similar){
  const combined=[...(rec?.results||[]),...(similar?.results||[])].map(x=>({...x,media_type:kind}));
  let c=null;try{c=await ct168Exclusions()}catch{return []}
  return ct166Unique(combined).filter(x=>Number(x?.id||0)!==Number(id)&&mediaPoster(x)&&!ct166Known(x,c)).slice(0,24);
}
function ct169MainState(c,kind,id){return (c?.dash||[]).find(x=>mediaType(x)===kind&&Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0)===Number(id))||null}
function ct169HeroHtml(kind,id,d,providers,state){
  const p=d.poster_path?img(d.poster_path,'w500'):'',back=d.backdrop_path?img(d.backdrop_path,'w1280'):'',title=d.title||d.name||'Sem título',creator=ct169Creator(kind,d),cert=ct169Certification(kind,d),runtime=ct169Runtime(kind,d),genres=(d.genres||[]).map(g=>g.name).join(' · '),rating=Number(d.vote_average||0),episodes=kind==='tv'?Number(d.number_of_episodes||0):0,status=kind==='tv'?d.status:'',watchOn=Boolean(state?.is_watchlist),seenOn=Boolean(state?.is_seen||state?.is_completed),meta=[ct169Year(d),runtime,cert,genres].filter(Boolean).join(' · ');
  return `${back?`<div class="ct169-detail-backdrop" style="background-image:linear-gradient(90deg,#05090de8 0%,#05090dba 50%,#05090d8c),url('${back}')"></div>`:''}<section class="ct169-detail-hero"><div class="ct169-poster-wrap"><div class="ct169-detail-poster"${p?` style="background-image:url('${p}')"`:''}></div>${seenOn?'<span class="ct169-poster-state">✓ ASSISTIDO</span>':watchOn?'<span class="ct169-poster-state watch">▣ NA WATCHLIST</span>':''}</div><div class="ct169-detail-copy"><div class="ct169-kicker">${kind==='movie'?'FILME':'SÉRIE'}</div><h1>${esc(title)}</h1>${creator?`<div class="ct169-by">${kind==='movie'?'Dirigido por ':'Criado por '}<b>${esc(creator)}</b></div>`:''}<div class="ct169-meta">${esc(meta)}${rating?` · ★ ${rating.toFixed(1)}`:''}${episodes?` · ${episodes} eps.`:''}${status?` · ${esc(status)}`:''}</div><p>${esc(d.overview||'Sem sinopse disponível.')}</p><div class="ct169-main-actions"><button class="${watchOn?'on ':''}" type="button" data-detail-watchlist="${kind}:${id}" ${watchOn?'disabled':''}>${watchOn?'✓ Na Watchlist':'＋ Watchlist'}</button><button class="${seenOn?'on ':''}" type="button" data-detail-seen="${kind}:${id}" ${seenOn?'disabled':''}>${seenOn?'✓ Visto':'✓ Marcar como visto'}</button></div></div>${ct169ProvidersHtml(providers)}</section>`;
}
function ct169SeasonCards(id,seasons){return (seasons||[]).filter(s=>Number(s.season_number)>0).map(s=>`<article class="ct169-season-card"><button type="button" data-ct169-season="${Number(id)}:${Number(s.season_number)}"><div class="ct169-season-poster"${s.poster_path?` style="background-image:url('${img(s.poster_path,'w342')}')"`:''}></div><b>${esc(s.name||('Temporada '+s.season_number))}</b><small>${Number(s.episode_count||0)} episódios</small></button></article>`).join('')}

/* ---------- gráfico futurista restaurado ---------- */
function ct169ChartHtml(seasonNo,episodes){
  const rated=(episodes||[]).filter(e=>Number(e.vote_average)>0);if(!rated.length)return '<div class="ct169-chart-empty">Ainda não há notas suficientes.</div>';
  const vals=rated.map(e=>Number(e.vote_average)),min=Math.min(...vals),max=Math.max(...vals),W=Math.max(690,rated.length*54),H=215,L=35,R=20,T=20,B=42,iw=W-L-R,ih=H-T-B,x=i=>L+(rated.length===1?iw/2:(i/(rated.length-1))*iw),y=v=>T+((10-v)/10)*ih,points=rated.map((e,i)=>`${x(i)},${y(Number(e.vote_average))}`).join(' '),best=rated.find(e=>Number(e.vote_average)===max),worst=[...rated].reverse().find(e=>Number(e.vote_average)===min);
  const grid=[0,2,4,6,8,10].map(v=>`<line x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}" stroke="#173246" stroke-width="1"/><text x="4" y="${y(v)+3}" fill="#708ca0" font-size="9">${v}</text>`).join('');
  const nodes=rated.map((e,i)=>{const v=Number(e.vote_average),isBest=e===best,isWorst=e===worst&&worst!==best,fill=isBest?'#42e589':isWorst?'#ff5b67':'#67d5ff',code='E'+Number(e.episode_number);return `<circle cx="${x(i)}" cy="${y(v)}" r="${isBest||isWorst?5.5:3.8}" fill="${fill}" stroke="#041018" stroke-width="2"><title>${esc(code+' · '+v.toFixed(1)+' · '+(e.name||''))}</title></circle><text x="${x(i)}" y="${H-12}" fill="#718ba0" font-size="8" text-anchor="middle">${code}</text>`}).join('');
  return `<div class="ct169-chart-pills"><button class="best" type="button" data-ct169-ep-jump="${seasonNo}:${Number(best?.episode_number||0)}">Melhor · E${Number(best?.episode_number||0)} · ${max.toFixed(1)}</button>${worst&&worst!==best?`<button class="worst" type="button" data-ct169-ep-jump="${seasonNo}:${Number(worst.episode_number||0)}">Pior · E${Number(worst.episode_number||0)} · ${min.toFixed(1)}</button>`:''}</div><div class="ct169-chart-scroll"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Notas da temporada"><defs><linearGradient id="ct169g${seasonNo}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#35b8ff"/><stop offset="1" stop-color="#a55cff"/></linearGradient></defs>${grid}<polyline points="${points}" fill="none" stroke="url(#ct169g${seasonNo})" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${nodes}</svg></div>`;
}
async function ct169LoadSeasonGraphs(showId,seasons,seq){
  const list=(seasons||[]).filter(s=>Number(s.season_number)>0),root=document.querySelector('[data-ct169-season-charts]');if(!root)return;let cursor=0;
  async function worker(){while(cursor<list.length){const s=list[cursor++],sn=Number(s.season_number),card=root.querySelector(`[data-ct169-chart-season="${sn}"]`);if(!card)continue;try{const sd=await tmdb(`/tv/${showId}/season/${sn}`);if(seq!==navSeq||route()!=='series')return;card.querySelector('.ct169-chart-body').innerHTML=ct169ChartHtml(sn,(sd.episodes||[]).filter(e=>Number(e.episode_number)>0))}catch{card.querySelector('.ct169-chart-body').innerHTML='<div class="ct169-chart-empty">Falha ao carregar notas desta temporada.</div>'}}}
  await Promise.all([worker(),worker(),worker()]);
}

/* ---------- painel lateral da temporada ---------- */
async function ct169WatchedSet(showId){
  const rows=await api(`media?select=id&media_type=eq.tv&tmdb_id=eq.${Number(showId)}&limit=1`).catch(()=>[]),mid=Number(rows?.[0]?.id||0);if(!(mid>0))return new Set();
  const [p,h]=await Promise.all([api(`episode_progress?select=season_number,episode_number&media_id=eq.${mid}&watched=eq.true`).catch(()=>[]),api(`watch_history?select=season_number,episode_number&media_id=eq.${mid}&item_type=eq.episode`).catch(()=>[])]);
  return new Set([...p,...h].map(x=>Number(x.season_number)+':'+Number(x.episode_number)));
}
function ct169DrawerEpisode(ep,sn,watched){
  const en=Number(ep.episode_number),seen=watched.has(sn+':'+en),score=Number(ep.vote_average||0),runtime=Number(ep.runtime||0);
  return `<article class="ct169-drawer-ep" data-ct169-drawer-ep="${en}"><div class="ct169-drawer-still"${ep.still_path?` style="background-image:url('${img(ep.still_path,'w500')}')"`:''}></div><div class="ct169-drawer-ep-copy"><b>${esc(ep.name||('Episódio '+en))}</b><small>T${sn} · E${en}${runtime?` · ${runtime} min`:''}${score?` · ★ ${score.toFixed(1)}`:''}${ep.air_date?` · ${new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR')}`:''}</small><p>${esc(ep.overview||'Sem sinopse disponível.')}</p></div><div class="ct169-drawer-ep-state">${seen?'<span>✓ Visto</span>':`<button type="button" data-ct169-mark-episode="${sn}:${en}">✓ Marcar visto</button>`}</div></article>`;
}
async function ct169OpenSeasonDrawer(showId,seasonNo,jumpEp=0){
  document.querySelector('.ct169-drawer-backdrop')?.remove();
  const ov=document.createElement('div');ov.className='ct169-drawer-backdrop';ov.innerHTML='<aside class="ct169-drawer"><div class="ct169-drawer-top"><div><small>Temporada</small><b>Carregando...</b></div><button type="button" data-ct169-drawer-close>✕</button></div><div class="ct169-drawer-loading">Carregando episódios...</div></aside>';document.body.appendChild(ov);
  try{
    const [sd,watched]=await Promise.all([tmdb(`/tv/${showId}/season/${seasonNo}`),ct169WatchedSet(showId)]),eps=(sd.episodes||[]).filter(e=>Number(e.episode_number)>0),seasons=(ct169CurrentDetail?.detail?.seasons||[]).filter(s=>Number(s.season_number)>0);ct169DrawerState={showId:Number(showId),seasonNo:Number(seasonNo),episodes:eps,watched};
    const drawer=ov.querySelector('.ct169-drawer');drawer.innerHTML=`<div class="ct169-drawer-top"><div><small>Temporadas</small><select data-ct169-drawer-season>${seasons.map(s=>`<option value="${Number(s.season_number)}" ${Number(s.season_number)===Number(seasonNo)?'selected':''}>${esc(s.name||('Temporada '+s.season_number))}</option>`).join('')}</select></div><button type="button" data-ct169-drawer-close>✕</button></div><div class="ct169-drawer-tabs"><button class="active" type="button" data-ct169-drawer-tab="episodes">▷ Episódios</button><button type="button" data-ct169-drawer-tab="info">ⓘ Informações</button></div><div class="ct169-drawer-progress"><b>${eps.length} episódios</b><small>${eps.filter(ep=>watched.has(Number(seasonNo)+':'+Number(ep.episode_number))).length} vistos nesta temporada</small></div><div data-ct169-drawer-view="episodes" class="ct169-drawer-list">${eps.map(ep=>ct169DrawerEpisode(ep,Number(seasonNo),watched)).join('')}</div><div data-ct169-drawer-view="info" class="ct169-drawer-info hidden">${sd.poster_path?`<div class="ct169-drawer-season-poster" style="background-image:url('${img(sd.poster_path,'w342')}')"></div>`:''}<h2>${esc(sd.name||('Temporada '+seasonNo))}</h2><p>${esc(sd.overview||'Sem descrição disponível para esta temporada.')}</p><small>${esc(sd.air_date?new Date(sd.air_date+'T12:00:00').toLocaleDateString('pt-BR'):'Data não informada')}</small></div>`;
    if(jumpEp>0)requestAnimationFrame(()=>drawer.querySelector(`[data-ct169-drawer-ep="${Number(jumpEp)}"]`)?.scrollIntoView({block:'center',behavior:'smooth'}));
  }catch(e){const box=ov.querySelector('.ct169-drawer');if(box)box.innerHTML=`<div class="ct169-drawer-top"><b>Temporada</b><button type="button" data-ct169-drawer-close>✕</button></div><div class="error">Falha ao carregar episódios: ${esc(e?.message||e)}</div>`}
}
async function ct169MarkEpisode(sn,en,btn){
  const st=ct169DrawerState;if(!st||Number(st.seasonNo)!==Number(sn))return;const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===Number(en));if(!ep)return;btn.disabled=true;btn.textContent='Marcando...';
  try{const m=await ensureMedia('tv',Number(st.showId));await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:Number(sn),p_episode_number:Number(en),p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()});st.watched.add(Number(sn)+':'+Number(en));btn.outerHTML='<span>✓ Visto</span>';homeCache=null;profileCache=null;toast('Episódio marcado como assistido.')}catch(e){btn.disabled=false;btn.textContent='✓ Marcar visto';toast(e?.message||e)}
}

/* ---------- render de detalhes inspirado no layout pedido ---------- */
renderDetail=async function(kind,id,seq){
  const tmdbKind=kind==='series'?'tv':'movie';
  setApp(shell('Detalhes','Informações, temporadas, elenco e títulos relacionados.',kind,`<div class="page ct169-detail-page" data-detail><div class="ct169-detail-loading"></div></div>`));
  try{
    const [d,providers,rec,similar,ctx]=await Promise.all([
      tmdb(`/${tmdbKind}/${id}`,tmdbKind==='tv'?{append_to_response:'credits,content_ratings'}:{append_to_response:'credits,release_dates'}),safeTmdb(`/${tmdbKind}/${id}/watch/providers`),safeTmdb(`/${tmdbKind}/${id}/recommendations`,{page:1}),safeTmdb(`/${tmdbKind}/${id}/similar`,{page:1}),ct168Exclusions().catch(()=>null)
    ]);
    if(seq!==navSeq)return;const state=ct169MainState(ctx,tmdbKind,id),related=await ct169Related(tmdbKind,id,rec,similar);if(seq!==navSeq)return;
    ct169CurrentDetail={id:Number(id),kind:tmdbKind,detail:d};
    const cast=d?.credits?.cast||[],seasons=(d?.seasons||[]).filter(s=>Number(s.season_number)>0),h=$('[data-detail]');
    h.innerHTML=ct169HeroHtml(tmdbKind,id,d,providers,state)+
      (tmdbKind==='tv'?`<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>SÉRIE</small><h2>Temporadas</h2></div><span>${seasons.length}</span></div><div class="ct169-season-row">${ct169SeasonCards(id,seasons)}</div></section><section class="ct169-detail-section ct169-rating-section"><div class="ct169-section-head"><div><small>NOTAS DOS EPISÓDIOS</small><h2>Melhores e piores por temporada</h2></div><span>role para o lado →</span></div><div class="ct169-season-chart-carousel" data-ct169-season-charts>${seasons.map(s=>`<article class="ct169-season-chart-card" data-ct169-chart-season="${Number(s.season_number)}"><div class="ct169-chart-title"><b>${esc(s.name||('Temporada '+s.season_number))}</b><small>${Number(s.episode_count||0)} episódios</small></div><div class="ct169-chart-body"><div class="ct169-chart-skeleton"></div></div></article>`).join('')}</div></section>`:'')+
      `<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>ELENCO</small><h2>Atores</h2></div><span>${Math.min(18,cast.length)}</span></div><div class="ct169-cast-row">${ct169CastHtml(cast)}</div></section>`+
      `<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>RECOMENDAÇÕES</small><h2>${tmdbKind==='movie'?'Filmes Relacionados':'Séries Relacionadas'}</h2></div><span>${related.length}</span></div><div class="ct169-related-row">${related.length?related.map(ct169RelatedCard).join(''):'<div class="empty">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>'}</div></section>`;
    if(tmdbKind==='tv')void ct169LoadSeasonGraphs(Number(id),seasons,seq);
  }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail('Falha ao abrir detalhes: '+(e?.message||e),kind==='movie'?'home':'discover')}
};

/* ações de relacionados e temporada */
document.addEventListener('click',e=>{
  const w=e.target.closest?.('[data-ct169-related-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();const [type,raw]=String(w.dataset.ct169RelatedWatch||'').split(':'),id=Number(raw);w.disabled=true;w.textContent='Adicionando...';void addWatchlist(type,id).then(()=>{w.closest('[data-ct169-related-card]')?.remove()}).catch(x=>{w.disabled=false;w.textContent='＋ Watchlist';toast(x?.message||x)});return}
  const s=e.target.closest?.('[data-ct169-related-seen]');if(s){e.preventDefault();e.stopImmediatePropagation();const [type,raw]=String(s.dataset.ct169RelatedSeen||'').split(':'),id=Number(raw);s.disabled=true;s.textContent='Marcando...';void markSeen(type,id).then(()=>{s.closest('[data-ct169-related-card]')?.remove()}).catch(x=>{s.disabled=false;s.textContent='✓ Visto';toast(x?.message||x)});return}
  const season=e.target.closest?.('[data-ct169-season]');if(season){e.preventDefault();e.stopImmediatePropagation();const [sid,sn]=String(season.dataset.ct169Season||'').split(':');void ct169OpenSeasonDrawer(Number(sid),Number(sn));return}
  const jump=e.target.closest?.('[data-ct169-ep-jump]');if(jump){e.preventDefault();e.stopImmediatePropagation();const [sn,en]=String(jump.dataset.ct169EpJump||'').split(':');if(ct169CurrentDetail)void ct169OpenSeasonDrawer(ct169CurrentDetail.id,Number(sn),Number(en));return}
  if(e.target.closest?.('[data-ct169-drawer-close]')){e.preventDefault();document.querySelector('.ct169-drawer-backdrop')?.remove();return}
  const mark=e.target.closest?.('[data-ct169-mark-episode]');if(mark){e.preventDefault();e.stopImmediatePropagation();const [sn,en]=String(mark.dataset.ct169MarkEpisode||'').split(':');void ct169MarkEpisode(Number(sn),Number(en),mark);return}
  const tab=e.target.closest?.('[data-ct169-drawer-tab]');if(tab){const root=tab.closest('.ct169-drawer');root?.querySelectorAll('[data-ct169-drawer-tab]').forEach(x=>x.classList.toggle('active',x===tab));root?.querySelectorAll('[data-ct169-drawer-view]').forEach(x=>x.classList.toggle('hidden',x.dataset.ct169DrawerView!==tab.dataset.ct169DrawerTab));return}
},true);
document.addEventListener('change',e=>{if(e.target.matches?.('[data-ct169-drawer-season]')&&ct169CurrentDetail)void ct169OpenSeasonDrawer(ct169CurrentDetail.id,Number(e.target.value))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.ct169-drawer-backdrop')?.remove()});
document.addEventListener('click',e=>{const ov=e.target.closest?.('.ct169-drawer-backdrop');if(ov&&e.target===ov)ov.remove()});

/* ---------- Perfil: Assistido por dia = episódios + filmes + esportes ---------- */
let ct169ActivityReq=0;
function ct169RenderActivity(rows){
  const root=$('[data-profile]');if(!root)return;const panel=[...root.querySelectorAll('section.panel')].find(p=>{const t=p.querySelector('.panel-head h2')?.textContent?.trim();return t==='Episódios por dia'||t==='Assistido por dia'});if(!panel)return;
  const a=Array.isArray(rows)?rows:[],max=Math.max(1,...a.map(x=>Number(x.count||0)));panel.classList.add('ct169-activity-panel');
  panel.innerHTML=`<div class="panel-head"><h2>Assistido por dia</h2><small>Episódios + filmes + esportes · últimos 15 dias</small></div><div class="ct169-activity-scroll"><div class="ct169-activity-track">${a.map(x=>{const n=Number(x.count||0),ep=Number(x.episodes||0),mv=Number(x.movies||0),sp=Number(x.sports||0),day=String(x.day||'').slice(0,10),today=day===localDay(),height=Math.max(4,Math.round(n/max*145));return `<div class="ct169-activity-day ${today?'today':''}"><b>${n}</b><div class="ct169-activity-barbox"><div class="ct169-activity-bar" style="height:${height}px"></div></div><small>${today?'Hoje':new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'})}</small><em>Ep ${ep} · Fi ${mv} · Es ${sp}</em></div>`}).join('')}</div></div>`;
  const sc=panel.querySelector('.ct169-activity-scroll');if(sc)requestAnimationFrame(()=>{sc.scrollLeft=sc.scrollWidth});
}
async function ct169HydrateActivity(){if(route()!=='profile')return;const ticket=++ct169ActivityReq;try{const rows=await rpc('cinetracker_activity_by_day_v1',{p_days:15,p_tz:tz()});if(ticket!==ct169ActivityReq||route()!=='profile')return;ct169RenderActivity(rows)}catch{}}
const ct169PaintProfileBase=ct168PaintProfile;
ct168PaintProfile=function(d,note){ct169PaintProfileBase(d,note);void ct169HydrateActivity()};

/* ---------- Esportes: filtro visualmente destacado ---------- */
function ct169PolishSportsTools(){
  const tools=document.querySelector('[data-sports-tools]');if(!tools)return;tools.classList.add('ct169-sports-tools');
  if(!tools.querySelector('.ct169-sports-tools-head')){const h=document.createElement('div');h.className='ct169-sports-tools-head';h.innerHTML='<div><small>FILTRO RÁPIDO</small><b>Encontre jogos, times e competições</b></div><span>⌕</span>';tools.prepend(h)}
  tools.querySelector('[data-sports-search]')?.setAttribute('aria-label','Buscar em esportes');tools.querySelector('[data-sports-date]')?.setAttribute('aria-label','Escolher data dos jogos');
}
const ct169PaintSportsBase=paintSports;
paintSports=function(p=sportsCache||{}){ct169PaintSportsBase(p);requestAnimationFrame(ct169PolishSportsTools)};
