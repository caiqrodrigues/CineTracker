import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r423.mjs');
const gate=spawnSync(process.execPath,['test-r423.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R423_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r423 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.214'||release.revision!=='r423-official-1.0.214')throw new Error('r423 release mismatch');
console.log('WEB_R423_OFFICIAL_OK');
