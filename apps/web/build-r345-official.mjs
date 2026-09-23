import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r345.mjs');
const gate=spawnSync(process.execPath,['test-r345.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R345_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r345 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.136'||r.revision!=='r345-official-1.0.136')throw new Error('r345 identity');
console.log('WEB_R345_OFFICIAL_OK');