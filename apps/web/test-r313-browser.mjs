import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r313.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct313Errors=[];addEventListener('error',e=>__ct313Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct313Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR313Test;ok(T,'r313 test bridge unavailable');

 // DISCOVER: approved shell, hidden minimal type filter and approved card only.
 history.replaceState({},'','/discover');
 T.setDiscover('trending','all');
 const shell=document.createElement('main');shell.innerHTML=T.shellHtml313();document.body.appendChild(shell);
 const types=shell.querySelector('[data-ct313-types]'),toggle=shell.querySelector('[data-ct313-filter]');
 ok(toggle&&types,'minimal Discover filter shell missing');
 ok(types.hidden===true&&getComputedStyle(types).display==='none','Todos/Filmes/Séries must start hidden');
 ok(toggle.getAttribute('aria-expanded')==='false','filter reports open on first paint');
 ok(shell.querySelectorAll('[data-ct263-discover-tab]').length===8,'canonical Discover tabs missing');

 // Click filter through exact r313 authority; no legacy owner may expose it by default.
 document.body.appendChild(shell);toggle.click();await new Promise(r=>setTimeout(r,30));
 ok(types.hidden===false,'compact filter did not open from ☷');
 toggle.click();await new Promise(r=>setTimeout(r,30));
 ok(types.hidden===true,'compact filter did not close');

 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.3,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setPersonal({blocked:['movie:1','tv:2'],aliases:[]});
 const clean=T.filterPublic313([media(1,'movie','Visto'),media(2,'tv','Watchlist'),media(3,'movie','Elegível')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'seen/watchlist survived r313 final barrier');
 const holder=document.createElement('div');holder.innerHTML=T.standardCard313(clean[0],{});document.body.appendChild(holder);
 ok(holder.querySelector('.ct288-card'),'approved ct288 card not rendered');
 ok(!holder.querySelector('.ct312-card'),'r312 custom banner/card returned');
 const item=holder.querySelector('.ct313-item'),actions=holder.querySelector('.ct313-actions');
 ok(item&&actions&&item.querySelector('.ct288-card').nextElementSibling===actions,'actions not fixed below approved card');
 ok(actions.querySelectorAll('[data-ct313-action]').length===2,'Watchlist + Visto missing');
 const copy=holder.querySelector('.ct288-copy');ok(copy,'approved card copy missing');
 const titleStyle=getComputedStyle(copy.querySelector('b')),metaStyle=getComputedStyle(copy.querySelector('small'));
 ok(titleStyle.whiteSpace==='normal'&&titleStyle.overflow==='visible','title still clipped');
 ok(metaStyle.whiteSpace==='normal'&&metaStyle.overflow==='visible','metadata still clipped');
 holder.remove();shell.remove();

 // SPORTS: filter is produced directly by paintSports255, beside Próximos/Anteriores.
 history.replaceState({},'','/sports');
 const sports=document.createElement('main');sports.innerHTML='<div data-ct255-sports></div>';document.body.appendChild(sports);
 window.__ctR312SportsBridge.setState({tab:'next',sport:'all',payload:{sports:[
   {slug:'football',icon:'⚽',name:'Futebol'},
   {slug:'basketball',icon:'🏀',name:'Basquete'},
   {slug:'tennis',icon:'🎾',name:'Tênis'},
   {slug:'volleyball',icon:'🏐',name:'Vôlei'},
   {slug:'formula_1',icon:'🏎️',name:'Fórmula 1'}
 ],events:[],stats:{},watch_history:[],favorites:[]}});
 window.__ctR312SportsBridge.paint();await new Promise(r=>setTimeout(r,40));
 let feed=sports.querySelector('.ct255-sports-feed'),head=feed?.querySelector('.panel-head'),filter=head?.querySelector('[data-ct313-sport-filter]');
 ok(feed&&head&&filter,'Próximos inline sports filter missing from producer first paint');
 ok(!sports.querySelector('.ct255-sport-filters'),'old global sports filter survived');
 ok(filter.closest('.ct313-feed-title')&&filter.previousElementSibling?.tagName==='H2','sports filter is not beside Próximos title');
 ok(filter.querySelectorAll('[data-ct255-sport-filter]').length===6,'Todos + all payload sports not rendered');
 for(const name of ['Futebol','Basquete','Tênis','Vôlei','Fórmula 1'])ok(filter.textContent.includes(name),'missing system sport '+name);

 window.__ctR312SportsBridge.setState({tab:'previous',sport:'all'});window.__ctR312SportsBridge.paint();await new Promise(r=>setTimeout(r,30));
 feed=sports.querySelector('.ct255-sports-feed');filter=feed?.querySelector('[data-ct313-sport-filter]');
 ok(filter&&feed.querySelector('h2')?.textContent.trim()==='Anteriores','Anteriores inline sports filter missing');
 window.__ctR312SportsBridge.setState({tab:'watched'});window.__ctR312SportsBridge.paint();await new Promise(r=>setTimeout(r,30));
 ok(!sports.querySelector('[data-ct313-sport-filter]'),'inline sports filter leaked into Assistidos');
 sports.remove();

 // PROFILE: a single canonical renderer/style must survive old delayed repaint windows.
 history.replaceState({},'','/profile');
 const profile=document.createElement('main');profile.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><button class="stat old-events" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></button></div></section><section class="panel"><div class="stats"><button class="stat old-tv" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>500</b><span class="open-arrow">Abrir</span></button><button class="stat old-movie" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1000</b><span class="stat-arrow">›</span></button></div></section></div>';document.body.appendChild(profile);
 const root=profile.querySelector('[data-profile]');
 ok(T.canonicalStats313(root,3),'canonical Profile stats failed');
 const labels=['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist'];
 const cards=labels.map(label=>[...root.querySelectorAll('.stat,[data-stat],button')].find(x=>x.textContent.includes(label)));
 ok(cards.every(Boolean),'one of four canonical Profile cards missing');
 const sig=cards[0].className;ok(cards.every(x=>x.className===sig),'Profile stat cards are not one visual version');
 ok(cards[1].dataset.ct299History==='stadium','Jogos no Estádio is not clickable');
 ok(!root.querySelector('.open-arrow,.stat-arrow,.profile-card-arrow'),'legacy Profile arrows survived');
 const before=root.innerHTML;
 // invoke known old style functions and wait beyond legacy timer windows; r313 CSS/renderer must remain stable.
 try{window.__ctR300Test?.styleWatchlistStats300?.()}catch{};try{window.__ctR301Test?.stabilizeProfile301?.()}catch{};
 await new Promise(r=>setTimeout(r,1550));
 const afterCards=labels.map(label=>[...root.querySelectorAll('.stat,[data-stat],button')].find(x=>x.textContent.includes(label)));
 ok(afterCards.every(Boolean),'Profile card disappeared after legacy window');
 ok(afterCards.every(x=>x.className===sig),'Profile switched visual version after 1.55s');
 ok(!root.querySelector('.open-arrow,.stat-arrow,.profile-card-arrow'),'Profile legacy icon returned after delayed window');
 profile.remove();

 // Auth/F1 preservation.
 ok(T.jwtExpired313(new Error('JWT expired'))===true,'JWT expired detector lost');
 ok(T.jwtExpired313(new Error('ordinary failure'))===false,'ordinary error misclassified');
 ok(window.__ctR311&&typeof window.__ctR311.openRace==='function','r311 clickable F1 owner lost');

 document.documentElement.dataset.ct313done='1';
 document.documentElement.dataset.ct313discover='1';
 document.documentElement.dataset.ct313sports='1';
 document.documentElement.dataset.ct313profile='1';
 document.documentElement.dataset.ct313auth='1';
 document.documentElement.dataset.ct313f1='1';
 document.documentElement.dataset.ct313errors=String(window.__ct313Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct313probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct313Errors||[]) }},4200)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=11500','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct313done="1"/.test(out)){const m=out.match(/data-ct313probe="([^"]*)"/);throw new Error('R313_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1600))}
for(const a of ['discover','sports','profile','auth','f1'])if(!new RegExp('data-ct313'+a+'="1"').test(out))throw new Error('R313_BROWSER missing '+a);
const em=out.match(/data-ct313errors="([^"]*)"/);if(em?.[1])throw new Error('R313_BROWSER page errors '+em[1]);
console.log('R313_BROWSER_OK hidden Discover filter + approved card + producer Sports filter + stable Profile');
