import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r507.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v507.js'),'utf8'),readFile(resolve(dist,'app-v507.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r508 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r508 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r508 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r508 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";

js=replaceNamed(js,A388,'homeRequest507',`function homeRequest507(kind=activeKind(),reset=false){
 const k=kind==='movies'?'movies':'series';homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;
 if(reset){homeMainReady507[k]=false;homeHistoryReady507[k]=false}
 if(k==='movies')window.__ctR508MovieAnchorFrames=18;
 queueMicrotask(()=>homeAlign507(k,false));requestAnimationFrame(()=>homeAlign507(k,false));return homeAnchorToken393
}`,'r388');

js=replaceNamed(js,A388,'homeAlign507',`function homeAlign507(kind=activeKind(),final=false){
 const k=kind==='movies'?'movies':'series',frames=k==='movies'?Math.max(0,Number(window.__ctR508MovieAnchorFrames||0)):0;
 if(routeNow()!=='home'||k!==homeAnchorKind507||activeKind()!==k)return false;
 if(homeUserMoved393){if(k==='movies')window.__ctR508MovieAnchorFrames=0;homeAnchorPending507=false;return false}
 if(!homeAnchorPending507&&!(k==='movies'&&frames>0))return false;
 homeForceOrder500(k);const target=homeMain393(k);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),tabsRect=tabs?.getBoundingClientRect?.(),wantedTop=Math.max(8,Math.ceil(Number(tabsRect?.bottom||0))+8),delta=target.getBoundingClientRect().top-wantedTop;
 target.style.scrollMarginTop='0px';
 if(Math.abs(delta)>1){try{window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{const root=document.scrollingElement||document.documentElement;root.scrollTop=Math.max(0,root.scrollTop+delta)}}
 target.dataset.ct508HomeStart='1';
 let left=frames;
 if(k==='movies'&&frames>0){left=frames-1;window.__ctR508MovieAnchorFrames=left;if(left>0)requestAnimationFrame(()=>homeAlign507('movies',false))}
 if(k!=='movies'){if(final||homeMainReady507[k]&&homeHistoryReady507[k])homeAnchorPending507=false}
 else if((final||homeMainReady507[k]&&homeHistoryReady507[k])&&left<=0)homeAnchorPending507=false;
 return true
}`,'r388');

js=replaceNamed(js,A388,'homeMarkMain507',`function homeMarkMain507(kind){
 const k=kind==='movies'?'movies':'series';homeMainReady507[k]=true;
 if(k==='movies'&&routeNow()==='home'&&activeKind()==='movies'&&!homeUserMoved393){homeAnchorKind507='movies';homeAnchorPending507=true;window.__ctR508MovieAnchorFrames=Math.max(10,Number(window.__ctR508MovieAnchorFrames||0))}
 return homeAlign507(k,homeHistoryReady507[k])
}`,'r388');

js=replaceNamed(js,A388,'homeMarkHistory507',`function homeMarkHistory507(kind){
 const k=kind==='movies'?'movies':'series';homeHistoryReady507[k]=true;
 if(k==='movies'&&routeNow()==='home'&&activeKind()==='movies'&&!homeUserMoved393){homeAnchorKind507='movies';homeAnchorPending507=true;window.__ctR508MovieAnchorFrames=Math.max(12,Number(window.__ctR508MovieAnchorFrames||0))}
 return homeAlign507(k,homeMainReady507[k])
}`,'r388');

const oldMove="for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'){homeUserMoved393=true;homeAnchorPending507=false}},{capture:true,passive:true});";
if(!js.includes(oldMove))throw new Error('r508 missing movement listener');
js=js.replace(oldMove,"for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'){homeUserMoved393=true;homeAnchorPending507=false;window.__ctR508MovieAnchorFrames=0}},{capture:true,passive:true});");

css+='\n/* CineTracker Web 0.3.35 r508 — Home Movies only: hidden history + compact one-row Watchlist. */\n'+
'html body [data-home-view="movies"]{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:calc(100vw - 192px)!important;overflow:hidden!important}\n'+
'html body [data-home-view="movies"]>[data-ct388-movie-watch]{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;justify-content:flex-start!important;gap:12px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:1px 1px 9px!important;scroll-snap-type:x proximity!important;scrollbar-width:thin!important}\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card{flex:0 0 176px!important;display:block!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;scroll-snap-align:start!important}\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card>.ct500-movie-open,html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card .poster{width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important}\n'+
'@media(max-width:900px){html body [data-home-view="movies"]{max-width:calc(100vw - 172px)!important}}\n'+
'@media(max-width:720px){html body [data-home-view="movies"]{max-width:calc(100vw - 22px)!important}html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{display:flex!important;grid-template-columns:none!important;gap:10px!important}html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card,html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card>.ct500-movie-open,html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid>.ct500-movie-card .poster{flex:0 0 154px!important;width:154px!important;min-width:154px!important;max-width:154px!important;height:231px!important;min-height:231px!important;max-height:231px!important;aspect-ratio:2/3!important}}\n';

js+="\nwindow.__ctR508Marker='home-movies-history-actually-offscreen+watchlist-one-row-176x264+scope-home-movies-only';\nwindow.__ctR508={version:'0.3.35',scope:'home-movies-only'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r508-official-0.3.35';");
js=js.replace(/CineTracker • v[^•<]+ • \\$\\{REVISION\\}/g,'CineTracker • v0.3.35 • $'+'{REVISION}');
html=html.replaceAll('app-v507.js?ct=r507-official-0.3.34','app-v508.js?ct=r508-official-0.3.35').replaceAll('app-v507.css?ct=r507-official-0.3.34','app-v508.css?ct=r508-official-0.3.35').replaceAll('r507-official-0.3.34','r508-official-0.3.35');
sw=sw.replaceAll('ct-media-r507','ct-media-r508').replaceAll('app-v507.js','app-v508.js').replaceAll('app-v507.css','app-v508.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.35',revision:'r508-official-0.3.35',base:'r507-home-only',
 scope:'home-movies-hidden-history-real-viewport+watchlist-one-row-2x3',
 home_series:'unchanged from r507',
 home_movies:'Movies watched is required to be outside the visible viewport below sticky Home tabs; bounded rAF anchor survives late History/Watchlist paints and cancels immediately on user wheel/touch; Watchlist is one horizontal 176x264 2:3 rail (154x231 mobile)',
 discover_foryou:'unchanged',top10:'unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v508.js'),js),writeFile(resolve(dist,'app-v508.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v507.js'),{force:true}),rm(resolve(dist,'app-v507.css'),{force:true})]);
for(const need of ["window.__ctR508Marker='home-movies-history-actually-offscreen+watchlist-one-row-176x264+scope-home-movies-only'","__ctR508MovieAnchorFrames","flex-flow:row nowrap","r508-official-0.3.35"])if(!js.includes(need)&&!css.includes(need))throw new Error('r508 missing '+need);
console.log('WEB_R508_READY Home Movies viewport + rail');
