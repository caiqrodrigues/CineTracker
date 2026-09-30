/* CineTracker Web 1.0.203 r412 — strict global recommendation/discovery eligibility + Pra Voce action owner repair. */
(()=>{
'use strict';
if(window.__ctR412Eligibility?.version==='1.0.203')return;
const MIN_RUNTIME=40;
const DETAIL_TIMEOUT=5500;
const DETAIL_CONCURRENCY=6;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const state=()=>window.__ctR288R263?.discover263||null;
const mediaType=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const mediaId=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const mediaKey=x=>{const id=mediaId(x);return id>0?mediaType(x)+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const firstPositive=(...v)=>{for(const x of v){const n=Number(x);if(Number.isFinite(n)&&n>0)return n}return 0};
const obj=x=>x&&typeof x==='object'?x:{};
const rawOf=x=>obj(x?.raw_tmdb);
const arrayFrom=(x,...names)=>{for(const n of names){const v=x?.[n];if(Array.isArray(v))return v}return[]};
const namesOf=v=>rows(v).map(x=>norm(typeof x==='string'?x:(x?.name||x?.title||x?.original_name||x?.original_title||''))).filter(Boolean);
const idsOf=v=>rows(v).map(x=>Number(typeof x==='number'?x:(x?.id??x))).filter(Number.isFinite);
const textHas=(arr,terms)=>arr.some(v=>terms.some(t=>v.includes(t)));
const YOUTUBE_TERMS=['youtube','youtube originals','youtube original','youtube premium','youtube red'];
const WEB_TERMS=['web series','webseries','web video','internet video','video blog','vlog'];
const NOVELA_TERMS=['soap opera','soap','telenovela','novela'];
const WWE_RE=/(^|\b)(wwe|wwe raw|monday night raw|friday night smackdown|smackdown)(\b|$)/i;
const detailCache=new Map();
let inFlight=0;
const waiters=[];
function acquire(){if(inFlight<DETAIL_CONCURRENCY){inFlight++;return Promise.resolve()}return new Promise(resolve=>waiters.push(resolve)).then(()=>{inFlight++})}
function release(){inFlight=Math.max(0,inFlight-1);const next=waiters.shift();if(next)next()}
function timeout(p,ms){return Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('eligibility-timeout')),ms))])}
function runtimeOf(x){const r=rawOf(x);return firstPositive(x?.runtime_minutes,x?.runtime,r?.runtime,x?.episode_runtime,x?.episode?.runtime,r?.episode?.runtime)}
function genreIds(x){const r=rawOf(x);return [...idsOf(x?.genre_ids),...idsOf(x?.genres),...idsOf(r?.genre_ids),...idsOf(r?.genres)]}
function genreNames(x){const r=rawOf(x);return [...namesOf(x?.genres),...namesOf(r?.genres)]}
function networkNames(x){const r=rawOf(x);return [...namesOf(x?.networks),...namesOf(x?.production_companies),...namesOf(x?.productionCompanies),...namesOf(r?.networks),...namesOf(r?.production_companies)]}
function keywordNames(x){const r=rawOf(x),k=x?.keywords??r?.keywords;return [...namesOf(k?.results),...namesOf(k?.keywords),...namesOf(Array.isArray(k)?k:[])]}
function homepageOf(x){const r=rawOf(x);return norm(x?.homepage||r?.homepage||'')}
function specialLike(x){const r=rawOf(x),kind=norm(x?.media_kind||x?.kind||x?.episode_type||r?.episode_type||r?.type||'');return kind==='special'||kind==='short'||kind==='short film'||kind==='short movie'||Number(x?.season_number)===0||Number(r?.season_number)===0}
function reasonSync(x,{excludeWwe=true,requireMovieRuntime=false}={}){
 if(!x||typeof x!=='object')return'invalid';
 const type=mediaType(x),runtime=runtimeOf(x),title=titleOf(x),kind=norm(x?.media_kind||x?.kind||'');
 if(excludeWwe&&WWE_RE.test(title))return'wwe';
 if(genreIds(x).includes(10766)||textHas(genreNames(x),NOVELA_TERMS)||NOVELA_TERMS.some(t=>kind.includes(t)))return'novela';
 const nn=networkNames(x),kw=keywordNames(x),home=homepageOf(x);
 if(textHas(nn,YOUTUBE_TERMS)||YOUTUBE_TERMS.some(t=>home.includes(t))||/(^|\s)(youtube|youtu be)(\s|$)/.test(home))return'youtube';
 if(textHas(kw,[...YOUTUBE_TERMS,...WEB_TERMS]))return'web-video';
 if(type==='movie'){
   if(runtime>0&&runtime<MIN_RUNTIME)return'short';
   if(requireMovieRuntime&&runtime<MIN_RUNTIME)return'runtime-unknown';
 }else if(specialLike(x)&&runtime>0&&runtime<MIN_RUNTIME)return'short-special';
 return'';
}
function mergeDetail(base,detail){
 const b=obj(base),d=obj(detail),r=rawOf(b);
 return {...b,...d,raw_tmdb:{...r,...d},media_type:mediaType(b),tmdb_id:mediaId(b)||Number(d?.id||0),runtime_minutes:firstPositive(b.runtime_minutes,d.runtime,r.runtime),genres:arrayFrom(d,'genres').length?d.genres:(b.genres||r.genres),genre_ids:arrayFrom(b,'genre_ids').length?b.genre_ids:(d.genre_ids||r.genre_ids),networks:d.networks||b.networks||r.networks,production_companies:d.production_companies||b.production_companies||r.production_companies,keywords:d.keywords||b.keywords||r.keywords,homepage:d.homepage||b.homepage||r.homepage};
}
async function detail(x){
 const k=mediaKey(x);if(!k||typeof tmdb!=='function')throw new Error('tmdb-detail-unavailable');
 if(detailCache.has(k))return detailCache.get(k);
 const task=(async()=>{await acquire();try{const type=mediaType(x),id=mediaId(x),path='/'+type+'/'+id;return await timeout(tmdb(path,{language:'pt-BR',append_to_response:'keywords'}),DETAIL_TIMEOUT)}finally{release()}})();
 detailCache.set(k,task);try{return await task}catch(e){detailCache.delete(k);throw e}
}
function serverValidated(x){return x?.__ct412_eligible===true||x?.__ct412_eligible==='true'}
async function eligible(x,opts={}){
 const fast=reasonSync(x,opts);if(fast)return false;
 if(serverValidated(x))return true;
 const type=mediaType(x),runtime=runtimeOf(x),requireOriginDetail=opts.requireOriginDetail!==false;
 const needRuntime=type==='movie'&&runtime<MIN_RUNTIME;
 const needOrigin=requireOriginDetail;
 if(!needRuntime&&!needOrigin)return true;
 try{const d=await detail(x),merged=mergeDetail(x,d);return !reasonSync(merged,{...opts,requireMovieRuntime:type==='movie'})}catch{return false}
}
async function filterRows(input,{limit=24,maxScan=72,requireOriginDetail=true,excludeWwe=true}={}){
 const source=rows(input).slice(0,Math.max(0,Number(maxScan)||72)),out=[],seen=new Set(),batchSize=DETAIL_CONCURRENCY;
 for(let i=0;i<source.length&&out.length<limit;i+=batchSize){
   const batch=source.slice(i,i+batchSize);
   const checks=await Promise.all(batch.map(async x=>[x,await eligible(x,{requireOriginDetail,excludeWwe})]));
   for(const [x,ok] of checks){const k=mediaKey(x);if(!ok||!k||seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=limit)break}
 }
 return out;
}
function isForYou(){return routeNow()==='discover'&&(String(state()?.tab||'foryou')==='foryou'||!!q('[data-ct411-foryou]'))}
function actionHealth(){const root=q('[data-ct411-foryou]');if(!root)return{root:null,swaps:0,actions:0};return{root,swaps:qa('[data-ct411-action="swap"]',root).length,actions:qa('[data-ct411-action]',root).length}}
function activateForYouActions(){
 const h=actionHealth();if(!h.root)return false;
 for(const b of qa('[data-ct411-action]',h.root)){b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('disabled');b.removeAttribute('inert');b.setAttribute('aria-disabled','false');b.style.setProperty('display','flex','important');b.style.setProperty('visibility','visible','important');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('opacity','1','important')}
 document.documentElement.dataset.ct412SwapCount=String(qa('[data-ct411-action="swap"]',h.root).length);return true
}
function repairForYou(){
 if(!isForYou())return false;
 const h=actionHealth();
 if((!h.root||h.swaps<7)&&window.__ctR411?.renderForYou){try{window.__ctR411.renderForYou(true)}catch{}}
 activateForYouActions();return actionHealth().swaps>=7;
}
function scheduleForYouRepair(){for(const ms of [0,80,220,500,1100,2200,4200])setTimeout(()=>repairForYou(),ms)}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;if(t.closest('[data-nav="discover"],[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]'))scheduleForYouRepair()},true);
window.addEventListener('cinetracker:data-changed',()=>{if(isForYou())scheduleForYouRepair()});
window.__ctR412Eligibility={version:'1.0.203',minRuntime:MIN_RUNTIME,reasonSync,eligible,filterRows,detail,repairForYou,activateForYouActions,clearCache:()=>detailCache.clear()};
window.__ctR412Marker='strict-40min-youtube-web-novela+server-v412+7-swap-repair';
queueMicrotask(()=>{if(isForYou())scheduleForYouRepair()});
})();