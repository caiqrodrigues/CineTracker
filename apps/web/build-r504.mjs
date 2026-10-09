import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r503.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v503.js'),'utf8'),readFile(resolve(dist,'app-v503.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r504 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r504 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r504 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r504 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}

const A371="window.__ctR371Marker='home-tab-user-only+repaint-preserved+async-generation-cancel';";
js=replaceNamed(js,A371,'desiredTab',`function desiredTab(){
 const locked=String(window.__ctR504UserTab||'');
 return locked==='movies'||locked==='series'?locked:(userSelected?tabRef.current:visibleTab())
}`,'r371');
js=replaceNamed(js,A371,'applyTab',`function applyTab(kind=desiredTab(),generation=tabGeneration){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 const locked=String(window.__ctR504UserTab||''),requested=kind==='movies'?'movies':'series',wanted=(locked==='movies'||locked==='series')?locked:requested;
 tabRef.current=wanted;root.dataset.ct371HomeTab=wanted;
 document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 try{ct266HomeTab=wanted}catch{}
 qa('[data-home-tab]',root).forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');b.type='button'});
 qa('[data-home-view]',root).forEach(v=>{const on=String(v.dataset.homeView||'series')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on);v.setAttribute('aria-hidden',on?'false':'true')});
 applyCount++;return true
}`,'r371');
js=replaceNamed(js,A371,'cancelPreviousHomeWork',`function cancelPreviousHomeWork(){tabGeneration++;return{generation:tabGeneration,signal:tabController?.signal||null}}`,'r371');
js=replaceNamed(js,A371,'selectByUser',`function selectByUser(kind){
 const wanted=kind==='movies'?'movies':'series';
 userSelected=true;tabRef.current=wanted;tabGeneration++;window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;
 document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 applyTab(wanted,tabGeneration);
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)}
 try{
  if(wanted==='movies')Promise.resolve(window.__ctR388?.loadMovies?.(false)).then(()=>{if(desiredTab()==='movies'&&routeNow()==='home'){applyTab('movies',tabGeneration);window.__ctR388?.renderMoviesAll?.()}}).catch(()=>{});
  else void window.__ctR388?.loadSeries?.(false)
 }catch{}
 return{generation:tabGeneration,signal:tabController?.signal||null}
}`,'r371');
js=replaceNamed(js,A371,'preserveAfterPaint',`function preserveAfterPaint(){return applyTab(desiredTab(),tabGeneration)}`,'r371');

const r371ClickOld=`window.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(!tab||routeNow()!=='home')return;
 selectByUser(String(tab.dataset.homeTab||'series'));
},true);`;
if(!js.includes(r371ClickOld))throw new Error('r504 missing r371 click owner');
js=js.replace(r371ClickOld,'/* r504: r371 listener retired; the single earliest owner is CT504 intent. */');

const intent502=`(()=>{'use strict';if(window.__ctR502IntentInstalled)return;window.__ctR502IntentInstalled=true;window.addEventListener('click',e=>{const tab=e.target?.closest?.('[data-home-tab]');if(!tab||!document.querySelector('[data-home]'))return;const wanted=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';window.__ctR502UserTab=wanted;document.documentElement.dataset.ct502HomeKind=wanted},true)})();`;
if(!js.includes(intent502))throw new Error('r504 missing r502 intent');
const intent504=`(()=>{'use strict';if(window.__ctR504HomeTabInstalled)return;window.__ctR504HomeTabInstalled=true;window.addEventListener('click',e=>{const tab=e.target?.closest?.('[data-home-tab]');if(!tab||!document.querySelector('[data-home]'))return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const wanted=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;try{window.__ctR371?.selectByUser?.(wanted)}catch{}},true)})();`;
js=js.replace(intent502,intent504);

const click502="window.addEventListener('click',e=>{const tab=e.target?.closest?.('[data-home-tab]');if(!tab||!document.querySelector('[data-home]'))return;const wanted=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.selectByUser?.(wanted)}catch{};applyHomeTab495(wanted,true);queueMicrotask(()=>applyHomeTab495(wanted,false));requestAnimationFrame(()=>applyHomeTab495(wanted,false))},true);";
if(!js.includes(click502))throw new Error('r504 missing duplicate r495/r502 owner');
js=js.replace(click502,'/* r504: duplicate r495/r502 Home-tab listener retired. */');

const A266="window.__ctR266='r263-rebuilt-home-discover-detail-sports-safe';";
js=replaceNamed(js,A266,'ct266CurrentHomeTab',`function ct266CurrentHomeTab(){
 const locked=String(window.__ctR504UserTab||'');if(locked==='movies'||locked==='series')return locked;
 const r=document.querySelector('[data-home]');if(!r)return ct266HomeTab;const a=r.querySelector('[data-home-tab].active');if(a?.dataset?.homeTab==='movies'||a?.dataset?.homeTab==='series')return a.dataset.homeTab;const m=r.querySelector('[data-home-view="movies"]');return m&&!m.hidden&&!m.classList.contains('hidden')?'movies':ct266HomeTab
}`,'r266');
js=replaceNamed(js,A266,'ct266ApplyHomeTab',`function ct266ApplyHomeTab(tab=ct266HomeTab){
 const r=document.querySelector('[data-home]');if(!r)return false;const locked=String(window.__ctR504UserTab||''),wanted=(locked==='movies'||locked==='series')?locked:(tab==='movies'?'movies':'series');ct266HomeTab=wanted;r.dataset.ct266HomeTab=wanted;
 r.querySelectorAll('[data-home-tab]').forEach(b=>{const on=b.dataset.homeTab===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 r.querySelectorAll('[data-home-view]').forEach(v=>{const on=v.dataset.homeView===wanted;v.classList.toggle('hidden',!on);v.hidden=!on;v.setAttribute('aria-hidden',on?'false':'true')});return true
}`,'r266');
const r266ClickOld="document.addEventListener('click',e=>{const w=ct266HomeActionTarget(e);if(w){e.preventDefault();e.stopImmediatePropagation();void ct266MarkWatched(w);return}const ht=e.target?.closest?.('[data-home-tab]');if(ht){ct266HomeTab=ht.dataset.homeTab==='movies'?'movies':'series';ct266ApplyHomeTab(ct266HomeTab)}},true);";
if(!js.includes(r266ClickOld))throw new Error('r504 missing r266 Home-tab branch');
js=js.replace(r266ClickOld,"document.addEventListener('click',e=>{const w=ct266HomeActionTarget(e);if(w){e.preventDefault();e.stopImmediatePropagation();void ct266MarkWatched(w);return}},true);");

const baseHomeTab="const ht=e.target.closest('[data-home-tab]');if(ht){$$('[data-home-tab]').forEach(x=>x.classList.toggle('active',x===ht));$$('[data-home-view]').forEach(x=>x.classList.toggle('hidden',x.dataset.homeView!==ht.dataset.homeTab));return}";
if(!js.includes(baseHomeTab))throw new Error('r504 missing base Home-tab branch');
js=js.replace(baseHomeTab,"const ht=e.target.closest('[data-home-tab]');if(ht){return}");

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'activeKind',`function activeKind(){
 const locked=String(window.__ctR504UserTab||document.documentElement.dataset.ct504HomeKind||'');if(locked==='movies'||locked==='series')return locked;
 try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}
}`,'r388');
js=replaceNamed(js,A388,'applyTab',`function applyTab(k){try{return window.__ctR371?.applyTab?.(k)??false}catch{return false}}`,'r388');

const A495="window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12';";
js=replaceNamed(js,A495,'applyHomeTab495',`function applyHomeTab495(kind,resetScroll=false){
 const locked=String(window.__ctR504UserTab||''),wanted=(locked==='movies'||locked==='series')?locked:(kind==='movies'?'movies':'series');
 try{const out=window.__ctR371?.applyTab?.(wanted);if(resetScroll)try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo?.(0,0)};return out??false}catch{}
 const root=document.querySelector('[data-home]');if(!root)return false;
 root.querySelectorAll('[data-home-tab]').forEach(b=>{const on=String(b.dataset.homeTab||'series')===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 root.querySelectorAll('[data-home-view]').forEach(v=>{const on=String(v.dataset.homeView||'')===wanted;v.hidden=!on;v.classList.toggle('hidden',!on);v.setAttribute('aria-hidden',on?'false':'true')});
 return true
}`,'r495');

js+="\nwindow.__ctR504Marker='home-tab-single-pointer-owner+movies-immediate-open+r503-watchlist-preserved';\nwindow.__ctR504={version:'0.3.31',scope:'home-movies-open-only'};\n";
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r504-official-0.3.31';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.31 • $'+'{REVISION}');
html=html.replaceAll('app-v503.js?ct=r503-official-0.3.30','app-v504.js?ct=r504-official-0.3.31').replaceAll('app-v503.css?ct=r503-official-0.3.30','app-v504.css?ct=r504-official-0.3.31').replaceAll('r503-official-0.3.30','r504-official-0.3.31');
css+='\n/* CineTracker Web 0.3.31 r504 — one real Home tab pointer owner. */\n'+
'html body [data-home] .home-tabs{position:relative!important;z-index:40!important;pointer-events:auto!important;isolation:isolate!important}\n'+
'html body [data-home] .home-tabs [data-home-tab]{position:relative!important;z-index:41!important;pointer-events:auto!important;cursor:pointer!important}\n';
sw=sw.replaceAll('ct-media-r503','ct-media-r504').replaceAll('app-v503.js','app-v504.js').replaceAll('app-v503.css','app-v504.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.31',revision:'r504-official-0.3.31',base:'r503-scoped-stable',scope:'home-movies-open-single-pointer-owner',home_series:'unchanged from r500/r501',home_movies:'one earliest capture owner controls Series/Movies; r266/base/r495-r502 duplicate tab handlers retired; Filmes toggles visible synchronously before v405 and r503 in-flight repaint + r502 176x264 2:3 cards are preserved',discover_foryou:'r498 preserved unchanged',top10:'r500 preserved unchanged',profile:'unchanged',f1:'unchanged',sports:'unchanged',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v504.js'),js),writeFile(resolve(dist,'app-v504.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v503.js'),{force:true}),rm(resolve(dist,'app-v503.css'),{force:true})]);
for(const need of ["window.__ctR504Marker='home-tab-single-pointer-owner+movies-immediate-open+r503-watchlist-preserved'","window.__ctR504HomeTabInstalled=true","e.stopImmediatePropagation()","window.__ctR504UserTab=wanted","r504-official-0.3.31"])if(!js.includes(need))throw new Error('r504 missing '+need);
if(js.includes(click502)||js.includes(r266ClickOld)||js.includes(baseHomeTab)||js.includes(r371ClickOld))throw new Error('r504 duplicate Home-tab owner survived');
console.log('WEB_R504_READY single real pointer owner');
