import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const [p1,p2,p3]=await Promise.all(['apps/web/runtime-r228-v122-web-final-feedback.js','apps/web/runtime-r228b-v122-card-metadata.js','apps/web/runtime-r228c-v122-authority-guards.js'].map(p=>readFile(resolve(root,p),'utf8')));
const patch=[p1,p2,p3].join('\n').replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v122';await mkdir(dir,{recursive:true});
const payload={rows:[
 {media_type:'movie',tmdb_id:11,title:'Filme Um',release_year:2024,genre_ids:[28,53],added_at:'2026-09-08T12:00:00Z'},
 {media_type:'movie',tmdb_id:12,title:'Filme Dois',release_year:2020,genre_ids:[35],added_at:'2026-09-07T12:00:00Z'},
 {media_type:'movie',tmdb_id:0,title:'Inválido',release_year:2019},
 {media_type:'tv',media_kind:'series',tmdb_id:21,title:'Série Um',release_year:2022,genre_ids:[9648],added_at:'2026-09-06T12:00:00Z'}
],counts:{movie:1358,series:564},count:1922};
const pools={movie:[{media_type:'movie',tmdb_id:99,title:'Absolut',release_date:'2025-05-01',genre_ids:[878,53],vote_average:8.1}],series:[],anime:[]};
const html=`<!doctype html><html><head></head><body><div id="app">
<div data-page="discover" data-discover><section id="fresh"><h3>100% novos</h3><div class="slot"><span>Série</span><div id="seriesEmpty" class="ct121-pending-empty">Buscando recomendação…</div></div><article id="movieCard"><span>Filme</span><img src="x.jpg"><b>Absolut</b><small>Filme · ★ 8.1</small><div><button>＋</button><button>↻</button></div></article></section></div>
<div class="event-grid" id="grid"><article id="sport"><div class="fav-actions"><button>Liga</button><button>Time A</button><button>Time B</button></div><button>Ver eventos</button><button data-ct165-open-favorite="1">Ver eventos</button><span role="button">✓ Marcarassistido</span><button>✓ Marcar como assistido</button></article></div>
<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2><button id="collapse">Recolher</button></div></section><button class="stat" data-ct120-watchlist="series"><small>Séries Watchlist</small><b>564</b></button><button class="stat" data-ct120-watchlist="movie"><small>Filmes Watchlist</small><b>1.358</b></button></div>
</div><script>
let profileCache={dashboard:[]};function esc(x){return String(x)} function mediaTmdb(x){return Number(x.tmdb_id||x.id||0)} function mediaType(x){return x.media_type==='movie'?'movie':'tv'} function go(x){window.opened=x}
window.__ctV118LastPools=${JSON.stringify(pools)};window.__ctV121FullWatchlist=async()=>${JSON.stringify(payload)};async function rpc(){return ${JSON.stringify(payload)}};async function safeTmdb(path){if(path==='/movie/99')return {id:99,title:'Absolut',release_date:'2025-05-01',genres:[{id:878,name:'Ficção científica'},{id:53,name:'Suspense'}]};return{}}
// legacy capture listener that must not steal the Watchlist click
let legacyOpened=0;document.addEventListener('click',e=>{if(e.target.closest?.('[data-ct120-watchlist]'))legacyOpened++},true);
// upstream series renderer only replaces exact semantic empty text
setTimeout(()=>{const e=document.querySelector('#seriesEmpty');if(e&&e.textContent.trim()==='Sem item elegível'){const c=document.createElement('article');c.id='seriesCard';c.innerHTML='<span>Série</span><img src="s.jpg"><b>Série Afinidade</b><small>Série · ★ 8.4</small><div><button>＋</button><button>↻</button></div>';e.replaceWith(c)}},250);
// a legacy sports pass tries to reinsert duplicated actions later
setTimeout(()=>{const c=document.querySelector('#sport');if(c){const a=document.createElement('button');a.textContent='Ver eventos';c.appendChild(a);const b=document.createElement('button');b.textContent='✓ Marcar como assistido';c.appendChild(b)}},300);
collapse.addEventListener('click',()=>collapse.textContent=collapse.textContent==='Recolher'?'Expandir':'Recolher');
</script><script>${patch}</script><script>
(async()=>{await new Promise(r=>setTimeout(r,1500));const movie=document.querySelector('#movieCard');document.body.dataset.seriesRendered=String(!!document.querySelector('#seriesCard'));document.body.dataset.stuck=String(!!document.querySelector('.ct121-pending-empty'));document.body.dataset.meta=movie.querySelector('.ct122-card-meta')?.textContent||'';document.body.dataset.movieCount=document.querySelector('[data-ct122-watchlist="movie"] b')?.textContent||'';document.body.dataset.seriesCount=document.querySelector('[data-ct122-watchlist="series"] b')?.textContent||'';const card=document.querySelector('#sport');document.body.dataset.actions=String(card.querySelectorAll('.ct122-action').length);document.body.dataset.events=String([...card.querySelectorAll('.ct122-action')].filter(x=>x.textContent==='Eventos').length);document.body.dataset.watched=String([...card.querySelectorAll('.ct122-action')].filter(x=>/Assistido|Desmarcar/.test(x.textContent)).length);document.body.dataset.legacyOutside=String([...card.querySelectorAll('button,[role="button"]')].filter(x=>!x.closest('.ct122-actions')&&(/evento/i.test(x.textContent)||/assistido/i.test(x.textContent))).length);collapse.click();await new Promise(r=>setTimeout(r,120));document.body.dataset.collapse=collapse.textContent;document.querySelector('[data-ct122-watchlist="series"]').click();await new Promise(r=>setTimeout(r,100));document.body.dataset.modal=String(!!document.querySelector('[data-ct122-watch-modal="series"]'));document.body.dataset.modalCount=document.querySelector('[data-ct122-count]')?.textContent||'';document.body.dataset.legacyOpened=String(legacyOpened);document.body.dataset.done='1'})()
</script></body></html>`;
const file=resolve(dir,'index.html');await writeFile(file,html);
function chrome(){for(const bin of ['google-chrome','chromium','chromium-browser'])try{return execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--window-size=1500,1000','--virtual-time-budget=5000','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch{}return''}
const out=chrome();await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-series-rendered="true"','data-stuck="false"','data-movie-count="2"','data-series-count="1"','data-actions="2"','data-events="1"','data-watched="1"','data-legacy-outside="0"','data-modal="true"','data-modal-count="1"','data-legacy-opened="0"'])if(!out.includes(must))throw new Error('V122 contract missing '+must+'\n'+out.slice(-15000));
if(!/data-meta="2025 · Ficção científica, Suspense"/.test(out))throw new Error('V122 year/genre metadata missing\n'+out.slice(-10000));
if(!(/data-collapse="⌃"/.test(out)||/data-collapse="⌄"/.test(out))||/data-collapse="(?:Recolher|Expandir)"/.test(out))throw new Error('V122 collapse icon not stable');
console.log('V122_BROWSER_OK discover=series-settles+year+genres sports=exact-two-actions profile=exact-renderable-counts legacy-watch-click=neutralized stats=icon-only');
