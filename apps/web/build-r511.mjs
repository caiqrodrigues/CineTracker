import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r510.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v510.js'),'utf8'),readFile(resolve(dist,'app-v510.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r511-f1-series.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r511 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r511 invalid '+label+' bounds');return{start,end:close+6}}
function hookFinalReturn(source,anchor,name,hook,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r511 missing '+name);
 const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}
 if(depth!==0)throw new Error('r511 unbalanced '+name);const fn=region.slice(m.index,i),at=fn.lastIndexOf('return true');if(at<0)throw new Error('r511 final return '+name);
 const patched=fn.slice(0,at)+hook+';'+fn.slice(at);return source.slice(0,b.start)+region.slice(0,m.index)+patched+region.slice(i)+source.slice(b.end);
}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=hookFinalReturn(js,A388,'renderSeries',"queueMicrotask(()=>window.__ctR511F1?.mount?.())",'r388');
new Function(runtime);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r511-official-0.3.38';");
js=js.replaceAll('CineTracker • v0.3.37','CineTracker • v0.3.38');
html=html.replaceAll('app-v510.js?ct=r510-official-0.3.37','app-v511.js?ct=r511-official-0.3.38').replaceAll('app-v510.css?ct=r510-official-0.3.37','app-v511.css?ct=r511-official-0.3.38').replaceAll('r510-official-0.3.37','r511-official-0.3.38');
css+='\n/* CineTracker Web 0.3.38 r511 — Formula 1 special-series integration only. */\n';
sw=sw.replaceAll('ct-media-r510','ct-media-r511').replaceAll('app-v510.js','app-v511.js').replaceAll('app-v510.css','app-v511.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.38',revision:'r511-official-0.3.38',base:'r510+f1-special-series',scope:'f1-special-series-only',
 f1:'Current Formula 1 season is exposed as one recurring special series; each mapped practice, qualifying, sprint and race session is an episode',
 f1_sync:'Series mark/unmark writes only cinetracker_f1_watch_sync_v462, preserving Series + Sports + F1 Hub synchronization and existing time accounting',
 home:'r510 preserved except a post-render F1 mount hook that replaces the legacy Formula 1 row instead of duplicating it',
 ufc:'r510 preserved unchanged',discover:'unchanged',top10:'unchanged',profile:'unchanged',sports:'generic behavior preserved',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v511.js'),js),writeFile(resolve(dist,'app-v511.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v510.js'),{force:true}),rm(resolve(dist,'app-v510.css'),{force:true})]);
for(const need of ["window.__ctR511Marker='f1-special-series+current-season+canonical-r462-three-way-sync+no-duplicate-row'","cinetracker_f1_series_v511","cinetracker_f1_watch_sync_v462","queueMicrotask(()=>window.__ctR511F1?.mount?.())","r511-official-0.3.38"])if(!js.includes(need))throw new Error('r511 missing '+need);
console.log('WEB_R511_READY Formula 1 special series');