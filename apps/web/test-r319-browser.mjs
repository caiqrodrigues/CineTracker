import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r319.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR319Test;ok(T,'r319 bridge unavailable');
 history.replaceState({},'','/discover');
 const out={at:Date.now(),ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()};
 T.parseCanonical319({
  blocked_keys:['movie:100','tv:200','movie:300'],
  seen_keys:['movie:100','tv:200'],
  watch_keys:['movie:300'],
  movie_ids:[100,300],
  tv_ids:[200],
  aliases:[{media_type:'movie',tmdb_id:300,title:'Na Watchlist',release_year:2026,is_watchlist:true,is_seen:false}]
 },out);
 ok(out.ready&&out.blocked.has('movie:100')&&out.blocked.has('tv:200')&&out.watch.has('movie:300'),'canonical payload parser failed');
 T.setPersonal({blocked:[...out.blocked],seen:[...out.seen],watch:[...out.watch],aliases:[...out.aliases]});
 T.setDiscover('trending','all');
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 const clean=T.strict319([media(100,'movie','Visto'),media(200,'tv','Série vista'),media(300,'movie','Watchlist'),media(400,'movie','Livre')],undefined,true);
 ok(clean.length===1&&clean[0].tmdb_id===400,'strict canonical exclusion failed');
 T.setPersonal({blocked:[],seen:[],watch:[],aliases:[]});
 const noAuthority={ready:false,blocked:new Set(),seen:new Set(),watch:new Set(),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()};
 ok(T.strict319([media(400,'movie','Livre')],noAuthority,true).length===0,'fail-closed did not block rendering');
 const mount=document.createElement('main');mount.innerHTML=T.shell319();document.body.appendChild(mount);
 T.setPersonal({blocked:['movie:100','tv:200','movie:300'],seen:['movie:100','tv:200'],watch:['movie:300'],aliases:[]});
 T.paintPublic319([media(100,'movie','Visto'),media(300,'movie','Watchlist'),media(400,'movie','Livre')],'trending',{at:Date.now(),ready:true,blocked:new Set(['movie:100','movie:300']),seen:new Set(['movie:100']),watch:new Set(['movie:300']),aliases:new Set(),seenAliases:new Set(),watchAliases:new Set()});
 ok(!mount.querySelector('[data-ct319-item="movie:100"]'),'seen item reached HTML');
 ok(!mount.querySelector('[data-ct319-item="movie:300"]'),'Watchlist item reached HTML');
 ok(mount.querySelector('[data-ct319-item="movie:400"]'),'eligible item missing');
 document.documentElement.dataset.ct319done='1';
}catch(e){document.documentElement.dataset.ct319probe='fail:'+String(e?.stack||e)}},4600)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct319done="1"/.test(out)){const m=out.match(/data-ct319probe="([^"]*)"/);throw new Error('R319_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R319_BROWSER_OK canonical seen/watchlist exclusion + fail-closed');
