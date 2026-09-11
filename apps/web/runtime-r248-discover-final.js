/* CineTracker Web 1.0.39 r248 — final Discover authority. */
(()=>{
'use strict';
if(window.__ctR248DiscoverFinal)return;
window.__ctR248DiscoverFinal='content-only-tabs-stable-cards-personal-rules';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const esc248=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GENRES=new Map([[28,'Ação'],[12,'Aventura'],[16,'Animação'],[35,'Comédia'],[80,'Crime'],[99,'Documentário'],[18,'Drama'],[10751,'Família'],[14,'Fantasia'],[36,'História'],[27,'Terror'],[10402,'Música'],[9648,'Mistério'],[10749,'Romance'],[878,'Ficção científica'],[10770,'Cinema TV'],[53,'Thriller'],[10752,'Guerra'],[37,'Faroeste'],[10759,'Ação e aventura'],[10762,'Infantil'],[10763,'Notícias'],[10764,'Reality'],[10765,'Sci-Fi & Fantasia'],[10766,'Novela'],[10767,'Talk Show'],[10768,'Guerra & Política']]);
function discoverMeta(x){
 const year=String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
 let type='Série';try{type=(typeof mediaType==='function'?mediaType(x):x?.media_type)==='movie'?'Filme':'Série'}catch(_){}
 const ids=[...(x?.genre_ids||x?.raw_tmdb?.genre_ids||[])],genres=[];for(const id of ids){const name=GENRES.get(Number(id));if(name&&!genres.includes(name))genres.push(name);if(genres.length===3)break}
 return [year||'—',type,genres.length?genres.join(', '):null].filter(Boolean).join(' · ');
}
window.__ctR248DiscoverMeta=discoverMeta;
let painting=false;
try{
 if(typeof mediaCard==='function'){
  const baseMediaCard=mediaCard;
  mediaCard=function(x){const html=baseMediaCard.apply(this,arguments);if(!painting)return html;const meta=esc248(discoverMeta(x));return html.replace(/<small>[\s\S]*?<\/small>/,`<small>${meta}</small>`)};
 }
}catch(_){}
try{
 if(typeof paintDiscover==='function'){
  const basePaintDiscover=paintDiscover;
  paintDiscover=function(){painting=true;try{return basePaintDiscover.apply(this,arguments)}finally{painting=false;queueMicrotask(()=>{try{window.__ctR248StabilizeDiscover?.()}catch(_){}})}};
 }
}catch(_){}
let discoverSeq248=0;
async function contentOnly(){
 const root=q('[data-discover],#p-discover,[data-page="discover"]');if(!root||typeof discoverRows!=='function'||typeof paintDiscover!=='function')return false;
 let tab='foryou',type='all';try{tab=String(discoverState?.tab||tab);type=String(discoverState?.type||type)}catch(_){}
 const seq=++discoverSeq248;root.dataset.ct248DiscoverAtomic='1';root.setAttribute('aria-busy','true');
 for(const b of qa('[data-discover-tab]',root))b.classList.toggle('active',String(b.dataset.discoverTab)===tab);
 for(const b of qa('[data-discover-type]',root))b.classList.toggle('active',String(b.dataset.discoverType)===type);
 try{
  const rows=await discoverRows(tab);let currentTab=tab,currentType=type;try{currentTab=String(discoverState?.tab||tab);currentType=String(discoverState?.type||type)}catch(_){}
  if(seq!==discoverSeq248||currentTab!==tab||currentType!==type)return true;
  paintDiscover(rows);return true;
 }catch(e){
  if(seq===discoverSeq248){const h=q('[data-discover-content]',root);if(h&&!h.children.length)h.textContent='Não foi possível atualizar esta aba.';console.warn('r248 Discover content-only',e)}return true;
 }finally{if(seq===discoverSeq248)root.removeAttribute('aria-busy')}
}
window.__ctR248DiscoverContentOnly=contentOnly;
try{
 if(typeof render==='function'){
  const baseRender248=render;
  render=async function(){let onDiscover=false;try{onDiscover=typeof route==='function'&&route()==='discover'&&!!q('[data-discover],#p-discover,[data-page="discover"]')}catch(_){}
   if(onDiscover&&await contentOnly())return;return baseRender248.apply(this,arguments)};
 }
}catch(_){}
})();
