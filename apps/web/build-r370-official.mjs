import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r370.mjs');
const g=spawnSync(process.execPath,['test-r370.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R370_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r370 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.161'||r.revision!=='r370-official-1.0.161')throw new Error('r370 identity');
console.log('WEB_R370_OFFICIAL_OK');