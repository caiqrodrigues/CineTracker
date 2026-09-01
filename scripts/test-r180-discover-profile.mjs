import {readFile} from 'node:fs/promises';
const [js,css]=await Promise.all([readFile('apps/web/runtime-r180.js','utf8'),readFile('apps/web/r180.css','utf8')]);
for(const m of [
  "window.__ctR180='strict-discover-profile-layout'",
  "['foryou','Pra você']","['top10','Top 10']","['new','Novidades']","['releases','Lançamentos']","['calendar','Calendário']",
  "const lo=shiftDays(-30),hi=localDay()","const lo=shiftDays(-7),hi=shiftDays(30)","const lo=shiftDays(1),hi=shiftDays(365)",
  "cinetracker_calendar_watchlist_v0997","ctR180Clean([...m,...t],c)","data-ct-r180-tabs","data-ct-r180-stats-toggle",
  "Tempo total de tela","Tempo total em Watchlist"
])if(!js.includes(m))throw new Error('r180 missing '+m);
for(const m of ['overflow-x:auto!important','touch-action:pan-x!important','.ct-r180-stat-wide{grid-column:span 2!important}','grid-template-columns:repeat(2,minmax(0,1fr))'])if(!css.includes(m))throw new Error('r180 css missing '+m);
if(js.includes("if(tab==='foryou')return typeof ct168ForYouRows==='function'?ct168ForYouRows():discoverRows(tab)"))throw new Error('r180 recursive foryou fallback');
console.log('R180_DISCOVER_PROFILE_OK strict-dates tabs-scroll profile-collapse-wide');
