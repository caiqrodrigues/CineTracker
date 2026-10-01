import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r420.mjs');
const gate=spawnSync(process.execPath,['test-r420.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R420_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r420 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.211'||release.revision!=='r420-official-1.0.211')throw new Error('r420 release mismatch');
console.log('WEB_R420_OFFICIAL_OK');
