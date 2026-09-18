import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r311.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct311Errors=[];addEventListener('error',e=>__ct311Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct311Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR311Test;ok(T,'r311 test bridge unavailable');

 // PROFILE: all four controls must become the exact same visual version and stay that way.
 const profile=document.createElement('main');profile.innerHTML='<div data-profile><section class="panel"><h2>Estatísticas</h2><div class="stats"><div class="stat ct299-clickable-stat" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></div><div class="stat ct299-clickable-stat ct301-special" data-ct299-history="stadium"><small>Jogos no Estádio</small><b>1</b><span class="stat-arrow">›</span></div><div class="stat ct300-watchlist-stat ct308-watchlist-stat" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>566</b><span class="open-arrow">Abrir</span></div><div class="stat ct301-watchlist-stat ct309-watchlist-stat" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1362</b><span class="profile-card-arrow">›</span></div></div></section></div>';document.body.appendChild(profile);
 ok(T.unifyProfileStats311(profile.querySelector('[data-profile]')),'Profile unifier failed');
 const stats=[...profile.querySelectorAll('[data-ct311-stat]')];ok(stats.length===4,'not all four Profile controls unified');
 const classSig=stats[0].className;ok(stats.every(x=>x.className===classSig),'Profile controls are not class-identical');
 ok(!profile.querySelector('.stat-arrow,.open-arrow,.profile-card-arrow,.ct300-watchlist-stat,.ct301-watchlist-stat,.ct308-watchlist-stat,.ct309-watchlist-stat'),'legacy Profile visual version survived');
 ok(profile.querySelector('[data-ct299-history="stadium"]'),'stadium click contract was removed');
 ok(profile.querySelector('[data-watchlist-kind="tv"]')&&profile.querySelector('[data-watchlist-kind="movie"]'),'Watchlist click contracts were removed');
 const styles=stats.map(x=>getComputedStyle(x));for(const k of ['display','minHeight','borderRadius','backgroundColor','cursor'])ok(styles.every(s=>s[k]===styles[0][k]),'Profile visual mismatch '+k);
 window.__ctR300Test?.styleWatchlistStats300?.();window.__ctR301Test?.stabilizeProfile301?.();
 await new Promise(r=>setTimeout(r,1300));ok(stats.every(x=>x.className===classSig),'Profile version changed after delayed legacy window');
 profile.remove();

 // DISCOVER: seen + Watchlist are excluded before markup; actions live below, outside media card.
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/poster.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8.4});
 T.setPersonal({seen:['movie:1'],watch:['tv:2']});
 const clean=T.filterPublic311([media(1,'movie','Visto'),media(2,'tv','Watchlist'),media(3,'movie','Elegível')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'seen/watchlist item survived public Discover');
 const d=document.createElement('div');d.innerHTML=T.browseItem311(clean[0]);document.body.appendChild(d);
 const item=d.querySelector('.ct311-browse-item'),card=item.querySelector('.ct288-card'),actions=item.querySelector('.ct311-actions');
 ok(card&&actions&&card.nextElementSibling===actions,'Discover actions are not fixed below media card');
 ok(!card.querySelector('.ct288-state')&&!card.querySelector('.ct310-actions')&&!card.querySelector('.ct309-actions'),'legacy Discover control survived inside card');
 ok(actions.querySelectorAll('[data-ct311-action]').length===2,'Discover must expose Watchlist + Visto');
 ok(actions.querySelector('[data-ct311-action="watchlist"]').textContent.trim()==='+ Watchlist','Watchlist action missing');
 const actionStyle=getComputedStyle(actions);ok(actionStyle.display==='grid','Discover action row is not stable grid');
 const buttons=[...actions.querySelectorAll('.chip')];ok(buttons.every(b=>getComputedStyle(b).position==='static'),'Discover action button is floating/absolute');
 d.remove();

 // F1: clicking a GP must open full race detail and allow independent event/session watch marking.
 let hist=[],calls=[];
 T.setTestBridge({
   loadF1History:async()=>hist,
   loadF1Results:async()=>[{grid:1,position:1,Driver:{givenName:'Lando',familyName:'Norris'},Constructor:{name:'McLaren'},Time:{time:'1:42:00'}}],
   setSportWatch:async p=>{calls.push(p);hist=p.p_watched?[{sport_slug:'formula_1',provider:'jolpica',provider_event_id:p.p_provider_event_id,is_watched:true,starts_at:p.p_starts_at,title:p.p_title}]:[]}
 });
 const race={season:2026,round:8,raceName:'Spanish Grand Prix',date:'2026-05-31',time:'13:00:00Z',Circuit:{circuitName:'Circuit de Barcelona-Catalunya',Location:{locality:'Barcelona',country:'Spain'}},FirstPractice:{date:'2026-05-29',time:'11:30:00Z'},SecondPractice:{date:'2026-05-29',time:'15:00:00Z'},ThirdPractice:{date:'2026-05-30',time:'10:30:00Z'},Qualifying:{date:'2026-05-30',time:'14:00:00Z'}};
 const f=document.createElement('div');f.innerHTML=T.f1Calendar311({season:2026,schedule:[race]});document.body.appendChild(f);
 const raceButton=f.querySelector('[data-ct311-f1-race="2026-8"]');ok(raceButton&&raceButton.textContent.includes('Abrir corrida'),'F1 calendar race is not visibly clickable');
 ok(T.raceCache.has('2026-8'),'F1 visible race lost its complete object before click');
 raceButton.click();await new Promise(r=>setTimeout(r,120));
 const modal=document.querySelector('[data-ct311-f1-modal]');ok(modal,'clicking F1 race did not open modal');
 ok(modal.textContent.includes('Spanish Grand Prix')&&modal.textContent.includes('Fim de semana'),'F1 complete race header/weekend missing');
 ok(modal.querySelectorAll('.ct311-f1-session').length===5,'F1 weekend sessions missing');
 ok(modal.textContent.includes('Grid de Largada')&&modal.textContent.includes('Resultado de Chegada')&&modal.textContent.includes('Lando Norris'),'F1 grid/result detail missing');
 const raceWatch=modal.querySelector('[data-kind="race"]');ok(raceWatch&&!raceWatch.disabled,'race watch action unavailable for completed GP');
 raceWatch.click();await new Promise(r=>setTimeout(r,100));
 ok(calls.length===1&&calls[0].p_provider_event_id==='f1:2026:8:race'&&calls[0].p_watched===true,'race watch did not persist exact session id');
 const refreshed=document.querySelector('[data-ct311-f1-modal] [data-kind="race"]');ok(refreshed?.dataset.watched==='1'&&/Desmarcar/.test(refreshed.textContent),'race watch state did not update');
 document.querySelector('[data-ct311-f1-close]')?.click();f.remove();

 document.documentElement.dataset.ct311done='1';
 document.documentElement.dataset.ct311profile='1';
 document.documentElement.dataset.ct311discover='1';
 document.documentElement.dataset.ct311f1='1';
 document.documentElement.dataset.ct311errors=String(window.__ct311Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct311probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct311Errors||[]) }},3800)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=10000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct311done="1"/.test(out)){const m=out.match(/data-ct311probe="([^"]*)"/);throw new Error('R311_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['profile','discover','f1'])if(!new RegExp('data-ct311'+a+'="1"').test(out))throw new Error('R311_BROWSER missing '+a);
const em=out.match(/data-ct311errors="([^"]*)"/);if(em?.[1])throw new Error('R311_BROWSER page errors '+em[1]);
console.log('R311_BROWSER_OK Profile single version + filtered stable Discover actions + clickable watchable F1 weekend');
