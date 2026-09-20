import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r323.mjs');
const gate=spawnSync(process.execPath,['test-r323.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R323_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r323 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.114'||release.revision!=='r323-official-1.0.114')throw new Error('r323 release identity mismatch');
console.log('WEB_R323_OFFICIAL_OK');
