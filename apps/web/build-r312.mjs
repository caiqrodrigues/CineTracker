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
 readFile(resolve(root,'runtime-r312-video-truth.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r312 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const between=(s,start,end,repl,label)=>{const a=s.indexOf(start);if(a<0)throw new Error('r312 missing '+label+' start');const b=s.indexOf(end,a);if(b<0)throw new Error('r312 missing '+label+' end');return s.slice(0,a)+repl+s.slice(b)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r312 missing '+x)};

for(const x of[
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "const REVISION='r311-official-1.0.102';",
 "async function api(path,options={}){",
 "async function edge(name,body={},timeout=45000){",
 "async function tmdb(path,params={}){",
 "function ct168EnsureSportsPanel(d){",
 "const ct163ProfileRender=renderProfile;",
 "function paintSports255(){",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "\nboot();"
])must(js,x);

const api312=[
 "let ct312RefreshTask=null;",
 "function ct312AuthFailure(status,data){const m=String(data?.message||data?.msg||data?.error_description||data?.error||data||'').toLowerCase();return Number(status)===401||/jwt[^a-z0-9]*expired|token[^a-z0-9]*expired|invalid jwt/.test(m)}",
 "async function ct312RefreshSession(force=false){",
 " if(!session?.access_token)return false;",
 " const now=Math.floor(Date.now()/1000);",
 " if(!force&&(!session?.expires_at||Number(session.expires_at)>now+120))return true;",
 " if(!session?.refresh_token)return false;",
 " if(ct312RefreshTask)return ct312RefreshTask;",
 " const used=String(session.refresh_token);",
 " ct312RefreshTask=(async()=>{const d=await authRequest('token?grant_type=refresh_token',{refresh_token:used});saveSession(d);user=d?.user||user;return true})().finally(()=>{ct312RefreshTask=null});",
 " return ct312RefreshTask;",
 "}",
 "async function api(path,options={}){",
 " if(!session?.access_token)throw new Error('Sessão necessária');",
 " await ct312RefreshSession(false);",
 " const run=async()=>{const token=String(session?.access_token||''),r=await fetch(SUPABASE_URL+'/rest/v1/'+path,{...options,headers:headers({'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})})}),text=await r.text();let d=null;if(text)try{d=JSON.parse(text)}catch{d=text}return{r,d,token}};",
 " let out=await run();",
 " if(!out.r.ok&&ct312AuthFailure(out.r.status,out.d)&&session?.refresh_token){if(String(session?.access_token||'')===out.token)await ct312RefreshSession(true);out=await run()}",
 " if(!out.r.ok)throw new Error(out.d?.message||out.d?.hint||out.d?.details||('Banco '+out.r.status));",
 " return out.d;",
 "}"
].join('\n');
js=between(js,"async function api(path,options={}){","\nconst rpc=",api312,'API auth owner');

const edge312=[
 "async function edge(name,body={},timeout=45000){",
 " await ct312RefreshSession(false);",
 " const run=async()=>{const token=String(session?.access_token||''),c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(SUPABASE_URL+'/functions/v1/'+name,{method:'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(body),signal:c.signal}),d=await r.json().catch(()=>({}));return{r,d,token}}finally{clearTimeout(t)}};",
 " let out=await run();",
 " if(!out.r.ok&&ct312AuthFailure(out.r.status,out.d)&&session?.refresh_token){if(String(session?.access_token||'')===out.token)await ct312RefreshSession(true);out=await run()}",
 " if(!out.r.ok)throw new Error(out.d?.error||out.d?.message||(name+' '+out.r.status));return out.d;",
 "}"
].join('\n');
js=between(js,"async function edge(name,body={},timeout=45000){","\nasync function tmdb",edge312,'Edge auth owner');

const tmdb312=[
 "async function tmdb(path,params={}){",
 " await ct312RefreshSession(false);",
 " const u=new URL(SUPABASE_URL+'/functions/v1/tmdb-proxy');u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');for(const[k,v]of Object.entries(params))if(v!==null&&v!==undefined&&v!=='')u.searchParams.set(k,String(v));",
 " const run=async()=>{const token=String(session?.access_token||''),c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(u,{headers:headers(),signal:c.signal}),d=await r.json().catch(()=>({}));return{r,d,token}}finally{clearTimeout(t)}};",
 " let out=await run();",
 " if(!out.r.ok&&ct312AuthFailure(out.r.status,out.d)&&session?.refresh_token){if(String(session?.access_token||'')===out.token)await ct312RefreshSession(true);out=await run()}",
 " if(!out.r.ok)throw new Error(out.d?.message||('TMDB '+out.r.status));return out.d;",
 "}"
].join('\n');
js=between(js,"async function tmdb(path,params={}){","\nasync function safeTmdb",tmdb312,'TMDB auth owner');

js=once(js,
 "if(has&&seq===navSeq&&route()==='profile'){profileCache=has;paintProfile163(has)}",
 "if(false&&has&&seq===navSeq&&route()==='profile'){profileCache=has;paintProfile163(has)}",
 'r163 Profile cached prepaint'
);

const oldStadium=[
 " if(Array.isArray(history))merged.sports_stats.watched_events=history.filter(x=>x?.is_watched!==false).length;",
 " profileCache=merged;try{ct163Write('profile',merged)}catch{}",
 " ct168PaintProfile(merged,'');",
 " const stadiumCount=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??0);",
 " try{window.__ctR296Test?.injectStadiumMetric296?.(stadiumCount)}catch{}"
].join('\n');
const newStadium=[
 " if(Array.isArray(history))merged.sports_stats.watched_events=history.filter(x=>x?.is_watched!==false).length;",
 " const stadiumCount=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??(Array.isArray(history)?history.filter(x=>x?.is_watched!==false&&x?.attended_in_person===true).length:0));",
 " merged.sports_stats.stadium_events=stadiumCount;",
 " profileCache=merged;try{ct163Write('profile',merged)}catch{}",
 " ct168PaintProfile(merged,'');"
].join('\n');
js=once(js,oldStadium,newStadium,'Profile stadium before paint');

const oldEventStat="'<div class=\"stat\"><small>Eventos assistidos</small><b>'+Number(sports.watched_events||0).toLocaleString('pt-BR')+'</b></div></div>'+";
const newEventStat="'<button type=\"button\" class=\"stat ct312-stat-button\" data-ct299-history=\"all\" aria-label=\"Ver Eventos assistidos\"><small>Eventos assistidos</small><b>'+Number(sports.watched_events||0).toLocaleString('pt-BR')+'</b></button>'+ '<button type=\"button\" class=\"stat ct312-stat-button\" data-ct299-history=\"stadium\" aria-label=\"Ver Jogos no Estádio\"><small>Jogos no Estádio</small><b>'+Number(sports.stadium_events||0).toLocaleString('pt-BR')+'</b></button></div>'+";
js=once(js,oldEventStat,newEventStat,'Sports Profile buttons');

const sportsPrefix="const p=sport255.payload||{},rows=sportRows255(p),stats=p.stats||{},sports=p.sports||[];";
const sportsPrefix312=sportsPrefix+"try{window.__ctR312SportsCatalog=(sports||[]).map(s=>({slug:String(s?.slug||''),name:String(s?.name||s?.slug||''),icon:String(s?.icon||'🏆')}));window.__ctR312SportSelected=String(sport255.sport||'all')}catch{};";
js=once(js,sportsPrefix,sportsPrefix312,'Sports catalog bridge');
js=once(js,
 ";void paintF1255();setTimeout(cleanupLegacySports255,0);setTimeout(cleanupLegacySports255,180)}",
 ";try{window.__ctR312?.decorateSportsFilters?.()}catch{};void paintF1255();setTimeout(cleanupLegacySports255,0);setTimeout(cleanupLegacySports255,180)}",
 'Sports synchronous heading filter hook'
);

const early312="(()=>{if(window.__ctR312EarlyCapture)return;window.__ctR312EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR312EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();";

js=once(js,
 "const version='1.0.102',revision='r311-official-1.0.102';",
 "const version='1.0.103',revision='r312-official-1.0.103';",
 'footer identity'
);
js=once(js,"\nboot();","\n"+runtime+"\nboot();",'r312 runtime insertion');
js=early312+"\n"+js;
js=once(js,
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
 'Web version'
);
js=once(js,"const REVISION='r311-official-1.0.102';","const REVISION='r312-official-1.0.103';",'revision');

html=html.replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css').replaceAll('v1.0.102','v1.0.103').replaceAll('r311-official-1.0.102','r312-official-1.0.103');
sw=sw.replaceAll('ct-web-1.0.102-r311','ct-web-1.0.103-r312').replaceAll('app-v311.js','app-v312.js').replaceAll('app-v311.css','app-v312.css');
css+='\n/* CineTracker Web 1.0.103 r312 — current video truth. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.103',
 revision:'r312-official-1.0.103',
 base:'r311-production',
 scope:'latest-video-discover-auth-profile-sports-filters-web-only',
 auth_proactive_refresh:true,
 auth_retry_401_once:true,
 auth_refresh_shared_lock:true,
 discover_public_renderer:'r312-own-card',
 discover_public_exclusion:'seen+watchlist-fail-closed-before-markup',
 discover_public_copy:'two-line-title+visible-metadata',
 discover_public_actions:'fixed-below-card-watchlist+seen',
 discover_public_tab_cache_ms:120000,
 discover_public_prefetch:true,
 discover_public_no_unfiltered_fallback:true,
 foryou_layout:'compact-176px-horizontal-slots',
 profile_cached_prepaint:false,
 profile_stadium_first_paint:true,
 profile_stadium_button:true,
 profile_favorite_actors:'canonical-full-payload-after-auth-refresh',
 profile_stat_visual:'events+stadium+series-watchlist+movie-watchlist-identical',
 sports_filter_location:'next+previous-panel-heading',
 sports_filter_source:'all-payload-sports',
 sports_jwt_expired_recovery:true,
 f1_r311_preserved:true,
 android:'1.0.20/10062'
};

for(const x of[
 "function ct312AuthFailure",
 "async function ct312RefreshSession",
 "ct312RefreshTask",
 "data-ct299-history=\"stadium\"",
 "merged.sports_stats.stadium_events=stadiumCount",
 "window.__ctR312SportsCatalog",
 "decorateSportsFilters",
 "window.__ctR312='jwt-refresh+discover-own-card+foryou-compact+profile-fresh+sport-heading-filters'",
 "window.__ctR312EarlyCapture=true",
 "const version='1.0.103',revision='r312-official-1.0.103';"
])must(js,x);
if(!js.includes("if(false&&has&&seq===navSeq&&route()==='profile')"))throw new Error('r312 Profile cache prepaint survived');
if(js.includes("window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';"))throw new Error('r312 stale Web identity survived');

await Promise.all([
 writeFile(resolve(dist,'app-v312.js'),js),
 writeFile(resolve(dist,'app-v312.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v311.js'),{force:true}),rm(resolve(dist,'app-v311.css'),{force:true})]);
console.log('WEB_R312_READY auth + Discover own cards + fresh Profile + all-sports heading filters');
