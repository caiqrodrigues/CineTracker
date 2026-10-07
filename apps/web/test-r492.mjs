import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v492.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const yes=(v,m)=>{if(!v)throw new Error('r492 regression: '+m)},release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const fn=(source,name)=>{const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);yes(m,'function '+name);const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}yes(depth===0,'balanced '+name);return source.slice(m.index,i)};
yes(pkg.version==='0.3.19'&&rootPkg.version==='0.3.19','package versions');
yes(release.version==='0.3.19'&&release.revision==='r492-official-0.3.19','release');
yes(html.includes('app-v492.js')&&html.includes('app-v492.css')&&sw.includes('ct-media-r492'),'assets');
const retired=[380,381,382,383,384,385,386,389,390,391,392,393,394,395,396,397,398,400,401,402,403,404,405,406,407,408,410,411,412,414,427,429,430,431,432,434,445,449,456,457,458,459,460,461,467,468,469,470,481,482,484,488,489];
for(const n of retired){
 const needles=['window.__ctR'+n+'={','window.__ctR'+n+' = {','window.__ctR'+n+'Marker=','window.__ctR'+n+'Marker ='];
 let at=-1;for(const needle of needles){at=js.indexOf(needle);if(at>=0)break}
 if(at<0)continue;
 let start=js.lastIndexOf('\n(()=>{',at);if(start>=0)start+=1;else if(js.startsWith('(()=>{'))start=0;
 yes(start>=0&&js.startsWith('(()=>{return;',start),'legacy r'+n+' inert');
}
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
yes(fn(r388,'loadSeries').includes('cinetracker_home_series_v492'),'compact Series RPC');
yes(fn(r388,'loadSeries').includes('p_limit_per_bucket'),'series per-bucket limit');
yes(fn(r388,'renderSeries').includes('data-ct492-series-more'),'series local more');
yes(fn(r388,'loadMovies').includes('pageSize=60'),'movies first page 60');
yes(fn(r388,'loadMovies').includes('__ctR492LoadMoreMovies'),'movies on-demand continuation');
yes(!fn(r388,'loadMovies').includes('for(let offset=120'),'automatic full Watchlist loop retired');
yes(fn(r388,'renderMoviesAll').includes('renderMoviesAll(addRows=null)'),'incremental movie render');
yes(fn(r388,'renderHome388').includes("if(kind==='movies')void loadMovies(false)"),'movies non-blocking');
const r455=region("if(window.__ctR455?.version==='1.0.245')return;");yes(fn(r455,'applyProfile455').includes('return false'),'r455 Profile painter retired');yes(fn(r455,'scheduleProfile455').includes('return false'),'r455 Profile scheduler retired');
yes(js.includes("if(r==='profile')return renderProfile491(seq);"),'single Profile dispatch');
yes(js.includes('cinetracker_profile_screen_v491'),'Profile screen payload');
yes(js.includes('cinetracker_foryou_payload_v490'),'single ForYou payload');
yes(js.includes("window.__ctR492Marker='legacy-writers-retired+series-compact-progressive+movies-paged-progressive+profile-single-owner+foryou-single-owner'"),'marker');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.19 r492'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R492_REGRESSION_OK');
