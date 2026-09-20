import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r322.mjs');
const gate=spawnSync(process.execPath,['test-r322.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R322_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r322 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.113'||release.revision!=='r322-official-1.0.113')throw new Error('r322 release identity mismatch');
console.log('WEB_R322_OFFICIAL_OK');
