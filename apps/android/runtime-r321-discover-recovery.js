/* CineTracker Android 1.0/r321 — bounded, authenticated Discover Top 10.
 * Replaces the r269 ten-page waterfall only for the selected streaming.
 * Web, database, Home, Sports, Profile and F1 are never modified.
 */
(()=>{
'use strict';
if(window.__ctR321Discover)return;
const api=window.__ctR320Discover;
if(!api)throw Error('Android r320 Discover source missing');
const results=new Map(),inflight=new Map();
const rows=x=>Array.isArray(x)?x:[];
const owner=()=>String(session?.user?.id||user?.id||'');
const ref=x=>String(x?.media_type||'')+':'+String(x?.id||0);
const allow=x=>window.__ctR265Test?.allowed?.(x)===true;
const audit=()=>window.__ctR279Audit;
let successes=0,failures=0,lastError='';
function limited(promise,ms,label){
 let timer;
 return Promise.race([Promise.resolve(promise),new Promise((_,reject)=>{
  timer=setTimeout(()=>reject(Error(label+' excedeu '+Math.ceil(ms/1000)+'s')),ms);
 })]).finally(()=>clearTimeout(timer));
}
function providerRows(provider){
 const id=Number(provider);
 if(!Number.isSafeInteger(id)||id<=0)throw Error('Streaming inválido');
 const account=owner();
 if(!account||!session?.access_token)throw Error('Entre na sua conta para ver o Top 10');
 const key=account+':'+new Date().toISOString().slice(0,10)+':'+id;
 const cached=results.get(key);
 if(cached&&Date.now()-cached.at<300000)return Promise.resolve(cached.data);
 if(inflight.has(key))return inflight.get(key);
 const job=limited((async()=>{
  const source=await Promise.allSettled(['movie','tv'].flatMap(type=>
   [1,2].map(page=>limited(
    Promise.resolve().then(()=>safeTmdb('/discover/'+type,{
     language:'pt-BR',include_adult:false,watch_region:'BR',
     with_watch_providers:id,with_watch_monetization_types:'flatrate',
     sort_by:'popularity.desc',page
    })),8000,'TMDB Top 10'))));
  if(owner()!==account)throw Error('Conta alterada durante o Top 10');
  if(source.every(x=>x.status==='rejected'))throw Error('Os títulos do streaming não responderam');
  const unique=new Map();
  for(let i=0;i<source.length;i++){
   if(source[i].status!=='fulfilled')continue;
   const type=i<2?'movie':'tv';
   for(const raw of rows(source[i].value?.results)){
    const item={...raw,media_type:type};
    if(allow(item)&&!unique.has(ref(item)))unique.set(ref(item),item);
   }
  }
  const candidates=[...unique.values()];
  if(!candidates.length)return {movies:[],series:[]};
  const gate=audit();
  if(!gate?.auditCandidates||!gate?.permitted)throw Error('Filtro de vistos indisponível');
  const verified=await limited(gate.auditCandidates(candidates),12000,'Auditoria Top 10');
  if(verified!==true||owner()!==account)throw Error('Não foi possível verificar as indicações');
  const permitted=candidates.filter(x=>gate.permitted(x,false)===true);
  permitted.sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)||
   Number(b.vote_count||0)-Number(a.vote_count||0));
  const data={
   movies:permitted.filter(x=>x.media_type==='movie').slice(0,10),
   series:permitted.filter(x=>x.media_type==='tv').slice(0,10)
  };
  results.set(key,{at:Date.now(),data});successes++;
  return data;
 })(),22500,'Top 10 selecionado').catch(error=>{
  failures++;lastError=String(error?.message||error);throw error;
 }).finally(()=>inflight.delete(key));
 inflight.set(key,job);
 return job;
}
// The old r269 source can enqueue more than forty TMDB requests after its
// caller times out. The new source has at most four bounded page requests.
api.topRows=providerRows;
window.addEventListener('cinetracker:data-changed',()=>{results.clear()});
window.__ctR321Discover={topRows:providerRows,
 stats:()=>({successes,failures,lastError,pending:inflight.size,cache:results.size}),
 scope:'Android Discover Top 10 selected provider only'};
})();
