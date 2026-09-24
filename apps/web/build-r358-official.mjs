import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r358.mjs');
const gate=spawnSync(process.execPath,['test-r358.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R358_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r358 static production gate failed ('+gate.status+')');
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(r.version!=='1.0.149'||r.revision!=='r358-official-1.0.149')throw new Error('r358 release identity mismatch');
console.log('WEB_R358_OFFICIAL_OK');
