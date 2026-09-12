import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const runtime=await readFile(new URL('./runtime-r255-discover-cards-home-sports-profile.js',import.meta.url),'utf8');
const harness=`<!doctype html><meta charset="utf-8"><body><div id="app"></div><script>
let currentRoute='home',navSeq=1,homeCache=null,profileCache=null,user={id:'u'};
function route(){return currentRoute} function loading(s){return '<div class="loader">'+s+'</div>'} function fail(s){return '<div class="error">'+s+'</div>'} function toast(){}
function shell(t,s,r,b){return '<main data-page="'+r+'"><h1>'+t+'</h1>'+b+'</main>'} function setApp(h){document.querySelector('#app').innerHTML=h} function img(){return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}
window.__NativeMO=window.MutationObserver;delete window.IntersectionObserver;
function paintHome(){const h=document.querySelector('[data-home]'),s=homeCache?.series||[],w=homeCache?.movie_watchlist||[],hm=homeCache?.history_movies||[];h.innerHTML='<div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series"><section data-bucket="continue">'+s.filter(x=>x.home_bucket==='continue').map(x=>x.title).join('|')+'</section><section data-bucket="up_to_date">'+s.filter(x=>x.home_bucket==='up_to_date').map(x=>x.title).join('|')+'</section></div><div data-home-view="movies"><section class="home-section"><div class="stack">'+w.map(x=>x.title).join('|')+'</div></section><section class="home-section"><div class="stack">'+hm.map(x=>x.title).join('|')+'</div></section></div>'}
let renderHome=async()=>{},renderDiscover=async()=>{},renderSports=async()=>{},render=async()=>{};
let renderProfile=async function(){setApp(shell('Perfil','','profile','<div data-profile><section class="panel"><div class="stat"><small>Eventos assistidos</small><b>43</b></div><div class="stat"><small>Tempo de esportes</small><b>94h 00min</b></div></section></div>'))};
const future=new Date(Date.now()+3600000),past=new Date(Date.now()-3600000);
const media=(id,title,type='movie',extra={})=>({id,tmdb_id:id,media_type:type,[type==='movie'?'title':'name']:title,poster_path:'/p'+id+'.jpg',vote_average:8.5,[type==='movie'?'release_date':'first_air_date']:'2026-09-05',genre_ids:type==='movie'?[28,12]:[10759],...extra});
const watchRows=[media(401,'Watch Filme','movie'),media(402,'Watch Série','tv'),media(403,'Watch Anime','tv',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'})];
const freshMovies=Array.from({length:8},(_,i)=>media(600+i,'Novo Filme '+i,'movie'));
const freshTv=Array.from({length:8},(_,i)=>media(700+i,'Nova Série '+i,'tv'));
const trending=[media(801,'Shown Browse','movie'),...Array.from({length:9},(_,i)=>media(802+i,'Trending '+i,i%2?'tv':'movie'))];
async function rpc(name){
 if(name==='cinetracker_home_live_v0997_r3')return{series:[
 {title:'Caught Normal',tmdb_id:102,watched_episodes:8,is_caught_up:true,home_bucket:'continue',latest_released_season_number:2,latest_released_episode_number:8,last_watched_season:1,last_watched_episode:1},
 {title:'Lioness',tmdb_id:101,watched_episodes:21,is_caught_up:true,home_bucket:'up_to_date',latest_released_season_number:3,latest_released_episode_number:5,last_watched_season:3,last_watched_episode:5},
 {title:'Stuart Não Consegue Salvar o Universo',tmdb_id:287620,watched_episodes:6,is_caught_up:true,home_bucket:'up_to_date',latest_released_season_number:1,latest_released_episode_number:6,last_watched_season:1,last_watched_episode:6},
 {title:'WWE Friday Night SmackDown',tmdb_id:1549,watched_episodes:232,is_caught_up:false,home_bucket:'continue',latest_released_season_number:28,latest_released_episode_number:36,last_watched_season:28,last_watched_episode:36},
 {title:'Raw',tmdb_id:4656,watched_episodes:245,is_caught_up:false,home_bucket:'continue',latest_released_season_number:34,latest_released_episode_number:35,last_watched_season:34,last_watched_episode:35}
 ],movie_watchlist:[{title:'Movie Rich',tmdb_id:501,media_type:'movie',poster_path:'/movie.jpg',release_year:2025,runtime_minutes:110,raw_tmdb:{vote_average:8.6,genres:[{name:'Ação'},{name:'Aventura'}]}}],history_movies:[],history_episodes:[]};
 if(name==='cinetracker_profile_media_dashboard_v0991')return[];
 if(name==='cinetracker_watchlist_full_v119')return{rows:watchRows,count:3,counts:{movie:1,series:2}};
 if(name==='cinetracker_calendar_watchlist_v0997')return[media(990,'Calendar','movie',{calendar_date:'2026-10-01'})];
 if(name==='cinetracker_sports_payload_v1')return{sports:[{slug:'soccer',name:'Futebol',icon:'⚽'}],favorites:[{entity_id:33}],stats:{watched_events:48,sports_minutes:6300},events:[{id:1,provider:'p',provider_event_id:'1',sport_slug:'soccer',competition_name:'Liga',competition_id:33,status:'live',starts_at:past.toISOString(),home_name:'A',away_name:'B',home_id:10,away_id:11},{id:2,provider:'p',provider_event_id:'2',sport_slug:'soccer',competition_name:'Liga',status:'scheduled',starts_at:future.toISOString(),home_name:'C',away_name:'D'},{id:3,provider:'p',provider_event_id:'3',sport_slug:'soccer',competition_name:'Liga',status:'finished',starts_at:past.toISOString(),home_name:'E',away_name:'F',has_favorite:true}],watch_history:Array.from({length:48},(_,i)=>({id:100+i,provider:'p',provider_event_id:'h'+i,sport_slug:'soccer',competition_name:'Liga',status:'finished',starts_at:new Date(Date.now()-(i+2)*3600000).toISOString(),title:'Assistido '+i,is_watched:true}))};
 if(name==='cinetracker_sport_stats_v1')return{watched_events:48,sports_minutes:6300};
 if(name==='cinetracker_sport_mark_watched_v1'||name==='cinetracker_sport_toggle_favorite_v1')return{success:true};
 return{};
}
async function api(){return[{media_type:'movie',tmdb_id:801,shown_at:new Date().toISOString()}]}
async function tmdb(path){
 if(path==='/tv/101')return{last_episode_to_air:{season_number:3,episode_number:6,air_date:'2026-09-06'}};
 if(path==='/tv/287620')return{last_episode_to_air:{season_number:1,episode_number:7,air_date:'2026-09-03'}};
 if(path==='/tv/102')return{last_episode_to_air:{season_number:2,episode_number:8,air_date:'2026-08-20'}};
 if(path==='/tv/1549')return{last_episode_to_air:{season_number:28,episode_number:36,air_date:'2026-09-04'},next_episode_to_air:{season_number:28,episode_number:37,air_date:'2026-09-11'}};
 if(path==='/tv/4656')return{last_episode_to_air:{season_number:34,episode_number:35,air_date:'2026-08-31'},next_episode_to_air:{season_number:34,episode_number:36,air_date:'2026-09-07'}};
 if(path==='/movie/501')return{title:'Movie Rich',poster_path:'/movie.jpg',release_date:'2025-01-02',runtime:110,vote_average:8.6,genres:[{name:'Ação'},{name:'Aventura'}]};
 const m=path.match(/^\\/(movie|tv)\\/(\\d+)$/);if(m){const base=watchRows.find(x=>x.tmdb_id===Number(m[2]));return base?{...base,genres:[{name:m[1]==='movie'?'Ação':'Ação e aventura'}]}:{}}
 return{};
}
async function safeTmdb(path,params={}){
 if(path==='/trending/movie/day')return{results:[media(550,'Daily','movie')]};
 if(path==='/trending/all/week'){await new Promise(r=>setTimeout(r,130));return{results:trending}}
 if(path==='/trending/all/day')return{results:trending};
 if(path==='/movie/popular'||path==='/movie/top_rated')return{results:[...freshMovies]};
 if(path==='/tv/popular'||path==='/tv/top_rated')return{results:[...freshTv]};
 if(path==='/discover/movie')return{results:[...freshMovies]};
 if(path==='/discover/tv')return{results:params.with_origin_country==='JP'?[media(780,'Anime Novo','tv',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'})]:[...freshTv]};
 return{results:[]};
}
window.fetch=async url=>{const u=String(url),schedule={MRData:{RaceTable:{Races:[{round:'1',raceName:'GP Teste',date:'2099-09-13',time:'13:00:00Z',Circuit:{circuitName:'Circuito Azul',Location:{locality:'Cidade',country:'Brasil'}}}]}}},drivers={MRData:{StandingsTable:{StandingsLists:[{DriverStandings:[{position:'1',points:'100',Driver:{givenName:'Piloto',familyName:'Um'}}]}]}}},teams={MRData:{StandingsTable:{StandingsLists:[{ConstructorStandings:[{position:'1',points:'150',Constructor:{name:'Equipe Azul'}}]}]}}},last={MRData:{RaceTable:{Races:[{raceName:'Último GP',Results:[]}]}}},data=u.includes('driverstandings')?drivers:u.includes('constructorstandings')?teams:u.includes('last/results')?last:schedule;return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})};
${runtime.replaceAll('</script>','<\\/script>')}
(async()=>{const A=(c,m)=>{if(!c)throw new Error(m)};try{
 await renderHome(navSeq);await new Promise(r=>setTimeout(r,280));
 const cont=document.querySelector('[data-bucket="continue"]').textContent,up=document.querySelector('[data-bucket="up_to_date"]').textContent;
 A(cont.includes('Lioness')&&cont.includes('Stuart'),'real new episodes must Continue');A(!cont.includes('Caught Normal'),'caught backend row must not be forced Continue');A(up.includes('Caught Normal')&&up.includes('SmackDown')&&up.includes('Raw'),'caught/legacy latest watched must be Em dia');
 const movie=document.querySelector('.ct255-home-movie-card');A(movie,'rich Home movie card');const mt=movie.textContent;A(mt.includes('2025')&&mt.includes('Ação')&&mt.includes('★ 8.6')&&mt.includes('110 min'),'movie year genre score runtime');A(movie.querySelector('img'),'movie poster');
 currentRoute='discover';navSeq++;await renderDiscover(navSeq);await new Promise(r=>setTimeout(r,180));A(document.querySelectorAll('[data-ct255-discover-tab]').length===9,'nine Discover tabs');A(document.querySelectorAll('[data-ct255-foryou] .ct255-discover-block').length===3,'three For You blocks');A(document.querySelectorAll('[data-ct255-foryou] .ct255-media-card').length>=5,'For You real cards');A(document.querySelectorAll('[data-ct255-foryou] .ct255-media-poster').length>=5,'For You poster cards');A([...document.querySelectorAll('.ct255-discover-block')].find(x=>x.textContent.includes('Da sua Watchlist'))?.querySelectorAll('.ct255-media-card').length===3,'full Watchlist supplies 3 cards');
 const before=document.querySelectorAll('[data-ct255-discover-content] .ct255-media-card').length;document.querySelector('[data-ct255-discover-tab="trending"]').click();await new Promise(r=>setTimeout(r,20));A(document.querySelectorAll('[data-ct255-discover-content] .ct255-media-card').length===before,'tab switch keeps previous cards while loading');await new Promise(r=>setTimeout(r,180));A(document.querySelectorAll('[data-ct255-discover-content] .ct255-media-card').length>=8,'browse tab must stay populated');A(document.querySelector('[data-ct255-discover-content]').textContent.includes('Shown Browse'),'shown history must not empty normal browse tabs');
 currentRoute='sports';navSeq++;await renderSports(navSeq);await new Promise(r=>setTimeout(r,120));A(document.querySelectorAll('[data-ct255-sport-tab]').length===5,'five Sports tabs');A([...document.querySelectorAll('[data-ct255-sport-tab]')].map(x=>x.textContent).join('|')==='Próximos|Ao vivo|Anteriores|Favoritos|Assistidos','Sports tab order');A(document.querySelectorAll('[data-ct255-f1tab]').length===6,'six F1 tabs');A([...document.querySelectorAll('[data-ct255-f1tab]')].map(x=>x.textContent).join('|')==='Visão geral|Calendário|Classificações|Pilotos|Equipes|Circuitos','F1 approved tabs');A(!document.querySelector('.ct248-f1hub')&&!document.querySelector('.ct248-sports-tabs'),'no legacy Sports/F1 visible');A(document.querySelector('[data-ct255-sports] > .ct255-f1hub'),'F1 inside Sports content');
 document.querySelector('[data-ct255-sport-tab="live"]').click();A(document.querySelectorAll('.ct255-sport-card').length===1,'live filter');document.querySelector('[data-ct255-sport-tab="watched"]').click();A(document.querySelectorAll('.ct255-sport-card').length===48,'watched full history 48');A(document.querySelector('.ct255-sports-feed').textContent.includes('48 assistidos'),'watched count 48');
 currentRoute='profile';navSeq++;window.MutationObserver=undefined;await renderProfile(navSeq);await new Promise(r=>setTimeout(r,50));window.MutationObserver=window.__NativeMO;const pt=document.querySelector('[data-profile]').textContent;A(pt.includes('48'),'Profile 48');A(pt.includes('105h 00min'),'Profile sports time from 6300 minutes');
 await render();const late=document.createElement('div');late.setAttribute('data-seasons','');late.style.width='2000px';document.querySelector('#app').appendChild(late);await new Promise(r=>setTimeout(r,80));A(late.classList.contains('ct255-local-x'),'late-created season rail gets local horizontal scroll');
 document.body.dataset.test='PASS';document.body.insertAdjacentHTML('beforeend','<pre id="result">R255_BROWSER_PASS</pre>')
 }catch(e){document.body.dataset.test='FAIL';document.body.insertAdjacentHTML('beforeend','<pre id="result">R255_BROWSER_FAIL '+String(e&&e.stack||e)+'</pre>')}})();
</script></body>`;
const dir=await mkdtemp(join(tmpdir(),'ct-r255-browser-')),html=join(dir,'index.html');await writeFile(html,harness,'utf8');
let chrome=process.env.CHROME_BIN||'';if(!chrome){for(const c of['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[c],{stdio:'ignore'});chrome=c;break}catch{}}}if(!chrome)throw new Error('Chromium unavailable');
let out='';try{out=execFileSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${join(dir,'profile')}`,'--virtual-time-budget=5000','--dump-dom','file://'+html],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch(e){out=String(e.stdout||'');console.error(String(e.stderr||''))}await rm(dir,{recursive:true,force:true});if(!out.includes('R255_BROWSER_PASS')){console.error(out.slice(-18000));process.exit(1)}console.log('R255_BROWSER_PASS');
