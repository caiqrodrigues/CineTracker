import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r494.mjs');

const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v494.js'),'utf8'),
 readFile(resolve('dist/app-v494.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
const ok=(v,m)=>{if(!v)throw new Error('r494 regression: '+m)};

ok(rootPkg.version==='0.3.21'&&webPkg.version==='0.3.21','versions');
ok(release.version==='0.3.21'&&release.revision==='r494-official-0.3.21','release');
ok(html.includes('/app-v494.js?ct=r494-official-0.3.21')&&html.includes('/app-v494.css?ct=r494-official-0.3.21'),'assets');
for(const old of ['data-ct479-preboot','data-ct461-preboot','data-ct479-preboot-ui','Carregando Home…','Carregando Home...','#d6b55b'])ok(!html.includes(old),'legacy HTML '+old);
ok(!css.includes('data-ct461-series-gate'),'legacy gate CSS');
ok(Number(release.legacy_preboots_removed)>=1,'preboot removal count');
ok(js.includes('(()=>{return;'),'retired historical runtimes remain inert, never executable');
ok(js.includes("window.__ctR494Marker='clean-current-ui+local-first-auth+no-gold-preboot+dead-runtime-strip'"),'marker');
ok(js.includes('function ct494ValidateSessionAsync()'),'background auth validation');
ok(js.includes("localStorage.getItem('cinetracker_session')"),'local-first session');
ok(js.includes('ct494RefreshAuth()'),'401 refresh');
ok(js.includes('cinetracker_home_series_v492')&&js.includes('cinetracker_home_movies_v405'),'Home r493 preserved');
ok(js.includes('cinetracker_profile_summary_v489')&&!js.slice(js.indexOf('/* CT_R493_CORE_START */'),js.indexOf('/* CT_R493_CORE_END */')).includes('cinetracker_profile_screen_v491'),'Profile fast path');
ok(js.includes('ct493:foryou')&&js.includes('cinetracker_foryou_payload_v490'),'For You preserved');
ok(js.includes('const paint=paintTop321(state.topProvider,token,force)'),'Top10 progressive preserved');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.21 r494'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R494_REGRESSION_OK');
