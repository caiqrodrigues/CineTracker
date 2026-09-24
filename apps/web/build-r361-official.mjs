import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r361.mjs');
const gate=spawnSync(process.execPath,['test-r361.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R361_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r361 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.152'||r.revision!=='r361-official-1.0.152')throw new Error('r361 identity');
console.log('WEB_R361_OFFICIAL_OK');