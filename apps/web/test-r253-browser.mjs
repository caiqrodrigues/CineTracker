import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const runtime=await readFile(new URL('./runtime-r253-single-authority-live-data.js',import.meta.url),'utf8');
const harness=`<!doctype html><meta charset="utf-8"><body><div id="app"></div><script>
let currentRoute='sports',navSeq=1,homeCache=null,profileCache=null,user={id:'u'},discoverCache=new Map();
const now=new Date(),pad=n=>String(n).padStart(2,'0'),ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),today=ymd(now),tomorrow=ymd(new Date(now.getTime()+86400000));
function route(){return currentRoute}function tz(){return'America/Sao_Paulo'}function loading(s){return '<div class="loader">'+s+'</div>'}function fail(s){return '<div class="error">'+s+'</div>'}
function shell(t,s,r,b){return '<main data-page="'+r+'"><h1>'+t+'</h1>'+b+'</main>'}function setApp(h){document.querySelector('#app').innerHTML=h}function toast(){}
function mediaCard(x){return '<article class="card" data-native-card="1"><button data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+(x.tmdb_id||x.id)+'"><b>'+(x.title||x.name||x.media_title)+'</b></button></article>'}
function paintHome(){const h=document.querySelector('[data-home]'),s=homeCache.series||[];h.innerHTML='<section data-home-bucket="dust">'+s.filter(x=>x.home_bucket==='dust').map(x=>x.title).join('|')+'</section><section data-home-bucket="up_to_date">'+s.filter(x=>x.home_bucket==='up_to_date').map(x=>x.title).join('|')+'</section><section data-history>'+((homeCache.history_episodes||[]).map(x=>x.media_title).join('|'))+'</section>'}
function sportsEvent(e){return '<article class="event"><b>'+(e.title||e.home_name||'Evento')+'</b></article>'}
window.__ctR248RenderF1=()=>{const r=document.querySelector('[data-sports]');if(r&&!r.querySelector('.ct248-f1hub'))r.insertAdjacentHTML('beforeend','<section class="ct248-f1hub"><button>Visão geral</button><button>Calendário</button><button>Próximo GP</button><button>Pilotos</button><button>Construtores</button><button>Último GP</button></section>')};
window.__ctR238ProfileStats=()=>{};
async function baseProfile(seq){setApp(shell('Perfil','','profile','<div class="page" data-profile><section class="panel" data-profile-order="episodes,movies,series-watchlist,movies-watchlist,series-time,movies-time,series-watch-time,movies-watch-time,screen-total,watch-total"><div class="panel-head"><h2>Estatísticas</h2></div></section><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stat"><small>Tempo assistido</small><b>500h 00min</b></div><div class="stat"><small>Eventos assistidos</small><b>43</b></div></section></div>'))}
let renderProfile=baseProfile,renderHome=async()=>{},renderSports=async()=>{},renderDiscover=async()=>{};
const watchDash=[
 {id:401,tmdb_id:401,media_type:'movie',title:'Watch Filme',poster_path:'/p.jpg',vote_average:8.4,release_date:'2024-01-01',genre_ids:[28],is_watchlist:true},
 {id:402,tmdb_id:402,media_type:'tv',name:'Watch Série',poster_path:'/p.jpg',vote_average:8.4,first_air_date:'2024-01-01',genre_ids:[10759],is_watchlist:true},
 {id:403,tmdb_id:403,media_type:'tv',name:'Watch Anime',poster_path:'/p.jpg',vote_average:8.4,first_air_date:'2024-01-01',genre_ids:[16,35],origin_country:['JP'],original_language:'ja',is_watchlist:true}
];
const sportEvents=[
 {id:1,provider:'p',provider_event_id:'1',title:'Hoje Futuro',starts_at:today+'T23:00:00-03:00',status:'scheduled',is_watched:false},
 {id:2,provider:'p',provider_event_id:'2',title:'Anterior',starts_at:new Date(now.getTime()-3600000).toISOString(),status:'finished',has_favorite:true,is_watched:false}
];
const sportHistory=Array.from({length:48},(_,i)=>({id:100+i,provider:'p',provider_event_id:'h'+i,title:'Assistido '+(i+1),starts_at:new Date(now.getTime()-(i+1)*3600000).toISOString(),status:'finished',is_watched:true,sport_watched_at:new Date().toISOString()}));
async function rpc(name){
 if(name==='cinetracker_sports_payload_v1')return{events:sportEvents,watch_history:sportHistory,stats:{watched_events:48,sports_minutes:32750},sports:[],favorites:[]};
 if(name==='cinetracker_sport_stats_v1')return{watched_events:48,sports_minutes:32750};
 if(name==='cinetracker_sport_mark_watched_v1')return{success:true};
 if(name==='cinetracker_profile_media_dashboard_v0991')return watchDash;
 if(name==='cinetracker_profile_payload_v0997_r2')return{stats:{episodes_watched:999,movies_watched:99}};
 if(name==='cinetracker_home_live_v0997_r3')return{series:[
  {title:'Caught Old',watched_episodes:10,released_episodes:10,is_caught_up:true,last_watched_at:'2025-01-01',home_bucket:'dust'},
  {title:'Real Dust',watched_episodes:5,released_episodes:10,is_caught_up:false,history_missing_episodes:5,home_bucket:'dust'}
 ],history_episodes:[{media_title:'Depois de Black Mirror'}],history_movies:[],movie_watchlist:[]};
 if(name==='cinetracker_calendar_watchlist_v0997')return[{id:901,tmdb_id:901,media_type:'movie',title:'Calendário',poster_path:'/p.jpg',vote_average:8.2,release_date:tomorrow,calendar_date:tomorrow,genre_ids:[28]}];
 return{};
}
const apiCalls=[];async function api(path,opt={}){apiCalls.push({path,opt});if(path.startsWith('shown_recommendations?'))return[];return[]}
const mk=(id,title,type='movie',extra={})=>({id,media_type:type,[type==='movie'?'title':'name']:title,poster_path:'/p.jpg',vote_average:8.4,[type==='movie'?'release_date':'first_air_date']:'2026-09-05',genre_ids:type==='movie'?[28]:[10759],...extra});
async function safeTmdb(path,params={}){
 if(path==='/trending/all/week'){await new Promise(r=>setTimeout(r,80));return{results:[mk(710,'TRENDING LENTO','movie')]}}
 if(path==='/trending/all/day')return{results:[mk(711,'TOP10','movie')]};
 if(path==='/movie/popular')return{results:[mk(712,'POPULAR FILME','movie')]};if(path==='/tv/popular')return{results:[mk(713,'POPULAR SERIE','tv')]};
 if(path==='/movie/top_rated')return{results:[mk(714,'TOP FILME','movie')]};if(path==='/tv/top_rated')return{results:[mk(715,'TOP SERIE','tv')]};
 if(path==='/discover/movie')return{results:[mk(params['primary_release_date.gte']?720:716,params['primary_release_date.gte']?'NOVO FILME':'DIARIO','movie')]};
 if(path==='/discover/tv'){if(params.with_origin_country==='JP')return{results:[mk(721,'NOVO ANIME','tv',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'})]};return{results:[mk(722,'NOVA SERIE','tv')]}}
 return{results:[]}
}
${runtime.replaceAll('</script>','<\\/script>')}
(async()=>{const A=(c,m)=>{if(!c)throw new Error(m)};try{
 await renderSports(navSeq);await new Promise(r=>setTimeout(r,10));
 A(document.querySelectorAll('[data-ct253-sport-tab]').length===4,'sports exactly four tabs');
 A(!document.querySelector('[data-sports-tab]')&&!document.querySelector('.ct248-sports-tabs'),'no legacy sports tabs');
 A(document.querySelectorAll('.ct248-f1hub').length===1,'one F1 hub');
 A(document.body.textContent.includes('48'),'sports live count 48');
 document.querySelector('[data-ct253-sport-tab="watched"]').click();await new Promise(r=>setTimeout(r,10));A(document.querySelectorAll('.event').length===48,'watched canonical 48 rows');
 currentRoute='discover';navSeq++;await renderDiscover(navSeq);A(document.querySelectorAll('[data-ct253-discover-tab]').length===9,'discover nine tabs');A(document.querySelectorAll('[data-ct253-foryou] .panel').length===3,'foryou three blocks');A(document.querySelectorAll('[data-ct253-foryou] .card').length===7,'foryou seven native cards');
 const tabs=[...document.querySelectorAll('[data-ct253-discover-tab]')];for(const b of tabs.filter(x=>x.dataset.ct253DiscoverTab!=='foryou'&&x.dataset.ct253DiscoverTab!=='trending')){b.click();await new Promise(r=>setTimeout(r,30));A(b.classList.contains('active'),'tab active '+b.dataset.ct253DiscoverTab);A(!document.querySelector('[data-ct253-discover-content]').textContent.includes('Carregando títulos'),'tab resolved '+b.dataset.ct253DiscoverTab)}
 document.querySelector('[data-ct253-discover-tab="trending"]').click();document.querySelector('[data-ct253-discover-tab="top"]').click();await new Promise(r=>setTimeout(r,120));A(document.querySelector('[data-ct253-discover-tab="top"]').classList.contains('active'),'latest tab wins race');A(!document.querySelector('[data-ct253-discover-content]').textContent.includes('TRENDING LENTO'),'stale response blocked');
 currentRoute='profile';navSeq++;await renderProfile(navSeq);await new Promise(r=>setTimeout(r,20));A(document.querySelector('[data-profile-order]').dataset.profileOrder.startsWith('episodes,movies'),'profile order preserved');const sportsPanel=[...document.querySelectorAll('section.panel')].find(x=>x.textContent.includes('Esportes assistidos'));A(sportsPanel&&sportsPanel.textContent.includes('48'),'profile sports updated to 48');
 currentRoute='home';navSeq++;await renderHome(navSeq);A(!document.querySelector('[data-home-bucket="dust"]').textContent.includes('Caught Old'),'caught-up not dust');A(document.querySelector('[data-home-bucket="up_to_date"]').textContent.includes('Caught Old'),'caught-up is up to date');A(document.querySelector('[data-home-bucket="dust"]').textContent.includes('Real Dust'),'real dust remains');A(document.querySelector('[data-history]').textContent.includes('Depois de Black Mirror'),'fresh recent history preserved');
 document.body.dataset.test='PASS';document.body.insertAdjacentHTML('beforeend','<pre id="result">R253_BROWSER_PASS</pre>')
 }catch(e){document.body.dataset.test='FAIL';document.body.insertAdjacentHTML('beforeend','<pre id="result">R253_BROWSER_FAIL '+String(e&&e.stack||e)+'</pre>')}})();
</script></body>`;
const dir=await mkdtemp(join(tmpdir(),'ct-r253-browser-')),html=join(dir,'index.html');await writeFile(html,harness,'utf8');
let chrome=process.env.CHROME_BIN||'';if(!chrome){for(const c of['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[c],{stdio:'ignore'});chrome=c;break}catch{}}}
if(!chrome)throw new Error('Chromium unavailable');const args=['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${join(dir,'profile')}`,'--virtual-time-budget=5000','--dump-dom','file://'+html];
let out='';try{out=execFileSync(chrome,args,{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch(e){out=String(e.stdout||'');console.error(String(e.stderr||''))}
await rm(dir,{recursive:true,force:true});if(!out.includes('R253_BROWSER_PASS')){console.error(out.slice(-14000));process.exit(1)}console.log('R253_BROWSER_PASS');
