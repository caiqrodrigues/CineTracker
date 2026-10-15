import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r533.mjs');
const [js,css]=await Promise.all([readFile(resolve('dist/app-v533.js'),'utf8'),readFile(resolve('dist/app-v533.css'),'utf8')]);
function region(header,marker){const at=js.lastIndexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf(header,at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('bounds '+marker);return js.slice(start,end+6)}
const screen=region('/* CineTracker Web 0.3.47 r520 — full-screen owner for F1 + UFC + WWE Pay-Per-View. */',"window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';");
const special=region('/* CineTracker Web 0.3.60 r533 — resilient single opener for F1/UFC/WWE. */',"window.__ctR533SpecialMarker='special-title-fallback+pointer-owner+real-series-screen';");
const related=region('/* CineTracker Web 0.3.60 r533 — pointer-safe related-title SPA owner. */',"window.__ctR533RelatedMarker='related-pointerup+click-dedupe+spa-navigation';");
const home=region('/* CineTracker Web 0.3.60 r533 — dominant opaque Home chrome shield. */',"window.__ctR533HomeMarker='dominant-body-shield+fixed-controls-above-content';");
const prelude=`
let currentRoute='home',navLog=[];
window.__ctCoreR471={route:()=>currentRoute,rpc:async()=>({}),navigate:(path)=>{navLog.push(path);if(location.pathname!==path)history.pushState({},'',path);return true}};
window.__ctR520Catalog={loadSeason:async(type,season)=>({series:{season,watched_episodes:0,total_episodes:1},seasons:[season],events:[{season,episode_number:1,title:type+' event',runtime_minutes:120,released:true,is_watched:false}]})};
const addWatchlist=async()=>true,markSeen=async()=>true,toast=()=>{};
`;
const probe=`
(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));try{
 for(const [type,title] of [['f1','Fórmula 1'],['ufc','UFC'],['wwe','WWE Pay-Per-View']]){
  const row=document.createElement('div');row.className='media-row ct274-media-card';row.innerHTML='<div class="ct274-row-copy"><b>'+title+'</b></div>';document.body.appendChild(row);
  row.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));row.click();await sleep(80);
  const s=document.querySelector('[data-ct513-series-screen]');yes(s,'special fallback '+type+' '+(document.documentElement.dataset.ct533SpecialError||''));
  const h=s.querySelector('h1')?.textContent||'';yes(type==='f1'?/Fórmula 1/.test(h):type==='ufc'?h==='UFC':/WWE Pay-Per-View/.test(h),'special title '+type+':'+h);
  window.__ctR513SeriesScreen.close();row.remove();await sleep(10)
 }
 const raw=document.createElement('div');raw.className='media-row ct274-media-card';raw.innerHTML='<div class="ct274-row-copy"><b>WWE Raw</b></div>';document.body.appendChild(raw);
 raw.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));raw.click();await sleep(20);yes(!document.querySelector('[data-ct513-series-screen]'),'Raw intercepted as PPV');raw.remove();

 const card=document.createElement('article');card.className='ct169-related-card';card.innerHTML='<button class="ct169-related-open" data-media="movie:123" type="button">Relacionado</button>';document.body.appendChild(card);
 const open=card.querySelector('[data-media]');open.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));open.click();await sleep(0);
 yes(navLog.filter(x=>x==='/movie/123').length===1,'related duplicate/missing '+navLog.join(','));

 currentRoute='home';history.replaceState({},'','/home');
 document.body.insertAdjacentHTML('beforeend','<div data-page="home"><main class="content"><div class="search-global" style="position:fixed;top:8px;left:260px;width:500px;height:40px">Busca</div><div data-home><div class="home-tabs" style="position:fixed;top:8px;left:140px;width:110px;height:40px"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div class="home-section" style="position:relative;z-index:3000;height:900px">conteúdo</div></div></main></div>');
 yes(window.__ctR533HomeChrome.sync(),'home sync');
 const sh=document.querySelector('[data-ct533-home-shield]'),tabs=document.querySelector('.home-tabs'),search=document.querySelector('.search-global');
 yes(sh?.parentElement===document.body,'shield body');
 yes(getComputedStyle(sh).position==='fixed','shield fixed');
 yes(Number(getComputedStyle(sh).zIndex)===9000,'shield z '+getComputedStyle(sh).zIndex);
 yes(Number(getComputedStyle(tabs).zIndex)>9000&&Number(getComputedStyle(search).zIndex)>9000,'controls not above shield');
 yes(getComputedStyle(sh).backgroundColor==='rgb(3, 10, 15)','shield opaque');
 document.documentElement.dataset.ct533browser='ok'
}catch(e){document.documentElement.dataset.ct533browser='fail:'+String(e?.stack||e)}})();
`;
const html='<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body><script>'+prelude+'</script><script>'+screen+'</script><script>'+special+'</script><script>'+related+'</script><script>'+home+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=2800','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct533browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R533_BROWSER '+state+' DOM='+out.slice(-7000));console.log('R533_BROWSER_OK special-fallback+related-pointer+home-shield');
