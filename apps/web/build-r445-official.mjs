import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r445.mjs');
const gate=spawnSync(process.execPath,['test-r445.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R445_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r445 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.236'||release.revision!=='r445-official-1.0.236')throw new Error('r445 release mismatch');
console.log('WEB_R445_OFFICIAL_OK');
