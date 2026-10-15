import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r528.mjs');
const [js,css]=await Promise.all([readFile(resolve('dist/app-v528.js'),'utf8'),readFile(resolve('dist/app-v528.css'),'utf8')]);
const ok=(v,m)=>{if(!v)throw new Error('R528_BEHAVIOR '+m)};
function region(marker){const at=js.indexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('region bounds '+marker);return js.slice(start,end+6)}
function extractNamed(source,name,needle=''){const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(','g'),hits=[...source.matchAll(re)],out=[];for(const h of hits){const start=h.index,open=source.indexOf('{',start+h[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth===0){const src=source.slice(start,i);if(!needle||src.includes(needle))out.push(src)}}if(out.length!==1)throw new Error('extract '+name+' '+needle+' count='+out.length);return out[0]}
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r321=region("window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';");
const r520=region("window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';");
const rows=v=>Array.isArray(v)?v:[],esc=v=>String(v??''),mediaId=x=>Number(x?.media_id||x?.id||0)||0,titleOf=x=>String(x?.title||x?.name||'');
const movieRowSrc=extractNamed(r388,'movieRow','ct274MovieMeta');
const movieRow=new Function('rows','esc','mediaId','titleOf','ct274Row','ct274MovieMeta','ct274MovieWatchAction','ct274MovieAttrs',movieRowSrc+';return movieRow;')(
 rows,esc,mediaId,titleOf,
 (x,o)=>'<div class="media-row ct274-media-card"><div class="thumb"></div><div><b>'+x.title+'</b><small>'+o.meta+'</small></div><span>'+o.action+'</span></div>',
 x=>String(x.release_year||''),()=>'<button>✓</button>',()=>''
);
const movieRows=Array.from({length:12},(_,i)=>movieRow({media_id:500+i,tmdb_id:1500+i,media_type:'movie',title:'Filme '+i,release_year:2025,runtime_minutes:100})).join('');
const mainSrc=extractNamed(r388,'homeMain393','continuar');
const reqSrc=extractNamed(r388,'homeRequest507','__ctR528HomeAnchor');
const alignSrc=extractNamed(r388,'homeAlign507','ct528HomeStart');
const markMainSrc=extractNamed(r388,'homeMarkMain507','homeAlign507');
const markHistSrc=extractNamed(r388,'homeMarkHistory507','homeAlign507');
const selectSrc=extractNamed(r321,'selectTopProvider528','paintTop321');
const cardSrc=extractNamed(js,'cardHtml',"pendingUnit=key==='f1'?'GP':'evento'");

const topHarness=new Function('sleep',`
 let state={topProvider:0},topToken=0,ct171TopProvider=0,content={innerHTML:'',provider:0},buttons=[];
 const document={documentElement:{dataset:{}}},qa=()=>buttons,q=s=>s==='[data-ct321-top-content]'?content:null,esc=v=>String(v);
 async function paintTop321(provider,token,force){await sleep(provider===8?90:10);if(token!==topToken)return false;content.provider=provider;content.innerHTML='10:10';return true}
 ${selectSrc}
 return {select:selectTopProvider528,content,getToken:()=>topToken};
`)(ms=>new Promise(r=>setTimeout(r,ms)));
topHarness.select(8);setTimeout(()=>topHarness.select(9),5);await new Promise(r=>setTimeout(r,140));
ok(topHarness.content.provider===9&&topHarness.content.innerHTML==='10:10'&&topHarness.getToken()===2,'Top10 stale provider request won');

const cardHtml=new Function('window','currentYear','esc',cardSrc+';return cardHtml;')({__ctR516SpecialSummary:{get:()=>({watched:999,total:999})}},()=>2026,esc);
ok(cardHtml('f1',{series:{season:2026,watched_episodes:17,total_episodes:23,available_episodes:0}}).includes('17/23 GPs'),'F1 annual count');
ok(cardHtml('ufc',{series:{season:2026,watched_episodes:14,total_episodes:41,available_episodes:2}}).includes('14/41 eventos'),'UFC annual count');
ok(!cardHtml('wwe',{series:{season:2026,watched_episodes:7,total_episodes:10,available_episodes:0}}).includes('999'),'global special total leaked');

const probe=`(()=>{try{
 const yes=(v,m)=>{if(!v)throw new Error(m)},q=(s,r=document)=>r.querySelector(s);
 let homeAnchorKind507='series',homeAnchorPending507=false,homeUserMoved393=false,homeAnchorToken393=0;
 const homeMainReady507={series:false,movies:false},homeHistoryReady507={series:false,movies:false};
 const routeNow=()=> 'home',activeKind=()=> 'series';
 function homeForceOrder500(k){const v=q('[data-home-view="'+k+'"]'),h=q('[data-ct388-history="'+(k==='movies'?'movies':'episodes')+'"]',v),m=k==='movies'?q('[data-ct388-movie-watch]',v):[...v.children].find(x=>x.matches('[data-ct388-series-section]'));if(v&&h&&m&&v.firstElementChild!==h)v.insertBefore(h,v.firstElementChild);return true}
 function homeScrollRoot500(){return document.scrollingElement||document.documentElement}
 function homeOffset500(t){return t.getBoundingClientRect().top+window.scrollY}
 function homeSetScroll500(_r,v){window.scrollTo(0,Math.max(0,v))}
 ${mainSrc}
 ${reqSrc}
 ${alignSrc}
 ${markMainSrc}
 ${markHistSrc}
 homeRequest507('series',true);homeMarkMain507('series');
 const target=q('[data-ct388-series-section]');let wanted=Math.max(8,Math.ceil(Number(q('.home-tabs').getBoundingClientRect().bottom||0))+8);yes(Math.abs(target.getBoundingClientRect().top-wanted)<4,'initial-anchor '+target.getBoundingClientRect().top+'/'+wanted);
 q('[data-ct388-history="episodes"]').style.height='1300px';homeMarkHistory507('series');homeAlign507('series',true);
 wanted=Math.max(8,Math.ceil(Number(q('.home-tabs').getBoundingClientRect().bottom||0))+8);yes(Math.abs(target.getBoundingClientRect().top-wanted)<4,'final-anchor '+target.getBoundingClientRect().top+'/'+wanted);yes(window.scrollY>1000,'history-not-hidden '+window.scrollY);
 const list=q('.ct528-movie-list'),items=[...list.children],cs=getComputedStyle(list);yes(cs.display==='flex'&&cs.flexDirection==='column','movie-list-css '+cs.display+'/'+cs.flexDirection);yes(items.length===12&&items.every(x=>x.classList.contains('media-row')),'movie-list-rows');const a=items[0].getBoundingClientRect(),b=items[1].getBoundingClientRect();yes(b.top>a.bottom,'movies-not-vertical '+a.bottom+'/'+b.top);yes(list.scrollWidth<=list.clientWidth+2,'movie-horizontal-overflow');
 document.documentElement.dataset.ct528browser='ok';
}catch(e){document.documentElement.dataset.ct528browser='fail:'+String(e.message||e)}})();`;
const html='<!doctype html><html><head><meta charset="utf-8"><style>'+css+' body{margin:0}.home-tabs{height:40px}.home-section{box-sizing:border-box}.media-row{box-sizing:border-box;min-height:76px;border:1px solid #234;margin:0}.thumb{width:48px;height:64px}[data-ct388-history="episodes"]{height:900px}.continue{height:220px}.tail{height:1200px}</style></head><body><div data-home><div class="home-tabs">tabs</div><div data-home-view="series"><section class="home-section" data-ct388-history="episodes">Histórico</section><section class="home-section continue" data-ct388-series-section><div class="panel-head"><h3>Continuar assistindo</h3></div></section></div><div data-home-view="movies"><section data-ct388-history="movies">Filmes vistos</section><section data-ct388-movie-watch><div class="stack ct388-movie-stack ct528-movie-list">'+movieRows+'</div></section></div></div><div class="tail"></div><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},20000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));const m=out.match(/data-ct528browser="([^"]*)"/),state=m?.[1]||'';if(state!=='ok')throw new Error('R528_BROWSER '+state+' DOM='+out.slice(-3500));
console.log('R528_BROWSER_OK hidden-history+movie-list+special-season-counts+top10-provider-generation');