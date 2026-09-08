import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r222-v116-final-dom-watchlist-f1-modal.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v116-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
let discoverState={tab:'foryou'},ct166SwapIndex={},oldModalCalls=0;
function route(){return'discover'} function mediaTmdb(x){return Number(x.tmdb_id||x.id||0)} function mediaPoster(x){return x.poster_path||x.raw_tmdb?.poster_path||null}
function dashboardCard162(x){return {...x,id:x.tmdb_id}} function discoverCard158(x){return '<article data-title="'+x.title+'" data-media="'+x.media_type+':'+x.tmdb_id+'">'+x.title+'</article>'}
function ct166Slot(label,x,key,count){return '<div class="foryou-slot ct166-slot" data-key="'+key+'"><small>'+label+'</small>'+(x?discoverCard158(x):'<div class="empty compact">Sem item elegível</div>')+'</div>'}
function esc(x){return String(x)} function shiftDays(n){const d=new Date('2026-09-08T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
async function rpc(name,args){if(name==='cinetracker_watchlist_candidates_v116')return{rows:[
 {tmdb_id:11,media_type:'movie',media_kind:'movie',title:'Movie WL',poster_path:'/m.jpg',is_watchlist:true},
 {tmdb_id:22,media_type:'tv',media_kind:'series',title:'Series WL',poster_path:'/s.jpg',is_watchlist:true},
 {tmdb_id:33,media_type:'tv',media_kind:'anime',title:'Anime WL',poster_path:'/a.jpg',is_watchlist:true}
],count:3};if(name==='cinetracker_sport_favorite_events_v2')return{favorite:{name:'Fórmula 1',sport_slug:'formula_1',entity_type:'competition'},events:[{title:'OLD PRACTICE ONLY',starts_at:'2026-09-05T10:00:00Z'}]};return{}}
async function edge(name,args){if(name==='cinetracker-f1-v1')return{races:[{round:'16',raceName:'Italian Grand Prix',date:'2026-09-13',time:'13:00:00Z',Circuit:{circuitName:'Monza'},FirstPractice:{date:'2026-09-11',time:'11:30:00Z'},Qualifying:{date:'2026-09-12',time:'14:00:00Z'}}]};return{}}
async function tmdb(){return{}} async function addWatchlist(){return true} function paintDiscover(){} async function renderDiscover(){}
async function ct165OpenFavorite(){oldModalCalls++;}
</script>`;
const html=`<!doctype html><html><body><div id="app"><div data-page="discover"><div data-discover-content><section><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="foryou-grid"><div>Sem item elegível</div><div>Sem item elegível</div><div>Sem item elegível</div></div></section></div></div></div>${pre}<script>${patch}</script><script>(async()=>{try{await window.__ctV116HydrateWatchlist(true);const sec=document.querySelector('section');document.body.dataset.watch=sec.dataset.ct116Watchlist||'';document.body.dataset.counts=sec.dataset.ct116Counts||'';document.body.dataset.movie=String(!!document.querySelector('[data-title="Movie WL"]'));document.body.dataset.series=String(!!document.querySelector('[data-title="Series WL"]'));document.body.dataset.anime=String(!!document.querySelector('[data-title="Anime WL"]'));await ct165OpenFavorite(99);const modal=document.querySelector('[data-ct116-f1-modal="direct-session-authority"]');document.body.dataset.f1=String(!!modal);document.body.dataset.qual=String((modal?.textContent||'').includes('Classificação'));document.body.dataset.race=String((modal?.textContent||'').includes('Corrida'));document.body.dataset.old=String((modal?.textContent||'').includes('OLD PRACTICE ONLY')||oldModalCalls>0)}catch(e){document.body.dataset.err=String(e.message||e)}finally{document.body.dataset.done='1'}})()</script></body></html>`;
await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=2500','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-watch="direct-final-dom"','data-counts="1,1,1"','data-movie="true"','data-series="true"','data-anime="true"','data-f1="true"','data-qual="true"','data-race="true"','data-old="false"'])if(!out.includes(must))throw new Error('V116 authority contract missing '+must+'\n'+out.slice(-9000));
if(out.includes('data-err='))throw new Error('V116 browser runtime error');
console.log('V116_BROWSER_OK watchlist=direct-rpc-final-dom movie+series+anime f1-modal=direct qualifying+race old-feed=bypassed');
