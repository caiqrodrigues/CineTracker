(()=>{
'use strict';
window.__ctR290='universal-media-card-lock';
window.__ctR290Cards='indication-of-day-exact-154x231-mobile-176x264-desktop';
window.__ctR290Structure='fixed-poster+fixed-copy+clamped-text';
window.__ctR290Discover='all-nine-tabs-vertical-uniform-cards';
window.__ctR290Android='preserved-1.0.20-10062';

const STYLE_ID='ct-web-r290-universal-media-card-lock';
const css=`
:root{
 --ct-media-card-w:176px;
 --ct-media-poster-h:264px;
 --ct-media-copy-h:80px;
 --ct-media-control-h:344px;
 --ct-media-card-h:346px;
}
@media(max-width:700px){
 :root{
  --ct-media-card-w:154px;
  --ct-media-poster-h:231px;
  --ct-media-copy-h:75px;
  --ct-media-control-h:306px;
  --ct-media-card-h:308px;
 }
}
.ct-media-card-lock,.ct263-media-card,.ct288-card,.ct288-empty-card{
 box-sizing:border-box!important;
 position:relative!important;
 display:block!important;
 flex:0 0 var(--ct-media-card-w)!important;
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
 height:var(--ct-media-card-h)!important;
 min-height:var(--ct-media-card-h)!important;
 max-height:var(--ct-media-card-h)!important;
 overflow:hidden!important;
 align-self:start!important;
}
.ct263-media-card>button,.ct288-card>.ct288-open,.ct-media-card-lock>.ct-media-primary,
.ct-media-card-lock[data-media],.ct-media-card-lock>button[data-media]{
 box-sizing:border-box!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:stretch!important;
 width:100%!important;
 min-width:0!important;
 max-width:100%!important;
 height:var(--ct-media-control-h)!important;
 min-height:var(--ct-media-control-h)!important;
 max-height:var(--ct-media-control-h)!important;
 padding:0!important;
 overflow:hidden!important;
}
.ct-media-poster-lock,.ct263-media-poster,.ct288-poster,.ct288-empty-poster{
 box-sizing:border-box!important;
 display:block!important;
 flex:0 0 var(--ct-media-poster-h)!important;
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
 height:var(--ct-media-poster-h)!important;
 min-height:var(--ct-media-poster-h)!important;
 max-height:var(--ct-media-poster-h)!important;
 aspect-ratio:2/3!important;
 object-fit:cover!important;
 overflow:hidden!important;
}
.ct-media-copy-lock,.ct263-media-copy,.ct288-copy{
 box-sizing:border-box!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:flex-start!important;
 gap:4px!important;
 flex:0 0 var(--ct-media-copy-h)!important;
 width:100%!important;
 min-width:0!important;
 height:var(--ct-media-copy-h)!important;
 min-height:var(--ct-media-copy-h)!important;
 max-height:var(--ct-media-copy-h)!important;
 padding:8px!important;
 overflow:hidden!important;
 white-space:normal!important;
}
.ct-media-title-lock,.ct263-media-copy>b,.ct288-copy>b{
 display:-webkit-box!important;
 -webkit-box-orient:vertical!important;
 -webkit-line-clamp:2!important;
 line-clamp:2!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 white-space:normal!important;
 line-height:1.25!important;
 max-width:100%!important;
 max-height:2.5em!important;
 margin:0!important;
}
.ct-media-meta-lock,.ct263-media-copy>small,.ct263-media-copy>span,.ct288-copy>small{
 display:block!important;
 width:100%!important;
 max-width:100%!important;
 white-space:nowrap!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 -webkit-line-clamp:1!important;
 line-clamp:1!important;
 margin:0!important;
}
.ct-media-card-lock img.ct-media-poster-lock,.ct263-media-poster,.ct288-poster{border-radius:12px!important}
.ct263-media-copy .ct263-streaming{max-height:20px!important;overflow:hidden!important;flex-wrap:nowrap!important}
[data-ct288-discover] .ct288-slot-grid{
 display:grid!important;
 grid-template-columns:repeat(3,var(--ct-media-card-w))!important;
 grid-auto-columns:var(--ct-media-card-w)!important;
 gap:12px!important;
 width:max-content!important;
 min-width:100%!important;
 max-width:none!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
 align-items:start!important;
 overscroll-behavior-x:contain!important;
 touch-action:pan-x pan-y!important;
}
[data-ct288-discover] .ct288-slot{
 box-sizing:border-box!important;
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
}
[data-ct288-discover] .ct288-rail,[data-ct288-discover] .ct288-top-row,
.ct263-media-rail{
 display:flex!important;
 flex-flow:row nowrap!important;
 align-items:flex-start!important;
 gap:12px!important;
 width:100%!important;
 max-width:100%!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
}
[data-ct288-discover] .ct288-rail>.ct288-card,
[data-ct288-discover] .ct288-top-row>.ct288-card,
.ct263-media-rail>.ct263-media-card{
 flex:0 0 var(--ct-media-card-w)!important;
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
}
[data-ct288-discover] .ct288-rail.ct288-expanded{
 display:grid!important;
 grid-template-columns:repeat(auto-fill,var(--ct-media-card-w))!important;
 grid-auto-columns:var(--ct-media-card-w)!important;
 justify-content:start!important;
 align-items:start!important;
 gap:12px!important;
 overflow:visible!important;
}
[data-ct288-discover] .ct288-rail.ct288-expanded>.ct288-card{
 width:var(--ct-media-card-w)!important;
 min-width:var(--ct-media-card-w)!important;
 max-width:var(--ct-media-card-w)!important;
}
[data-ct288-discover] .ct288-top-row>.ct171-top-card{
 display:none!important;
}
.ct-media-card-lock .ct-media-copy-lock h1,.ct-media-card-lock .ct-media-copy-lock h2,
.ct-media-card-lock .ct-media-copy-lock h3,.ct-media-card-lock .ct-media-copy-lock h4{
 margin:0!important;
}
`;
let style=document.getElementById(STYLE_ID);
if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
style.textContent=css;

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=(x,...ks)=>{for(const k of ks)if(x&&x[k]!=null&&x[k]!=='')return x[k];return''};
function mediaType(x){const t=String(val(x,'media_type','type','mediaKind','media_kind')||'').toLowerCase();return t==='movie'?'movie':'tv'}
function mediaId(x){return Number(val(x,'id','tmdb_id','tmdbId')||0)}
function title(x){return val(x,'title','name','original_title','original_name')||'Sem título'}
function poster(x){return val(x,'poster_path','poster','posterPath','image')||''}
function year(x){return String(val(x,'release_date','first_air_date','year')||'').slice(0,4)}
function score(x){const n=Number(val(x,'vote_average','rating','score')||0);return Number.isFinite(n)&&n>0?n.toFixed(1):''}
function posterUrl(p){if(!p)return'';if(/^https?:\/\//.test(String(p)))return String(p);return `https://image.tmdb.org/t/p/w342${String(p).startsWith('/')?'':'/'}${p}`}
function standardTopCard(x,i){
 const t=mediaType(x),id=mediaId(x),key=`${t}:${id}`,p=poster(x),meta=[year(x),t==='movie'?'Filme':'Série',score(x)?`★ ${score(x)}`:''].filter(Boolean).join(' · ');
 return `<article class="ct288-card ct-media-card-lock" data-ct288-card="${esc(key)}"><span class="ct288-rank">${Number(i||0)+1}</span><button type="button" class="ct288-open ct-media-primary" data-media="${esc(key)}">${p?`<img class="ct288-poster ct-media-poster-lock" src="${esc(posterUrl(p))}" alt="" loading="lazy">`:'<div class="ct288-poster ct288-poster-empty ct-media-poster-lock">Sem capa</div>'}<span class="ct288-copy ct-media-copy-lock"><b class="ct-media-title-lock">${esc(title(x))}</b><small class="ct-media-meta-lock">${esc(meta||'—')}</small></span></button></article>`;
}
window.ct171TopCard=standardTopCard;
window.__ctR290TopCard=standardTopCard;

const CARD_SELECTORS='.ct263-media-card,.ct288-card,.ct288-empty-card,.media-card,.movie-card,.series-card,.anime-card,[data-media-card]';
const POSTER_SELECTORS='.ct263-media-poster,.ct288-poster,.ct288-empty-poster,.tmdb-poster,.poster,[class*="media-poster"],[class*="movie-poster"],[class*="series-poster"],[class*="anime-poster"]';
const COPY_SELECTORS='.ct263-media-copy,.ct288-copy,.media-copy,.card-body,[class*="media-copy"]';
const TITLE_SELECTORS='.ct263-media-copy>b,.ct288-copy>b,.media-title,.card-title,h3,h4';
const META_SELECTORS='.ct263-media-copy>small,.ct263-media-copy>span,.ct288-copy>small,.media-meta,.card-meta';
function lock(card){
 if(!(card instanceof Element))return;
 card.classList.add('ct-media-card-lock');
 const trigger=card.matches('[data-media]')?card:card.querySelector(':scope > [data-media],:scope > button[data-media],:scope > a[data-media]');
 if(trigger&&trigger!==card)trigger.classList.add('ct-media-primary');
 const p=card.querySelector(POSTER_SELECTORS);if(p)p.classList.add('ct-media-poster-lock');
 const copy=card.querySelector(COPY_SELECTORS);if(copy)copy.classList.add('ct-media-copy-lock');
 const t=copy?.querySelector(TITLE_SELECTORS)||card.querySelector(TITLE_SELECTORS);if(t)t.classList.add('ct-media-title-lock');
 for(const m of card.querySelectorAll(META_SELECTORS))m.classList.add('ct-media-meta-lock');
}
function scan(root=document){
 const scope=root instanceof Element||root instanceof Document||root instanceof DocumentFragment?root:document;
 for(const card of scope.querySelectorAll?.(CARD_SELECTORS)||[])lock(card);
 for(const trigger of scope.querySelectorAll?.('[data-media]')||[]){
  const card=trigger.closest('.ct263-media-card,.ct288-card,.media-card,.movie-card,.series-card,.anime-card,[data-media-card],article.card,div.card,li.card');
  if(card)lock(card);
 }
 for(const card of scope.querySelectorAll?.('.card')||[]){
  if(card.classList.contains('ct-media-card-lock'))continue;
  if(card.querySelector('[data-media],.tmdb-poster,img[src*="image.tmdb.org"],.media-meta'))lock(card);
 }
}
window.__ctR290Scan=scan;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});else scan(document);
const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.(CARD_SELECTORS+',.card,[data-media]'))scan(n.parentNode||n);else if(n.querySelector?.(CARD_SELECTORS+',.card,[data-media]'))scan(n)}});
mo.observe(document.documentElement,{subtree:true,childList:true});
window.__ctR290Observer=mo;
})();