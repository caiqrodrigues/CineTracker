/* r192 Web — strict discover/search + in-place favorites + profile full-cache */
(() => {
'use strict';
if (window.__ctR192WebLoaded) return;
window.__ctR192WebLoaded = true;
window.__ctR192Web='discover-bilingual-profile-final';
window.__ctWebRevision='r192-discover-bilingual-profile';

const norm192=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc192=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route192=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const mediaType192=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
const positive192=v=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n:0};
const mediaId192=x=>positive192(x?.raw_tmdb?.source_tmdb_id)||positive192(x?.tmdb_id)||positive192(x?.id)||positive192(x?.raw_tmdb?.id);
const aliases192=x=>{const r=x?.raw_tmdb||{};return [...new Set([x?.title,x?.name,x?.original_title,x?.original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(norm192).filter(Boolean))]};
const date192=x=>String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,10);

function uniqueMedia192(rows){
  const byId=new Set(),bySig=new Set(),out=[];
  for(const x of rows||[]){
    if(!x||typeof x!=='object')continue;
    const type=mediaType192(x),id=mediaId192(x),names=aliases192(x),date=date192(x),idKey=id?type+':'+id:'',sig=type+':'+(names[0]||'')+':'+date;
    if((idKey&&byId.has(idKey))||(!idKey&&names[0]&&bySig.has(sig)))continue;
    if(idKey)byId.add(idKey);if(names[0])bySig.add(sig);out.push(x);
  }
  return out;
}
try{ctR180Unique=uniqueMedia192}catch{}

try{
  const filtersBase192=ctR180FiltersHtml;
  ctR180FiltersHtml=function(){
    if(String(discoverState?.tab||'foryou')==='foryou'){discoverState.type='all';return ''}
    return filtersBase192.apply(this,arguments);
  };
}catch{}

function knownContext192(){
  let dash=[];try{dash=Array.isArray(ct186ContextValue?.dash)?ct186ContextValue.dash:[]}catch{}
  const ids=new Set(),aliases=new Set();
  for(const x of dash){
    let known=false;
    try{known=Boolean(ct186DashHistory(x)||ct186DashWatchlist(x))}catch{known=Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||x?.is_watchlist||Number(x?.watched_episodes||0)>0||x?.last_watched_at)}
    if(!known)continue;
    const type=mediaType192(x),id=mediaId192(x);if(id)ids.add(type+':'+id);for(const a of aliases192(x))aliases.add(type+':'+a);
  }
  try{
    for(const id of ct186ContextValue?.historyMovieIds||[])if(positive192(id))ids.add('movie:'+positive192(id));
    for(const id of ct186ContextValue?.watchMovieIds||[])if(positive192(id))ids.add('movie:'+positive192(id));
    for(const id of ct186ContextValue?.historyTvIds||[])if(positive192(id))ids.add('tv:'+positive192(id));
    for(const id of ct186ContextValue?.watchTvIds||[])if(positive192(id))ids.add('tv:'+positive192(id));
    for(const a of ct186ContextValue?.historyAliases||[])aliases.add(String(a));
    for(const a of ct186ContextValue?.watchAliases||[])aliases.add(String(a));
  }catch{}
  return{ids,aliases};
}
function known192(x,c){const type=mediaType192(x),id=mediaId192(x);if(id&&c.ids.has(type+':'+id))return true;return aliases192(x).some(a=>c.aliases.has(type+':'+a))}
function sanitizeForYou192(data){
  if(!data||Array.isArray(data)||typeof data!=='object')return data;
  const c=knownContext192(),fresh=data._ct186_fresh||data._ct166_fresh||{},reserve=data._ct186_reserve||{};
  const clean=kind=>uniqueMedia192([...(fresh?.[kind]||[]),...(reserve?.[kind]||[])]).filter(x=>!known192(x,c));
  const nextFresh={movie:clean('movie'),series:clean('series'),anime:clean('anime')},out={...data,_ct186_fresh:nextFresh,_ct166_fresh:nextFresh};
  const first=(kind,current)=>current&&!known192(current,c)?current:(nextFresh[kind]?.[0]||null);
  out.movie=first('movie',data.movie);out.series=first('series',data.series);out.anime=first('anime',data.anime);
  if(data.daily&&known192(data.daily,c))out.daily=nextFresh.movie?.find(x=>mediaId192(x)!==mediaId192(out.movie))||nextFresh.movie?.[0]||null;
  return out;
}
try{
  const forYouRenderBase192=ct166RenderForYou;
  ct166RenderForYou=function(data){const clean=sanitizeForYou192(data||{});try{ct186ForYouData=clean}catch{}try{ct166ForYouData=clean}catch{}return forYouRenderBase192(clean)};
}catch{}

function enforceDiscover192(){
  if(route192()!=='discover')return;
  const foryou=String(discoverState?.tab||'foryou')==='foryou',filters=document.querySelector('.ct-r180-type-filters');
  if(filters){filters.hidden=foryou;filters.style.display=foryou?'none':'';if(foryou)discoverState.type='all'}
  if(!foryou&&String(discoverState?.tab||'')!=='top10'){
    const root=document.querySelector('[data-discover-content]'),seen=new Set();
    for(const card of root?.querySelectorAll?.('[data-media]')||[]){const key=String(card.dataset.media||'');if(!key)continue;if(seen.has(key)){card.closest('article,.card')?.remove();continue}seen.add(key)}
  }
}
try{
  const renderDiscoverBase192=renderDiscover;
  renderDiscover=async function(seq){if(String(discoverState?.tab||'foryou')==='foryou')discoverState.type='all';const out=await renderDiscoverBase192(seq);requestAnimationFrame(enforceDiscover192);return out};
}catch{}
try{
  const paintDiscoverBase192=paintDiscover;
  paintDiscover=function(rows){if(String(discoverState?.tab||'foryou')==='foryou')rows=sanitizeForYou192(rows);else if(Array.isArray(rows))rows=uniqueMedia192(rows);const out=paintDiscoverBase192(rows);requestAnimationFrame(enforceDiscover192);return out};
}catch{}

try{
  const shellBase192=shell;
  shell=function(title,subtitle,active,body,options={}){if(String(active)==='sports')return shellBase192(title,subtitle,active,body,{...(options||{}),search:false});return shellBase192(title,subtitle,active,body,options)};
}catch{}
function enforceSportsSearch192(){
  const sports=route192()==='sports';
  for(const el of document.querySelectorAll?.('.search-global,[data-top-search],.top-search,#top-search,.global-search')||[]){if(sports){el.dataset.ct192Hidden='1';el.style.setProperty('display','none','important')}else if(el.dataset.ct192Hidden){delete el.dataset.ct192Hidden;el.style.removeProperty('display')}}
}
try{const renderSportsBase192=renderSports;renderSports=async function(seq){const out=await renderSportsBase192(seq);enforceSportsSearch192();return out}}catch{}

const globalSearchCache192=new Map();
function mergeLang192(primary,secondary,type){const out=[],seen=new Set();for(const x of [...(primary||[]),...(secondary||[])]){const id=positive192(x?.id);if(!id)continue;const k=type+':'+id;if(seen.has(k))continue;seen.add(k);out.push({...x,media_type:type})}return out}
try{
  globalSearch=async function(q){
    const out=document.querySelector('[data-global-results]');if(!out)return;q=String(q||'').trim();if(q.length<2){out.innerHTML='';return}
    const key=norm192(q);if(globalSearchCache192.has(key)){out.innerHTML=globalSearchCache192.get(key);return}
    out.innerHTML='<div class="global-results"><div class="loader">Buscando...</div></div>';
    try{
      const preferEn=localStorage.getItem('cinetracker_locale')==='en-US';
      const [mPt,mEn,tPt,tEn,p]=await Promise.all([
        safeTmdb('/search/movie',{query:q,page:1,language:'pt-BR'}),safeTmdb('/search/movie',{query:q,page:1,language:'en-US'}),
        safeTmdb('/search/tv',{query:q,page:1,language:'pt-BR'}),safeTmdb('/search/tv',{query:q,page:1,language:'en-US'}),
        safeTmdb('/search/person',{query:q,page:1,language:preferEn?'en-US':'pt-BR'})
      ]);
      const movies=mergeLang192(preferEn?mEn.results:mPt.results,preferEn?mPt.results:mEn.results,'movie').slice(0,7),series=mergeLang192(preferEn?tEn.results:tPt.results,preferEn?tPt.results:tEn.results,'tv').slice(0,7),people=mergeLang192(p.results,[],'person').slice(0,5),rows=[...movies,...series,...people];
      const html='<div class="global-results">'+(rows.map(x=>x.media_type==='person'
        ?'<div class="global-result person" data-person="'+Number(x.id)+'"><div class="thumb"'+(x.profile_path?' style="background-image:url(\''+img(x.profile_path,'w185')+'\')"':'')+'></div><div><b>'+esc192(x.name)+'</b><small class="muted">Pessoa</small></div></div>'
        :'<div class="global-result" data-media="'+x.media_type+':'+Number(x.id)+'"><div class="thumb"'+(x.poster_path?' style="background-image:url(\''+img(x.poster_path,'w154')+'\')"':'')+'></div><div><b>'+esc192(x.title||x.name)+'</b><small class="muted">'+(x.media_type==='movie'?'Filme':'Série')+'</small></div></div>'
      ).join('')||'<div class="empty">Nenhum resultado.</div>')+'</div>';
      globalSearchCache192.set(key,html);out.innerHTML=html;
    }catch(e){out.innerHTML='<div class="global-results"><div class="error">'+esc192(e?.message||e)+'</div></div>'}
  };
}catch{}

let profileTask192=null,profileAt192=0,favoriteRefreshTimer192=0;
function completeProfile192(p){return Boolean(p&&typeof p==='object'&&Array.isArray(p.dashboard)&&p.stats&&typeof p.stats==='object')}
function cachedProfile192(){
  try{if(completeProfile192(profileCache))return profileCache}catch{}
  try{if(typeof ct163Read==='function'){const p=ct163Read('profile');if(completeProfile192(p)){profileCache=p;return p}}}catch{}
  return null;
}
function paintProfile192(p){
  if(!completeProfile192(p))return false;profileCache=p;
  if(!document.querySelector('[data-profile]'))setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));
  try{
    if(typeof ct168PaintProfile==='function')ct168PaintProfile(p,'');else return false;
    try{if(typeof ctR180EnhanceProfile==='function')ctR180EnhanceProfile(p)}catch{}
    try{if(typeof ct184RestoreFavoriteAdd==='function')ct184RestoreFavoriteAdd()}catch{}
    try{if(typeof ct185ASave==='function')ct185ASave('profile','[data-profile]')}catch{}
    return true;
  }catch{return false}
}
async function fetchProfile192(force=false){
  if(!force&&profileAt192&&Date.now()-profileAt192<60000&&completeProfile192(profileCache))return profileCache;if(profileTask192)return profileTask192;
  profileTask192=(async()=>{
    const p=await rpc('cinetracker_profile_payload_v0997',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});if(!completeProfile192(p))throw new Error('Perfil retornou payload incompleto.');
    profileCache={...p,sports_stats:p?.sports_stats||profileCache?.sports_stats||{}};profileAt192=Date.now();
    try{ct185CProfileFullAt=profileAt192}catch{}try{ct185CDirty?.delete?.('profile')}catch{}try{window.__ct0997PreloadedProfile=profileCache}catch{}try{if(typeof ct163Write==='function')ct163Write('profile',profileCache)}catch{}
    return profileCache;
  })().finally(()=>{profileTask192=null});return profileTask192;
}
try{
  renderProfile=async function(seq){
    const cached=cachedProfile192();
    if(cached){paintProfile192(cached);void fetchProfile192(true).then(p=>{if(seq===navSeq&&route192()==='profile'&&!document.querySelector('.favorite-overlay'))paintProfile192(p)}).catch(()=>{});return}
    setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
    try{const p=await fetchProfile192(true);if(seq!==navSeq||route192()!=='profile')return;paintProfile192(p)}catch(e){if(seq!==navSeq)return;const h=document.querySelector('[data-profile]');if(h)h.innerHTML=fail('Falha ao carregar Perfil: '+(e?.message||e),'profile')}
  };
}catch{}

function favoriteRows192(a,b,type){return mergeLang192(a||[],b||[],type==='person'?'person':type).slice(0,24)}
function scheduleProfileRefresh192(){clearTimeout(favoriteRefreshTimer192);favoriteRefreshTimer192=setTimeout(()=>{profileAt192=0;void fetchProfile192(true).then(p=>{if(route192()==='profile'&&!document.querySelector('.favorite-overlay'))paintProfile192(p)}).catch(()=>{})},700)}
try{
  openFavoriteSearch158=function(kind){
    document.querySelector('.favorite-overlay')?.remove();const label=kind==='movie'?'filme':kind==='tv'?'série':'ator',ov=document.createElement('div');ov.className='favorite-overlay';
    ov.innerHTML='<div class="favorite-box"><div class="panel-head"><h2>Adicionar '+label+' aos favoritos</h2><button class="mini-add" type="button" data-favorite-close>✕ Fechar</button></div><input class="favorite-search" type="search" placeholder="Buscar '+label+'…" autocomplete="off"><div class="favorite-results"><div class="empty">Digite pelo menos 2 caracteres.</div></div></div>';
    document.body.appendChild(ov);const input=ov.querySelector('.favorite-search'),out=ov.querySelector('.favorite-results');let timer=0,rows=[],requestNo=0;const added=new Set();
    const close=()=>{ov.remove();const p=cachedProfile192();if(p&&route192()==='profile')paintProfile192(p)};
    ov.addEventListener('click',e=>{
      if(e.target===ov||e.target.closest('[data-favorite-close]')){close();return}const b=e.target.closest('[data-favorite-result]');if(!b)return;e.preventDefault();e.stopPropagation();
      const item=rows[Number(b.dataset.favoriteResult)],id=positive192(item?.id);if(!item||!id||added.has(id))return;b.disabled=true;const old=b.innerHTML;b.classList.add('ct192-saving');const plus=b.querySelector('.ct192-favorite-action');if(plus)plus.textContent='…';
      void(async()=>{try{
        if(kind==='person'){const ex=await api('favorite_actors?select=id&tmdb_person_id=eq.'+id+'&limit=1').catch(()=>[]);if(!ex?.length)await api('favorite_actors',{method:'POST',body:JSON.stringify({tmdb_person_id:id,actor_name:item.name||'TMDB #'+id,profile_path:item.profile_path||null})})}
        else{const m=await ensureMedia(kind,id),ex=await api('media_overrides?select=id&media_id=eq.'+Number(m.id)+'&state=eq.Liked&limit=1').catch(()=>[]);if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(m.id),state:'Liked',origin:'manual'})})}
        added.add(id);b.classList.remove('ct192-saving');b.classList.add('ct192-added');b.disabled=true;const action=b.querySelector('.ct192-favorite-action');if(action)action.textContent='✓';toast('Favorito adicionado.');scheduleProfileRefresh192();
      }catch(err){b.disabled=false;b.classList.remove('ct192-saving');b.innerHTML=old;toast(err?.message||err)}})();
    });
    input.addEventListener('input',()=>{
      clearTimeout(timer);const q=input.value.trim(),ticket=++requestNo;if(q.length<2){out.innerHTML='<div class="empty">Digite pelo menos 2 caracteres.</div>';return}
      timer=setTimeout(async()=>{out.innerHTML='<div class="loader">Buscando...</div>';try{
        const preferEn=localStorage.getItem('cinetracker_locale')==='en-US',path=kind==='person'?'/search/person':'/search/'+kind,[pt,en]=await Promise.all([safeTmdb(path,{query:q,include_adult:false,page:1,language:'pt-BR'}),safeTmdb(path,{query:q,include_adult:false,page:1,language:'en-US'})]);if(ticket!==requestNo)return;
        rows=favoriteRows192(preferEn?en.results:pt.results,preferEn?pt.results:en.results,kind);out.innerHTML=rows.map((x,i)=>{const p=kind==='person'?x.profile_path:x.poster_path,year=String(x.release_date||x.first_air_date||'').slice(0,4),done=added.has(Number(x.id));return '<button class="favorite-result '+(done?'ct192-added':'')+'" type="button" data-favorite-result="'+i+'" '+(done?'disabled':'')+'><span class="favorite-thumb"'+(p?' style="background-image:url(\''+img(p,kind==='person'?'w185':'w154')+'\')"':'')+'></span><span><b>'+esc192(x.title||x.name||'Sem título')+'</b><small>'+(kind==='person'?esc192(x.known_for_department||'Pessoa'):(year||'—'))+'</small></span><span class="ct192-favorite-action">'+(done?'✓':'＋')+'</span></button>'}).join('')||'<div class="empty">Nenhum resultado.</div>';
      }catch(e){if(ticket===requestNo)out.innerHTML='<div class="error">'+esc192(e?.message||e)+'</div>'}},180);
    });setTimeout(()=>input.focus(),20);
  };
}catch{}

try{const bootBase192=boot;boot=async function(){const out=await bootBase192();setTimeout(()=>{if(session)void fetchProfile192(false).catch(()=>{})},80);return out}}catch{}
window.addEventListener('cinetracker:data-changed',()=>{profileAt192=0});
window.addEventListener('popstate',()=>requestAnimationFrame(()=>{enforceSportsSearch192();enforceDiscover192()}));
window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{enforceSportsSearch192();enforceDiscover192()}));
document.addEventListener('click',e=>{if(e.target.closest?.('[data-nav],[data-discover-tab]'))requestAnimationFrame(()=>setTimeout(()=>{enforceSportsSearch192();enforceDiscover192()},0))},{passive:true});
const style=document.createElement('style');style.id='ct192-web-style';style.textContent='.favorite-result.ct192-added{border-color:#22c55e!important;background:rgba(34,197,94,.12)!important}.favorite-result.ct192-added .ct192-favorite-action{color:#86efac!important;font-weight:800}.favorite-result.ct192-saving{opacity:.72}';document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
