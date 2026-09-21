import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r326.mjs');
const gate=spawnSync(process.execPath,['test-r326.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R326_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r326 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.117'||release.revision!=='r326-official-1.0.117')throw new Error('r326 release identity mismatch');
console.log('WEB_R326_OFFICIAL_OK');
