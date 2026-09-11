import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

const runtime=await readFile(new URL('./runtime-r251-ground-truth.js',import.meta.url),'utf8');
const movie=(id,title,score=8.2,genre_ids=[28],extra={})=>({id,title,media_type:'movie',poster_path:'/p.jpg',vote_average:score,release_date:'2024-03-01',genre_ids,...extra});
const tv=(id,name,score=8.3,genre_ids=[10759],extra={})=>({id,name,media_type:'tv',poster_path:'/p.jpg',vote_average:score,first_air_date:'2022-02-02',genre_ids,...extra});
const stubMovies=[movie(101,'Filme Alfa'),movie(102,'WWE WrestleMania'),movie(103,'Drama Puro',8.9,[18]),movie(104,'Filme Beta'),movie(105,'Filme Gama'),movie(106,'Filme Delta')];
const stubTv=[tv(201,'Série Alfa'),tv(202,'WWE SmackDown'),tv(203,'Série Beta'),tv(204,'Série Gama')];
const stubAnime=[tv(301,'Anime Alfa',8.8,[16,10759],{origin_country:['JP'],original_language:'ja'}),tv(302,'Anime Beta',8.4,[16,35],{origin_country:['JP'],original_language:'ja'})];
const newRows=[movie(501,'Novo Filme',8.1,[28],{release_date:'2026-09-05'}),tv(502,'Nova Série',8.2,[10759],{first_air_date:'2026-09-04'}),movie(503,'WWE Royal Rumble',9,[28],{release_date:'2026-09-03'})];
const dash=[
 {...movie(401,'Watch Filme'),tmdb_id:401,is_watchlist:true},
 {...tv(402,'Watch Série'),tmdb_id:402,is_watchlist:true},
 {...tv(403,'Watch Anime',8.4,[16,35],{origin_country:['JP'],original_language:'ja'}),tmdb_id:403,is_watchlist:true},
 {...movie(104,'Filme Beta'),tmdb_id:104,is_seen:true}
];
const sports={events:[
 {id:1,title:'Hoje futuro',starts_at:'2026-09-11T18:00:00Z',status:'scheduled'},
 {id:2,title:'Hoje passado',starts_at:'2026-09-11T10:00:00Z',status:'finished'},
 {id:3,title:'Ontem',starts_at:'2026-09-10T18:00:00Z',status:'finished'},
 {id:4,title:'Quatro dias',starts_at:'2026-09-07T12:00:00Z',status:'finished'},
 {id:5,title:'Favorito',starts_at:'2026-09-12T18:00:00Z',status:'scheduled',has_favorite:true}
],watch_history:[{id:6,title:'Assistido',starts_at:'2026-09-09T18:00:00Z',is_watched:true,status:'finished'}]};
const profile={dashboard:[...dash,{...tv(700,'Série vista'),tmdb_id:700,is_in_progress:true,watched_episodes:3}],stats:{total_minutes:6000,episodes_watched:33,movies_watched:12},series_stats:{completed_series:2,in_progress_series:1},activity:[{day:'2026-09-11',count:2}],favorite_actors:[]};
const harness=`<!doctype html><meta charset="utf-8"><div id="app"></div><script>
let currentRoute='home',navSeq=1,homeCache=null,profileCache=null,user={id:'11111111-1111-1111-1111-111111111111',email:'test@example.com'};
let session={access_token:'x'};let sportsState={tab:'today'},discoverState={tab:'foryou',type:'all'};
const movie=${JSON.stringify(movie.toString())};
const STUB_MOVIES=${JSON.stringify(stubMovies)},STUB_TV=${JSON.stringify(stubTv)},STUB_ANIME=${JSON.stringify(stubAnime)},NEW_ROWS=${JSON.stringify(newRows)},DASH=${JSON.stringify(dash)},SPORTS=${JSON.stringify(sports)},PROFILE=${JSON.stringify(profile)};
function route(){return currentRoute}function setApp(h){document.querySelector('#app').innerHTML=h}function shell(t,s,a,b){return '<div class="app" data-page="'+a+'"><main class="content">'+b+'</main></div>'}function loading(t='Carregando...'){return '<div class="loader">'+t+'</div>'}function fail(t){return '<div class="error">'+t+'</div>'}function tz(){return 'America/Sao_Paulo'}function fmtMinutes(n){return String(n)+' min'}function img(p){return 'https://img.test'+p}function toast(t){window.__toast=t}
async function pages(path,params,type,count){if(params&&params['primary_release_date.gte'])return NEW_ROWS.filter(x=>x.media_type==='movie');if(params&&params['first_air_date.gte'])return NEW_ROWS.filter(x=>x.media_type==='tv');if(params&&params.with_origin_country==='JP')return STUB_ANIME;if(type==='movie')return STUB_MOVIES;if(type==='tv')return STUB_TV;return []}
async function safeTmdb(path){return {results:[...STUB_MOVIES.slice(0,3),...STUB_TV.slice(0,2)]}}
const apiCalls=[];async function api(path,opt={}){apiCalls.push({path,opt});if(path.startsWith('shown_recommendations?'))return [];return []}
const rpcCalls=[];async function rpc(name,body={}){rpcCalls.push({name,body});if(name==='cinetracker_profile_media_dashboard_v0991')return DASH;if(name==='cinetracker_sports_payload_v1')return SPORTS;if(name==='cinetracker_profile_payload_v0997')return PROFILE;if(name==='cinetracker_calendar_watchlist_v0997')return [];if(name==='cinetracker_home_live_v0997_r3')return homeCache||{series:[],movie_watchlist:[],history_movies:[],history_episodes:[]};if(name==='cinetracker_set_episode_watched'||name==='cinetracker_sport_mark_watched_v1')return {ok:true};return []}
function ct176CanonicalPair(row){return row?._pair||null}async function ct176PrimeCanonical(row){return row?._pair||null}
async function renderHome(){} function paintHome(){} async function renderDiscover(){} function paintDiscover(){} async function renderSports(){} function paintSports(){} async function sportsPayload(){} async function renderProfile(){} async function render(){if(currentRoute==='home')return renderHome(navSeq);if(currentRoute==='discover')return renderDiscover(navSeq);if(currentRoute==='sports')return renderSports(navSeq);if(currentRoute==='profile')return renderProfile(navSeq)}
${runtime.replaceAll('</script>','<\\/script>')}
(async()=>{const A=(c,m)=>{if(!c)throw new Error(m)};
 try{
  A(window.__ctR251==='video-ground-truth-direct-renderers','marker');
  const raw={media_id:10,tmdb_id:20,title:'WWE Raw',home_bucket:'continue',watched_episodes:20,last_season:34,last_episode:40,history_missing_episodes:120};
  const oldPair={current:{season_number:2,episode_number:3,air_date:'2010-01-01'}};let r=window.__ctR251Test.applySeries(raw,oldPair,new Date('2026-09-11T15:00:00Z'));A(r.state==='up_to_date'&&raw.home_bucket==='up_to_date','Raw must be Em dia');A(raw._ct251LegacyMissing===120,'historical backlog preserved');
  const newPair={current:{season_number:34,episode_number:41,air_date:'2026-09-10'}};r=window.__ctR251Test.applySeries(raw,newPair,new Date('2026-09-11T15:00:00Z'));A(r.state==='continue'&&raw.home_bucket==='continue','new release must win');
  A(window.__ctR251Test.isWwe({title:'WWE Royal Rumble'})===true,'WWE exclusion');A(window.__ctR251Test.eligiblePublic(STUB_MOVIES[0])===true,'good eligible');A(window.__ctR251Test.eligiblePublic(STUB_MOVIES[2])===false,'pure drama excluded');
  localStorage.setItem('ct:f1hub:collapsed:r251','1');currentRoute='sports';await renderSports(navSeq);A(document.querySelectorAll('[data-ct251-sport-tab]').length===4,'four sports tabs');A(document.querySelectorAll('.ct251-f1hub').length===1,'one F1 hub');A(!/Hoje|Ao vivo|Calendário/.test([...document.querySelectorAll('[data-ct251-sport-tab]')].map(x=>x.textContent).join('|')),'no legacy sports tabs');
  const now=new Date('2026-09-11T15:00:00Z'),filtered=window.__ctR251Test.sportFilter(SPORTS.events,'previous',now);A(filtered.some(x=>x.id===3)&&!filtered.some(x=>x.id===4),'previous 72h');
  currentRoute='profile';await renderProfile(navSeq);A(document.querySelectorAll('[data-ct251-statistics]').length===1,'single stats block');A(document.querySelector('[data-ct251-statistics]').textContent.includes('Esportes assistidos'),'sports stats merged');
  currentRoute='discover';await renderDiscover(navSeq);let text=document.querySelector('[data-ct251-discover-content]').textContent;A(text.includes('Indicação do Dia')&&text.includes('Da sua Watchlist')&&text.includes('100% Novos'),'three For You blocks');A(!text.toLowerCase().includes('wwe'),'WWE absent in For You');A(!text.includes('Drama Puro'),'pure drama absent');
  const keys=[...document.querySelectorAll('[data-ct251-discover-content] [data-media]')].map(x=>x.dataset.media);A(keys.length===new Set(keys).size,'no duplicate media');
  const first=document.querySelector('.ct251-discover-block [data-media]')?.dataset.media||'';document.querySelector('[data-ct251-refresh]').click();await new Promise(r=>setTimeout(r,80));const second=document.querySelector('.ct251-discover-block [data-media]')?.dataset.media||'';A(first&&second&&first!==second,'refresh changes recommendation without reload');
  document.querySelector('[data-ct251-discover-tab="new"]').click();await new Promise(r=>setTimeout(r,80));text=document.querySelector('[data-ct251-discover-content]').textContent;A(text.includes('Novidades'), 'new tab changed content');A(!text.toLowerCase().includes('wwe'),'WWE absent in Novidades');
  A(apiCalls.some(x=>x.path==='shown_recommendations'),'shown recommendations persisted');
  document.body.dataset.test='PASS';document.body.insertAdjacentHTML('beforeend','<pre id="result">R251_BROWSER_PASS</pre>');
 }catch(e){document.body.dataset.test='FAIL';document.body.insertAdjacentHTML('beforeend','<pre id="result">R251_BROWSER_FAIL '+String(e&&e.stack||e)+'</pre>')}
})();
</script>`;
const dir=await mkdtemp(join(tmpdir(),'ct-r251-'));const html=join(dir,'index.html');await writeFile(html,harness,'utf8');
let chrome=process.env.CHROME_BIN||'';if(!chrome){for(const c of['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[c],{stdio:'ignore'});chrome=c;break}catch{}}}if(!chrome)throw new Error('Chromium unavailable');const args=['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${join(dir,'profile')}`,'--virtual-time-budget=4000','--dump-dom','file://'+html];
let out='';try{out=execFileSync(chrome,args,{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch(e){out=String(e.stdout||'');console.error(String(e.stderr||''));}
await rm(dir,{recursive:true,force:true});if(!out.includes('R251_BROWSER_PASS')){console.error(out.slice(-8000));process.exit(1)}console.log('R251_BROWSER_PASS');