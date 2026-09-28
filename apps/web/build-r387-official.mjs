import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r387.mjs');
const g=spawnSync(process.execPath,['test-r387.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R387_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r387 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.178'||r.revision!=='r387-official-1.0.178')throw new Error('r387 identity');
console.log('WEB_R387_OFFICIAL_OK');
