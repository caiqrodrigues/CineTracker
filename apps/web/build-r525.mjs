import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r524.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime,extraCss,homeRaw,specialRaw,discoverRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v524.js'),'utf8'),
 readFile(resolve(dist,'app-v524.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r525-final.js'),'utf8'),
 readFile(resolve(root,'r525-final.css'),'utf8'),
 readFile(resolve(root,'r525-home-patches.json'),'utf8'),
 readFile(resolve(root,'r525-special-patches.json'),'utf8'),
 readFile(resolve(root,'r525-discover-patches.json'),'utf8')
]);
const home=JSON.parse(homeRaw),special=JSON.parse(specialRaw),discover=JSON.parse(discoverRaw);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r525 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r525 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamed(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);
 if(!m)throw new Error('r525 missing '+label+' '+name);
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
 if(depth!==0)throw new Error('r525 unbalanced '+label+' '+name);
 return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end);
}
const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
for(const [name,body] of Object.entries(home))js=replaceNamed(js,A388,name,body,'r388');
const A321="window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';";
for(const [name,body] of Object.entries(discover))js=replaceNamed(js,A321,name,body,'r321');
const A513="window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner';";
js=replaceNamed(js,A513,'open',special.specialOpen,'r520 screen');
const A521="window.__ctR521CatalogMarker='f1-local-sessions+jolpica-all-races+ufc-full+wwe-full';";
js=replaceNamed(js,A521,'loadF1',special.loadF1,'r521 catalog');
js=replaceNamed(js,A521,'loadUfc',special.loadUfc,'r521 catalog');
js=replaceNamed(js,A521,'loadWwe',special.loadWwe,'r521 catalog');

/* Route old heavy personal filters and duplicate-team lookup to the v525 backend without changing call sites. */
const oldRpc="rpc:(name,args={})=>rpc(name,args),";
const newRpc="rpc:(name,args={})=>rpc(name==='cinetracker_recommendation_filter_v517'||name==='cinetracker_discover_filter_v322'?'cinetracker_recommendation_filter_v525':name==='cinetracker_sports_team_recent_v520'?'cinetracker_sports_team_recent_v525':name,args),";
if((js.split(oldRpc).length-1)!==1)throw new Error('r525 core rpc bridge mismatch');
js=js.replace(oldRpc,newRpc);

new Function(runtime);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r525-official-0.3.52';")
     .replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.52 • ${REVISION}');
html=html.replaceAll('app-v524.js','app-v525.js').replaceAll('app-v524.css','app-v525.css')
         .replaceAll('r524-official-0.3.51','r525-official-0.3.52').replaceAll('v0.3.51','v0.3.52');
css+='\n'+extraCss+'\n';
sw=sw.replaceAll('r524','r525').replaceAll('app-v524.js','app-v525.js').replaceAll('app-v524.css','app-v525.css');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.52',revision:'r525-official-0.3.52',base:'r524+r525-video-ground-truth',
 scope:'home-one-shot-anchor+movies-2x3-owner+filter-v525+top10-10x10+special-db-first+sports-team-canonical',
 home_series:'History stays physically above Continue; the viewport anchor is finite and Series v492 has a bounded v452 fallback',
 home_movies:'Movies watched stays physically above Watchlist; Watchlist finishes as one strict horizontal 2:3 rail',
 discover_foryou:'v517 call sites are routed to v525 user-known-first filtering, preserving original-title alias checks such as A Odisseia/The Odyssey',
 top10:'r523 strict 10+10 owner is preserved with fast v525 personal filtering; new entry selects the first provider',
 special_series:'F1/UFC/WWE screens paint current cached season immediately and remote enrichment is bounded/db-first',
 sports:'team detail uses v525 canonical team aliases across competitions',
 profile:'unchanged',raw_smackdown:'unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v525.js'),js),writeFile(resolve(dist,'app-v525.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v524.js'),{force:true}),rm(resolve(dist,'app-v524.css'),{force:true})]);
for(const need of [
 "window.__ctR525Marker='one-shot-home-anchor+fixed-toolbar+movies-2x3+filter-v525+top10-10x10+special-db-first+sports-team-canonical'",
 'cinetracker_recommendation_filter_v525','cinetracker_sports_team_recent_v525','ct525-movie-rail',
 "state.topProvider=Number(providers[0]?.provider_id||0)",'r525-official-0.3.52'
])if(!js.includes(need))throw new Error('r525 missing '+need);
console.log('WEB_R525_READY video ground truth');
