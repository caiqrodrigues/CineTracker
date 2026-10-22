import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r544.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all(['index.html','app-v544.js','app-v544.css','service-worker.js','release.json'].map(f=>readFile(resolve(dist,f),'utf8')));
function replace(before,after,label){const n=js.split(before).length-1;if(n!==1)throw Error(label+': found '+n);js=js.replace(before,after)}
// The r541 request was restarting the same tab anchor on every render, even after it was settled.
replace('homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;',
 'if(homeAnchorKind507===k&&all[k]?.initialDone)return homeAnchorToken393;homeAnchorKind507=k;homeAnchorPending507=true;homeUserMoved393=false;homeAnchorToken393++;',
 'home repeated scroll request');
// Use the actual UFC RPC air date rather than only the current event list.
replace("const stamp=latest?.starts_at||p?.series?.last_event_at||p?.series?.last_watched_at||'';",
 "const stamp=latest?.starts_at||p?.series?.next_episode_air_date||p?.series?.last_event_at||p?.series?.last_watched_at||'';",
 'UFC event air date');
// The prior fallback silently appended the special card after arbitrary rows, which does not actually sort.
// Keep the existing event timestamp on the card and never put undated UFC ahead of dated entries.
replace("const raw=x.dataset.ct544EventAt||x.dataset.lastWatchedAt||x.dataset.lastAirDate||x.dataset.releaseDate||'';",
 "const raw=x.dataset.ct544EventAt||x.dataset.lastWatchedAt||x.dataset.lastAirDate||x.dataset.releaseDate||x.querySelector?.('time[datetime]')?.getAttribute('datetime')||'';",
 'dated row comparison');
replace("const REVISION='r544-official-0.3.71';","const REVISION='r545-official-0.3.72';",'revision');
html=html.replaceAll('app-v544.js','app-v545.js').replaceAll('app-v544.css','app-v545.css').replaceAll('r544-official-0.3.71','r545-official-0.3.72').replaceAll('v0.3.71','v0.3.72');
sw=sw.replaceAll('r544','r545').replaceAll('app-v544.js','app-v545.js').replaceAll('app-v544.css','app-v545.css');
css+='\n/* Web r545: stabilized tab anchor and trustworthy UFC event date. */\n';
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.72',revision:'r545-official-0.3.72',scope:'Web Home only; Android frozen'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v545.js'),js),writeFile(resolve(dist,'app-v545.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v544.js'),{force:true}),rm(resolve(dist,'app-v544.css'),{force:true})]);
console.log('WEB_R545_READY');
