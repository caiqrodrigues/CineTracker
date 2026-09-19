import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r316.mjs');
const gate=spawnSync(process.execPath,['test-r316.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R316_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r316 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.107'||release.revision!=='r316-official-1.0.107')throw new Error('r316 release identity mismatch');
console.log('WEB_R316_OFFICIAL_OK production gate green');
