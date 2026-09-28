import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r389.mjs');
const g=spawnSync(process.execPath,['test-r389.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R389_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r389 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.180'||r.revision!=='r389-official-1.0.180')throw new Error('r389 identity');
console.log('WEB_R389_OFFICIAL_OK');
