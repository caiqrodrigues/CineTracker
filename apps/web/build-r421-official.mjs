import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r421.mjs');
const gate=spawnSync(process.execPath,['test-r421.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R421_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r421 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.212'||release.revision!=='r421-official-1.0.212')throw new Error('r421 release mismatch');
console.log('WEB_R421_OFFICIAL_OK');
