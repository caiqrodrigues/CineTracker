import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r329.mjs');
const gate=spawnSync(process.execPath,['test-r329.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R329_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r329 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.120'||release.revision!=='r329-official-1.0.120')throw new Error('r329 release identity mismatch');
console.log('WEB_R329_OFFICIAL_OK');
