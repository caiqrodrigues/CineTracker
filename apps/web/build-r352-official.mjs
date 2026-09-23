import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r352.mjs');
const gate=spawnSync(process.execPath,['test-r352.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R352_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r352 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.143'||r.revision!=='r352-official-1.0.143')throw new Error('r352 release identity mismatch');
console.log('WEB_R352_OFFICIAL_OK');