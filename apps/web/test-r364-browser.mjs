import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r364.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v364.js')],{stdio:'inherit'});
const js=await readFile(resolve('dist/app-v364.js'),'utf8');

function segment(marker){
 const p=js.indexOf(marker);if(p<0)throw new Error('segment missing '+marker);
 const a=js.lastIndexOf('/* CineTracker Web',p);if(a<0)throw new Error('segment header missing '+marker);
 const next=js.indexOf('/* CineTracker Web',p+marker.length);
 const boot=js.indexOf('\nboot();',p+marker.length);
 const z=next>=0?next:(boot>=0?boot:js.length);
 return js.slice(a,z);
}
const runtimeStack=[
 segment("window.__ctR348Marker='foryou-buttons-only+direct-children+no-stray-swap'"),
 segment("window.__ctR349Marker='foryou-actions-live+compact-cards+heart-inside-poster'"),
 segment("window.__ctR359Marker='home-v359-cache-first+foryou-single-slot-direct-actions'"),
 segment("window.__ctR360Marker='foryou-repeat-clicks+dom-state-resync+slot-stays-live'"),
 segment("window.__ctR361Marker='foryou-rearm-after-every-repaint+repeat-click-live'"),
 segment("window.__ctR362Marker='foryou-real-click-owner+dom-key-fallback+clicked-slot-only'"),
 segment("window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item'"),
 segment("window.__ctR364Marker='foryou-single-click-owner+legacy-observers-retired+no-freeze'")
].join('\n');

const harness=`<script>
window.route=()=> 'discover';
window.toast=()=>{};
window.__ctObserverObserveCount=0;
const NativeMO=window.MutationObserver;
window.MutationObserver=class extends NativeMO{observe(){window.__ctObserverObserveCount++;return super.observe(...arguments)}};
window.__ctR344={primaryGenre:()=> 'Drama'};
window.__ctR357={normalizeCards:()=>true};
window.__ctR353={pickIndex:(pool,kind,cur)=>pool.length>1?(cur+1)%pool.length:cur};
window.__ctR295Test={authority:async()=>({seen:new Set(),watchRows:[],raw:{watchlist:[]}}),blocked:()=>false};
window.__ctR296Test={strictEligible:()=>true};
window.__ctR309Test={state:null,setForYouState(v){this.state=v}};
const rows=v=>Array.isArray(v)?v:[];
const cur=(p,i)=>rows(p)[Math.max(0,Math.min(Number(i||0),Math.max(0,rows(p).length-1)))]||null;
window.__ctR336Test={fyModel336(){
 const st=window.__ctR309Test.state;if(!st)return null;
 return {
  watch:{movie:cur(st.watchPools?.movie,st.watchIndex?.movie),series:cur(st.watchPools?.series,st.watchIndex?.series),anime:cur(st.watchPools?.anime,st.watchIndex?.anime)},
  fresh:{movie:cur(st.freshPools?.movie,st.freshIndex?.movie),series:cur(st.freshPools?.series,st.freshIndex?.series),anime:cur(st.freshPools?.anime,st.freshIndex?.anime)},
  daily:cur(st.dailyPool,st.dailyIndex),
  lengths:{
   watch:{movie:rows(st.watchPools?.movie).length,series:rows(st.watchPools?.series).length,anime:rows(st.watchPools?.anime).length},
   fresh:{movie:rows(st.freshPools?.movie).length,series:rows(st.freshPools?.series).length,anime:rows(st.freshPools?.anime).length}
  },
  dailyLength:rows(st.dailyPool).length
 };
}};
window.ct288Card=(x)=>'<article class="ct288-card" data-ct288-card="'+(String(x.media_type)==='movie'?'movie':'tv')+':'+x.tmdb_id+'"><button class="ct288-open" data-media="'+(String(x.media_type)==='movie'?'movie':'tv')+':'+x.tmdb_id+'"><img class="ct288-poster" style="width:154px;height:231px"><span class="ct288-copy"><b>'+x.title+'</b><small>2026 · ★ 8.4</small></span></button><button class="ct288-state">♡</button></article>';
/* Same physically-first capture used by the real bundle. */
window.addEventListener('click',e=>{try{const h=window.__ctR358Early;if(typeof h==='function'&&h(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}}catch{}},true);
</script>`;

const setup=`<script>
window.__ctR363.setTestBridge({refill:async()=>[],watchlist:async()=>true,seen:async()=>true,swapMemory:async()=>true});
const root=document.querySelector('[data-ct336-foryou]');
for(const n of ['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily']){
 const slot=document.createElement('div');slot.className='ct336-slot';slot.dataset.ct336Slot=n;
 const wrap=document.createElement('div');wrap.className='ct336-cardwrap';slot.appendChild(wrap);root.appendChild(slot);
}
</script>`;

const probe=`<script>
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const item=(id,type,title,g=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.4,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:g});
 const mk=(base,count,type,prefix,g=[])=>Array.from({length:count},(_,i)=>({...item(base+i,type,prefix+(i+1),g),...(g.includes(16)?{original_language:'ja',origin_country:['JP']}:{} )}));
 const wm=mk(100,12,'movie','WM'),ws=mk(200,12,'tv','WS'),wa=mk(300,12,'tv','WA',[16]);
 const fm=mk(400,12,'movie','FM'),fs=mk(500,12,'tv','FS'),fa=mk(600,12,'tv','FA',[16]),daily=mk(700,12,'movie','D');
 window.__ctR309Test.setForYouState({
  watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:daily,dailyIndex:0,complete:true
 });
 for(const n of ['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'])ok(window.__ctR359.renderSlot(n,{animate:false}),'render '+n);
 window.__ctR348.fixAll();window.__ctR364.armAll();
 await sleep(20);

 ok(window.__ctObserverObserveCount===0,'legacy action observers registered: '+window.__ctObserverObserveCount);
 ok(window.__ctR358Early===window.__ctR364.early,'r358 pointer not r364');
 ok(window.__ctR359Early===window.__ctR364.early,'r359 pointer not r364');
 ok(window.__ctR336EarlyHandle===window.__ctR364.early,'r336 pointer not r364');

 const name='fresh:movie';
 const key=()=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const clickSwap=()=>{
  const b=document.querySelector('[data-ct336-slot="'+name+'"] [data-ct336-swap-only]');
  ok(b&&!b.disabled,'Trocar unavailable');
  b.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
 };
 let heartbeat=0;const beat=setInterval(()=>heartbeat++,2),start=performance.now(),seenKeys=new Set();
 let before=key();seenKeys.add(before);
 for(let i=0;i<40;i++){
  clickSwap();
  const after=key();ok(after&&after!==before,'Trocar stopped at '+i+' '+before+' => '+after);
  before=after;seenKeys.add(after);
  await sleep(2);
 }
 const elapsed=performance.now()-start;clearInterval(beat);
 ok(window.__ctR364.clicks===40,'click count '+window.__ctR364.clicks);
 ok(heartbeat>=20,'event loop starved '+heartbeat);
 ok(elapsed<1500,'40 swaps slow '+elapsed);
 ok(seenKeys.size>=10,'swap pool did not keep rotating '+seenKeys.size);
 ok(window.__ctObserverObserveCount===0,'observer registered after swaps');

 let outside=0;const x=document.createElement('button');x.onclick=()=>outside++;document.body.appendChild(x);x.click();ok(outside===1,'page frozen after swaps');

 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const snap=()=>Object.fromEntries(names.map(n=>[n,document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]')?.dataset?.ct288Card||'']));
 let a=snap();document.querySelector('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]').click();let b=snap();
 ok(b['watch:series']!==a['watch:series'],'Visto failed');
 for(const n of names)if(n!=='watch:series')ok(b[n]===a[n],'Visto changed '+n);
 a=snap();document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-action="watchlist"]').click();b=snap();
 ok(b['fresh:anime']!==a['fresh:anime'],'Watchlist failed');
 for(const n of names)if(n!=='fresh:anime')ok(b[n]===a[n],'Watchlist changed '+n);

 document.documentElement.dataset.ct364done='1';
}catch(e){document.documentElement.dataset.ct364probe='fail:'+String(e?.stack||e)}})();
</script>`;

const html='<!doctype html><html><body><div data-ct319-content><div data-ct336-foryou></div></div>'+harness+'<script>'+runtimeStack.replaceAll('</script>','<\\/script>')+'</script>'+setup+probe+'</body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=3000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGKILL')}catch{}},10000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));
if(!/data-ct364done="1"/.test(out)){const m=out.match(/data-ct364probe="([^"]*)"/);throw new Error('R364_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R364_BROWSER_OK built runtime stack: zero legacy observers, 40 Trocar clicks responsive, Visto/Watchlist single-slot');
