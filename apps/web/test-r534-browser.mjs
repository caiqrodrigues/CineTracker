import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r534.mjs');
const js=await readFile(resolve('dist/app-v534.js'),'utf8');
function region(header,marker){const at=js.lastIndexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf(header,at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('bounds '+marker);return js.slice(start,end+6)}
const screen=region('/* CineTracker Web 0.3.47 r520 — full-screen owner for F1 + UFC + WWE Pay-Per-View. */',"window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';");
const special=region('/* CineTracker Web 0.3.61 r534 — earliest and only opener for F1/UFC/WWE annual series screens. */',"window.__ctR534SpecialMarker='earliest-single-special-owner+catalog-ready+title-fallback';");
const related=region('/* CineTracker Web 0.3.61 r534 — related actions only; native CineTracker data-media handler owns navigation. */',"window.__ctR534RelatedMarker='related-actions-only+native-go-opens-media';");
const prelude=`
let currentRoute='home',navLog=[],watchLog=[],seenLog=[];
window.__ctCoreR471={route:()=>currentRoute,rpc:async()=>({})};
window.__ctR512Special={loadSeason:async(type,season)=>({series:{season,watched_episodes:0,total_episodes:1},seasons:[season],events:[{season,episode_number:1,title:type+' event',runtime_minutes:120,released:true,is_watched:false}]})};
const addWatchlist=async(type,id)=>{watchLog.push(type+':'+id);return true};
const markSeen=async(type,id)=>{seenLog.push(type+':'+id);return true};
const toast=()=>{};
function go(path,replace=false){navLog.push(path);if(location.pathname!==path)history[replace?'replaceState':'pushState']({},'',path);currentRoute=/^\\/movie\\//.test(path)?'movie':/^\\/series\\//.test(path)?'series':currentRoute}
document.addEventListener('click',e=>{const m=e.target.closest?.('[data-media]');if(!m)return;const[t,id]=String(m.dataset.media||'').split(':');if(Number(id)>0)go('/'+(t==='movie'?'movie':'series')+'/'+Number(id))},true);
`;
const probe=`
(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));try{
 history.replaceState({},'','/home');currentRoute='home';
 for(const [type,title,id] of [['f1','Fórmula 1',801],['ufc','UFC',802],['wwe','WWE Pay-Per-View',803]]){
  const row=document.createElement('div');row.className='media-row ct274-media-card';row.dataset.media='tv:'+id;row.innerHTML='<div class="ct274-row-copy"><b>'+title+'</b></div>';document.body.appendChild(row);
  row.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));row.click();await sleep(70);
  const s=document.querySelector('[data-ct513-series-screen]');yes(s,'special not opened '+type+' '+(document.documentElement.dataset.ct534SpecialError||''));
  const h=s.querySelector('h1')?.textContent||'';yes(type==='f1'?h==='Fórmula 1':type==='ufc'?h==='UFC':h==='WWE Pay-Per-View','special title '+type+':'+h);
  yes(!navLog.includes('/series/'+id),'special leaked to generic go '+type);
  window.__ctR513SeriesScreen.close();row.remove();await sleep(10)
 }
 for(const [title,id] of [['WWE Raw',901],['WWE SmackDown',902]]){
  currentRoute='home';history.replaceState({},'','/home');
  const row=document.createElement('div');row.className='media-row ct274-media-card';row.dataset.media='tv:'+id;row.innerHTML='<div class="ct274-row-copy"><b>'+title+'</b></div>';document.body.appendChild(row);
  row.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));row.click();await sleep(5);
  yes(!document.querySelector('[data-ct513-series-screen]'),title+' incorrectly intercepted');
  yes(navLog.filter(x=>x==='/series/'+id).length===1,title+' did not use normal series route');
  row.remove()
 }
 currentRoute='movie';history.replaceState({},'','/movie/1');
 const movie=document.createElement('article');movie.className='ct169-related-card';movie.innerHTML='<button class="ct169-related-open" data-media="movie:123" type="button">Movie related</button>';document.body.appendChild(movie);
 movie.querySelector('[data-media]').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));movie.querySelector('[data-media]').click();await sleep(5);
 yes(navLog.filter(x=>x==='/movie/123').length===1,'related movie native go '+navLog.join(','));
 movie.remove();
 currentRoute='series';history.replaceState({},'','/series/1');
 const series=document.createElement('article');series.className='ct169-related-card';series.innerHTML='<button class="ct169-related-open" data-media="tv:456" type="button">Series related</button>';document.body.appendChild(series);
 series.querySelector('[data-media]').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));series.querySelector('[data-media]').click();await sleep(5);
 yes(navLog.filter(x=>x==='/series/456').length===1,'related series native go '+navLog.join(','));
 series.remove();
 const w=document.createElement('article');w.className='ct169-related-card';w.innerHTML='<button data-ct169-related-watch="movie:777" type="button">Watch</button>';document.body.appendChild(w);
 w.querySelector('button').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));w.querySelector('button').click();await sleep(5);yes(watchLog.join(',')==='movie:777','watch action');yes(!navLog.includes('/movie/777'),'watch navigated');
 const v=document.createElement('article');v.className='ct169-related-card';v.innerHTML='<button data-ct169-related-seen="tv:888" type="button">Seen</button>';document.body.appendChild(v);
 v.querySelector('button').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));v.querySelector('button').click();await sleep(5);yes(seenLog.join(',')==='tv:888','seen action');yes(!navLog.includes('/series/888'),'seen navigated');
 document.documentElement.dataset.ct534browser='ok'
}catch(e){document.documentElement.dataset.ct534browser='fail:'+String(e?.stack||e)}})();
`;
const html='<!doctype html><html><head><meta charset="utf-8"></head><body><script>'+prelude+'</script><script>'+screen+'</script><script>'+special+'</script><script>'+related+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=3000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct534browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R534_BROWSER '+state+' DOM='+out.slice(-7000));console.log('R534_BROWSER_OK canonical-special+native-related-navigation');