import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r386.mjs');
const g=spawnSync(process.execPath,['test-r386.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R386_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r386 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.177'||r.revision!=='r386-official-1.0.177')throw new Error('r386 identity');
console.log('WEB_R386_OFFICIAL_OK');
