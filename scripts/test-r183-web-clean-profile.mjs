import {readFile} from 'node:fs/promises';
const [js,css,build,pkg,gradle]=await Promise.all([
  readFile('apps/web/runtime-r183.js','utf8'),
  readFile('apps/web/r183.css','utf8'),
  readFile('apps/web/build-r183.mjs','utf8'),
  readFile('apps/web/package.json','utf8'),
  readFile('apps/android/app/build.gradle','utf8')
]);
for(const m of [
  "window.__ctR183='web-clean-headers-profile-reflow'",
  "window.__ct183Headers='remove-redundant-page-title-copy-preserve-back'",
  "window.__ct183Profile='four-column-balanced-stats-wide-totals'",
  "window.__ct183ExtraStats='collapsible-sports-extra-statistics'",
  'ctR183CleanHeader','ctR183ExtraStats','data-ct-r183-extra-toggle',
  "ctR180StatCard('Tempo total de tela'",
  "ctR180StatCard('Tempo total em Watchlist'"
])if(!js.includes(m))throw new Error('r183 runtime missing '+m);
for(const m of [
  '.content>.header>div{display:none!important}',
  '.ct-r183-stats-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important',
  '.ct-r183-stats-grid .ct-r180-stat-wide{grid-column:span 2!important}',
  '.ct-r183-extra-toggle',
  '.ct-r183-extra-stats-body.hidden{display:none!important}'
])if(!css.includes(m))throw new Error('r183 css missing '+m);
if(!build.includes("const REVISION='r183-web-clean-profile';"))throw new Error('r183 build revision missing');
if(!pkg.includes('build-r183.mjs'))throw new Error('package is not building r183');
if(!gradle.includes("versionName '0.99.7.18'")||!gradle.includes('versionCode 9988'))throw new Error('Android identity changed in Web-only r183');
console.log('R183_WEB_CLEAN_PROFILE_OK headers=clean profile=4col-wide extras=collapsible android=untouched');
