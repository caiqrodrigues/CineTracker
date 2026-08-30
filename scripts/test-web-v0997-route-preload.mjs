import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const src=await readFile(resolve(root,'apps/web/patch-v1195-v0997-route-preload-core.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const must=[
  'v1195-rpc-dedupe-tmdb-prefetch',
  'cinetracker_profile_payload_v0997',
  'cinetracker_profile_media_dashboard_v0991',
  'cinetracker_discovery_exclusions_v0994',
  'requestIdleCallback',
  'pointerover',
  'data-ct121-tab',
  'window.__ct0997PreloadRoute',
  'window.__ct0997PreloadDiscoverTab',
  '/functions/v1/tmdb-proxy',
  'navigator.connection',
  'fetchCache',
  'rpcCache'
];
for(const marker of must)if(!src.includes(marker))throw new Error(`route preload marker missing: ${marker}`);
function scriptPos(name){const esc=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const m=html.match(new RegExp(`<script\\s+src="/${esc}(?:\\?[^\"]*)?"></script>`));return m?m.index:-1}
const preload=scriptPos('patch-v1195-v0997-route-preload-core.js');
const authority=scriptPos('patch-v120-v0997-structural-authority.js');
if((html.match(/patch-v1195-v0997-route-preload-core\.js/g)||[]).length!==1)throw new Error('route preload must be emitted exactly once');
if(preload<0||authority<0||preload>authority)throw new Error('route preload must execute before v120 authority');
console.log('CineTracker 0.99.7 route preload: PASS');
