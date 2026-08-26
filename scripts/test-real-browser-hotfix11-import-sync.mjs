import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root=join(process.cwd(),process.env.CINETRACKER_TEST_ROOT||'dist');
const mime=new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml']]);
const server=http.createServer(async(req,res)=>{try{const rawPath=new URL(req.url||'/','http://127.0.0.1').pathname,rel=rawPath==='/'?'index.html':rawPath.replace(/^\/+/,''),safe=normalize(rel).replace(/^(\.\.(\/|\\|$))+/,'');const file=join(root,safe),info=await stat(file);if(!info.isFile())throw new Error('not file');res.writeHead(200,{'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file))}catch{res.writeHead(404,{'content-type':'text/plain'});res.end('not found')}});
await new Promise(resolve=>server.listen(4179,'127.0.0.1',resolve));

const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage();
const errors=[],edgeActions=[];let importFinished=false,cloudReadsAfterImport=0;
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(`console.error: ${m.text()}`)});

await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),method=req.method();
  if(url.pathname==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3RmaXgxMSIsImVtYWlsIjoiaG90Zml4MTFAZXhhbXBsZS5jb20ifQ.signature',refresh_token:'hotfix11-refresh',expires_in:3600,token_type:'bearer',user:{id:'00000000-0000-4000-8000-000000000011',email:'hotfix11@example.com'}})});
  if(url.pathname==='/auth/v1/user')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000011',email:'hotfix11@example.com'})});
  if(url.pathname==='/functions/v1/ct-import-bingers-user'){
    const body=JSON.parse(req.postData()||'{}'),action=String(body.action||'');edgeActions.push(action);
    if(action==='begin')return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"import_id":77}'});
    if(action==='library_batch'||action==='watches_batch')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,count:(body.rows||[]).length,cursor:Number(body.cursor||0)+(body.rows||[]).length})});
    if(action==='finish'){importFinished=true;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,summary:body.summary||{}})});}
    return route.fulfill({status:400,contentType:'application/json',body:'{"ok":false,"error":"unexpected action"}'});
  }
  if(url.pathname.startsWith('/rest/v1/')){
    if(importFinished&&method==='GET')cloudReadsAfterImport++;
    return route.fulfill({status:200,contentType:'application/json',body:url.pathname.includes('/rpc/')?'[]':'[]'});
  }
  if(url.pathname.startsWith('/functions/v1/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})});
  return route.fulfill({status:200,contentType:'application/json',body:'{}'});
});

try{
  await page.goto('http://127.0.0.1:4179/',{waitUntil:'domcontentloaded',timeout:10000});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:1800});
  await page.locator('#auth-email').fill('hotfix11@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({state:'visible',timeout:1800});
  await page.waitForTimeout(350);
  const runtime=await page.evaluate(()=>({v97:window.__ct97Loaded===true,h11:window.__ctHotfix11ImportSync===true,sync:typeof window.ct11SyncCloud==='function'}));
  if(runtime.v97||!runtime.h11||!runtime.sync)throw new Error(`HOTFIX11 runtime invalid: ${JSON.stringify(runtime)}`);

  await page.locator('.nav button[data-view="settings"]').first().click();
  await page.locator('#ct10-import-panel[data-ct11="1"]').waitFor({state:'visible',timeout:2200});
  for(const id of ['#ct11-library','#ct11-watches','#ct11-read-csv','#ct11-sync'])await page.locator(id).waitFor({state:'visible',timeout:1200});

  const library='\uFEFFtype;title;tmdb_id;tvdb_id;year;list_status\nmovie;Filme Teste;101;0;2024;for_later\nshow;Série Teste;202;0;2023;following\n';
  const watches='type\ttitle\ttmdb_id\ttvdb_id\tseason_number\tepisode_number\tfirst_watched_at\tlast_watched_at\tplays\nmovie\tFilme Teste\t101\t0\t\t\t2026-01-01T12:00:00Z\t2026-01-01T12:00:00Z\t1\nepisode\tSérie Teste\t202\t0\t1\t1\t2026-01-02T12:00:00Z\t2026-01-02T12:00:00Z\t1\n';
  await page.locator('#ct11-library').setInputFiles({name:'export-library.csv',mimeType:'text/plain',buffer:Buffer.from(library)});
  await page.waitForTimeout(80);
  if(!/export-library\.csv/.test(await page.locator('#ct11-library-name').innerText()))throw new Error('library.csv selection was not retained.');
  await page.locator('#ct11-watches').setInputFiles({name:'export-watches.csv',mimeType:'text/plain',buffer:Buffer.from(watches)});
  await page.waitForTimeout(80);
  if(!/export-watches\.csv/.test(await page.locator('#ct11-watches-name').innerText()))throw new Error('watches.csv selection was not retained.');
  await page.locator('#ct11-read-csv').click();
  await page.locator('#ct10-preview').waitFor({state:'visible',timeout:2200});
  const preview=await page.locator('#ct10-preview').innerText();
  if(!/Prévia da importação/.test(preview)||!/2\s*Títulos/.test(preview.replace(/\n/g,' ')))throw new Error(`HOTFIX11 preview wrong: ${preview}`);
  if(edgeActions.length)throw new Error(`Backend called before confirmation: ${edgeActions.join(',')}`);

  await page.locator('[data-confirm10]').click();
  await page.waitForFunction(()=>document.querySelector('.ct10-progress-label')?.textContent?.includes('Importação concluída'),null,{timeout:4000});
  await page.waitForTimeout(900);
  for(const action of ['begin','library_batch','watches_batch','finish'])if(!edgeActions.includes(action))throw new Error(`Missing import action ${action}: ${edgeActions.join(',')}`);
  if(cloudReadsAfterImport<1)throw new Error('Cloud state was not reloaded after completed import.');

  await page.evaluate(()=>window.ct10Navigate?.('settings'));
  await page.locator('#ct10-import-panel[data-ct11="1"]').waitFor({state:'visible',timeout:2200});
  await page.locator('#ct11-sync').click();
  await page.waitForTimeout(400);
  if(!/Sincronização concluída|Buscando os dados/.test(await page.locator('#ct11-status').innerText()))throw new Error('Manual sync control did not run.');

  const heartbeat=await Promise.race([page.evaluate(()=>new Promise(r=>setTimeout(()=>r('alive'),1000))),new Promise(r=>setTimeout(()=>r('starved'),2200))]);
  if(heartbeat!=='alive')throw new Error('HOTFIX11 UI thread starved.');
  if(errors.length)throw new Error(`Browser errors:\n${errors.join('\n')}`);
  console.log(`HOTFIX11_IMPORT_SYNC_OK root=${process.env.CINETRACKER_TEST_ROOT||'dist'}; sequential-files=2; delimiters=semicolon+tab+BOM; preview-before-write=OK; backend=${edgeActions.join('>')}; cloud-refresh=${cloudReadsAfterImport}; browser-errors=0`);
}finally{await browser.close().catch(()=>{});await new Promise(resolve=>server.close(resolve))}
