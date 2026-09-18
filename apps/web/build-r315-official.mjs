import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r315.mjs');
const gate=spawnSync(process.execPath,['test-r315.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R315_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r315 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.106'||release.revision!=='r315-official-1.0.106')throw new Error('r315 release identity mismatch');
console.log('WEB_R315_OFFICIAL_OK production gate green');
