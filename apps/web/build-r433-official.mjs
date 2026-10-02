import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r433.mjs');
const gate=spawnSync(process.execPath,['test-r433.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R433_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r433 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.224'||release.revision!=='r433-official-1.0.224')throw new Error('r433 release mismatch');
console.log('WEB_R433_OFFICIAL_OK');
