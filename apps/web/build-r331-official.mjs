import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r331.mjs');
const gate=spawnSync(process.execPath,['test-r331.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R331_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r331 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.122'||release.revision!=='r331-official-1.0.122')throw new Error('r331 release identity mismatch');
console.log('WEB_R331_OFFICIAL_OK');
