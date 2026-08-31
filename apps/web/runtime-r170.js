/* r170: reliability, restored actions/person profile, mixed related media and global sports search */
window.__ctR170='reliability-actions-person-mixed-related-sports-search';
window.__ct170Reliability='rpc-coalescing-timeout-retry-no-home-preload-stampede';
window.__ct170Watchlist='media-kind-required-fixed';
window.__ct170Person='biography-split-filmography-favorite';
window.__ct170ProfileMore='functional-full-library-overlays';
window.__ct170Related='mixed-movie-tv-rich-metadata';
window.__ct170Favorite='media-liked-toggle';
window.__ct170Sports='global-entity-search';

/* ---------- transient Postgres timeout protection ---------- */
const ct170ApiBase=api;
const ct170ReadRpcNames=new Set([
  'cinetracker_home_live_v0997_r3','cinetracker_profile_media_dashboard_v0991','cinetracker_discovery_exclusions_v0994',
  'cinetracker_profile_payload_v0997','cinetracker_profile_quick_stats_v1','cinetracker_activity_by_day_v1',
  'cinetracker_sports_payload_v1','cinetracker_sport_stats_v1','cinetracker_calendar_watchlist_v0997'
]);
const ct170Inflight=new Map();
const ct170Sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ct170ReadRpc(path,options){
  if(String(options?.method||'GET').toUpperCase()!=='POST'||!String(path||'').startsWith('rpc/'))return false;
  return ct170ReadRpcNames.has(String(path).slice(4).split('?')[0]);
}
function ct170TimeoutError(e){const s=String(e?.message||e||'').toLowerCase();return s.includes('statement timeout')||s.includes('canceling statement')||s.includes('57014')}
api=async function(path,options={}){
  const safe=ct170ReadRpc(path,options),key=safe?String(path)+'|'+String(options?.body||''):'';
  if(safe&&ct170Inflight.has(key))return ct170Inflight.get(key);
  const run=(async()=>{
    for(let attempt=0;attempt<3;attempt++){
      try{return await ct170ApiBase(path,options)}catch(e){
        if(!safe||!ct170TimeoutError(e)||attempt===2)throw e;
        await ct170Sleep(attempt===0?180:420);
      }
    }
  })();
  if(!safe)return run;
  ct170Inflight.set(key,run);
  try{return await run}finally{if(ct170Inflight.get(key)===run)ct170Inflight.delete(key)}
};

/* Do not race a second Home/dashboard load in the background. Preload Discover sequentially. */
let ct170PreloadPromise=null,ct170PreloadStamp='';
ct163PreloadAll=async function(){
  if(!session)return null;
  const day=localDay();if(ct170PreloadPromise&&ct170PreloadStamp===day)return ct170PreloadPromise;ct170PreloadStamp=day;
  ct170PreloadPromise=(async()=>{
    await ct170Sleep(450);
    let c=null;try{c=await ct168Exclusions()}catch{}
    for(const tab of ['trending','popular','foryou','new','releases','anticipated','top']){
      try{const v=await ct169Snapshot(tab,c);if(v)ct163Write('discover:'+tab+':all',v)}catch{}
      await ct170Sleep(120);
    }
  })().finally(()=>{ct170PreloadPromise=null});
  return ct170PreloadPromise;
};

/* ---------- media identity: media_kind is NOT NULL ---------- */
function ct170MediaKind(type,d){
  if(type==='movie')return'movie';
  const gids=(d?.genre_ids||d?.genres?.map(g=>g?.id)||[]).map(Number),countries=d?.origin_country||[];
  return gids.includes(16)&&countries.includes('JP')?'anime':'series';
}
ensureMedia=async function(type,id){
  const mediaTypeValue=type==='movie'?'movie':'tv',tmdbId=Number(id);
  let rows=await api(`media?select=id,tmdb_id,media_type,media_kind,title,raw_tmdb&media_type=eq.${mediaTypeValue}&tmdb_id=eq.${tmdbId}&limit=1`).catch(()=>[]);
  if(rows?.[0])return rows[0];
  const d=await tmdb(`/${mediaTypeValue}/${tmdbId}`),kind=ct170MediaKind(mediaTypeValue,d);
  const body={
    tmdb_id:tmdbId,media_type:mediaTypeValue,media_kind:kind,title:d.title||d.name||`TMDB #${tmdbId}`,
    poster_path:d.poster_path||null,release_year:Number(String(d.release_date||d.first_air_date||'').slice(0,4))||null,
    runtime_minutes:mediaTypeValue==='movie'?(Number(d.runtime)||null):(Number((d.episode_run_time||[])[0]||d.last_episode_to_air?.runtime||0)||null),
    total_seasons:mediaTypeValue==='tv'?(Number(d.number_of_seasons)||null):null,total_episodes:mediaTypeValue==='tv'?(Number(d.number_of_episodes)||null):null,raw_tmdb:d
  };
  try{rows=await api('media',{method:'POST',body:JSON.stringify(body)})}
  catch(e){
    rows=await api(`media?select=id,tmdb_id,media_type,media_kind,title,raw_tmdb&media_type=eq.${mediaTypeValue}&tmdb_id=eq.${tmdbId}&limit=1`).catch(()=>[]);
    if(!rows?.[0])throw e;
  }
  return rows?.[0];
};

/* ---------- media favorite toggle ---------- */
async function ct170MediaFavorite(type,id,button){
  if(button){button.disabled=true;button.textContent='Salvando...'}
  try{
    const m=await ensureMedia(type,Number(id)),rows=await api(`media_overrides?select=id&media_id=eq.${Number(m.id)}&state=eq.Liked&limit=1`).catch(()=>[]);
    if(rows?.length)await api(`media_overrides?id=eq.${Number(rows[0].id)}`,{method:'DELETE'});
    else await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(m.id),state:'Liked',origin:'manual'})});
    profileCache=null;discoverCache.clear();
    const on=!rows?.length;
    if(button){button.dataset.on=on?'1':'0';button.classList.toggle('on',on);button.textContent=on?'♥ Favorito':'♡ Favorito'}
    toast(on?'Adicionado aos favoritos.':'Removido dos favoritos.');
  }catch(e){if(button)button.textContent=button.dataset.on==='1'?'♥ Favorito':'♡ Favorito';toast(e?.message||e)}finally{if(button)button.disabled=false}
}

/* ---------- richer mixed related cards ---------- */
function ct170GenreLabel(ids){
  const map={28:'Ação',12:'Aventura',16:'Animação',35:'Comédia',80:'Crime',99:'Documentário',18:'Drama',10751:'Família',14:'Fantasia',36:'História',27:'Terror',10402:'Música',9648:'Mistério',10749:'Romance',878:'Ficção científica',10770:'Cinema TV',53:'Suspense',10752:'Guerra',37:'Faroeste',10759:'Ação/Aventura',10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Sci-Fi/Fantasia',10766:'Novela',10767:'Talk Show',10768:'Guerra/Política'};
  return (ids||[]).map(Number).map(x=>map[x]).filter(Boolean).slice(0,2).join(' · ');
}
function ct170RelatedCard(x){
  const type=mediaType(x),id=mediaTmdb(x),p=mediaPoster(x),score=Number(x?.vote_average||0),kind=type==='movie'?'Filme':'Série',genres=ct170GenreLabel(x?.genre_ids||[]);
  return `<article class="ct169-related-card ct170-related-card" data-ct169-related-card="${type}:${id}" data-ct170-related="${type}:${id}"><button class="ct169-related-open" type="button" data-media="${type}:${id}"><div class="ct169-related-poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><b>${esc(mediaTitle(x))}</b><span class="ct170-kind">${kind}</span><small class="ct170-related-meta">${[ct169Year(x),genres,score?`TMDB ${score.toFixed(1)}`:''].filter(Boolean).join(' · ')}</small></button><div class="ct169-related-actions"><button type="button" data-ct169-related-watch="${type}:${id}">＋ Watchlist</button><button type="button" data-ct169-related-seen="${type}:${id}">✓ Visto</button></div></article>`;
}
function ct170MergeRelated(mainType,id,sameRows,otherRows,c){
  const clean=rows=>ct166Unique(rows).filter(x=>Number(x?.id||0)!==Number(id)&&mediaPoster(x)&&(!c||!ct166Known(x,c)));
  const same=clean(sameRows),other=clean(otherRows),out=[];let i=0;
  while(out.length<16&&(i<same.length||i<other.length)){if(i<same.length)out.push(same[i]);if(out.length<16&&i<other.length)out.push(other[i]);i++}
  return out;
}
async function ct170EnrichRelated(rows,seq){
  let cursor=0;
  async function worker(){
    while(cursor<rows.length){
      const x=rows[cursor++],type=mediaType(x),id=mediaTmdb(x),el=document.querySelector(`[data-ct170-related="${type}:${id}"] .ct170-related-meta`);if(!el)continue;
      try{
        const d=await tmdb(`/${type}/${id}`,type==='movie'?{append_to_response:'release_dates'}:{append_to_response:'content_ratings'});if(seq!==navSeq)return;
        const genres=(d.genres||[]).map(g=>g.name).slice(0,2).join(' · '),runtime=type==='movie'&&Number(d.runtime)>0?`${Number(d.runtime)} min`:'',cert=ct169Certification(type,d),score=Number(d.vote_average||0);
        el.textContent=[ct169Year(d),genres,runtime,cert?`Class. ${cert}`:'',score?`TMDB ${score.toFixed(1)}`:''].filter(Boolean).join(' · ');
      }catch{}
      await ct170Sleep(45);
    }
  }
  await Promise.all([worker(),worker()]);
}
function ct170HeroHtml(kind,id,d,providers,state){
  const p=d.poster_path?img(d.poster_path,'w500'):'',back=d.backdrop_path?img(d.backdrop_path,'w780'):'',title=d.title||d.name||'Sem título',creator=ct169Creator(kind,d),cert=ct169Certification(kind,d),runtime=ct169Runtime(kind,d),genres=(d.genres||[]).map(g=>g.name).join(' · '),rating=Number(d.vote_average||0),episodes=kind==='tv'?Number(d.number_of_episodes||0):0,status=kind==='tv'?d.status:'',watchOn=Boolean(state?.is_watchlist),seenOn=Boolean(state?.is_seen||state?.is_completed),favoriteOn=Boolean(state?.is_favorite),meta=[ct169Year(d),runtime,cert,genres].filter(Boolean).join(' · ');
  return `${back?`<div class="ct169-detail-backdrop" style="background-image:linear-gradient(90deg,#05090de8 0%,#05090dba 50%,#05090d8c),url('${back}')"></div>`:''}<section class="ct169-detail-hero"><div class="ct169-poster-wrap"><div class="ct169-detail-poster"${p?` style="background-image:url('${p}')"`:''}></div>${seenOn?'<span class="ct169-poster-state">✓ ASSISTIDO</span>':watchOn?'<span class="ct169-poster-state watch">▣ NA WATCHLIST</span>':''}</div><div class="ct169-detail-copy"><div class="ct169-kicker">${kind==='movie'?'FILME':'SÉRIE'}</div><h1>${esc(title)}</h1>${creator?`<div class="ct169-by">${kind==='movie'?'Dirigido por ':'Criado por '}<b>${esc(creator)}</b></div>`:''}<div class="ct169-meta">${esc(meta)}${rating?` · ★ ${rating.toFixed(1)}`:''}${episodes?` · ${episodes} eps.`:''}${status?` · ${esc(status)}`:''}</div><p>${esc(d.overview||'Sem sinopse disponível.')}</p><div class="ct169-main-actions"><button class="${watchOn?'on ':''}" type="button" data-detail-watchlist="${kind}:${id}" ${watchOn?'disabled':''}>${watchOn?'✓ Na Watchlist':'＋ Watchlist'}</button><button class="${seenOn?'on ':''}" type="button" data-detail-seen="${kind}:${id}" ${seenOn?'disabled':''}>${seenOn?'✓ Visto':'✓ Marcar como visto'}</button><button class="ct170-favorite ${favoriteOn?'on':''}" type="button" data-ct170-detail-favorite="${kind}:${id}" data-on="${favoriteOn?'1':'0'}">${favoriteOn?'♥ Favorito':'♡ Favorito'}</button></div></div>${ct169ProvidersHtml(providers)}</section>`;
}

renderDetail=async function(kind,id,seq){
  const tmdbKind=kind==='series'?'tv':'movie',otherType=tmdbKind==='movie'?'tv':'movie';
  setApp(shell('Detalhes','Informações, temporadas, elenco e títulos relacionados.',kind,`<div class="page ct169-detail-page" data-detail><div class="ct169-detail-loading"></div></div>`));
  try{
    const [d,providers,rec,similar,ctx]=await Promise.all([
      tmdb(`/${tmdbKind}/${id}`,tmdbKind==='tv'?{append_to_response:'credits,content_ratings'}:{append_to_response:'credits,release_dates'}),
      safeTmdb(`/${tmdbKind}/${id}/watch/providers`),safeTmdb(`/${tmdbKind}/${id}/recommendations`,{page:1}),safeTmdb(`/${tmdbKind}/${id}/similar`,{page:1}),ct168Exclusions().catch(()=>null)
    ]);
    if(seq!==navSeq)return;
    const genreIds=(d.genres||[]).map(g=>g.id).filter(Boolean).slice(0,3).join('|'),other=await safeTmdb(`/discover/${otherType}`,{with_genres:genreIds||undefined,sort_by:'popularity.desc',include_adult:false,page:1});if(seq!==navSeq)return;
    const sameRows=[...(rec.results||[]),...(similar.results||[])].map(x=>({...x,media_type:tmdbKind})),otherRows=(other.results||[]).map(x=>({...x,media_type:otherType})),related=ct170MergeRelated(tmdbKind,id,sameRows,otherRows,ctx),state=ct169MainState(ctx,tmdbKind,id);
    ct169CurrentDetail={id:Number(id),kind:tmdbKind,detail:d};
    const cast=d?.credits?.cast||[],seasons=(d?.seasons||[]).filter(s=>Number(s.season_number)>0),h=$('[data-detail]');
    h.innerHTML=ct170HeroHtml(tmdbKind,id,d,providers,state)+
      (tmdbKind==='tv'?`<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>SÉRIE</small><h2>Temporadas</h2></div><span>${seasons.length}</span></div><div class="ct169-season-row">${ct169SeasonCards(id,seasons)}</div></section><section class="ct169-detail-section ct169-rating-section"><div class="ct169-section-head"><div><small>NOTAS DOS EPISÓDIOS</small><h2>Melhores e piores por temporada</h2></div><span>role para o lado →</span></div><div class="ct169-season-chart-carousel" data-ct169-season-charts>${seasons.map(s=>`<article class="ct169-season-chart-card" data-ct169-chart-season="${Number(s.season_number)}"><div class="ct169-chart-title"><b>${esc(s.name||('Temporada '+s.season_number))}</b><small>${Number(s.episode_count||0)} episódios</small></div><div class="ct169-chart-body"><div class="ct169-chart-skeleton"></div></div></article>`).join('')}</div></section>`:'')+
      `<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>ELENCO</small><h2>Atores</h2></div><span>${Math.min(18,cast.length)}</span></div><div class="ct169-cast-row">${ct169CastHtml(cast)}</div></section>`+
      `<section class="ct169-detail-section"><div class="ct169-section-head"><div><small>RECOMENDAÇÕES</small><h2>Títulos Relacionados</h2></div><span>Filmes + Séries · ${related.length}</span></div><div class="ct169-related-row">${related.length?related.map(ct170RelatedCard).join(''):'<div class="empty">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>'}</div></section>`;
    if(tmdbKind==='tv')void ct169LoadSeasonGraphs(Number(id),seasons,seq);
    void ct170EnrichRelated(related,seq);
  }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail('Falha ao abrir detalhes: '+(e?.message||e),kind==='movie'?'home':'discover')}
};

/* ---------- restored person page ---------- */
function ct170PersonCreditRows(rows,type){
  const seen=new Set();return (rows||[]).filter(x=>x?.media_type===type&&x?.id&&(x.title||x.name)).filter(x=>{const k=type+':'+x.id;if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>String(b.release_date||b.first_air_date||'').localeCompare(String(a.release_date||a.first_air_date||''))||Number(b.popularity||0)-Number(a.popularity||0));
}
async function ct170TogglePersonFavorite(id,name,profilePath,btn){
  btn.disabled=true;const on=btn.dataset.on==='1';btn.textContent='Salvando...';
  try{
    const rows=await api(`favorite_actors?select=id&tmdb_person_id=eq.${Number(id)}&limit=1`).catch(()=>[]);
    if(rows?.length)await api(`favorite_actors?id=eq.${Number(rows[0].id)}`,{method:'DELETE'});
    else await api('favorite_actors',{method:'POST',body:JSON.stringify({tmdb_person_id:Number(id),actor_name:String(name||('TMDB #'+id)),profile_path:profilePath||null})});
    const next=!rows?.length;btn.dataset.on=next?'1':'0';btn.classList.toggle('on',next);btn.textContent=next?'♥ Ator favorito':'♡ Adicionar ator aos favoritos';profileCache=null;toast(next?'Ator adicionado aos favoritos.':'Ator removido dos favoritos.');
  }catch(e){btn.textContent=on?'♥ Ator favorito':'♡ Adicionar ator aos favoritos';toast(e?.message||e)}finally{btn.disabled=false}
}
renderPerson=async function(id,seq){
  setApp(shell('Pessoa','Biografia e filmografia completa.','discover',`<div class="page ct170-person-page" data-detail>${loading('Carregando pessoa...')}</div>`));
  try{
    const [d,c,fav]=await Promise.all([tmdb(`/person/${id}`),tmdb(`/person/${id}/combined_credits`),api(`favorite_actors?select=id&tmdb_person_id=eq.${Number(id)}&limit=1`).catch(()=>[])]);if(seq!==navSeq)return;
    let biography=String(d.biography||'').trim(),bioLang='';if(!biography){try{const en=await tmdb(`/person/${id}`,{language:'en-US'});biography=String(en.biography||'').trim();if(biography)bioLang=' · disponível em inglês'}catch{}}
    const movies=ct170PersonCreditRows(c.cast||[],'movie'),series=ct170PersonCreditRows(c.cast||[],'tv'),on=Boolean(fav?.length),photo=d.profile_path?img(d.profile_path,'w500'):'',facts=[d.birthday?`Nascimento: ${new Date(d.birthday+'T12:00:00').toLocaleDateString('pt-BR')}`:'',d.place_of_birth||'',d.known_for_department||''].filter(Boolean).join(' · '),h=$('[data-detail]');
    h.innerHTML=`<section class="ct170-person-hero"><div class="ct170-person-photo"${photo?` style="background-image:url('${photo}')"`:''}></div><div><div class="ct169-kicker">PESSOA</div><h1>${esc(d.name||'Pessoa')}</h1><div class="ct170-person-facts">${esc(facts)}</div><button type="button" class="ct170-person-fav ${on?'on':''}" data-ct170-person-favorite="${Number(id)}" data-name="${esc(d.name||'')}" data-profile-path="${esc(d.profile_path||'')}" data-on="${on?'1':'0'}">${on?'♥ Ator favorito':'♡ Adicionar ator aos favoritos'}</button><h3>Biografia${esc(bioLang)}</h3><p class="ct170-biography">${esc(biography||'Biografia não disponível no TMDB.')}</p></div></section><section class="panel ct170-filmography"><div class="panel-head"><h2>Filmes</h2><small>${movies.length}</small></div><div class="row">${movies.length?movies.map(mediaCard).join(''):'<div class="empty">Nenhum filme encontrado.</div>'}</div></section><section class="panel ct170-filmography"><div class="panel-head"><h2>Séries</h2><small>${series.length}</small></div><div class="row">${series.length?series.map(mediaCard).join(''):'<div class="empty">Nenhuma série encontrada.</div>'}</div></section>`;
  }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail('Falha ao carregar pessoa: '+(e?.message||e),'discover')}
};

/* ---------- functional Profile “Ver mais” ---------- */
function ct170ProfileMoreRows(action,d){
  const r=profileRows(d||{});if(action==='series')return{title:'Séries',rows:r.series,kind:'media'};if(action==='filmes')return{title:'Filmes',rows:r.movies,kind:'media'};if(action==='series favoritas')return{title:'Séries Favoritas',rows:r.seriesFav,kind:'media'};if(action==='filmes favoritos')return{title:'Filmes Favoritos',rows:r.movieFav,kind:'media'};if(action==='atores favoritos')return{title:'Atores Favoritos',rows:d?.favorite_actors||[],kind:'person'};return null;
}
function ct170ShowProfileMore(action,d){
  document.querySelector('.ct170-more-overlay')?.remove();const info=ct170ProfileMoreRows(action,d);if(!info)return;
  const ov=document.createElement('div');ov.className='ct170-more-overlay';const cards=info.kind==='person'?info.rows.map(a=>`<article class="card"><button type="button" data-person="${Number(a.tmdb_person_id||0)}"><div class="poster"${a.profile_path?` style="background-image:url('${img(a.profile_path,'w342')}')"`:''}></div><div class="card-body"><b>${esc(a.actor_name||'Ator')}</b><small>Ator favorito</small></div></button></article>`).join(''):info.rows.map(mediaCard).join('');
  ov.innerHTML=`<div class="ct170-more-box"><div class="panel-head"><div><small>PERFIL</small><h2>${esc(info.title)}</h2></div><button type="button" class="btn" data-ct170-more-close>✕ Fechar</button></div><div class="ct170-more-grid">${cards||'<div class="empty">Nenhum item.</div>'}</div></div>`;document.body.appendChild(ov);
}
async function ct170OpenProfileMore(action){
  let d=profileCache;if(!d?.dashboard?.length){try{d=await rpc('cinetracker_profile_payload_v0997',{p_tz:tz()});profileCache=d||d}catch(e){toast(e?.message||e);return}}
  ct170ShowProfileMore(action,d||{});
}

/* ---------- global Sports team/entity search ---------- */
const ct170SportsSearch={query:'',loading:false,entities:[],error:'',timer:0};
function ct170RenderSportsSearch(p=sportsCache||{}){
  if(!ct170SportsSearch.query)return;const root=$('[data-sports]'),grid=root?.querySelector('.event-grid'),section=grid?.closest('section.panel');if(!grid)return;
  const head=section?.querySelector('.panel-head h2');if(head)head.textContent='Resultados esportivos';
  const fav=new Set((p?.favorites||[]).map(x=>Number(x.entity_id)));
  if(ct170SportsSearch.loading){grid.innerHTML='<div class="loader">Buscando times e competições...</div>';return}
  if(ct170SportsSearch.error){grid.innerHTML=`<div class="error">${esc(ct170SportsSearch.error)}</div>`;return}
  const rows=ct170SportsSearch.entities||[];
  grid.innerHTML=rows.length?`<div class="ct170-sports-entities">${rows.map(x=>{const on=fav.has(Number(x.id));return `<article class="ct170-sports-entity"><div class="ct170-sports-logo"${x.logo_url?` style="background-image:url('${esc(x.logo_url)}')"`:''}></div><div><small>${esc(x.sport_label||x.sport_slug||'Esporte')} · ${esc(x.entity_type==='competition'?'Competição':'Time')}</small><b>${esc(x.name||'')}</b>${x.country?`<em>${esc(x.country)}</em>`:''}</div><button type="button" class="fav ${on?'on':''}" data-sport-fav="${Number(x.id)}" data-on="${on?'1':'0'}">${on?'★ Favorito':'☆ Favoritar'}</button></article>`}).join('')}</div>`:'<div class="empty">Nenhum time ou competição encontrado.</div>';
}
const ct170PaintSportsBase=paintSports;
paintSports=function(p=sportsCache||{}){ct170PaintSportsBase(p);requestAnimationFrame(()=>{ct169PolishSportsTools();ct170RenderSportsSearch(p)})};
async function ct170RunSportsSearch(q){
  const token=q.trim();if(token.length<2){ct170SportsSearch.query='';ct170SportsSearch.entities=[];ct170SportsSearch.error='';paintSports();return}
  ct170SportsSearch.query=token;ct170SportsSearch.loading=true;ct170SportsSearch.error='';paintSports();
  try{const d=await edge('ct-sports-search',{query:token,limit:30},20000);if(ct170SportsSearch.query!==token)return;ct170SportsSearch.entities=Array.isArray(d?.entities)?d.entities:[]}
  catch(e){if(ct170SportsSearch.query===token)ct170SportsSearch.error=String(e?.message||e)}finally{if(ct170SportsSearch.query===token){ct170SportsSearch.loading=false;paintSports()}}
}

/* ---------- r170 events ---------- */
document.addEventListener('click',e=>{
  const f=e.target.closest?.('[data-ct170-detail-favorite]');if(f){e.preventDefault();e.stopImmediatePropagation();const [type,id]=String(f.dataset.ct170DetailFavorite||'').split(':');void ct170MediaFavorite(type,Number(id),f);return}
  const pf=e.target.closest?.('[data-ct170-person-favorite]');if(pf){e.preventDefault();e.stopImmediatePropagation();void ct170TogglePersonFavorite(Number(pf.dataset.ct170PersonFavorite),pf.dataset.name,pf.dataset.profilePath,pf);return}
  const more=e.target.closest?.('[data-ct-more]');if(more&&String(more.dataset.ctMore||'').startsWith('profile:')){e.preventDefault();e.stopImmediatePropagation();void ct170OpenProfileMore(String(more.dataset.ctMore).slice(8));return}
  if(e.target.closest?.('[data-ct170-more-close]')){e.preventDefault();document.querySelector('.ct170-more-overlay')?.remove();return}
  const ov=e.target.closest?.('.ct170-more-overlay');if(ov&&e.target===ov)ov.remove();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('.ct170-more-overlay')?.remove()});
document.addEventListener('input',e=>{
  if(!e.target.matches?.('[data-sports-search]'))return;
  e.stopImmediatePropagation();const q=e.target.value.trim();sportsState.query=q;ct170SportsSearch.query=q;clearTimeout(ct170SportsSearch.timer);
  if(q.length<2){ct170SportsSearch.loading=false;ct170SportsSearch.entities=[];ct170SportsSearch.error='';paintSports();return}
  ct170SportsSearch.loading=true;paintSports();ct170SportsSearch.timer=setTimeout(()=>void ct170RunSportsSearch(q),260);
},true);
