import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r306.mjs');
const gate=spawnSync(process.execPath,['test-r306.mjs'],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,CT_R306_SKIP_BUILD:'1'}});
if(gate.status!==0)throw new Error(`r306 static behavioral gate failed (${gate.status})`);
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.97'||release.revision!=='r306-official-1.0.97')throw new Error('r306 release identity mismatch');
console.log('WEB_R306_OFFICIAL_OK production build + regression gate green');
