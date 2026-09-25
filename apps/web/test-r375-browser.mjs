import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
if(process.env.CT_R375_SKIP_BUILD!=='1')await import('./build-r375.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const owner=(await readFile(resolve('runtime-r374-home-tab-scroll-reset.js'),'utf8')).replaceAll('</script>','<\\/script>');
const marker=(await readFile(resolve('runtime-r375-home-semantic-start.js'),'utf8')).replaceAll('</script>','<\\/script>');
const hist=(title)=>'<section data-ct274-history style="height:720px"><div class="panel-head"><h3>'+title+'</h3></div></section>';
const main=(title,id)=>'<section id="'+id+'" style="height:1000px"><div class="panel-head"><h3>'+title+'</h3></div></section>';
const html=`<!doctype html><html><head><style>html,body{margin:0}.content{height:360px;overflow-y:auto}.home-tabs{position:sticky;top:0;z-index:5;height:36px;background:#111}.home-list.hidden{display:none}.home-list{min-height:1720px}</style></head><body>
<main class="content" id="home-scroll-container"><div data-home>
 <div class="home-tabs"><button type="button" class="active" data-home-tab="series">Séries</button><button type="button" data-home-tab="movies">Filmes</button></div>
 <div data-home-view="series" class="home-list">${hist('Histórico recente')}${main('Assistir a seguir','series-main')}</div>
 <div data-home-view="movies" class="home-list hidden" hidden>${hist('Filmes vistos')}${main('Assistir a seguir / Watchlist','movies-main')}</div>
</div></main>
<script>
window.route=()=> 'home';window.__legacyClicks=0;window.__ctR371={activeTab:'series',selectByUser(k){this.activeTab=k}};
document.addEventListener('click',e=>{if(e.target.closest('[data-home-tab]')){window.__legacyClicks++;document.getElementById('home-scroll-container').scrollTop=0}},true);
</script><script>${owner}</script><script>${marker}</script><script>
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms)),sc=document.getElementById('home-scroll-container');
 const movies=document.querySelector('[data-home-tab="movies"]'),series=document.querySelector('[data-home-tab="series"]');
 const aligned=id=>{const t=document.getElementById(id).getBoundingClientRect().top,b=document.querySelector('.home-tabs').getBoundingClientRect().bottom;return Math.abs(t-(b+8))<=3};
 sc.scrollTop=sc.scrollHeight;movies.click();await sleep(900);
 ok(window.__legacyClicks===0,'legacy click won');ok(window.__ctR371.activeTab==='movies','movies not selected');ok(aligned('movies-main'),'movies main not aligned');
 ok(sc.scrollTop>500,'movies was reset to absolute zero');ok(document.querySelector('[data-home-view="movies"] [data-ct274-history]').getBoundingClientRect().top<0,'movie history is not above viewport');
 sc.scrollTop=sc.scrollHeight;series.click();await sleep(900);
 ok(window.__legacyClicks===0,'legacy series click won');ok(window.__ctR371.activeTab==='series','series not selected');ok(aligned('series-main'),'series main not aligned');
 ok(sc.scrollTop>500,'series was reset to absolute zero');ok(document.querySelector('[data-home-view="series"] [data-ct274-history]').getBoundingClientRect().top<0,'series history is not above viewport');
 document.documentElement.dataset.ct375done='1';
}catch(e){document.documentElement.dataset.ct375probe='fail:'+String(e?.stack||e)}})();
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=4000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},15000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));if(!/data-ct375done="1"/.test(out)){const m=out.match(/data-ct375probe="([^"]*)"/);throw new Error('R375_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R375_BROWSER_OK both tabs start at main section while History remains above viewport');