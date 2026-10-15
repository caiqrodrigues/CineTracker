import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r531.mjs');
const [js,css,runtime]=await Promise.all([readFile(resolve('dist/app-v531.js'),'utf8'),readFile(resolve('dist/app-v531.css'),'utf8'),readFile(resolve('runtime-r531-final.js'),'utf8')]);
function region(header,marker){const at=js.lastIndexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf(header,at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('bounds '+marker);return js.slice(start,end+6)}
const r286=region("/* CineTracker Web 1.0.77 / r286 — related titles own open, Watchlist and Visto interactions before legacy document handlers. */","window.__ctR286='related-open-watchlist-seen-window-capture';");
const r513=region("/* CineTracker Web 0.3.47 r520 — full-screen owner for F1 + UFC + WWE Pay-Per-View. */","window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';");
const r529=region("/* CineTracker Web 0.3.56 r529 — non-floating Home chrome + single special-series opener. */","window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';");
const prelude=`
let currentRoute='home',navLog=[];
window.__ctCoreR471={
 route:()=>currentRoute,
 rpc:async()=>({}),
 navigate:(path)=>{navLog.push(path);history.pushState({},'',path);return true}
};
window.__ctR520Catalog={loadSeason:async(type,season)=>({series:{season,watched_episodes:0,total_episodes:1},seasons:[season],events:[{season,episode_number:1,title:type+' event',runtime_minutes:120,released:true,is_watched:false}]})};
const addWatchlist=async()=>true,markSeen=async()=>true,toast=()=>{};
`;
const probe=`
(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));try{
 window.__ctR512Special=undefined;
 yes(typeof window.__ctR513SeriesScreen?.open==='function','real r520 special owner unavailable');
 yes(typeof window.__ctR529?.openSpecial==='function','r529 click owner unavailable');
 for(const type of ['f1','ufc','wwe']){
  const b=document.createElement('button');b.dataset.ct512Special=type;b.dataset.ct513Open=type;document.body.appendChild(b);
  b.click();
  let screen=null;for(let i=0;i<24&&!screen;i++){await sleep(25);screen=document.querySelector('[data-ct513-series-screen]')}
  yes(screen,'real special screen '+type+' r529='+(document.documentElement.dataset.ct529SpecialError||'')+' r530='+(document.documentElement.dataset.ct530SpecialError||''));
  const title=screen.querySelector('h1')?.textContent||'';yes(type==='f1'?/Fórmula 1/.test(title):type==='ufc'?title==='UFC':/WWE Pay-Per-View/.test(title),'special title '+type+':'+title);
  window.__ctR513SeriesScreen.close();b.remove();await sleep(30);
 }
 const card=document.createElement('article');card.className='ct169-related-card ct170-related-card';card.innerHTML='<button class="ct169-related-open" data-media="movie:123" type="button">Relacionado</button>';document.body.appendChild(card);
 card.querySelector('button').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));await sleep(0);yes(navLog.at(-1)==='/movie/123','related SPA '+navLog.join(','));
 history.replaceState({},'','/home');currentRoute='home';
 document.body.insertAdjacentHTML('beforeend','<div data-page="home"><main class="content"><div class="search-global" style="position:fixed;top:8px;left:240px;width:500px;height:38px">Busca</div><div data-home><div class="home-tabs" style="position:fixed;top:8px;left:140px;width:90px;height:38px"><button data-home-tab="series">Séries</button></div><div style="height:1200px">conteúdo</div></div></main></div>');
 window.__ctR531.layout();const sh=document.querySelector('[data-ct531-home-shield]'),sr=document.querySelector('.search-global').getBoundingClientRect(),tr=document.querySelector('.home-tabs').getBoundingClientRect(),hr=sh.getBoundingClientRect();
 yes(sh,'shield missing');yes(getComputedStyle(sh).position==='fixed','shield not fixed');yes(Number(getComputedStyle(sh).zIndex)===204,'shield z');yes(hr.top===0&&hr.bottom>=Math.max(sr.bottom,tr.bottom)+7,'shield geometry '+hr.bottom);yes(getComputedStyle(sh).backgroundColor==='rgb(3, 10, 15)','shield opaque '+getComputedStyle(sh).backgroundColor);
 document.documentElement.dataset.ct531browser='ok';
}catch(e){document.documentElement.dataset.ct531browser='fail:'+String(e?.message||e)}})();`;
const html='<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body><script>'+prelude+'</script><script>'+r513+'</script><script>'+r529+'</script><script>'+r286+'</script><script>'+runtime+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=1800','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct531browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R531_BROWSER '+state+' DOM='+out.slice(-6000));
console.log('R531_BROWSER_OK real-special+related-spa+opaque-home');
