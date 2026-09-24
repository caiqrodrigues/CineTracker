import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

if(process.env.CT_R363_SKIP_BUILD!=='1')await import('./build-r363.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r363-foryou-pool-refill.js'),'utf8')).replaceAll('</script>','<\\/script>');

const harness=`
<script>
window.route=()=> 'discover';
window.toast=()=>{};
window.__ctR349={compact:()=>true};
window.__ctR353={pickIndex:(pool,kind,cur)=>pool.length>1?(cur+1)%pool.length:cur};
window.__ctR295Test={authority:async()=>({seen:new Set(),watchRows:[],raw:{watchlist:[]}}),blocked:()=>false};
window.__ctR296Test={strictEligible:()=>true};
window.__ctR362={armAll:()=>true,meta(target){
 const btn=target.closest('button'),slot=btn?.closest('[data-ct336-slot]');if(!btn||!slot)return null;
 const name=slot.dataset.ct336Slot,key=slot.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'';
 const action=btn.dataset.ct336SwapOnly?'swap':btn.dataset.ct336Action||'';
 return action?{btn,slot,name,key,action}:null;
}};
const rows=v=>Array.isArray(v)?v:[];
const current=(st,name)=>{
 if(name==='daily'){const p=rows(st.dailyPool);return p[st.dailyIndex||0]||null}
 const [b,k]=name.split(':'),p=rows(st[b+'Pools']?.[k]);return p[st[b+'Index']?.[k]||0]||null;
};
const key=x=>x?(String(x.media_type||x.type||'tv')==='movie'?'movie':'tv')+':'+Number(x.tmdb_id||x.id||0):'';
window.__ctR309Test={state:null,setForYouState(v){this.state=v}};
window.__ctR359={renderSlot(name){
 const slot=document.querySelector('[data-ct336-slot="'+name+'"]'),item=current(window.__ctR309Test.state,name);if(!slot||!item)return false;
 const card=slot.querySelector('[data-ct288-card]');card.dataset.ct288Card=key(item);
 for(const b of slot.querySelectorAll('[data-ct336-action]'))b.dataset.ct336Media=key(item);
 return true;
}};
function makeSlot(name){
 const watch=name.startsWith('watch:'),slot=document.createElement('div');slot.dataset.ct336Slot=name;slot.className='ct336-slot';
 const card=document.createElement('div');card.dataset.ct288Card='';slot.appendChild(card);
 card.className='ct288-card';
 const row=document.createElement('div');row.className='ct336-actions';slot.appendChild(row);
 if(!watch){const w=document.createElement('button');w.className='ct336-action';w.dataset.ct336Action='watchlist';w.textContent='+ Watchlist';row.appendChild(w)}
 const s=document.createElement('button');s.className='ct336-action';s.dataset.ct336Action='seen';s.textContent='✓ Visto';row.appendChild(s);
 const sw=document.createElement('button');sw.className='ct336-action';sw.dataset.ct336SwapOnly=name;sw.textContent='↻ Trocar';row.appendChild(sw);
 return slot;
}
window.renderAll=()=>{for(const slot of document.querySelectorAll('[data-ct336-slot]'))window.__ctR359.renderSlot(slot.dataset.ct336Slot)};
</script>
`;

const probe=`
<script>
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const item=(id,type,title,g=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:g});
 const mk=(base,count,type,prefix,g=[])=>Array.from({length:count},(_,i)=>({...item(base+i,type,prefix+(i+1),g),...(g.includes(16)?{original_language:'ja',origin_country:['JP']}:{} )}));
 const wm=mk(100,3,'movie','WM'),ws=mk(200,3,'tv','WS'),wa=mk(300,3,'tv','WA',[16]);
 const fm=mk(400,4,'movie','FM'),fs=mk(500,3,'tv','FS'),fa=mk(600,3,'tv','FA',[16]),daily=mk(700,3,'movie','D');
 window.__ctR309Test.setForYouState({watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:daily,dailyIndex:0,complete:true});
 const root=document.querySelector('[data-ct336-foryou]');
 for(const n of ['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'])root.appendChild(makeSlot(n));
 renderAll();

 const calls={watchlist:[],seen:[],swap:[],refill:[]};let slowAnime=false,seq=0;
 const refillItems=(name,count=14)=>{
  const kind=name==='daily'?'movie':String(name).split(':')[1],type=kind==='movie'?'movie':'tv',g=kind==='anime'?[16]:kind==='series'?[18]:[28];
  const base=9000+(++seq)*100;
  return mk(base,count,type,'R'+seq,g).map(x=>kind==='anime'?{...x,original_language:'ja',origin_country:['JP']}:x);
 };
 window.__ctR363.setTestBridge({
  refill:async(name,pages)=>{calls.refill.push(name+':'+pages.join(','));await sleep(slowAnime&&name==='fresh:anime'?45:5);return refillItems(name)},
  watchlist:async(t,id)=>{calls.watchlist.push(t+':'+id);await sleep(2);return true},
  seen:async(t,id)=>{calls.seen.push(t+':'+id);await sleep(2);return true},
  swapMemory:async(t,id,s)=>{calls.swap.push(t+':'+id+':'+s);return true}
 });
 ok(window.__ctR363.warmAll(),'warmAll failed');await sleep(30);
 ok(window.__ctR363Test.poolFor(window.__ctR309Test.state,'fresh:movie').length>4,'pool did not prefill');

 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const domKey=n=>document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const snap=()=>Object.fromEntries(names.map(n=>[n,domKey(n)]));
 const act=(name,action)=>{
  const sel=action==='swap'?'[data-ct336-slot="'+name+'"] [data-ct336-swap-only]':'[data-ct336-slot="'+name+'"] [data-ct336-action="'+action+'"]';
  const b=document.querySelector(sel);ok(b,'missing '+sel);const m=window.__ctR362.meta(b);ok(m,'meta '+sel);ok(window.__ctR363.handle(m),'handle '+sel);
 };
 const only=(a,b,n,l)=>{ok(b[n]&&b[n]!==a[n],l+' target');for(const k of names)if(k!==n)ok(b[k]===a[k],l+' changed '+k)};

 const slot='fresh:movie',sequence=['swap','watchlist','swap','seen','watchlist','swap','seen','swap','watchlist','seen','swap','watchlist','seen','swap'];
 for(let i=0;i<sequence.length;i++){const a=snap();act(slot,sequence[i]);const b=snap();only(a,b,slot,'step '+i);await sleep(5)}
 ok(calls.watchlist.length===4,'watchlist count '+calls.watchlist.length);
 ok(calls.seen.length===4,'seen count '+calls.seen.length);
 ok(calls.swap.length>=6,'swap count '+calls.swap.length);
 ok(window.__ctR363Test.poolFor(window.__ctR309Test.state,slot).length>=2,'pool exhausted');

 let st=window.__ctR363Test.cloneState(window.__ctR309Test.state);
 const lone={...item(8801,'tv','Lone',[16]),original_language:'ja',origin_country:['JP']};
 st.freshPools.anime=[lone];st.freshIndex.anime=0;window.__ctR309Test.setForYouState(st);window.__ctR359.renderSlot('fresh:anime');slowAnime=true;
 const before=snap(),wc=calls.watchlist.length;act('fresh:anime','watchlist');await sleep(8);
 ok(calls.watchlist.length===wc+1,'last item did not persist');
 ok(document.querySelector('[data-ct336-slot="fresh:anime"]').dataset.ct363Refilling==='1','no refill flag');
 await sleep(65);const after=snap();
 ok(after['fresh:anime']&&after['fresh:anime']!=='tv:8801','last slot did not recover');
 for(const n of names)if(n!=='fresh:anime')ok(after[n]===before[n],'last refill changed '+n);
 ok(!document.querySelector('[data-ct336-slot="fresh:anime"]').dataset.ct363Refilling,'refill flag stuck');

 document.documentElement.dataset.ct363done='1';
}catch(e){document.documentElement.dataset.ct363probe='fail:'+String(e?.stack||e)}})();
</script>
`;

const html='<!doctype html><html><body><div data-ct319-content><div data-ct336-foryou></div></div>'+harness+'<script>'+runtime+'</script>'+probe+'</body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=4000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGKILL')}catch{}},12000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));
if(!/data-ct363done="1"/.test(out)){const m=out.match(/data-ct363probe="([^"]*)"/);throw new Error('R363_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R363_BROWSER_OK isolated pool-liveness: 14 actions + last-item persistence/refill');
