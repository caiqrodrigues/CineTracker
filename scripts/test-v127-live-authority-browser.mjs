import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const patch=(await readFile(resolve(root,'apps/web/runtime-r235-v127-live-authority.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v127-live',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const fixture=`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="app"></div><script>
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let homeCache={series:[]};let profileCache={dashboard:[]};let discoverCache=new Map(),sportsCache=null;
function localDay(){return'2026-09-09'}
function img(p){return p||''}
function go(p){document.body.dataset.go=p}
async function restoreSession(){return true}
async function rpc(name){if(name!=='cinetracker_watchlist_full_v119')return{};const rows=[];for(let i=1;i<=1358;i++)rows.push({media_id:i,media_type:'movie',tmdb_id:i%5===0?0:i,title:'Movie '+String(i).padStart(4,'0'),release_year:2000+i%26,poster_path:i%7===0?null:'/m.jpg',added_at:'2026-09-01T00:00:00Z'});for(let i=1;i<=564;i++)rows.push({media_id:2000+i,media_type:'tv',tmdb_id:i%4===0?0:5000+i,title:'Series '+String(i).padStart(4,'0'),release_year:2000+i%26,poster_path:null,added_at:'2026-08-01T00:00:00Z'});return{rows,counts:{movie:1358,series:564},count:1922}}
async function safeTmdb(path){if(path==='/tv/202')return{last_episode_to_air:{season_number:1,episode_number:5,air_date:'2026-09-08',name:'Fresh'},number_of_episodes:5,seasons:[{season_number:1,episode_count:5}]};return{}}
function paintHome(){document.body.dataset.homePaint=(Number(document.body.dataset.homePaint||0)+1).toString()}
async function renderProfile(){}
function paintDiscover(){}
async function renderDiscover(){document.querySelector('#app').innerHTML='<div data-page="discover" data-discover><div data-discover-content><div class="loader">Carregando</div></div></div>';await wait(100);document.querySelector('[data-discover-content]').innerHTML='<article id="newcard" class="card"><div class="poster" style="background-image:url(x)"></div><b>Novo</b></article>'}
function sportsFiltered(p){return p?.events||[]}
function paintSports(){}
async function renderSports(){}
async function syncSports(){}
window.__ctV124Discover=async()=>{};window.__ctV123SportsNow=()=>{};
</script><script>${patch}</script><script>
(async()=>{try{const app=document.querySelector('#app');
 await wait(40);app.innerHTML='<div data-page="discover" data-discover><div id="legend">REGRA ATIVA Personalizado · respeita histórico, progresso e Watchlist</div><div data-discover-content><div class="row"><article id="dcard" class="card"><div class="poster" style="background-image:url(x)"></div><b>Card</b></article></div></div></div>';await wait(120);document.body.dataset.legend=String(!!document.querySelector('#legend'));document.body.dataset.card=String(document.querySelector('#dcard')?.classList.contains('ct127-discover-card'));
 document.querySelector('[data-discover-content]').innerHTML='<div id="oldcontent">OLD-CONTENT</div>';const renderTask=renderDiscover();await wait(20);document.body.dataset.oldDuringLoad=String(!!document.querySelector('#oldcontent'));await renderTask;await wait(80);document.body.dataset.newAfterLoad=String(!!document.querySelector('#newcard'));
 app.innerHTML='<div data-page="discover" data-discover><button class="active" data-discover-tab="top10">Top 10</button><div data-discover-content><article id="topcard" class="card"><div class="poster" style="background-image:url(x)"></div><b>Top</b></article></div></div>';await wait(100);document.body.dataset.topUntouched=String(!document.querySelector('#topcard')?.classList.contains('ct127-discover-card'));
 app.innerHTML='<div data-sports><div class="event-grid"><article id="sport"><button>Ver eventos</button><button>Eventos</button><button>✓ Marcar assistida</button><button>✓ Marcar como assistido</button></article></div></div>';await wait(120);const actions=[...document.querySelectorAll('#sport .ct127-sports-actions .ct127-sport-action')].map(x=>x.textContent.trim());document.body.dataset.sportCount=String(actions.length);document.body.dataset.sportText=actions.join('|');document.body.dataset.sportDuplicates=String([...document.querySelectorAll('#sport button')].filter(x=>/eventos|assist/i.test(x.textContent)).length);
 const dd=sportsFiltered({events:[{sport_slug:'soccer',provider:'thesportsdb',home_name:'A FC',away_name:'B FC',starts_at:'2026-09-09T12:00:00Z'},{sport_slug:'soccer',provider:'api-sports:football',home_name:'A FC',away_name:'B FC',starts_at:'2026-09-09T13:00:00Z'}]});document.body.dataset.sportDedupe=String(dd.length);document.body.dataset.sportProvider=String(dd[0]?.provider||'');
 app.innerHTML='<div data-profile><button class="stat"><small>Séries Watchlist</small><b>0</b></button><button class="stat"><small>Filmes Watchlist</small><b>0</b></button></div>';await wait(180);document.body.dataset.movies=document.querySelector('[data-ct127-watchlist="movie"] b')?.textContent||'';document.body.dataset.series=document.querySelector('[data-ct127-watchlist="series"] b')?.textContent||'';const modal=await window.__ctV127OpenWatchlist('movie');await wait(120);document.body.dataset.modalCount=modal.querySelector('[data-ct127-count]')?.textContent||'';document.body.dataset.modalRows=String(modal.querySelectorAll('.ct127-watch-row').length);document.body.dataset.localRows=String(modal.querySelectorAll('.ct127-watch-local').length);modal.remove();
 homeCache={series:[{tmdb_id:101,title:'Known',watched_episodes:3,released_episodes:4,last_season_number:1,last_episode_number:3,latest_released_season_number:1,latest_released_episode_number:4,is_caught_up:true,home_bucket:'up_to_date'},{tmdb_id:202,title:'Stale',watched_episodes:4,released_episodes:4,last_season_number:1,last_episode_number:4,latest_released_season_number:1,latest_released_episode_number:4,is_caught_up:true,home_bucket:'up_to_date'}]};window.__ctV127FixKnownHome();document.body.dataset.homeKnown=homeCache.series[0].home_bucket+':'+homeCache.series[0].is_caught_up;await window.__ctV127RefreshHome();document.body.dataset.homeFresh=homeCache.series[1].home_bucket+':'+homeCache.series[1].is_caught_up+':'+homeCache.series[1].latest_released_episode_number;
 document.body.dataset.done='1'}catch(e){document.body.dataset.err=String(e?.stack||e);document.body.dataset.done='1'}})();
</script></body></html>`;
await writeFile(file,fixture);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=4200','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const groups={
 discover:['data-done="1"','data-legend="false"','data-card="true"','data-old-during-load="true"','data-new-after-load="true"','data-top-untouched="true"'],
 sports:['data-done="1"','data-sport-count="2"','data-sport-text="Ver eventos|✓ Marcar como assistido"','data-sport-duplicates="2"','data-sport-dedupe="1"','data-sport-provider="api-sports:football"'],
 watchlist:['data-done="1"','data-movies="1.358"','data-series="564"','data-modal-count="1.358"','data-modal-rows="1358"','data-local-rows="271"'],
 home:['data-done="1"','data-home-known="continue:false"','data-home-fresh="continue:false:5"']
};
const group=process.env.CT_ASSERT||'all',must=group==='all'?Object.values(groups).flat():groups[group];if(!must)throw new Error('Unknown CT_ASSERT '+group);for(const m of must)if(!out.includes(m))throw new Error(`V127 ${group} missing ${m}\n${out.slice(-12000)}`);if(out.includes('data-err='))throw new Error(`V127 ${group} runtime error\n${out.slice(-12000)}`);console.log(`V127_BROWSER_OK ${group}`);