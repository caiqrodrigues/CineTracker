import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r310.mjs');
const gate=spawnSync(process.execPath,['test-r310.mjs'],{
 cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R310_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error(`r310 static production gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.101'||release.revision!=='r310-official-1.0.101')throw new Error('r310 release identity mismatch');
console.log('WEB_R310_OFFICIAL_OK producer retirement + new-video regression gate green');
