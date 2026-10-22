import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r315-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Official r315 Android runtime missing');
const js=html.slice(a+tag.length,b);new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
for(const marker of [
 "const REVISION='r315-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10116',
 'window.__ctR314ForYou=',
 "rpc('cinetracker_discover_watch_unseen_v421'",
 "rpc('cinetracker_discover_fresh_v421'",
 'window.__ctR313Session=',
 'window.__ctR308Home=',
 'window.addEventListener(\'click\',sportsClick304,true);',
 'window.__ctR315DiscoverCards=',
 'window.__ctR315TasteAdapter=',
 'data-ct315-seen=',
 'data-ct315-meta',
 'data-ct315-runtime'
])assert.ok(js.includes(marker),'Missing r315/stable scope marker: '+marker);
const start=js.indexOf('/* CineTracker official Android 1.0/r315.');
const end=js.indexOf('\nboot();',start);
assert.ok(start>0&&end>start,'r315 must be last before boot');
const module=js.slice(start,end);new Function(module);
for(const restricted of [
 'window.location.reload(', 'router.refresh(', 'renderHome=',
 'renderProfile=', 'renderSports=', 'paintHome=', 'paintProfile=', 'paintSports=',
 'renderDiscover=', 'cinetracker_home_', 'cinetracker_sport_'
])assert.ok(!module.includes(restricted),'Out-of-scope change '+restricted);
assert.ok(module.includes("if(window.__ctR315DiscoverCards)return;"));
assert.ok(module.includes("if(window.__ctR315TasteAdapter)return;"));
assert.ok(module.includes("current()?card(x):priorCard(x)"));
assert.ok(module.includes("if(activeBefore&&current())schedule()"));
assert.ok(module.includes("event.preventDefault();event.stopImmediatePropagation();"));
assert.ok(module.includes("Promise.resolve().then(()=>markSeen(type,id))"));
assert.ok(module.includes("if(!session?.access_token)"));
assert.ok(module.includes("busy.has(idKey)"));
assert.ok(module.includes('52px!important'));
assert.ok(module.includes('data-ct263-special="ufc"'));
assert.ok(module.includes('aspect-ratio:2/3!important'));
assert.ok(module.includes('Duração não informada'));
const cssStart=module.indexOf("const style=document.createElement('style');style.id='ct315-discover-home-only';");
const cssEnd=module.indexOf('document.head.appendChild(style)',cssStart);
assert.ok(cssStart>0&&cssEnd>cssStart);
const cssSource=module.slice(cssStart,cssEnd);
assert.ok(!cssSource.includes('.ct314-')&&!cssSource.includes('[data-profile]')&&!cssSource.includes('[data-sports]'));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'"));
assert.ok(gradle.includes('versionCode 10116'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));

const listeners={},writes=[],seen=[],fav=[],errors=[];
let tab='new',nav='discover',currentUser='A',token='A',oldCalls=0;
const target={
 innerHTML:'',contains(){return true},querySelector(){return null},
 querySelectorAll(){return []}
};
const cssDoc={hidden:false,
 head:{appendChild(x){this.style=x}},
 createElement(){return{id:'',textContent:''}},
 addEventListener(name,fn){(listeners[name]??=[]).push(fn)},
 querySelector(sel){return sel==='[data-discover-content]'?target:null}};
const win={addEventListener(name,fn){(listeners['win:'+name]??=[]).push(fn)},
 __ctR307Taste:{
 choose:(key,...a)=>{fav.push(['choose',key]);return a[0]?.[0]||null},
 shown:(key)=>fav.push(['shown',key]),
 feedback:(key)=>fav.push(['feedback',key])
 }};
const rows=[
 {id:10,media_type:'movie',title:'Filme de teste',poster_path:'/post.jpg',
  release_date:'2026-08-12',genre_ids:[28,878],vote_average:8.4},
 {id:11,media_type:'tv',title:'Série de teste',poster_path:'/post2.jpg',
  first_air_date:'2025-11-12',genre_ids:[18],episode_run_time:[49]}
];
const environment={
 window:win,document:cssDoc,Set,Map,Promise,Date,Number,Array,String,Math,
 session:{access_token:'tok',user:{id:'A'}},user:{id:'A'},
 discoverState:{tab:'new',type:'all'},
 route:()=>nav, mediaType:x=>x.media_type,mediaTmdb:x=>x.id,
 mediaTitle:x=>x.title,mediaPoster:x=>x.poster_path,img:p=>'https://img.test'+p,
 safeTmdb:async(url)=>({id:10,runtime:112,genres:[{name:'Ação'},{name:'Ficção científica'}]}),
 markSeen:async(type,id)=>seen.push({type,id}),
 toast:x=>errors.push(String(x)),innerWidth:360,
 setTimeout:()=>0, clearTimeout:()=>{}, console,
 paintDiscover:()=>{oldCalls++},
 discoverCard158:x=>'<article>ORIGINAL '+x.title+'</article>'
};
vm.runInNewContext(module,environment,{filename:'r315-real-android-module'});
assert.ok(win.__ctR315DiscoverCards,'Missing scoped public API');
const runtime=win.__ctR315DiscoverCards;
const rendered=environment.discoverCard158(rows[0]);
assert.ok(rendered.includes('2026 · Filme · Ação / Ficção científica'));
assert.ok(rendered.includes('Duração não informada · ★ 8.4'));
assert.ok(rendered.includes('data-discover-watch="movie:10"'));
assert.ok(rendered.includes('data-ct315-seen="movie:10"'));
assert.ok(rendered.includes('aspect')===false,'Aspect is CSS-only, not inline');
const tv=environment.discoverCard158(rows[1]);
assert.ok(tv.includes('2025 · Série · Drama'));
assert.ok(tv.includes('49 min'));
environment.discoverState.tab='foryou';
assert.ok(environment.discoverCard158(rows[0]).includes('ORIGINAL'),'ForYou card must be untouched');
environment.discoverState.tab='new';
environment.paintDiscover(rows);
assert.equal(oldCalls,1);
const keys=win.__ctR315TasteAdapter;
assert.equal(keys.normalize('watch:movie'),'watchlist:movie');
assert.equal(keys.normalize('watch:anime'),'watchlist:anime');
assert.equal(keys.normalize('fresh:movie'),'fresh:movie');
win.__ctR307Taste.shown('watch:series',{tmdb_id:11,media_type:'tv'});
win.__ctR307Taste.feedback('watch:anime',{tmdb_id:11,media_type:'tv'},'swap');
assert.deepEqual(JSON.parse(JSON.stringify(fav)),[['shown','watchlist:series'],['feedback','watchlist:anime']]);
assert.ok(cssDoc.head.style.textContent.includes('min-width:145px!important'));
assert.ok(cssDoc.head.style.textContent.includes('data-ct263-special="ufc"'));
assert.ok(!cssDoc.head.style.textContent.includes('.ct314-card'));
const itemData=runtime.data(rows[0]);
assert.equal(itemData.year,'2026');
assert.equal(itemData.genre,'Ação / Ficção científica');
assert.equal(itemData.minute,'Duração não informada');
await runtime.details('movie:10',rows[0]);
assert.ok(runtime.stats().detailCache===1);
const button={dataset:{ct315Seen:'movie:10'},disabled:false,textContent:'✓ Visto',
 isConnected:false,closest(sel){return sel==='[data-ct315-seen]'?this:null}};
const click={target:{closest:()=>button},preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
environment.document.querySelector=sel=>sel==='[data-discover-content]'?target:null;
listeners['win:click'][0](click);
await Promise.resolve();await Promise.resolve();await new Promise(setImmediate);
assert.ok(click.prevented&&click.stopped,'New Visto action must prevent collision with legacy handlers');
assert.deepEqual(JSON.parse(JSON.stringify(seen)),[{type:'movie',id:10}]);
assert.equal(errors.length,0);
assert.equal(runtime.stats().taps,1);
assert.ok(!module.includes('while(true)'));
console.log('CINETRACKER_1_0_R315_TEST_OK: version 1.0 preserved; UFC check 52px; Discover other tabs year/genre/duration and Watchlist+Visto; correct v421 FY owner and taste namespaces; seen action, no other routes changed.');