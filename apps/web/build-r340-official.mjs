import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r340.mjs');
const gate=spawnSync(process.execPath,['test-r340.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R340_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error('r340 static production gate failed ('+gate.status+')');
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.131'||release.revision!=='r340-official-1.0.131')throw new Error('r340 release identity mismatch');
console.log('WEB_R340_OFFICIAL_OK');
