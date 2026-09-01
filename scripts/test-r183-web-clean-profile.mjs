import {readFile} from 'node:fs/promises';
const [js,css,build]=await Promise.all([
  readFile('apps/web/runtime-r183.js','utf8'),
  readFile('apps/web/r183.css','utf8'),
  readFile('apps/web/build-r183.mjs','utf8')
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
for(const m of ["const REVISION='r183-web-clean-profile';","await import('./build-r182.mjs')","app-v183.js","runtime-r183.js","r183.css"])if(!build.includes(m))throw new Error('r183 build missing '+m);
console.log('R183_WEB_CLEAN_PROFILE_OK headers=clean profile=4col-wide extras=collapsible historical=true');
