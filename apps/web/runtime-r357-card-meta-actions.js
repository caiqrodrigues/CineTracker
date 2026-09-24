/* CineTracker Web 1.0.148 r357 — universal media badge/meta + final Pra Você action owner. */
(()=>{
'use strict';
if(window.__ctR357?.version==='1.0.148')return;
window.__ctR357Marker='media-kind-badge+full-meta+foryou-final-click-owner+national-team-ready';
window.__ctR357Scope='media-cards+discover-foryou-actions+sports-national-teams';
window.__ctR357Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const G={12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e Aventura',10762:'Infantil',10764:'Reality',10765:'Sci-Fi e Fantasia',10766:'Novela',10768:'Guerra e Política'};
const detailCache=new Map();
let metaMo=null,metaHost=null;

function type357(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function id357(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function anime357(x){
 try{if(typeof ct288Anime==='function')return !!ct288Anime(x)}catch{}
 const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids),...rows(x?.genres).map(g=>Number(g?.id||0))].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());
 return type357(x)==='tv'&&ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function kind357(x){return type357(x)==='movie'?'Filme':anime357(x)?'Anime':'Série'}
function year357(x){return String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)}
function score357(x){const n=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);return Number.isFinite(n)&&n>0?n:0}
function genre357(x){
 try{const g=window.__ctR344?.primaryGenre?.(x);if(g)return String(g)}catch{}
 const named=[...rows(x?.genres),...rows(x?.raw_tmdb?.genres)].map(g=>String(typeof g==='string'?g:g?.name||'').trim()).filter(Boolean);
 if(named.length)return named[0];
 const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number).filter(Boolean);
 return ids.map(id=>G[id]).find(Boolean)||'';
}
function metaText357({year='',score=0,genre=''}){return [year,score>0?'★ '+score.toFixed(1):'★ —',genre||'Gênero não informado'].filter(Boolean).join(' · ')}
function esc357(v){try{return typeof esc263==='function'?esc263(v):String(v??'')}catch{return String(v??'')}}
function poster357(x){try{return typeof ct288Poster==='function'?ct288Poster(x):''}catch{return''}}
function title357(x){try{return typeof title263==='function'?title263(x):String(x?.title||x?.name||'')}catch{return String(x?.title||x?.name||'')}}
function imageCard357(x,{rank=0,watch=false,add=true}={}){
 if(!x)return '<div class="ct288-empty-card"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Tente novamente mais tarde</small></div>';
 const type=type357(x),id=id357(x),key=type+':'+id,yr=year357(x),sc=score357(x),gr=genre357(x),kind=kind357(x);
 return '<article class="ct288-card" data-ct288-card="'+esc357(key)+'" data-ct357-year="'+esc357(yr)+'" data-ct357-score="'+String(sc||0)+'" data-ct357-genre="'+esc357(gr)+'">'+
  (rank?'<span class="ct288-rank">'+rank+'</span>':'')+
  '<button type="button" class="ct288-open" data-media="'+esc357(key)+'">'+
   '<span class="ct357-poster-shell">'+poster357(x)+'<span class="ct357-kind-badge">'+esc357(kind)+'</span></span>'+
   '<span class="ct288-copy"><b>'+esc357(title357(x))+'</b><small class="ct357-meta">'+esc357(metaText357({year:yr,score:sc,genre:gr}))+'</small></span>'+
  '</button>'+
  (watch?'<button type="button" class="ct288-state on" disabled aria-label="Na Watchlist">✓</button>':add?'<button type="button" class="ct288-state" data-ct288-add="'+esc357(key)+'" aria-label="Adicionar à Watchlist">+</button>':'')+
 '</article>';
}
try{
 ct288Meta=function(x){return metaText357({year:year357(x),score:score357(x),genre:genre357(x)})};
 ct288Card=imageCard357;
}catch{}

async function detail357(key){
 if(detailCache.has(key))return detailCache.get(key);
 const m=String(key||'').match(/^(movie|tv):(\d+)$/);if(!m||typeof safeTmdb!=='function')return null;
 const p=Promise.resolve(safeTmdb('/'+m[1]+'/'+m[2],{})).catch(()=>null);detailCache.set(key,p);return p;
}
function applyDetail357(card,d){
 if(!card||!d)return false;
 const key=String(card.dataset.ct288Card||''),m=key.match(/^(movie|tv):(\d+)$/);if(!m)return false;
 const merged={...d,media_type:m[1]},yr=year357(merged)||card.dataset.ct357Year||'',sc=score357(merged)||Number(card.dataset.ct357Score||0),gr=genre357(merged)||card.dataset.ct357Genre||'';
 card.dataset.ct357Year=yr;card.dataset.ct357Score=String(sc||0);card.dataset.ct357Genre=gr;
 const meta=q('.ct357-meta',card);if(meta)meta.textContent=metaText357({year:yr,score:sc,genre:gr});
 const badge=q('.ct357-kind-badge',card);if(badge)badge.textContent=kind357(merged);
 q('.ct344-primary-genre',card)?.remove();
 return true;
}
async function enrichCard357(card){
 if(!card||card.dataset.ct357Loading==='1')return false;
 const key=String(card.dataset.ct288Card||''),score=Number(card.dataset.ct357Score||0),genre=String(card.dataset.ct357Genre||'');
 q('.ct344-primary-genre',card)?.remove();
 if(score>0&&genre)return true;
 card.dataset.ct357Loading='1';
 try{const d=await detail357(key);if(d)applyDetail357(card,d)}
 finally{delete card.dataset.ct357Loading}
 return true;
}
function normalizeCards357(root=document){
 const cards=qa('.ct288-card[data-ct288-card]',root);for(const card of cards)void enrichCard357(card);
 return cards.length;
}
function bindCards357(){
 const h=q('#app')||document.body;if(!h||h===metaHost)return false;
 metaMo?.disconnect?.();metaHost=h;
 metaMo=new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length||m.removedNodes.length))queueMicrotask(()=>normalizeCards357(h))});
 metaMo.observe(h,{subtree:true,childList:true});queueMicrotask(()=>normalizeCards357(h));return true;
}

/* Final, direct owner for Descobrir > Pra você actions. No r354/r355/r356 chain. */
function validKey357(v){return /^(movie|tv):\d+$/.test(String(v||''))?String(v):''}
function repairAction357(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||''),key=validKey357(q('[data-ct288-card]',slot)?.dataset?.ct288Card);
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar')){btn.dataset.ct336SwapOnly=name;return{slot,name,key,action:'swap'}}
 const action=label.includes('watchlist')?'watchlist':label.includes('visto')?'seen':String(btn.dataset.ct336Action||'');
 if(!['watchlist','seen'].includes(action)||!key)return null;
 btn.dataset.ct336Action=action;btn.dataset.ct336Swap=name;btn.dataset.ct336Media=key;
 try{window.__ctR356Test?.syncStateToVisible?.(name,key)}catch{}
 return{slot,name,key,action};
}
function directClick357(target,event){
 if(!target?.closest)return false;
 let routeName='';try{routeName=String(typeof route==='function'?route():'')}catch{}
 if(routeName!=='discover'||!target.closest('[data-ct336-foryou]'))return false;
 const btn=target.closest('button.ct336-action,.ct336-actions button');if(!btn||btn.disabled)return false;
 const meta=repairAction357(btn);if(!meta)return false;
 let ok=false;
 try{
  if(meta.action==='swap')ok=!!window.__ctR352?.swap?.(btn);
  else ok=!!window.__ctR352?.action?.(btn);
 }catch{}
 if(!ok){
  try{ok=meta.action==='swap'?!!window.__ctR355?.swap?.(btn):!!window.__ctR355?.action?.(btn)}catch{}
 }
 if(ok){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  queueMicrotask(()=>{try{window.__ctR348?.fixAll?.()}catch{};try{window.__ctR349?.compact?.()}catch{};normalizeCards357(meta.slot)});
 }
 return ok;
}
window.__ctR357DirectClick=directClick357;

const style=document.createElement('style');style.id='ct-web-r357';style.textContent=`
.ct357-poster-shell{display:block!important;position:relative!important;width:100%!important}
.ct357-poster-shell>.ct288-poster,.ct357-poster-shell>.ct288-empty-poster{width:100%!important}
.ct357-kind-badge{
 position:absolute!important;left:7px!important;bottom:7px!important;z-index:5!important;display:inline-flex!important;align-items:center!important;
 min-height:20px!important;padding:3px 7px!important;border-radius:999px!important;background:rgba(4,14,21,.88)!important;
 border:1px solid rgba(117,211,255,.7)!important;color:#f2fbff!important;font-size:9px!important;font-weight:700!important;line-height:1!important;
 backdrop-filter:blur(4px)!important;pointer-events:none!important
}
.ct288-copy>.ct357-meta{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct288-copy>.ct344-primary-genre{display:none!important}
`;document.head.appendChild(style);

setTimeout(()=>{bindCards357();normalizeCards357()},0);
window.__ctR357={version:'1.0.148',card:imageCard357,normalizeCards:normalizeCards357,enrichCard:enrichCard357,directClick:directClick357,repairAction:repairAction357,kind:kind357,genre:genre357};
window.__ctR357Test={imageCard357,metaText357,kind357,genre357,repairAction357,directClick357,applyDetail357};
})();