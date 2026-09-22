import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r335.mjs');
const gate=spawnSync(process.execPath,['test-r335.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R335_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r335 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.126'||release.revision!=='r335-official-1.0.126')throw new Error('r335 release identity mismatch');
console.log('WEB_R335_OFFICIAL_OK');
