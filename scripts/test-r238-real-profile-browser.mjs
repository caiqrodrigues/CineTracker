import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const patch=(await readFile(resolve(root,'apps/web/runtime-r238-real-profile-renderer.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r238-profile',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const fixture=`<!doctype html><html><head><meta charset="utf-8"><style>.stats{display:grid;grid-template-columns:repeat(4,1fr)}.ct-r180-stat-wide{grid-column:span 2}</style></head><body><div id="app"><div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div>placeholder real panel</div></section></div></div><script>
let profileCache={stats:{episodes_watched:15522,movies_watched:1314,total_minutes:100,series_minutes:80,movie_minutes:20},series_stats:{not_started_series:564,watchlist_movies:1358},remaining:{watchlist_series:564,watchlist_movies:1358,watchlist_series_remaining_minutes:60,watchlist_movie_minutes:30}};
let navSeq=7;
function route(){return 'profile'}
function $(s){return document.querySelector(s)}
function esc(x){return String(x)}
function ct166FmtMinutes(x){return 'M'+Number(x||0)}
function ctR180StatsCollapsed(){return false}
function ctR180StatCard(label,value,wide=false){return '<div class="stat '+(wide?'ct-r180-stat-wide':'')+'"><small>'+label+'</small><b>'+value+'</b></div>'}
function ctR180ProfileStats(){throw new Error('old r180 producer should have been replaced')}
function ctR180ProfileButtons(){}
function ctR180EnhanceProfile(d){ctR180ProfileStats(d);ctR180ProfileButtons()}
function profile237(){document.body.dataset.r237Ran='1'}
async function renderProfile(){return true}
</script><script>${patch}</script><script>
setTimeout(()=>{try{
 window.__ctR238ProfileStats(profileCache);
 const panel=document.querySelector('[data-profile] section.panel');
 const cards=[...panel.querySelectorAll('.stat')];
 document.body.dataset.order=cards.map(x=>x.querySelector('small').textContent).join('|');
 document.body.dataset.parents=String(new Set(cards.map(x=>x.parentElement)).size);
 document.body.dataset.wide=cards.filter(x=>x.classList.contains('ct-r180-stat-wide')).map(x=>x.querySelector('small').textContent).join('|');
 document.body.dataset.source=panel.dataset.ct238ProfileOrder||'';
 document.body.dataset.oldOrder=cards.some(x=>x.style.order)?'true':'false';
 document.body.dataset.done='1';
}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}},50);
</script></body></html>`;
await writeFile(file,fixture);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=700','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const expected='Episódios|Filmes|Séries Watchlist|Filmes Watchlist|Tempo em Séries|Tempo em Filmes|Tempo de série em Watchlist|Tempo de filme em Watchlist|Tempo total de tela|Tempo total em Watchlist';
for(const x of ['data-done="1"',`data-order="${expected}"`,'data-parents="1"','data-wide="Tempo total de tela|Tempo total em Watchlist"','data-old-order="false"','data-source="episodes,movies,series-watchlist,movies-watchlist,series-time,movies-time,series-watch-time,movies-watch-time,screen-total,watch-total"'])if(!out.includes(x))throw new Error('R238 browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));
if(out.includes('data-err='))throw new Error('R238 browser runtime error');
console.log('R238_BROWSER_OK real Profile producer physical order');