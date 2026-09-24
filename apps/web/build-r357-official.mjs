import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r357.mjs');
const gate=spawnSync(process.execPath,['test-r357.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R357_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r357 static production gate failed');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.148'||release.revision!=='r357-official-1.0.148')throw new Error('r357 release identity mismatch');
console.log('WEB_R357_OFFICIAL_OK');