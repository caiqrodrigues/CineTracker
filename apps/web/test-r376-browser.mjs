import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
if(process.env.CT_R376_SKIP_BUILD!=='1')await import('./build-r376.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r376-home-watchlist-foryou-final.js'),'utf8')).replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head><style>.stack{display:flex;flex-direction:column}.media-row{height:36px;border:1px solid #123}.hidden{display:none}.ct336-slot{width:176px}.ct288-card{height:264px}.ct336-actions{width:176px}</style></head><body>
<div data-home><div data-home-view="movies"><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>480</small></div><div class="stack"></div></section></div></div>
<div data-ct336-content><div data-ct336-foryou>
${['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime'].map(n=>'<div class="ct336-slot" data-ct336-slot="'+n+'"><article class="ct288-card" data-ct288-card=""></article><div class="ct336-actions"></div></div>').join('')}
</div></div>
<script>
let currentRoute='home';window.route=()=>currentRoute;window.toast=()=>{};window.mediaRow=x=>'<div class="media-row" data-media="movie:'+(x.tmdb_id||x.media_id)+'"><b>'+x.title+'</b></div>';
const homeRows=Array.from({length:1381},(_,i)=>({media_id:i+1,media_type:'movie',tmdb_id:(i%442)+1,title:'Movie '+String(1381-i).padStart(4,'0'),release_year:1980+(i%46),added_at:new Date(Date.UTC(2020,0,1)+i*86400000).toISOString(),raw_tmdb:{release_date:String(1980+(i%46))+'-01-01'}}));
window.rpc=async(name)=>{if(name==='cinetracker_watchlist_full_v376')return{rows:homeRows,counts:{movie:1381,series:0}};return{}};
const item=(id,type='movie',extra={})=>({id,tmdb_id:id,media_type:type,poster_path:'/p.jpg',vote_average:8.2,release_date:'2025-01-01',genre_ids:type==='tv'?[18]:[28],...extra});
window.__ctR309Test={state:{dailyPool:[item(500)],dailyIndex:0,watchPools:{movie:[item(501)],series:[item(502,'tv')],anime:[item(503,'tv',{genre_ids:[16],original_language:'ja',origin_country:['JP']})]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0}},setForYouState(v){this.state=v}};
window.__ctR319={personal:async()=>({ready:true,seen:new Set(['movie:1']),watch:new Set(['movie:2']),blocked:new Set(['movie:1','movie:2'])})};
window.__ctR295Test={authority:async()=>({ready:true,seen:new Set(),watch:new Set(),blocked:new Set()})};
window.tmdb=async(path,params)=>{const tv=path.includes('/tv'),anime=String(params?.with_genres||'')==='16';return{results:Array.from({length:20},(_,i)=>item((tv?2000:1000)+(params.page||1)*50+i,tv?'tv':'movie',anime?{genre_ids:[16],original_language:'ja',origin_country:['JP'],first_air_date:'2025-01-01'}:tv?{genre_ids:[18],first_air_date:'2025-01-01'}:{}))}};
window.__ctR370={excluded:new Set(),fetchOnceIfNeeded:async()=>0,handleSwap:async()=>true};
window.__ctR365={persistDirect:async()=>true};
window.__ctR359Test={mutate359:()=>({before:window.__ctR309Test.state})};
window.__ctR367={handle:()=>true};
window.__ctR359={renderSlot(name){const st=window.__ctR309Test.state,p=name==='daily'?st.dailyPool:st[name.split(':')[0]+'Pools'][name.split(':')[1]],i=name==='daily'?st.dailyIndex:st[name.split(':')[0]+'Index'][name.split(':')[1]],x=p?.[i||0],slot=document.querySelector('[data-ct336-slot="'+name+'"]'),card=slot?.querySelector('[data-ct288-card]');if(card)card.dataset.ct288Card=x?((x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id):'';return !!x}};
</script><script>${runtime}</script><script>
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 await window.__ctR376.hydrateHome(true);
 for(let n=0;n<120&&window.__ctR376.home.rendered<1381;n++)await sleep(20);
 const sec=document.querySelector('.home-section'),stack=sec.querySelector('.stack'),nodes=[...stack.querySelectorAll('[data-ct376-media-id]')];
 ok(sec.dataset.ct376Total==='1381','home total '+sec.dataset.ct376Total);ok(nodes.length===1381,'home rows '+nodes.length);
 const keep=nodes[0],before=location.href,beforeH=keep.getBoundingClientRect().height;
 const trigger=sec.querySelector('[data-ct376-sort-trigger]');trigger.click();await sleep(0);ok(sec.querySelector('[data-ct376-sort-popover]').classList.contains('open'),'popover closed');
 for(const mode of ['added_desc','added_asc','release_desc','release_asc','az','za']){const b=sec.querySelector('[data-ct376-sort-option="'+mode+'"]');b.click();await sleep(220);ok(window.__ctR376.home.sort===mode,'sort '+mode);ok(location.href===before,'sort navigated');trigger.click();await sleep(0)}
 ok(stack.contains(keep),'sort rebuilt card nodes');ok(Math.abs(keep.getBoundingClientRect().height-beforeH)<1,'sort resized card');
 currentRoute='discover';await window.__ctR376.ensureFreshAll();await sleep(30);
 for(const kind of ['movie','series','anime']){const name='fresh:'+kind,slot=document.querySelector('[data-ct336-slot="'+name+'"]');ok(slot.querySelector('[data-ct288-card]').dataset.ct288Card,'empty '+name);ok(slot.querySelectorAll('.ct336-actions>button').length===3,'buttons '+name)}
 for(let i=0;i<6;i++){const slot=document.querySelector('[data-ct336-slot="fresh:movie"]'),btn=slot.querySelector('[data-ct336-swap-only]'),m=window.__ctR367.meta(btn);ok(await window.__ctR376.swapFresh(m),'swap '+i);ok(slot.querySelectorAll('.ct336-actions>button').length===3,'buttons broke '+i);ok(slot.querySelector('[data-ct288-card]').dataset.ct288Card,'card vanished '+i)}
 document.documentElement.dataset.ct376done='1';
}catch(e){document.documentElement.dataset.ct376probe='fail:'+String(e?.stack||e)}})();
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=9000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));if(!/data-ct376done="1"/.test(out)){const m=out.match(/data-ct376probe="([^"]*)"/);throw new Error('R376_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R376_BROWSER_OK 1381 Home rows + six stable sorts + fresh 3/3 populated + repeated swaps stable');