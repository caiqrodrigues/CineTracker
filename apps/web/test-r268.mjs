import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v268.js','app-v268.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const ok=(cond,msg)=>{if(!cond)throw new Error('R268 regression: '+msg)};
const has=(s,x,msg=x)=>ok(s.includes(x),msg);
has(js,"window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';",'version identity');
has(js,"const REVISION='r268-official-1.0.59';",'revision identity');
has(js,"window.__ctR268='home-history-authority+inline-right-watch'",'r268 marker');
has(js,"window.__ctR268Home='canonical-history+same-row-right-watch'",'Home marker');
has(js,'CT268_HOME_FIX_START','Home fix runtime start');
has(js,'CT268_HOME_FIX_END','Home fix runtime end');
ok((js.match(/__ctHistoryAuthoritative=false/g)||[]).length>=2,'both restored fast caches are non-authoritative');
ok((js.match(/window\.__ctHomeHistoryPending=true/g)||[]).length>=2,'both restored fast caches arm history gate');
has(js,'pack.data.__ctHistoryAuthoritative=false;pack.data.__ctFastHomeCache=true;window.__ctHomeHistoryPending=true;return pack.data;','restored fast-cache authority flag');
has(js,'homeCache=prepareHome259(d||{});if(homeCache)homeCache.__ctHistoryAuthoritative=true;window.__ctHomeHistoryPending=false;','canonical r5 authority flag');
has(js,"if(title!=='historico recente'&&title!=='filmes vistos')continue;",'cached history sections identified');
has(js,"new MutationObserver(ct268Schedule).observe(document.documentElement,{childList:true,subtree:true});",'DOM authority reconciler');
has(js,"row.querySelector(':scope > .ct266-watch-action')",'watch action remains direct child of row');
ok(!js.includes('const ct268PaintHomeBase=paintHome'),'r268 does not depend on private paintHome scope');
has(css,'[data-home] .media-row.ct266-home-watch-host{position:relative!important;padding-right:48px!important}','row reserves right-side watch space');
has(css,'[data-home] .media-row.ct266-home-watch-host>.ct266-watch-action{position:absolute!important;right:10px!important','watch glyph absolute inside row at right');
has(css,'top:50%!important','watch glyph vertically centered');
has(css,'transform:translateY(-50%)!important','watch glyph centered transform');
for(const x of[
 "window.__ctR267Discover='atomic-tabs+recursive-personal-exclusions'",
 "window.__ctR267Detail='r169-rich-producer-local-x'",
 "window.__ctR267Sports='r266-stable-preserved'",
 'CT267_PERSONAL_START','CT267_DISCOVER_TRANSITION_START','CT267_DETAIL_HELPERS_START',
 'ct169-season-row ct267-detail-x','ct169-season-chart-carousel ct267-detail-x','ct169-cast-row ct267-detail-x','ct169-related-row ct267-detail-x'
])has(js,x,'preserve r267 '+x);
ok(!/ct26[5-8]AfterF1Paint/.test(js),'no cross-scope Sports callback');
has(html,'app-v268.js','new JS asset');has(html,'app-v268.css','new CSS asset');ok(!html.includes('app-v267.js')&&!html.includes('app-v267.css'),'no r267 asset refs in HTML');
const meta=JSON.parse(release);ok(meta.version==='1.0.59'&&meta.revision==='r268-official-1.0.59','release identity');ok(meta.home_history_authority===true&&meta.home_watch_inline_right===true,'release fix flags');ok(meta.discover==='r267-preserved'&&meta.detail==='r267-preserved'&&meta.sports==='r267-preserved','frozen Web surfaces preserved');ok(meta.android==='1.0.20/10062','Android baseline preserved');
has(sw,"const CACHE='ct-web-1.0.59-r268';",'service worker cache');has(sw,'app-v268.js','service worker JS asset');has(sw,'app-v268.css','service worker CSS asset');
console.log('R268_STATIC_OK canonical-history inline-right-watch frozen-surfaces-preserved');
