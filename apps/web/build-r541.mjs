import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r540.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v540.js'),'utf8'),
 readFile(resolve(dist,'app-v540.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r541-home-entry.js'),'utf8')
]);
function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r541 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r541 invalid '+label+' bounds');
 return{start,end:close+6}
}
function replaceNamed(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);
 if(!m)throw new Error('r541 missing '+label+' '+name);
 const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
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
 if(depth!==0)throw new Error('r541 unbalanced '+label+' '+name);
 return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)
}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'homeRequest507',`function homeRequest507(kind=activeKind(),reset=false){
 const k=kind==='movies'?'movies':'series',all=window.__ctR541HomeAnchorState||(window.__ctR541HomeAnchorState={
  series:{kind:'series',initialDone:false,finalDone:false},
  movies:{kind:'movies',initialDone:false,finalDone:false}
 });
 homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;
 if(reset||!all[k])all[k]={kind:k,initialDone:false,finalDone:false};
 if(reset){homeMainReady507[k]=false;homeHistoryReady507[k]=false}
 window.__ctR536HomeAnchor=all[k];window.__ctR535HomeAnchor=all[k];window.__ctR530HomeAnchor=all[k];
 queueMicrotask(()=>homeAlign507(k,false));
 requestAnimationFrame(()=>requestAnimationFrame(()=>homeAlign507(k,false)));
 return homeAnchorToken393
}`,'r388');
js=replaceNamed(js,A388,'homeAlign507',`function homeAlign507(kind=activeKind(),final=false){
 const k=kind==='movies'?'movies':'series',all=window.__ctR541HomeAnchorState||(window.__ctR541HomeAnchorState={
  series:{kind:'series',initialDone:false,finalDone:false},
  movies:{kind:'movies',initialDone:false,finalDone:false}
 }),s=all[k]||(all[k]={kind:k,initialDone:false,finalDone:false});
 if(routeNow()!=='home'||k!==homeAnchorKind507||activeKind()!==k)return false;
 const initial=!final&&!s.initialDone;
 if(!initial&&homeUserMoved393){homeAnchorPending507=false;return false}
 homeForceOrder500(k);const target=homeMain393(k);if(!target)return false;
 if(final&&(!homeMainReady507[k]||!homeHistoryReady507[k]))return false;
 if(final&&s.finalDone)return true;if(!final&&s.initialDone)return true;
 const tabs=q('[data-home] .home-tabs'),search=q('[data-page="home"] .search-global')||q('.content .search-global');
 const tr=tabs?.getBoundingClientRect?.(),sr=search?.getBoundingClientRect?.();
 let cssBottom=0;try{cssBottom=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ct533-home-bottom'))||0}catch{}
 const chromeBottom=Math.max(cssBottom,Number(tr?.bottom||0),Number(sr?.bottom||0),52),wantedTop=Math.ceil(chromeBottom+8);
 const root=homeScrollRoot500(target),doc=root===document.scrollingElement||root===document.documentElement||root===document.body;
 const rootTop=doc?0:Number(root.getBoundingClientRect?.().top||0),localTop=Math.max(0,wantedTop-rootTop),desired=homeOffset500(target,root)-localTop;
 target.style.scrollMarginTop='0px';homeSetScroll500(root,desired);target.dataset.ct541HomeStart=k+':'+(final?'final':'initial');
 s.kind=k;if(final){s.finalDone=true;homeAnchorPending507=false}else s.initialDone=true;
 window.__ctR536HomeAnchor=s;window.__ctR535HomeAnchor=s;window.__ctR530HomeAnchor=s;
 document.documentElement.dataset.ct541HomeAnchor=k+':'+(final?'final':'initial');
 return true
}`,'r388');
new Function(runtime);new Function(js);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r541-official-0.3.68';");
html=html.replaceAll('app-v540.js','app-v541.js').replaceAll('app-v540.css','app-v541.css').replaceAll('v0.3.67','v0.3.68').replaceAll('r540-official-0.3.67','r541-official-0.3.68');
css+='\n/* CineTracker Web 0.3.68 r541 — Home entry anchor state is isolated per Series/Movies tab. */\n';
sw=sw.replaceAll('r540','r541').replaceAll('app-v540.js','app-v541.js').replaceAll('app-v540.css','app-v541.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.68',revision:'r541-official-0.3.68',base:'r540+r541-home-entry-anchor',
 scope:'home-entry-anchor-only',
 home_series:'History remains physically above; every Home/Series entry resets only the Series anchor and opens at Continuar assistindo below the fixed Home chrome',
 home_movies:'History remains physically above; every explicit Movies selection resets only the Movies anchor and opens at Assistir a seguir / Watchlist below the fixed Home chrome',
 anchor_state:'Series and Movies no longer share initialDone/finalDone flags, preventing the first tab from suppressing the second tab anchor',
 preserved:'Home renderers/data/layout, special series counts/catalogs/writers, Discover, Profile, Sports, F1, Raw/SmackDown and Android unchanged'
});
await Promise.all([
 writeFile(resolve(dist,'app-v541.js'),js),writeFile(resolve(dist,'app-v541.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v540.js'),{force:true}),rm(resolve(dist,'app-v540.css'),{force:true})]);
for(const need of [
 "window.__ctR541Marker='home-entry-anchor-per-tab+history-hidden-above+no-cross-tab-state'",
 'window.__ctR541HomeAnchorState','dataset.ct541HomeStart','r541-official-0.3.68',
 "window.__ctR540Marker='special-counts-auth-safe+fast-v540+no-stuck-placeholder'",
 'ct537-movie-list'
])if(!js.includes(need))throw new Error('r541 missing '+need);
console.log('WEB_R541_READY independent Home entry anchors');