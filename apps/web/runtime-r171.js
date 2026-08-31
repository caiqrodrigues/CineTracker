/* r171: Top 10 por streaming, estado visto/reassistido, Onde Assistir, país e atividade clicável */
window.__ctR171='top10-streaming-seen-rewatch-where-country-activity';
window.__ct171Top10='daily-provider-movie-tv-popularity';
window.__ct171Seen='global-seen-badges-series-episode-sync-rewatch';
window.__ct171Providers='justwatch-style-watch-providers';
window.__ct171Country='production-country-detail';
window.__ct171Activity='click-day-watch-details';
window.__ct171Rls='media-overrides-auth-default-explicit-profile';

ct170ReadRpcNames.add('cinetracker_activity_items_by_day_v1');

/* ---------- gravações de biblioteca: sempre com o usuário atual ---------- */
addWatchlist=async function(type,id){
  const m=await ensureMedia(type,id),uid=user?.id;
  if(!uid)throw new Error('Sessão necessária');
  const ex=await api(`media_overrides?select=id&media_id=eq.${Number(m.id)}&state=eq.AddedToWatchlist&limit=1`).catch(()=>[]);
  if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({profile_id:uid,media_id:Number(m.id),state:'AddedToWatchlist',origin:'manual'})});
  homeCache=null;profileCache=null;discoverCache.clear();ct171SeenMap=null;
  const btn=document.querySelector(`[data-detail-watchlist="${type}:${Number(id)}"]`);if(btn){btn.classList.add('on');btn.disabled=true;btn.textContent='✓ Na Watchlist'}
  toast('Adicionado à Watchlist.');
};

markSeen=async function(type,id){
  const m=await ensureMedia(type,id),at=new Date().toISOString();
  if(type==='movie'){
    await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(m.id),p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:m.title||null,p_runtime_minutes:null,p_released_episodes:null,p_watched_at:at});
  }else{
    await rpc('cinetracker_mark_series_seen_v1',{p_media_id:Number(m.id),p_watched_at:at});
    ct171SeriesSynced.add(Number(m.id));
  }
  homeCache=null;profileCache=null;discoverCache.clear();ct171SeenMap=null;
  const btn=document.querySelector(`[data-detail-seen="${type}:${Number(id)}"]`);if(btn){btn.classList.add('on');btn.disabled=true;btn.textContent='✓ Visto'}
  toast(type==='tv'?'Série e episódios lançados marcados como vistos.':'Filme marcado como visto.');
  void ct171DecorateSeen(true);
};

/* ---------- VISTO em qualquer card que represente item já assistido ---------- */
let ct171SeenMap=null,ct171SeenPromise=null,ct171SeenAt=0,ct171SeenTimer=0;
async function ct171LoadSeen(force=false){
  if(!force&&ct171SeenMap&&Date.now()-ct171SeenAt<30000)return ct171SeenMap;
  if(!force&&ct171SeenPromise)return ct171SeenPromise;
  const p=(async()=>{
    const rows=await rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),map=new Map();
    for(const x of rows||[]){
      const type=mediaType(x),id=Number(x.tmdb_id||x.raw_tmdb?.source_tmdb_id||0);if(!id)continue;
      const seen=Boolean(x.is_seen||x.is_completed||Number(x.watched_episodes||0)>0||x.last_watched_at);
      if(seen)map.set(type+':'+id,x);
    }
    ct171SeenMap=map;ct171SeenAt=Date.now();return map;
  })();ct171SeenPromise=p;try{return await p}finally{if(ct171SeenPromise===p)ct171SeenPromise=null}
}
function ct171BadgeHost(el){return el.closest('article,.media-row,.ct169-related-card,.foryou-slot')||el.parentElement}
async function ct171DecorateSeen(force=false){
  if(!session||route()==='auth')return;const map=await ct171LoadSeen(force);if(!map)return;
  document.querySelectorAll('[data-media]').forEach(el=>{
    const raw=String(el.dataset.media||''),[t,n]=raw.split(':'),type=t==='movie'?'movie':'tv',id=Number(n);if(!id)return;
    const host=ct171BadgeHost(el);if(!host)return;
    const exists=host.querySelector(`.ct171-seen-badge[data-key="${type}:${id}"]`),on=map.has(type+':'+id);
    if(on&&!exists){const badge=document.createElement('span');badge.className='ct171-seen-badge';badge.dataset.key=type+':'+id;badge.textContent='✓ VISTO';const poster=host.querySelector('.poster,.thumb,.ct169-related-poster,.ct169-person-photo')||host;poster.classList.add('ct171-seen-host');poster.appendChild(badge)}
    if(!on&&exists)exists.remove();
  });
}
function ct171ScheduleSeen(){clearTimeout(ct171SeenTimer);ct171SeenTimer=setTimeout(()=>void ct171DecorateSeen(false),80)}
const ct171Observer=new MutationObserver(()=>ct171ScheduleSeen());
setTimeout(()=>{const app=document.querySelector('#app');if(app)ct171Observer.observe(app,{subtree:true,childList:true})},0);

/* ---------- série marcada como Visto => episódios lançados também vistos ---------- */
const ct171SeriesSynced=new Set();
const ct171WatchedSetBase=ct169WatchedSet;
ct169WatchedSet=async function(showId){
  try{
    const rows=await api(`media?select=id&media_type&media_type=eq.tv&tmdb_id=eq.${Number(showId)}&limit=1`).catch(()=>[]),mid=Number(rows?.[0]?.id||0);
    if(mid&&!ct171SeriesSynced.has(mid)){
      const state=await api(`media_overrides?select=id,state&media_id=eq.${mid}&state=in.(AlreadySeen,Completed)&limit=1`).catch(()=>[]);
      if(state?.length){await rpc('cinetracker_mark_series_seen_v1',{p_media_id:mid,p_watched_at:new Date().toISOString()});ct171SeriesSynced.add(mid)}
    }
  }catch{}
  return ct171WatchedSetBase(showId);
};

/* episódio já visto volta a oferecer Reassistido */
ct169DrawerEpisode=function(ep,sn,watched){
  const en=Number(ep.episode_number),seen=watched.has(sn+':'+en),score=Number(ep.vote_average||0),runtime=Number(ep.runtime||0);
  return `<article class="ct169-drawer-ep ${seen?'ct171-episode-seen':''}" data-ct169-drawer-ep="${en}"><div class="ct169-drawer-still"${ep.still_path?` style="background-image:url('${img(ep.still_path,'w500')}')"`:''}>${seen?'<span class="ct171-ep-seen-badge">✓ VISTO</span>':''}</div><div class="ct169-drawer-ep-copy"><b>${esc(ep.name||('Episódio '+en))}</b><small>T${sn} · E${en}${runtime?` · ${runtime} min`:''}${score?` · ★ ${score.toFixed(1)}`:''}${ep.air_date?` · ${new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR')}`:''}</small><p>${esc(ep.overview||'Sem sinopse disponível.')}</p></div><div class="ct169-drawer-ep-state">${seen?`<span>✓ Visto</span><button type="button" data-ct171-rewatch-episode="${sn}:${en}">↻ Reassistido</button>`:`<button type="button" data-ct169-mark-episode="${sn}:${en}">✓ Marcar visto</button>`}</div></article>`;
};
async function ct171RewatchEpisode(sn,en,btn){
  const st=ct169DrawerState;if(!st||Number(st.seasonNo)!==Number(sn))return;const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===Number(en));if(!ep)return;
  btn.disabled=true;btn.textContent='Salvando...';
  try{
    const m=await ensureMedia('tv',Number(st.showId));
    const r=await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:Number(sn),p_episode_number:Number(en),p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()});
    btn.textContent=`↻ Reassistido${Number(r?.plays||0)>1?' · '+Number(r.plays)+'x':''}`;homeCache=null;profileCache=null;ct171SeenMap=null;toast('Episódio registrado como reassistido.');
  }catch(e){btn.disabled=false;btn.textContent='↻ Reassistido';toast(e?.message||e)}
}

/* ---------- Onde Assistir e país de produção ---------- */
function ct171RegionName(code){try{return new Intl.DisplayNames(['pt-BR'],{type:'region'}).of(String(code||'').toUpperCase())||code}catch{return code||''}}
function ct171Countries(d){
  const codes=[],names=[];for(const x of d?.production_countries||[]){if(x?.name)names.push(x.name);else if(x?.iso_3166_1)codes.push(x.iso_3166_1)}
  for(const c of d?.origin_country||[])codes.push(c);const out=[...names,...codes.map(ct171RegionName)].filter(Boolean);return [...new Set(out)].join(', ');
}
function ct171ProviderGroup(region){
  const seen=new Set(),out=[];for(const [label,rows] of [['Stream',[...(region?.flatrate||[]),...(region?.free||[]),...(region?.ads||[])]],['Alugar',region?.rent||[]],['Comprar',region?.buy||[]]])for(const p of rows||[]){const id=Number(p.provider_id||0);if(!id||seen.has(id))continue;seen.add(id);out.push({...p,_label:label})}return out;
}
function ct171WhereHtml(payload){
  const region=payload?.results?.BR||payload?.results?.US||{},rows=ct171ProviderGroup(region),link=String(region?.link||'');
  return `<section class="ct171-watch-section"><div class="ct171-watch-head"><div><h2>Onde Assistir <span>›</span></h2><div class="ct171-justwatch"><b>▧ JustWatch</b><small> disponibilidade informada pelo TMDB</small></div></div>${link?`<a href="${esc(link)}" target="_blank" rel="noopener">ver opções ↗</a>`:''}</div>${rows.length?`<div class="ct171-provider-row">${rows.map(p=>`<div class="ct171-provider-card"><div class="ct171-provider-logo"${p.logo_path?` style="background-image:url('${img(p.logo_path,'w154')}')"`:''}></div><b>${esc(p.provider_name||'Streaming')}</b><small>${esc(p._label)}</small></div>`).join('')}</div>`:'<div class="empty">Nenhuma disponibilidade informada para o Brasil neste momento.</div>'}</section>`;
}
const ct171RenderDetailBase=renderDetail;
renderDetail=async function(kind,id,seq){
  await ct171RenderDetailBase(kind,id,seq);if(seq!==navSeq||!['movie','series'].includes(route()))return;
  try{
    const tmdbKind=kind==='series'?'tv':'movie',d=ct169CurrentDetail?.detail;if(!d)return;
    const hero=document.querySelector('.ct169-detail-hero');if(!hero)return;
    hero.querySelector('.ct169-providers')?.remove();
    const country=ct171Countries(d),meta=hero.querySelector('.ct169-meta');if(country&&meta&&!meta.querySelector('.ct171-country'))meta.insertAdjacentHTML('beforeend',`<span class="ct171-country"> · Produção: ${esc(country)}</span>`);
    const providers=await safeTmdb(`/${tmdbKind}/${Number(id)}/watch/providers`);if(seq!==navSeq)return;
    document.querySelector('.ct171-watch-section')?.remove();hero.insertAdjacentHTML('afterend',ct171WhereHtml(providers));
    const seenBtn=hero.querySelector(`[data-detail-seen="${tmdbKind}:${Number(id)}"]`);if(tmdbKind==='movie'&&seenBtn?.disabled&&!hero.querySelector('[data-ct171-rewatch-media]'))seenBtn.insertAdjacentHTML('afterend',`<button type="button" data-ct171-rewatch-media="movie:${Number(id)}">↻ Reassistido</button>`);
    void ct171DecorateSeen(false);
  }catch(e){console.warn('r171 detail enhancement',e)}
};
async function ct171RewatchMovie(id,btn){
  btn.disabled=true;btn.textContent='Salvando...';try{const m=await ensureMedia('movie',Number(id)),r=await rpc('cinetracker_mark_watch_v0994',{p_media_id:Number(m.id),p_item_type:'movie',p_season_number:null,p_episode_number:null,p_title:m.title||null,p_runtime_minutes:null,p_released_episodes:null,p_watched_at:new Date().toISOString()});btn.textContent=`↻ Reassistido${Number(r?.plays||0)>1?' · '+Number(r.plays)+'x':''}`;homeCache=null;profileCache=null;ct171SeenMap=null;toast('Filme registrado como reassistido.')}catch(e){btn.disabled=false;btn.textContent='↻ Reassistido';toast(e?.message||e)}
}

/* ---------- Descobrir: TOP 10 diário por streaming ---------- */
let ct171TopProvider=null,ct171ProviderList=null,ct171ProviderPromise=null;
const ct171PreferredProviders=['netflix','amazon prime video','prime video','disney plus','max','globoplay','paramount plus','apple tv plus','claro tv','crunchyroll','telecine','mubi','looke'];
function ct171ProviderRank(name){const n=norm(name),i=ct171PreferredProviders.findIndex(x=>n.includes(norm(x)));return i<0?999:i}
async function ct171Providers(){
  if(ct171ProviderList)return ct171ProviderList;if(ct171ProviderPromise)return ct171ProviderPromise;
  ct171ProviderPromise=(async()=>{const [m,t]=await Promise.all([safeTmdb('/watch/providers/movie',{watch_region:'BR'}),safeTmdb('/watch/providers/tv',{watch_region:'BR'})]),map=new Map();for(const p of [...(m.results||[]),...(t.results||[])]){const id=Number(p.provider_id||0);if(!id)continue;const old=map.get(id);map.set(id,{...old,...p,_hits:Number(old?._hits||0)+1})}const both=[...map.values()].filter(x=>x._hits>=2).sort((a,b)=>ct171ProviderRank(a.provider_name)-ct171ProviderRank(b.provider_name)||Number(a.display_priority||999)-Number(b.display_priority||999));ct171ProviderList=both.slice(0,24);return ct171ProviderList})();try{return await ct171ProviderPromise}finally{ct171ProviderPromise=null}
}
function ct171TopCacheKey(provider){return`ct171:top10:${localDay()}:${provider}`}
async function ct171TopRows(provider){
  const key=ct171TopCacheKey(provider);try{const c=JSON.parse(sessionStorage.getItem(key)||'null');if(c?.movies&&c?.series)return c}catch{}
  const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page:1};
  const [m,t]=await Promise.all([safeTmdb('/discover/movie',common),safeTmdb('/discover/tv',common)]),data={movies:(m.results||[]).filter(x=>x.id&&x.poster_path).slice(0,10).map(x=>({...x,media_type:'movie'})),series:(t.results||[]).filter(x=>x.id&&x.poster_path).slice(0,10).map(x=>({...x,media_type:'tv'}))};try{sessionStorage.setItem(key,JSON.stringify(data))}catch{}return data;
}
function ct171TopCard(x,i){const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x),score=Number(x.vote_average||0),year=String(x.release_date||x.first_air_date||'').slice(0,4);return `<article class="ct171-top-card"><span class="ct171-rank">${i+1}</span><button type="button" data-media="${type}:${id}"><div class="poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><div class="card-body"><b>${esc(mediaTitle(x))}</b><small>${year||'—'} · ${type==='movie'?'Filme':'Série'}${score?` · ★ ${score.toFixed(1)}`:''}</small></div></button></article>`}
function ct171DiscoverTabs(){return [['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']]}
function ct171InjectTopTab(){const tabs=document.querySelector('[data-discover] .tabs');if(!tabs||tabs.querySelector('[data-discover-tab="top10"]'))return;const f=tabs.querySelector('[data-discover-tab="foryou"]'),b=document.createElement('button');b.className='chip';b.dataset.discoverTab='top10';b.textContent='Top 10';f?.insertAdjacentElement('afterend',b)}
async function ct171PaintTopProvider(provider){
  const content=document.querySelector('[data-ct171-top-content]');if(!content)return;content.innerHTML=loading('Montando Top 10 de hoje...');
  try{const data=await ct171TopRows(provider);if(discoverState.tab!=='top10')return;const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));content.innerHTML=`<div class="ct171-top-caption"><b>${esc(p?.provider_name||'Streaming')}</b><small>Ranking de hoje por popularidade TMDB entre títulos disponíveis para assinatura no Brasil.</small></div><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct171-top-row">${data.series.map(ct171TopCard).join('')||'<div class="empty">Sem séries disponíveis neste filtro.</div>'}</div></section><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct171-top-row">${data.movies.map(ct171TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste filtro.</div>'}</div></section>`;void ct171DecorateSeen(false)}catch(e){content.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}
}
async function ct171RenderTop10(seq){
  const tabs=ct171DiscoverTabs().map(([k,l])=>`<button class="chip ${discoverState.tab===k?'active':''}" data-discover-tab="${k}">${l}</button>`).join('');
  setApp(shell('Descobrir','Recomendações, Top 10 por streaming, tendências e calendário.','discover',`<div class="page" data-discover><div class="tabs">${tabs}</div><section class="ct171-top10-shell"><div class="ct171-top10-title"><div><small>TOP 10 · ${new Date().toLocaleDateString('pt-BR')}</small><h2>Escolha o streaming</h2></div></div><div class="ct171-provider-tabs" data-ct171-provider-tabs>${loading('Carregando streamings...')}</div><div data-ct171-top-content>${loading('Carregando Top 10...')}</div></section></div>`));
  try{const ps=await ct171Providers();if(seq!==navSeq||discoverState.tab!=='top10')return;if(!ct171TopProvider||!ps.some(x=>Number(x.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(ps[0]?.provider_id||0);const box=document.querySelector('[data-ct171-provider-tabs]');if(box)box.innerHTML=ps.map(p=>`<button type="button" class="ct171-provider-tab ${Number(p.provider_id)===Number(ct171TopProvider)?'active':''}" data-ct171-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name)}</b></button>`).join('')||'<div class="empty">Nenhum streaming encontrado.</div>';if(ct171TopProvider)await ct171PaintTopProvider(ct171TopProvider)}catch(e){const h=document.querySelector('[data-ct171-top-content]');if(h)h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover')}
}
const ct171RenderDiscoverBase=renderDiscover;
renderDiscover=async function(seq){if(discoverState.tab==='top10'){discoverState.type='all';return ct171RenderTop10(seq)}await ct171RenderDiscoverBase(seq);if(seq===navSeq&&route()==='discover')ct171InjectTopTab()};

/* ---------- busca Adicionar + Série/Filme/Ator sempre funcional ---------- */
openFavoriteSearch158=function(kind){
  document.querySelector('.favorite-overlay')?.remove();const label=kind==='movie'?'filme':kind==='tv'?'série':'ator',ov=document.createElement('div');ov.className='favorite-overlay';ov.innerHTML=`<div class="favorite-box"><div class="panel-head"><h2>Adicionar ${label} aos favoritos</h2><button class="mini-add" type="button" data-favorite-close>✕ Fechar</button></div><input class="favorite-search" type="search" placeholder="Buscar ${label}…" autocomplete="off"><div class="favorite-results"><div class="empty">Digite pelo menos 2 caracteres.</div></div></div>`;document.body.appendChild(ov);
  const input=ov.querySelector('.favorite-search'),out=ov.querySelector('.favorite-results');let timer=0,rows=[];
  ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('[data-favorite-close]')){ov.remove();return}const b=e.target.closest('[data-favorite-result]');if(!b)return;const item=rows[Number(b.dataset.favoriteResult)];if(!item)return;b.disabled=true;void(async()=>{try{if(kind==='person'){const ex=await api(`favorite_actors?select=id&tmdb_person_id=eq.${Number(item.id)}&limit=1`).catch(()=>[]);if(!ex?.length)await api('favorite_actors',{method:'POST',body:JSON.stringify({user_id:user?.id,tmdb_person_id:Number(item.id),actor_name:item.name||('TMDB #'+item.id),profile_path:item.profile_path||null})})}else{const m=await ensureMedia(kind,Number(item.id)),ex=await api(`media_overrides?select=id&media_id=eq.${Number(m.id)}&state=eq.Liked&limit=1`).catch(()=>[]);if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({profile_id:user?.id,media_id:Number(m.id),state:'Liked',origin:'manual'})})}profileCache=null;ct171SeenMap=null;ov.remove();toast('Favorito adicionado.');await render()}catch(err){b.disabled=false;toast(err?.message||err)}})()});
  input.addEventListener('input',()=>{clearTimeout(timer);const q=input.value.trim();if(q.length<2){out.innerHTML='<div class="empty">Digite pelo menos 2 caracteres.</div>';return}timer=setTimeout(async()=>{out.innerHTML='<div class="loader">Buscando...</div>';try{const d=await tmdb(kind==='person'?'/search/person':'/search/'+kind,{query:q,include_adult:false,page:1});rows=(d.results||[]).slice(0,18);out.innerHTML=rows.map((x,i)=>{const p=kind==='person'?x.profile_path:x.poster_path,year=String(x.release_date||x.first_air_date||'').slice(0,4);return `<button class="favorite-result" type="button" data-favorite-result="${i}"><span class="favorite-thumb"${p?` style="background-image:url('${img(p,kind==='person'?'w185':'w154')}')"`:''}></span><span><b>${esc(x.title||x.name||'Sem título')}</b><small>${kind==='person'?esc(x.known_for_department||'Pessoa'):(year||'—')}</small></span><span>＋</span></button>`}).join('')||'<div class="empty">Nenhum resultado.</div>'}catch(e){out.innerHTML=`<div class="error">${esc(e?.message||e)}</div>`}},250)});setTimeout(()=>input.focus(),20);
};
function ct171EnableAddButtons(){document.querySelectorAll('[data-add-favorite]').forEach(b=>{b.disabled=false;b.removeAttribute('aria-disabled');b.style.pointerEvents='auto'})}

/* ---------- gráfico Perfil clicável ---------- */
ct169RenderActivity=function(rows){
  const root=document.querySelector('[data-profile]');if(!root)return;const panel=[...root.querySelectorAll('section.panel')].find(p=>{const t=p.querySelector('.panel-head h2')?.textContent?.trim();return t==='Episódios por dia'||t==='Assistido por dia'});if(!panel)return;
  const a=Array.isArray(rows)?rows:[],max=Math.max(1,...a.map(x=>Number(x.count||0)));panel.classList.add('ct169-activity-panel','ct171-activity-panel');
  panel.innerHTML=`<div class="panel-head"><div><h2>Assistido por dia</h2><small>Clique em um dia para ver o que foi assistido</small></div><small>Episódios + filmes + esportes · últimos 15 dias</small></div><div class="ct169-activity-scroll"><div class="ct169-activity-track">${a.map(x=>{const n=Number(x.count||0),ep=Number(x.episodes||0),mv=Number(x.movies||0),sp=Number(x.sports||0),day=String(x.day||'').slice(0,10),today=day===localDay(),height=Math.max(4,Math.round(n/max*145));return `<button type="button" class="ct169-activity-day ct171-activity-day ${today?'today':''}" data-ct171-activity-day="${esc(day)}"><b>${n}</b><div class="ct169-activity-barbox"><div class="ct169-activity-bar" style="height:${height}px"></div></div><small>${today?'Hoje':new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'})}</small><em>Ep ${ep} · Fi ${mv} · Es ${sp}</em></button>`}).join('')}</div></div>`;
  const sc=panel.querySelector('.ct169-activity-scroll');if(sc)requestAnimationFrame(()=>{sc.scrollLeft=sc.scrollWidth});ct171EnableAddButtons();
};
function ct171ActivityItemHtml(x){
  const type=String(x.item_type||''),time=x.watched_at?new Date(x.watched_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'',runtime=Number(x.runtime_minutes||0),isSport=type==='sport',mediaTypeValue=x.media_type==='movie'?'movie':'tv',tmdbId=Number(x.tmdb_id||0),poster=x.poster_path&&!isSport?img(x.poster_path,'w154'):'';
  const ep=type==='episode'?`T${Number(x.season_number||0)} · E${Number(x.episode_number||0)}`:'',kind=isSport?'Esporte':type==='movie'?'Filme':'Episódio',meta=[kind,ep,time,runtime?runtime+' min':''].filter(Boolean).join(' · ');
  return `<article class="ct171-activity-item"${tmdbId?` data-media="${mediaTypeValue}:${tmdbId}"`:''}><div class="ct171-activity-thumb"${poster?` style="background-image:url('${poster}')"`:''}>${isSport?'🏆':''}</div><div><b>${esc(x.media_title||x.title||'Item assistido')}</b>${type==='episode'&&x.title&&x.title!==x.media_title?`<span>${esc(x.title)}</span>`:''}<small>${esc(meta)}</small></div>${tmdbId?'<i>›</i>':''}</article>`;
}
async function ct171OpenActivityDay(day){
  document.querySelector('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';ov.innerHTML=`<div class="ct171-activity-box"><div class="panel-head"><div><small>ATIVIDADE</small><h2>${new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items>${loading('Carregando o que foi assistido...')}</div></div>`;document.body.appendChild(ov);
  try{const rows=await rpc('cinetracker_activity_items_by_day_v1',{p_day:day,p_tz:tz()}),box=ov.querySelector('[data-ct171-activity-items]');if(box)box.innerHTML=(rows||[]).map(ct171ActivityItemHtml).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>'}catch(e){const box=ov.querySelector('[data-ct171-activity-items]');if(box)box.innerHTML=`<div class="error">${esc(e?.message||e)}</div>`}
}

/* ---------- handlers r171 ---------- */
document.addEventListener('click',e=>{
  const provider=e.target.closest?.('[data-ct171-provider]');if(provider){e.preventDefault();e.stopImmediatePropagation();ct171TopProvider=Number(provider.dataset.ct171Provider);document.querySelectorAll('[data-ct171-provider]').forEach(x=>x.classList.toggle('active',x===provider));void ct171PaintTopProvider(ct171TopProvider);return}
  const rewEp=e.target.closest?.('[data-ct171-rewatch-episode]');if(rewEp){e.preventDefault();e.stopImmediatePropagation();const [sn,en]=String(rewEp.dataset.ct171RewatchEpisode||'').split(':');void ct171RewatchEpisode(Number(sn),Number(en),rewEp);return}
  const rew=e.target.closest?.('[data-ct171-rewatch-media]');if(rew){e.preventDefault();e.stopImmediatePropagation();const [type,id]=String(rew.dataset.ct171RewatchMedia||'').split(':');if(type==='movie')void ct171RewatchMovie(Number(id),rew);return}
  const day=e.target.closest?.('[data-ct171-activity-day]');if(day){e.preventDefault();e.stopImmediatePropagation();void ct171OpenActivityDay(String(day.dataset.ct171ActivityDay));return}
  if(e.target.closest?.('[data-ct171-activity-close]')){e.preventDefault();document.querySelector('.ct171-activity-overlay')?.remove();return}
  const item=e.target.closest?.('.ct171-activity-item[data-media]');if(item){const [t,id]=String(item.dataset.media||'').split(':');document.querySelector('.ct171-activity-overlay')?.remove();go(`/${t==='movie'?'movie':'series'}/${Number(id)}`);return}
},true);

document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.ct171-activity-overlay')?.remove()});
document.addEventListener('click',e=>{const ov=e.target.closest?.('.ct171-activity-overlay');if(ov&&e.target===ov)ov.remove()});

/* Perfil pode ser redesenhado por r168/r169 depois do shell; mantenha os botões ativos. */
const ct171ProfileObserver=new MutationObserver(()=>{if(route()==='profile')ct171EnableAddButtons()});
setTimeout(()=>{const app=document.querySelector('#app');if(app)ct171ProfileObserver.observe(app,{subtree:true,childList:true})},0);
