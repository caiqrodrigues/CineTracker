import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch='patch-v131-v0997-rich-movie-discover.js';
const bridge='patch-v131b-v0997-person-credit-bridge.js';
const source=resolve(root,'apps/web',patch);
const bridgeSource=resolve(root,'apps/web',bridge);

let runtime=await readFile(source,'utf8');
const original=runtime;
runtime=runtime
  .replace('const tomorrow=shiftDays(1),future=shiftDays(540);','const tomorrow=shiftDays(1);')
  .replace("'primary_release_date.gte':tomorrow,'primary_release_date.lte':future,sort_by:'primary_release_date.asc'","'primary_release_date.gte':tomorrow,sort_by:'primary_release_date.asc'")
  .replace("'first_air_date.gte':tomorrow,'first_air_date.lte':future,sort_by:'first_air_date.asc'","'first_air_date.gte':tomorrow,sort_by:'first_air_date.asc'");
if(runtime===original||runtime.includes('shiftDays(540)')||runtime.includes("release_date.lte':future")){
  throw new Error('Web v131: strict future-date compile transform failed');
}

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,patch),runtime,'utf8');
  await copyFile(bridgeSource,resolve(dir,bridge));
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const tag=`<script src="/${patch}"></script>`;
  const bridgeTag=`<script src="/${bridge}"></script>`;
  html=html.replaceAll(tag,'').replaceAll(bridgeTag,'');
  const anchor='<script src="/patch-v130-v0997-nav-footer-stability.js"></script>';
  if(!html.includes(anchor))throw new Error(`Web v131: v130 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}${tag}${bridgeTag}`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7 r131: detalhe rico + Descobrir 6 abas + futuro estrito sem teto + bridge de filmografia emitidos.');
await import('./apply-web-v0997-r131c-targeted-corrections.mjs');
await import('./apply-web-v0997-r131d-real-data-path.mjs');
await import('./apply-web-v0997-r131e-enable-runtime.mjs');
await import('./apply-web-v0997-r131f-home-payload-authority.mjs');
await import('./apply-web-v0997-r131g-source-renderer-fixes.mjs');
await import('./apply-web-v0997-r134-discover.mjs');
await import('./apply-web-v0997-r134-live.mjs');
await import('./apply-web-v0997-r134-routes.mjs');
await import('./apply-web-v0997-r135-final-authority.mjs');
await import('./apply-web-v0997-r135-home-card-bridge.mjs');
await import('./apply-web-v0997-r136-direct-primary.mjs');
await import('./apply-web-v0997-r137-single-authority.mjs');
await import('./apply-web-v0997-r138-network-gate.mjs');
await import('./apply-web-v0997-r139-cache-buttons.mjs');
await import('./apply-web-v0997-r140-profile-discover-lock.mjs');
await import('./apply-web-v0997-r141-boot-quarantine.mjs');
await import('./apply-web-v0997-r142-route-freeze.mjs');
await import('./apply-web-v0997-r143-nav-capture.mjs');
await import('./apply-web-v0997-r145-runtime-continuity.mjs');
await import('./apply-web-v0997-r147-home-payload-resilience.mjs');
await import('./apply-web-v0997-r148-desktop-web-lock.mjs');
await import('./apply-web-v0997-r149-discover-contract.mjs');
await import('./apply-web-v0997-r150-calendar-release-sync.mjs');
await import('./apply-web-v0997-r150b-realtime-sync.mjs');
await import('./apply-web-v0997-r151-library-identity-reconcile.mjs');
await import('./apply-web-v0997-r153-disable-r152-regression.mjs');
