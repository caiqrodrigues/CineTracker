import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r314.mjs');
const gate=spawnSync(process.execPath,['test-r314.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R314_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r314 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.105'||release.revision!=='r314-official-1.0.105')throw new Error('r314 release identity mismatch');
console.log('WEB_R314_OFFICIAL_OK production gate green');
