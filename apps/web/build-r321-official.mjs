import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r321.mjs');
const gate=spawnSync(process.execPath,['test-r321.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R321_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r321 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.112'||release.revision!=='r321-official-1.0.112')throw new Error('r321 release identity mismatch');
console.log('WEB_R321_OFFICIAL_OK');
