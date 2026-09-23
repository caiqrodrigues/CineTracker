import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r344.mjs');
const gate=spawnSync(process.execPath,['test-r344.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R344_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r344 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.135'||release.revision!=='r344-official-1.0.135')throw new Error('r344 release identity mismatch');
console.log('WEB_R344_OFFICIAL_OK');
