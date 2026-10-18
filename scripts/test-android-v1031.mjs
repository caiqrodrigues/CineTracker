import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r273-android-js">',start=html.indexOf(marker),end=html.indexOf('</script>',start+marker.length);
assert.ok(start>=0&&end>start,'actual signed APK must contain r273 script');
const app=html.slice(start+marker.length,end);
new Function(app);
assert.ok(html.includes('name="ct-official-version" content="1.0.31"'));
for(const term of [
 "const REVISION='r273-android-official-1.0.31'",
 'window.__ctAndroidOfficialCode=10073',
 'window.__ctR271Bridge={',
 'getFetcher:()=>fetchAllMovies271',
 'setFetcher:fn=>{if(typeof fn==="function")fetchAllMovies271=fn}',
 'getPainter:()=>paintMovieHistory271',
 'setPainter:fn=>{if(typeof fn==="function")paintMovieHistory271=fn}',
 'window.__ctR271AndroidV1029',
 'window.__ctR270AndroidV1028',
 'window.__ctR269AndroidV1027',
 'cinetracker_sport_mark_watched_v1',
 'cinetracker_sports_stadium_summary_v296',
 'window.__ctR273AndroidV1031=VERSION'
])assert.ok(app.includes(term),'missing protected runtime '+term);
const patch=await readFile('apps/android/runtime-r273-v1031-safe-history-bridge.js','utf8');
new Function(patch);
assert.ok(!patch.includes('const legacyFetcher273=fetchAllMovies271'),'regression: private IIFE fetch without bridge');
assert.ok(!patch.includes('const moviePaintFull273=paintMovieHistory271'),'regression: private IIFE painter without bridge');
for(const denied of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!patch.includes(denied),'forbidden '+denied);
let booted=0,paintCalls=[],posterCalls=0;
const old=[{id:2,media_id:102,watched_at:'2026-09-19T12:00:00Z',media_title:'Pokémon',plays:1}];
const extra=[{media_id:105,watched_at:'2026-10-11T22:00:00Z',media_title:'Filme visto em outubro',plays:2}];
const vp={scrollTop:100,querySelector(sel){if(sel==='.home-history .stack')return stack;if(sel==='.home-history')return container;return null}};
const stack={},container={querySelector(){return stack},insertBefore(el){this.button=el}};
const listeners={};
const document={head:{appendChild(){}},querySelector:s=>s==='[data-home-viewport="movies"]'?vp:null,
 createElement:t=>({dataset:{},className:'',textContent:'',type:'',remove(){}}),
 addEventListener:(name,fn)=>{listeners[name]=fn}};
const env={
 window:{__ctR270Test:{watchPosters(){posterCalls++}}},document,originCalls:0,paintCalls,
 Date,Number,Map,Array,String,Promise,console,
 ct186LoadForYou:async()=>({}),ct186ContextValue:null,ct186ContextAt:0,CT186_CONTEXT_TTL:1000,
 session:{user:{id:'test'}},user:{id:'test'},localDay:()=> '2026-10-18',
 localStorage:{removeItem(){}},route:()=> 'home',
 homeCache:{history_movies:[...old,...extra]},
 rpc:async()=> extra,
 boot:()=>{booted++},
};
vm.createContext(env);
const bridgeStart=app.indexOf('window.__ctR271Bridge={');
const bridgeEnd=app.indexOf('\n'+ 'window.__ctR271Test=',bridgeStart);
assert.ok(bridgeStart>=0&&bridgeEnd>bridgeStart,'scope bridge must appear in original r271 IIFE');
const bridgeSource=app.slice(bridgeStart,bridgeEnd);
vm.runInContext('(function(){let fetchAllMovies271=async()=>{originCalls++;return '+JSON.stringify(old)+'};let paintMovieHistory271=(rows)=>{paintCalls.push(rows);return true};'+bridgeSource+'})()',env);
vm.runInContext(patch+'\nboot();',env);
assert.equal(env.window.__ctR273StartupError,undefined,'history patch must not interrupt login bootstrap');
assert.equal(env.window.__ctR273AndroidV1031,'history-bridge-safe+play-events+bounded-paint+login-boot');
assert.equal(booted,1,'login bootstrap must execute after integrated history patch');
const combined=await env.window.__ctR271Bridge.getFetcher()();
assert.equal(env.originCalls,1);
assert.equal(combined.length,2,'legacy Pokémon and real October play preserved');
assert.ok(combined.some(x=>x.media_title==='Pokémon'));
assert.ok(combined.some(x=>x.media_title==='Filme visto em outubro'));
env.window.__ctR271Bridge.getPainter()(combined);
assert.equal(paintCalls.length,1);
assert.equal(posterCalls,1);
assert.ok(combined.length===paintCalls[0].length);
// Missing bridge must NOT prevent boot; this was the black-screen failure in 1.0.30.
const fallback={window:{},document,boot:()=>{fallback.booted=(fallback.booted||0)+1},console,Date,Array,Map,Number,String,Promise,
 ct186LoadForYou:async()=>({})};
vm.createContext(fallback);
vm.runInContext(patch+'\nboot();',fallback);
assert.equal(fallback.booted,1,'missing bridge must be isolated, login must still mount');
assert.match(fallback.window.__ctR273StartupError,/bridge unavailable/);
const merge=env.window.__ctR273Test.mergeHistory273;
const m=merge([{id:1,media_id:1,watched_at:'2026-08-10T00:00:00Z'}],
 [{media_id:1,watched_at:'2026-10-10T00:00:00Z',plays:2}]);
assert.equal(m.length,2,'legitimate rewatch must remain visible');
console.log('ANDROID_1_0_31_STARTUP_SMOKE_OK bridge runtime no ReferenceError, boot called even on missing bridge; movie history old+new and lazy posters preserved');
