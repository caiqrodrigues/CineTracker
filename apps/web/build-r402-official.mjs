import {spawnSync} from 'node:child_process';import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r402.mjs');
const run=(file,env={})=>{const x=spawnSync(process.execPath,[file],{cwd:process.cwd(),stdio:'inherit',env:{...process.env,...env}});if(x.status!==0)throw new Error(file+' failed')};
run('test-r402.mjs',{CT_R402_SKIP_BUILD:'1'});run('test-r402-browser.mjs',{CT_R402_SKIP_BUILD:'1'});
const r=JSON.parse(await readFile(resolve('dist/release.json'),'utf8'));if(r.version!=='1.0.193'||r.revision!=='r402-official-1.0.193')throw new Error('r402 identity');
console.log('WEB_R402_OFFICIAL_OK');