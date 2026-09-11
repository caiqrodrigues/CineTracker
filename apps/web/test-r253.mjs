import {readFile} from 'node:fs/promises';
const [runtime,build,pkg]=await Promise.all([
 readFile(new URL('./runtime-r253-single-authority-live-data.js',import.meta.url),'utf8'),
 readFile(new URL('./build-r253.mjs',import.meta.url),'utf8'),
 readFile(new URL('./package.json',import.meta.url),'utf8')
]);
const A=(c,m)=>{if(!c)throw new Error('R253_STATIC '+m)};
A(pkg.includes('"version": "1.0.44"'),'web package version');
for(const x of[
 "window.__ctR253='single-authority-live-data'",
 "renderHome=async function(seq)",
 "renderSports=async function(seq)",
 "renderDiscover=async function(seq)",
 "const baseProfile253=renderProfile",
 "cinetracker_home_live_v0997_r3",
 "cinetracker_sports_payload_v1",
 "cinetracker_sport_mark_watched_v1",
 "cinetracker_profile_payload_v0997_r2",
 "cinetracker_sport_stats_v1",
 "data-ct253-sport-tab",
 "data-ct253-discover-tab",
 "data-ct253-refresh",
 "['next','Próximos']",
 "['previous','Anteriores']",
 "['favorites','Favoritos']",
 "['watched','Assistidos']",
 "['top10','Top 10']",
 "['releases','Lançamentos']"
])A(runtime.includes(x),'missing '+x);
A(!runtime.includes('data-sports-tab='),'legacy sports tab selector in r253 renderer');
A(!runtime.includes('data-discover-tab='),'legacy discover tab selector in r253 renderer');
A(build.includes('r239Observer')&&build.includes('__ctR253LegacyR239ObserverDisabled'),'r239 observer not disabled');
A(build.includes('__ctR253R252QueueClassifierDisabled')&&build.includes('__ctR253R252PaintClassifierDisabled'),'r252 Home classifier not disabled');
A(build.includes("r253-official-1.0.44"),'release identity');
console.log('R253_STATIC_PASS');
