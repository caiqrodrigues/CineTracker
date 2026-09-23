/* CineTracker Web 1.0.135 r344 — Pra Você canonical metadata/actions + Top 10 ten-up viewport. */
(()=>{
'use strict';
if(window.__ctR344?.version==='1.0.135')return;
window.__ctR344Marker='foryou-primary-genre+canonical-actions+top10-ten-up';
window.__ctR344Discover='one-primary-genre-inside-card+swap-always-present+actions-after-copy';
window.__ctR344Top10='desktop-grid-10-visible-no-horizontal-cut';
window.__ctR344Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const G={12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e Aventura',10762:'Infantil',10764:'Reality',10765:'Sci-Fi e Fantasia',10766:'Novela',10768:'Guerra e Política'};
const detailCache=new Map();

function mediaType344(x){
 const t=String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase();
 return t==='movie'?'movie':'tv';
}
function mediaId344(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function primaryGenre344(x){
 const named=[...rows(x?.genres),...rows(x?.raw_tmdb?.genres)].map(g=>String(g?.name||'').trim()).filter(Boolean);
 if(named.length)return named[0];
 const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number).filter(Boolean);
 return ids.map(id=>G[id]).find(Boolean)||'';
}
async function ensureGenre344(x,el){
 if(!x||!el)return'';
 const direct=primaryGenre344(x);if(direct){el.textContent=direct;el.dataset.ct344GenreReady='1';return direct}
 const id=mediaId344(x);if(!(id>0)||typeof safeTmdb!=='function'){el.textContent='Gênero não informado';return''}
 const type=mediaType344(x),key=type+':'+id;
 let p=detailCache.get(key);
 if(!p){p=Promise.resolve(safeTmdb('/'+type+'/'+id)).catch(()=>null);detailCache.set(key,p)}
 const d=await p;if(!el.isConnected)return'';
 const g=primaryGenre344(d||{});
 el.textContent=g||'Gênero não informado';if(g)el.dataset.ct344GenreReady='1';return g;
}
function modelItem344(slot,model){
 const name=String(slot?.dataset?.ct336Slot||'');
 if(name==='daily')return model?.daily||null;
 const [bucket,kind]=name.split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
 return model?.[bucket]?.[kind]||null;
}
function poolLength344(slot,model){
 const name=String(slot?.dataset?.ct336Slot||'');
 if(name==='daily')return Number(model?.dailyLength||0);
 const [bucket,kind]=name.split(':');
 return Number(model?.lengths?.[bucket]?.[kind]||0);
}
function canonicalActions344(slot,model){
 if(!slot)return false;
 const slotName=String(slot.dataset.ct336Slot||''),bucket=slotName==='daily'?'daily':slotName.split(':')[0];
 let row=q(':scope > .ct336-actions',slot);
 if(!row){row=document.createElement('div');row.className='ct336-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');slot.appendChild(row)}
 const find=(sel)=>q(sel,slot);
 let watch=find('[data-ct336-action="watchlist"]');
 let seen=find('[data-ct336-action="seen"]');
 let swap=find('[data-ct336-swap-only]');
 const swapName=slotName==='daily'?'daily':slotName;
 const mk=(action,label)=>{
  const b=document.createElement('button');b.type='button';b.className='chip ct336-action';b.textContent=label;
  if(action==='swap')b.dataset.ct336SwapOnly=swapName;
  else{b.dataset.ct336Action=action;const card=q('[data-ct288-card]',slot);if(card?.dataset?.ct288Card)b.dataset.ct336Media=card.dataset.ct288Card;if(swapName)b.dataset.ct336Swap=swapName}
  return b;
 };
 if(bucket!=='watch'&&!watch)watch=mk('watchlist','+ Watchlist');
 if(!seen)seen=mk('seen','✓ Visto');
 if(!swap)swap=mk('swap','↻ Trocar');
 if(watch){watch.textContent='+ Watchlist';watch.classList.add('ct336-action')}
 seen.textContent='✓ Visto';seen.classList.add('ct336-action');
 swap.textContent='↻ Trocar';swap.classList.add('ct336-action');swap.dataset.ct336SwapOnly=swapName;
 row.innerHTML='';
 if(bucket!=='watch'&&watch)row.appendChild(watch);
 row.appendChild(seen);row.appendChild(swap);
 row.classList.toggle('ct336-actions-two',bucket==='watch');row.classList.toggle('ct336-actions-three',bucket!=='watch');
 const canSwap=poolLength344(slot,model)>1;
 swap.disabled=!canSwap;swap.hidden=false;swap.style.setProperty('display','flex','important');swap.style.setProperty('visibility','visible','important');
 qa('.ct122-media-actions',slot).forEach(old=>{if(!old.children.length)old.remove()});
 return true;
}
function decorateForYou344(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 const model=window.__ctR336Test?.fyModel336?.();if(!model)return false;
 qa('.ct122-media-info,.ct122-card-meta',root).forEach(x=>x.remove());
 for(const slot of qa('.ct336-slot',root)){
  const item=modelItem344(slot,model),copy=q('.ct336-cardwrap .ct288-copy',slot);
  if(copy){
   let genre=q(':scope > .ct344-primary-genre',copy);
   if(!genre){genre=document.createElement('small');genre.className='ct344-primary-genre';copy.appendChild(genre)}
   const g=primaryGenre344(item||{});
   genre.textContent=g||'Gênero não informado';
   if(g)genre.dataset.ct344GenreReady='1';else void ensureGenre344(item,genre);
  }
  canonicalActions344(slot,model);
 }
 root.dataset.ct344Decorated='1';
 return true;
}
function fitTopTen344(){
 const root=q('[data-ct321-top-content]');if(!root)return false;
 for(const row of qa('.ct319-top-row',root)){
  row.dataset.ct344TenUp='1';
  for(const item of qa(':scope > .ct319-item',row))item.dataset.ct344TopItem='1';
 }
 return true;
}

const style=document.createElement('style');style.id='ct-web-r344';style.textContent=`
[data-ct336-foryou] .ct336-cardwrap .ct288-copy{
 box-sizing:border-box!important;display:block!important;min-height:52px!important;padding-top:6px!important;
}
[data-ct336-foryou] .ct336-cardwrap .ct288-copy>b,
[data-ct336-foryou] .ct336-cardwrap .ct288-copy>small{
 display:block!important;width:100%!important;max-width:100%!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
[data-ct336-foryou] .ct336-cardwrap .ct288-copy>.ct344-primary-genre{
 margin-top:3px!important;min-height:12px!important;font-size:10px!important;line-height:12px!important;opacity:.72!important;
}
[data-ct336-foryou] .ct122-media-info,[data-ct336-foryou] .ct122-card-meta{display:none!important}
[data-ct336-foryou] .ct336-actions{flex:none!important;align-self:flex-start!important;visibility:visible!important;overflow:hidden!important}
[data-ct336-foryou] .ct336-actions>.ct336-action{
 display:flex!important;visibility:visible!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
[data-ct336-foryou] .ct336-actions>[data-ct336-swap-only][disabled]{display:flex!important;visibility:visible!important;opacity:.48!important}

@media(min-width:1000px){
 [data-ct321-top-content] .ct319-top-row{
  box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;
  gap:6px!important;width:100%!important;max-width:100%!important;overflow:visible!important;padding:2px 0 8px!important;
 }
 [data-ct321-top-content] .ct319-top-row>.ct319-item{
  box-sizing:border-box!important;display:flex!important;flex:none!important;width:auto!important;min-width:0!important;max-width:none!important;overflow:visible!important;
 }
 [data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,
 [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open,
 [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster{
  box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;
 }
 [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-copy b{font-size:10px!important}
 [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-copy small{font-size:8px!important}
 [data-ct321-top-content] .ct319-top-row>.ct319-item .ct319-actions>.chip{font-size:7px!important;padding-inline:1px!important}
}
`;document.head.appendChild(style);

window.__ctR344={
 version:'1.0.135',decorateForYou:decorateForYou344,fitTopTen:fitTopTen344,
 primaryGenre:primaryGenre344,canonicalActions:canonicalActions344
};
window.__ctR344Test={primaryGenre344,modelItem344,poolLength344,canonicalActions344,decorateForYou344,fitTopTen344};
setTimeout(()=>{decorateForYou344();fitTopTen344()},0);
})();