import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r360.mjs');
const gate=spawnSync(process.execPath,['test-r360.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R360_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r360 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.151'||r.revision!=='r360-official-1.0.151')throw new Error('r360 identity');
console.log('WEB_R360_OFFICIAL_OK');