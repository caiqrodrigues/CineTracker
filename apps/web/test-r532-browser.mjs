import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r532.mjs');
const [js,css]=await Promise.all([readFile(resolve('dist/app-v532.js'),'utf8'),readFile(resolve('dist/app-v532.css'),'utf8')]);
function region(header,marker){const at=js.lastIndexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf(header,at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('bounds '+marker);return js.slice(start,end+6)}
const screen=region("/* CineTracker Web 0.3.47 r520 — full-screen owner for F1 + UFC + WWE Pay-Per-View. */","window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';");
const special=region("/* CineTracker Web 0.3.59 r532 — single canonical opener for F1/UFC/WWE. */","window.__ctR532SpecialMarker='single-special-opener-real-screen';");
const related=region("/* CineTracker Web 0.3.59 r532 — single canonical owner for related-title interactions. */","window.__ctR532RelatedMarker='related-click-spa-single-owner';");
const home=region("/* CineTracker Web 0.3.59 r532 — viewport-owned opaque Home chrome shield. */","window.__ctR532HomeMarker='body-owned-opaque-home-shield';");
const prelude=`
let currentRoute='home',navLog=[];
window.__ctCoreR471={route:()=>currentRoute,rpc:async()=>({}),navigate:(path)=>{navLog.push(path);history.pushState({},'',path);return true}};
window.__ctR520Catalog={loadSeason:async(type,season)=>({series:{season,watched_episodes:0,total_episodes:1},seasons:[season],events:[{season,episode_number:1,title:type+' event',runtime_minutes:120,released:true,is_watched:false}]})};
const addWatchlist=async()=>true,markSeen=async()=>true,toast=()=>{};
`;
const probe=`
(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));try{
 for(const type of ['f1','ufc','wwe']){
  const b=document.createElement('button');b.type='button';b.dataset.ct512Special=type;b.dataset.ct513Open=type;document.body.appendChild(b);
  b.click();await sleep(80);
  const s=document.querySelector('[data-ct513-series-screen]');yes(s,'special screen '+type+' '+(document.documentElement.dataset.ct532SpecialError||''));
  const title=s.querySelector('h1')?.textContent||'';yes(type==='f1'?/Fórmula 1/.test(title):type==='ufc'?title==='UFC':/WWE Pay-Per-View/.test(title),'special title '+type+':'+title);
  window.__ctR513SeriesScreen.close();b.remove();await sleep(15)
 }
 const card=document.createElement('article');card.className='ct169-related-card';card.innerHTML='<button class="ct169-related-open" data-media="movie:123" type="button">Relacionado</button><button data-ct169-related-watch="movie:123">Watchlist</button>';document.body.appendChild(card);
 card.querySelector('[data-media]').click();await sleep(0);yes(navLog.at(-1)==='/movie/123','related navigation '+navLog.join(','));

 currentRoute='home';history.replaceState({},'','/home');
 document.body.insertAdjacentHTML('beforeend','<div data-page="home"><div class="content"><div class="search-global" style="position:fixed;top:8px;left:250px;width:500px;height:38px;z-index:205">Busca</div><div data-home><div class="home-tabs" style="position:fixed;top:8px;left:130px;width:110px;height:38px;z-index:210"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div style="height:1200px">conteúdo</div></div></div></div>');
 yes(window.__ctR532HomeChrome.sync(),'Home shield sync');
 const sh=document.querySelector('[data-ct532-home-shield]'),sr=document.querySelector('.search-global').getBoundingClientRect(),tr=document.querySelector('.home-tabs').getBoundingClientRect(),hr=sh.getBoundingClientRect();
 yes(sh?.parentElement===document.body,'shield not body-owned');
 yes(getComputedStyle(sh).position==='fixed','shield not fixed');
 yes(Number(getComputedStyle(sh).zIndex)===204,'shield z');
 yes(hr.top===0&&hr.bottom>=Math.max(sr.bottom,tr.bottom)+9,'shield coverage '+hr.bottom);
 yes(getComputedStyle(sh).backgroundColor==='rgb(3, 10, 15)','shield opacity '+getComputedStyle(sh).backgroundColor);
 currentRoute='profile';window.__ctR532HomeChrome.sync();yes(!document.querySelector('[data-ct532-home-shield]'),'shield leaked off Home');
 document.documentElement.dataset.ct532browser='ok'
}catch(e){document.documentElement.dataset.ct532browser='fail:'+String(e?.stack||e)}})();`;
const html='<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body><script>'+prelude+'</script><script>'+screen+'</script><script>'+special+'</script><script>'+related+'</script><script>'+home+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=2500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct532browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R532_BROWSER '+state+' DOM='+out.slice(-6500));
console.log('R532_BROWSER_OK special+related+opaque-home');
