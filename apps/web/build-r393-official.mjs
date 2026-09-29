import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r393.mjs');
const g=spawnSync(process.execPath,['test-r393.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R393_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r393 static gate failed');
const b=spawnSync(process.execPath,['test-r393-browser.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R393_SKIP_BUILD:'1'}});
if(b.status!==0)throw new Error('r393 browser gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.184'||r.revision!=='r393-official-1.0.184')throw new Error('r393 identity');
console.log('WEB_R393_OFFICIAL_OK');
