import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r333.mjs');

let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){
 try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist');
execFileSync(process.execPath,['--check',resolve(dist,'app-v333.js')],{stdio:'inherit'});
const base=await readFile(resolve(dist,'index.html'),'utf8');

const probe=`<script>
setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 const X=window.__ctR333,T=window.__ctR321Test;
 ok(X&&T,'r333 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.124','web version stale');

 history.replaceState({},'','/discover');

 const shell=document.createElement('div');
 shell.innerHTML='<div data-ct319-discover data-ct288-discover>'+
  '<div class="ct319-tab-shell ct288-tab-shell">'+
   '<button data-ct319-prev>‹</button>'+
   '<div data-ct319-tabs><button>Pra você</button><button>Calendário</button></div>'+
   '<button data-ct319-next>›</button>'+
   '<button data-ct319-filter>☷</button>'+
  '</div>'+
  '<div data-ct319-content data-ct315-content data-ct263-discover-content></div>'+
 '</div>';
 document.body.innerHTML='<div id="app"></div>';
 document.querySelector('#app').appendChild(shell);

 const fy=document.createElement('div');
 fy.setAttribute('data-ct309-foryou','');
 fy.innerHTML='<section class="panel ct309-daily"><div class="ct309-daily-card">'+
   '<article class="ct288-card"><button class="ct288-open"><img class="ct288-poster"></button></article>'+
   '<div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap">↻ Trocar</button></div>'+
  '</div></section>'+
  '<section class="panel ct309-fy-block"><div class="ct309-fy-grid">'+
   ['movie','series','anime'].map(k=>'<section class="ct309-slot" data-ct309-slot="fresh:'+k+'"><article class="ct288-card"><button class="ct288-open"><img class="ct288-poster"></button></article><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap">↻ Trocar</button></div></section>').join('')+
  '</div></section>';
 document.querySelector('[data-ct319-content]').appendChild(fy);

 X.settleDiscover();

 ok(!document.querySelector('[data-ct319-next]'),'right next button survived');
 ok(!document.querySelector('[data-ct319-filter]'),'global filter button survived');
 ok(document.querySelectorAll('[data-ct333-fy-kind]').length===4,'Pra voce filters missing');

 const slots=[...document.querySelectorAll('.ct309-fy-grid>.ct309-slot')];
 ok(slots.length===3,'Pra voce slots missing');
 const slotWidths=slots.map(x=>Math.round(x.getBoundingClientRect().width));
 ok(slotWidths.every(w=>w===176),'Pra voce desktop card width not 176: '+slotWidths.join(','));
 const slotTops=slots.map(x=>Math.round(x.getBoundingClientRect().top));
 ok(new Set(slotTops).size===1,'Pra voce cards are not beside one another');

 for(const row of document.querySelectorAll('[data-ct309-foryou] .ct309-actions')){
  const buttons=[...row.querySelectorAll(':scope>.chip')];
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));
  ok(new Set(tops).size===1,'Pra voce buttons wrapped');
  const card=row.parentElement.querySelector('.ct288-card');
  ok(Math.abs(row.getBoundingClientRect().width-card.getBoundingClientRect().width)<=1,'Pra voce actions exceed card width');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'Pra voce action text wraps');
 }

 const browse=document.createElement('section');
 browse.className='panel ct288-browse-block';
 browse.innerHTML='<div class="ct288-rail"><article class="ct288-card ct309-card"><button class="ct288-open"><img class="ct288-poster"></button><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button></div></article></div>';
 document.body.appendChild(browse);
 const browseCard=browse.querySelector('.ct288-card'),browseActions=browse.querySelector('.ct309-actions');
 ok(Math.round(browseCard.getBoundingClientRect().width)===176,'browse card not standard width');
 ok(browseActions.getBoundingClientRect().width<=browseCard.getBoundingClientRect().width+1,'browse actions exceed poster/card width');
 const pubButtons=[...browseActions.querySelectorAll('.chip')];
 ok(new Set(pubButtons.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'browse actions wrapped');

 const top=document.createElement('section');
 top.className='ct288-top-shell';
 top.innerHTML='<div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row"><button class="ct288-provider active">HBO Max</button></div><div class="ct288-top-name"><b>HBO Max</b></div><section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>10</small></div><div class="ct319-top-row"></div></section>';
 document.querySelector('[data-ct319-content]').appendChild(top);
 X.cleanTop10();
 ok(!top.querySelector('.ct288-top-name'),'duplicated selected provider label survived');
 ok(parseFloat(getComputedStyle(top).marginTop)<=0,'Top10 was not moved upward');

 /* Filtering path used by Top 10: blocked candidates are skipped and later pages refill to 10. */
 ok(typeof T.topRaw321==='function','Top10 test hook unavailable');
 const media=(id,type)=>({id,tmdb_id:id,media_type:type,title:'T'+id,name:'T'+id,original_title:'T'+id,original_name:'T'+id,poster_path:'/p'+id+'.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setTestBridge({
  topPage:async(provider,page)=>({
   movies:Array.from({length:10},(_,i)=>media((page-1)*10+i+1,'movie')),
   series:Array.from({length:10},(_,i)=>media(100+(page-1)*10+i+1,'tv'))
  }),
  exact:async items=>({
   blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=8)||(x.tmdb_id>=101&&x.tmdb_id<=108)).map(x=>x.media_type+':'+x.tmdb_id),
   watch_keys:[],seen_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=8)||(x.tmdb_id>=101&&x.tmdb_id<=108)).map(x=>x.media_type+':'+x.tmdb_id),
   not_interested_keys:[]
  })
 });
 const data=await T.topRaw321(9,true);
 ok(data.movies.length===10&&data.series.length===10,'Top10 did not refill to ten after exclusions');
 ok(data.movies.every(x=>x.tmdb_id>8),'blocked watched movie survived Top10');
 ok(data.series.every(x=>x.tmdb_id>108),'blocked watched series survived Top10');

 document.documentElement.dataset.ct333done='1';
}catch(e){document.documentElement.dataset.ct333probe='fail:'+String(e?.stack||e)}},5200);
</script>`;

const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
  if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}
  const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
  if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
  const body=await readFile(file);
  res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});
  res.end(body);
 }catch{res.writeHead(404);res.end('not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;

const child=spawn(bin,[
 '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking',
 '--window-size=1600,1000','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'
],{stdio:['ignore','pipe','pipe']});

let out='',err='';
child.stdout.on('data',d=>out+=d);
child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));
await new Promise(r=>server.close(r));

if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct333done="1"/.test(out)){
 const m=out.match(/data-ct333probe="([^"]*)"/);
 throw new Error('R333_BROWSER '+(m?.[1]||'probe did not finish'));
}
console.log('R333_BROWSER_OK screenshot layout + filters + Top10 exclusion/refill');
