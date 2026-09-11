import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist'),repo=resolve(root,'../..');
const parts=await Promise.all(Array.from({length:5},(_,i)=>readFile(resolve(root,`runtime-r251-real-source.part${String(i).padStart(2,'0')}.js`),'utf8')));
const runtime=parts.join('');
const [pkg,build,js,css,html,release,workflow,readme,changelog]=await Promise.all([
 readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'build-r251.mjs'),'utf8'),readFile(resolve(dist,'app-v251.js'),'utf8'),readFile(resolve(dist,'app-v251.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(repo,'.github/workflows/verify.yml'),'utf8'),readFile(resolve(repo,'README.md'),'utf8'),readFile(resolve(repo,'CHANGELOG.md'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r251 missing '+label)};
const mustNot=(s,x,label=x)=>{if(s.includes(x))throw new Error('r251 forbidden '+label)};
must(pkg,'"version": "1.0.42"','package 1.0.42');must(pkg,'build-r251-official.mjs');
for(const x of ["window.__ctR251='real-source-ui-authority'","renderHome=renderHome251","renderDiscover=renderDiscover251","renderSports=renderSports251","renderProfile=renderProfile251","renderDetail=renderDetail251","cinetracker_recent_recommendations_v1","cinetracker_mark_recommendation_shown_v1","cinetracker_sports_payload_v1","cinetracker_sport_mark_watched_v1","CT251_WWE","shown_recommendations"])must(runtime,x,x);
mustNot(runtime,'new MutationObserver','runtime observer');
for(const x of ['__ctR251LegacyR247Disabled','__ctR251LegacyR248Disabled','__ctR251LegacyR248BindingDisabled','__ctR251LegacyR248FollowingDisabled','__ctR251LegacyR248DiscoverDisabled','__ctR251LegacyR249Disabled','__ctR251LegacyR250Disabled'])must(js,x,x);
for(const x of ["window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';","const REVISION='r251-official-1.0.42';","window.__ctR251='real-source-ui-authority'","window.__ctR251SourceBindings"] )must(js,x,x);
mustNot(js,'cinetracker_sports_events_v0997','legacy sports RPC');
for(const x of ['app-v251.js','app-v251.css'])must(html,x,x);
for(const x of ['overflow-x:clip!important','.ct251-xrail','.ct251-follow-card','.ct251-profile-grid','.ct251-f1hub'])must(css,x,x);
const rel=JSON.parse(release);if(rel.version!=='1.0.42'||rel.revision!=='r251-official-1.0.42')throw new Error('r251 release identity mismatch');if(rel.android!=='unchanged-1.0.20')throw new Error('Android drift');
for(const x of ['1.0.42','r251','test-r251-visible-dom-browser.mjs','test-r251-exact-bundle-browser.mjs'])must(workflow,x,'workflow '+x);
must(readme,'1.0.42','README release');must(changelog,'1.0.42','CHANGELOG release');
await access(resolve(repo,'supabase/migrations/20260911150000_r251_shown_recommendations.sql'));
console.log('R251_STATIC_OK real-source ownership weekly-recommendations four-sports-tabs single-f1 unified-profile local-x');
