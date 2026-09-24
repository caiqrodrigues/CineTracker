import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r357.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v357.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');

const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR357&&window.__ctR352&&window.__ctR336&&window.__ctR309Test,'r357 lineage missing '+window.__ctDiagErrors.join(' || '));

 /* Universal media card contract: kind only on poster badge; meta = year + rating + one genre. */
 const sample={id:9001,tmdb_id:9001,media_type:'movie',title:'Filme Teste',release_date:'2026-09-01',vote_average:8.4,genre_ids:[28,12]};
 const box=document.createElement('div');box.innerHTML=window.__ctR357.card(sample,{add:true});document.body.appendChild(box);
 const card=box.querySelector('.ct288-card'),badge=card.querySelector('.ct357-kind-badge'),meta=card.querySelector('.ct357-meta'),shell=card.querySelector('.ct357-poster-shell');
 ok(card&&badge&&meta&&shell,'universal card structure missing');
 ok(badge.textContent.trim()==='Filme','badge kind wrong '+badge.textContent);
 ok(shell.contains(badge),'badge is not inside poster shell');
 ok(meta.textContent.includes('2026')&&meta.textContent.includes('★ 8.4')&&meta.textContent.includes('Ação'),'full metadata missing '+meta.textContent);
 ok(!/Filme|Série|Anime/.test(meta.textContent),'kind leaked into metadata '+meta.textContent);

 const missing={id:9002,tmdb_id:9002,media_type:'tv',name:'Série Teste',first_air_date:'2025-01-01',vote_average:0,genre_ids:[]};
 const box2=document.createElement('div');box2.innerHTML=window.__ctR357.card(missing,{add:false});document.body.appendChild(box2);
 const card2=box2.querySelector('.ct288-card');
 window.__ctR357Test.applyDetail357(card2,{id:9002,name:'Série Teste',first_air_date:'2025-01-01',vote_average:7.9,genres:[{id:18,name:'Drama'}],original_language:'en',origin_country:['US']});
 ok(card2.querySelector('.ct357-meta').textContent.includes('★ 7.9')&&card2.querySelector('.ct357-meta').textContent.includes('Drama'),'detail fallback did not fill rating/genre');
 ok(card2.querySelector('.ct357-kind-badge').textContent==='Série','detail fallback badge wrong');

 /* Pra Você: actual .click() must be intercepted by r357 before legacy owners. */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title,genres=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.1,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:genres});
 const m1=item(101,'movie','W M1',[28]),m2=item(102,'movie','W M2',[35]),s1=item(201,'tv','W S1',[18]),s2=item(202,'tv','W S2',[53]);
 const a1={...item(301,'tv','W A1',[16]),original_language:'ja',origin_country:['JP']},a2={...item(302,'tv','W A2',[16]),original_language:'ja',origin_country:['JP']};
 const fm1=item(401,'movie','F M1',[12]),fm2=item(402,'movie','F M2',[35]),fs1=item(501,'tv','F S1',[18]),fs2=item(502,'tv','F S2',[80]);
 const fa1={...item(601,'tv','F A1',[16]),original_language:'ja',origin_country:['JP']},fa2={...item(602,'tv','F A2',[16]),original_language:'ja',origin_country:['JP']};
 const d1=item(701,'movie','D1',[878]),d2=item(702,'movie','D2',[35]);
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m1,m2],series:[s1,s2],anime:[a1,a2]},freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[d1,d2],dailyIndex:0,complete:true,
  initial:{watch:{movie:m1,series:s1,anime:a1},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 const calls={watchlist:[],seen:[]};
 window.__ctR352.setTestBridge({
  watchlist:async(type,id)=>{calls.watchlist.push(type+':'+id);return true},
  seen:async(type,id)=>{calls.seen.push(type+':'+id);return true}
 });
 ok(window.__ctR336.paintForYou(),'Pra Você paint failed');window.__ctR348?.fixAll?.();await sleep(80);
 const keys=()=>Object.fromEntries([...document.querySelectorAll('[data-ct336-foryou] [data-ct336-slot]')].map(s=>[s.dataset.ct336Slot,s.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'']));
 const changedOnly=(before,after,name)=>{
  ok(before[name]&&after[name]&&before[name]!==after[name],name+' did not change');
  for(const k of Object.keys(before))if(k!==name)ok(before[k]===after[k],k+' changed while clicking '+name+' '+before[k]+' => '+after[k]);
 };

 let before=keys();
 const wl=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');ok(wl,'Watchlist missing');wl.click();
 let after=keys();changedOnly(before,after,'fresh:movie');await sleep(30);ok(calls.watchlist.length===1,'Watchlist backend call count '+calls.watchlist.length);

 before=keys();
 const seen=document.querySelector('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]');ok(seen,'Visto missing');seen.click();
 after=keys();changedOnly(before,after,'watch:series');await sleep(30);ok(calls.seen.length===1,'Seen backend call count '+calls.seen.length);

 before=keys();
 const swap=document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');ok(swap&&!swap.disabled,'Trocar missing');swap.click();
 after=keys();changedOnly(before,after,'fresh:anime');ok(calls.watchlist.length===1&&calls.seen.length===1,'Trocar triggered persistence');

 /* Repainted cards retain badge/meta and action structure. */
 await sleep(80);
 for(const c of document.querySelectorAll('[data-ct336-foryou] .ct288-card')){
  ok(c.querySelector('.ct357-kind-badge'),'Pra Você badge missing after action');
  const txt=c.querySelector('.ct357-meta')?.textContent||'';ok(/★/.test(txt),'Pra Você rating field missing after action');
 }
 document.documentElement.dataset.ct357done='1';
}catch(e){document.documentElement.dataset.ct357probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct357done="1"/.test(out)){const m=out.match(/data-ct357probe="([^"]*)"/);throw new Error('R357_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R357_BROWSER_OK universal badge/meta + local-only Watchlist/Visto/Trocar actions');
