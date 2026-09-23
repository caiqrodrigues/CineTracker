import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r337.mjs');
const gate=spawnSync(process.execPath,['test-r337.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R337_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r337 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.128'||release.revision!=='r337-official-1.0.128')throw new Error('r337 release identity mismatch');
console.log('WEB_R337_OFFICIAL_OK');
