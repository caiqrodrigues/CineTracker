/* CineTracker Android 1.0/r322 — complete, audited Top 10 for one streaming.
 * Android Discover only. Continue beyond the first two TMDB pages whenever
 * personal exclusions leave fewer than ten eligible titles in either rail.
 */
(()=>{
'use strict';
if(window.__ctR322Top10)return;
const api=window.__ctR320Discover;
if(!api)throw Error('Android r320 Top 10 entry point unavailable');
const MAX_PAGES=15, WAVE=3;
const cache=new Map(),inflight=new Map();
const userId=()=>String(session?.user?.id||user?.id||'');
const list=x=>Array.isArray(x)?x:[];
const key=x=>String(x?.media_type||'')+':'+String(Number(x?.id||0));
const allowed=x=>window.__ctR265Test?.allowed?.(x)===true;
let lastError='',completed=0,partial=0,requests=0;
function limit(promise,ms,label){
 let timer;
 return Promise.race([Promise.resolve(promise),new Promise((_,reject)=>{
  timer=setTimeout(()=>reject(Error(label+' excedeu '+Math.ceil(ms/1000)+'s')),ms);
 })]).finally(()=>clearTimeout(timer));
}
async function topRows(provider){
 const id=Number(provider),account=userId();
 if(!Number.isSafeInteger(id)||id<=0)throw Error('Streaming inválido');
 if(!account||!session?.access_token)throw Error('Entre na sua conta para consultar o Top 10');
 const cacheKey=account+':'+new Date().toISOString().slice(0,10)+':'+id;
 const prior=cache.get(cacheKey);
 if(prior&&Date.now()-prior.at<300000)return prior.data;
 if(inflight.has(cacheKey))return inflight.get(cacheKey);
 const job=(async()=>{
  const gate=window.__ctR279Audit;
  if(typeof gate?.auditCandidates!=='function'||typeof gate?.permitted!=='function')
   throw Error('Filtro pessoal indisponível');
  const found={movie:new Map(),tv:new Map()};
  const approved={movie:[],tv:[]};
  let successfulPages=0;
  for(let first=1;first<=MAX_PAGES;first+=WAVE){
   if(userId()!==account)throw Error('Conta alterada durante a consulta');
   const required=['movie','tv'].filter(type=>approved[type].length<10);
   if(!required.length)break;
   const specs=required.flatMap(type=>
    Array.from({length:Math.min(WAVE,MAX_PAGES-first+1)},(_,i)=>({type,page:first+i})));
   const replies=await Promise.allSettled(specs.map(({type,page})=>limit(
    Promise.resolve().then(()=>safeTmdb('/discover/'+type,{
     language:'pt-BR',include_adult:false,watch_region:'BR',
     with_watch_providers:id,with_watch_monetization_types:'flatrate',
     sort_by:'popularity.desc',page
    })),8500,'Página '+page+' Top 10')));
   if(userId()!==account)throw Error('Conta alterada durante a consulta');
   const toAudit=[];
   replies.forEach((reply,i)=>{
    if(reply.status!=='fulfilled')return;
    successfulPages++;requests++;
    const type=specs[i].type;
    for(const raw of list(reply.value?.results)){
     const item={...raw,media_type:type},ref=key(item);
     if(!Number.isSafeInteger(Number(item.id))||Number(item.id)<=0||!allowed(item)||found[type].has(ref))continue;
     found[type].set(ref,item);toAudit.push(item);
    }
   });
   if(toAudit.length){
    const verified=await limit(gate.auditCandidates(toAudit),18000,'Auditoria pessoal Top 10');
    if(verified!==true||userId()!==account)
     throw Error('Não foi possível confirmar os títulos com seu histórico e Watchlist');
   }
   for(const type of required){
    approved[type]=[...found[type].values()]
     .filter(x=>gate.permitted(x,false)===true)
     .sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)||
       Number(b.vote_count||0)-Number(a.vote_count||0))
     .slice(0,10);
   }
  }
  if(!successfulPages)throw Error('Os títulos do streaming não responderam');
  if(userId()!==account)throw Error('Conta alterada durante a consulta');
  const data={movies:approved.movie,series:approved.tv};
  if(data.movies.length===10&&data.series.length===10){
   cache.set(cacheKey,{at:Date.now(),data});completed++;
  }else partial++;
  return data;
 })().catch(error=>{lastError=String(error?.message||error);throw error})
 .finally(()=>inflight.delete(cacheKey));
 inflight.set(cacheKey,job);
 return job;
}
api.topRows=topRows;
window.addEventListener('cinetracker:data-changed',()=>cache.clear());
window.__ctR322Top10={topRows,
 stats:()=>({completed,partial,requests,lastError,pending:inflight.size,cache:cache.size}),
 scope:'Android Discover selected streaming; adaptive 10 movies + 10 series after v525 audit'};
})();
