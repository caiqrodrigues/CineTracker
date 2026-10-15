import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r530.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css0,sw,releaseRaw,runtime,extraCss]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v530.js'),'utf8'),readFile(resolve(dist,'app-v530.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r531-final.js'),'utf8'),readFile(resolve(root,'r531-final.css'),'utf8')
]);
const once=(source,needle,replacement,label)=>{const n=source.split(needle).length-1;if(n!==1)throw new Error('r531 expected one '+label+', found '+n);return source.replace(needle,replacement)};
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r531 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r531 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r531 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r531 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}

js=once(js,
 "window.__ctCoreR471=Object.freeze({",
 "window.__ctCoreR471=Object.freeze({\n navigate:(path,replace=false)=>{go(String(path||'/home'),!!replace);return true},",
 'core SPA navigate bridge'
);

const A286="window.__ctR286='related-open-watchlist-seen-window-capture';";
js=replaceNamed(js,A286,'ct286Open',`function ct286Open(spec){
 if(!spec)return false;
 const path='/'+(spec.type==='movie'?'movie':'series')+'/'+Number(spec.id);
 try{const nav=window.__ctCoreR471?.navigate;if(typeof nav==='function')return nav(path,false)!==false}catch{}
 try{if(typeof go==='function'){go(path);return true}}catch{}
 return false
}`,'r286 related navigation');

const A529="window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener';";
js=replaceNamed(js,A529,'openSpecial',`function openSpecial(type){
 if(!valid.has(type))return Promise.resolve(false);
 if(opening.has(type))return opening.get(type);
 const now=performance.now();if(type===lastType&&now-lastAt<650&&document.querySelector('[data-ct513-series-screen]'))return Promise.resolve(true);
 lastType=type;lastAt=now;document.documentElement.dataset.ct529SpecialOpening=type;
 const task=(async()=>{
  let screen=null;
  for(let attempt=0;attempt<24;attempt++){
   screen=window.__ctR513SeriesScreen;
   if(typeof screen?.open==='function')break;
   await new Promise(r=>setTimeout(r,25));
  }
  if(typeof screen?.open!=='function'){document.documentElement.dataset.ct529SpecialError='SCREEN_UNAVAILABLE:'+type;return false}
  const ok=await screen.open(type,new Date().getFullYear());
  if(ok===false&&!document.querySelector('[data-ct513-series-screen]')){document.documentElement.dataset.ct529SpecialError='OPEN_FALSE:'+type;return false}
  document.documentElement.dataset.ct529SpecialOpened=type;return true
 })().catch(e=>{document.documentElement.dataset.ct529SpecialError=type+':'+String(e?.message||e);return false}).finally(()=>opening.delete(type));
 opening.set(type,task);return task
}`,'r529 special opener');

new Function(runtime);js+='\n'+runtime+'\n';const css=css0+'\n'+extraCss+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r531-official-0.3.58';");
html=html.replaceAll('app-v530.js','app-v531.js').replaceAll('app-v530.css','app-v531.css').replaceAll('v0.3.57','v0.3.58').replaceAll('r530-official-0.3.57','r531-official-0.3.58');
sw=sw.replaceAll('r530','r531').replaceAll('app-v530.js','app-v531.js').replaceAll('app-v530.css','app-v531.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.58',revision:'r531-official-0.3.58',base:'r530+r531-scoped-interactions',
 scope:'real-special-screen+related-spa-navigation+opaque-home-toolbar',
 special_series:'F1/UFC/WWE opener waits bounded for the real r520 screen owner and the real screen is behavior-tested',
 related:'Títulos Relacionados uses the canonical in-closure SPA navigate bridge instead of competing legacy routing handlers',
 home:'fixed Series/Movies + search keep an opaque continuous shield above scrolling content',
 preserved:'Home data/renderers, Discover pools/Top10, Profile, Sports, Raw/SmackDown, watched writers, F1 sync and Android unchanged'
});
new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v531.js'),js),writeFile(resolve(dist,'app-v531.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v530.js'),{force:true}),rm(resolve(dist,'app-v530.css'),{force:true})]);
for(const need of [
 "window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome'",
 'navigate:(path,replace=false)=>{go(String(path||\'/home\'),!!replace);return true}',
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 'SCREEN_UNAVAILABLE:'+'' ,
 'data-ct531-home-shield'
])if(need&&!js.includes(need))throw new Error('r531 missing '+need);
console.log('WEB_R531_READY real special screen + related SPA + opaque Home chrome');
