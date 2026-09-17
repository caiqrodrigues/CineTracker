import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r307.mjs');

let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){
  try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
}
if(!bin)throw Error('Chromium unavailable');

const dist=resolve('dist');
const base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct307Errors=[];addEventListener('error',e=>__ct307Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct307Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw Error(m)};
 ok(window.__ctR307Test,'r307 runtime unavailable');
 ok(typeof window.__ctR307EarlyShouldBypass==='function','early bypass unavailable');
 ok(window.__ctR306&&typeof window.__ctR306.setTestBridge==='function','r306 bridge unavailable');

 /* Reproduce the Raw failure shape. data-tmdb=0 keeps the canonical r279 writer inert,
    while the old r306 bug would still derive tv:4656 from the parent card and mark the
    entire series through markSeen. */
 const seen=[];
 __ctR306.setTestBridge({markSeen:async(t,id)=>seen.push(t+':'+id)});
 const home=document.createElement('div');
 home.innerHTML='<article id="raw-card" data-media="tv:4656"><button id="raw-watch" type="button" data-ct279-watch="episode" data-tmdb="0" data-season="34" data-episode="37" aria-label="Marcar episódio como assistido">Marcar</button></article>';
 document.body.appendChild(home);
 const raw=home.querySelector('#raw-watch');
 ok(__ctR307EarlyShouldBypass(raw)===true,'Raw exact watch is not bypassed');
 raw.click();
 await new Promise(r=>setTimeout(r,30));
 ok(!seen.includes('tv:4656'),'Raw episode click reached series-level markSeen');

 /* Generic related-title actions must remain functional. */
 const related=document.createElement('article');
 related.className='ct169-related-card';
 related.dataset.media='tv:124';
 related.innerHTML='<button id="related-seen" type="button" aria-label="Visto">✓ Visto</button>';
 document.body.appendChild(related);
 related.querySelector('#related-seen').click();
 await new Promise(r=>setTimeout(r,30));
 ok(seen.includes('tv:124'),'generic related seen action was broken');
 home.remove();related.remove();

 /* Raw/SmackDown count only episodes after the watched frontier. */
 const show={last_episode_to_air:{season_number:34,episode_number:37,air_date:'2026-09-14'},seasons:[{season_number:34,episode_count:52}]};
 const before={tmdb_id:4656,title:'Raw',watched_episodes:246,__ct275WatchedKeys:[{s:34,e:36}],home_bucket:'continue',next_season_number:34,next_episode_number:37};
 const after={tmdb_id:4656,title:'Raw',watched_episodes:247,__ct275WatchedKeys:[{s:34,e:37}],home_bucket:'continue',next_season_number:34,next_episode_number:38,next_episode_title:'velho',next_episode_air_date:'2026-09-21'};
 ok(__ctR307Test.legacyPending(before,show)===1,'frontier should expose exactly one new Raw episode');
 ok(__ctR307Test.legacyPending(after,show)===0,'frontier should expose zero after latest Raw is watched');
 __ctR307Test.applyFreshAvailability(after,show);
 ok(after.available_episodes===0&&after.history_missing_episodes===0,'caught-up Raw still reports pending episode');
 ok(after.home_bucket==='up_to_date'&&after.is_caught_up===true,'caught-up Raw bucket');
 ok(after.next_episode_number===null&&after.next_season_number===null,'caught-up Raw stale next episode not cleared');

 /* Current Discover selectors, not the old synthetic selector. */
 history.replaceState({},'','/discover');
 const discover=document.createElement('div');
 discover.innerHTML='<main class="content"><button data-ct263-discover-tab="top10" class="active">Top 10</button><div data-ct288-discover><section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div></section></div></main>';
 document.body.appendChild(discover);
 __ctR306.stabilize();
 ok(discover.querySelector('.content').classList.contains('ct306-top10'),'Top10 current selector not detected');
 const shell=discover.querySelector('.ct288-top-shell');
 ok(getComputedStyle(shell).marginTop==='0px','Top10 current shell CSS not applied');
 discover.remove();

 /* Real Profile producer uses .stat, not .stat-card. */
 history.replaceState({},'','/profile');
 const profile=document.createElement('div');
 profile.innerHTML='<main class="content"><div data-profile><section class="panel"><h2>Estatísticas</h2><div class="stats ct-r238-profile-grid"><div class="stat"><small>Episódios</small><b>5</b></div><div class="stat"><small>Filmes</small><b>2</b></div><div class="stat"><small>Séries Watchlist</small><b>12</b><span class="stat-link-icon">›</span></div><div class="stat"><small>Filmes Watchlist</small><b>34</b><span class="open-arrow">Abrir</span></div></div></section></div></main>';
 document.body.appendChild(profile);
 __ctR306.stabilize();
 ok(!profile.querySelector('.stat-link-icon')&&!profile.querySelector('.open-arrow'),'Profile real .stat arrows were not removed');
 profile.remove();

 __ctR306.setTestBridge(null);
 const d=document.documentElement.dataset;
 d.ct307raw=String(true);
 d.ct307frontier=String(true);
 d.ct307top=String(true);
 d.ct307profile=String(true);
 d.ct307errors=String(__ct307Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct307probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct307Errors||[]) }},3600)</script>`;

const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html'};
const server=createServer(async(req,res)=>{
  try{
    const raw=(req.url||'/').split('?')[0];
    if(raw==='/'||raw==='/index.html'){res.writeHead(200,{'content-type':mime['.html']});res.end(html);return}
    const p=resolve(dist,raw.replace(/^\/+/,''));const body=await readFile(p);
    res.writeHead(200,{'content-type':mime[extname(p)]||'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404);res.end('x')}
});
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});

let out='',err='';
try{
 const child=spawn(bin,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=9000','--dump-dom',`http://127.0.0.1:${server.address().port}/`],{stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
 const code=await new Promise((ok,fail)=>{const t=setTimeout(()=>{child.kill('SIGKILL');fail(Error('timeout'))},35000);child.once('close',c=>{clearTimeout(t);ok(c)});child.once('error',fail)});
 if(code!==0)throw Error('chrome '+code+' '+err.slice(-500));
 const tag=out.match(/<html[^>]*>/)?.[0]||'';
 for(const x of['data-ct307raw="true"','data-ct307frontier="true"','data-ct307top="true"','data-ct307profile="true"'])if(!tag.includes(x))throw Error('R307_BROWSER missing '+x+' '+tag);
 if((tag.match(/data-ct307errors="([^"]*)"/)?.[1]||''))throw Error('R307_BROWSER page error '+tag);
 if(tag.includes('data-ct307probe='))throw Error('R307_BROWSER probe '+tag);
 console.log('R307_BROWSER_OK Raw exact click cannot bulk-mark series; frontier/Top10/Profile verified in shipped bundle');
}finally{await new Promise(r=>server.close(r))}
