import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r364.mjs');
const gate=spawnSync(process.execPath,['test-r364.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R364_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r364 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.155'||r.revision!=='r364-official-1.0.155')throw new Error('r364 release identity mismatch');
console.log('WEB_R364_OFFICIAL_OK');