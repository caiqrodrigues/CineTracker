import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v489.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const yes=(v,m)=>{if(!v)throw new Error('r489 regression: '+m)},release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const fn=(source,name)=>{const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);yes(m,'function '+name);const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++;continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}yes(depth===0,'balanced '+name);return source.slice(m.index,i)};
yes(pkg.version==='0.3.16'&&rootPkg.version==='0.3.16','versions');
yes(release.version==='0.3.16'&&release.revision==='r489-official-0.3.16','release');
yes(html.includes('app-v489.js')&&html.includes('app-v489.css')&&sw.includes('app-v489.js'),'assets');
yes(js.includes("window.__ctR489Marker='video-truth+single-home-owner+movies-real-2x3+foryou-one-rpc+profile-fast-12+sports-no-flicker'"),'marker');
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
yes(fn(r388,'loadSeries').includes('cinetracker_home_series_v452'),'Home v452');
yes(!fn(r388,'refreshTv391').includes('cinetracker_home_series_v391'),'no stale v391 series overwrite');
yes(fn(r388,'refreshTv391').includes('cinetracker_home_series_v452'),'refresh uses v452');
yes(fn(r388,'loadMovies').includes('cinetracker_home_movies_v405')&&fn(r388,'loadMovies').includes('p_offset'),'movies v405 paging');
yes(fn(r388,'movieRow').includes('ct489-movie-card'),'native movie card');
yes(fn(r388,'renderMoviesAll').includes("classList.add('ct489-movie-grid')"),'movie grid');
const frame=fn(r388,'frame');yes(frame.indexOf("data-ct388-series-loading")<frame.indexOf("historySection('episodes')"),'Continue before History');yes(frame.indexOf("movieSection()")<frame.indexOf("historySection('movies')"),'Watchlist before watched history');
yes(fn(r388,'renderSeries').includes("insertAdjacentHTML('beforebegin'"),'series stays before History');
yes(!fn(r388,'scheduleHome393').includes('1400'),'no delayed scroll chain');
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
yes(fn(r399,'enterHome399').includes('__ctR388'),'r399 delegates Home');yes(fn(r399,'refreshSeries399').includes('__ctR388'),'r399 series delegate');yes(fn(r399,'ensureMovies399').includes('__ctR388'),'r399 movies delegate');
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';"),load=fn(r464,'load');yes(load.includes('cinetracker_foryou_payload_v489'),'single ForYou RPC');yes(!load.includes('for(const delay of'),'no retry delay ladder');
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");yes(fn(r476,'loadProfile').includes('cinetracker_profile_summary_v489'),'fast profile summary');yes(fn(r476,'openAll').includes('cinetracker_profile_lists_v485'),'full list deferred');yes(fn(r476,'renderPanel').includes('profile?.counts'),'complete counts');yes(r476.includes('const LIMIT=12'),'limit 12');
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");yes(!fn(r477,'settleProfile').includes('for(const ms of'),'no Profile repaint ladder');yes(fn(r477,'settleProfile').includes('hideSports')&&fn(r477,'settleProfile').includes('loadSports'),'sports hide then single load');
const r298=region("window.__ctR298='stadium-real-controls+exact-foryou-live-pipeline';");yes(fn(r298,'repairProfile298').includes('return false'),'legacy Profile repair disabled');yes(!fn(r298,'reconcile298').includes("routeNow()==='profile'"),'no r298 profile loop');
yes(js.includes('grid-template-columns:repeat(auto-fill,minmax(132px,150px))')&&js.includes('aspect-ratio:2/3!important'),'strict grids');
const at=js.lastIndexOf('/* CineTracker Web 0.3.16 r489');yes(at>=0,'runtime');const own=js.slice(at);for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R489_REGRESSION_OK');
