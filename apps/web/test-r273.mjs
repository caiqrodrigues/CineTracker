import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r273-official.mjs');
const dist=resolve('dist'),[js,css,release]=await Promise.all(['app-v273.js','app-v273.css','release.json'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('R273_STATIC missing '+x)};
for(const x of[
 "window.__ctR273='home-r5-direct+history-undo+strict-flex-row'",
 "window.__ctR273Home='canonical-r5-state+history-first+no-false-empty'",
 "window.__ctR273Layout='flex-row-nowrap+right-action-40'",
 "for(const k of ['series','movie_watchlist','history_episodes','history_movies'])if(!Array.isArray(p[k]))throw new Error('Payload da Home sem '+k);",
 "rpc('cinetracker_profile_home_payload_v0997_r5'",
 "rpc('cinetracker_unmark_episode_v1'",
 "rpc('cinetracker_unmark_media_seen_v1'",
 'ct273CanonicalHome=homeCache;return homeCache',
 'paintHome=ct273PaintHome;renderHome=ct273RenderHome;',
 'data-ct273-history="episodes"',
 'data-ct273-history="movies"',
 'data-ct273-history-undo="',
 'Nenhum episódio no histórico.',
 'Nenhum filme no histórico.'
])must(js,x);
if(js.includes("rpc('cinetracker_home_live_v0997_r3'"))throw new Error('R273_STATIC legacy r3 RPC');
for(const x of['display:flex!important','flex-direction:row!important','flex-wrap:nowrap!important','justify-content:space-between!important','width:40px!important','height:40px!important','flex:0 0 40px!important','position:static!important'])must(css,x);
const meta=JSON.parse(release);if(meta.version!=='1.0.64'||meta.revision!=='r273-official-1.0.64'||meta.home_history_undo!==true||meta.home_card_layout!=='flex-row-nowrap')throw new Error('R273_STATIC release flags');
console.log('R273_STATIC_OK r5-history undo strict-flex-row');
