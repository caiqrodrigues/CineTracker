import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const key='<script data-ct-android="r266-android-js">';
const a=html.indexOf(key),b=html.indexOf('</script>',a+key.length);
assert.ok(a>=0&&b>a,'r266 embedded script must exist');
const app=html.slice(a+key.length,b),patch=await readFile('apps/android/runtime-r266-v1024-video-verified.js','utf8');
new Function(app);new Function(patch);
for(const check of [
 "const REVISION='r266-android-official-1.0.24'",
 "window.__ctAndroidOfficialCode=10066",
 "window.__ctR265AndroidV1023=",
 "window.__ctR264AndroidV1022=",
 "window.__ctR263AndroidV1021=",
 "window.__ctR243Fix=",
 "window.__ctR226V120=",
 'cinetracker_sports_stadium_summary_v296',
 'ct169-drawer-backdrop',
 'ct186FreshEligible',
 'ct186MergeRows',
 'data-ct266-stadium-stat',
 'data-ct263-special-screen',
 'cinetracker_f1_watch_sync_v462',
 'cinetracker_sports_watch_set_v296'
])assert.ok(app.includes(check),'missing '+check);
assert.ok(html.includes('name="ct-official-version" content="1.0.24"'));
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(bad),'forbidden '+bad);
const valid={id:11,media_type:'movie',title:'Filme Real e Elegível',poster_path:'/123.jpg'};
const another={id:12,media_type:'movie',title:'Outro Filme Real e Elegível',poster_path:'/456.jpg'};
const wrapper={_ct186_fresh:{movie:[],series:[{id:31}],anime:[]},_ct186_watchlist:{movie:[],series:[],anime:[]}};
let paint=0,calls=[],sportsCount=7;
const statsEl={children:[],appendChild(x){this.children.push(x)}};
const profilePanel={querySelector(selector){if(selector==='.stats')return statsEl;if(selector==='[data-ct266-stadium-stat]')return statsEl.children[0]||null;return null}};
const profile={querySelector(selector){return selector==='[data-profile-sports-panel]'?profilePanel:null}};
const D={head:{appendChild(el){D.styles.push(el)}},styles:[],createElement(){return {style:{},dataset:{},className:'',innerHTML:'',querySelector(sel){return sel==='b'?{set textContent(s){this.value=s}}:null}}},querySelector(sel){return sel==='[data-profile]'?profile:null},addEventListener(){},documentElement:{dataset:{}}};
const globals={
 document:D,window:{__ctR265Test:{allowed:x=>[11,12].includes(x.id)}},
 ct186LoadForYou:async()=>wrapper,
 ct186Context:async()=>({}),ct186FreshEligible:x=>[11,12].includes(x.id),
 ct186MergeRows:(a,b)=>[...new Map([...a,...b].map(x=>[x.id,x])).values()],
 ct186Select:dat=>({daily:dat._ct186_fresh.movie[0]||null,fm:dat._ct186_fresh.movie[1]||null,fs:null,fa:null,wm:null,ws:null,wa:null,wmPool:[],wsPool:[],waPool:[]}),
 ct186ForYouData:wrapper,discoverCache:new Map([['r186:foryou:2026-10-16',{stale:true}]]),
 localDay:()=> '2026-10-16',user:{id:'user'},session:{user:{id:'user'}},
 pages:async()=>[valid,another],
 route:()=>globals.currentRoute,discoverState:{tab:'foryou'},currentRoute:'discover',
 paintDiscover:()=>{paint++},
 renderProfile:async()=>{},rpc:async(name)=>{calls.push(name);return {stadium_events:sportsCount,watched_events:30}},
 requestAnimationFrame:f=>{f()},setTimeout:(cb,ms)=>{const t=setTimeout(cb,ms);t.unref();return t},
 console,Intl,Date,Promise,
};
vm.createContext(globals);vm.runInContext(patch,globals,{timeout:1000});
await globals.ct186LoadForYou(false);for(let i=0;i<15;i++)await new Promise(resolve=>setImmediate(resolve));
assert.equal(wrapper._ct186_fresh.movie.length,2,'bounded topup must preserve 2 eligible movies');
assert.equal(wrapper.daily.id,11);assert.equal(wrapper.movie.id,12);
assert.ok(paint>0,'successful fill should repaint the existing seven slots');
globals.currentRoute='profile';await globals.renderProfile(1);for(let i=0;i<10;i++)await Promise.resolve();
assert.ok(calls.includes('cinetracker_sports_stadium_summary_v296'),'must call authenticated correct stadium RPC');
assert.ok(statsEl.children.length===1,'stadium stat should be present once');
assert.ok(D.styles[0].textContent.includes('.ct169-drawer-backdrop'),'actual TV season modal must be bounded');
assert.ok(D.styles[0].textContent.includes('--ct180-nav-h'),'fixed bottom menu must be accounted for');
console.log('ANDROID_1_0_24_VALIDATED eligible film topup+no-fake-watchlist+actual attendance RPC+real TV drawer bounds+native base');
