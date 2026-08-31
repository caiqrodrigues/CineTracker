import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r166.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
const appPath=resolve(dist,'app-v166.js');
let js=await readFile(appPath,'utf8');
if(!js.includes("window.__ctR166='discover-sports-profile-fixes';"))throw new Error('r166 finalizer requires r166 runtime');

js=js.replace(
  "if(b)b.textContent=ct166FmtMinutes(sports.sports_minutes);",
  "if(b&&sports?.sports_minutes!=null)b.textContent=ct166FmtMinutes(sports.sports_minutes);"
);

const finalPatch=String.raw`
/* r166 final profile sports hydration */
window.__ct166ProfileSportsHydration='rpc-fallback';
const ct166RenderProfileHydrationBase=renderProfile;
renderProfile=async function(seq){
  await ct166RenderProfileHydrationBase(seq);
  if(seq!==navSeq||route()!=='profile')return;
  if(!profileCache?.sports_stats){
    const ss=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>null);
    if(ss&&profileCache){profileCache={...profileCache,sports_stats:ss};ct166WriteProfileCache?.(profileCache)}
  }
  ct166FixProfileDom(profileCache||{});
};
function ct166WriteProfileCache(d){try{ct163Write('profile',d)}catch{}}
`;
js=js.replace('\nasync function globalSearch',finalPatch+'\nasync function globalSearch');
await writeFile(appPath,js,'utf8');
console.log('WEB_R166_FINAL profile-sports=rpc-fallback');
