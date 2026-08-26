(() => {
'use strict';
if(window.__ctHotfix10Actions)return;
window.__ctHotfix10Actions=true;

const $a=(s,r=document)=>r.querySelector(s);
function profileId(){try{return currentUser?.id||null}catch{return null}}
async function mediaIdFor(card){
  const tmdbId=Number(card?.dataset?.id||0),type=card?.dataset?.type==='movie'?'movie':'tv';
  if(!tmdbId)throw new Error('Título sem TMDB id.');
  const title=$a('.ct95-title',card)?.textContent?.trim()||`TMDB #${tmdbId}`;
  const meta=$a('.ct95-meta',card)?.textContent||'';
  const year=Number(meta.match(/\b(19|20)\d{2}\b/)?.[0]||0)||null;
  const result=await sbRpc('cinetracker_upsert_media',{p_tmdb_id:tmdbId,p_media_type:type,p_media_kind:type==='movie'?'movie':'series',p_title:title,p_release_year:year,p_poster_path:null,p_genres:[],p_raw_tmdb:{source:'hotfix10-discover'}});
  return{mediaId:Array.isArray(result)?result[0]:result,tmdbId,type,title};
}
async function manualState(mediaId,state){
  const pid=profileId();if(!pid)throw new Error('Perfil não disponível.');
  const rows=await sbApi(`media_overrides?select=id,origin&profile_id=eq.${encodeURIComponent(pid)}&media_id=eq.${encodeURIComponent(mediaId)}&state=eq.${state}&limit=1`).catch(()=>[]);
  if(rows?.[0])await sbApi(`media_overrides?id=eq.${encodeURIComponent(rows[0].id)}`,{method:'PATCH',body:JSON.stringify({origin:'manual',source_import_id:null,updated_at:new Date().toISOString()})});
  else await sbApi('media_overrides',{method:'POST',body:JSON.stringify({profile_id:pid,media_id:mediaId,state,origin:'manual'})});
}
async function movieHistory(x){
  if(x.type!=='movie')return;
  const pid=profileId();if(!pid)return;
  const old=await sbApi(`watch_history?select=id&profile_id=eq.${encodeURIComponent(pid)}&media_id=eq.${encodeURIComponent(x.mediaId)}&item_type=eq.movie&limit=1`).catch(()=>[]);
  if(!old?.[0])await sbApi('watch_history',{method:'POST',body:JSON.stringify({profile_id:pid,source:'manual',media_id:x.mediaId,item_type:'movie',watched_at:new Date().toISOString(),title:x.title,external_ids:{tmdb_id:x.tmdbId}})});
}
async function actSeen(btn){
  btn.disabled=true;
  try{const card=btn.closest('.ct95-card'),x=await mediaIdFor(card);await manualState(x.mediaId,'AlreadySeen');await movieHistory(x);btn.classList.add('seen');btn.textContent='✓ Assistido';window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'hotfix10',state:'AlreadySeen',mediaId:x.mediaId}}))}
  catch(e){btn.textContent='Erro ao salvar';console.error('HOTFIX10 Assistido:',e)}
  finally{btn.disabled=false}
}
async function actWatch(btn){
  btn.disabled=true;
  try{const card=btn.closest('.ct95-card'),x=await mediaIdFor(card);await manualState(x.mediaId,'AddedToWatchlist');btn.textContent='✓ Na Watchlist';window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'hotfix10',state:'AddedToWatchlist',mediaId:x.mediaId}}))}
  catch(e){btn.textContent='Erro ao salvar';console.error('HOTFIX10 Watchlist:',e)}
  finally{btn.disabled=false}
}
window.addEventListener('click',e=>{
  const seen=e.target?.closest?.('[data-seen95]');
  if(seen){e.preventDefault();e.stopImmediatePropagation();void actSeen(seen);return}
  const watch=e.target?.closest?.('[data-watch95]');
  if(watch){e.preventDefault();e.stopImmediatePropagation();void actWatch(watch)}
},true);
})();
