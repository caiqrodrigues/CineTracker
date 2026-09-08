/* CineTracker 1.0.12 — restore strict Pra Voce rules, F1 browser contract and 3-card Profile geometry. */
(()=>{
'use strict';
if(window.__ctR218V112)return;
window.__ctR218V112='foryou-strict-f1-cors-profile-three-cards';
window.__ctV112ForYou='fresh-never-known-never-repeat-watchlist-not-started-30d';
window.__ctV112F1='browser-cors-preflight-v5';
window.__ctV112Profile='three-complete-cards-mobile';

const q112=(s,r=document)=>r?.querySelector?.(s)||null;
const qa112=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const num112=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm112=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tmdb112=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}};
const type112=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return x?.media_type==='movie'?'movie':'tv'}};
const slotKinds112=['fresh:movie','fresh:series','fresh:anime','watchlist:movie','watchlist:series','watchlist:anime'];

let ctx112=null,ctx112At=0,ctx112Task=null,mem112=[],mem112At=0,mem112Task=null,shown112=new Set();
function stateKey112(type,id){return `${type}:${Number(id)||0}`}
function stateBad112(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||num112(x?.watched_episodes)>0||x?.last_watched_at)}
function addAliases112(set,type,x){for(const v of [x?.title,x?.name,x?.media_title,x?.raw_tmdb?.title,x?.raw_tmdb?.name,x?.raw_tmdb?.original_title,x?.raw_tmdb?.original_name,x?.original_title,x?.original_name]){const n=norm112(v);if(n)set.add(`${type}:${n}`)}}
async function loadCtx112(force=false){
 if(!force&&ctx112&&Date.now()-ctx112At<20000)return ctx112;if(ctx112Task)return ctx112Task;
 ctx112Task=(async()=>{
  const [dashRaw,exRaw]=await Promise.all([rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc('cinetracker_discovery_exclusions_v0994',{}).catch(()=>({}))]);
  const dash=Array.isArray(dashRaw)?dashRaw:[],ex=Array.isArray(exRaw)&&exRaw.length===1?exRaw[0]:(exRaw||{}),states=new Map(),aliases=new Set(),movieIds=new Set((ex.movie_ids||[]).map(Number)),tvIds=new Set((ex.tv_ids||[]).map(Number));
  for(const x of dash){const type=type112(x),id=tmdb112(x),st={watchlist:Boolean(x?.is_watchlist),bad:stateBad112(x)};if(id){states.set(stateKey112(type,id),st);if(st.watchlist||st.bad)(type==='movie'?movieIds:tvIds).add(id)}addAliases112(aliases,type,x)}
  ctx112={states,aliases,movieIds,tvIds,dash};ctx112At=Date.now();return ctx112;
 })().finally(()=>ctx112Task=null);return ctx112Task;
}
async function loadMem112(force=false){
 if(!force&&Date.now()-mem112At<30000)return mem112;if(mem112Task)return mem112Task;
 mem112Task=Promise.resolve(rpc('cinetracker_recommendation_memory_v101',{})).then(rows=>{mem112=Array.isArray(rows)?rows:[];mem112At=Date.now();return mem112}).catch(()=>mem112).finally(()=>mem112Task=null);return mem112Task;
}
function blockedMemory112(slot,id){const cut=Date.now()-30*86400000;return mem112.some(x=>String(x.slot)===slot&&num112(x.tmdb_id)===num112(id)&&(slot.startsWith('fresh:')||Date.parse(x.shown_at||0)>=cut))}
function anime112(x){const genres=x?.genre_ids||x?.raw_tmdb?.genre_ids||[];const countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return type112(x)==='tv'&&(genres.map(Number).includes(16)||countries.includes('JP'))}
function dorama112(x){const countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return type112(x)==='tv'&&!anime112(x)&&countries.includes('KR')}
function aliasKnown112(x,c){const type=type112(x);for(const v of [x?.title,x?.name,x?.media_title,x?.original_title,x?.original_name,x?.raw_tmdb?.title,x?.raw_tmdb?.name]){const n=norm112(v);if(n&&c.aliases.has(`${type}:${n}`))return true}return false}
function eligible112(x,slot,c=ctx112){
 if(!x||!c)return false;const id=tmdb112(x),type=type112(x);if(!(id>0))return false;const st=c.states.get(stateKey112(type,id))||{watchlist:false,bad:false};
 if(st.bad)return false;
 if(slot.startsWith('watchlist:')){if(!st.watchlist)return false}
 else {if(st.watchlist)return false;if((type==='movie'?c.movieIds:c.tvIds).has(id)||aliasKnown112(x,c))return false;if(dorama112(x))return false}
 if(blockedMemory112(slot,id))return false;
 return true;
}
function filterRows112(rows,slot){return (Array.isArray(rows)?rows:[]).filter(x=>eligible112(x,slot))}
function filterBag112(bag,prefix){if(!bag||typeof bag!=='object')return bag;return {...bag,movie:filterRows112(bag.movie,`${prefix}:movie`),series:filterRows112(bag.series,`${prefix}:series`),anime:filterRows112(bag.anime,`${prefix}:anime`)}}
function filterData112(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return data;const out={...data};
 for(const k of ['_ct166_fresh','_ct186_fresh','_ct186_reserve'])if(out[k])out[k]=filterBag112(out[k],'fresh');
 for(const k of ['_ct166_watchlist','_ct186_watchlist'])if(out[k])out[k]=filterBag112(out[k],'watchlist');
 for(const [k,slot] of [['movie','fresh:movie'],['series','fresh:series'],['anime','fresh:anime'],['fresh_movie','fresh:movie'],['fresh_series','fresh:series'],['fresh_anime','fresh:anime'],['watchlist_movie','watchlist:movie'],['watchlist_series','watchlist:series'],['watchlist_anime','watchlist:anime']])if(out[k]){const a=Array.isArray(out[k])?filterRows112(out[k],slot):[out[k]].filter(x=>eligible112(x,slot));out[k]=Array.isArray(out[k])?a:(a[0]||null)}
 if(out.daily&&!['movie','tv'].includes(type112(out.daily)))out.daily=null;
 if(out.daily){const slot=anime112(out.daily)?'fresh:anime':type112(out.daily)==='movie'?'fresh:movie':'fresh:series';if(!eligible112(out.daily,slot))out.daily=null}
 return out;
}
try{const base112=discoverRows;discoverRows=async function(tab){if(String(tab)==='foryou')await Promise.all([loadCtx112(true),loadMem112(true)]);const d=await base112(tab);return String(tab)==='foryou'?filterData112(d):d}}catch{}
try{const baseSel112=ct186Select;ct186Select=function(data){return baseSel112(filterData112(data))}}catch{}

async function record112(slot,id,action){if(!slotKinds112.includes(slot)||!(num112(id)>0))return;const key=`${slot}:${id}:${action}`;if(action==='shown'&&shown112.has(key))return;if(action==='shown')shown112.add(key);const type=slot.endsWith('movie')?'movie':'tv';try{const m=await ensureMedia(type,id);await rpc('cinetracker_recommendation_record_v101',{p_media_id:Number(m.id),p_context:slot.startsWith('watchlist:')?'watchlist':'outside',p_slot:slot,p_action:action});if(action==='swapped'){mem112.unshift({tmdb_id:id,slot,shown_at:new Date().toISOString(),action});mem112At=Date.now()}}catch{}}
function scan112(){for(const slot of qa112('[data-ct241-slot-key]')){const key=String(slot.dataset.ct241SlotKey||'');if(!slotKinds112.includes(key))continue;const raw=String(q112('[data-media]',slot)?.dataset.media||''),id=num112(raw.split(':')[1]);if(!(id>0))continue;if(!eligible112({id,tmdb_id:id,media_type:key.endsWith('movie')?'movie':'tv',origin_country:[]},key)){/* renderer data was filtered before paint; never remove merely because aliases are unavailable here */}void record112(key,id,'shown')}}
try{const basePaint112=paintDiscover;paintDiscover=function(...args){const out=basePaint112.apply(this,args);requestAnimationFrame(scan112);return out}}catch{}
try{const baseSwap112=swapNow237;swapNow237=function(button){const slot=button?.closest?.('[data-ct241-slot-key],.ct166-slot,.foryou-slot'),key=String(slot?.dataset?.ct241SlotKey||button?.dataset?.ct237Swap||''),raw=String(q112('[data-media]',slot)?.dataset.media||''),id=num112(raw.split(':')[1]);if(key&&id)void record112(key,id,'swapped');const ok=baseSwap112(button);if(ok)requestAnimationFrame(scan112);return ok};try{window.__ctR237SwapNow=swapNow237}catch{}}catch{}
window.__ctV112FilterForYou=filterData112;
window.__ctV112EligibleForYou=eligible112;

/* Profile: exactly three complete cards across the visible mobile row before horizontal drag. */
const style112=document.createElement('style');style112.id='ct-v112-profile-three';style112.textContent=`
@media(max-width:760px){
 [data-profile] .row{box-sizing:border-box!important;display:grid!important;grid-auto-flow:column!important;grid-template-rows:1fr!important;grid-auto-columns:calc((100% - 16px)/3)!important;gap:8px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;padding:1px 0 8px!important}
 [data-profile] .row>.card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;scroll-snap-align:start!important}
 [data-profile] .row>.card .poster{width:100%!important;aspect-ratio:2/3!important}
 [data-profile] .row>.card .card-body{padding:6px!important;min-width:0!important}
 [data-profile] .row>.card .card-body b{font-size:9px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 [data-profile] .row>.card .card-body small{font-size:7px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
}
`;
document.getElementById(style112.id)?.remove();document.head.appendChild(style112);

(function midnight112(){const now=new Date(),next=new Date(now);next.setHours(24,0,2,0);setTimeout(()=>{ctx112At=0;mem112At=0;shown112.clear();try{discoverCache?.clear?.()}catch{};midnight112()},Math.max(1000,+next-Date.now()))})();
})();
