import { readFile } from 'node:fs/promises';
const js=await readFile('dist/patch-v131d-v0997-real-data-path.js','utf8');
const html=await readFile('dist/index.html','utf8');
const checks=[
  ['marker','v131d-live-home-profile-calendar'],
  ['live home rpc','cinetracker_home_live_v0997'],
  ['series total','total_episodes'],
  ['released missing','released_episodes'],
  ['up to date label','Em dia'],
  ['movie watchlist','movie_watchlist'],
  ['movie history','history_movies'],
  ['profile 10','i>=10'],
  ['profile favorites','series-favorites'],
  ['profile actors','Atores Favoritos'],
  ['calendar','Calendário'],
  ['watchlist calendar','Minha Watchlist']
];
for(const [name,needle] of checks)if(!js.includes(needle))throw new Error(`r131d missing: ${name}`);
if(js.includes('MutationObserver')||js.includes('setInterval('))throw new Error('r131d must not introduce observer/polling loops');
const c=html.indexOf('/patch-v131c-v0997-targeted-corrections.js'),d=html.indexOf('/patch-v131d-v0997-real-data-path.js');
if(c<0||d<0||d<c)throw new Error('r131d must load after r131c');
if(html.includes('/patch-v132-v0997-deeplink-pages.js')||html.includes('/patch-v133-v0997-primary-authority.js'))throw new Error('r132/r133 must stay out of recovered baseline');
console.log('WEB_R131D_OK live-home profile-10 calendar no-loops');
