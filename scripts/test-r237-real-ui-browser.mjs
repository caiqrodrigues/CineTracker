import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r237-real-ui-authority.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r237-real',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const labels=['Episódios','Filmes','Séries Watchlist','Filmes Watchlist','Tempo total de tela','Tempo total em Watchlist','Tempo em Séries','Tempo em Filmes','Tempo de série em Watchlist','Tempo de filmes em Watchlist'];
const fixture=`<!doctype html><html><head><meta charset="utf-8"><style>.stats{display:grid;grid-template-columns:repeat(4,1fr)}</style></head><body><div id="app"><div data-profile><div class="stats">${labels.map((x,i)=>`<button class="stat"><small>${x}</small><b>${i}</b></button>`).join('')}</div></div><div data-page="discover" data-discover><div data-discover-content><div class="row"><article id="disc" class="card ct127-discover-card"></article></div><div class="ct171-top-row"><article id="top" class="card"></article></div></div></div><div data-sports><div class="event-grid"><article id="sport"><button>Eventos</button><button>Ver eventos</button><button>✓ Marcar como assistido</button></article></div></div></div><script>
function paintHome(){} function paintDiscover(){} function paintSports(){} async function renderProfile(){}
window.__ctV127RefreshHome=async()=>true;
</script><script>${patch}</script><script>
setTimeout(()=>{try{
 const cards=[...document.querySelectorAll('[data-profile] .stat')].sort((a,b)=>Number(getComputedStyle(a).order)-Number(getComputedStyle(b).order));document.body.dataset.order=cards.map(x=>x.querySelector('small').textContent).join('|');
 const totals=cards.slice(-2);document.body.dataset.totalSpans=totals.map(x=>getComputedStyle(x).gridColumnEnd==='span 2'||x.style.gridColumn==='span 2').join('|');
 document.body.dataset.discoverLegacy=String(document.querySelector('#disc').classList.contains('ct127-discover-card'));
 document.body.dataset.topClass=String(document.querySelector('#top').className);
 const sb=[...document.querySelectorAll('#sport button')];document.body.dataset.sportCount=String(sb.length);document.body.dataset.sportText=sb.map(x=>x.textContent.trim()).join('|');document.body.dataset.done='1'}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}},500);
</script></body></html>`;
await writeFile(file,fixture);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1800','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const expected='Episódios|Filmes|Séries Watchlist|Filmes Watchlist|Tempo em Séries|Tempo em Filmes|Tempo de série em Watchlist|Tempo de filmes em Watchlist|Tempo total de tela|Tempo total em Watchlist';
for(const x of ['data-done="1"',`data-order="${expected}"`,'data-total-spans="true|true"','data-discover-legacy="false"','data-top-class="card"','data-sport-count="1"','data-sport-text="✓ Assistido"'])if(!out.includes(x))throw new Error('R237 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));if(out.includes('data-err='))throw new Error('R237 browser runtime error');console.log('R237_BROWSER_OK profile+discover+sports');