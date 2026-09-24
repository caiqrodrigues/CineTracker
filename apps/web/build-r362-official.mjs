import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r362.mjs');
const gate=spawnSync(process.execPath,['test-r362.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R362_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r362 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.153'||r.revision!=='r362-official-1.0.153')throw new Error('r362 identity');
console.log('WEB_R362_OFFICIAL_OK');