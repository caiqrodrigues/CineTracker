import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),src=resolve(root,'scripts/test-v122d-web-final-feedback-browser.mjs'),tmp=resolve(root,'scripts/.tmp-test-v122f.mjs');
let code=await readFile(src,'utf8');
code=code.replace("'apps/web/runtime-r228c-v122-authority-guards.js'","'apps/web/runtime-r228c-v122-authority-guards.js','apps/web/runtime-r228d-v122-exact-count-authority.js'");
code=code.replace('<div id="empty" class="ct121-pending-empty">Buscando recomendação…</div>','<div id="empty">Sem item elegível</div>');
code=code.replace("await new Promise(r=>setTimeout(r,450));const empty=", "await new Promise(r=>setTimeout(r,450));await window.__ctV122SyncCounts(true);const empty=");
await writeFile(tmp,code,'utf8');
try{execFileSync(process.execPath,[tmp],{cwd:root,stdio:'inherit',timeout:60000})}finally{await rm(tmp,{force:true})}
