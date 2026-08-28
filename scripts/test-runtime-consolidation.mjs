import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const forbiddenPatches=[
  'patch-v025.js','patch-v027.js','patch-v029.js','patch-v030.js',
  'patch-v040.js','patch-v041.js','patch-v042.js','patch-v043.js','patch-v044.js','patch-v045.js','patch-v046.js',
  'patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'
];
for(const rel of ['dist','apps/web/dist']){
  const dir=resolve(root,rel),html=await readFile(resolve(dir,'index.html'),'utf8');
  const patchTags=[...html.matchAll(/<script\s+src=["']\/patch-[^"']+\.js["']><\/script>/g)];
  if(patchTags.length) throw new Error(`${rel}: legacy patch script tags remain: ${patchTags.length}`);
  const tag=(html.match(/<script\s+src=["']\/cinetracker-runtime-consolidated\.js["']><\/script>/g)||[]).length;
  if(tag!==1) throw new Error(`${rel}: expected exactly one consolidated runtime tag, got ${tag}`);
  const runtime=await readFile(resolve(dir,'cinetracker-runtime-consolidated.js'),'utf8');
  for(const marker of ['__ct0997AuthoritativeLoaded','__ct0997RealSmoke119Loaded','__ct0997Structural120Loaded','cinetracker_profile_payload_v0997','cinetracker_discovery_exclusions_v0994','ct-enrich-media-user']){
    if(!runtime.includes(marker)) throw new Error(`${rel}: required runtime marker missing: ${marker}`);
  }
  for(const name of forbiddenPatches){
    if(runtime.includes(`/* ==== ${name} ==== */`)) throw new Error(`${rel}: superseded runtime still executes: ${name}`);
  }
  // Explicit regressions from real-device smoke: these legacy selectors/authorities must stay out.
  for(const legacy of ['#ct29-overlay','ct30-open-history','ct44-hour-chart','setInterval(scan,3000)']){
    if(runtime.includes(legacy)) throw new Error(`${rel}: forbidden legacy behavior returned: ${legacy}`);
  }
  const files=await readdir(dir);
  if(files.some(x=>/^patch-.*\.js$/.test(x))) throw new Error(`${rel}: individual patch files still shipped after consolidation`);
}
console.log('Runtime consolidation parity: PASS — one emitted runtime, superseded UI authorities absent, canonical 0.99.7 behavior retained.');
