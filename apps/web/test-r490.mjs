import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v490.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const yes=(v,m)=>{if(!v)throw new Error('r490 regression: '+m)},release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const fn=(source,name)=>{const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);yes(m,'function '+name);const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}yes(depth===0,'balanced '+name);return source.slice(m.index,i)};
yes(pkg.version==='0.3.17'&&rootPkg.version==='0.3.17','versions');
yes(release.version==='0.3.17'&&release.revision==='r490-official-0.3.17','release');
yes(html.includes('app-v490.js')&&html.includes('app-v490.css'),'assets');
yes(js.includes("window.__ctR490Marker='real-video-authority+legacy-writers-retired+compact-foryou+profile-single-paint+sw-network-shell'"),'marker');
yes(js.includes('CineTracker • v0.3.17 • ${REVISION}'),'footer version source');
yes(js.includes("const REVISION='r490-official-0.3.17';"),'revision source');
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");yes(fn(r464,'load').includes('cinetracker_foryou_payload_v490'),'compact ForYou');yes(fn(r464,'load').includes('9000'),'mobile bounded timeout');yes(!fn(r464,'load').includes('cinetracker_foryou_payload_v489'),'no heavy ForYou payload');
const checks=[
 ["if(window.__ctR415?.version==='1.0.206')return;",'renderProfile415'],
 ["window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'",'renderProfile416'],
 ["if(window.__ctR417?.version==='1.0.208')return;",'loadProfileSports417'],
 ["if(window.__ctR418?.version==='1.0.209')return;",'loadProfile418'],
 ["if(window.__ctR420?.version==='1.0.211')return;",'loadProfile420'],
 ["if(window.__ctR421?.version==='1.0.212')return;",'loadProfile421'],
 ["if(window.__ctR424?.version==='1.0.215')return;",'loadProfile424'],
 ["function applyProfile467",'applyProfile467'],
 ["function wakeHome",'applyProfile'],
 ["function repairHome",'applyProfile'],
 ["function primeHome",'paintProfile'],
 ["function bootHome",'settleProfile']
];
for(const [a,n] of checks){const body=fn(region(a),n);yes(/return (false|null)/.test(body)||body.includes('bindDailyAuthority();return false'),'legacy writer retired '+n)}
const r490=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.17 r490'));
for(const need of ['cinetracker_profile_v380','cinetracker_profile_summary_v489','cinetracker_sport_stats_v421','cinetracker_sports_stadium_summary_v296','slice(0,12)','ct490-profile-grid','data-ct299-history'])yes(r490.includes(need),'r490 runtime '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r490.includes(bad),'forbidden '+bad);
yes(sw.includes("CT_MEDIA_CACHE='ct-media-r490'"),'new SW');yes(!sw.includes('app-v490.js')&&!sw.includes("mode==='navigate'")&&!sw.includes('index.html'),'SW does not own app shell');
console.log('WEB_R490_REGRESSION_OK');