import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const r259=await readFile(new URL('./runtime-r259-fast-home-discover.js',import.meta.url),'utf8');
const r260=await readFile(new URL('./runtime-r260-ux-recovery.js',import.meta.url),'utf8');
const css=await readFile(new URL('./dist/app-v260.css',import.meta.url),'utf8');
const tiny='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function page(width){
return `<!doctype html><meta charset="utf-8"><style>${css.replaceAll('</style>','<\\/style>')}#app,.content{width:${width-28}px!important;max-width:${width-28}px!important}</style><body><div id="app"></div><script>
let currentRoute='home',navSeq=1,homeCache=null,renderHome=async()=>{},renderDiscover=async()=>{};
function route(){return currentRoute} function loading(s){return '<div class="loader">'+s+'</div>'} function fail(s){return '<div class="error">'+s+'</div>'}
function shell(t,s,r,b){return '<div class="app" data-page="'+r+'"><main class="content"><h1>'+t+'</h1>'+b+'</main></div>'}
function setApp(h){document.querySelector('#app').innerHTML=h}
function label(r){const s=Number(r.next_season_number||0),e=Number(r.next_episode_number||0);return s&&e?'S'+String(s).padStart(2,'0')+'E'+String(e).padStart(2,'0'):'—'}
function paintHome(){const h=document.querySelector('[data-home]');if(!h)return;h.innerHTML='<section data-bucket="continue"><h2>Assistir a seguir</h2>'+((homeCache?.series||[]).filter(x=>x.home_bucket==='continue').map(r=>'<article class="home-card" data-media="tv:'+r.tmdb_id+'"><b>'+r.title+'</b><small>'+label(r)+'</small></article>').join('')||'<div class="empty">vazio</div>')+'</section>'}
const calls=[];async function rpc(name,args={}){calls.push(name);if(name==='cinetracker_profile_home_payload_v0997_r5'){await new Promise(r=>setTimeout(r,520));return{series:[{title:'Stuart Não Consegue Salvar o Universo',tmdb_id:287620,home_bucket:'continue',watched_episodes:6,released_episodes:8,history_missing_episodes:2,last_watched_at:'2026-09-10T12:00:00Z'}],movie_watchlist:[],history_episodes:[],history_movies:[]}}if(name==='cinetracker_recommendation_state_v108')return{hard_excluded:[],fresh_excluded:[],watchlist:[]};if(name==='cinetracker_series_episode_state_v1')return{episodes:[]};return{}}
function item(id,type='movie'){return{id,tmdb_id:id,media_type:type,title:type==='movie'?'Filme '+id:undefined,name:type==='tv'?'Série '+id:undefined,poster_path:'/p'+id+'.jpg',release_date:'2026-09-10',first_air_date:'2026-09-10',vote_average:8.7,genre_ids:[28,12]}}
let tmdbBaseCalls=0;async function tmdb(path,params={}){tmdbBaseCalls++;if(/^\\/tv\\/\\d+/.test(path))return{status:'Returning Series',last_episode_to_air:{season_number:1,episode_number:1},episodes:[]};return{results:Array.from({length:20},(_,i)=>item(2000+i,i%2?'tv':'movie'))}}
function img(){return '${tiny}'}
${r259.replaceAll('</script>','<\\/script>')}
${r260.replaceAll('</script>','<\\/script>')}
(async()=>{const A=(c,m)=>{if(!c)throw new Error(m)};try{
 localStorage.clear();sessionStorage.clear();homeCache=null;currentRoute='home';navSeq++;
 const cold=renderHome(navSeq);await sleep(35);A(document.querySelector('.ct260-home-skeleton'),'cold Home must show lightweight skeleton instead of blank/loader');await cold;
 A(document.querySelector('[data-home]').textContent.includes('Stuart'),'cold Home canonical payload missing');
 A(sessionStorage.getItem('ct-home-first-page-v260'),'Home first-page cache was not persisted');
 homeCache=null;currentRoute='home';navSeq++;const t0=performance.now();await renderHome(navSeq);const cachedMs=performance.now()-t0;
 A(cachedMs<120,'cached Assistir a seguir did not paint instantly '+cachedMs+'ms');A(document.querySelector('[data-home]').textContent.includes('Stuart'),'cached Home missing');
 const before=tmdbBaseCalls;await tmdb('/tv/999');await tmdb('/tv/999');A(tmdbBaseCalls===before+1,'TMDB metadata cache did not collapse repeated detail calls');

 currentRoute='discover';navSeq++;await renderDiscover(navSeq);await sleep(650);
 const card=document.querySelector('.ct259-media-card'),poster=document.querySelector('.ct259-media-poster');A(card&&poster,'Discover cards missing');
 const cw=parseFloat(getComputedStyle(card).width),rect=poster.getBoundingClientRect(),expected=${width<=700?154:176};
 A(Math.abs(cw-expected)<1.5,'Discover card width '+cw+' expected '+expected);
 A(Math.abs(rect.width/rect.height-2/3)<0.035,'Discover poster ratio must be 2:3');

 currentRoute='series';setApp(shell('Série','','series','<div class="modal"><section><h2>Temporadas</h2><div class="season-row">'+Array.from({length:10},(_,i)=>'<div style="width:170px;height:70px">T'+i+'</div>').join('')+'</div></section><section><h2>Melhores e piores por temporada</h2><div class="ct169-season-chart-carousel">'+Array.from({length:6},(_,i)=>'<div style="width:250px;height:100px">G'+i+'</div>').join('')+'</div></section><section><h2>Elenco e Atores</h2><div class="cast-row">'+Array.from({length:10},(_,i)=>'<div style="width:130px;height:90px">A'+i+'</div>').join('')+'</div></section><section><h2>Títulos Relacionados</h2><div class="related-row">'+Array.from({length:8},(_,i)=>'<div style="width:160px;height:100px">R'+i+'</div>').join('')+'</div></section></div>'));await sleep(320);
 const rails=[...document.querySelectorAll('[data-ct260-x]')];A(rails.length>=4,'modal needs isolated rails for seasons/chart/cast/related: '+rails.length);
 for(const rail of rails){const s=getComputedStyle(rail);A(s.overflowX==='auto','rail overflow must be auto');A(s.touchAction.includes('pan-x'),'rail must expose native pan-x');for(const c of ['flex','overflow-x-auto','scrollbar-thin','whitespace-nowrap','touch-pan-x','flex-nowrap'])A(rail.classList.contains(c),'missing requested class '+c)}
 A(document.documentElement.scrollWidth<=document.documentElement.clientWidth+1,'horizontal overflow leaked to window/body');
 const rail=rails[0];rail.scrollLeft=0;const child=rail.firstElementChild;child.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:7,pointerType:'mouse',clientX:210,button:0}));child.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:7,pointerType:'mouse',clientX:80,button:0}));child.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:7,pointerType:'mouse',clientX:80,button:0}));A(rail.scrollLeft>60,'mouse drag did not change local scrollLeft '+rail.scrollLeft);
 A(!window.__ctR260RailObserverActive,'r260 must not install persistent observer');
 document.body.dataset.test='PASS';document.body.insertAdjacentHTML('beforeend','<pre id="r260-result">R260_BROWSER_PASS width=${width} cache='+Math.round(cachedMs)+'ms</pre>');
}catch(e){document.body.dataset.test='FAIL';document.body.insertAdjacentHTML('beforeend','<pre id="r260-result">R260_BROWSER_FAIL '+String(e&&e.stack||e)+'</pre>')}})();
</script></body>`}
let chrome=process.env.CHROME_BIN||'';if(!chrome){for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});chrome=c;break}catch{}}if(!chrome)throw new Error('Chromium unavailable');
for(const width of [420,1200]){const dir=await mkdtemp(join(tmpdir(),'ct-r260-browser-')),html=join(dir,'index.html');try{await writeFile(html,page(width),'utf8');const out=execFileSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${join(dir,'profile')}`,`--window-size=${width},1500`,'--virtual-time-budget=5200','--dump-dom','file://'+html],{encoding:'utf8',timeout:35000,stdio:['ignore','pipe','pipe']});const result=(out.match(/<pre id="r260-result">([^<]*)<\/pre>/)||[])[1]||'';if(!out.includes('data-test="PASS"'))throw new Error(result||('R260 browser did not pass width '+width));console.log(result||('R260_BROWSER_PASS width='+width))}finally{await rm(dir,{recursive:true,force:true})}}
