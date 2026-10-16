import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';await import('./build-r541.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v541.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v541.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r541 regression: '+m)};
yes(rootPkg.version==='0.3.68'&&webPkg.version==='0.3.68','versions');
yes(release.version==='0.3.68'&&release.revision==='r541-official-0.3.68','release');
yes(html.includes('app-v541.js')&&html.includes('app-v541.css'),'assets');
yes(js.includes("window.__ctR541Marker='home-entry-anchor-per-tab+history-hidden-above+no-cross-tab-state'"),'marker');
function region(marker){const at=js.indexOf(marker);if(at<0)throw new Error('missing '+marker);const start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('bounds '+marker);return js.slice(start,end+6)}
function named(source,name){const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);if(!m)throw new Error('function '+name);const start=m.index,open=source.indexOf('{',start+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}return source.slice(start,i)}
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';"),request=named(r388,'homeRequest507'),align=named(r388,'homeAlign507');
yes(request.includes('__ctR541HomeAnchorState'),'per-tab request state');
yes(request.includes("series:{kind:'series',initialDone:false,finalDone:false}")&&request.includes("movies:{kind:'movies',initialDone:false,finalDone:false}"),'two anchor states');
yes(align.includes("s=all[k]"),'align uses selected tab state');
yes(!align.includes('window.__ctR536HomeAnchor||window.__ctR535HomeAnchor'),'shared legacy state removed');
yes(js.includes("window.__ctR540Marker='special-counts-auth-safe+fast-v540+no-stuck-placeholder'"),'r540 preserved');
yes(js.includes('ct537-movie-list'),'movie renderer preserved');
yes(!css.includes('.ct536-movie-rail'),'obsolete movie rail absent');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.68 r541'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R541_REGRESSION_OK independent series/movies anchors');