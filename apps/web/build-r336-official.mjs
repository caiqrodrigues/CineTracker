import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r336.mjs');
const gate=spawnSync(process.execPath,['test-r336.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R336_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r336 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.127'||release.revision!=='r336-official-1.0.127')throw new Error('r336 release identity mismatch');
console.log('WEB_R336_OFFICIAL_OK');
