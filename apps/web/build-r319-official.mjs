import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r319.mjs');
const gate=spawnSync(process.execPath,['test-r319.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R319_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r319 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.110'||release.revision!=='r319-official-1.0.110')throw new Error('r319 release identity mismatch');
console.log('WEB_R319_OFFICIAL_OK production gate green');
