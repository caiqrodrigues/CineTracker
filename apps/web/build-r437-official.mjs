import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r437.mjs');
const gate=spawnSync(process.execPath,['test-r437.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R437_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r437 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.228'||release.revision!=='r437-official-1.0.228')throw new Error('r437 release mismatch');
console.log('WEB_R437_OFFICIAL_OK');
