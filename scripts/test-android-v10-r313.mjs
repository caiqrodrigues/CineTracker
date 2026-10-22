import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r313-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Official 1.0/r313 runtime missing');
const js=html.slice(start+tag.length,end);
new Function(js);
for(const s of [
 "const REVISION='r313-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10114;',
 'window.__ctR313Session=',
 'restoreSession=async function restoreSession313',
 'error.ctAuthRejected=r.status===400||r.status===401;',
 'const attemptedAccess=String(session?.access_token||stored()?.access_token||"");',
 'window.__ctR312Transport=',
 'window.__ctR311Special=',
 'window.__ctR311Discover=',
 'window.__ctR311Movies=',
 'window.__ctR310Profile',
 'window.__ctR308Home',
 'window.__ctR307Taste',
 'window.__ctR305MovieHistory',
 "window.addEventListener('click',sportsClick304,true);",
 'cinetracker_unmark_episode_v1',
 'cinetracker_home_movie_history_v542'
])assert.ok(js.includes(s),'Missing r313 or previously working behavior: '+s);
const from=js.indexOf('/* CineTracker Android official 1.0/r312');
const middle=js.indexOf('/* CineTracker official Android 1.0/r313',from);
const to=js.indexOf('\nboot();',middle);
assert.ok(from>0&&middle>from&&to>middle,'Auth sections absent');
const onlyAuth=js.slice(from,to),transport=js.slice(from,middle),recovery=js.slice(middle,to);
new Function(transport);new Function(recovery);
assert.ok(!onlyAuth.includes('window.location.reload(')&&!onlyAuth.includes('router.refresh('));
assert.ok(!onlyAuth.includes('renderHome(')&&!onlyAuth.includes('paintDiscover('));
assert.ok(!onlyAuth.includes('renderSports('));
assert.ok(!onlyAuth.includes('localStorage.clear('));
assert.ok(recovery.includes("localStorage.removeItem('cinetracker_session')"));
assert.ok(!recovery.includes('localStorage.removeItem(\'cinetracker:preload'));

const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10114'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));
const oldTime=Math.floor(Date.now()/1000)-240;
const future=Math.floor(Date.now()/1000)+7200;
const owner={id:'test-account'};
function session(token,refresh,expires_at=oldTime){return{access_token:token,refresh_token:refresh,expires_at,user:owner}}
const local=new Map();
let refreshMode='invalid',refreshCalls=0,apiCalls=0,tmdbCalls=0,edgeCalls=0,userCalls=0,authViews=0,navUpdates=0;
const ctx={
 window:{addEventListener(){}},
 document:{hidden:false,addEventListener(){},querySelector:()=>({textContent:''})},
 history:{replaceState(...args){navUpdates++;ctx.location.pathname=args[2]}},
 location:{pathname:'/home'},
 localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,String(v)),removeItem:k=>local.delete(k)},
 fetch:async(url)=>{
  const u=String(url);
  if(u.includes('/auth/v1/token?grant_type=refresh_token')){
   refreshCalls++;
   await Promise.resolve(); // Allow 12 concurrent requests to share renewal.
   if(refreshMode==='invalid')return{ok:false,status:400,json:async()=>({error_code:'refresh_token_already_used'})};
   if(refreshMode==='network')throw Error('offline');
   if(refreshMode==='race'){
    local.set('cinetracker_session',JSON.stringify(session('another-valid-access','latest-refresh',future)));
    return{ok:false,status:400,json:async()=>({error_code:'refresh_token_already_used'})};
   }
   return{ok:true,status:200,json:async()=>session('renewed-valid-access','fresh-refresh',future)};
  }
  if(u.includes('/auth/v1/user')){
   userCalls++;
   const old=ctx.test?.state?.();
   if(old?.session?.access_token==='renewed-valid-access'||old?.session?.access_token==='another-valid-access')
    return{ok:true,status:200,json:async()=>owner};
   return{ok:false,status:401,json:async()=>({error:'unauthorized'})};
  }
  throw Error('Unexpected outbound URL '+u);
 },
 setTimeout,clearTimeout,queueMicrotask,Date,console
};
const bootstrap=`
const SUPABASE_URL='https://test.invalid',SUPABASE_KEY='publishable-test';
let session=null,user=null,homeCache={series:[1]},profileCache={},sportsCache={events:[2]},discoverCache=new Map([['x',[1]]]),navSeq=0;
const headers=()=>({apikey:SUPABASE_KEY,Authorization:session?.access_token?'Bearer '+session.access_token:''});
let restoreSession=async()=>false;
function renderAuth(){globalThis.authViews++;return Promise.resolve()}
let api=async function(path){globalThis.apiCalls++;return{path}};
let edge=async function(name){globalThis.edgeCalls++;return{name}};
const ct168TmdbBase=async function(path){globalThis.tmdbCalls++;return{path}};
let tmdb=ct168TmdbBase;
function saveSession(s){session={...s};user=s.user||user;localStorage.setItem('cinetracker_session',JSON.stringify(session))}
`;
Object.defineProperties(ctx,{
 refreshCalls:{get:()=>refreshCalls},apiCalls:{get:()=>apiCalls,set:v=>{apiCalls=v}},
 tmdbCalls:{get:()=>tmdbCalls,set:v=>{tmdbCalls=v}},
 edgeCalls:{get:()=>edgeCalls,set:v=>{edgeCalls=v}},
 authViews:{get:()=>authViews,set:v=>{authViews=v}}
});
vm.runInNewContext(bootstrap+onlyAuth+`
globalThis.test={
 restore:()=>restoreSession(),
 signIn:s=>{saveSession(s);},
 state:()=>({session,user,homeCache,profileCache,sportsCache,discoverSize:discoverCache.size,navSeq}),
 api:()=>api('rpc/home'),
 tmdb:()=>tmdb('/tv/123'),
 edge:()=>edge('test-function'),
 ensure:()=>window.__ctR312Transport.ensure(),
 transport:()=>window.__ctR312Transport.stats(),
 recovery:()=>window.__ctR313Session.stats()
};
`,ctx,{filename:'cinetracker-r313-auth-test'});

// Reproduces user video and real Supabase error refresh_token_already_used.
// The old bootstrap returned true and showed a broken Home; r313 must not.
local.set('cinetracker_session',JSON.stringify(session('expired-access','already-consumed')));
assert.equal(await ctx.test.restore(),false);
await Promise.resolve();await Promise.resolve();
assert.equal(local.has('cinetracker_session'),false,'Invalid rotating refresh token must be discarded');
assert.equal(ctx.test.state().session,null);
assert.equal(ctx.test.state().user,null);
assert.equal(ctx.location.pathname,'/');
assert.ok(authViews>=1,'Expired session should show real login form');
assert.equal(ctx.test.recovery().forcedLogins,1,'One login prompt, no loop');
assert.equal(refreshCalls,1,'Never retry a consumed refresh token');
assert.equal(ctx.test.state().homeCache,null);
assert.equal(ctx.test.state().profileCache,null);
assert.equal(ctx.test.state().sportsCache,null);
assert.equal(ctx.test.state().discoverSize,0);
assert.equal(tmdbCalls,0,'Invalid token must not hit protected TMDB');

// Successful re-login after revoked refresh must restore all client routes.
refreshMode='success';
ctx.test.signIn(session('renewed-valid-access','fresh-refresh',future));
assert.equal(await ctx.test.restore(),true,'A new legitimate login must recover');
assert.equal(ctx.test.state().user.id,'test-account');
await Promise.all([ctx.test.api(),ctx.test.tmdb(),ctx.test.edge()]);
assert.equal(apiCalls,1);assert.equal(tmdbCalls,1);assert.equal(edgeCalls,1);
assert.equal(ctx.test.recovery().forcedLogins,1,'Do not redirect a valid new login');

// Expired session + simultaneous startup / detail / Discover requests:
// single-flight refresh must consume the rotating token only once.
local.set('cinetracker_session',JSON.stringify(session('second-expired','usable')));
ctx.test.signIn(session('second-expired','usable'));
const before=refreshCalls;
const all=await Promise.all([ctx.test.restore(),...Array.from({length:12},()=>ctx.test.api())]);
assert.equal(all[0],true);
assert.equal(refreshCalls,before+1,'Concurrent screen opens must share one refresh');
assert.ok(all.slice(1).every(x=>x.path==='rpc/home'));

// A competing module can save a newer valid token before the old request
// returns 400; never discard the winner or expose another user's data.
refreshMode='race';
ctx.test.signIn(session('third-expired','stale'));
const beforeRace=refreshCalls;
const race=await ctx.test.ensure();
assert.equal(race,true,'Newer persisted token must win a rotation race');
assert.equal(refreshCalls,beforeRace+1);
assert.equal(ctx.test.state().session.access_token,'another-valid-access');
assert.equal(local.has('cinetracker_session'),true);
assert.equal(ctx.test.recovery().forcedLogins,1);

// Transient offline is not an invalid-refresh response: do not erase token.
refreshMode='network';
ctx.test.signIn(session('fourth-expired','offline'));
assert.equal(await ctx.test.restore(),true);
assert.equal(ctx.test.state().session.access_token,'fourth-expired');
assert.equal(local.has('cinetracker_session'),true);
assert.equal(ctx.test.recovery().forcedLogins,1);
console.log('CINETRACKER_1_0_R313_TEST_OK: user-video invalid refresh 400 routes to login exactly once, preserves library storage; normal sign-in reopens routes, simultaneous requests use one token, replacement race safe, offline retains session; prior Home/Sports/Discover untouched.');
