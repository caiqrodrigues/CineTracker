import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r371.mjs');
const g=spawnSync(process.execPath,['test-r371.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R371_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r371 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.162'||r.revision!=='r371-official-1.0.162')throw new Error('r371 identity');
console.log('WEB_R371_OFFICIAL_OK');