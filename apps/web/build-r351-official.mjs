import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r351.mjs');
const gate=spawnSync(process.execPath,['test-r351.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R351_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r351 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.142'||r.revision!=='r351-official-1.0.142')throw new Error('r351 release identity mismatch');
console.log('WEB_R351_OFFICIAL_OK');