/* r188 Web — interaction repair + cache-first route reuse */
(() => {
'use strict';
if (window.__ctR188WebLoaded) return;
window.__ctR188WebLoaded = true;
window.__ctR188Web = 'cache-first-profile-discover-swap-sports-favorites-ui';
window.__ctWebRevision = 'r188-interactions-performance';

const $188=(s,r=document)=>r?.querySelector?.(s)||null;
const $$188=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm188=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route188=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')}};

/* Keep r187 authority, but never make an already-cached route wait for it. */
let profileRefreshTask188=null;
function usableProfile188(d){
  if(!d||typeof d!=='object')return false;
  if(Array.isArray(d.dashboard)&&d.dashboard.length)return true;
  if(Array.isArray(d.favorite_actors)&&d.favorite_actors.length)return true;
  const s=d.stats||{};return Object.keys(s).length>0;
}
function cachedProfile188(){
  if(usableProfile188(profileCache))return profileCache;
  const p=window.__ct0997PreloadedProfile;
  return usableProfile188(p)?p:null;
}
function showProfile188(d){
  if(!d)return false;
  try{
    profileCache=d;
    setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));
    if(typeof ct168PaintProfile==='function')ct168PaintProfile(d,'');
    else return false;
    requestAnimationFrame(normalizeFavoriteTools188);
    return true;
  }catch{return false}
}
async function refreshProfile188(){
  if(profileRefreshTask188)return profileRefreshTask188;
  profileRefreshTask188=(async()=>{
    let fn=null;
    try{fn=window.__ct0997PersistentPreloadRpc?.__ct0997Raw||window.sbRpc?.__ct0997Raw||null}catch{}
    if(!fn&&typeof rpc==='function')fn=rpc;
    if(!fn)return profileCache||null;
    const full=await fn('cinetracker_profile_payload_v0997',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
    if(full&&typeof full==='object'){
      profileCache={...(profileCache||{}),...full,sports_stats:full?.sports_stats||profileCache?.sports_stats||{}};
      window.__ct0997PreloadedProfile=profileCache;
      try{if(typeof ct185CProfileFullAt!=='undefined')ct185CProfileFullAt=Date.now()}catch{}
      if(route188()==='profile'){
        try{ct168PaintProfile(profileCache,'');requestAnimationFrame(normalizeFavoriteTools188)}catch{}
      }
    }
    return profileCache;
  })().catch(()=>profileCache||null).finally(()=>{profileRefreshTask188=null});
  return profileRefreshTask188;
}
if(typeof renderProfile==='function'){
  const renderProfileBase188=renderProfile;
  renderProfile=async function(seq){
    const cached=cachedProfile188();
    if(cached&&showProfile188(cached)){void refreshProfile188();return}
    return renderProfileBase188(seq);
  };
}

function cachedDiscover188(tab){
  try{if(tab==='foryou'&&ct186ForYouData)return ct186ForYouData}catch{}
  try{const hot=ct185CDiscoverHot?.get?.(tab);if(hot?.rows)return hot.rows}catch{}
  try{const v=discoverCache?.get?.(tab);if(v&&typeof v.then!=='function')return v}catch{}
  return null;
}
function showDiscover188(rows){
  if(!rows)return false;
  try{
    const rail=typeof ctR180TabRail==='function'?ctR180TabRail():'';
    const filters=typeof ctR180FiltersHtml==='function'?ctR180FiltersHtml():'';
    setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover','<div class="page" data-discover>'+rail+'<div class="filters ct-r180-type-filters">'+filters+'</div><div data-discover-content></div></div>'));
    paintDiscover(rows);
    requestAnimationFrame(()=>{try{ctR180ExposeActiveTab()}catch{}});
    return true;
  }catch{return false}
}
async function refreshDiscover188(tab){
  try{
    let rows=null;
    if(tab==='foryou'&&typeof ct186LoadForYou==='function')rows=await ct186LoadForYou(true);
    else if(typeof ct185CWarmDiscoverTab==='function')rows=await ct185CWarmDiscoverTab(tab);
    if(!rows)return null;
    try{ct185CDiscoverHot?.set?.(tab,{at:Date.now(),rows})}catch{}
    if(tab==='foryou'){
      try{ct186ForYouData=rows}catch{}
      try{ct166ForYouData=rows}catch{}
    }
    if(route188()==='discover'&&String(discoverState?.tab||'foryou')===tab)paintDiscover(rows);
    return rows;
  }catch{return null}
}
if(typeof renderDiscover==='function'){
  const renderDiscoverBase188=renderDiscover;
  renderDiscover=async function(seq){
    const tab=String(discoverState?.tab||'foryou'),cached=cachedDiscover188(tab);
    if(cached&&showDiscover188(cached)){void refreshDiscover188(tab);return}
    return renderDiscoverBase188(seq);
  };
}

/* r166 swap buttons need the currently painted r186 pool, not the old stale variable. */
if(typeof paintDiscover==='function'){
  const paintDiscoverBase188=paintDiscover;
  paintDiscover=function(data){
    if(String(discoverState?.tab||'foryou')==='foryou'&&data){
      try{ct186ForYouData=data}catch{}
      try{ct166ForYouData=data}catch{}
    }
    return paintDiscoverBase188(data);
  };
}

/* Tag the sports quick-search before the first keystroke. r187 can then stop the old repainting handler. */
function tagSportsSearch188(root=document){
  const sports=$188('[data-sports]',root)||((root?.matches?.('[data-sports]'))?root:null);if(!sports)return;
  $$188('input[type="search"],input[type="text"],input:not([type])',sports).forEach(input=>{input.dataset.sportsSearch='1'});
}
if(typeof paintSports==='function'){
  const paintSportsBase188=paintSports;
  paintSports=function(p=sportsCache||{}){const out=paintSportsBase188(p);tagSportsSearch188();return out};
}
document.addEventListener('focusin',e=>{
  const input=e.target;if(!(input instanceof HTMLInputElement)||!input.closest?.('[data-sports]'))return;
  input.dataset.sportsSearch='1';
},true);

/* Reliable favorite modal: the row itself and the plus sign execute the write. */
async function refreshProfileAfterFavorite188(){
  try{
    const full=await rpc('cinetracker_profile_payload_v0997',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
    if(full&&typeof full==='object'){
      profileCache=full;window.__ct0997PreloadedProfile=full;
      if(route188()==='profile'){ct168PaintProfile(full,'');requestAnimationFrame(normalizeFavoriteTools188)}
    }
  }catch{}
}
async function addFavorite188(kind,item,button,overlay){
  const id=Number(item?.id||0);if(!(id>0))throw new Error('Item inválido.');
  if(button)button.disabled=true;
  try{
    if(kind==='person'){
      const ex=await api('favorite_actors?select=id&tmdb_person_id=eq.'+id+'&limit=1').catch(()=>[]);
      if(!ex?.length)await api('favorite_actors',{method:'POST',body:JSON.stringify({tmdb_person_id:id,actor_name:item.name||'TMDB #'+id,profile_path:item.profile_path||null})});
    }else{
      const m=await ensureMedia(kind,id);
      const ex=await api('media_overrides?select=id&media_id=eq.'+Number(m.id)+'&state=eq.Liked&limit=1').catch(()=>[]);
      if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({media_id:Number(m.id),state:'Liked',origin:'manual'})});
    }
    overlay?.remove();
    toast('Favorito adicionado.');
    try{ct185CDirty?.add?.('profile')}catch{}
    try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'favorite-r188',kind,id}}))}catch{}
    await refreshProfileAfterFavorite188();
  }catch(err){if(button)button.disabled=false;throw err}
}
openFavoriteSearch158=function(kind){
  kind=kind==='actor'?'person':kind;
  if(!['movie','tv','person'].includes(kind))return;
  document.querySelector('.favorite-overlay')?.remove();
  const label=kind==='movie'?'filme':kind==='tv'?'série':'ator';
  const ov=document.createElement('div');ov.className='favorite-overlay';
  ov.innerHTML='<div class="favorite-box"><div class="panel-head"><h2>Adicionar '+label+' aos favoritos</h2><button class="mini-add" type="button" data-favorite-close>✕ Fechar</button></div><input class="favorite-search" type="search" placeholder="Buscar '+label+'…" autocomplete="off"><div class="favorite-results"><div class="empty">Digite pelo menos 2 caracteres.</div></div></div>';
  document.body.appendChild(ov);
  const input=$188('.favorite-search',ov),out=$188('.favorite-results',ov);let timer=0,seq=0,rows=[];
  ov.addEventListener('click',e=>{
    if(e.target===ov||e.target.closest?.('[data-favorite-close]')){ov.remove();return}
    const b=e.target.closest?.('[data-ct188-favorite-result]');if(!b)return;
    e.preventDefault();e.stopPropagation();
    const item=rows[Number(b.dataset.ct188FavoriteResult)];if(!item)return;
    void addFavorite188(kind,item,b,ov).catch(err=>toast(err?.message||String(err)));
  });
  input.addEventListener('input',()=>{
    clearTimeout(timer);const term=input.value.trim(),my=++seq;
    if(term.length<2){rows=[];out.innerHTML='<div class="empty">Digite pelo menos 2 caracteres.</div>';return}
    timer=setTimeout(async()=>{
      out.innerHTML='<div class="loader">Buscando...</div>';
      try{
        const d=await tmdb(kind==='person'?'/search/person':'/search/'+kind,{query:term,include_adult:false,page:1});if(my!==seq)return;
        rows=(d.results||[]).slice(0,18);
        out.innerHTML=rows.map((x,i)=>{const p=kind==='person'?x.profile_path:x.poster_path,year=String(x.release_date||x.first_air_date||'').slice(0,4);return '<button class="favorite-result" type="button" data-ct188-favorite-result="'+i+'"><span class="favorite-thumb"'+(p?' style="background-image:url(\''+img(p,kind==='person'?'w185':'w154')+'\')"':'')+'></span><span><b>'+esc(x.title||x.name||'Sem título')+'</b><small>'+(kind==='person'?esc(x.known_for_department||'Pessoa'):(year||'—'))+'</small></span><span class="ct188-favorite-plus" aria-hidden="true">＋</span></button>'}).join('')||'<div class="empty">Nenhum resultado.</div>';
      }catch(err){if(my===seq)out.innerHTML='<div class="error">'+esc(err?.message||String(err))+'</div>'}
    },220);
  });
  setTimeout(()=>input.focus(),20);
};

/* One visual/order standard for favorite section actions. */
function normalizeFavoriteTools188(){
  const root=$188('[data-profile]');if(!root)return;
  const kinds={'series favoritas':'tv','filmes favoritos':'movie','atores favoritos':'person'};
  $$188('section.panel',root).forEach(panel=>{
    const head=$188(':scope > .panel-head',panel);if(!head)return;
    const title=norm188($188('h2,h3',head)?.textContent||''),kind=kinds[title];if(!kind)return;
    let actions=$188(':scope > .panel-actions',head);
    if(!actions){actions=document.createElement('div');actions.className='panel-actions';head.appendChild(actions)}
    actions.classList.add('ct188-profile-actions');
    let add=$188('[data-add-favorite]',head);
    if(!add){add=document.createElement('button');add.type='button';add.dataset.addFavorite=kind;actions.appendChild(add)}
    add.textContent='＋ Adicionar';add.classList.add('mini-add','ct188-profile-action');
    let more=[...head.querySelectorAll('button,a')].find(x=>x!==add&&/^ver\s+(mais|todos)/i.test(String(x.textContent||'').trim()));
    if(more){more.textContent='Ver todos';more.classList.add('ct188-profile-action')}
    const count=[...head.querySelectorAll('small')].find(x=>/^\s*\d+\s*$/.test(x.textContent||''))||null;
    const desired=[count,add,more].filter(Boolean);
    const current=[...actions.children].filter(x=>desired.includes(x));
    if(desired.some((x,i)=>current[i]!==x))desired.forEach(x=>actions.appendChild(x));
  });
}
try{
  if(typeof ctR180EnhanceProfile==='function'){
    const enhanceProfileBase188=ctR180EnhanceProfile;
    ctR180EnhanceProfile=function(d=profileCache||{}){const out=enhanceProfileBase188(d);requestAnimationFrame(normalizeFavoriteTools188);return out};
  }
}catch{}

/* r187's pointer-hover authority refresh must not turn a simple nav hover into a blocking burst. */
document.addEventListener('pointerover',e=>{
  const t=e.target.closest?.('[data-nav],[data-discover-tab]');if(!t)return;
  const tab=String(t.dataset?.discoverTab||'');
  const nav=String(t.dataset?.nav||'');
  if(tab==='foryou'||nav==='discover'||nav==='profile')e.stopPropagation();
},true);

let decorate188Timer=0;
const decorate188=()=>{tagSportsSearch188();normalizeFavoriteTools188()};
const observer188=new MutationObserver(()=>{clearTimeout(decorate188Timer);decorate188Timer=setTimeout(decorate188,0)});
observer188.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(decorate188,0);

const style=document.createElement('style');style.id='ct188-web-style';style.textContent=`
.ct166-slot-head{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;min-height:28px!important;margin-bottom:5px!important}
.ct166-slot-head>small{margin:0!important}
.ct166-swap{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;min-height:24px!important;height:24px!important;padding:3px 8px!important;margin:0!important;border-radius:999px!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important}
.ct188-profile-actions{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:wrap!important;justify-content:flex-end!important}
.ct188-profile-actions>small{order:0!important;margin:0 2px 0 0!important}
.ct188-profile-actions>[data-add-favorite]{order:1!important}
.ct188-profile-actions>.ct188-profile-action:not([data-add-favorite]){order:2!important}
.ct188-profile-action{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;min-height:30px!important;height:30px!important;padding:5px 10px!important;border-radius:999px!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important}
.favorite-result .ct188-favorite-plus{font-size:18px!important;font-weight:800!important;pointer-events:none}
.favorite-result:disabled{opacity:.55!important;cursor:wait!important}
@media(max-width:700px){.ct188-profile-actions{justify-content:flex-start!important}.ct188-profile-action{height:28px!important;min-height:28px!important;padding:4px 8px!important}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
