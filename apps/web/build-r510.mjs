import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r509.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v509.js'),'utf8'),readFile(resolve(dist,'app-v509.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r510-ufc-series.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r510 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r510 invalid '+label+' bounds');return{start,end:close+6}}
function hookFinalReturn(source,anchor,name,hook,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r510 missing '+name);
 const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}
 if(depth!==0)throw new Error('r510 unbalanced '+name);const fn=region.slice(m.index,i),at=fn.lastIndexOf('return true');if(at<0)throw new Error('r510 final return '+name);
 const patched=fn.slice(0,at)+hook+';'+fn.slice(at);return source.slice(0,b.start)+region.slice(0,m.index)+patched+region.slice(i)+source.slice(b.end);
}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=hookFinalReturn(js,A388,'renderSeries',"queueMicrotask(()=>window.__ctR510UFC?.mount?.())",'r388');
new Function(runtime);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r510-official-0.3.37';");
js=js.replaceAll('CineTracker • v0.3.36','CineTracker • v0.3.37');
html=html.replaceAll('app-v509.js?ct=r509-official-0.3.36','app-v510.js?ct=r510-official-0.3.37').replaceAll('app-v509.css?ct=r509-official-0.3.36','app-v510.css?ct=r510-official-0.3.37').replaceAll('r509-official-0.3.36','r510-official-0.3.37');
css+='\n/* CineTracker Web 0.3.37 r510 — UFC special-series integration only. */\n';
sw=sw.replaceAll('ct-media-r509','ct-media-r510').replaceAll('app-v509.js','app-v510.js').replaceAll('app-v509.css','app-v510.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.37',revision:'r510-official-0.3.37',base:'r509+ufc-special-series',scope:'ufc-special-series-only',ufc:'Fight Night/UFC on ESPN-ABC-Fox and numbered PPVs are exposed as one recurring UFC series for the current season; Sports watch history remains the single write source',ufc_sync:'mark/unmark in UFC series writes cinetracker_sport_mark_watched_v1; Sports changes invalidate and refresh the UFC series without duplicate episode history',home:'r509 unchanged except a post-render mount hook for the synthetic UFC row',discover:'unchanged',top10:'unchanged',profile:'unchanged',f1:'unchanged',sports:'generic sports behavior preserved',android:'unchanged-1.0.20/10062'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v510.js'),js),writeFile(resolve(dist,'app-v510.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v509.js'),{force:true}),rm(resolve(dist,'app-v509.css'),{force:true})]);
for(const need of ["window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch'","cinetracker_ufc_series_v510","cinetracker_sport_mark_watched_v1","queueMicrotask(()=>window.__ctR510UFC?.mount?.())","r510-official-0.3.37"])if(!js.includes(need))throw new Error('r510 missing '+need);
console.log('WEB_R510_READY UFC special series');
