import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r434.mjs');
const gate=spawnSync(process.execPath,['test-r434.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R434_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r434 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.225'||release.revision!=='r434-official-1.0.225')throw new Error('r434 release mismatch');
console.log('WEB_R434_OFFICIAL_OK');