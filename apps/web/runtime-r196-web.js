/* r196 Web — detail Watchlist is a real add/remove toggle */
(() => {
'use strict';
if(window.__ctR196WebLoaded)return;
window.__ctR196WebLoaded=true;
window.__ctR196Web='detail-watchlist-toggle';
window.__ctWebRevision='r196-watchlist-toggle';
window.__ctR196Watchlist='add-remove-alias-aware';

function detailMeta196(type,id,m){
  let d=null;
  try{if(ct169CurrentDetail&&Number(ct169CurrentDetail.id)===Number(id))d=ct169CurrentDetail.detail||null}catch{}
  const r=m?.raw_tmdb||{};
  const title=d?.title||d?.name||m?.title||r?.title||r?.name||null;
  const original=d?.original_title||d?.original_name||m?.original_title||r?.original_title||r?.original_name||null;
  const year=Number(String(d?.release_date||d?.first_air_date||m?.release_year||r?.release_date||r?.first_air_date||'').slice(0,4))||null;
  return{p_media_type:type,p_tmdb_id:Number(id),p_title:title,p_original_title:original,p_release_year:year};
}

function invalidate196(){
  try{homeCache=null}catch{}
  try{profileCache=null}catch{}
  try{discoverCache.clear()}catch{}
  try{ct186ContextValue=null;ct186ContextAt=0}catch{}
  try{ct171SeenMap=null}catch{}
  try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'watchlist-toggle-r196',at:Date.now()}}))}catch{}
}

function paintWatchButton196(type,id,on,busy=false){
  const b=document.querySelector(`[data-detail-watchlist="${type}:${Number(id)}"]`);
  if(!b)return;
  b.dataset.ct196Busy=busy?'1':'0';
  b.dataset.on=on?'1':'0';
  b.classList.toggle('on',!!on);
  b.setAttribute('aria-pressed',on?'true':'false');
  b.title=on?'Remover da Watchlist':'Adicionar à Watchlist';
  b.textContent=busy?'Atualizando…':(on?'✓ Na Watchlist':'＋ Watchlist');
  b.disabled=!!busy;
  const hero=b.closest('.ct169-detail-hero,.detail-hero');
  const wrap=hero?.querySelector('.ct169-poster-wrap');
  if(wrap){
    let badge=wrap.querySelector('.ct169-poster-state.watch');
    if(!on){badge?.remove()}
    else if(!badge&&!wrap.querySelector('.ct169-poster-state:not(.watch)')){
      badge=document.createElement('span');badge.className='ct169-poster-state watch';badge.textContent='▣ NA WATCHLIST';wrap.appendChild(badge);
    }
  }
}

async function watchState196(type,id,m){
  try{return await rpc('cinetracker_media_state_v1',detailMeta196(type,id,m))}catch{return null}
}

/* Keep the historical function name because the existing delegated click handler and
   Discover add buttons already call addWatchlist(). The operation is now a true toggle. */
addWatchlist=async function(type,id){
  type=String(type)==='movie'?'movie':'tv';id=Number(id||0);if(!(id>0))throw new Error('Mídia inválida');
  const uid=user?.id||session?.user?.id;if(!uid)throw new Error('Sessão necessária');
  const button=document.querySelector(`[data-detail-watchlist="${type}:${id}"]`);
  const hintedOn=Boolean(button?.classList.contains('on')||button?.getAttribute('aria-pressed')==='true'||/na watchlist/i.test(button?.textContent||''));
  if(button)paintWatchButton196(type,id,hintedOn,true);
  try{
    const m=await ensureMedia(type,id);
    const st=await watchState196(type,id,m);
    const currentlyOn=st?Boolean(st.is_watchlist):hintedOn;
    if(currentlyOn){
      const ids=new Set([Number(m.id||0),...((Array.isArray(st?.matched_media_ids)?st.matched_media_ids:[]).map(Number))]);
      const list=[...ids].filter(n=>Number.isFinite(n)&&n>0);
      if(list.length){
        await api(`media_overrides?profile_id=eq.${encodeURIComponent(uid)}&media_id=in.(${list.join(',')})&state=in.(AddedToWatchlist,WatchLater)`,{method:'DELETE'});
      }
      invalidate196();paintWatchButton196(type,id,false,false);toast('Removido da Watchlist.');return false;
    }
    const ex=await api(`media_overrides?select=id&profile_id=eq.${encodeURIComponent(uid)}&media_id=eq.${Number(m.id)}&state=in.(AddedToWatchlist,WatchLater)&limit=1`).catch(()=>[]);
    if(!ex?.length)await api('media_overrides',{method:'POST',body:JSON.stringify({profile_id:uid,media_id:Number(m.id),state:'AddedToWatchlist',origin:'manual'})});
    invalidate196();paintWatchButton196(type,id,true,false);toast('Adicionado à Watchlist.');return true;
  }catch(e){
    if(button)paintWatchButton196(type,id,hintedOn,false);
    throw e;
  }
};

/* The legacy detail renderer and r193 state reconciler used disabled=true for an item
   already in Watchlist. Strip that at source and also heal any late async reconciliation. */
try{
  const base=ct169HeroHtml;
  ct169HeroHtml=function(){return String(base.apply(this,arguments)).replace(/(data-detail-watchlist="[^"]+")\s+disabled/g,'$1')};
}catch{}
try{
  const base=ct170HeroHtml;
  ct170HeroHtml=function(){return String(base.apply(this,arguments)).replace(/(data-detail-watchlist="[^"]+")\s+disabled/g,'$1')};
}catch{}

function unlock196(root=document){
  const buttons=[];
  try{if(root.matches?.('[data-detail-watchlist]'))buttons.push(root)}catch{}
  try{buttons.push(...root.querySelectorAll?.('[data-detail-watchlist]')||[])}catch{}
  for(const b of buttons){
    if(b.dataset.ct196Busy==='1')continue;
    const on=b.classList.contains('on')||b.getAttribute('aria-pressed')==='true'||/na watchlist/i.test(b.textContent||'');
    if(b.disabled)b.disabled=false;
    b.dataset.on=on?'1':'0';
    const pressed=on?'true':'false';if(b.getAttribute('aria-pressed')!==pressed)b.setAttribute('aria-pressed',pressed);
    const title=on?'Remover da Watchlist':'Adicionar à Watchlist';if(b.title!==title)b.title=title;
  }
}

try{
  const base=renderDetail;
  renderDetail=async function(){const out=await base.apply(this,arguments);requestAnimationFrame(()=>unlock196(document));setTimeout(()=>unlock196(document),350);setTimeout(()=>unlock196(document),1400);return out};
}catch{}

try{
  const root=document.querySelector('#app')||document.body;
  if(root){
    const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='attributes'||m.addedNodes?.length){unlock196(m.target);for(const n of m.addedNodes||[])if(n?.nodeType===1)unlock196(n)}}});
    mo.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','class','aria-pressed']});
  }
}catch{}

})();
