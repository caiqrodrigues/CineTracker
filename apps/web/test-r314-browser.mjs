import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r314.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct314Errors=[];addEventListener('error',e=>__ct314Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct314Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR314Test;ok(T,'r314 test bridge unavailable');
 // DISCOVER: nine tabs + strict six + minimal + + compact Pra Você ratio.
 ok(T.TABS.length===9&&T.TABS.some(x=>x[0]==='releases'&&x[1]==='Lançamentos'),'nine Discover tabs missing');
 ok(T.STRICT.size===6&&T.STRICT.has('releases'),'strict six missing releases');
 const media=(id,type,title,year='2026')=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.3,release_date:year+'-01-01',first_air_date:year+'-01-01'});
 T.setPersonal({blocked:['movie:1','tv:2'],aliases:['movie|alias visto|2026'],watch:['tv:2']});
 const clean=T.filter314([media(1,'movie','Visto'),media(2,'tv','Watchlist'),media(3,'movie','Alias Visto'),media(4,'movie','Elegível')]);
 ok(clean.length===1&&clean[0].tmdb_id===4,'strict seen/watchlist/alias barrier failed');
 const shell=document.createElement('main');shell.innerHTML=T.shellHtml314();document.body.appendChild(shell);
 ok(shell.querySelectorAll('[data-ct314-tab]').length===9,'shell does not render nine tabs');
 ok(shell.textContent.includes('Lançamentos'),'Lançamentos label absent');
 const holder=document.createElement('div');holder.innerHTML=T.card314(media(4,'movie','Elegível'));document.body.appendChild(holder);
 const plus=holder.querySelector('[data-ct288-add]');ok(plus&&plus.textContent.trim()==='+','minimal + missing from Discover card; html='+holder.innerHTML);
 holder.remove();shell.remove();
 // PROFILE: Watchlist cards are static, top panels stable and actors identical with only rail overflow.
 history.replaceState({},'','/profile');
 const profile=document.createElement('main');profile.innerHTML='<div data-profile><section class="panel series"><div class="stats"><button class="stat" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>574</b><span class="open-arrow">›</span></button><button class="stat" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1371</b><span class="stat-arrow">></span></button></div></section><section class="panel sports"><div class="stats"><button class="stat" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></button></div></section><section class="panel actors"><h2>Atores Favoritos</h2><div class="actor-wrap"><article><button data-person="1"><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"></button></article><article><button data-person="2"><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E"></button></article></div></section></div>';document.body.appendChild(profile);
 const root=profile.querySelector('[data-profile]');ok(T.normalizeStats314(root,1),'profile stats normalization failed');ok(T.actorRail314(root),'actor rail failed');
 const watchCards=[...root.querySelectorAll('.ct314-static-stat')];ok(watchCards.length===2,'Watchlist cards not static');ok(watchCards.every(x=>!x.hasAttribute('data-watchlist-kind')),'watchlist click contract survived');ok(!root.querySelector('.open-arrow,.stat-arrow'),'Watchlist arrows survived');
 const firstPanels=[...root.children].slice(0,2).map(x=>x.className);ok(firstPanels.some(x=>x.includes('series'))&&firstPanels.some(x=>x.includes('sports')),'stats panels not moved to top');
 const rail=root.querySelector('.ct314-actor-rail'),section=root.querySelector('.ct314-actor-section'),images=[...root.querySelectorAll('.ct314-actor-image')];ok(rail&&section&&images.length===2,'actor classes missing');
 const a=images.map(x=>x.getBoundingClientRect());ok(a.every(x=>Math.round(x.width)===132&&Math.round(x.height)===176),'actor images are not identical');ok(getComputedStyle(rail).overflowX==='auto'&&getComputedStyle(section).overflowX==='hidden','actor scrollbar not isolated to rail');
 profile.remove();
 // F1: real qualifying columns, final result delta/DNF/fastest and session persistence bridge.
 const qualifying=[{position:'1',Driver:{givenName:'A',familyName:'One'},Constructor:{name:'Team A'},Q1:'1:20',Q2:'1:19',Q3:'1:18'},{position:'2',Driver:{givenName:'B',familyName:'Two'},Constructor:{name:'Team B'},Q1:'1:21',Q2:'1:20',Q3:'1:19'}];
 const results=[{position:'1',positionText:'1',grid:'3',Driver:{givenName:'A',familyName:'One'},Constructor:{name:'Team A'},Time:{time:'1:30:00'},status:'Finished',FastestLap:{rank:'1'}},{position:'20',positionText:'R',grid:'5',Driver:{givenName:'B',familyName:'Two'},Constructor:{name:'Team B'},status:'Engine'}];
 const qh=document.createElement('div');qh.innerHTML=T.qualifyingTable314(qualifying);ok(qh.textContent.includes('Q1 / Q2 / Q3')&&qh.textContent.includes('1:18'),'qualifying grid details missing');
 const rh=document.createElement('div');rh.innerHTML=T.resultTable314(results);ok(rh.textContent.includes('Δ +2'),'position delta missing');ok(rh.querySelector('.ct314-dnf')&&rh.querySelector('.ct314-fastest'),'DNF/fastest markers missing');
 let persisted=null;T.setTestBridge({f1History:async()=>[],qualifying:async()=>qualifying,results:async()=>results,setF1Watch:async p=>{persisted=p;return{}}});
 const race={season:2026,round:1,raceName:'GP Teste',date:'2026-01-04',time:'15:00:00Z',Qualifying:{date:'2026-01-03',time:'15:00:00Z'},Circuit:{circuitName:'Circuito Teste',Location:{locality:'Cidade',country:'Brasil'}}};
 ok(T.calendarF1314({season:2026,schedule:[race]}).includes('data-ct314-f1-race'),'calendar GP not clickable');
 await T.openF1(race);await new Promise(r=>setTimeout(r,40));const modal=document.querySelector('[data-ct314-f1-modal]');ok(modal,'F1 detail modal missing');ok(modal.textContent.includes('Grid de Largada')&&modal.textContent.includes('Resultado Final de Chegada'),'F1 sections absent');
 const watch=modal.querySelector('[data-ct314-f1-watch="f1:2026:1:qualifying"]');ok(watch&&!watch.disabled,'qualifying watch control missing');await T.toggleF1(watch);ok(persisted&&persisted.p_provider_event_id==='f1:2026:1:qualifying'&&persisted.p_session_kind==='qualifying','F1 session persistence payload invalid');modal.remove();
 document.documentElement.dataset.ct314done='1';document.documentElement.dataset.ct314errors=String(window.__ct314Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct314probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct314Errors||[]) }},4500)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct314done="1"/.test(out)){const m=out.match(/data-ct314probe="([^"]*)"/);throw new Error('R314_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1600))}
const em=out.match(/data-ct314errors="([^"]*)"/);if(em?.[1])throw new Error('R314_BROWSER page errors '+em[1]);
console.log('R314_BROWSER_OK nine tabs + strict exclusion + static Profile + actor rail + F1 details/session watch');
