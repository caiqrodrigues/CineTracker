import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r309.mjs');
const gate=spawnSync(process.execPath,['test-r309.mjs'],{
 cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R309_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error(`r309 static production gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.100'||release.revision!=='r309-official-1.0.100')throw new Error('r309 release identity mismatch');
console.log('WEB_R309_OFFICIAL_OK production build + video-truth producer gate green');
