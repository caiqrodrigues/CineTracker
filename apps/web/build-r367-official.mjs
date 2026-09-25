import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r367.mjs');
const gate=spawnSync(process.execPath,['test-r367.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R367_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r367 gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.158'||r.revision!=='r367-official-1.0.158')throw new Error('r367 identity mismatch');
console.log('WEB_R367_OFFICIAL_OK');