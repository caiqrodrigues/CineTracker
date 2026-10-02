import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
await import('./build-r444.mjs');
const gate=spawnSync(process.execPath,['test-r444.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R444_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r444 static gate failed ('+gate.status+')');
const release=JSON.parse(await readFile('dist/release.json','utf8'));
if(release.version!=='1.0.235'||release.revision!=='r444-official-1.0.235')throw new Error('r444 release mismatch');
console.log('WEB_R444_OFFICIAL_OK');
