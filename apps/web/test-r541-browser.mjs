import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r541.mjs');
const js=await readFile(resolve('dist/app-v541.js'),'utf8');
function region(marker){const at=js.indexOf(marker),start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);if(at<0||start<0||end<0)throw new Error('region');return js.slice(start,end+6)}
function named(source,name){const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);if(!m)throw new Error(name);const start=m.index,open=source.indexOf('{',start+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}return source.slice(start,i)}
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';"),request=named(r388,'homeRequest507'),align=named(r388,'homeAlign507');
const prelude=`
let current='series',homeAnchorKind507='series',homeAnchorPending507=false,homeUserMoved393=false,homeAnchorToken393=0;
const homeMainReady507={series:false,movies:false},homeHistoryReady507={series:false,movies:false};
const routeNow=()=> 'home',activeKind=()=>current,q=(s,r=document)=>r.querySelector(s);
const homeForceOrder500=k=>{const v=document.querySelector('[data-home-view="'+k+'"]'),h=v.querySelector('[data-history]'),m=v.querySelector('[data-main]');if(h&&m&&h.nextElementSibling!==m)v.insertBefore(h,m);return true};
const homeMain393=k=>document.querySelector('[data-home-view="'+k+'"] [data-main]');
const root={scrollTop:0,getBoundingClientRect:()=>({top:0})};
const homeScrollRoot500=()=>root,homeOffset500=t=>Number(t.dataset.offset||0),homeSetScroll500=(_r,v)=>{root.scrollTop=v;document.documentElement.dataset.scroll=String(Math.round(v))};
`;
const probe=`
(async()=>{const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));try{
 homeRequest507('series',true);await sleep(60);
 let st=window.__ctR541HomeAnchorState;yes(st.series.initialDone===true,'series initial');yes(st.series.finalDone===false,'series final premature');yes(Number(document.documentElement.dataset.scroll)===836,'series target '+document.documentElement.dataset.scroll);
 homeMainReady507.series=true;homeHistoryReady507.series=true;yes(homeAlign507('series',true)===true,'series final align');yes(st.series.finalDone===true,'series final flag');
 current='movies';homeRequest507('movies',true);await sleep(60);st=window.__ctR541HomeAnchorState;
 yes(st.series.finalDone===true,'series state lost');yes(st.movies.initialDone===true,'movies inherited series done');yes(st.movies.finalDone===false,'movies final premature');yes(Number(document.documentElement.dataset.scroll)===1436,'movies target '+document.documentElement.dataset.scroll);
 homeMainReady507.movies=true;homeHistoryReady507.movies=true;yes(homeAlign507('movies',true)===true,'movies final align');yes(st.movies.finalDone===true,'movies final flag');
 current='series';homeRequest507('series',true);await sleep(60);st=window.__ctR541HomeAnchorState;
 yes(st.series.initialDone===true&&st.series.finalDone===false,'series did not reset on re-entry');yes(Number(document.documentElement.dataset.scroll)===836,'series re-entry target');
 const before=root.scrollTop;homeUserMoved393=true;homeMainReady507.series=true;homeHistoryReady507.series=true;yes(homeAlign507('series',true)===false,'user movement ignored');yes(root.scrollTop===before,'scroll relocked after user movement');
 const sv=document.querySelector('[data-home-view="series"]'),mv=document.querySelector('[data-home-view="movies"]');yes(sv.firstElementChild.dataset.history==='series'&&sv.children[1].dataset.main==='series','series history not above');yes(mv.firstElementChild.dataset.history==='movies'&&mv.children[1].dataset.main==='movies','movies history not above');
 document.documentElement.dataset.ct541browser='ok'
}catch(e){document.documentElement.dataset.ct541browser='fail:'+String(e?.stack||e)}})();
`;
const html='<!doctype html><html><head><style>:root{--ct533-home-bottom:156px}.home-tabs{position:fixed;top:0;height:56px}.search-global{position:fixed;top:64px;height:84px}</style></head><body><div data-page="home"><div class="home-tabs"></div><div class="search-global"></div><div data-home><div data-home-view="series"><section data-main="series" data-offset="1000"><h3>Continuar assistindo</h3></section><section data-history="series"></section></div><div data-home-view="movies"><section data-main="movies" data-offset="1600"><h3>Assistir a seguir / Watchlist</h3></section><section data-history="movies"></section></div></div></div><script>'+prelude+'</script><script>'+request+'</script><script>'+align+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=1200','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));
const state=out.match(/data-ct541browser="([^"]*)"/)?.[1]||'';if(state!=='ok')throw new Error('R541_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R541_BROWSER_OK Series/Movies independent entry anchors');