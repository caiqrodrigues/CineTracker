import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r332.mjs');
const gate=spawnSync(process.execPath,['test-r332.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R332_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r332 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.123'||release.revision!=='r332-official-1.0.123')throw new Error('r332 release identity mismatch');
console.log('WEB_R332_OFFICIAL_OK');
