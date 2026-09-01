/* r172: Home episode details, logical seen state, clean streaming catalog and better series framing */
window.__ctR172='home-episode-meta-logical-seen-canonical-streamings-detail-frame';
window.__ct172Home='episode-name-rating-release-without-removing-existing-meta';
window.__ct172Seen='no-global-card-badge-logical-series-episode-checks';
window.__ct172Providers='only-10-canonical-services-no-plan-or-channel-duplicates';
window.__ct172Frame='two-column-detail-and-roomier-season-drawer';

ct170ReadRpcNames.add('cinetracker_home_live_v0997_r4');

/* ---------- Home: manter tudo que já existe + nome, nota e lançamento do episódio atual ---------- */
function ct172EpisodeDate(v){
  const s=String(v||'').slice(0,10);if(!s)return 'data —';
  try{return new Date(s+'T12:00:00').toLocaleDateString('pt-BR')}catch{return s}
}
function ct172EpisodeLabel(x){
  const sn=Number(x?.latest_episode_meta_season_number||x?.latest_released_season_number||0),en=Number(x?.latest_episode_meta_episode_number||x?.latest_released_episode_number||0);
  const fallback=sn&&en?'S'+String(sn).padStart(2,'0')+'E'+String(en).padStart(2,'0'):'Episódio';
  return String(x?.latest_episode_name||'').trim()||fallback;
}
homeSeriesRow158=function(x){
  const id=mediaTmdb(x),p=mediaPoster(x),seen=Math.max(0,Number(x.watched_episodes||0)),released=Math.max(0,Number(x.released_episodes||0)),total=Math.max(released,Number(x.total_episodes||0)),missing=Math.max(0,Number(x.history_missing_episodes??(released-seen))||0),caught=Boolean(x.is_caught_up);
  const status=caught?(missing>0?'Em dia · '+missing+' antigo'+(missing===1?'':'s')+' não visto'+(missing===1?'':'s'):'Em dia'):(missing>0?'Faltam '+missing:'Próximo episódio pendente');
  const current=x.latest_released_season_number&&x.latest_released_episode_number?' · atual S'+String(x.latest_released_season_number).padStart(2,'0')+'E'+String(x.latest_released_episode_number).padStart(2,'0'):'';
  const sn=Number(x.latest_episode_meta_season_number||x.latest_released_season_number||0),en=Number(x.latest_episode_meta_episode_number||x.latest_released_episode_number||0),name=ct172EpisodeLabel(x),score=Number(x.latest_episode_vote_average||0),date=String(x.latest_episode_air_date||'').slice(0,10),complete=Boolean(String(x.latest_episode_name||'').trim()&&date);
  return '<div class="home-action-row"><div class="media-row" data-media="tv:'+id+'"><div class="thumb"'+(p?' style="background-image:url(\''+img(p,'w154')+'\')"':'')+'></div><div class="ct172-home-copy"><b>'+esc(mediaTitle(x))+'</b><small>'+seen+'/'+(total||'?')+' · '+esc(status)+esc(current)+'</small><small class="ct172-home-episode" data-ct172-home-episode="'+id+':'+sn+':'+en+'" data-ct172-complete="'+(complete?'1':'0')+'"><span data-ct172-ep-name>Ep: '+esc(name)+'</span><span data-ct172-ep-score>★ '+(score?score.toFixed(1):'—')+'</span><span data-ct172-ep-date>'+esc(ct172EpisodeDate(date))+'</span></small></div><span class="badge">'+(caught?'✓':'›')+'</span></div>'+(!caught?'<button class="home-check" type="button" title="Marcar próximo episódio lançado como assistido" data-home-mark-episode="'+Number(x.media_id||0)+'">✓</button>':'')+'</div>';
};

const ct172HomeSeasonCache=new Map();
async function ct172Season(showId,sn){
  const key=showId+':'+sn;if(ct172HomeSeasonCache.has(key))return ct172HomeSeasonCache.get(key);
  const p=tmdb('/tv/'+Number(showId)+'/season/'+Number(sn)).catch(()=>({episodes:[]}));ct172HomeSeasonCache.set(key,p);return p;
}
async function ct172HydrateHomeEpisode(el){
  if(!el?.isConnected||el.dataset.ct172Complete==='1')return;
  let [showId,sn,en]=String(el.dataset.ct172HomeEpisode||'').split(':').map(Number),ep=null;
  try{
    if(showId>0&&sn>0&&en>0){const sd=await ct172Season(showId,sn);ep=(sd.episodes||[]).find(x=>Number(x.episode_number)===en)||null}
    if(!ep&&showId>0){const d=await tmdb('/tv/'+showId);ep=d?.last_episode_to_air||null;if(ep){sn=Number(ep.season_number||0);en=Number(ep.episode_number||0)}}
  }catch{}
  if(!el.isConnected)return;
  const name=String(ep?.name||'').trim()||(sn&&en?'S'+String(sn).padStart(2,'0')+'E'+String(en).padStart(2,'0'):'Episódio'),score=Number(ep?.vote_average||0),date=String(ep?.air_date||'').slice(0,10);
  const a=el.querySelector('[data-ct172-ep-name]'),b=el.querySelector('[data-ct172-ep-score]'),c=el.querySelector('[data-ct172-ep-date]');if(a)a.textContent='Ep: '+name;if(b)b.textContent='★ '+(score?score.toFixed(1):'—');if(c)c.textContent=ct172EpisodeDate(date);el.dataset.ct172Complete='1';
}
async function ct172HydrateHomeEpisodes(){
  const rows=[...document.querySelectorAll('[data-ct172-home-episode][data-ct172-complete="0"]')];let cursor=0;
  async function worker(){while(cursor<rows.length){const el=rows[cursor++];await ct172HydrateHomeEpisode(el)}}
  await Promise.all([worker(),worker(),worker(),worker()]);
}
const ct172PaintHomeBase=paintHome;
paintHome=function(){ct172PaintHomeBase();requestAnimationFrame(()=>void ct172HydrateHomeEpisodes())};
renderHome=async function(seq){
  setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home><div class="ct169-home-skeleton" aria-hidden="true"><i></i><i></i><i></i></div></div>`));
  try{
    const data=await rpc('cinetracker_home_live_v0997_r4',{p_today:localDay()});
    if(seq!==navSeq||route()!=='home')return;
    homeCache=data||{};paintHome();
  }catch(e){if(seq!==navSeq||route()!=='home')return;const h=$('[data-home]');if(h)h.innerHTML=fail('Falha ao carregar Home: '+(e?.message||e),'home')}
};
const ct172MarkNextBase=markNextEpisode158;
markNextEpisode158=async function(mediaId){
  const out=await ct172MarkNextBase(mediaId);
  try{const h=await rpc('cinetracker_home_live_v0997_r4',{p_today:localDay()});homeCache=h||homeCache;if(route()==='home')paintHome()}catch{}
  return out;
};

/* ---------- Remover o selo grande VISTO dos cards; manter estados normais da tela e episódios ---------- */
try{ct171Observer.disconnect()}catch{}
ct171DecorateSeen=async function(){document.querySelectorAll('.ct171-seen-badge').forEach(x=>x.remove());document.querySelectorAll('.ct171-seen-host').forEach(x=>x.classList.remove('ct171-seen-host'))};
setTimeout(()=>void ct171DecorateSeen(),0);

/* ---------- Série marcada como vista: refletir o estado lógico em TODOS os episódios ---------- */
ct169WatchedSet=async function(showId){
  try{
    const d=await rpc('cinetracker_series_episode_state_v1',{p_tmdb_id:Number(showId),p_today:localDay()});
    const rows=Array.isArray(d?.episodes)?d.episodes:[];
    return new Set(rows.map(x=>Number(x.season_number)+':'+Number(x.episode_number)));
  }catch(e){
    try{return await ct171WatchedSetBase(showId)}catch{return new Set()}
  }
};

/* ---------- Somente os 10 streamings solicitados, sempre consolidados no serviço principal ---------- */
const ct172ProviderDefs=[
  {key:'hbo-max',label:'HBO Max'},
  {key:'prime-video',label:'Amazon Prime Video'},
  {key:'netflix',label:'Netflix'},
  {key:'globoplay',label:'Globoplay'},
  {key:'disney-plus',label:'Disney+'},
  {key:'apple-tv-plus',label:'Apple TV+'},
  {key:'paramount-plus',label:'Paramount+'},
  {key:'looke',label:'Looke'},
  {key:'mubi',label:'Mubi'},
  {key:'crunchyroll',label:'Crunchyroll'}
];
const ct172ProviderDef=k=>ct172ProviderDefs.find(x=>x.key===k)||null;
function ct172ProviderKey(name){
  const n=norm(name);if(!n)return null;
  if(n.includes('amazon channel')||n.includes('channels'))return null;
  if(n==='max'||n==='hbo max')return'hbo-max';
  if(n==='amazon prime video'||n==='prime video'||n==='amazon prime video with ads')return'prime-video';
  if(n==='netflix'||n==='netflix standard with ads')return'netflix';
  if(n==='globoplay')return'globoplay';
  if(n==='disney plus'||n==='disney')return'disney-plus';
  if(n==='apple tv plus')return'apple-tv-plus';
  if(n==='paramount plus'||n==='paramount plus premium')return'paramount-plus';
  if(n==='looke')return'looke';
  if(n==='mubi')return'mubi';
  if(n==='crunchyroll')return'crunchyroll';
  return null;
}
function ct172VariantScore(name,key){
  const n=norm(name),base={
    'hbo-max':['max','hbo max'],'prime-video':['amazon prime video','prime video'],'netflix':['netflix'],'globoplay':['globoplay'],'disney-plus':['disney plus','disney'],'apple-tv-plus':['apple tv plus'],'paramount-plus':['paramount plus'],'looke':['looke'],'mubi':['mubi'],'crunchyroll':['crunchyroll']
  }[key]||[];return base.includes(n)?0:1;
}
ct171Providers=async function(){
  if(ct171ProviderList)return ct171ProviderList;if(ct171ProviderPromise)return ct171ProviderPromise;
  ct171ProviderPromise=(async()=>{
    const [m,t]=await Promise.all([safeTmdb('/watch/providers/movie',{watch_region:'BR'}),safeTmdb('/watch/providers/tv',{watch_region:'BR'})]),picked=new Map();
    for(const p of [...(m.results||[]),...(t.results||[])]){
      const key=ct172ProviderKey(p.provider_name),id=Number(p.provider_id||0);if(!key||!id)continue;const score=ct172VariantScore(p.provider_name,key),old=picked.get(key);
      if(!old||score<old._score||(score===old._score&&Number(p.display_priority||999)<Number(old.display_priority||999)))picked.set(key,{...p,_score:score,_ct172Key:key});
    }
    ct171ProviderList=ct172ProviderDefs.map(d=>picked.get(d.key)).filter(Boolean).map(p=>({...p,provider_name:ct172ProviderDef(p._ct172Key)?.label||p.provider_name}));return ct171ProviderList;
  })();try{return await ct171ProviderPromise}finally{ct171ProviderPromise=null}
};
ct171ProviderGroup=function(region){
  const picked=new Map(),groups=[['Stream',0,[...(region?.flatrate||[]),...(region?.free||[]),...(region?.ads||[])]],['Alugar',10,region?.rent||[]],['Comprar',20,region?.buy||[]]];
  for(const [label,bucket,rows] of groups)for(const p of rows||[]){
    const key=ct172ProviderKey(p.provider_name);if(!key)continue;const score=bucket+ct172VariantScore(p.provider_name,key),old=picked.get(key);if(!old||score<old._ct172Score)picked.set(key,{...p,_label:label,_ct172Score:score,_ct172Key:key,provider_name:ct172ProviderDef(key)?.label||p.provider_name});
  }
  return ct172ProviderDefs.map(d=>picked.get(d.key)).filter(Boolean);
};
ct171WhereHtml=function(payload){
  const region=payload?.results?.BR||{},rows=ct171ProviderGroup(region),link=String(region?.link||'');
  return `<section class="ct171-watch-section"><div class="ct171-watch-head"><div><h2>Onde Assistir <span>›</span></h2><div class="ct171-justwatch"><b>▧ JustWatch</b><small> somente streamings selecionados · disponibilidade informada pelo TMDB</small></div></div>${link?`<a href="${esc(link)}" target="_blank" rel="noopener">ver opções ↗</a>`:''}</div>${rows.length?`<div class="ct171-provider-row">${rows.map(p=>`<div class="ct171-provider-card"><div class="ct171-provider-logo"${p.logo_path?` style="background-image:url('${img(p.logo_path,'w154')}')"`:''}></div><b>${esc(p.provider_name||'Streaming')}</b><small>${esc(p._label)}</small></div>`).join('')}</div>`:'<div class="empty">Nenhum dos streamings selecionados está disponível para este título no Brasil neste momento.</div>'}</section>`;
};

/* Limpar qualquer lista antiga de provedores mantida na memória ao carregar a revisão. */
ct171ProviderList=null;ct171ProviderPromise=null;if(ct171TopProvider)ct171TopProvider=null;
