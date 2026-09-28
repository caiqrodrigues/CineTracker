import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r392.mjs');
const g=spawnSync(process.execPath,['test-r392.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R392_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r392 static gate failed');
const b=spawnSync(process.execPath,['test-r392-browser.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R392_SKIP_BUILD:'1'}});
if(b.status!==0)throw new Error('r392 browser gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.183'||r.revision!=='r392-official-1.0.183')throw new Error('r392 identity');
console.log('WEB_R392_OFFICIAL_OK');
