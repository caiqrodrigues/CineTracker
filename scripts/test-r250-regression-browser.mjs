import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),runtime=(await readFile(resolve(root,'apps/web/runtime-r250-source-aligned.js'),'utf8')).replaceAll('</script>','<\\/script>');
if(runtime.includes('new MutationObserver'))throw new Error('r250 runtime must not use MutationObserver');
const dir='/tmp/ct-r250-regression';await mkdir(dir,{recursive:true});let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
try{
 const html=resolve(dir,'index.html');
 await writeFile(html,`<!doctype html><html><head><meta charset="utf-8"><style>
 html,body{margin:0;max-width:100%;overflow-x:clip}.ct250-xrail{overflow-x:auto!important;width:120px!important;max-width:120px!important}.wide{width:520px;height:8px}.event-grid{display:grid}.panel{padding:4px}.thumbCard{display:block}.ct248-f1hub{display:block}
 </style></head><body>
 <div id="p-home" data-home><div class="thumbCard" data-media-id="91"><small class="homeMeta">Filme</small></div></div>
 <div id="p-discover" data-page="discover"><div class="tabs"><button data-discover-tab="foryou">Pra você</button><button id="new-tab" data-discover-tab="new">Novidades</button></div><div data-discover-content id="discover-content"></div></div>
 <div id="p-sports" data-page="sports"><button>Eventos</button><div class="event-grid"></div></div>
 <div class="ct248-f1hub" id="f1-main"><button data-ct248-f1collapse>Minimizar</button><div class="ct248-f1body">F1 canonical</div><nav><button>Visão geral</button><button>Calendário</button><button>Próximo GP</button><button>Pilotos</button><button>Construtores</button><button>Último GP</button></nav></div>
 <div class="ct249-f1hub" id="f1-duplicate"><div class="ct249-f1body">F1 duplicate</div></div>
 <div id="p-profile" data-profile><section class="panel" id="stats-main"><h2>Estatísticas</h2><div class="stats"><div class="stat" id="stat-main">Filmes</div></div></section><section class="panel" id="sport-stats"><h2>Estatística de esporte</h2><div class="stat" id="stat-sport">Esportes</div></section></div>
 <div class="seasons" id="seasons"><div class="wide"></div></div>
 <script>
 window.__errors=[];addEventListener('error',e=>__errors.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__errors.push(String(e.reason)));
 localStorage.setItem('ct:f1hub:collapsed:r250','1');
 const iso=(days,hours=12)=>{const d=new Date();d.setDate(d.getDate()+days);d.setHours(hours,0,0,0);return d.toISOString()};
 var homeCache={movies:[{media_id:91,vote_average:8.4}],series:[
  {media_id:10,title:'Raw',last_watched_season:10,last_watched_episode:10,history_missing_episodes:1181,home_bucket:'continue',is_caught_up:false},
  {media_id:20,title:'Lioness',last_watched_season:3,last_watched_episode:5,history_missing_episodes:3,home_bucket:'caught_up',is_caught_up:true}
 ]};
 var route=()=> 'home';var ct175SchedulePaint=()=>{};
 var ct176CanonicalPair=row=>row.media_id===10?{queue:[{season_number:1,episode_number:1,air_date:iso(-900)}],current:{season_number:1,episode_number:1,air_date:iso(-900)}}:{queue:[{season_number:1,episode_number:2,air_date:iso(-400)},{season_number:3,episode_number:6,air_date:iso(0)}],current:{season_number:1,episode_number:2,air_date:iso(-400)}};
 var paintHome=()=>{};
 var discoverState={tab:'foryou',type:'all',page:0};
 var exclusionContext=async()=>({dash:[{tmdb_id:1,media_type:'movie',state:'AlreadySeen'}]});
 var discoverRows=async tab=>{await new Promise(r=>setTimeout(r,tab==='foryou'?420:45));return tab==='new'?[{tmdb_id:1,media_type:'movie',title:'Bloqueado'},{tmdb_id:2,media_type:'movie',title:'Elegível'}]:[{tmdb_id:3,media_type:'movie',title:'Antigo'}]};
 var paintDiscover=rows=>{document.getElementById('discover-content').innerHTML=rows.map(x=>'<article class="card" data-tmdb-id="'+x.tmdb_id+'">'+x.title+'</article>').join('')+'<article class="card">Sem item elegível</article>'};
 var renderDiscover=async()=>{};
 var sportsState={tab:'next',page:0};window.__rpcNames=[];
 var rpc=async(name,args)=>{__rpcNames.push(name);if(name==='cinetracker_sports_payload_v1')return {events:[
   {id:101,title:'Hoje futuro',starts_at:iso(0,23),has_favorite:false,is_watched:false},
   {id:102,title:'Ontem',starts_at:iso(-1,20),has_favorite:false,is_watched:false},
   {id:103,title:'Quatro dias',starts_at:iso(-4,20),has_favorite:false,is_watched:false},
   {id:104,title:'Favorito',starts_at:iso(0,22),has_favorite:true,is_watched:false}
  ],watch_history:[{id:105,title:'Assistido antigo',starts_at:iso(-10,20),is_watched:true,sport_watched_at:iso(-10,21)}]};
  if(name==='cinetracker_sport_mark_watched_v1')return {event_id:args.p_event_id,is_watched:args.p_watched};return []};
 var sportsPayload=async()=>[];
 var renderSports=async()=>{const rows=await sportsPayload();document.querySelector('#p-sports .event-grid').innerHTML=rows.map(e=>'<article class="event-card" data-event-id="'+e.id+'"><b>'+e.title+'</b><button>'+(e.is_watched?'Desmarcar assistido':'Assistido')+'</button></article>').join('');return rows};
 </script><script>${runtime}</script><script>
 const stale=window.__ctR250DiscoverContentOnly();setTimeout(()=>document.getElementById('new-tab').click(),20);
 setTimeout(async()=>{await renderSports();window.__initialF1Hidden=document.querySelector('#f1-main .ct248-f1body')?.hidden===true;document.querySelector('#f1-main [data-ct248-f1collapse]')?.click()},550);
 setTimeout(()=>{const previous=[...document.querySelectorAll('[data-ct250-sport-tab]')].find(x=>x.textContent.trim()==='Anteriores');previous?.click()},1000);
 setTimeout(()=>{window.__previousCards=[...document.querySelectorAll('#p-sports .event-card')].map(x=>x.dataset.eventId).join('|');const next=[...document.querySelectorAll('[data-ct250-sport-tab]')].find(x=>x.textContent.trim()==='Próximos');next?.click()},1550);
 setTimeout(()=>document.querySelector('#p-sports .event-card button')?.click(),2150);
 setTimeout(()=>{
   const raw=homeCache.series[0],lioness=homeCache.series[1],tabs=[...document.querySelectorAll('[data-ct250-sport-tab]')].map(x=>x.textContent.trim()).join('|');
   document.body.dataset.done='1';document.body.dataset.marker=String(window.__ctR250||'');
   document.body.dataset.raw=raw.home_bucket+'|'+raw.history_missing_episodes+'|'+raw._ct250HistoricalMissingEpisodes;
   document.body.dataset.lioness=lioness.home_bucket+'|'+lioness.history_missing_episodes+'|'+String(lioness._ct250CurrentEpisode?.episode_number||'');
   document.body.dataset.rating=document.querySelector('.ct250-rating')?.textContent||'';
   document.body.dataset.discover=document.getElementById('discover-content').textContent.replace(/\s+/g,' ').trim();document.body.dataset.dropped=String(window.__ctR250DiscoverDropped||0);
   document.body.dataset.tabs=tabs;document.body.dataset.previous=String(window.__previousCards||'');document.body.dataset.legacySport=String([...document.querySelectorAll('#p-sports button')].some(x=>/eventos|agenda/i.test(x.textContent)));
   document.body.dataset.payloadRpc=String(__rpcNames.includes('cinetracker_sports_payload_v1'));document.body.dataset.watchRpc=String(__rpcNames.includes('cinetracker_sport_mark_watched_v1'));
   document.body.dataset.f1Count=String(document.querySelectorAll('.ct250-f1hub').length);document.body.dataset.f1InitialHidden=String(!!window.__initialF1Hidden);document.body.dataset.f1Open=String(document.querySelector('#f1-main .ct248-f1body')?.hidden===false);document.body.dataset.f1Stored=localStorage.getItem('ct:f1hub:collapsed:r250')||'';
   document.body.dataset.profile=String(!!document.querySelector('#stats-main #stat-sport')&&!document.getElementById('sport-stats'));
   const seasons=document.getElementById('seasons');document.body.dataset.localX=String(seasons.classList.contains('ct250-xrail')&&seasons.scrollWidth>seasons.clientWidth);document.body.dataset.globalX=String(document.documentElement.scrollWidth<=document.documentElement.clientWidth);
   document.body.dataset.errors=__errors.join('|');
 },3900);
 </script></body></html>`,'utf8');
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--virtual-time-budget=4800','--dump-dom','file://'+html],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});
 const must=x=>{if(!out.includes(x))throw new Error('R250 browser missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''))};
 for(const x of [
  'data-done="1"','data-marker="source-aligned-deterministic-ui"','data-raw="caught_up|0|1181"','data-lioness="continue|1|6"','data-rating="★ 8.4 · 84%"',
  'data-discover="Elegível"','data-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-previous="102"','data-legacy-sport="false"','data-payload-rpc="true"','data-watch-rpc="true"',
  'data-f1-count="1"','data-f1-initial-hidden="true"','data-f1-open="true"','data-f1-stored="0"','data-profile="true"','data-local-x="true"','data-global-x="true"'
 ])must(x);
 const dropped=Number((out.match(/data-dropped="(\d+)"/)||[])[1]||0);if(dropped<1)throw new Error('R250 did not reject stale Discover request');
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R250 browser errors '+errors);
 console.log('R250_BROWSER_OK home=current-frontier discover=owned sports=canonical-four-tabs watched=rpc f1=single-persisted profile=merged scroll=local');
}finally{await rm(dir,{recursive:true,force:true})}
