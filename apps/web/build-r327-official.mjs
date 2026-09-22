import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r327.mjs');
const gate=spawnSync(process.execPath,['test-r327.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R327_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r327 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.118'||release.revision!=='r327-official-1.0.118')throw new Error('r327 release identity mismatch');
console.log('WEB_R327_OFFICIAL_OK');
