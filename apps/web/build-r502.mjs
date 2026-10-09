import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r501.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v501.js'),'utf8'),readFile(resolve(dist,'app-v501.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r502 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r502 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r502 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r502 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}

const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
js=replaceNamed(js,A371,'applyTab',`function applyTab(kind=desiredTab(),generation=tabGeneration){
 if(routeNow()!=='home')return false;
 const requested=kind==='movies'?'movies':'series',wanted=userSelected?tabRef.current:requested;
 document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 try{return window.__ctR495?.applyHomeTab?.(wanted,false)??false}catch{return false}
}`,'r371');
js=replaceNamed(js,A371,'cancelPreviousHomeWork',`function cancelPreviousHomeWork(){
 tabGeneration++;
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');
js=replaceNamed(js,A371,'selectByUser',`function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;tabGeneration++;
 document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 try{window.__ctR495?.applyHomeTab?.(wanted,true)}catch{}
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');
js=replaceNamed(js,A371,'preserveAfterPaint',`function preserveAfterPaint(){
 const wanted=desiredTab(),generation=tabGeneration;
 applyTab(wanted,generation);queueMicrotask(()=>applyTab(wanted,generation));requestAnimationFrame(()=>applyTab(wanted,generation));return true
}`,'r371');

const A374="window.__ctR374Marker='home-tab-switch-scroll-reset+legacy-anchor-blocked+container-aware';";
if(js.includes(A374)){
 js=replaceNamed(js,A374,'activeKind',`function activeKind(){
  const locked=document.documentElement.dataset.ct502HomeKind||document.documentElement.dataset.ct495HomeKind;
  if(locked==='movies'||locked==='series')return locked;
  try{const k=window.__ctR371?.activeTab;if(k==='movies'||k==='series')return k}catch{}
  const active=q('[data-home-tab].active');return String(active?.dataset?.homeTab||'series')==='movies'?'movies':'series'
 }`,'r374');
 js=replaceNamed(js,A374,'scheduleReset',`function scheduleReset(kind){
  const token=++resetToken;userMoved=false;lastKind=kind==='movies'?'movies':'series';
  resetNow(lastKind,token);queueMicrotask(()=>resetNow(lastKind,token));requestAnimationFrame(()=>requestAnimationFrame(()=>resetNow(lastKind,token)));return token
 }`,'r374');
 js=replaceNamed(js,A374,'applyTab',`function applyTab(kind){
  const wanted=kind==='movies'?'movies':'series',root=q('[data-home]');if(!root)return false;
  document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
  try{ct266HomeTab=wanted}catch{}
  try{window.__ctR495?.applyHomeTab?.(wanted,false)}catch{}
  qa('[data-home-tab]',root).forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');b.type='button'});
  qa('[data-home-view]',root).forEach(v=>{const on=String(v.dataset.homeView||'series')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on)});
  return true
 }`,'r374');
 js=replaceNamed(js,A374,'switchTab',`function switchTab(kind,event){
  const wanted=kind==='movies'?'movies':'series';
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  try{window.__ctR371?.selectByUser?.(wanted)}catch{}
  applyTab(wanted);scheduleReset(wanted);return true
 }`,'r374');
}

const A495="window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12';";
js=replaceNamed(js,A495,'applyHomeTab495',`function applyHomeTab495(kind,resetScroll=false){
 const root=document.querySelector('[data-home]');if(!root)return false;
 const lock=document.documentElement.dataset.ct502HomeKind,wanted=(lock==='movies'||lock==='series')?lock:(kind==='movies'?'movies':'series');
 root.querySelectorAll('[data-home-tab]').forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 root.querySelectorAll('[data-home-view]').forEach(v=>{const on=String(v.dataset.homeView||'')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on);v.setAttribute('aria-hidden',on?'false':'true')});
 document.documentElement.dataset.ct495HomeKind=wanted;
 if(resetScroll)try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)}
 try{if(wanted==='movies')void window.__ctR388?.loadMovies?.(false);else void window.__ctR388?.loadSeries?.(false)}catch{}
 return true
}`,'r495');

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'activeKind',`function activeKind(){
 const locked=document.documentElement.dataset.ct502HomeKind||document.documentElement.dataset.ct495HomeKind;
 if(locked==='movies'||locked==='series')return locked;
 return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'
}`,'r388');
js=replaceNamed(js,A388,'applyTab',`function applyTab(k){
 const locked=document.documentElement.dataset.ct502HomeKind||document.documentElement.dataset.ct495HomeKind,wanted=(locked==='movies'||locked==='series')?locked:(k==='movies'?'movies':'series'),root=q('[data-home]')||document;
 qa('[data-home-tab]',root).forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 qa('[data-home-view]',root).forEach(v=>{const on=String(v.dataset.homeView||'')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on)});
 document.documentElement.dataset.ct495HomeKind=wanted;return true
}`,'r388');

const rb=bounds(js,A388,'r388-schedule-guards');
let region=js.slice(rb.start,rb.end);
region=region
 .replace("homeForceOrder500('series');document.documentElement.dataset.ct388Series=String(s.length);scheduleHome393('series',false);return true","homeForceOrder500('series');document.documentElement.dataset.ct388Series=String(s.length);if(activeKind()==='series')scheduleHome393('series',false);return true")
 .replace("homeForceOrder500('movies');sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);scheduleHome393('movies',false);return true","homeForceOrder500('movies');sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);if(activeKind()==='movies')scheduleHome393('movies',false);return true");
js=js.slice(0,rb.start)+region+js.slice(rb.end);

js+="\nwindow.__ctR502Marker='home-movies-user-lock+standard-176x264+r501-preserved';\nwindow.__ctR502={version:'0.3.29',scope:'home-movies-tab+watchlist-layout'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r502-official-0.3.29';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.29 • ${REVISION}');
html=html.replaceAll('app-v501.js?ct=r501-official-0.3.28','app-v502.js?ct=r502-official-0.3.29').replaceAll('app-v501.css?ct=r501-official-0.3.28','app-v502.css?ct=r502-official-0.3.29').replaceAll('r501-official-0.3.28','r502-official-0.3.29');
css+='\n/* CineTracker Web 0.3.29 r502 — Home Filmes user-owned tab + approved card size. */\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,176px)!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;justify-content:start!important;width:100%!important;overflow:visible!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card{position:relative!important;display:block!important;box-sizing:border-box!important;width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important;padding:0!important;margin:0!important;overflow:hidden!important;border-radius:12px!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-open,html body [data-home-view="movies"] .ct500-movie-card .poster{width:176px!important;min-width:176px!important;max-width:176px!important;height:264px!important;min-height:264px!important;max-height:264px!important;aspect-ratio:2/3!important}\n'+
'html body [data-home-view="movies"] .ct500-movie-card .poster{background-size:cover!important;background-position:center!important;object-fit:cover!important}\n'+
'@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct500-movie-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct500-movie-card,html body [data-home-view="movies"] .ct500-movie-open,html body [data-home-view="movies"] .ct500-movie-card .poster{width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important}}\n';
sw=sw.replaceAll('ct-media-r501','ct-media-r502').replaceAll('app-v501.js','app-v502.js').replaceAll('app-v501.css','app-v502.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.29',revision:'r502-official-0.3.29',base:'r501-scoped-stable',scope:'home-movies-user-lock+approved-2x3-size',
 home_series:'r500/r501 preserved unchanged',
 home_movies:'Filmes is user-owned after click: r371 now records userSelected/tabRef, r374 and r495 obey the same lock, late Series paints cannot switch the active tab; Watchlist uses approved 176x264 desktop and responsive 2:3 mobile cards',
 discover_foryou:'r498 preserved unchanged',top10:'r500 preserved unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v502.js'),js),writeFile(resolve(dist,'app-v502.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v501.js'),{force:true}),rm(resolve(dist,'app-v501.css'),{force:true})]);
for(const need of ["window.__ctR502Marker='home-movies-user-lock+standard-176x264+r501-preserved'","userSelected=true;tabRef.current=wanted","dataset.ct502HomeKind=wanted","if(activeKind()==='movies')scheduleHome393('movies',false)","r502-official-0.3.29"])if(!js.includes(need))throw new Error('r502 missing '+need);
console.log('WEB_R502_READY movie lock + standard cards');
