import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const runtime=(await readFile(resolve(root,'apps/web/runtime-r239-video-ground-truth.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r239-video',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const labels=['Episódios','Filmes','Séries Watchlist','Filmes Watchlist','Tempo em Séries','Tempo em Filmes','Tempo de série em Watchlist','Tempo de filme em Watchlist','Tempo total de tela','Tempo total em Watchlist'];
const fixture=`<!doctype html><html><head><meta charset="utf-8"><style>
:root{--line2:#315f78}.stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.stat{border:1px solid #203f52;background:#08151d;border-radius:12px;padding:10px}.panel{border:1px solid #1d4053;padding:12px}.panel-head{display:flex}.btn{border:1px solid var(--line2);background:#0a1b25;color:#eaf8ff;border-radius:10px;padding:8px 11px}.bad-sport{background:#777;border-radius:0}
</style></head><body><div id="app">
<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats ct-r180-stats-grid ct-r238-profile-grid">${labels.map((x,i)=>`<div class="stat"><small>${x}</small><b>${i}</b></div>`).join('')}</div></section></div>
<div data-page="discover" data-discover><div data-discover-content><section class="panel"><div>Filme</div><div>WWE WrestleMania 33</div></section><section class="panel"><div>Filme</div><div>Série</div><div>Anime</div></section></div></div>
<div data-sports><div class="event-grid"><article id="sport"><div><button class="bad-sport">Eventos</button><button class="bad-sport">Ver eventos</button><button id="watch" class="bad-sport">✓ Marcar como assistido</button></div></article></div>
<section class="panel" id="f1" data-ct236-f1-card data-ct236-f1-open="1"><div id="f1head" class="panel-head"><h2>F1 Hub</h2><button data-ct236-f1-toggle>−</button></div><div id="oldtabs"><button>Visão geral</button><button>Último GP</button><button>Voltas</button><button>Grid de largada</button></div><div id="f1body" class="f1Body"><div class="ct236-f1-shell" id="canonical"><div class="ct236-f1-tabs"><button data-ct236-f1-tab="overview">Visão geral</button><button data-ct236-f1-tab="calendar">Calendário</button><button data-ct236-f1-tab="next">Próximo GP</button><button data-ct236-f1-tab="drivers">Pilotos</button><button data-ct236-f1-tab="constructors">Construtores</button><button data-ct236-f1-tab="last">Último GP</button></div><div data-ct236-f1-panel>Conteúdo canônico</div></div><div id="oldcontent">Conteúdo antigo dirigido pelas abas</div></div></section>
</div><script>
window.discoverState={tab:'foryou'};
function paintDiscover(){document.querySelector('[data-discover-content]').innerHTML='<section class="panel"><div>estrutura corrompida</div></section>'}
function paintSports(){} async function renderProfile(){}
function ct166RenderForYou(){return '<section class="panel discover-section"><div class="panel-head"><h2>Indicação do dia</h2></div><div class="foryou-grid ct166-daily-grid"><div class="foryou-slot ct166-slot"><article class="card">A</article></div></div></section><section class="panel discover-section"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="foryou-grid"><div class="foryou-slot ct166-slot"><div class="empty compact">Sem item elegível</div></div><div class="foryou-slot ct166-slot"><div class="empty compact">Sem item elegível</div></div><div class="foryou-slot ct166-slot"><div class="empty compact">Sem item elegível</div></div></div></section><section class="panel discover-section"><div class="panel-head"><h2>100% novos</h2></div><div class="foryou-grid"><div class="foryou-slot ct166-slot"><article class="card">B</article></div><div class="foryou-slot ct166-slot"><article class="card">C</article></div><div class="foryou-slot ct166-slot"><article class="card">D</article></div></div></section>'}
</script><script>${runtime}</script><script>
paintDiscover({});window.__ctR239Reconcile();setTimeout(()=>{try{
 const grid=document.querySelector('.ct239-profile-grid'),cards=[...grid.children];
 document.body.dataset.profileCols=getComputedStyle(grid).gridTemplateColumns.split(' ').length;
 document.body.dataset.profileOrder=cards.map(x=>x.querySelector('small').textContent).join('|');
 document.body.dataset.profileTotals=cards.slice(-2).map(x=>{const s=getComputedStyle(x);return s.gridColumnStart.includes('span 2')||s.gridColumnEnd.includes('span 2')}).join('|');
 const heads=[...document.querySelectorAll('[data-discover-content]>section.panel .panel-head h2')].map(x=>x.textContent).join('|');document.body.dataset.discoverHeads=heads;
 document.body.dataset.discoverSlot=Math.round(document.querySelector('.ct239-foryou .foryou-slot').getBoundingClientRect().width);
 const watch=document.querySelector('#watch'),ws=getComputedStyle(watch);document.body.dataset.sportButtons=document.querySelectorAll('#sport button').length;document.body.dataset.sportText=watch.textContent.trim();document.body.dataset.sportBg=ws.backgroundColor;document.body.dataset.sportRadius=ws.borderRadius;
 const f1=document.querySelector('#f1'),canonical=document.querySelector('#canonical'),head=document.querySelector('#f1head'),oldtabs=document.querySelector('#oldtabs');document.body.dataset.f1CanonicalTop=String(canonical.previousElementSibling===head);document.body.dataset.f1OldHidden=String(getComputedStyle(oldtabs).display==='none');document.body.dataset.f1CanonicalTabs=canonical.querySelectorAll('[data-ct236-f1-tab]').length;
 window.__ctR239SetF1Open(f1,false);document.body.dataset.f1Collapsed=String([...f1.children].filter(x=>x!==head).every(x=>x.hidden));document.body.dataset.f1Toggle=f1.querySelector('[data-ct236-f1-toggle]').textContent.trim();
 document.body.dataset.done='1'}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}},350)
</script></body></html>`;
await writeFile(file,fixture);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1600','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const expectedOrder=labels.join('|');const must=[
 'data-done="1"','data-profile-cols="4"',`data-profile-order="${expectedOrder}"`,'data-profile-totals="true|true"',
 'data-discover-heads="Indicação do dia|Da sua Watchlist|100% novos"','data-discover-slot="200"',
 'data-sport-buttons="1"','data-sport-text="✓ Assistido"','data-sport-bg="rgb(10, 27, 37)"','data-sport-radius="10px"',
 'data-f1-canonical-top="true"','data-f1-old-hidden="true"','data-f1-canonical-tabs="6"','data-f1-collapsed="true"','data-f1-toggle="+"'
];
for(const x of must)if(!out.includes(x))throw new Error('R239 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));if(out.includes('data-err='))throw new Error('R239 browser runtime error '+(out.match(/data-err="[^"]*/)?.[0]||''));
console.log('R239_BROWSER_OK profile=4+4+2 discover=three-real-sections sports=canonical f1=single+collapse');