import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
let patch=(await readFile(resolve(root,'apps/web/runtime-r246-complete-ui-authority.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r246-browser',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const html=`<!doctype html><html><head><style>
body{margin:0}.wide{width:220px}.wide>.inner{width:620px;height:20px}
</style></head><body><div id="app">
<div data-home><article class="ct236-home-episode-pending">Carregando episódio</article></div>
<div data-page="discover" data-discover><div data-discover-content><div class="row"><article class="card" data-media="movie:1">Filme</article></div></div></div>
<div data-sports>
 <div class="tabs"><button data-sport-tab="today">Hoje</button><button data-sport-tab="watched">Velho</button><button data-sport-tab="next">X</button><button data-sport-tab="favorites">Y</button><button data-sport-tab="previous">Z</button></div>
 <div class="event-grid"><article><div class="actions"><button>Eventos</button><button id="watch">Assistido</button></div></article></div>
 <section class="panel" data-ct236-f1-card="1" data-f1-hub><div class="head"><h2>F1 Hub</h2><button data-ct236-f1-toggle>−</button></div><div class="f1Body"><section class="ct236-f1-shell"><div class="ct236-f1-tabs">${[['overview','Visão geral'],['calendar','Calendário'],['next','Próximo GP'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP'],['extra','Extra']].map(([k,l])=>`<button data-ct236-f1-tab="${k}">${l}</button>`).join('')}</div></section></div></section>
</div>
<div data-profile>
 <section class="panel" id="stats"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats"><div class="stat"><small>Episódios</small></div></div></section>
 <section class="panel" id="sportstats"><div class="panel-head"><h2>Estatísticas de esporte</h2></div><div class="stats"><div class="stat" id="games"><small>Jogos assistidos</small></div></div></section>
</div>
<section data-detail><div class="panel"><div class="panel-head"><h2>Temporadas</h2></div><div id="seasons" class="row wide"><div class="inner"></div></div></div></section>
</div>
<script>
window.__audit246=0;window.route=()=> 'home';window.__ctR245AuditStarted=()=>{window.__audit246++};
window.__legacyF1Calls=0;window.__ctR239SetF1Open=(card,open)=>{window.__legacyF1Calls++;if(card)card.dataset.legacyOpen=open?'1':'0'};
</script><script>${patch}</script><script>
(async()=>{try{
 window.__ctR246Reconcile(true);
 await new Promise(r=>setTimeout(r,80));
 const sports=document.querySelector('[data-sports]');
 document.body.dataset.homeAudit=String(window.__audit246>0);
 document.body.dataset.homePendingVisible=String(document.querySelector('.ct236-home-episode-pending').dataset.ct246EpisodeVisible==='1');
 document.body.dataset.discoverStable=document.querySelector('[data-discover]').dataset.ct246Discover||'';
 document.body.dataset.sportTabs=[...sports.querySelectorAll('[data-sport-tab]')].map(x=>x.textContent.trim()).join('|');
 document.body.dataset.sportEventos=String([...sports.querySelectorAll('button')].some(x=>x.textContent.trim()==='Eventos'));
 const watch=document.querySelector('#watch');watch.click();document.body.dataset.watchAnimation=String(watch.classList.contains('ct246-watch-pop'));document.body.dataset.watchClass=String(watch.classList.contains('ct246-sport-watch'));
 const f1=document.querySelector('[data-ct236-f1-card]');window.__ctR246SetF1Open(f1,false);window.__ctR246ApplyF1(f1);
 document.body.dataset.f1Collapsed=String(document.querySelector('.f1Body').hidden===true&&document.querySelector('[data-ct236-f1-toggle]').getAttribute('aria-expanded')==='false');
 document.body.dataset.f1Tabs=[...f1.querySelectorAll('[data-ct236-f1-tab]')].map(x=>x.textContent.trim()).join('|');
 const replacement=f1.cloneNode(true);f1.replaceWith(replacement);replacement.dataset.ct236F1Open='1';window.__ctR246ApplyF1(replacement);document.body.dataset.f1Persisted=String(replacement.querySelector('.f1Body').hidden===true);
 window.__ctR246SetF1Open(replacement,true);document.body.dataset.f1Expanded=String(replacement.querySelector('.f1Body').hidden===false);document.body.dataset.f1Legacy=String(window.__legacyF1Calls>=2);
 window.__ctR246Profile();document.body.dataset.profileOneGroup=String(!document.querySelector('#sportstats')&&document.querySelector('#stats #games')!==null);
 window.__ctR246Horizontal();await new Promise(r=>requestAnimationFrame(()=>r()));document.body.dataset.localX=String(document.querySelector('#seasons').classList.contains('ct246-local-track'));
 document.body.dataset.done='1';
}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}})();
</script></body></html>`;
await writeFile(file,html);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1200','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const must=['data-done="1"','data-home-audit="true"','data-home-pending-visible="true"','data-discover-stable="stable"','data-sport-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-sport-eventos="false"','data-watch-animation="true"','data-watch-class="true"','data-f1-collapsed="true"','data-f1-tabs="Visão geral|Calendário|Próximo GP|Pilotos|Construtores|Último GP"','data-f1-persisted="true"','data-f1-expanded="true"','data-f1-legacy="true"','data-profile-one-group="true"','data-local-x="true"'];
for(const x of must)if(!out.includes(x))throw new Error('R246 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));
if(out.includes('data-err='))throw new Error('R246 browser runtime error '+(out.match(/data-err="[^"]*/)?.[0]||''));
console.log('R246_BROWSER_OK home+discover+sports+f1+profile+local-scrollbars');
