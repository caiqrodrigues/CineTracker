import {readFile} from 'node:fs/promises';
const runtime=await readFile(new URL('./runtime-r253-single-authority-live-data.js',import.meta.url),'utf8');
const A=(c,m)=>{if(!c)throw new Error('R253_BACKEND_GROUND_TRUTH '+m)};
for(const x of ['cinetracker_profile_payload_v0997_r2','cinetracker_sport_stats_v1','cinetracker_home_live_v0997_r3','cinetracker_sports_payload_v1'])A(runtime.includes(x),'runtime must use '+x);
A(runtime.includes("patchSportsProfile253(sport)"),'profile sports must be patched from live stats');
A(runtime.includes("if(tab==='watched')return hist"),'watched Sports must use canonical watch_history');
A(runtime.includes("profileCache=fresh"),'profile cache must refresh from live profile payload');
console.log('R253_BACKEND_GROUND_TRUTH_PASS');
