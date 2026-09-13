import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [runtime,build,edge]=await Promise.all([
 readFile(resolve(root,'runtime-r263-user-ground-truth.js'),'utf8'),
 readFile(resolve(root,'build-r263.mjs'),'utf8'),
 readFile(resolve(root,'../../supabase/functions/ct-f1-sports-sync-r263/index.ts'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R263_STATIC missing '+x)};
for(const x of["window.__ctR263Home='vertical-list-only-no-carousel'",'function enforceHomeList263()','function armDetail263()','function armDiscover263()','async function syncF1263()',"edge('ct-f1-sports-sync-r263'"])must(runtime,x);
for(const x of["p_event_id:id","const CACHE='ct-web-1.0.54-r263'",'ct263-home-list','ct263-discover-card','aspect-ratio:2/3'])must(build,x);
if(build.includes("p_provider:provider,p_provider_event_id:id"))throw new Error('R263_STATIC legacy sports watched RPC remains');
for(const x of['api.jolpi.ca/ergast/f1','America/Sao_Paulo',"['race','Corrida',null,180]",'provider_event_id:`${race.season}:${race.round}:${key}`'])must(edge,x);
console.log('R263_STATIC_OK');
