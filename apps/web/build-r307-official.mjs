import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r307.mjs');
const gate=spawnSync(process.execPath,['test-r307.mjs'],{
  cwd:process.cwd(),
  stdio:'inherit',
  env:{...process.env,CT_R307_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error(`r307 static production gate failed (${gate.status})`);

const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.98'||release.revision!=='r307-official-1.0.98')throw new Error('r307 release identity mismatch');
console.log('WEB_R307_OFFICIAL_OK production build + exact-watch/frontier/renderer regression gate green');
