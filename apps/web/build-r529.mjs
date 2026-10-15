import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r528.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css0,sw,releaseRaw,runtime,extraCss,patchRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v528.js'),'utf8'),readFile(resolve(dist,'app-v528.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r529-final.js'),'utf8'),readFile(resolve(root,'r529-final.css'),'utf8'),readFile(resolve(root,'r529-patches.json'),'utf8')
]);
const P=JSON.parse(patchRaw);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r529 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r529 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r529 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r529 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function replaceRuntime(source,header,marker,replacement,label){const at=source.indexOf(marker);if(at<0)throw new Error('r529 missing '+label+' marker');const start=source.lastIndexOf(header,at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r529 invalid '+label+' bounds');return source.slice(0,start)+replacement.trim()+'\n'+source.slice(close+6)}
function stripPositionRule(source,selectorNeedle){
 let pos=0;
 while(true){const at=source.indexOf(selectorNeedle,pos);if(at<0)break;const open=source.indexOf('{',at),close=source.indexOf('}',open);if(open<0||close<0)break;const body=source.slice(open+1,close);if(/position:(?:fixed|sticky)!important/.test(body)){source=source.slice(0,at)+source.slice(close+1);pos=at}else pos=close+1}
 return source
}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
for(const [n,b] of Object.entries(P))js=replaceNamed(js,A388,n,b,'r388');
js=replaceRuntime(js,'/* CineTracker Web 0.3.51 r524 — final direct opener for F1/UFC/WWE special series. */',"window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'","/* r529 retired r524 special opener */\n(()=>{'use strict';window.__ctR524SpecialOpenRetired='r529';})();",'r524 opener');
js=replaceRuntime(js,'/* CineTracker Web 0.3.54 r527 — scoped final authority for Home/Discover/special-series/F1. */',"window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail'","/* r529 retired r527 duplicate special pointerdown */\n(()=>{'use strict';window.__ctR527SpecialOpenRetired='r529';})();",'r527 opener');
new Function(runtime);js+='\n'+runtime+'\n';
let css=css0;
css=stripPositionRule(css,'html body [data-page="home"] .search-global');
css=stripPositionRule(css,'html body [data-home]>.home-tabs,html body [data-home] .home-tabs');
css+='\n'+extraCss+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r529-official-0.3.56';").replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.56 • ${REVISION}');
html=html.replaceAll('app-v528.js','app-v529.js').replaceAll('app-v528.css','app-v529.css').replaceAll('v0.3.55','v0.3.56').replaceAll('r528-official-0.3.55','r529-official-0.3.56');
sw=sw.replaceAll('r528','r529').replaceAll('app-v528.js','app-v529.js').replaceAll('app-v528.css','app-v529.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.56',revision:'r529-official-0.3.56',base:'r528+r529-home-anchor-special-open',
 scope:'home-normal-flow-controls+series-movies-main-anchor+single-special-series-opener',
 home_series:'History remains physically above; Series/Movies controls are normal-flow between History and Continue; entry and late History settle pin Continue to the viewport start',
 home_movies:'Movies watched remains physically above; controls are normal-flow between History and Watchlist; entry pins Assistir a seguir / Watchlist to the viewport start; movie renderer is otherwise unchanged from r528',
 special_series:'r524/r527 duplicate openers are retired; one r529 capture owner opens the canonical r520 full-screen season view for F1, UFC and WWE Pay-Per-View',
 preserved:'Discover, Top 10, Pra Você, Profile, Sports, Raw/SmackDown, F1 writer r462, daily history/undo and Android 1.0.20/10062 unchanged'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v529.js'),js),writeFile(resolve(dist,'app-v529.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v528.js'),{force:true}),rm(resolve(dist,'app-v528.css'),{force:true})]);
for(const need of ["window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener'","ct529HomeStart","window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'","r529-official-0.3.56"])if(!js.includes(need))throw new Error('r529 missing '+need);
for(const bad of ["window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'","window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail'"])if(js.includes(bad))throw new Error('r529 legacy special opener survived '+bad);
console.log('WEB_R529_READY home normal-flow + canonical special opener');
