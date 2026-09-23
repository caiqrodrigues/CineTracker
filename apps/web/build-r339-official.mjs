import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r339.mjs');
const gate=spawnSync(process.execPath,['test-r339.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R339_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r339 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.130'||release.revision!=='r339-official-1.0.130')throw new Error('r339 release identity mismatch');
console.log('WEB_R339_OFFICIAL_OK');