import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r360.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v360.js')],{stdio:'inherit'});

const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};
window.__ctDiagErrors=[];
window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));
window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)));
</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');

const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR360&&window.__ctR359&&window.__ctR336&&window.__ctR309Test,'r360 lineage missing '+window.__ctDiagErrors.join(' || '));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';

 const item=(id,type,title,genres=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.2,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:genres});
 const movies=[401,402,403,404,405,406].map((id,i)=>item(id,'movie','Fresh M'+(i+1),[28]));
 const wm=[101,102,103].map((id,i)=>item(id,'movie','Watch M'+(i+1),[35]));
 const ws=[201,202,203].map((id,i)=>item(id,'tv','Watch S'+(i+1),[18]));
 const wa=[301,302,303].map((id,i)=>({...item(id,'tv','Watch A'+(i+1),[16]),original_language:'ja',origin_country:['JP']}));
 const fs=[501,502,503].map((id,i)=>item(id,'tv','Fresh S'+(i+1),[18]));
 const fa=[601,602,603].map((id,i)=>({...item(id,'tv','Fresh A'+(i+1),[16]),original_language:'ja',origin_country:['JP']}));
 const daily=[701,702,703].map((id,i)=>item(id,'movie','Daily '+(i+1),[878]));
 window.__ctR309Test.setForYouState({
  watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:movies,series:fs,anime:fa},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:daily,dailyIndex:0,complete:true,
  initial:{watch:{movie:wm[0],series:ws[0],anime:wa[0]},fresh:{movie:movies[0],series:fs[0],anime:fa[0]},daily:daily[0]}
 });
 const calls={watchlist:[],seen:[],swap:[]};
 window.__ctR360.setTestBridge({
  watchlist:async(type,id)=>{calls.watchlist.push(type+':'+id);await sleep(40);return true},
  seen:async(type,id)=>{calls.seen.push(type+':'+id);await sleep(40);return true},
  swapMemory:async(type,id,slot)=>{calls.swap.push(type+':'+id+':'+slot);return true}
 });
 ok(window.__ctR336.paintForYou(),'Pra Você paint failed');
 window.__ctR348?.fixAll?.();window.__ctR349?.compact?.();window.__ctR360.bind();await sleep(80);

 const keys=()=>Object.fromEntries([...document.querySelectorAll('[data-ct336-foryou] [data-ct336-slot]')].map(s=>[s.dataset.ct336Slot,s.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'']));
 const sameExcept=(before,after,name)=>{
  ok(before[name]&&after[name]&&before[name]!==after[name],name+' did not change '+before[name]+' => '+after[name]);
  for(const k of Object.keys(before))if(k!==name)ok(before[k]===after[k],k+' changed during '+name+' '+before[k]+' => '+after[k]);
 };
 function hitClick(selector){
  const btn=document.querySelector(selector);ok(btn,'button missing '+selector);ok(!btn.disabled,'button disabled '+selector);
  const cs=getComputedStyle(btn);ok(cs.pointerEvents!=='none','pointer-events none '+selector);
  const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);
  ok(hit&&(hit===btn||btn.contains(hit)),'button not hit-testable after repaint '+selector+' hit='+(hit?.className||hit?.tagName));
  hit.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window,clientX:x,clientY:y}));
 }

 const slot='fresh:movie',swapSel='[data-ct336-slot="fresh:movie"] [data-ct336-swap-only]';
 let before=keys();hitClick(swapSel);let after=keys();sameExcept(before,after,slot);ok(after[slot]==='movie:402','swap1 wrong '+after[slot]);
 before=after;hitClick(swapSel);after=keys();sameExcept(before,after,slot);ok(after[slot]==='movie:403','swap2 wrong '+after[slot]);
 before=after;hitClick(swapSel);after=keys();sameExcept(before,after,slot);ok(after[slot]==='movie:404','swap3 wrong '+after[slot]);

 const wlSel='[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]';
 before=after;hitClick(wlSel);after=keys();sameExcept(before,after,slot);
 ok(calls.watchlist.length===1&&calls.watchlist[0]==='movie:404','Watchlist persistence wrong '+calls.watchlist);

 before=after;hitClick(swapSel);after=keys();sameExcept(before,after,slot);

 const seenSel='[data-ct336-slot="fresh:movie"] [data-ct336-action="seen"]';
 const seenKey=before=after,beforeSeen=after[slot];
 hitClick(seenSel);after=keys();ok(after[slot]&&after[slot]!==beforeSeen,'Seen did not change same slot '+beforeSeen+' => '+after[slot]);
 ok(calls.seen.length===1&&calls.seen[0]===beforeSeen,'Seen persistence wrong '+calls.seen+' expected '+beforeSeen);

 before=after;hitClick(swapSel);after=keys();sameExcept(before,after,slot);
 before=after;hitClick(swapSel);after=keys();sameExcept(before,after,slot);

 ok(calls.swap.length>=5,'repeated swap memory calls missing '+calls.swap.length);
 const actionRow=document.querySelector('[data-ct336-slot="fresh:movie"] .ct336-actions');
 ok(actionRow?.dataset?.ct348Count==='3','final row lost');
 ok(document.querySelector('[data-ct336-slot="fresh:movie"]')?.dataset?.ct360Live==='1','slot not marked live');
 ok(/swap:fresh:movie/.test(document.documentElement.dataset.ct360LastAction||''),'r360 did not own final repeated click');

 await sleep(100);
 const stable=keys();ok(stable[slot]===after[slot],'background persistence changed clicked slot unexpectedly');
 document.documentElement.dataset.ct360done='1';
}catch(e){document.documentElement.dataset.ct360probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct360done="1"/.test(out)){const m=out.match(/data-ct360probe="([^"]*)"/);throw new Error('R360_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R360_BROWSER_OK repeated same-slot clicks stay live: swap x3, Watchlist, swap, Seen, swap x2');
