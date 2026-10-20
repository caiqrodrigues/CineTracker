/* CineTracker Android 1.0.51 / r293 — direct, authenticated Watchlist write.
   Used ONLY by r278 Pra Você cards, never by Detail/Home/Profile.
   The seven slots stay mounted: no render(), no data-changed broadcast,
   no full-page refetch and no legacy Watchlist toggle decorators. */
(()=>{
'use strict';
if(window.__ctR293AddWatchlist)return;
const locks=new Set();
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&
 Boolean(session?.user?.id||user?.id);
window.__ctR293AddWatchlist=async function(type,id){
 if(!active())throw Error('Pra Você não está ativo.');
 type=type==='movie'?'movie':'tv';
 id=Number(id);
 if(!Number.isSafeInteger(id)||id<=0)throw Error('Identificador inválido.');
 const uid=String(session?.user?.id||user?.id||'');
 const key=uid+':'+type+':'+id;
 if(locks.has(key))throw Error('Esta atualização já está em andamento.');
 locks.add(key);
 try{
  // ensureMedia only resolves/creates the target title. It does not reload
  // any page or emit global update events.
  const m=await ensureMedia(type,id);
  const mediaId=Number(m?.id);
  if(!Number.isSafeInteger(mediaId)||mediaId<=0)throw Error('Mídia não encontrada.');
  const query='media_overrides?select=id&profile_id=eq.'+
   encodeURIComponent(uid)+'&media_id=eq.'+mediaId+
   '&state=in.(AddedToWatchlist,WatchLater)&limit=1';
  const existing=await api(query);
  if(!Array.isArray(existing))throw Error('Não foi possível consultar a Watchlist.');
  if(!existing.length){
   await api('media_overrides',{method:'POST',body:JSON.stringify({
    profile_id:uid,media_id:mediaId,state:'AddedToWatchlist',origin:'manual'
   })});
  }
  // Cache invalidation is passive. The current Discover data and 7 DOM
  // elements remain intact; r278 already marked the clicked title locally.
  homeCache=null;
  profileCache=null;
  try{toast('Adicionado à Watchlist.')}catch{}
  document.documentElement.dataset.ct293WatchlistSaved=type+':'+id;
  return true;
 }finally{locks.delete(key)}
};
window.__ctR293WatchlistTest={active,busy:()=>locks.size};
})();