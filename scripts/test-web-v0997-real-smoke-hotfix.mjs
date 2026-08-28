import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/web/patch-v119-v0997-real-smoke-hotfix.js'),'utf8');
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));

const must=[
  ['single smoke authority','__ct0997RealSmoke119Loaded'],
  ['discover json normalization','unwrapExclusions119'],
  ['discover safe dashboard fallback','fallbackExclusions119'],
  ['original TMDB title alias','__ct119OriginalAlias'],
  ['legacy profile graph cleanup','.ct99-panel'],
  ['navigation capture','.sidebar .nav button,.mobile-nav button'],
  ['visible poster repair','repairPosters119'],
  ['same release version','v119-real-device-smoke-hotfix']
];
for(const [name,token] of must){if(!patch.includes(token))throw new Error(`0.99.7 smoke regression: missing ${name} (${token})`)}
if(pkg.version!=='0.99.8')throw new Error(`v119 regression suite expected release 0.99.8 (got ${pkg.version})`);

for(const dir of ['dist','apps/web/dist']){
  const html=await readFile(resolve(root,dir,'index.html'),'utf8');
  const v118=html.indexOf('/patch-v118-v0997-authoritative.js');
  const v119=html.indexOf('/patch-v119-v0997-real-smoke-hotfix.js');
  if(v118<0||v119<0||v119<v118)throw new Error(`${dir}: v119 must load after v118`);
  if((html.match(/patch-v119-v0997-real-smoke-hotfix\.js/g)||[]).length!==1)throw new Error(`${dir}: v119 must be included exactly once`);
}
console.log('CineTracker Web v119 regression under 0.99.8: OK');