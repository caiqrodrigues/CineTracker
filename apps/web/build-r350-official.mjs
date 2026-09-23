import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r350.mjs');
const gate=spawnSync(process.execPath,['test-r350.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R350_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r350 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.141'||r.revision!=='r350-official-1.0.141')throw new Error('r350 release identity mismatch');
console.log('WEB_R350_OFFICIAL_OK');