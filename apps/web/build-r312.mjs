import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r311.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v311.js'),'utf8'),
 readFile(resolve(dist,'app-v311.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r312-single-owner.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r312 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r312 missing '+x)};
const between=(s,start,end,repl,label)=>{
 const a=s.indexOf(start);if(a<0)throw new Error('r312 missing '+label+' start');
 const b=s.indexOf(end,a);if(b<0)throw new Error('r312 missing '+label+' end');
 return s.slice(0,a)+repl+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "const REVISION='r311-official-1.0.102';",
 "async function api(",
 "async function tmdb(",
 "window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255};",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "\nboot();"
])must(js,x);

js=once(js,
 "window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255};",
 "window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255};window.__ctR312R255={get sportState(){return sport255},get f1State(){return f1255},sportRows(tab){return sportRows255(sport255.payload||{},tab||sport255.tab)},sportCard(e){return sportCard255(e,sport255.payload||{})},paintF1(){return paintF1255()},sportsTabs:SPORT_TABS255,sportLabel(tab){return (SPORT_TABS255.find(x=>String(x?.[0])===String(tab))||[null,'Esportes'])[1]},f1Time(r){return f1time255(r)},baseF1Content:f1content255,setPaintSports(fn){if(typeof fn==='function')paintSports255=fn},setF1Content(fn){if(typeof fn==='function')f1content255=fn}};",
 'r255 bridge'
);

const api312=[
"let ct312RefreshPromise=null;",
"function ct312JwtExpired(status,data){",
" const t=String(data?.message||data?.error_description||data?.error||data?.hint||data?.details||'').toLowerCase();",
" return Number(status)===401||t.includes('jwt expired')||t.includes('token has expired')||t.includes('invalid jwt');",
"}",
"async function ct312RefreshAccess(){",
" if(ct312RefreshPromise)return ct312RefreshPromise;",
" ct312RefreshPromise=(async()=>{",
"  if(!session?.refresh_token)throw new Error('Sua sessão expirou. Entre novamente.');",
"  const fresh=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});",
"  saveSession(fresh);return session;",
" })().finally(()=>{ct312RefreshPromise=null});",
" return ct312RefreshPromise;",
"}",
"async function ct312EnsureFresh(){",
" const exp=Number(session?.expires_at||0)*1000;",
" if(session?.refresh_token&&exp&&exp<=Date.now()+30000)await ct312RefreshAccess();",
"}",
"async function api(path,options={},allowRetry=true){",
" if(!session?.access_token)throw new Error('Sessão necessária');",
" await ct312EnsureFresh();",
" const r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{...options,headers:headers({'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})})});",
" const text=await r.text();let d=null;if(text)try{d=JSON.parse(text)}catch{d=text};",
" if(!r.ok&&allowRetry&&ct312JwtExpired(r.status,d)){await ct312RefreshAccess();return api(path,options,false)}",
" if(!r.ok)throw new Error(d?.message||d?.hint||d?.details||('Banco '+r.status));",
" return d;",
"}",
"window.__ctR312AuthTest={jwtExpired:ct312JwtExpired,refresh:ct312RefreshAccess,ensureFresh:ct312EnsureFresh};"
].join('\n');
js=between(js,"async function api(","\nconst rpc=",api312+"\n",'api');

const tmdb312=[
"async function tmdb(path,params={},allowRetry=true){",
" await ct312EnsureFresh();",
" const u=new URL(SUPABASE_URL+'/functions/v1/tmdb-proxy');",
" u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');",
" for(const[k,v]of Object.entries(params))if(v!==null&&v!==undefined&&v!=='')u.searchParams.set(k,String(v));",
" const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);",
" try{const r=await fetch(u,{headers:headers(),signal:c.signal});",
"  let d=null;try{d=await r.clone().json()}catch{};",
"  if(!r.ok&&allowRetry&&ct312JwtExpired(r.status,d)){await ct312RefreshAccess();return tmdb(path,params,false)}",
"  if(!r.ok)throw new Error(d?.error||d?.message||('TMDB '+r.status));",
"  return d??r.json();",
" }finally{clearTimeout(t)}",
"}"
].join('\n');
js=between(js,"async function tmdb(","\nasync function safeTmdb",tmdb312+"\n",'tmdb');

const early312="(()=>{if(window.__ctR312EarlyCapture)return;window.__ctR312EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR312EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();";

js=once(js,'\nboot();','\n'+runtime+'\nboot();','r312 insertion');
js=early312+'\n'+js;

js=once(js,
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
 'Web version'
);
js=once(js,"const REVISION='r311-official-1.0.102';","const REVISION='r312-official-1.0.103';",'revision');
js=once(js,
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "const version='1.0.103',revision='r312-official-1.0.103';",
 'footer identity'
);

html=html.replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css').replaceAll('v1.0.102','v1.0.103').replaceAll('r311-official-1.0.102','r312-official-1.0.103');
sw=sw.replaceAll('ct-web-1.0.102-r311','ct-web-1.0.103-r312').replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css');
css+='\n/* CineTracker Web 1.0.103 r312 — single-owner Discover, auth retry, live Profile, inline Sports filters. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.103',
 revision:'r312-official-1.0.103',
 base:'r311-green-head',
 scope:'latest-video-single-owner-discover-sports-profile-web-only',
 discover_shell:'r312-persistent-single-owner',
 discover_tabs_persist_during_loading:true,
 discover_public_tabs:'trending+popular+new+anticipated+top',
 discover_public_exclusion:'seen+watchlist-before-html',
 discover_public_watchlist_button:true,
 discover_public_seen_button:true,
 discover_copy_clipped:false,
 discover_scroll:'native-horizontal-visible',
 discover_foryou:'compact-daily+3-watchlist+3-fresh',
 discover_legacy_sink_hidden:true,
 auth_jwt_refresh_retry:true,
 auth_jwt_retry_count:1,
 tmdb_jwt_refresh_retry:true,
 profile_stadium_button_guaranteed:true,
 profile_favorite_actors_live_table:'favorite_actors',
 sports_filter_location:'inside-next+previous-heading',
 sports_filter_source:'payload.sports',
 sports_filter_dynamic:true,
 f1_r311_preserved:true,
 android:'1.0.20/10062'
};

for(const x of[
 "window.__ctR312='single-owner-discover+auth-retry+live-profile+inline-sports-filters'",
 "window.__ctR312EarlyCapture=true",
 "window.__ctR312R255=",
 "function ct312JwtExpired",
 "async function ct312RefreshAccess",
 "return api(path,options,false)",
 "return tmdb(path,params,false)",
 "data-ct312-content",
 "data-ct312-action",
 "data-ct312-sport",
 "favorite_actors?select=id,tmdb_person_id,actor_name,profile_path,created_at",
 "dataset.ct299History='stadium'",
 "r312-official-1.0.103"
])must(js,x);
if(js.includes("window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';"))throw new Error('r312 stale Web identity survived');
if(js.includes("app-v311.js"))throw new Error('r312 stale asset survived');

await Promise.all([
 writeFile(resolve(dist,'app-v312.js'),js),
 writeFile(resolve(dist,'app-v312.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v311.js'),{force:true}),rm(resolve(dist,'app-v311.css'),{force:true})]);
console.log('WEB_R312_READY persistent Discover shell + JWT retry + live Profile + dynamic Sports filters');
