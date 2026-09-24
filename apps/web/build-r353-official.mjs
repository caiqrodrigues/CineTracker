import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r353.mjs');
const gate=spawnSync(process.execPath,['test-r353.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R353_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r353 static gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.144'||r.revision!=='r353-official-1.0.144')throw new Error('r353 release identity mismatch');
console.log('WEB_R353_OFFICIAL_OK');