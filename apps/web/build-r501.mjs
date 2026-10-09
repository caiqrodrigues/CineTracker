import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r500.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v500.js'),'utf8'),readFile(resolve(dist,'app-v500.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r501 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r501 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r501 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r501 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'alignHome393',`function alignHome393(kind=activeKind(),token=homeAnchorToken393){
 if(routeNow()!=='home'||token!==homeAnchorToken393||homeUserMoved393)return false;applyTab(kind);homeForceOrder500(kind);
 const target=homeMain393(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=margin+'px';
 if(kind==='movies'){
  const view=q('[data-home-view="movies"]'),history=q(':scope > [data-ct388-history="movies"]',view),root=homeScrollRoot500(target);
  try{history?.style?.setProperty('overflow-anchor','none');target.style.setProperty('overflow-anchor','none')}catch{}
  try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
  const doc=root===document.scrollingElement||root===document.documentElement||root===document.body,delta=target.getBoundingClientRect().top-margin;
  if(Math.abs(delta)>1){if(doc){try{window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{window.scrollBy?.(0,delta)}}else root.scrollTop+=delta}
 }else{
  const root=homeScrollRoot500(target);homeSetScroll500(root,homeOffset500(target,root)-margin)
 }
 target.dataset.ct501HomeStart='1';return true
}`,'r388');

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r501-official-0.3.28';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.28 • ${REVISION}');
js+='\nwindow.__ctR501Marker="movies-history-hidden-by-direct-anchor+r500-preserved";\nwindow.__ctR501={version:"0.3.28",scope:"home-movies-anchor-only"};\n';
html=html.replaceAll('app-v500.js?ct=r500-official-0.3.27','app-v501.js?ct=r501-official-0.3.28').replaceAll('app-v500.css?ct=r500-official-0.3.27','app-v501.css?ct=r501-official-0.3.28').replaceAll('r500-official-0.3.27','r501-official-0.3.28');
css+='\n/* CineTracker Web 0.3.28 r501 — Home Filmes anchor only. */\nhtml body [data-home-view="movies"],html body [data-home-view="movies"]>[data-ct388-history="movies"],html body [data-home-view="movies"]>[data-ct388-movie-watch]{overflow-anchor:none!important}\n';
sw=sw.replaceAll('ct-media-r500','ct-media-r501').replaceAll('app-v500.js','app-v501.js').replaceAll('app-v500.css','app-v501.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.28',revision:'r501-official-0.3.28',base:'r500-scoped-stable',scope:'home-movies-anchor-only',home_series:'r500 preserved unchanged',home_movies:'Movies history remains physically above Watchlist, but movie-tab entry now uses direct scrollIntoView plus exact viewport correction on the real scroll root; overflow anchoring is disabled only inside the Movies home view',discover_foryou:'r498 preserved unchanged',top10:'r500 preserved unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v501.js'),js),writeFile(resolve(dist,'app-v501.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v500.js'),{force:true}),rm(resolve(dist,'app-v500.css'),{force:true})]);
for(const need of ['window.__ctR501Marker="movies-history-hidden-by-direct-anchor+r500-preserved"','target.scrollIntoView({block:\'start\'','overflow-anchor:none!important','r501-official-0.3.28'])if(!js.includes(need)&&!css.includes(need))throw new Error('r501 missing '+need);
console.log('WEB_R501_READY movies anchor');
