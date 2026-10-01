import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r424.mjs');
const gate=spawnSync(process.execPath,['test-r424.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R424_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r424 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.215'||release.revision!=='r424-official-1.0.215')throw new Error('r424 release mismatch');
console.log('WEB_R424_OFFICIAL_OK');