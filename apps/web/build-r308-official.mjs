import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r308.mjs');
const gate=spawnSync(process.execPath,['test-r308.mjs'],{
 cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R308_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error(`r308 static production gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.99'||release.revision!=='r308-official-1.0.99')throw new Error('r308 release identity mismatch');
console.log('WEB_R308_OFFICIAL_OK production build + Discover/F1/Profile regression gate green');
