import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

await import('./build-r333.mjs');

const gate=spawnSync(process.execPath,['test-r333.mjs'],{
 cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R333_SKIP_BUILD:'1'}
});
if(gate.status!==0)throw new Error('r333 static production gate failed ('+gate.status+')');

const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.124'||release.revision!=='r333-official-1.0.124'){
 throw new Error('r333 release identity mismatch');
}
console.log('WEB_R333_OFFICIAL_OK');
