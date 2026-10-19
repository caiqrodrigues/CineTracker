/* Android r283: preserve real dated AlreadySeen and trust only v525-authorized Pra Você. */
(()=>{'use strict';
if(window.__ctR283AndroidV1041)return;
window.__ctR283AndroidV1041='server-verified-seven-slots+dated-movie-override-history';
const kinds=['movie','series','anime'],list=x=>Array.isArray(x)?x:[],uid=()=>String(session?.user?.id||user?.id||'');
const ref=x=>{const id=Number(ct186Id(x));return id>0?(ct186Type(x)==='movie'?'movie':'tv')+':'+id:''};
function match(x,k){const t=ct186Type(x),anime=ct186Anime(x);return k==='movie'?t==='movie'&&!anime:k==='anime'?t==='tv'&&anime:t==='tv'&&!anime}
function pool(data,name,kind){
 const watch=name==='_ct186_watchlist';
 return ct186UniqueRows(list(data?.[name]?.[kind])).filter(x=>match(x,kind)&&window.__ctR265Test?.allowed?.(x)===true&&ct186Quality(x)&&!ct186LocalBlocked.has(ct186Key(x))&&window.__ctR279Audit?.permitted?.(x,watch)===true);
}
const oldSelect=ct186Select;
ct186Select=function(data){
 if(!data?.__ct283ServerAudited)return oldSelect(data);
 const f={},w={},used=new Set();
 for(const k of kinds){f[k]=pool(data,'_ct186_fresh',k);w[k]=pool(data,'_ct186_watchlist',k)}
 const take=x=>{if(!x||used.has(ref(x)))return null;used.add(ref(x));return x};
 const next=items=>take(items.find(x=>!used.has(ref(x))));
 const daily=take(ct186DailyPick(f.movie,used))||next(f.movie);
 const wm=next(w.movie),ws=next(w.series),wa=next(w.anime);
 return{daily,wm,ws,wa,fm:next(f.movie),fs:next(f.series),fa:next(f.anime),
  wmPool:w.movie,wsPool:w.series,waPool:w.anime,used};
};
const bridge=window.__ctR271Bridge;
const when=x=>Date.parse(x?.watched_at||'')||0;
const sorted=x=>[...list(x)].sort((a,b)=>when(b)-when(a)||String(b.id||'').localeCompare(String(a.id||'')));
function combine(parts){
 const out=[],seen=new Map();
 for(const x of sorted(parts.flatMap(list))){
  const id=Number(x?.media_id),time=when(x),tmdb=Number(x.tmdb_id||0);
  if(!(id>0&&time>0))continue;
  const logical=tmdb>0?'tmdb:'+tmdb:'media:'+id;
  const known=seen.get(logical)||[],same=known.find(y=>Math.abs(when(y)-time)<90000);
  if(same){same.poster_path ||= x.poster_path||null;same.media_title ||= x.media_title||x.title||'';same.tmdb_id ||= tmdb;continue}
  const y={...x,media_id:id,media_type:'movie',watched_at:new Date(time).toISOString(),media_title:String(x.media_title||x.title||'').trim()};
  if(!y.media_title)continue;
  known.push(y);seen.set(logical,known);out.push(y);
 }
 return sorted(out);
}
async function metadata(ids){
 const result=new Map(),promises=[];
 for(let i=0;i<ids.length;i+=75)promises.push(api('media?select=id,tmdb_id,media_type,title,poster_path,raw_tmdb&id=in.('+ids.slice(i,i+75).join(',')+')'));
 const done=await Promise.allSettled(promises);
 for(const x of done)if(x.status==='fulfilled')for(const m of list(x.value))if(m.media_type==='movie')result.set(Number(m.id),m);
 return result;
}
async function overrides(userId){
 const data=[];
 for(let offset=0;offset<1000;offset+=200){
  const q='media_overrides?select=id,media_id,watched_at,state&profile_id=eq.'+encodeURIComponent(userId)+'&state=eq.AlreadySeen&watched_at=not.is.null&order=watched_at.desc,id.desc&limit=200&offset='+offset;
  const page=await api(q);if(!Array.isArray(page))throw new Error('invalid authenticated movie overrides');
  data.push(...page);if(page.length<200)break;
 }
 const ids=[...new Set(data.map(x=>Number(x.media_id)).filter(x=>Number.isSafeInteger(x)&&x>0))],media=await metadata(ids);
 return data.flatMap(x=>{
  const m=media.get(Number(x.media_id));if(!m||!when(x))return[];
  return[{id:'override:'+x.id,media_id:Number(x.media_id),tmdb_id:Number(m.tmdb_id||m.raw_tmdb?.source_tmdb_id||0),
   media_title:m.title,poster_path:m.poster_path||m.raw_tmdb?.poster_path||null,watched_at:x.watched_at,history_source:'authenticated-AlreadySeen'}];
 });
}
async function dashboard(){
 const data=await rpc('cinetracker_profile_media_dashboard_v0991',{});
 if(!Array.isArray(data))throw Error('authenticated movie dashboard unavailable');
 return data.filter(x=>x?.media_type==='movie'&&x.is_seen&&Number(x.media_id)>0&&Number.isFinite(Date.parse(x.last_watched_at||'')))
 .map(x=>({id:'dashboard:'+x.media_id,media_id:Number(x.media_id),tmdb_id:Number(x.tmdb_id||0),
  media_title:x.title,poster_path:x.poster_path||x.raw_tmdb?.poster_path||null,watched_at:x.last_watched_at,history_source:'authenticated-dashboard'}));
}
let identity='',extra=[],job=null,retryAt=0;
function withExtra(items){
 const full=combine([list(items),extra]);if(full.length&&homeCache)homeCache={...homeCache,history_movies:full};return full;
}
if(bridge?.getFetcher&&bridge?.setFetcher&&bridge?.getPainter&&bridge?.setPainter){
 const oldFetch=bridge.getFetcher(),oldPaint=bridge.getPainter();
 bridge.setPainter(function(items){const result=withExtra(items);return oldPaint.call(this,result.length?result:items)});
 function fetchExtra(force=false){
  const owner=uid();if(!owner)return Promise.resolve([]);
  if(identity!==owner){identity=owner;extra=[];job=null;retryAt=0}
  if(job)return job;
  if(!force&&Date.now()<retryAt)return Promise.resolve(extra);
  retryAt=Date.now()+120000;
  job=Promise.allSettled([overrides(owner),dashboard()]).then(done=>{
   if(uid()!==owner)return[];
   const found=done.flatMap(x=>x.status==='fulfilled'?list(x.value):[]);
   if(!found.length){retryAt=Date.now()+60000;return extra}
   extra=combine([extra,found]);
   if(route()==='home'&&homeActiveTab158==='movies'){
    const existing=list(homeCache?.history_movies),full=withExtra(existing);
    if(full.length>existing.length||when(full[0])>when(existing[0]))bridge.getPainter()(full);
   }
   return extra;
  }).finally(()=>{job=null});return job;
 }
 bridge.setFetcher(async function(...args){
  const owner=uid();if(!owner)return[];
  const original=oldFetch.apply(this,args);void fetchExtra(false);
  const rows=await original;if(uid()!==owner)return[];
  return withExtra(rows);
 });
 const originalHome=paintHome;
 paintHome=function(...args){
  const result=originalHome.apply(this,args);
  if(route()==='home'&&homeActiveTab158==='movies')queueMicrotask(()=>{void fetchExtra(false)});
  return result;
 };
 window.addEventListener('cinetracker:data-changed',e=>{
  if(/movie|watch|history|seen/i.test(String(e?.detail?.source||'')))retryAt=0;
 });
 window.__ctR283History={combine,overrides,dashboard,fetchExtra,read:()=>extra};
}
const previousSlot=ct186Slot;
ct186Slot=function(label,item,key,count){
 if(item||!window.__ctR282Test?.forYou)return previousSlot.apply(this,arguments);
 const state=window.__ctR282Test.forYou(),html=previousSlot.apply(this,arguments);
 return state&&!state.done?html.replace('Nenhuma indicação elegível nesta categoria.','Verificando indicações elegíveis…'):
 html.replace('Nenhuma indicação elegível nesta categoria.','Nenhuma indicação elegível no momento. <button type="button" class="chip" data-ct283-retry>Buscar novamente</button>');
};
document.addEventListener('click',ev=>{
 const button=ev.target?.closest?.('[data-ct283-retry]');if(!button)return;
 ev.preventDefault();ev.stopImmediatePropagation();if(button.disabled)return;
 button.disabled=true;void Promise.resolve(ct186RefreshVisible()).finally(()=>{if(button.isConnected)button.disabled=false});
},true);
window.__ctR283Test={pool,combine,match};
})();