import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r417.mjs');
const gate=spawnSync(process.execPath,['test-r417.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R417_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r417 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.208'||release.revision!=='r417-official-1.0.208')throw new Error('r417 release identity mismatch');
console.log('WEB_R417_OFFICIAL_OK production gate green');
