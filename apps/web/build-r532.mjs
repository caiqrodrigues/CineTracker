import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r531.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css0,sw,releaseRaw,related,special,home,extraCss,screenBase]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v531.js'),'utf8'),
 readFile(resolve(dist,'app-v531.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r532-related.js'),'utf8'),
 readFile(resolve(root,'runtime-r532-special.js'),'utf8'),
 readFile(resolve(root,'runtime-r532-home.js'),'utf8'),
 readFile(resolve(root,'r532-final.css'),'utf8'),
 readFile(resolve(root,'runtime-r520-series-screen.js'),'utf8')
]);

function functionBounds(source,name,label){
 const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);
 if(!m)throw new Error('r532 missing '+label+' '+name);
 const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;
  else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r532 unbalanced '+label+' '+name);
 return{start:m.index,end:i}
}
function replaceFunction(source,name,replacement,label){
 const b=functionBounds(source,name,label);return source.slice(0,b.start)+replacement+source.slice(b.end)
}
function ranges(source,header,marker,label){
 const out=[];let pos=0;
 while(true){
  const at=source.indexOf(marker,pos);if(at<0)break;
  const start=source.lastIndexOf(header,at),close=source.indexOf('\n})();',at);
  if(start<0||close<0)throw new Error('r532 invalid '+label+' bounds');
  const end=close+6;
  if(!out.some(x=>x.start===start&&x.end===end))out.push({start,end});
  pos=end;
 }
 if(!out.length)throw new Error('r532 missing '+label);
 return out
}
function replaceFamily(source,header,marker,canonical,label){
 const rr=ranges(source,header,marker,label);
 for(let i=rr.length-1;i>=0;i--){
  const r=rr[i],body=i===rr.length-1?canonical.trim():('/* r532 retired duplicate '+label+' */\n(()=>{\'use strict\';window.__ctR532Retired_'+label.replace(/[^a-z0-9]/gi,'_')+'_'+i+'=true;})();');
  source=source.slice(0,r.start)+body+'\n'+source.slice(r.end)
 }
 return source
}
function retireFamily(source,header,marker,label){
 const rr=ranges(source,header,marker,label);
 for(let i=rr.length-1;i>=0;i--){
  const r=rr[i],body='/* r532 retired obsolete '+label+' */\n(()=>{\'use strict\';window.__ctR532Retired_'+label.replace(/[^a-z0-9]/gi,'_')+'_'+i+'=true;})();';
  source=source.slice(0,r.start)+body+'\n'+source.slice(r.end)
 }
 return source
}

const robustOpen=`async function open(type,season=currentYear(),returnState=null){
 const t=String(type||'').toLowerCase();if(!['f1','ufc','wwe'].includes(t))return false;
 const previous=returnState||state?.returnState||{tab:String(q('[data-home-tab].active')?.dataset?.homeTab||'series'),scrollY:Number(window.scrollY||0),focus:document.activeElement};
 const token=++loadToken;state={type:t,season:Number(season)||currentYear(),data:null,loading:true,returnState:previous};render();
 document.documentElement.dataset.ct532SeriesScreen='opening:'+t;
 const loader=async()=>{
  for(let i=0;i<30;i++){
   if(!state||token!==loadToken)return null;
   const catalog=window.__ctR520Catalog;if(typeof catalog?.loadSeason==='function')return y=>catalog.loadSeason(t,y,false);
   const api=special();if(typeof api?.loadSeason==='function')return y=>api.loadSeason(t,y);
   await new Promise(r=>setTimeout(r,30))
  }
  return null
 };
 try{
  const load=await loader();if(!state||token!==loadToken)return false;if(!load)throw new Error('SPECIAL_CATALOG_UNAVAILABLE');
  const data=await load(state.season);if(!state||token!==loadToken)return false;
  state.data=data||{};state.loading=false;render();document.documentElement.dataset.ct532SeriesScreen='ready:'+t;return true
 }catch(e){
  if(state&&token===loadToken){
   state.loading=false;state.data={series:{season:state.season},events:[],seasons:[state.season]};render();
   const box=q('.ct513-series-events');if(box)box.innerHTML='<div class="error">Não foi possível carregar esta temporada. <button type="button" class="chip" data-ct530-special-retry="'+t+'">Tentar novamente</button></div>';
   document.documentElement.dataset.ct532SeriesError=t+':'+String(e?.message||e)
  }
  return false
 }
}`;

screenBase=replaceFunction(screenBase,'open',robustOpen,'canonical r520 screen');

js=retireFamily(
 js,
 '/* CineTracker Web 0.3.40 r513 — canonical full-screen UFC/F1 series view. */',
 "window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';",
 'r513-screen'
);
js=retireFamily(
 js,
 '/* CineTracker r519 — single full-screen owner for F1 + WWE Pay-Per-View. */',
 "window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch';",
 'r519-screen'
);
js=replaceFamily(
 js,
 '/* CineTracker Web 0.3.47 r520 — full-screen owner for F1 + UFC + WWE Pay-Per-View. */',
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';",
 screenBase,
 'r520-screen'
);
js=replaceFamily(
 js,
 '/* CineTracker Web 1.0.77 / r286 — related titles own open, Watchlist and Visto interactions before legacy document handlers. */',
 "window.__ctR286='related-open-watchlist-seen-window-capture';",
 related,
 'related'
);
js=replaceFamily(
 js,
 '/* CineTracker Web 0.3.56 r529 — non-floating Home chrome + single special-series opener. */',
 "window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';",
 special,
 'special'
);
js=replaceFamily(
 js,
 '/* CineTracker Web 0.3.58 r531 — opaque Home chrome + final scoped interaction marker. */',
 "window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome';",
 home,
 'home-chrome'
);

const css=css0+'\n'+extraCss+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r532-official-0.3.59';");
html=html.replaceAll('app-v531.js','app-v532.js').replaceAll('app-v531.css','app-v532.css').replaceAll('v0.3.58','v0.3.59').replaceAll('r531-official-0.3.58','r532-official-0.3.59');
sw=sw.replaceAll('r531','r532').replaceAll('app-v531.js','app-v532.js').replaceAl('app-v531.css','app-v532.css');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.59',revision:'r532-official-0.3.59',base:'r531+r532-active-owner-replacement',
 scope:'special-screen-single-owner+related-single-owner+body-home-shield',
 special_series:'obsolete r513/r519 screen listeners are physically retired from the built bundle; one r520 screen owner plus one r532 click owner handles F1/UFC/WWE',
 related:'old r286 pointer/click owner is replaced in place by one click owner using the core SPA navigate bridge; Watchlist/Visto actions are preserved',
 home:'old r531 page-local shield is replaced by a body-owned fixed opaque shield beneath the fixed Series/Movies + search controls',
 preserved:'Home data/order, Discover/Pra Você/Top10, Profile, Sports, Raw/SmackDown, F1 writers/catalogs and Android unchanged'
});

new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v532.js'),js),
 writeFile(resolve(dist,'app-v532.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v531.js'),{force:true}),rm(resolve(dist,'app-v531.css'),{force:true})]);

for(const need of [
 "window.__ctR532SpecialMarker='single-special-opener-real-screen'",
 "window.__ctR532RelatedMarker='related-click-spa-single-owner'",
 "window.__ctR532HomeMarker='body-owned-opaque-home-shield'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 "document.body.appendChild(shield)",
 "r532-official-0.3.59"
])if(!js.includes(need))throw new Error('r532 missing '+need);
for(const old of [
 "window.__ctR286='related-open-watchlist-seen-window-capture';",
 "window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';",
 "window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome';"
])if(js.includes(old))throw new Error('r532 old active owner survived '+old);

console.log('WEB_R532_READY single active interaction owners');
