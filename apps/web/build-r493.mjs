import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r492.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime,core]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v492.js'),'utf8'),
 readFile(resolve(dist,'app-v492.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r493-stability.js'),'utf8'),
 readFile(resolve(root,'runtime-r493-core.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r493 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r493 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamed(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);
 if(!m)throw new Error('r493 missing '+label+' '+name);
 const open=region.indexOf('{',m.index+m[0].length);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;
  else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r493 unbalanced '+label+' '+name);
 return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end);
}
const patch=(anchor,label,defs)=>{for(const [name,body] of defs)js=replaceNamed(js,anchor,name,body,label)};

const end='/* CT_R491_CORE_END */',ci=js.indexOf(end);
if(ci<0)throw new Error('r493 core marker missing');
js=js.slice(0,ci)+core+'\n'+js.slice(ci);
js=js.replace("if(r==='home')return renderHome491(seq);","if(r==='home')return renderHome493(seq);");
js=js.replace("if(r==='profile')return renderProfile491(seq);","if(r==='profile')return renderProfile493(seq);");

const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
patch(A371,'r371',[
 ['cancelPreviousHomeWork',"function cancelPreviousHomeWork(){return{generation:0,signal:null}}"],
 ['selectByUser',"function selectByUser(kind){window.__ctR493Home?.select?.(kind,true);return{generation:0,signal:null}}"],
 ['preserveAfterPaint',"function preserveAfterPaint(){return true}"]
]);

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
patch(A388,'r388',[
 ['activeKind',"function activeKind(){try{return window.__ctR493Home?.kind||'series'}catch{return'series'}}"],
 ['applyTab',"function applyTab(k){try{return window.__ctR493Home?.select?.(k,false)??false}catch{return false}}"],
 ['alignHome393',"function alignHome393(){return false}"],
 ['scheduleHome393',"function scheduleHome393(){return 0}"],
 ['settleHome',"function settleHome(){return false}"],
 ['refreshTv391',"async function refreshTv391(){return{skipped:true}}"],
 ['loadSeries',"async function loadSeries(force=false){return window.__ctR493Home?.loadSeries?.(!!force)||[]}"],
 ['loadHistory',"async function loadHistory(force=false){return window.__ctR493Home?.loadHistory?.(!!force)||null}"],
 ['loadMovies',"async function loadMovies(force=false){return window.__ctR493Home?.loadMovies?.(!!force)||[]}"],
 ['renderHome388',"async function renderHome388(){return window.__ctR493Home?.ensure?.()??false}"]
]);

const A321="window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';";
patch(A321,'r321',[
 ['topRaw321',`async function topRaw321(provider,force=false){
  if(testBridge?.top)return testBridge.top(provider,force);
  const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
  const storage='ct493:top10:'+String(typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10))+':'+key;
  if(!force)try{const c=JSON.parse(sessionStorage.getItem(storage)||'null');if(c?.movies&&c?.series){topCache.set(key,{at:Date.now(),rows:c});return c}}catch{}
  const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page:1};
  const [m1,t1]=await Promise.all([tmdbPage321('/discover/movie',common,'movie'),tmdbPage321('/discover/tv',common,'tv')]);
  const data={movies:dedupe321(m1),series:dedupe321(t1)};topCache.set(key,{at:Date.now(),rows:data});try{sessionStorage.setItem(storage,JSON.stringify(data))}catch{}return data;
 }`],
 ['paintTop321',`async function paintTop321(provider,token,force=false){
  const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;
  const renderClean=(raw,a)=>{
   if(token!==topToken||String(discover?.tab)!=='top10')return false;
   const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);
   let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}
   content.innerHTML='<div class="ct288-top-name"><b>'+esc(name)+'</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class="ct319-top-row">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>')+'</div></section><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class="ct319-top-row">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';
   loaded321();return{movies,series};
  };
  try{
   const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]),shown=renderClean(raw,a);if(!shown)return false;
   if(shown.movies.length<10||shown.series.length<10)void (async()=>{try{
    const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false,page:2};
    const [m2,t2]=await Promise.all([tmdbPage321('/discover/movie',common,'movie'),tmdbPage321('/discover/tv',common,'tv')]);
    const merged={movies:dedupe321([...raw.movies,...m2]),series:dedupe321([...raw.series,...t2])},a2=await exact321([...merged.movies,...merged.series]);renderClean(merged,a2);
   }catch{}})();
   return true;
  }catch(e){content.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}
 }`],
 ['loadTop321',`async function loadTop321(force=false){
  const h=host();if(!h)return false;const token=++topToken;loading321('Carregando Top 10…');
  h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct321-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct321-top-content><div class="ct263-loading">Montando Top 10…</div></div></section>';
  if(!state.topProvider)state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||8)||8;try{ct171TopProvider=state.topProvider}catch{}
  const paint=paintTop321(state.topProvider,token,force);
  void Promise.resolve(typeof ct171Providers==='function'?ct171Providers():[]).then(providers=>{
   if(token!==topToken||String(discover?.tab)!=='top10')return;
   const list=rows(providers),box=q('[data-ct321-providers]');
   if(box)box.innerHTML=list.map(p=>'<button type="button" class="ct288-provider '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'" data-ct321-provider="'+Number(p.provider_id)+'">'+(p.logo_path?'<span><img alt="" src="'+img(p.logo_path,'w92')+'"></span>':'')+'<b>'+esc(p.provider_name||'Streaming')+'</b></button>').join('')||'<div class="empty">Nenhum streaming disponível.</div>';
  }).catch(()=>{});
  return paint;
 }`]
]);

const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
patch(A464,'r464',[
 ['load',`async function load(force=false){
  setForYouState();if(routeNow()!=='discover')return false;if(loadTask)return loadTask;
  const token=++loadToken,kinds=['movie','series','anime'];let cached=null,hadCache=false;
  if(!force)try{
   cached=JSON.parse(sessionStorage.getItem('ct493:foryou')||localStorage.getItem('ct493:foryou')||'null');
   if(cached?.at&&Date.now()-Number(cached.at)<15*60*1000&&cached.watch&&cached.fresh){
    const next=emptyState();for(const k of kinds){next.watch[k]=rows(cached.watch[k]);next.fresh[k]=rows(cached.fresh[k])}
    if(kinds.every(k=>next.watch[k].length&&next.fresh[k].length)){state=next;chooseDaily();render();hadCache=true;if(Date.now()-Number(cached.at)<2*60*1000)return true}
   }
  }catch{}
  if(!hadCache&&!q('[data-ct464-foryou]',root464()))renderLoading();
  loadTask=(async()=>{try{
   let next=emptyState(),raw=null;
   try{raw=unwrap(await timeout(rpcCall('cinetracker_foryou_payload_v490',{p_watch_limit:30,p_fresh_limit:48}),5000))||{}}catch{}
   for(const k of kinds){next.watch[k]=rows(raw?.watch?.[k]);next.fresh[k]=rows(raw?.fresh?.[k])}
   if(!kinds.every(k=>next.watch[k].length&&next.fresh[k].length)){
    const specs=[...kinds.map(k=>['watch',k]),...kinds.map(k=>['fresh',k])],settled=await Promise.allSettled(specs.map(([g,k])=>timeout(fetchPool(g,k),3500)));next=emptyState();
    settled.forEach((r,i)=>{if(r.status==='fulfilled')next[specs[i][0]][specs[i][1]]=rows(r.value)});
   }
   if(!kinds.every(k=>next.watch[k].length&&next.fresh[k].length))throw new Error('RECOMMENDATION_POOL_INCOMPLETE');
   const snap=JSON.stringify({at:Date.now(),watch:next.watch,fresh:next.fresh});try{sessionStorage.setItem('ct493:foryou',snap);localStorage.setItem('ct493:foryou',snap)}catch{}
   if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();render();document.documentElement.dataset.ct493ForYou='snapshot+v490+v421';return true;
  }catch(e){
   if(hadCache)return true;
   if(token===loadToken){document.documentElement.dataset.ct493ForYouError=String(e?.message||e);const root=root464();if(root)root.innerHTML='<div data-ct464-foryou><div class="panel"><div class="empty">Não foi possível carregar as indicações. <button type="button" class="chip" data-ct489-foryou-retry>Tentar novamente</button></div></div></div>'}
   return false;
  }finally{if(token===loadToken)loadTask=null}})();
  return loadTask;
 }`]
]);

new Function(runtime);
js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r493-official-0.3.20';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.20 • ${REVISION}');
html=html.replaceAll('app-v492.js','app-v493.js').replaceAll('app-v492.css','app-v493.css').replaceAll('v0.3.19','v0.3.20').replaceAll('r492-official-0.3.19','r493-official-0.3.20');
css+='\n/* CineTracker Web 0.3.20 r493 — direct progressive stability. */\n';
sw=sw.replaceAll('r492','r493').replaceAll('app-v492.js','app-v493.js').replaceAll('app-v492.css','app-v493.css');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.20',revision:'r493-official-0.3.20',base:'r492+r493-direct-progressive',
 scope:'home-direct-progressive+profile-split-fast+top10-progressive+foryou-snapshot',
 home_series:'direct compact v492 request paints independently from History; old scroll/timer owner is neutralized',
 home_movies:'tab switches immediately, then first v405 page paints native strict 2:3 cards; pagination is explicit',
 profile:'summary v489 + quick stats + profile_stats + sports v296 + activity v320 run in parallel; profile_screen_v491 is no longer on the first-paint path',
 discover_foryou:'session/local snapshot paints instantly on revisit; v490 is primary and v421 pools are bounded fallback',
 top10:'provider list no longer blocks ranking; page 1 paints first and page 2 is only a background fill if exclusions leave fewer than 10',
 f1:'preserved',sports:'route preserved',history:'daily/undo preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v493.js'),js),
 writeFile(resolve(dist,'app-v493.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v492.js'),{force:true}),
 rm(resolve(dist,'app-v492.css'),{force:true})
]);

for(const need of [
 "window.__ctR493Marker='direct-home-progressive+profile-split-fast+top10-progressive+foryou-snapshot+strict-12'",
 "if(r==='home')return renderHome493(seq);",
 "if(r==='profile')return renderProfile493(seq);",
 'cinetracker_home_series_v492','cinetracker_home_movies_v405','cinetracker_profile_summary_v489','ct493:foryou','r493-official-0.3.20'
])if(!js.includes(need))throw new Error('r493 missing '+need);

console.log('WEB_R493_READY progressive stability');
