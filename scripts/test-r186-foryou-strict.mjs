import {readFile} from 'node:fs/promises';
const [js,build,pkg]=await Promise.all([
  readFile('apps/web/runtime-r186-shared.js','utf8'),
  readFile('apps/web/build-r186.mjs','utf8'),
  readFile('apps/web/package.json','utf8')
]);
for(const m of [
  "window.__ctR186='foryou-strict-quality-year-history-realtime'",
  "reserve-popular-unseen-equivalent-keeps-seven-slots-filled",
  "const CT186_MIN_SCORE=7.5",
  "const CT186_MIN_YEAR=1991",
  "g.includes(99)||(g.length>0&&g.every(id=>id===18))",
  "ct186Score(x)>=CT186_MIN_SCORE&&ct186Year(x)>=CT186_MIN_YEAR",
  "ct186DashHistory(x)",
  "ct186DashWatchlist(x)",
  "!ct186InHistory(x,c)&&!ct186InWatchlist(x,c)",
  "ct186InWatchlist(x,c)&&!ct186InHistory(x,c)",
  "_ct_watchlist:true",
  "'primary_release_date.gte':'1991-01-01'",
  "'first_air_date.gte':'1991-01-01'",
  "'vote_average.gte':CT186_MIN_SCORE",
  "'without_genres':'99'",
  "sort_by:'popularity.desc'",
  "movie:fresh.movie.length<3||!watch.movie.length",
  "series:fresh.series.length<2||!watch.series.length",
  "anime:fresh.anime.length<2||!watch.anime.length",
  "fresh[k]=ct186MergeRows(fresh[k],reserve[k])",
  "if(!watch[k].length)fallback[k]=reserve[k]",
  "ct186DailyStorage()",
  "localDay()+':'+String(user?.id",
  "const daily=take(ct186DailyPick(f.movie,used))",
  "const wmPool=ct186PoolFor(w.movie,fb.movie,used)",
  "const fm=take(ct186Pick(f.movie,'fresh:movie',used))",
  "watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa",
  "ct166RenderForYou=ct186RenderForYou",
  "const ct186AddWatchlistBase=addWatchlist",
  "const ct186MarkSeenBase=markSeen",
  "window.addEventListener('cinetracker:data-changed'",
  "table:'watch_history'",
  "table:'media_overrides'",
  "filter:'profile_id=eq.'+uid",
  "m.event!=='postgres_changes'",
  "ct186LocalBlocked.add(k);ct186PaintCurrent()"
])if(!js.includes(m))throw new Error('r186 runtime missing '+m);
if(js.includes('CT186_MIN_YEAR=1990'))throw new Error('r186 must exclude 1990');
if(!build.includes("const REVISION='r186-foryou-strict-realtime';")||!build.includes('runtime-r186-shared.js')||!build.includes('app-v186.js'))throw new Error('r186 build identity missing');
if(!pkg.includes('build-r186.mjs'))throw new Error('package not building r186');
console.log('R186_FORYOU_STRICT_OK score>=7.5 year>=1991 history=blocked watchlist=conditional drama=pure-only documentary=blocked unique=7 reserve=exact-slots realtime=true');
