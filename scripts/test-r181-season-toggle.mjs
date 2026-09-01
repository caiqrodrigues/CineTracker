import {readFile} from 'node:fs/promises';
const [js,css,build]=await Promise.all([
  readFile('apps/web/runtime-r181.js','utf8'),readFile('apps/web/r181.css','utf8'),readFile('apps/web/build-r181.mjs','utf8')
]);
for(const m of [
  "window.__ctR181='whole-season-watch-toggle'",
  "window.__ct181SeasonToggle='mark-unmark-all-released-episodes'",
  "window.__ct181PreviousPrompt='ask-before-marking-incomplete-previous-seasons'",
  "cinetracker_mark_episode_v0994","cinetracker_unmark_episode_v1",
  "data-ct181-season-toggle","Você também assistiu","Não, somente T","Sim, marcar",
  "ep.air_date&&String(ep.air_date).slice(0,10)<=today",
  "ct176PrimeWithWatched","ct176ClearMedia","ct174RefreshHome",
  "await ct181Pool(jobs,4"
])if(!js.includes(m))throw new Error('r181 missing '+m);
for(const m of ['.ct181-season-toggle.on','.ct181-season-confirm','.ct181-confirm-actions','@media(max-width:700px)'])if(!css.includes(m))throw new Error('r181 css missing '+m);
for(const m of ["await import('./build-r180.mjs')","r181-season-whole-toggle","app-v181.js","runtime-r181.js","r181.css"])if(!build.includes(m))throw new Error('r181 build missing '+m);
if(js.includes('Promise.all(jobs.map'))throw new Error('r181 must limit batch concurrency');
console.log('R181_SEASON_TOGGLE_OK released-only reversible previous-confirm r176-gap-safe');
