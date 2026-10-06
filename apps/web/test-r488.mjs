import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v488.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r488 regression: '+m)};
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const fn=(source,name)=>{const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);yes(m,'function '+name);const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++;continue}if(c==='\\'){i++;continue}}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}return source.slice(m.index,i)};

yes(pkg.version==='0.3.15'&&rootPkg.version==='0.3.15','package versions');
yes(release.version==='0.3.15'&&release.revision==='r488-official-0.3.15','release');
yes(html.includes('app-v488.js')&&html.includes('app-v488.css'),'assets');
yes(sw.includes('app-v488.js')&&sw.includes('app-v488.css'),'service worker');
for(const old of ['window.__ctR485Marker=','window.__ctR486Marker=','window.__ctR487Marker='])yes(!js.includes(old),'old competing runtime '+old);
yes(js.includes("window.__ctR488Marker='single-authority+home-singleflight-skeleton+movies-2x3+foryou-strict-fallback+top10-2x3+profile-12'"),'r488 marker');

const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const loadSeries=fn(r388,'loadSeries'),loadHistory=fn(r388,'loadHistory'),renderHome=fn(r388,'renderHome388');
yes(loadSeries.includes('__ctR488HomeSeries')&&loadSeries.includes('cinetracker_home_series_v452'),'Home series singleflight bridge');
yes(!loadSeries.includes('cinetracker_home_series_v391'),'retired v391 series authority');
yes(loadHistory.includes('__ctR488HomeHistory')&&loadHistory.includes('cinetracker_home_history_v391'),'Home history singleflight bridge');
yes(renderHome.includes('__ctR488PaintHomeSkeleton'),'Home skeleton after frame');
yes(r388.includes('animate-pulse ct488-home-skeleton'),'Home skeleton in first frame');

const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const refreshSeries=fn(r399,'refreshSeries399');
yes(refreshSeries.includes('__ctR488HomeSeries')&&refreshSeries.includes('v488-singleflight'),'r399 shared series authority');

const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const fetchPool=fn(r464,'fetchPool');
yes(fetchPool.includes('__ctR488FetchPool'),'single For You pool owner');
yes(js.includes('cinetracker_discover_fresh_v485')&&js.includes('cinetracker_discover_fresh_v421'),'bounded DB fallback chain');
yes(js.includes('tmdbFresh')&&js.includes('cinetracker_discover_filter_v322'),'speculative strict TMDB fallback');

yes(js.includes('grid-template-columns:repeat(auto-fill,minmax(132px,150px))'),'Movies compact grid');
yes(js.includes('aspect-ratio:2/3!important')&&js.includes('object-fit:cover!important'),'2:3 object-cover geometry');
yes(js.includes('[data-ct321-top-content] .ct319-top-row'),'Top 10 strict selectors');

const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
yes(r476.includes('const LIMIT=12')&&r476.includes('data.slice(0,LIMIT)'),'Profile source limit 12');
yes(r476.includes('removeLargeMore(panel)')&&r476.includes('ct476-header-more'),'header-only Profile More');
yes(js.includes('slice(12).forEach(x=>x.remove())'),'final Profile trim');

const at=js.lastIndexOf('/* CineTracker Web 0.3.15 r488');yes(at>=0,'r488 runtime start');const r488=js.slice(at);
for(const forbidden of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r488.includes(forbidden),'forbidden '+forbidden);
console.log('WEB_R488_REGRESSION_OK');
