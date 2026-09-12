import {readFile} from 'node:fs/promises';
const [runtime,build]=await Promise.all([readFile(new URL('./runtime-r255-discover-cards-home-sports-profile.js',import.meta.url),'utf8'),readFile(new URL('./build-r255.mjs',import.meta.url),'utf8')]);
const A=(c,m)=>{if(!c)throw new Error('R255_STATIC '+m)};
for(const x of [
 "window.__ctR255='discover-cards-home-buckets-sports-f1-profile-live'",
 "window.__ctR255Home='backend-buckets-conservative-live-release+rich-movies'",
 "window.__ctR255Discover='poster-first-nine-tabs-full-watchlist-atomic'",
 "window.__ctR255Sports='five-tabs-dark-cards-f1-six-approved-tabs'",
 "window.__ctR255Profile='approved-layout-canonical-sports-values'",
 "['next','Próximos']","['live','Ao vivo']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']",
 "['overview','Visão geral']","['calendar','Calendário']","['standings','Classificações']","['drivers','Pilotos']","['teams','Equipes']","['circuits','Circuitos']",
 'cinetracker_watchlist_full_v119','cinetracker_sport_stats_v1','cinetracker_sport_toggle_favorite_v1','ct255-media-poster','ct255-home-movie-card','patchProfileSports255','releasedFrontier255','ignoreShown:true'
])A(runtime.includes(x),'missing '+x);
A(!runtime.includes('next_episode_to_air'),'Home must never promote a future episode');
A(build.includes("await import('./build-r252-official.mjs')"),'r255 must compose from r252');
A(!build.includes("await import('./build-r253")&&!build.includes("await import('./build-r254"),'r253/r254 must not be composition bases');
A(build.includes('window.__ctR255LegacyR239ObserverDisabled=true'),'r239 observer must be retired');
A(build.includes('window.__ctR255R252QueueClassifierDisabled=true')&&build.includes('window.__ctR255R252PaintClassifierDisabled=true'),'r252 Home wrappers must be retired');
A(build.includes('profilePatchOld')&&build.includes('if(val.textContent!==next)'),'Profile patch must be idempotent');
console.log('R255_STATIC_PASS');
