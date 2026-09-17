import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r304.mjs');
for(const test of['test-r304.mjs','test-r304-browser.mjs']){
 const r=spawnSync(process.execPath,[test],{cwd:process.cwd(),stdio:'inherit',env:process.env});
 if(r.status!==0)throw new Error(`r304 behavioral gate failed: ${test} (${r.status})`);
}
const release=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));
if(release.version!=='1.0.95'||release.revision!=='r304-official-1.0.95')throw new Error('r304 release identity mismatch');
console.log('WEB_R304_OFFICIAL_OK static + Chromium interaction regression green');
