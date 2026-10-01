import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r428.mjs');
const gate=spawnSync(process.execPath,['test-r428.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R428_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r428 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.219'||release.revision!=='r427-official-1.0.219')throw new Error('r428 release mismatch');
console.log('WEB_R428_OFFICIAL_OK');
