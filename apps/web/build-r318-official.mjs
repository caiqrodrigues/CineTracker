import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r318.mjs');
const gate=spawnSync(process.execPath,['test-r318.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R318_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r318 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.109'||release.revision!=='r318-official-1.0.109')throw new Error('r318 release identity mismatch');
console.log('WEB_R318_OFFICIAL_OK production gate green');
