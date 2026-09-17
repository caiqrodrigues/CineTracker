import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r304.mjs');

let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){
  try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
}
if(!bin)throw Error('Chromium unavailable');

const dist=resolve('dist');
const base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>
window.__ct304Errors=[];
addEventListener('error',e=>__ct304Errors.push(String(e.message||e.error||e)));
addEventListener('unhandledrejection',e=>__ct304Errors.push(String(e.reason||e)));
</script>`;

const probe=`<script>
setTimeout(async()=>{try{
  const nav=[],watch=[],seen=[];
  if(!window.__ct304Harness)throw new Error('r304 final-bundle harness unavailable');
  window.__ct304Harness.setGo(path=>{nav.push(String(path));return true});
  window.__ct304Harness.setWatchlist(async(type,id)=>{watch.push(String(type)+':'+Number(id));return true});
  window.__ct304Harness.setSeen(async(type,id)=>{seen.push(String(type)+':'+Number(id));return true});

  const movie=document.createElement('div');
  movie.id='ct304-movie-probe';
  movie.innerHTML='<article id="open-card" class="ct169-related-card ct170-related-card" data-ct169-related-card="movie:123"><button id="rel" class="ct169-related-open" type="button" data-media="movie:123"><span>Relacionado</span></button></article><article id="watch-card" class="ct169-related-card ct170-related-card" data-ct169-related-card="movie:124"><button id="watch" type="button" data-ct169-related-watch="movie:124">Watchlist</button></article><article id="seen-card" class="ct169-related-card ct170-related-card" data-ct169-related-card="movie:125"><button id="seen" type="button" data-ct169-related-seen="movie:125">Visto</button></article><button id="actor" type="button" data-person="999"><span>Ator</span></button>';
  document.body.appendChild(movie);
  const click=id=>movie.querySelector('#'+id).dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
  click('rel');click('watch');click('seen');click('actor');
  await new Promise(r=>setTimeout(r,80));
  const movieActions=nav.filter(x=>x==='/movie/123').length===1&&watch.filter(x=>x==='movie:124').length===1&&seen.filter(x=>x==='movie:125').length===1&&!movie.querySelector('#watch-card')&&!movie.querySelector('#seen-card');
  const actorAction=nav.filter(x=>x==='/person/999').length===1;

  history.replaceState({},'', '/sports');
  const sports=document.createElement('div');
  sports.id='ct304-sports-probe';
  sports.innerHTML='<div data-ct255-sports><section class="ct255-sports-feed">Feed</section><div class="ct255-sports-tabs"><button data-ct255-sport-tab="next">Próximos</button><button data-ct255-sport-tab="previous">Anteriores</button><button data-ct255-sport-tab="favorites">Favoritos</button><button data-ct255-sport-tab="watched">Assistidos</button></div><section class="ct255-f1hub" data-ct255-f1><div class="ct255-f1-tabs"><button data-ct255-f1tab="overview">Visão geral</button><button data-ct255-f1tab="calendar">Calendário</button><button data-ct255-f1tab="drivers">Pilotos</button><button data-ct255-f1tab="stats">Estatísticas</button></div><button type="button" data-ct301-f1-event data-provider="jolpica" data-event-id="2026-1" data-title="GP Teste" data-starts-at="2026-03-01T12:00:00Z" data-venue="Teste" data-country="BR" data-season="2026" data-started="1"><b>1. GP Teste</b><span data-ct301-f1-state>Abrir detalhes</span></button></section><div class="ct255-sport-filters">Filtros</div></div>';
  document.body.appendChild(sports);
  window.__ctR304Test.reconcile304();
  const root=sports.querySelector('[data-ct255-sports]'),first=root.firstElementChild,drivers=!!sports.querySelector('[data-ct255-f1tab="drivers"]'),refresh=!!sports.querySelector('[data-ct304-sports-refresh]'),tabsAfter=first?.nextElementSibling?.classList?.contains('ct255-sports-tabs');
  sports.querySelector('[data-ct301-f1-event]').click();
  await new Promise(r=>setTimeout(r,20));
  const calendarModal=!!document.querySelector('[data-ct301-f1-modal]');
  document.querySelector('[data-ct301-f1-modal]')?.remove();

  history.replaceState({},'', '/profile');
  const profile=document.createElement('div');
  profile.id='ct304-profile-probe';
  profile.innerHTML='<div data-profile><section class="panel" id="stats"><h2>Estatísticas</h2><div class="stat"><b>777</b><small>ESTATISTICA-INTOCAVEL</small></div></section><section id="profileWatchlistGrid"><h2>Watchlist</h2><div><b>12</b><span class="profile-card-arrow">›</span><small>Abrir</small></div></section><section class="panel" id="actors"><h2>Atores mais vistos</h2><div id="actorRail"><article class="actor-card" data-person="1" style="width:80px"><img alt="a"></article><article class="actor-card" data-person="2" style="width:190px"><img alt="b"></article></div></section></div>';
  document.body.appendChild(profile);
  const statsBefore=profile.querySelector('#stats').innerHTML;
  window.__ctR304Test.stabilizeProfile304();
  const statsSame=statsBefore===profile.querySelector('#stats').innerHTML;
  const noOpen=!profile.querySelector('#profileWatchlistGrid .profile-card-arrow')&&!/abrir/i.test(profile.querySelector('#profileWatchlistGrid').textContent);
  const rail=profile.querySelector('#actorRail'),cards=[...profile.querySelectorAll('.actor-card')];
  const actorRail=rail.classList.contains('ct304-actor-rail')&&getComputedStyle(rail).overflowX==='auto';
  const actorEqual=Math.round(cards[0].getBoundingClientRect().width)===Math.round(cards[1].getBoundingClientRect().width);

  history.replaceState({},'', '/discover');
  const discover=document.createElement('main');
  discover.id='viewDiscover';
  discover.innerHTML='<section id="top"><h2>Top 10</h2><div>Itens</div></section>';
  document.body.appendChild(discover);
  window.__ctR304Test.stabilizeTop10304();
  const topCompact=discover.querySelector('#top').classList.contains('ct304-top10-section')&&discover.classList.contains('ct304-discover-compact');

  const tag=document.documentElement.dataset;
  tag.ct304=String(window.__ctR304Final||'');
  tag.ct304movie=String(movieActions);
  tag.ct304actor=String(actorAction);
  tag.ct304sports=String(first?.matches('.ct255-f1hub')&&tabsAfter&&drivers&&refresh);
  tag.ct304calendar=String(calendarModal);
  tag.ct304profile=String(statsSame&&noOpen&&actorRail&&actorEqual);
  tag.ct304top=String(topCompact);
  tag.ct304errors=String(__ct304Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct304probe=String(e?.stack||e)}},3600)
</script>`;

const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html'};
const harness=`window.__ct304Harness={setGo(fn){go=fn},setWatchlist(fn){addWatchlist=fn},setSeen(fn){markSeen=fn}};`;
const server=createServer(async(req,res)=>{
  try{
    const raw=(req.url||'/').split('?')[0];
    if(raw==='/'||raw==='/index.html'){
      res.writeHead(200,{'content-type':mime['.html']});res.end(html);return;
    }
    const p=resolve(dist,raw.replace(/^\/+/,''));
    let body=await readFile(p);
    if(raw==='/app-v304.js'){
      const source=body.toString('utf8');
      if(!source.includes('\nboot();'))throw new Error('r304 browser harness insertion point missing');
      body=Buffer.from(source.replace('\nboot();','\n'+harness+'\nboot();'),'utf8');
    }
    res.writeHead(200,{'content-type':mime[extname(p)]||'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404);res.end('x')}
});
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});

let out='',err='';
try{
  const child=spawn(bin,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=8000','--dump-dom',`http://127.0.0.1:${server.address().port}/`],{stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
  const code=await new Promise((ok,fail)=>{const t=setTimeout(()=>{child.kill('SIGKILL');fail(Error('timeout'))},35000);child.once('close',c=>{clearTimeout(t);ok(c)});child.once('error',fail)});
  if(code!==0)throw Error('chrome '+code+' '+err.slice(-500));
  const tag=out.match(/<html[^>]*>/)?.[0]||'';
  for(const x of ['data-ct304="canonical-clicks+f1-drivers-calendar+sports-sync-order+profile-layout-only"','data-ct304movie="true"','data-ct304actor="true"','data-ct304sports="true"','data-ct304calendar="true"','data-ct304profile="true"','data-ct304top="true"'])if(!tag.includes(x))throw Error('R304_BROWSER missing '+x+' '+tag);
  if((tag.match(/data-ct304errors="([^"]*)"/)?.[1]||''))throw Error('R304_BROWSER page error '+tag);
  if(tag.includes('data-ct304probe='))throw Error('R304_BROWSER probe error '+tag);
  console.log('R304_BROWSER_OK final bundle executes related open/watchlist/seen + actor navigation + F1 Pilotos/calendar + Sports order/refresh + Profile actors/watchlist/stats + compact Top10');
}finally{await new Promise(r=>server.close(r))}
