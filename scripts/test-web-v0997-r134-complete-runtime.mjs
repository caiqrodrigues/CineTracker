import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const names=['patch-v134a-v0997-discover-final.js','patch-v134b-v0997-live-home-calendar.js','patch-v134c-v0997-deeplink-details.js'];
for(const n of names)execFileSync(process.execPath,['--check',`dist/${n}`],{stdio:'pipe'});
const [discover,live,routes,html,migration]=await Promise.all([
  readFile('dist/'+names[0],'utf8'),readFile('dist/'+names[1],'utf8'),readFile('dist/'+names[2],'utf8'),readFile('dist/index.html','utf8'),readFile('supabase/migrations/20260829135000_v0997_home_release_r2.sql','utf8')
]);
for(const n of names)if((html.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length!==1)throw new Error(`r134 ${n} must appear once in index`);
const pos=names.map(n=>html.indexOf(n));if(!(pos[0]>=0&&pos[1]>pos[0]&&pos[2]>pos[1]))throw new Error('r134 final runtimes must load Discover -> live -> routes');
for(const x of ["['new','Novidades']","['anticipated','Mais Aguardados']",'__ct0997MediaDiscover134Loaded'])if(!discover.includes(x))throw new Error('r134 Discover missing '+x);
for(const x of ["LIVE_HOME_RPC='cinetracker_home_live_v0997_r2'",'data-ct131d-calendar','Minha Watchlist','patchSeriesFromLive','patchMoviesFromLive'])if(!live.includes(x))throw new Error('r134 live missing '+x);
for(const x of ['__ct0997DeepLink134Loaded','mMovie=p.match','mSeries=p.match','mPerson=p.match','collapseSeasons(shell)','cards.forEach((c,i)=>c.hidden=i>=10)','Ver todo elenco','Ver todos os filmes','Ver todas as séries',"data-ct132-add-favorite=\"movie\"",'ct132-profile-preview','nth-child(n+11)','ct91-settings'])if(!routes.includes(x))throw new Error('r134 routes missing '+x);
if(routes.includes('for(const d of[0,100,350,900,1800])'))throw new Error('r134 must not repeatedly rerender primary routes on boot');
for(const x of ['cinetracker_released_episodes_v0997','last_e>current_count','cinetracker_profile_home_payload_v0997_r2','cinetracker_home_live_v0997_r2','last_episode_to_air','show_id'])if(!migration.includes(x))throw new Error('r134 migration missing '+x);
console.log('WEB_R134_OK fresh-assets home-release-r2 discover-Novidades calendar-watchlist profile-10 routes-fullscreen');
