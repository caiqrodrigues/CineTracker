import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r485.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v485.js'),'utf8'),
 readFile(resolve(dist,'app-v485.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r486 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r486 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamedFunction(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end);
 const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(');
 const m=re.exec(region);if(!m)throw new Error('r486 missing '+label+' function '+name);
 const fnStart=m.index,open=region.indexOf('{',m.index+m[0].length);if(open<0)throw new Error('r486 missing '+label+' body '+name);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r486 unbalanced '+label+' function '+name);
 return source.slice(0,b.start)+region.slice(0,fnStart)+replacement+region.slice(i)+source.slice(b.end);
}
function patchRuntime(source,anchor,needle,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),count=region.split(needle).length-1;
 if(count!==1)throw new Error('r486 expected one '+label+', found '+count);
 return source.slice(0,b.start)+region.replace(needle,replacement)+source.slice(b.end);
}

const A485="window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12'";

js=patchRuntime(
 js,A485,
 'let homeSeq=0;',
 'let homeSeq=0,homeRenderTask=null,lastHomeRenderAt=0;',
 'r485 Home render lock'
);

js=replaceNamedFunction(
 js,A485,'prepareHome',
 `function prepareHome(kind='series'){
 const k=kind==='movies'?'movies':'series',now=Date.now();
 try{core.ensureHomeShell?.()}catch{}
 const missing=!q('[data-home-view="series"]')||!q('[data-home-view="movies"]');
 if(!homeRenderTask&&(missing||now-lastHomeRenderAt>5000)){
  lastHomeRenderAt=now;
  try{
   const task=window.__ctR388?.renderHome?.();
   homeRenderTask=Promise.resolve(task).catch(()=>false).finally(()=>{homeRenderTask=null});
  }catch{homeRenderTask=null}
 }
 try{window.__ctR481?.prime?.(k)}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 if(k==='movies')applyMovieRows();
 return true;
}`,
 'r485'
);

/* Make the Movies layout independent from a transient class so late v405 repaints
   cannot fall back to the old r481 card grid. */
{
 const b=bounds(js,A485,'r485 movie rows'),region=js.slice(b.start,b.end);
 const next=region.replaceAll('.ct388-movie-stack.ct485-movie-rows','.ct388-movie-stack');
 if(next===region)throw new Error('r486 movie row selectors not found');
 js=js.slice(0,b.start)+next+js.slice(b.end);
}

/* Top 10 keeps ten items per row but posters are always true 2:3 instead of
   inheriting the old fixed/short poster height. */
js=patchRuntime(
 js,A485,
 "if(!q('#ct485-style'))document.head.appendChild(style);",
 `style.textContent+=
 '@media(min-width:1000px){'+
 '[data-ct321-top-content] .ct319-top-row{grid-auto-rows:auto!important;align-items:start!important}'+
 '[data-ct321-top-content] .ct319-top-row>.ct319-item{height:auto!important;min-height:0!important;align-self:start!important}'+
 '[data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,[data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open{height:auto!important;min-height:0!important;max-height:none!important;align-self:start!important}'+
 '[data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster,[data-ct321-top-content] .ct319-top-row>.ct319-item .poster{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}'+
 '}';
if(!q('#ct485-style'))document.head.appendChild(style);`,
 'r485 Top 10 2:3'
);

js+="\n/* CineTracker Web 0.3.13 r486 — visible UI finalization. */\nwindow.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12';\n";

html=html.replaceAll('app-v485.js','app-v486.js').replaceAll('app-v485.css','app-v486.css').replaceAll('v0.3.12','v0.3.13').replaceAll('r485-official-0.3.12','r486-official-0.3.13');
css+='\n/* CineTracker Web 0.3.13 r486 — Home immediate frame, sticky Movie rows, Top 10 2:3, Profile exact 12. */\n';
sw=sw.replaceAll('app-v485.js','app-v486.js').replaceAll('app-v485.css','app-v486.css').replaceAll('ct-web-0.3.12-r485','ct-web-0.3.13-r486');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.13',
 revision:'r486-official-0.3.13',
 base:'r485+r486-visible-ui-final',
 scope:'home-immediate-frame+movies-sticky-rows+discover-v485-direct+top10-2x3+profile-exact-12',
 home_series:'r388 Home frame is invoked immediately with a single-flight lock; cached/skeleton content is visible before v452/v391 finish instead of a black wait',
 home_movies:'v405 remains the data authority; compact full-width row styling no longer depends on a transient class and survives every repaint',
 discover_foryou:'direct v485 pools remain the only current source; backend validated with 48 fresh candidates for movie/series/anime',
 discover_top10:'ten-up desktop layout preserved; poster/card vertical geometry forced to true 2:3 without flattened fixed heights',
 profile_lists:'v485 direct authority preserved; exactly 12 visible cards per five summary lists; header Ver mais remains separate',
 sports:'preserved',f1:'preserved',history:'daily-v426-preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v486.js'),js),
 writeFile(resolve(dist,'app-v486.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v485.js'),{force:true}),rm(resolve(dist,'app-v485.css'),{force:true})]);

const r485=(()=>{const b=bounds(js,A485,'r485');return js.slice(b.start,b.end)})();
if(!r485.includes('homeRenderTask=null,lastHomeRenderAt=0'))throw new Error('r486 Home lock missing');
if(!r485.includes("window.__ctR388?.renderHome?.()"))throw new Error('r486 immediate Home renderer missing');
if(r485.includes('.ct388-movie-stack.ct485-movie-rows'))throw new Error('r486 transient Movies selector retained');
if(!r485.includes("aspect-ratio:2/3!important")||!r485.includes("[data-ct321-top-content] .ct319-top-row"))throw new Error('r486 Top 10 2:3 missing');
if(!js.includes('cinetracker_discover_fresh_v485')||!js.includes('cinetracker_discover_watch_smart_v485'))throw new Error('r486 direct Discover v485 missing');
if(!js.includes("core.rpc('cinetracker_profile_lists_v485',{})")||!js.includes('const LIMIT=12'))throw new Error('r486 Profile v485/12 missing');
if(!js.includes("window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12'"))throw new Error('r486 marker missing');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.13 r486'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(latest.includes(bad))throw new Error('r486 forbidden '+bad);
console.log('WEB_R486_READY visible UI final');
