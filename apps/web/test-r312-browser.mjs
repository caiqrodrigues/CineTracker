import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r312.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track='<script>window.__ct312Errors=[];addEventListener("error",e=>__ct312Errors.push(String(e.message||e.error||e)));addEventListener("unhandledrejection",e=>__ct312Errors.push(String(e.reason||e)));</script>';
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR312Test,R=window.__ctR312,B=window.__ctR312R255;
 ok(T&&R&&B,'r312 bridges unavailable');
 ok(typeof window.ct312JwtExpired==='function'&&window.ct312JwtExpired(401,{})&&window.ct312JwtExpired(400,{message:'JWT expired'}),'JWT detector unavailable');

 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8.4});
 const personal={seen:new Set(['movie:1']),watch:new Set(['tv:2'])};
 T.setState({type:'all',personal});
 const clean=T.filterRows312([media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Elegível')],personal,true);
 ok(clean.length===1&&clean[0].tmdb_id===3,'seen/watchlist survived public filter');
 const publicBox=document.createElement('div');publicBox.innerHTML=T.publicMarkup312([media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Título completo sem corte')],'trending',personal,true);document.body.appendChild(publicBox);
 ok(!publicBox.textContent.includes('Já visto')&&!publicBox.textContent.includes('Na Watchlist'),'filtered title rendered');
 const item=publicBox.querySelector('.ct312-item'),card=item?.querySelector('.ct312-media'),actions=item?.querySelector('.ct312-actions');
 ok(card&&actions&&card.nextElementSibling===actions,'actions are not below card');
 ok(actions.querySelectorAll('[data-ct312-action]').length===2,'Watchlist + Visto actions missing');
 const title=publicBox.querySelector('.ct312-copy b'),meta=publicBox.querySelector('.ct312-copy small');
 ok(getComputedStyle(title).whiteSpace==='normal'&&getComputedStyle(title).textOverflow==='clip','title remains clipped');
 ok(getComputedStyle(meta).whiteSpace==='normal'&&getComputedStyle(item).overflow==='visible','legend/meta remains clipped');
 publicBox.remove();

 history.replaceState({},'','/discover');
 T.setTestBridge({personal:async()=>personal,source:async()=>{await new Promise(r=>setTimeout(r,500));return [media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Elegível')]}});
 await R.renderDiscover();
 const root=document.querySelector('[data-ct312-discover]');ok(root,'single-owner Discover shell missing');
 ok(root.querySelectorAll('[data-ct312-tab]').length===8,'canonical tabs missing at first paint');
 const tabPromise=R.loadTab('trending',true);await new Promise(r=>setTimeout(r,150));
 ok(root.querySelectorAll('[data-ct312-tab]').length===8,'tabs disappeared during loading');
 ok(root.querySelector('[data-ct312-content] .ct312-loading'),'content-only loading missing');
 await tabPromise;ok(root.querySelectorAll('[data-ct312-tab]').length===8,'tabs changed after loading');
 ok(root.querySelectorAll('[data-ct312-item]').length===1&&root.textContent.includes('Elegível'),'public content filter not applied after loading');

 const make=(id,type,kind,title)=>({id,tmdb_id:id,media_type:type,media_kind:kind,title,name:title,release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8.5});
 const fy={watchPools:{movie:[make(101,'movie','movie','WM')],series:[make(102,'tv','series','WS')],anime:[make(103,'tv','anime','WA')]},freshPools:{movie:[make(201,'movie','movie','FM')],series:[make(202,'tv','series','FS')],anime:[make(203,'tv','anime','FA')]},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[make(204,'movie','movie','Daily1'),make(205,'movie','movie','Daily2')],dailyIndex:0};
 window.__ctR309Test.setForYouState(fy);T.setState({tab:'foryou'});T.renderForYou312();
 ok(root.querySelectorAll('.ct312-fy-grid').length===2,'For You blocks missing');
 ok(root.querySelectorAll('.ct312-fy-slot').length===6,'For You is not exact 3+3');
 ok(root.querySelector('.ct312-daily-item'),'daily recommendation missing');
 const fyCards=[...root.querySelectorAll('.ct312-foryou .ct312-item')];ok(fyCards.length===7,'For You is not 1+3+3');
 ok(fyCards.every(x=>parseFloat(getComputedStyle(x).width)<=180),'For You cards are giant');
 ok([...root.querySelectorAll('.ct312-foryou .chip')].every(x=>parseFloat(getComputedStyle(x).height)<=32),'For You buttons are giant');

 const originalRoute=window.route;window.route=()=> 'profile';history.replaceState({},'','/profile');
 document.querySelector('#app').innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat ct299-clickable-stat" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></div></div></section><section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small class="ct991-count">0</small></div><div class="row"><article><button data-person="1">Antigo</button></article></div></section></div>';
 T.setTestBridge({stadiumCount:3,actors:async()=>[{id:1,tmdb_person_id:3896,actor_name:'Liam Neeson',profile_path:null,created_at:'2026-09-18T13:23:45Z'}]});
 await R.refreshProfile();
 const stadium=document.querySelector('[data-ct299-history="stadium"]');
 ok(stadium&&stadium.textContent.includes('Jogos no Estádio')&&stadium.textContent.includes('3'),'stadium button not guaranteed');
 ok(stadium.getAttribute('role')==='button'&&stadium.getAttribute('tabindex')==='0','stadium not interactive');
 ok(document.querySelector('[data-person="3896"]')&&document.body.textContent.includes('Liam Neeson'),'new favorite actor not live in Profile');

 const sports=[
  ['soccer','Futebol','⚽'],['formula_1','Fórmula 1','🏎️'],['mma','UFC / MMA','🥊'],['basketball','NBA / Basquete','🏀'],
  ['american_football','NFL / Futebol Americano','🏈'],['ice_hockey','NHL / Hóquei','🏒'],['baseball','Baseball','⚾'],['tennis','Tênis','🎾'],
  ['volleyball','Vôlei','🏐'],['handball','Handebol','🤾'],['rugby','Rugby','🏉'],['motogp','MotoGP','🏍️']
 ].map(([slug,name,icon])=>({slug,name,icon}));
 const now=Date.now(),next=new Date(now+3600000).toISOString(),prev=new Date(now-3600000).toISOString();
 B.sportState.payload={sports,events:[{provider:'x',provider_event_id:'n1',sport_slug:'soccer',title:'Próximo',starts_at:next,status:'scheduled'},{provider:'x',provider_event_id:'p1',sport_slug:'tennis',title:'Anterior',starts_at:prev,status:'finished'}],watch_history:[],favorites:[],stats:{}};
 B.sportState.at=Date.now();B.sportState.tab='next';B.sportState.sport='all';
 B.f1State.data={season:2026,schedule:[],drivers:[],teams:[],last:null,next:null};B.f1State.at=Date.now();B.f1State.tab='overview';
 document.querySelector('#app').innerHTML='<div data-sports><div data-ct255-sports></div></div>';
 R.paintSports();
 let filter=document.querySelector('[data-ct312-sport-filter-row]');ok(filter,'inline Próximos sports filter missing');
 ok(filter.querySelectorAll('[data-ct312-sport]').length===13,'filter does not contain Todos + all 12 system sports');
 for(const s of sports)ok(filter.textContent.includes(s.name),'missing sport '+s.name);
 ok(filter.closest('.panel-head')&&filter.closest('.panel-head').textContent.includes('Próximos'),'filter is not beside Próximos heading');
 B.sportState.tab='previous';R.paintSports();filter=document.querySelector('[data-ct312-sport-filter-row]');ok(filter&&filter.closest('.panel-head').textContent.includes('Anteriores'),'filter is not beside Anteriores heading');
 B.sportState.tab='watched';R.paintSports();ok(!document.querySelector('[data-ct312-sport-filter-row]'),'sports filter leaked outside Próximos/Anteriores');

 const race={season:2026,round:8,raceName:'Spanish Grand Prix',date:'2026-05-31',time:'13:00:00Z',Circuit:{circuitName:'Circuit de Barcelona-Catalunya',Location:{country:'Spain'}},Qualifying:{date:'2026-05-30',time:'14:00:00Z'}};
 B.sportState.tab='next';B.f1State.tab='calendar';B.f1State.data={season:2026,schedule:[race],drivers:[],teams:[],last:race,next:null};B.f1State.at=Date.now();
 window.__ctR311Test.setTestBridge({loadF1History:async()=>[],loadF1Results:async()=>[{grid:1,position:1,Driver:{givenName:'Lando',familyName:'Norris'},Constructor:{name:'McLaren'},Time:{time:'1:42:00'}}],setSportWatch:async()=>{}});
 R.paintSports();await new Promise(r=>setTimeout(r,80));
 const raceBtn=document.querySelector('[data-ct312-f1-race="2026-8"]');ok(raceBtn&&raceBtn.textContent.includes('Abrir corrida'),'actual F1 Calendar producer is not clickable');
 raceBtn.click();await new Promise(r=>setTimeout(r,120));ok(document.querySelector('[data-ct311-f1-modal]'),'F1 race click did not open complete r311 detail');
 document.querySelector('[data-ct311-f1-close]')?.click();

 if(originalRoute)window.route=originalRoute;
 document.documentElement.dataset.ct312done='1';
 document.documentElement.dataset.ct312discover='1';
 document.documentElement.dataset.ct312profile='1';
 document.documentElement.dataset.ct312sports='1';
 document.documentElement.dataset.ct312f1='1';
 document.documentElement.dataset.ct312errors=String(window.__ct312Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct312probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct312Errors||[]) }},4200)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=13000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct312done="1"/.test(out)){const m=out.match(/data-ct312probe="([^"]*)"/);throw new Error('R312_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1800))}
for(const a of ['discover','profile','sports','f1'])if(!new RegExp('data-ct312'+a+'="1"').test(out))throw new Error('R312_BROWSER missing '+a);
const em=out.match(/data-ct312errors="([^"]*)"/);if(em?.[1])throw new Error('R312_BROWSER page errors '+em[1]);
console.log('R312_BROWSER_OK persistent Discover + filtered actions + compact For You + live Profile + all-sports filter + clickable F1');
