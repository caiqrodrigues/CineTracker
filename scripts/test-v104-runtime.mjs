import fs from 'node:fs';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const source=fs.readFileSync('apps/web/runtime-r208-v104-core.js','utf8');
const dom=new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>',{url:'https://mycinetracker.vercel.app/home',runScripts:'dangerously',pretendToBeVisual:true});
const w=dom.window;
let calls=[],goCalls=[];
w.eval(`
var homeCache=null,profileCache=null,discoverCache=new Map(),ct171SeenMap=null,ct169CurrentDetail={detail:{number_of_episodes:12,status:'Returning Series'}},ct169DrawerState={showId:200,seasonNo:1,episodes:[{episode_number:2,name:'Ep 2',runtime:48}]},discoverState={tab:'foryou'},ct186ForYouData=null;
function route(){return location.pathname.replace(/^\\/+/, '').split('/')[0]||'home'}
function pathFor(k){return k==='configs'?'/configs':'/'+k}
function go(p){window.__goCalls.push(p)}
function toast(){}
function shell(){return '<main><div class="version">CineTracker • v1.0.1 • old</div></main>'}
function mediaTmdb(x){return Number(x?.tmdb_id||x?.id||0)}
function ensureMedia(type,id){return Promise.resolve({id:id+1000,title:'T',runtime_minutes:100})}
function edge(){return Promise.resolve({MRData:{RaceTable:{Races:[]},StandingsTable:{StandingsLists:[{DriverStandings:[],ConstructorStandings:[]}]}}})}
function rpc(name,args){return window.__rpc(name,args)}
function paintHome(){document.querySelector('#app').innerHTML='<div data-home><section><h3>Histórico recente</h3><div class="media-row" data-media="tv:200"><b>Série</b><small>S01 E02</small></div></section><section><h3>Filmes vistos</h3><div class="media-row" data-media="movie:100"><b>Filme</b><small>Visto</small></div></section></div>'}
function paintDiscover(){return true}
function discoverRows(){return Promise.resolve({_ct186_fresh:{movie:[{id:10},{id:11}],series:[],anime:[]},_ct186_watchlist:{movie:[{id:20},{id:21}],series:[],anime:[]}})}
function paintSports(){}
async function renderSports(){}
`);
w.__goCalls=goCalls;
w.__rpc=(name,args)=>{calls.push({name,args});if(name==='cinetracker_rewatch_counts_v104')return Promise.resolve([{tmdb_id:100,item_type:'movie',plays:2},{tmdb_id:200,item_type:'episode',season_number:1,episode_number:2,plays:4}]);if(name==='cinetracker_mark_watch_v0994')return Promise.resolve({plays:3});if(name==='cinetracker_mark_episode_v0994')return Promise.resolve({plays:5});if(name==='cinetracker_recommendation_memory_v101')return Promise.resolve([{tmdb_id:10,slot:'fresh:movie',shown_at:'2020-01-01T00:00:00Z',action:'shown'},{tmdb_id:20,slot:'watchlist:movie',shown_at:new Date().toISOString(),action:'shown'},{tmdb_id:21,slot:'watchlist:movie',shown_at:'2020-01-01T00:00:00Z',action:'shown'}]);if(name==='cinetracker_recommendation_record_v101')return Promise.resolve({ok:true});return Promise.resolve({});};
w.eval(source);
w.paintHome();
await new Promise(r=>setTimeout(r,80));
let buttons=[...w.document.querySelectorAll('[data-ct104-rewatch]')];
assert.equal(buttons.length,2,'History must expose movie and episode rewatch actions');
assert.match(buttons.find(b=>b.dataset.ct104Kind==='movie').textContent,/2x/);
assert.match(buttons.find(b=>b.dataset.ct104Kind==='episode').textContent,/4x/);
buttons.find(b=>b.dataset.ct104Kind==='movie').click();
await new Promise(r=>setTimeout(r,30));
assert.match(buttons.find(b=>b.dataset.ct104Kind==='movie').textContent,/3x/);
const movieCall=calls.find(x=>x.name==='cinetracker_mark_watch_v0994');
assert.equal(movieCall.args.p_media_id,1100);assert.equal(movieCall.args.p_item_type,'movie');
await w.ct171RewatchEpisode(1,2,buttons.find(b=>b.dataset.ct104Kind==='episode'));
const epCall=calls.find(x=>x.name==='cinetracker_mark_episode_v0994');
assert.equal(epCall.args.p_media_id,1200);assert.equal(epCall.args.p_season_number,1);assert.equal(epCall.args.p_episode_number,2);
const d=await w.discoverRows('foryou');
assert.deepEqual(d._ct186_fresh.movie.map(x=>x.id),[11],'Fresh recommendations must never reuse previously shown titles');
assert.deepEqual(d._ct186_watchlist.movie.map(x=>x.id),[21],'Watchlist must enforce 30-day cooldown but allow older items');
w.document.querySelector('#app').innerHTML='<a data-nav="profile" href="/profile">Perfil</a>';
w.document.querySelector('[data-nav="profile"]').click();
assert.equal(goCalls.at(-1),'/profile','Global nav must route immediately');
w.history.replaceState({},'', '/sports');
w.document.querySelector('#app').innerHTML='<div data-sports><div data-sports-summary>3 esportes disponíveis · 2 favoritos</div></div>';
w.paintSports();await new Promise(r=>setTimeout(r,30));
assert.ok(w.document.querySelector('#ct-f1-v104'),'Sports must render F1 Hub');
assert.equal(w.document.querySelector('[data-sports-summary]'),null,'Sports status summary must be removed');
assert.match(w.shell(),'v1.0.4','Shell must paint 1.0.4 identity');
console.log('V104_BEHAVIOR_TEST_OK history=movie+episode counts=shared rpc=canonical recommendations=no-repeat+30d nav=instant sports=f1');
dom.window.close();
