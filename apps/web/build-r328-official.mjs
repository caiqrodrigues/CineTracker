import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r328.mjs');
const gate=spawnSync(process.execPath,['test-r328.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R328_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r328 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.119'||release.revision!=='r328-official-1.0.119')throw new Error('r328 release identity mismatch');
console.log('WEB_R328_OFFICIAL_OK');
