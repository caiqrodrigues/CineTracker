import {readFile} from 'node:fs/promises';
await import('./build-r296-official.mjs');
const [js,css,release,migration,pkg]=await Promise.all([
 readFile('dist/app-v296.js','utf8'),
 readFile('dist/app-v296.css','utf8'),
 readFile('dist/release.json','utf8'),
 readFile('../../supabase/migrations/20260915143000_r296_recommendations_sports_stadium.sql','utf8'),
 readFile('package.json','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw Error('R296_TEST missing '+x)};
for(const x of[
 "score<7.5","year<=1990","pureDramaDocumentary","WWE_RE","SEVEN=7*DAY",
 "cinetracker_shown_recommendations_recent_v296","cinetracker_shown_recommendations_record_v296",
 "SPORT_TABS255.splice","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']",
 "saoDay(startMs(x))===saoDay(now)","now-72*3600000","data-ct296-choice=\"screen\"","data-ct296-choice=\"stadium\"",
 "Nome do Estádio (opcional)","🏟️ No Estádio","Jogos no Estádio"
])must(js,x);
for(const x of[
 "attended_in_person boolean not null default false","stadium_name text",
 "cinetracker_sports_watch_set_v296","cinetracker_sports_stadium_summary_v296",
 "cinetracker_shown_recommendations_record_v296","interval '7 days'"
])must(migration,x);
for(const x of[".ct296-stadium-badge","rgba(245,158,11,.12)","[data-home] .ct264-watch-btn","width:40px","[data-profile] .stat","rgba(255,255,255,.02)","[data-settings] input","rgba(255,255,255,.03)",".sidebar","backdrop-filter:blur(12px)"])must(css,x);
const m=JSON.parse(release),p=JSON.parse(pkg);
if(m.version!=='1.0.87'||m.revision!=='r296-official-1.0.87'||m.android!=='1.0.20/10062')throw Error('R296_TEST release mismatch');
if(p.version!=='1.0.87'||p.scripts.build!=='node build-r296-official.mjs')throw Error('R296_TEST package mismatch');
console.log('R296_STATIC_OK strict For You + exact four Sports tabs + stadium persistence + Web polish');
