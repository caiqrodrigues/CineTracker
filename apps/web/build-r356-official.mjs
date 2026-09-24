import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r356.mjs');
const g=spawnSync(process.execPath,['test-r356.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R356_SKIP_BUILD:'1'}});
if(g.status!==0)throw new Error('r356 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.147'||r.revision!=='r356-official-1.0.147')throw new Error('r356 identity');
console.log('WEB_R356_OFFICIAL_OK');