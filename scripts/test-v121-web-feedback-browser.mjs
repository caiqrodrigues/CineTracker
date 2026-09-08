import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r227-v121-stable-web-authority.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v121';await mkdir(dir,{recursive:true});
const payload={rows:[
 {media_type:'movie',tmdb_id:11,title:'Filme A',release_year:2024,added_at:'2026-09-08T12:00:00Z',is_watchlist:true},
 {media_type:'tv',tmdb_id:21,title:'Série A',release_year:2022,added_at:'2026-09-07T12:00:00Z',is_watchlist:true}
],counts:{movie:1,series:1},count:2};
const html=`<!doctype html><html><body><div id="app">
<div data-page="discover" data-discover><section><h3>Da sua Watchlist</h3><div id="empty">Sem item elegível</div></section></div>
<div data-sports><div class="event-grid" id="grid"><article id="sport"><div class="fav-actions"><button class="fav">Liga</button><button class="fav">Time A</button><button class="fav">Time B</button></div><button>Ver eventos</button><button data-ct165-open-favorite="1">Ver eventos</button><button>✓ Marcar como assistido</button><span role="button">✓ Marcarassistido</span></article></div></div>
<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2><button id="collapse">Recolher</button></div></section><button class="stat" data-ct120-watchlist="series"><small>Séries Watchlist</small><b>—</b></button><button class="stat" data-ct120-watchlist="movie"><small>Filmes Watchlist</small><b>—</b></button></div>
</div>
<script>
let session={access_token:'expired',refresh_token:'refresh'};let user={};let profileCache={dashboard:[]};let calls=0,refreshes=0,opened='';
function mediaTmdb(x){return x.tmdb_id} function img(){return''} function esc(x){return String(x)} function go(x){opened=x}
async function rpc(name){if(name!=='cinetracker_watchlist_full_v119')throw new Error('unexpected');calls++;if(calls===1)throw new Error('JWT expired');return ${JSON.stringify(payload)}}
async function authRequest(path,body){refreshes++;return{access_token:'fresh',refresh_token:'refresh',user:{id:'u'}}} function saveSession(d){session=d} async function restoreSession(){return false}
function ctR180StatCard(){return''}
collapse.addEventListener('click',()=>{collapse.textContent=collapse.textContent==='Recolher'?'Expandir':'Recolher'});
</script><script>${patch}</script><script>
(async()=>{await new Promise(r=>setTimeout(r,220));document.body.dataset.pending=empty.textContent;document.body.dataset.refreshes=String(refreshes);document.body.dataset.series=document.querySelector('[data-ct121-watchlist="series"] b')?.textContent||'';collapse.click();await new Promise(r=>setTimeout(r,80));document.body.dataset.collapse=collapse.textContent;const card=document.querySelector('#sport');document.body.dataset.actions=String(card.querySelectorAll('.ct121-action').length);document.body.dataset.events=String([...card.querySelectorAll('.ct121-action')].filter(x=>x.textContent==='Eventos').length);document.body.dataset.watched=String([...card.querySelectorAll('.ct121-action')].filter(x=>/Assistido|Desmarcar/.test(x.textContent)).length);document.body.dataset.cols=getComputedStyle(grid).gridTemplateColumns;document.querySelector('[data-ct121-watchlist="series"]').click();await new Promise(r=>setTimeout(r,80));document.body.dataset.modal=String(!!document.querySelector('[data-ct121-watch-modal="series"]'));document.body.dataset.rows=String(document.querySelectorAll('[data-ct121-media]').length);document.body.dataset.done='1'})()
</script></body></html>`;
const file=resolve(dir,'index.html');await writeFile(file,html);
function chrome(){for(const bin of ['google-chrome','chromium','chromium-browser'])try{return execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--window-size=1400,900','--virtual-time-budget=3500','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch{}return''}
const out=chrome();await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-pending="Buscando recomendação…"','data-refreshes="1"','data-series="1"','data-actions="2"','data-events="1"','data-watched="1"','data-modal="true"','data-rows="1"'])if(!out.includes(must))throw new Error('V121 contract missing '+must+'\n'+out.slice(-12000));
if(!(/data-collapse="⌃"/.test(out)||/data-collapse="⌄"/.test(out)))throw new Error('V121 collapse control returned to text\n'+out.slice(-8000));
if(/data-collapse="(?:Recolher|Expandir)"/.test(out))throw new Error('V121 collapse text leaked');
if(/JWT expired/.test(out))throw new Error('JWT error leaked to modal');
console.log('V121_BROWSER_OK foryou=no-premature-empty watchlist=jwt-refresh-retry stats=icon-stable sports=2-actions-grid');
