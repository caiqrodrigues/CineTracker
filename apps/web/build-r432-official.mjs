import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r432.mjs');
const gate=spawnSync(process.execPath,['test-r432.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R432_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r432 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.223'||release.revision!=='r432-official-1.0.223')throw new Error('r432 release mismatch');
console.log('WEB_R432_OFFICIAL_OK');