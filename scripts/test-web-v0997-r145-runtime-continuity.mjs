import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r145: '+msg)};
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const preload=await readFile(resolve(root,'dist/patch-v1196-v0997-persistent-preload.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v143-v0997-primary-router.js'),'utf8');
const detail=await readFile(resolve(root,'dist/patch-v134c-v0997-deeplink-details.js'),'utf8');

must(preload.includes("const HOME_LIVE_RPC='cinetracker_home_live_v0997_r2'"),'current Home RPC is not persisted');
must(preload.includes("window.__ct0997PreloadedHomeLive=value"),'current Home snapshot is not exposed');
must(preload.includes('authProbeCount>=48'),'restored-session warm probe missing');
must(primary.includes('window.__ct0997PreloadedHomeLive'),'primary Home does not consume persistent snapshot');
must(primary.includes("window.__ct0997PersistentPreloadRpc||rpcDirect"),'primary runtime is not using persistent RPC bridge');
must(detail.includes("routePending145('Carregando detalhes…')"),'detail continuity indicator missing');
must(detail.indexOf("await oldOpenDetail(type,Number(id))")<detail.indexOf('const body=await ensureFrame();'),'detail page is still cleared before legacy detail is ready');
must(detail.includes("routePending145('Carregando ator…')"),'person continuity indicator missing');
for(const asset of [
  'patch-v1196-v0997-persistent-preload.js?r145',
  'patch-v134c-v0997-deeplink-details.js?r145',
  'patch-v143-v0997-nav-gate.js?r145',
  'patch-v143-v0997-primary-router.js?r145'
])must(index.includes(asset),`cache-busted asset missing: ${asset}`);
must(!index.includes('ct144-phone'),'rejected separate phone mode returned');

console.log('WEB_R145_OK home=warm-live profile=warm-restored detail=continuous cache=mixed-runtime-busted');
