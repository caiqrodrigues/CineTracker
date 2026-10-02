import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r435.mjs');
const gate=spawnSync(process.execPath,['test-r435.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R435_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r435 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.226'||release.revision!=='r435-official-1.0.226')throw new Error('r435 release mismatch');
console.log('WEB_R435_OFFICIAL_OK');