import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),src=resolve(root,'scripts/test-v122-web-final-feedback-browser.mjs'),tmp=resolve(root,'scripts/.tmp-test-v122-fixed.mjs');
let code=await readFile(src,'utf8');
code=code.replace("apps/web/runtime-r228-v122-web-final-feedback.js","apps/web/runtime-r228-v122-web-authority.js");
await writeFile(tmp,code,'utf8');
try{execFileSync(process.execPath,[tmp],{cwd:root,stdio:'inherit',timeout:60000})}finally{await rm(tmp,{force:true})}
