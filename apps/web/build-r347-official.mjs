import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r347.mjs');
const gate=spawnSync(process.execPath,['test-r347.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R347_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r347 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.138'||r.revision!=='r347-official-1.0.138')throw new Error('r347 identity');
console.log('WEB_R347_OFFICIAL_OK');