import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r516.mjs');
const js=await readFile(resolve('dist/app-v516.js'),'utf8'),css=await readFile(resolve('dist/app-v516.css'),'utf8');
function region(anchor){const at=js.indexOf(anchor);if(at<0)throw new Error('missing '+anchor);const s=js.lastIndexOf('(()=>{',at),e=js.indexOf('\n})();',at);if(s<0||e<0)throw new Error('bounds '+anchor);return js.slice(s,e+6)}
function fn(source,name){const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);if(!m)throw new Error('fn '+name);const open=source.indexOf('{',m.index+m[0].length);let d=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')d++;else if(c==='}'){d--;if(d===0){i++;break}}}return source.slice(m.index,i)}
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';"),movieFns=[fn(r388,'movieRow'),fn(r388,'renderMoviesAll'),fn(r388,'loadMovies')].join('\n');
const r512=region("window.__ctR512Marker='r514-stable-historical-seasons+movie-2x3-rail+canonical-f1-sync';"),card=fn(r512,'cardHtml');
const r513=region("window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';"),screenRender=fn(r513,'render');
const movies=Array.from({length:60},(_,i)=>({media_type:'movie',media_kind:'movie',media_id:2000+i,tmdb_id:2000+i,title:'Movie '+i,poster_path:'/p.jpg',release_year:2026,runtime_minutes:100,vote_average:8.1,added_at:'2026-10-13T00:00:00Z'}));
const prelude=`
const q=(s,r=document)=>r?.querySelector?.(s)||null,rows=v=>Array.isArray(v)?v:[],esc=v=>String(v??''),img=p=>p,titleOf=x=>x.title||'',mediaId=x=>Number(x.media_id||0);
const routeNow=()=> 'home',activeKind=()=> 'movies',timeout=p=>Promise.resolve(p),cacheSet=()=>{},ct274MovieMeta=x=>String(x.release_year||''),ct274MovieWatchAction=()=>'',ct274MovieAttrs=()=>'',homeForceOrder500=()=>{},homeMarkMain507=()=>{};
let hMovies=[],hMoviesTask=null,hMoviesRun=0,movieNodes=new Map(),movieSort='added_desc';const HM='hm';const sortedMovies=()=>[...hMovies];
const rpc=async(name,args)=>{if(name==='cinetracker_home_movies_v405')return {rows:${JSON.stringify(movies)},count:1392};if(name==='cinetracker_watchlist_full_v376')return {rows:[],count:0};throw new Error(name)};
window.__ctR516SpecialSummary={get:key=>key==='f1'?{watched:87,total:1350}:{watched:17,total:750}};
const currentYear=()=>2026;
`+movieFns+'\n'+card+'\n'+`
const eventHtml=()=>'';let state={type:'f1',season:2026,loading:false,data:{series:{season:2026,watched_episodes:14,total_episodes:52},seasons:[2026],events:[]}};
`+screenRender;
const probe=`
(async()=>{const ok=(v,m)=>{if(!v)throw new Error(m)};try{
 await loadMovies(true);await new Promise(r=>setTimeout(r,20));
 ok(document.querySelectorAll('.ct514-movie-card').length===60,'Watchlist '+document.querySelectorAll('.ct514-movie-card').length);
 ok(document.querySelector('[data-ct388-movie-count]').textContent.includes('1.392'),'Watchlist total');
 const pr=document.querySelector('.ct514-movie-card .poster').getBoundingClientRect();ok(pr.width>0&&Math.abs(pr.height/pr.width-1.5)<.04,'movie 2:3 '+pr.width+'x'+pr.height);
 const f=document.createElement('div');f.innerHTML=cardHtml('f1',{series:{season:2026,watched_episodes:14,total_episodes:52,available_episodes:0}});ok(f.textContent.includes('87/1.350 eventos assistidos'),'F1 global '+f.textContent);ok(f.textContent.includes('T2026 · 14/52 sessões'),'F1 season '+f.textContent);
 const u=document.createElement('div');u.innerHTML=cardHtml('ufc',{series:{season:2026,watched_episodes:26,total_episodes:95,available_episodes:0}});ok(u.textContent.includes('26/750 eventos assistidos'),'UFC global '+u.textContent);ok(u.textContent.includes('T2026 · 26/95 eventos'),'UFC season '+u.textContent);
 render();const screen=document.querySelector('[data-ct513-series-screen]');ok(screen.textContent.includes('Temporada: 14/52 sessões'),'screen season');ok(screen.textContent.includes('Série: 87/1.350 eventos assistidos'),'screen global');
 document.documentElement.dataset.ct516browser='ok';
}catch(e){document.documentElement.dataset.ct516browser='fail:'+String(e?.stack||e)}})();
`;
const html='<!doctype html><html><head><style>'+css+'body{margin:0;background:#02090f;color:white}.fixture{width:1100px;margin:10px}</style></head><body><div class="fixture"><div data-home-view="movies"><section data-ct388-movie-watch data-ct492-total="1392"><span data-ct388-movie-count></span><div class="ct388-movie-stack ct514-movie-rail"></div></section></div></div><script src="/prelude.js"></script><script src="/probe.js"></script></body></html>';
const assets=new Map([['/',{type:'text/html',body:html}],['/prelude.js',{type:'application/javascript',body:prelude}],['/probe.js',{type:'application/javascript',body:probe}]]);
const server=createServer((req,res)=>{const a=assets.get(new URL(req.url,'http://x').pathname);if(!a){res.writeHead(404);res.end();return}res.writeHead(200,{'content-type':a.type,'cache-control':'no-store'});res.end(a.body)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=2500','--window-size=1280,900','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>child.kill('SIGTERM'),35000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));const m=out.match(/data-ct516browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R516_BROWSER '+state+' DOM='+out.slice(-7000));console.log('R516_BROWSER_OK Watchlist 60/1392 + global/season special progress');
