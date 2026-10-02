import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r442.mjs');
const gate=spawnSync(process.execPath,['test-r442.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R438_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r442 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.233'||release.revision!=='r442-official-1.0.233')throw new Error('r442 release mismatch');
console.log('WEB_R438_OFFICIAL_OK');
