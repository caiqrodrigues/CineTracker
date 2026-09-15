import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r297-official.mjs');
let bin='';for(const x of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');
const baseHtml=await readFile(resolve(dist,'index.html'),'utf8');
const tracker=`<script>window.__ct297Errors=[];addEventListener('error',e=>window.__ct297Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>window.__ct297Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(()=>{const a=document.querySelector('#app');document.documentElement.dataset.ct297=String(window.__ctR297||'');document.documentElement.dataset.ct297scope=String(window.__ctR295BrowseSelfScopeFix||'');document.documentElement.dataset.ct297bridge=String(window.__ctR297DiscoverBridge||'');document.documentElement.dataset.ct297browse=String(!!window.__ctR288PaintBrowse?.__ctR297R295Browse);document.documentElement.dataset.ct297foryou=String(!!window.__ctR288PaintForYou?.__ctR297R295R296ForYou);document.documentElement.dataset.ct297load=String(!!window.__ctR288LoadDiscover?.__ctR297R295Load);document.documentElement.dataset.ct297app=String((a?.innerHTML||'').length);document.documentElement.dataset.ct297errors=String((window.__ct297Errors||[]).join(' | '));},3500);</script>`;
const html=baseHtml.replace('</head>',tracker+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.html':'text/html; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const raw=(req.url||'/').split('?')[0];if(raw==='/'||raw==='/index.html'){res.writeHead(200,{'content-type':mime['.html']});res.end(html);return;}const clean=raw.replace(/^\/+/,''),path=resolve(dist,clean);if(!path.startsWith(dist)){res.writeHead(403);res.end('forbidden');return;}const body=await readFile(path);res.writeHead(200,{'content-type':mime[extname(path)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('not found');}});
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
const port=server.address().port,url=`http://127.0.0.1:${port}/`;
const args=['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=1280,900','--virtual-time-budget=5000','--dump-dom',url];
let out='',err='';
try{
  const child=spawn(bin,args,{stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
  const code=await new Promise((ok,fail)=>{const timer=setTimeout(()=>{child.kill('SIGKILL');fail(new Error('Chromium timeout'))},30000);child.once('error',fail);child.once('close',c=>{clearTimeout(timer);ok(c)})});
  if(code!==0)throw new Error('Chromium exit '+code+' '+err.slice(-1000));
  const tag=out.match(/<html[^>]*>/)?.[0]||'';
  for(const x of[
    'data-ct297="r288-live-owner-hotfix-full-bundle"',
    'data-ct297scope="decorate-browse-host-self-and-descendants"',
    'data-ct297bridge="r288-live-owners+r295-personal+r296-strict"',
    'data-ct297browse="true"',
    'data-ct297foryou="true"',
    'data-ct297load="true"'
  ])if(!tag.includes(x))throw new Error('R297_FULL_BUNDLE live owner marker missing '+x+' '+tag);
  if(out.includes('r295 browse self-scope fix missing r295 authority'))throw new Error('R297_FULL_BUNDLE inherited fatal r295 scope error survived');
  const m=tag.match(/data-ct297app="(\d+)"/),appLen=Number(m?.[1]||0);
  if(appLen<=0)throw new Error('R297_FULL_BUNDLE app remained empty '+tag);
  const em=tag.match(/data-ct297errors="([^"]*)"/),errors=em?.[1]||'';
  if(errors)throw new Error('R297_FULL_BUNDLE pageerror '+errors);
  console.log('R297_FULL_BUNDLE_BOOT_OK exact app-v297.js booted, rendered #app and connected r295/r296 to all r288 live Discover owners');
}finally{await new Promise(r=>server.close(r));}
