import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r346.mjs');
const gate=spawnSync(process.execPath,['test-r346.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R346_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r346 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.137'||r.revision!=='r346-official-1.0.137')throw new Error('r346 identity');
console.log('WEB_R346_OFFICIAL_OK');