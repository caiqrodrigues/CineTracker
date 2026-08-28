import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=await readFile(resolve(root,'apps/web/patch-v133-v0997-primary-authority.js'),'utf8');
const must=[
  'v133-primary-single-authority-home-discover-profile',
  "rpcDirect('cinetracker_profile_home_payload_v0994'",
  "rpcDirect('cinetracker_profile_media_dashboard_v0991'",
  'releasedCount(detail)',
  'last_episode_to_air',
  'cleanBaseTitle',
  '(US|USA|UK|GB|AU|CA)',
  "Math.max(0,released-seen)",
  "home_bucket='up_to_date'",
  'history_episodes',
  'history_movies',
  'watch_history?select=',
  'media_overrides?select=media_id,state',
  'Minha Watchlist',
  "state.calendar==='watchlist'",
  'Juntando poeira',
  'Assistir a seguir',
  'Em dia',
  'slice(0,10)',
  'rows.length>10',
  'centerTimeline',
  'for(let i=-60;i<=3;i++)',
  'collapseSeriesInitial',
  '.ct91-settings',
  'window.__ct132Go=path=>go(path)',
  "if(p==='/home')",
  "if(p==='/discover')",
  "if(p==='/profile')"
];
for(const token of must)if(!source.includes(token))throw new Error(`Web r133 source contract missing: ${token}`);
if(source.includes("history_episodes:[]")||source.includes("history_movies:[]"))throw new Error('Web r133 must not synthesize an empty Home history fallback.');
if(source.includes('Faltam ${Math.max(0,total-seen)}'))throw new Error('Web r133 must never calculate missing episodes from total catalog episodes.');

for(const dir of ['dist','apps/web/dist']){
  try{await access(resolve(root,dir,'index.html'),constants.F_OK)}catch{continue}
  const html=await readFile(resolve(root,dir,'index.html'),'utf8');
  const a=html.indexOf('/patch-v132-v0997-deeplink-pages.js');
  const b=html.indexOf('/patch-v133-v0997-primary-authority.js');
  if(a<0||b<0||b<a)throw new Error(`Web r133: runtime tag missing or ordered before r132 in ${dir}.`);
  const emitted=await readFile(resolve(root,dir,'patch-v133-v0997-primary-authority.js'),'utf8');
  if(!emitted.includes('v133-primary-single-authority-home-discover-profile'))throw new Error(`Web r133: emitted marker missing in ${dir}.`);
}

console.log('CineTracker Web 0.99.7 r133 primary authority contracts: OK');
