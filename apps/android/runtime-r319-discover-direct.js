/* Android 1.0/r319 — independent, bounded Discover data for non-ForYou tabs.
 * The legacy discoverRows chain has >20 wrappers, many remote enrichments
 * and cached promises that leave the page on "Carregando títulos...".
 * Never replace audited Pra Você, Top 10 or any other screen.
 */
(()=>{
'use strict';
if(window.__ctR319Discover)return;
const tabs=new Set(['trending','popular','new','releases','anticipated','top','calendar']);
const list=x=>Array.isArray(x)?x:[];
const uid=()=>String(session?.user?.id||user?.id||'');
const now=()=>Date.now();
const day=(offset=0)=>{
 const d=new Date();d.setDate(d.getDate()+offset);
 return d.toISOString().slice(0,10);
};
const info=(tab)=>{
 const common={include_adult:false,language:'pt-BR',page:1};
 const pair=(movie,tv)=>[
  ['/discover/movie',{...common,...movie},'movie'],
  ['/discover/tv',{...common,...tv},'tv']
 ];
 switch(tab){
  case'trending':return[['/trending/all/week',{...common},'mixed']];
  case'popular':return[['/movie/popular',common,'movie'],['/tv/popular',common,'tv']];
  case'new':return pair({'primary_release_date.gte':day(-35),'primary_release_date.lte':day(),sort_by:'primary_release_date.desc'},
                         {'first_air_date.gte':day(-35),'first_air_date.lte':day(),sort_by:'first_air_date.desc'});
  case'releases':return pair({'primary_release_date.gte':day(-7),'primary_release_date.lte':day(90),sort_by:'primary_release_date.asc'},
                              {'first_air_date.gte':day(-7),'first_air_date.lte':day(90),sort_by:'first_air_date.asc'});
  case'anticipated':return pair({'primary_release_date.gte':day(1),sort_by:'popularity.desc'},
                                 {'first_air_date.gte':day(1),sort_by:'popularity.desc'});
  case'top':return[['/movie/top_rated',common,'movie'],['/tv/top_rated',common,'tv']];
  case'calendar':return pair({'primary_release_date.gte':day(),'primary_release_date.lte':day(90),sort_by:'primary_release_date.asc'},
                              {'first_air_date.gte':day(),'first_air_date.lte':day(90),sort_by:'first_air_date.asc'});
  default:return[];
 }
};
const stamp=x=>String(x?.release_date||x?.first_air_date||'');
const key=x=>String(x?.media_type)+':'+String(x?.id||x?.tmdb_id||'');
const timeout=(p,ms,label)=>new Promise((resolve,reject)=>{
 let done=false;
 const tid=setTimeout(()=>{if(!done){done=true;reject(Error(label+' expirou'))}},ms);
 Promise.resolve(p).then(v=>{if(!done){done=true;clearTimeout(tid);resolve(v)}},
  e=>{if(!done){done=true;clearTimeout(tid);reject(e)}});
});
let account='',requests=new Map(),cached=new Map(),checks=0,successes=0,errors=0,lastError='';
function reset(){
 const id=uid();if(id===account)return;
 account=id;requests.clear();cached.clear();lastError='';
}
async function rows(tab){
 reset();
 if(!tabs.has(tab))throw Error('Aba não suportada pelo carregador de Descobrir');
 if(!account||!session?.access_token)throw Error('Entre na sua conta para carregar Descobrir');
 const id=account,keyCache=id+':'+tab+':'+day();
 const good=cached.get(keyCache);
 if(good&&now()-good.at<5*60000)return good.rows;
 if(requests.has(keyCache))return requests.get(keyCache);
 const job=(async()=>{
  const specs=info(tab);
  const replies=await Promise.allSettled(specs.map(async([path,params,type])=>{
   const response=await timeout(safeTmdb(path,params),7000,'Fonte '+tab);
   return list(response?.results).map(x=>({...x,media_type:type==='mixed'?x.media_type:type}))
    .filter(x=>['movie','tv'].includes(x.media_type));
  }));
  if(uid()!==id)throw Error('Conta alterada durante a consulta');
  if(replies.every(x=>x.status==='rejected'))throw Error('As fontes de '+tab+' não responderam');
  const unique=new Map();
  for(const reply of replies){
   if(reply.status!=='fulfilled')continue;
   for(const item of reply.value){
    if(!window.__ctR265Test?.allowed?.(item))continue;
    const k=key(item);if(!unique.has(k))unique.set(k,item);
   }
  }
  const candidates=[...unique.values()].slice(0,38);
  if(!candidates.length){cached.set(keyCache,{at:now(),rows:[]});return []}
  // The server must verify each candidate against the current user's
  // watched, Watchlist, not-interested and alias sets before display.
  const audit=window.__ctR279Audit;
  if(!audit?.auditCandidates||!audit?.permitted)throw Error('Filtro pessoal indisponível');
  checks++;
  const verified=await timeout(audit.auditCandidates(candidates),10000,'Verificação pessoal');
  if(uid()!==id)throw Error('Conta alterada durante a verificação');
  if(verified!==true)throw Error('O servidor não confirmou todos os títulos');
  let items=candidates.filter(x=>audit.permitted(x,false)===true);
  if(['new','releases','anticipated','calendar'].includes(tab))
   items.sort((a,b)=>stamp(a).localeCompare(stamp(b))*(tab==='new'?-1:1));
  else items.sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)||
   Number(b.popularity||0)-Number(a.popularity||0));
  if(tab==='popular'||tab==='trending'||tab==='anticipated')items.sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
  cached.set(keyCache,{at:now(),rows:items});successes++;
  return items;
 })().catch(error=>{errors++;lastError=String(error?.message||error);throw error})
 .finally(()=>{requests.delete(keyCache)});
 requests.set(keyCache,job);return job;
}
const style=document.createElement('style');
style.id='ct319-discover-sized-genres';
style.textContent=[
 // Cards are ALWAYS portrait and bounded. Do not size based on card content.
 '[data-discover] .discover-carousel{display:flex!important;flex-wrap:nowrap!important;align-items:stretch!important;overflow-x:auto!important;overflow-y:hidden!important;gap:9px!important;scroll-snap-type:x proximity!important;max-width:100%!important;min-width:0!important}',
 '[data-discover] .discover-carousel>.discover-card,[data-discover] .discover-carousel>.ct315-card,[data-discover] .discover-carousel>.ct171-top-card{flex:0 0 clamp(130px,38vw,172px)!important;width:clamp(130px,38vw,172px)!important;max-width:172px!important;min-width:0!important;height:auto!important;box-sizing:border-box!important;scroll-snap-align:start!important}',
 '[data-discover] .discover-carousel .poster{width:100%!important;height:auto!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}',
 '[data-discover] .discover-carousel .card-body{min-width:0!important;max-width:100%!important;overflow:hidden!important;box-sizing:border-box!important}',
 '[data-discover] .discover-carousel .card-body b{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:11px!important}',
 '[data-discover] .ct315-card [data-ct315-meta]{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;line-clamp:2!important;white-space:normal!important;overflow:hidden!important;overflow-wrap:break-word!important}',
 // The detail page genre string is not an input; allow real word wrapping
 // instead of clipping the whole metadata line or growing the mobile viewport.
 '[data-detail] .ct169-detail-copy,[data-detail] .detail-copy,.ct169-detail-hero .ct169-detail-copy{min-width:0!important;max-width:100%!important;overflow-wrap:break-word!important}',
 '[data-detail] .ct169-meta,[data-detail] .detail-copy .meta,.ct173-detail-window .ct169-meta{display:block!important;min-width:0!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:break-word!important;word-break:normal!important;line-height:1.55!important}',
 '[data-detail] .ct169-meta span,[data-detail] .detail-copy .meta span{white-space:normal!important;overflow-wrap:break-word!important}',
 '[data-detail] .ct169-detail-copy h1,[data-detail] .detail-copy h1{max-width:100%!important;white-space:normal!important;overflow-wrap:break-word!important}',
 '@media(max-width:440px){[data-discover] .discover-carousel{gap:7px!important}[data-discover] .discover-carousel>.discover-card,[data-discover] .discover-carousel>.ct315-card,[data-discover] .discover-carousel>.ct171-top-card{flex-basis:clamp(125px,40vw,158px)!important;width:clamp(125px,40vw,158px)!important}}'
].join('\n');
document.head.appendChild(style);
window.__ctR319Discover={rows,stats:()=>({account,checks,successes,errors,lastError,inflight:requests.size,cache:cached.size}),scope:'Discover non-ForYou only; media details genre CSS'};
})();
