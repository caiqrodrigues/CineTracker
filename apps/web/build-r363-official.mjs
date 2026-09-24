import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r363.mjs');
const gate=spawnSync(process.execPath,['test-r363.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R363_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r363 static production gate failed ('+gate.status+')');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.154'||r.revision!=='r363-official-1.0.154')throw new Error('r363 release identity mismatch');
console.log('WEB_R363_OFFICIAL_OK');