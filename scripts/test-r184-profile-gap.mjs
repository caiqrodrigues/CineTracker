import {readFile} from 'node:fs/promises';
const [shared,sharedCss,web,webCss,build]=await Promise.all([
  readFile('apps/web/runtime-r184-shared.js','utf8'),
  readFile('apps/web/r184-shared.css','utf8'),
  readFile('apps/web/runtime-r184-web.js','utf8'),
  readFile('apps/web/r184-web.css','utf8'),
  readFile('apps/web/build-r184.mjs','utf8')
]);
for(const m of [
  "detect-skipped-released-episodes-before-manual-watch","skip-or-mark-previous",
  "all-released-episodes-before-target-across-seasons","ct184SkippedBefore",
  "Pular e marcar só","Marcar anteriores +","ct181Released","ct181Watched",
  "await ct181Pool(jobs,4","ct181PrimeNext","ct181Reconcile",
  "const ct184MarkEpisodeBase=ct169MarkEpisode","ct169MarkEpisode=async function"
])if(!shared.includes(m))throw new Error('r184 shared missing '+m);
for(const m of ['.ct184-gap-confirm','.ct184-gap-actions','.ct184-gap-actions .primary','env(safe-area-inset-bottom)'])if(!sharedCss.includes(m))throw new Error('r184 shared css missing '+m);
for(const m of [
  "profile-favorite-add-gap-prompt","restore-series-movie-actor-add-controls",
  "'Séries Favoritas':{kind:'tv'","'Filmes Favoritos':{kind:'movie'","'Atores Favoritos':{kind:'person'",
  'data-add-favorite','ct184RestoreFavoriteAdd','ctR180EnhanceProfile=function'
])if(!web.includes(m))throw new Error('r184 web missing '+m);
for(const m of ['.ct184-favorite-actions','.ct184-favorite-add'])if(!webCss.includes(m))throw new Error('r184 web css missing '+m);
for(const m of ["await import('./build-r183.mjs')","r184-favorites-gap-prompt","app-v184.js","runtime-r184-shared.js","runtime-r184-web.js","function openFavoriteSearch158(kind)"])if(!build.includes(m))throw new Error('r184 build missing '+m);
if(shared.includes('last_episode_number'))throw new Error('r184 gap prompt must use watched set, not last episode pointer');
console.log('R184_PROFILE_GAP_OK favorites=series+movie+actor gap=skip-or-fill released-only');
