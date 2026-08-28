import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
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
  const files=await readdir(dir);
  if(files.some(x=>/^patch-.*\.js$/.test(x))) throw new Error(`${rel}: individual patch files still shipped after consolidation`);
}
console.log('Runtime consolidation parity: PASS — ordered patch delivery collapsed to one script without removing source behavior.');
