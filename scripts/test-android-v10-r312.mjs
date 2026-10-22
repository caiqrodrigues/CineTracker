import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r312-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'r312 release runtime missing');
const js=html.slice(start+tag.length,end);
new Function(js);
const module=await readFile('apps/android/runtime-r312-auth-transport.js','utf8');
new Function(module);
for(const marker of [
 "const REVISION='r312-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10113',
 'window.__ctR312Transport=',
 'window.__ctR311Special=',
 'window.__ctR311Movies=',
 'window.__ctR311Discover=',
 'window.__ctR310Profile',
 'window.__ctR307Taste',
 'window.__ctR308Home',
 'window.__ctR305MovieHistory',
 'cinetracker_home_movie_history_v542',
 'cinetracker_home_series_v527',
 'cinetracker_home_history_v391',
 'cinetracker_ufc_series_v518',
 'cinetracker_wwe_ppv_series_v519',
 'cinetracker_f1_series_v512',
 "window.addEventListener('click',tap,true);",
 "window.addEventListener('click',sportsClick304,true);",
 "if(events)events.remove();",
 'cinetracker_unmark_episode_v1',
 'data-ct308-undo'
])assert.ok(js.includes(marker),'Missing prior verified behavior '+marker);
assert.ok(!module.includes('window.location.reload('));
assert.ok(!module.includes('router.refresh('));
assert.ok(!module.includes('renderHome(')&&!module.includes('renderSports('));
assert.ok(!module.includes('paintDiscover('));
assert.ok(module.includes("const normalTmdb=ct168TmdbBase"));
assert.ok(module.includes('if(queue.length>=maxQueue&&!priority)'));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1.0'/);
assert.match(gradle,/versionCode 10113/);
assert.match(gradle,/applicationId 'com.cinetracker.app'/);
assert.match(gradle,/signingConfig signingConfigs.official/);

let refreshed=0, maximum=0,active=0,tmdbRequests=0,authTokens=[],postgrestTokens=[],failMode=false;
const oldToken='expired.jwt';
let currentToken=oldToken;
const previousDate=Math.floor(Date.now()/1000)-86400;
const local=new Map([['cinetracker_session',JSON.stringify({access_token:oldToken,refresh_token:'old-refresh',expires_at:previousDate,user:{id:'same-user'}})]]);
const context={
 window:{addEventListener(){}},
 document:{hidden:false,addEventListener(){}},
 localStorage:{getItem(k){return local.get(k)||null},setItem(k,v){local.set(k,v)}},
 fetch:async(url,options={})=>{
  if(!String(url).includes('/auth/v1/token?grant_type=refresh_token'))throw Error('unwanted URL '+url);
  refreshed++;
  await new Promise(res=>setTimeout(res,7));
  if(failMode)return{ok:false,status:400,json:async()=>({error:'refresh failed'})};
  currentToken='renewed-token-'+refreshed;
  return{ok:true,status:200,json:async()=>({
   access_token:currentToken,refresh_token:'new-refresh-'+refreshed,
   expires_at:Math.floor(Date.now()/1000)+3600,user:{id:'same-user'}
  })};
 },
 setTimeout,clearTimeout,Date,console
};
const init=`
const SUPABASE_URL='https://test.invalid';
const SUPABASE_KEY='test-publishable-key';
let session={access_token:'expired.jwt',refresh_token:'old-refresh',expires_at:${previousDate},user:{id:'same-user'}};
let user={id:'same-user'};
let api=async function(path,options){globalThis.postgrestTokens.push(session.access_token);return {path,options,success:true}};
let edge=async function(name){return name};
const ct168TmdbBase=async function(path){
 globalThis.active++;globalThis.maximum=Math.max(globalThis.active,globalThis.maximum);
 globalThis.authTokens.push(session.access_token);globalThis.tmdbRequests++;
 try{await new Promise(resolve=>setTimeout(resolve,10));return{ok:true,path}}finally{globalThis.active--}
};
let tmdb=async function(path,params){return ct168TmdbBase(path,params)};
function saveSession(s){session={...s};user=s.user||user;localStorage.setItem('cinetracker_session',JSON.stringify(session))}
`;
Object.assign(context,{postgrestTokens,authTokens,active,maximum,tmdbRequests});
Object.defineProperty(context,'active',{get:()=>active,set:v=>{active=v}});
Object.defineProperty(context,'maximum',{get:()=>maximum,set:v=>{maximum=v}});
Object.defineProperty(context,'tmdbRequests',{get:()=>tmdbRequests,set:v=>{tmdbRequests=v}});
vm.runInNewContext(init+module+`
globalThis.ctTest={getSession:()=>session,setSession:s=>{session=s},tmdb:(p,opts)=>tmdb(p,opts),api:(p,opts)=>api(p,opts),edge:(...args)=>edge(...args)};
`,context,{filename:'r312-auth-isolated'});
const helper=context.ctTest;
const many=Array.from({length:18},(_,i)=>helper.tmdb('/search/tv',{query:'candidate'+i}));
const detail=helper.tmdb('/tv/123',{append_to_response:'credits'});
const rpc=helper.api('rpc/cinetracker_home_series_v527',{method:'POST'});
const all=await Promise.all([...many,detail,rpc]);
assert.equal(all.length,20);
assert.equal(refreshed,1,'20 simultaneous requests must use one token renewal');
assert.equal(Math.min(...authTokens.map(t=>t.startsWith('renewed-token-')?1:0)),1,
 'No expired Authorization token may reach TMDB');
assert.ok(postgrestTokens.every(t=>t==='renewed-token-1'),'PostgREST cannot use expired token');
assert.ok(maximum<=4,'TMDB concurrency limit violated');
assert.equal(tmdbRequests,19);
assert.ok(helper.ctTest===undefined);
assert.equal(context.window.__ctR312Transport.stats().authRenewals,1);
assert.equal((await helper.tmdb('/tv/765')).ok,true);
assert.equal(refreshed,1,'valid session must not refresh again');
assert.equal(await helper.edge('cinetracker-sports'), 'cinetracker-sports');

// A permanently expired account must stop all requests, not enqueue
// thousands of 401s and exhaust Supabase/edge quotas.
failMode=true;
helper.setSession({access_token:'another-expired',refresh_token:'invalid',expires_at:previousDate,user:{id:'same-user'}});
local.set('cinetracker_session',JSON.stringify({access_token:'another-expired',refresh_token:'invalid',expires_at:previousDate,user:{id:'same-user'}}));
const previousTmdb=tmdbRequests;
const errors=await Promise.allSettled(Array.from({length:14},(_,i)=>helper.tmdb('/search/movie',{query:'failed'+i})));
assert.ok(errors.every(r=>r.status==='rejected'),'Expired token must refuse all 14 requests');
assert.equal(tmdbRequests,previousTmdb,'Failed refresh may not send a single expired TMDB call');
assert.ok(refreshed<=3,'Failed refresh must open a temporary circuit, not 14 refreshes');
assert.ok(context.window.__ctR312Transport.stats().authFails>=1);
console.log('CINETRACKER_1_0_R312_TEST_OK: expired Android session refreshes exactly once for concurrent movie/series/discover RPC + TMDB calls; bad JWT never sent, max 4 TMDB active, genuine detail works, failure fast-stop; r311 Home/Special/Movies/Discover, Sports and F1 preserved.');
