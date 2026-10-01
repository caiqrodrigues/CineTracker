import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r429.mjs');
const gate=spawnSync(process.execPath,['test-r429.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R429_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r429 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.220'||release.revision!=='r429-official-1.0.220')throw new Error('r429 release mismatch');
console.log('WEB_R429_OFFICIAL_OK');