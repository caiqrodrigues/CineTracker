import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r418.mjs');
const gate=spawnSync(process.execPath,['test-r418.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R418_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r418 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.209'||release.revision!=='r418-official-1.0.209')throw new Error('r418 release mismatch');
console.log('WEB_R418_OFFICIAL_OK');
