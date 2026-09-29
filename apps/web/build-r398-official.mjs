import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r398.mjs');
const run=(file,env={})=>{const x=spawnSync(process.execPath,[file],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,...env}});if(x.status!==0)throw new Error(file+' failed')};
run('test-r398.mjs',{CT_R398_SKIP_BUILD:'1'});run('test-r398-browser.mjs',{CT_R398_SKIP_BUILD:'1'});
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.189'||r.revision!=='r398-official-1.0.189')throw new Error('r398 identity');
console.log('WEB_R398_OFFICIAL_OK');