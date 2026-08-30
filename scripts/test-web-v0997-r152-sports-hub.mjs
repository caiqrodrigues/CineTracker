import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('Web r152 test: '+msg)};
const source=await readFile(resolve(root,'apps/web/patch-v152-v0997-sports-hub.js'),'utf8');
const runtime=await readFile(resolve(root,'dist/patch-v152-v0997-sports-hub.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const sw=await readFile(resolve(root,'dist/service-worker.js'),'utf8');
const chain=await readFile(resolve(root,'scripts/apply-web-v0997-rich-movie-discover.mjs'),'utf8');

for(const marker of[
  "window.__ct0997R152Loaded",
  "window.__ct0997R152='r152-sports-hub-v1'",
  "'/sports'",
  'data-ct152-nav',
  'Hoje','Ao vivo','Calendário','Favoritos',
  'cinetracker_sports_payload_v1',
  'ct-sports-sync',
  'cinetracker_sport_toggle_favorite_v1',
  'soccer','formula_1','mma','basketball','american_football','ice_hockey'
])must(source.includes(marker),`source missing ${marker}`);

must(runtime.includes('eventLocalDay(x.starts_at)===localDay()'),'runtime today is not device-local');
must(runtime.includes('groupBy(events,e=>eventLocalDay(e.starts_at))'),'calendar is not grouped by local day');
must(!runtime.includes("toLocaleDateString('sv-SE')"),'runtime still uses locale hack for date key');
must(runtime.includes("if(isSports()&&!$('#ct152-sports'))render()"),'observer root restoration guard missing');
must(html.includes('<script src="/patch-v151-v0997-library-identity-reconcile.js?r151"></script><script src="/patch-v152-v0997-sports-hub.js?r152"></script>'),'r152 not immediately after r151');
must(html.includes('ct-r148-web-pc-android'),'Web PC lock missing');
must(!html.includes('(max-device-width:'),'device-width responsive regression returned');
must(sw.includes('ct-web-0.99.7-r152'),'service worker revision missing');
must(chain.includes("await import('./apply-web-v0997-r151-library-identity-reconcile.mjs');"),'r151 chain missing');
must(chain.includes("await import('./apply-web-v0997-r152-sports-hub.mjs');"),'r152 chain missing');

console.log('WEB_R152_TEST_OK sports=native route=/sports tabs=today/live/calendar/favorites providers=canonical today=local observer=guarded r148=preserved');
