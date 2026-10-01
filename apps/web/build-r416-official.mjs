import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r416.mjs');
const gate=spawnSync(process.execPath,['test-r416.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R416_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r416 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.207'||release.revision!=='r416-official-1.0.207')throw new Error('r416 release identity mismatch');
console.log('WEB_R416_OFFICIAL_OK production gate green');
