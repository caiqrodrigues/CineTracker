import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r324.mjs');
const gate=spawnSync(process.execPath,['test-r324.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R324_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r324 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.115'||release.revision!=='r324-official-1.0.115')throw new Error('r324 release identity mismatch');
console.log('WEB_R324_OFFICIAL_OK');
