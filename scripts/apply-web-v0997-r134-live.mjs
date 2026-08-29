import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v131d-v0997-real-data-path.js');
const name='patch-v134b-v0997-live-home-calendar.js';
let js=await readFile(source,'utf8');
js=js.replaceAll('__ct0997RealData131dLoaded','__ct0997RealData134Loaded').replaceAll('__ct0997RealData131d','__ct0997RealData134').replaceAll('v131d-live-home-profile-calendar','v134-live-home-r2-profile-calendar').replaceAll('ct0997-r131d-style','ct0997-r134-live-style').replace("const LIVE_HOME_RPC='cinetracker_home_live_v0997';","const LIVE_HOME_RPC='cinetracker_home_live_v0997_r2';").replace("function schedule(forceHome=false){while(timers.length)clearTimeout(timers.pop());for(const ms of [80,350,900,1800,3500])timers.push(setTimeout(()=>reconcile(forceHome),ms))}","function schedule(forceHome=false){for(const ms of [60,220,650,1400,3000])timers.push(setTimeout(()=>reconcile(forceHome),ms))}");
if(!js.includes("LIVE_HOME_RPC='cinetracker_home_live_v0997_r2'"))throw new Error('r134 live Home r2 transform failed');
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,name),js,'utf8');
  const p=resolve(dir,'index.html');let html=await readFile(p,'utf8');const tag=`<script src="/${name}"></script>`;html=html.replaceAll(tag,'');
  html=html.replace('</body>',`${tag}</body>`);await writeFile(p,html,'utf8');
}
console.log('WEB_R134_LIVE Home r2 + Profile 10 + Calendar fresh runtime emitted');
