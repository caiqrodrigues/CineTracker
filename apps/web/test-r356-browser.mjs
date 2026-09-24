import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r356.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v356.js')],{stdio:'inherit'});
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
 ok(window.__ctR356&&window.__ctR355&&window.__ctR352&&window.__ctR348&&window.__ctR336,'r356 lineage missing '+window.__ctDiagErrors.join(' || '));

 /* ---- Pra Você: real clicks keep working after time and after metadata/state drift. ---- */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title,genres=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:genres});
 const wm=[item(101,'movie','Watch 1'),item(102,'movie','Watch 2'),item(103,'movie','Watch 3')];
 const ws=[item(201,'tv','Series 1'),item(202,'tv','Series 2')],wa=[{...item(301,'tv','Anime 1',[16]),original_language:'ja'},{...item(302,'tv','Anime 2',[16]),original_language:'ja'}];
 const fm=[item(401,'movie','Fresh 1'),item(402,'movie','Fresh 2'),item(403,'movie','Fresh 3')];
 const fs=[item(501,'tv','Fresh S1'),item(502,'tv','Fresh S2')],fa=[{...item(601,'tv','Fresh A1',[16]),original_language:'ja'},{...item(602,'tv','Fresh A2',[16]),original_language:'ja'}];
 const daily=[item(701,'movie','Daily 1'),item(702,'movie','Daily 2')];
 window.__ctR309Test.setForYouState({
  watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:daily,dailyIndex:0,complete:true,
  initial:{watch:{movie:wm[0],series:ws[0],anime:wa[0]},fresh:{movie:fm[0],series:fs[0],anime:fa[0]},daily:daily[0]}
 });
 const backend=[];
 window.__ctR352.setTestBridge({
  watchlist:async(type,id)=>{backend.push('watchlist:'+type+':'+id);await sleep(15);return{ok:true}},
  seen:async(type,id)=>{backend.push('seen:'+type+':'+id);await sleep(15);return{ok:true}}
 });
 ok(window.__ctR336.paintForYou(),'Pra Você paint failed');
 window.__ctR348.fixAll();window.__ctR356.repairAll();window.__ctR356.bindActions();await sleep(80);
 ok(window.__ctR355DirectClick===window.__ctR356.directClick,'r356 did not own earliest dynamic click');

 const key=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const allKeys=()=>[...document.querySelectorAll('[data-ct336-slot]')].map(s=>[s.dataset.ct336Slot,s.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'']);

 /* Corrupt metadata AND state index after the UI is already painted. Watchlist must repair from DOM. */
 const freshSlot=document.querySelector('[data-ct336-slot="fresh:movie"]'),wl=freshSlot.querySelector('[data-ct336-action="watchlist"]');
 const visibleFresh=key('fresh:movie');delete wl.dataset.ct336Media;delete wl.dataset.ct336Swap;
 const st1=window.__ctR309Test.state;st1.freshIndex.movie=1;window.__ctR309Test.setForYouState(st1);
 const otherBefore=Object.fromEntries(allKeys().filter(([n])=>n!=='fresh:movie'));
 wl.click();
 const freshAfter=key('fresh:movie');
 ok(freshAfter&&freshAfter!==visibleFresh,'Watchlist failed after metadata/state drift '+visibleFresh+' => '+freshAfter);
 ok(backend.filter(x=>x==='watchlist:movie:401').length===1,'Watchlist backend key wrong '+backend.join(','));
 const otherAfter=Object.fromEntries(allKeys().filter(([n])=>n!=='fresh:movie'));
 ok(JSON.stringify(otherAfter)===JSON.stringify(otherBefore),'Watchlist repainted another slot');
 await sleep(80);

 /* Wait long enough to reproduce the reported "works for a while then stops", remove metadata again, click Visto. */
 await sleep(1250);
 const watchSlot=document.querySelector('[data-ct336-slot="watch:movie"]'),seen=watchSlot.querySelector('[data-ct336-action="seen"]');
 const visibleWatch=key('watch:movie');delete seen.dataset.ct336Media;delete seen.dataset.ct336Swap;delete seen.dataset.ct336Action;
 const st2=window.__ctR309Test.state;st2.watchIndex.movie=2;window.__ctR309Test.setForYouState(st2);
 seen.click();
 const watchAfter=key('watch:movie');
 ok(watchAfter&&watchAfter!==visibleWatch,'Visto failed after idle/metadata drift '+visibleWatch+' => '+watchAfter);
 ok(backend.some(x=>x==='seen:movie:101'),'Visto backend key wrong '+backend.join(','));
 await sleep(80);

 /* A second persistent action must still work after both prior repaints. */
 const wl2=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-action="watchlist"]');
 const fsBefore=key('fresh:series');delete wl2.dataset.ct336Media;
 wl2.click();const fsAfter=key('fresh:series');
 ok(fsAfter&&fsAfter!==fsBefore,'second Watchlist click stopped working');
 ok(backend.some(x=>x==='watchlist:tv:501'),'second Watchlist backend not called');

 /* Trocar remains local and immediate. */
 const sw=document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');
 const faBefore=key('fresh:anime');sw.click();const faAfter=key('fresh:anime');
 ok(faAfter&&faAfter!==faBefore,'Trocar stopped working');

 /* ---- Sports: stale/empty UI must be repainted from a newly loaded authoritative payload. ---- */
 history.replaceState({},'','/sports');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div class="page" data-sports><div data-ct255-sports><div class="empty">Nenhum evento disponível neste filtro.</div></div></div></main></div>';
 const sb=window.__ctR356.sportsBridge();ok(sb?.state&&typeof sb.rows==='function','Sports bridge missing');
 const future=new Date(Date.now()+3600000).toISOString();
 const fake={sports:[{slug:'formula_1',name:'Fórmula 1',icon:'🏎️',sort_order:1}],favorites:[],watch_history:[],stats:{},events:[{id:9001,sport_slug:'formula_1',provider:'test',provider_event_id:'f1-next',title:'Azerbaijan Grand Prix Practice 2',starts_at:future,status:'scheduled',season:'2026',round:'15',venue:'Baku City Circuit'}]};
 sb.state.tab='next';sb.state.sport='all';sb.state.payload={events:[]};sb.state.at=Date.now();
 let painted=0;
 sb.load=async force=>{ok(force===true,'Sports reload not forced');return fake};
 sb.paint=()=>{painted++;const rows=sb.rows(sb.state.payload);document.querySelector('[data-ct255-sports]').innerHTML=rows.length?'<div data-test-event>'+rows[0].title+'</div>':'<div class="empty">Nenhum evento disponível neste filtro.</div>'};
 ok(await window.__ctR356.refreshSports({sync:false,silent:true}),'Sports refresh returned false');
 ok(painted===1,'Sports did not repaint exactly once');
 ok(document.documentElement.dataset.ct356SportsUpcoming==='1','Sports upcoming count not refreshed');
 ok(/Azerbaijan Grand Prix/.test(document.querySelector('[data-ct255-sports]').textContent),'fresh Sports event not displayed');
 ok(!/Nenhum evento disponível/.test(document.querySelector('[data-ct255-sports]').textContent),'stale empty Sports state survived');

 document.documentElement.dataset.ct356done='1';
}catch(e){document.documentElement.dataset.ct356probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=20000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct356done="1"/.test(out)){const m=out.match(/data-ct356probe="([^"]*)"/);throw new Error('R356_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R356_BROWSER_OK repeated Watchlist/Visto after idle+metadata drift; clicked-slot only; Sports fresh payload replaces empty state');
