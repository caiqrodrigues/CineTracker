import{readFile}from'node:fs/promises';
const [runtime,build,official,pkg]=await Promise.all(['runtime-r300-discover-sports-profile-watchlist.js','build-r300.mjs','build-r300-official.mjs','package.json'].map(f=>readFile(f,'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw Error('R300_STATIC missing '+x)};
for(const x of["window.__ctR300='discover-bounded-recovery+four-sports-tabs+watchlist-stat-style'","window.__ctR300Discover='browse-tabs-no-infinite-loading'","window.__ctR300Sports='next+previous+watched+favorites-no-live'","window.__ctR300Profile='series-watchlist+movies-watchlist-match-clickable-style'","const SPORTS_ORDER=['next','previous','watched','favorites']",'data-ct255-sport-tab="live"','buildBrowse300','browseStillLoading','Séries Watchlist','Filmes Watchlist'])must(runtime,x);
if(runtime.includes('setInterval('))throw Error('R300_STATIC must stay bounded');
for(const x of["version:'1.0.91'","revision:'r300-official-1.0.91'","sports_tabs:'next+previous+watched+favorites'","sports_live_tab:false","discover_browse_guard:true","profile_watchlist_stat_style:'matches-clickable-sports'",'app-v300.js','app-v300.css'])must(build,x);
for(const x of["window.__ctWebBuild='1.0.91';window.__ctOfficialVersion='1.0.91';","const REVISION='r300-official-1.0.91';","const CACHE='ct-web-1.0.91-r300';"])must(official+build,x);
must(pkg,'"version": "1.0.91"');must(pkg,'build-r300-official.mjs');
console.log('R300_STATIC_OK four sports tabs + Discover bounded fallback + Watchlist stats same clickable style');
