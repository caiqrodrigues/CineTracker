import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r349.mjs');
const gate=spawnSync(process.execPath,['test-r349.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R349_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r349 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.140'||r.revision!=='r349-official-1.0.140')throw new Error('r349 release identity mismatch');
console.log('WEB_R349_OFFICIAL_OK');