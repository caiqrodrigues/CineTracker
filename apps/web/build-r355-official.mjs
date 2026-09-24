import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r355.mjs');
const gate=spawnSync(process.execPath,['test-r355.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R355_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r355 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.146'||r.revision!=='r355-official-1.0.146')throw new Error('r355 release identity mismatch');
console.log('WEB_R355_OFFICIAL_OK');