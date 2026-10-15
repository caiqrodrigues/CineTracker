import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r528.mjs');
const [js,css,html,relRaw,rootRaw,webRaw]=await Promise.all([readFile(resolve('dist/app-v528.js'),'utf8'),readFile(resolve('dist/app-v528.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')]);
const ok=(v,m)=>{if(!v)throw new Error('r528 regression: '+m)},rel=JSON.parse(relRaw),rp=JSON.parse(rootRaw),wp=JSON.parse(webRaw);
function region(marker){const at=js.indexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('region bounds '+marker);return js.slice(start,end+6)}
function extractNamed(source,name,needle=''){const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(','g'),hits=[...source.matchAll(re)],out=[];for(const h of hits){const start=h.index,open=source.indexOf('{',start+h[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth===0){const src=source.slice(start,i);if(!needle||src.includes(needle))out.push(src)}}if(out.length!==1)throw new Error('extract '+name+' '+needle+' count='+out.length);return out[0]}
ok(rp.version==='0.3.55'&&wp.version==='0.3.55','versions');ok(rel.version==='0.3.55'&&rel.revision==='r528-official-0.3.55','release');ok(html.includes('app-v528.js')&&html.includes('app-v528.css'),'assets');
ok(js.includes("window.__ctR528Marker='home-final-anchor+movies-list+special-season-counts+top10-provider-generation'"),'marker');
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r321=region("window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';");
const r520=region("window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';");
const r521Catalog=region("if(window.__ctR520Catalog?.version==='0.3.48')return;");
const row=extractNamed(r388,'movieRow','ct274MovieMeta');ok(row.includes('ct274Row')&&!row.includes('ct514-movie-card'),'Home movie row is not canonical list');
const movies=extractNamed(r388,'renderMoviesAll','ct528-movie-list');ok(movies.includes("'flex-direction','column'")&&movies.includes('ct528-movie-list')&&!movies.includes('ct514-movie-rail'),'Home movies not vertical list');
const main=extractNamed(r388,'homeMain393','continuar');ok(main.includes('continuar\\s+assistindo'),'Continue anchor label');
const align=extractNamed(r388,'homeAlign507','ct528HomeStart');ok(align.includes('homeScrollRoot500')&&align.includes('homeOffset500')&&align.includes('homeHistoryReady507'),'history-aware anchor');
const markHist=extractNamed(r388,'homeMarkHistory507','requestAnimationFrame');ok(markHist.includes('homeAlign507(k,true)'),'late History final re-anchor');
const select=extractNamed(r321,'selectTopProvider528','paintTop321');ok(select.includes('++topToken')&&select.includes('paintTop321(next,token,true)'),'Top10 provider generation');
const paint=extractNamed(r321,'paintTop321',"ct523Top10='10:10'");ok(paint.includes('movies.length!==10||series.length!==10'),'Top10 strict 10+10');
const card=extractNamed(r520,'cardHtml',"unit=key==='f1'?'GPs':'eventos'");ok(!card.includes('__ctR516SpecialSummary')&&card.includes('total_episodes'),'special card annual count only');
const special=extractNamed(r520,'loadCurrent','normalizeSpecial528');ok(special.includes('catalog.loadSeason')&&special.includes('normalizeSpecial528'),'special catalog normalization');
const f1=extractNamed(r521Catalog,'mergeF1','f1-r526-gp-series');ok(f1.includes("session_kind||'').toLowerCase()==='race'"),'F1 must count races only');
ok(css.includes('.ct528-movie-list')&&css.includes('flex-flow:column nowrap!important')&&!css.includes('.ct528-movie-list{display:grid'),'list CSS');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.55 r528'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R528_REGRESSION_OK');