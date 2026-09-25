import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r365.mjs');
const gate=spawnSync(process.execPath,['test-r365.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R365_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r365 static production gate failed');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.156'||r.revision!=='r365-official-1.0.156')throw new Error('r365 release identity mismatch');
console.log('WEB_R365_OFFICIAL_OK');
