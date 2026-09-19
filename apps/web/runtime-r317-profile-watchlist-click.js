/* CineTracker Web 1.0.108 r317 — hard Watchlist stat click capture + exact Profile stat order. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR317)return;
window.__ctR317='profile-watchlist-hard-click+exact-order-singular-alias';
window.__ctR317Profile='movie-series-watchlist-open-by-label+ten-stat-order';
window.__ctR317Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

const ORDER317=[
 ['episodes',['episodios']],
 ['movies',['filmes']],
 ['series-watch',['series watchlist']],
 ['movies-watch',['filmes watchlist']],
 ['series-time',['tempo em series']],
 ['movies-time',['tempo em filmes']],
 ['series-watch-time',['tempo de serie em watchlist','tempo de series em watchlist','tempo em serie watchlist','tempo em series watchlist']],
 ['movies-watch-time',['tempo de filme em watchlist','tempo de filmes em watchlist','tempo em filme watchlist','tempo em filmes watchlist']],
 ['screen-total',['tempo total de tela']],
 ['watch-total',['tempo total em watchlist']]
];
const ORDER_MAP317=new Map(ORDER317.map(([k],i)=>[k,i+1]));
const DATA_KEY317={
 'episodes':'episodes','movies':'movies','series-watch':'series-watch','movies-watch':'movies-watch',
 'series-time':'series-time','movies-time':'movies-time','series-watch-time':'series-watch-time',
 'movies-watch-time':'movies-watch-time','screen-total':'screen-total','watch-total':'watch-total'
};
function label317(card){return norm(q('small,label,.stat-label,.label',card)?.textContent||'')}
function statKey317(card){
 const l=label317(card);for(const [key,labels] of ORDER317)if(labels.includes(l))return key;return'';
}
function watchKind317(card){
 const l=label317(card);return l==='filmes watchlist'?'movie':l==='series watchlist'?'series':'';
}
function statFromTarget317(target){
 if(!target?.closest)return null;
 const card=target.closest('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]');
 return card&&watchKind317(card)?card:null;
}
function decorate317(root=q('[data-profile]')){
 if(!root)return false;
 const cards=qa('.stat,[data-stat],.stat-card,.profile-stat',root).filter(x=>statKey317(x));
 if(!cards.length)return false;
 const groups=new Map();for(const c of cards){const p=c.parentElement;if(p)groups.set(p,(groups.get(p)||0)+1)}
 const grid=[...groups.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
 if(grid){grid.classList.add('ct237-profile-stats','ct317-profile-stats');grid.dataset.ct317Order='exact-ten'}
 for(const card of cards){
  const key=statKey317(card);if(!key)continue;
  card.dataset.ct237ProfileStat=DATA_KEY317[key]||key;
  card.dataset.ct317ProfileStat=key;
  card.style.order=String(ORDER_MAP317.get(key)||99);
  card.style.gridColumn=(key==='screen-total'||key==='watch-total')?'span 2':'span 1';
  const kind=watchKind317(card);if(kind){
   card.dataset.ct317Watchlist=kind;
   card.dataset.ct316Watchlist=kind;
   card.classList.remove('ct315-watchlist-static');
   card.classList.add('ct317-watchlist-stat');
   card.setAttribute('role','button');card.setAttribute('tabindex','0');
   card.setAttribute('aria-label',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist');
   card.setAttribute('title',kind==='movie'?'Abrir Filmes Watchlist':'Abrir Séries Watchlist');
  }
 }
 root.dataset.ct317Profile='exact-order+hard-watch-click';
 return true;
}
function open317(kind){
 try{
  if(window.__ctR316&&typeof window.__ctR316.openWatchlist==='function'){
   void window.__ctR316.openWatchlist(kind==='movie'?'movie':'series');return true;
  }
 }catch{}
 return false;
}
function handle317(target){
 const card=statFromTarget317(target);if(!card)return false;
 const kind=watchKind317(card);if(!kind)return false;
 decorate317(card.closest('[data-profile]')||q('[data-profile]'));
 return open317(kind);
}
window.__ctR317EarlyHandle=handle317;

function sync317(){
 if(!['profile','perfil'].includes(routeNow()))return;
 decorate317();
}
for(const ms of[0,25,90,220,500,1000,1800])setTimeout(sync317,ms);
window.addEventListener('popstate',()=>{for(const ms of[0,80,260])setTimeout(sync317,ms)});
window.addEventListener('cinetracker:data-changed',()=>{for(const ms of[0,80,260])setTimeout(sync317,ms)});
try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(['profile','perfil'].includes(routeNow()))requestAnimationFrame(sync317)}).observe(app,{subtree:true,childList:true,characterData:true});
}catch{}

const style=document.createElement('style');style.id='ct-web-r317';style.textContent=`
[data-profile] .ct317-profile-stats{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
[data-profile] .ct317-profile-stats>[data-ct317-profile-stat="screen-total"],
[data-profile] .ct317-profile-stats>[data-ct317-profile-stat="watch-total"]{grid-column:span 2!important}
[data-profile] .ct317-watchlist-stat{position:relative!important;pointer-events:auto!important;cursor:pointer!important;padding-right:30px!important;z-index:1!important}
[data-profile] .ct317-watchlist-stat::after{content:'›'!important;display:block!important;position:absolute!important;right:11px!important;top:50%!important;transform:translateY(-50%)!important;font-size:22px!important;line-height:1!important;opacity:.82!important;pointer-events:none!important}
[data-profile] .ct317-watchlist-stat:hover,[data-profile] .ct317-watchlist-stat:focus-visible{border-color:#3d7892!important;background:#0d202a!important;outline:none!important}
@media(max-width:700px){[data-profile] .ct317-profile-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-profile] .ct317-profile-stats>[data-ct317-profile-stat="screen-total"],[data-profile] .ct317-profile-stats>[data-ct317-profile-stat="watch-total"]{grid-column:span 2!important}}
`;
document.head.appendChild(style);

window.__ctR317={decorate:decorate317,handle:handle317,watchKind:watchKind317,statKey:statKey317,version:'1.0.108'};
window.__ctR317Test={ORDER317,decorate317,handle317,watchKind317,statKey317};
})();
