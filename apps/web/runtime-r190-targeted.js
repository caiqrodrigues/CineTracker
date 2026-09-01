/* r190 targeted contracts: profile favorite picker + media detail state */
(() => {
'use strict';
if(window.__ctR190TargetedLoaded)return;
window.__ctR190TargetedLoaded=true;
window.__ctR190Targeted='profile-picker-detail-state';
const n=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')}};
const ctxSeen=(c,type,id)=>Boolean((type==='movie'?c?.historyMovieIds:c?.historyTvIds)?.has?.(Number(id)));
const ctxWatch=(c,type,id)=>Boolean((type==='movie'?c?.watchMovieIds:c?.watchTvIds)?.has?.(Number(id)));
const favActive=(type,id)=>{try{const p=profileCache||window.__ct0997PreloadedProfile||{};const rows=type==='movie'?p.favorite_movies:p.favorite_series;return Array.isArray(rows)&&rows.some(x=>Number(x?.tmdb_id||x?.id||0)===Number(id))}catch{return false}};
function paintState(type,id,c){
  const root=document.querySelector('.modal-card,.modal,.dialog,[role="dialog"],.detail-view,.media-detail')||document;
  const seen=root.querySelector(`[data-mark-seen="${type}:${id}"]`),watch=root.querySelector(`[data-watch="${type}:${id}"]`),fav=root.querySelector(`[data-favorite="${type}:${id}"]`);
  if(seen){const a=ctxSeen(c,type,id);seen.classList.toggle('ct190-seen-active',a);seen.setAttribute('aria-pressed',a?'true':'false');if(a){seen.textContent='✓ Visto';seen.disabled=true}}
  if(watch){const a=ctxWatch(c,type,id);watch.classList.toggle('ct190-watch-active',a);watch.setAttribute('aria-pressed',a?'true':'false');if(a){watch.textContent='✓ Na Watchlist';watch.disabled=true}}
  if(fav){const a=favActive(type,id);fav.classList.toggle('ct190-favorite-active',a);fav.setAttribute('aria-pressed',a?'true':'false');fav.textContent=a?'★ Favorito':'☆ Favoritar'}
}
async function refreshState(type,id){let c=null;try{c=typeof ct186Context==='function'?await ct186Context(false):null}catch{};paintState(type,id,c)}
function detailRef(){
  const root=document.querySelector('.modal-card,.modal,.dialog,[role="dialog"],.detail-view,.media-detail')||document;
  for(const el of root.querySelectorAll('[data-mark-seen],[data-watch],[data-favorite]')){
    const raw=el.dataset.markSeen||el.dataset.watch||el.dataset.favorite||'';const m=String(raw).match(/^(movie|tv):(\d+)$/);if(m)return{type:m[1],id:Number(m[2])};
  }
  return null;
}

/* This capture listener runs before legacy document handlers, so + never opens detail behind the picker. */
window.addEventListener('click',e=>{
  if(routeNow()==='profile'){
    const pick=e.target.closest?.('[data-profile-pick]');
    if(pick){
      e.preventDefault();e.stopImmediatePropagation();
      if(pick.dataset.ct190Saving==='1'||pick.dataset.ct190Added==='1')return;
      const kind=String(pick.dataset.profilePick||''),id=Number(pick.dataset.id||0),name=String(pick.dataset.name||''),path=pick.dataset.path||null;if(!(id>0))return;
      const old=pick.textContent;pick.dataset.ct190Saving='1';pick.disabled=true;pick.textContent='…';
      void Promise.resolve(rpc('cinetracker_profile_set_favorite_v0997',{p_kind:kind,p_tmdb_id:id,p_name:name,p_image_path:path,p_remove:false})).then(()=>{
        delete pick.dataset.ct190Saving;pick.dataset.ct190Added='1';pick.disabled=true;pick.textContent='✓';pick.classList.add('ct190-picker-added');
        try{
          const field=kind==='movies'?'favorite_movies':kind==='series'?'favorite_series':'favorite_people';const row={tmdb_id:id,id,name,title:name,image_path:path,poster_path:path,profile_path:path};
          if(profileCache){const rows=Array.isArray(profileCache[field])?profileCache[field]:[];if(!rows.some(x=>Number(x?.tmdb_id||x?.id||0)===id))profileCache[field]=[...rows,row];window.__ct0997PreloadedProfile=profileCache}
        }catch{}
        try{toast('Favorito adicionado')}catch{}
      }).catch(err=>{delete pick.dataset.ct190Saving;pick.disabled=false;pick.textContent=old;try{toast(err?.message||String(err))}catch{}});
      return;
    }
  }
  const seen=e.target.closest?.('[data-mark-seen]');
  if(seen){
    const [type,rawId]=String(seen.dataset.markSeen||'').split(':');const id=Number(rawId||0);if(!(id>0)||seen.disabled)return;
    e.preventDefault();e.stopImmediatePropagation();seen.disabled=true;seen.textContent='✓ Visto';seen.classList.add('ct190-seen-active');
    void Promise.resolve(markSeen(type,id)).then(()=>refreshState(type,id)).catch(err=>{seen.disabled=false;try{toast(err?.message||String(err))}catch{}});return;
  }
  const watch=e.target.closest?.('[data-watch]');
  if(watch){
    const [type,rawId]=String(watch.dataset.watch||'').split(':');const id=Number(rawId||0);if(!(id>0)||watch.disabled)return;
    e.preventDefault();e.stopImmediatePropagation();watch.disabled=true;watch.textContent='✓ Na Watchlist';watch.classList.add('ct190-watch-active');
    void Promise.resolve(addWatchlist(type,id)).then(()=>refreshState(type,id)).catch(err=>{watch.disabled=false;watch.textContent='＋ Watchlist';try{toast(err?.message||String(err))}catch{}});return;
  }
  const fav=e.target.closest?.('[data-favorite]');
  if(fav){
    const [type,rawId]=String(fav.dataset.favorite||'').split(':');const id=Number(rawId||0);if(!(id>0)||fav.disabled)return;
    e.preventDefault();e.stopImmediatePropagation();fav.disabled=true;
    const active=fav.getAttribute('aria-pressed')==='true'||fav.classList.contains('ct190-favorite-active');
    void Promise.resolve(rpc('cinetracker_favorite_toggle_v0997',{p_media_type:type,p_tmdb_id:id})).then(resp=>{
      const next=resp?.is_favorite==null?!active:resp.is_favorite!==false;fav.disabled=false;fav.classList.toggle('ct190-favorite-active',next);fav.setAttribute('aria-pressed',next?'true':'false');fav.textContent=next?'★ Favorito':'☆ Favoritar';
      try{if(profileCache){const field=type==='movie'?'favorite_movies':'favorite_series';if(!next)profileCache[field]=(profileCache[field]||[]).filter(x=>Number(x?.tmdb_id||x?.id||0)!==id)}}catch{}
    }).catch(err=>{fav.disabled=false;try{toast(err?.message||String(err))}catch{}});return;
  }
},true);

let timer=0;const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{const r=detailRef();if(r)void refreshState(r.type,r.id)},60)});mo.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>{const r=detailRef();if(r)void refreshState(r.type,r.id)},80);
})();
