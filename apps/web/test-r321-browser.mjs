import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r321.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR321Test,R=window.__ctR321;ok(T&&R,'r321 bridge unavailable');
 history.replaceState({},'','/discover');
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setTestBridge({
   source:async()=>[media(10,'movie','Visto'),media(20,'movie','Watchlist'),media(30,'movie','Livre')],
   exact:async items=>({blocked_keys:items.filter(x=>x.tmdb_id===10||x.tmdb_id===20).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:['movie:20'],seen_keys:['movie:10'],not_interested_keys:[]}),
   activityItems:async()=>[{item_type:'episode',media_type:'tv',tmdb_id:99,media_title:'Série Teste',title:'Capítulo',season_number:2,episode_number:3,vote_average:8.1,watched_at:'2026-09-20T12:00:00Z',remaining_episodes:4,plays:2}]
 });
 T.setDiscover('trending','all');
 document.body.innerHTML='<div id="app"><div data-ct319-content data-ct315-content></div><div data-ct319-loadline hidden></div></div>';
 await R.loadPublic('trending',true);
 ok(!document.querySelector('[data-ct319-item="movie:10"]'),'seen item rendered');
 ok(!document.querySelector('[data-ct319-item="movie:20"]'),'Watchlist item rendered');
 ok(document.querySelector('[data-ct319-item="movie:30"]'),'eligible item missing');
 ok(!document.documentElement.outerHTML.includes('data-ct320-validated'),'r320 validation marker should not be required');
 const ah=T.activityHtml321({item_type:'episode',media_type:'tv',tmdb_id:99,media_title:'Série Teste',title:'Capítulo',season_number:2,episode_number:3,vote_average:8.1,watched_at:'2026-09-20T12:00:00Z',remaining_episodes:4,plays:2});
 ok(ah.includes('S02E03')&&ah.includes('Ep: Capítulo')&&ah.includes('★ 8.1')&&ah.includes('4 episódios disponíveis para ver')&&ah.includes('2x'),'history metadata incomplete');
 document.documentElement.dataset.ct321done='1';
}catch(e){document.documentElement.dataset.ct321probe='fail:'+String(e?.stack||e)}},4400)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct321done="1"/.test(out)){const m=out.match(/data-ct321probe="([^"]*)"/);throw new Error('R321_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R321_BROWSER_OK pre-render filter + visible load');
