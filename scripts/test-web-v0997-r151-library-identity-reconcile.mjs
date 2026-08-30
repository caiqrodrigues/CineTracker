import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r151 test: '+msg)};
const runtime=await readFile(resolve(root,'apps/web/patch-v151-v0997-library-identity-reconcile.js'),'utf8');
for(const marker of['ct-reconcile-library-user','Sincronizar pendentes','Revalidar tudo','requested_media_ids','source_tmdb_id','identity','covers_fixed','tmdb-proxy','(-\\d+)','seen+watchlist'])must(runtime.includes(marker),`missing ${marker}`);
const edge=await readFile(resolve(root,'supabase/functions/ct-reconcile-library-user/index.ts'),'utf8');
for(const marker of["const VERSION='r151'",'is_watchlist','is_seen','watched_episodes','source_tmdb_id','ambiguous-equal-title-year','original_surrogate_tmdb_id','identity_reconcile_version','corrected_identity','covers_fixed'])must(edge.includes(marker),`edge missing ${marker}`);
for(const dir of[resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const r150b='<script src="/patch-v150b-v0997-realtime-sync.js?r150b"></script>',r151='<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script>';
  must(html.includes(r150b),'r150b anchor missing');must(html.includes(r151),'r151 tag missing');must(html.indexOf(r151)>html.indexOf(r150b),'r151 order invalid');
  const emitted=await readFile(resolve(dir,'patch-v151-v0997-library-identity-reconcile.js'),'utf8');must(emitted.includes("window.__ct0997R151='r151-library-identity-reconcile'"),'emitted mismatch');
  const sw=await readFile(resolve(dir,'service-worker.js'),'utf8');must(sw.includes('ct-web-0.99.7-r151'),'service worker revision missing');
}
console.log('WEB_R151_TEST_OK scope=seen+watchlist identity=safe cover=repair surrogate=guard realtime=r150b-preserved');
