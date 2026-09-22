import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r334.mjs');
const gate=spawnSync(process.execPath,['test-r334.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R334_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r334 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.125'||release.revision!=='r334-official-1.0.125')throw new Error('r334 release identity mismatch');
console.log('WEB_R334_OFFICIAL_OK');
