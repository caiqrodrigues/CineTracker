import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r317.mjs');
const gate=spawnSync(process.execPath,['test-r317.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R317_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r317 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.108'||release.revision!=='r317-official-1.0.108')throw new Error('r317 release identity mismatch');
console.log('WEB_R317_OFFICIAL_OK production gate green');
