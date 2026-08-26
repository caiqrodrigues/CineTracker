import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root=join(process.cwd(),process.env.CINETRACKER_TEST_ROOT||'dist');
const mime=new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8']]);
const server=http.createServer(async(req,res)=>{try{const raw=new URL(req.url||'/','http://127.0.0.1').pathname,rel=raw==='/'?'index.html':raw.replace(/^\/+/,''),safe=normalize(rel).replace(/^(\.\.(\/|\\|$))+/,'');const file=join(root,safe),info=await stat(file);if(!info.isFile())throw 0;res.writeHead(200,{'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file))}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(4185,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
await context.addInitScript(()=>{
  window.__ctNativePicks=[];
  window.__ctNativeFiles={library:null,watches:null,package:null};
  window.CineTrackerNative={
    pickImportFile(slot){window.__ctNativePicks.push(String(slot));},
    getImportFileName(slot){return window.__ctNativeFiles[slot]?.name||'';},
    getImportFileMime(slot){return window.__ctNativeFiles[slot]?.mime||'application/octet-stream';},
    getImportFileBase64(slot){return window.__ctNativeFiles[slot]?.b64||'';},
    clearImportFiles(){window.__ctNativeFiles={library:null,watches:null,package:null};}
  };
});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',route=>{const req=route.request(),url=new URL(req.url());if(url.pathname==='/auth/v1/token')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3RmaXgxNSJ9.signature',refresh_token:'r',expires_in:3600,user:{id:'00000000-0000-4000-8000-000000000015',email:'hf15@example.com'}})});if(url.pathname==='/auth/v1/user')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000015',email:'hf15@example.com'})});if(url.pathname.startsWith('/rest/v1/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});return route.fulfill({status:200,contentType:'application/json',body:'{}'});});
try{
  await page.goto('http://127.0.0.1:4185/',{waitUntil:'domcontentloaded'});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:2000});
  await page.locator('#auth-email').fill('hf15@example.com');await page.locator('#auth-password').fill('password123');await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({state:'visible',timeout:2000});await page.waitForTimeout(350);
  await page.evaluate(()=>window.ct15Navigate('settings'));
  await page.locator('#ct10-import-panel[data-ct11="1"]').waitFor({state:'visible',timeout:3000});
  await page.waitForFunction(()=>!!document.querySelector('[data-ct15-native-pick="library"]')&&!!document.querySelector('[data-ct15-native-pick="watches"]'),null,{timeout:2500});
  if(await page.locator('#ct11-library').evaluate(el=>getComputedStyle(el).display)!=='none')throw new Error('native library input not replaced by explicit button');
  await page.locator('[data-ct15-native-pick="library"]').click();await page.locator('[data-ct15-native-pick="watches"]').click();
  const picks=await page.evaluate(()=>window.__ctNativePicks.slice());if(picks.join(',')!=='library,watches')throw new Error('native picker bridge calls wrong: '+picks.join(','));
  const lib='type,title,tmdb_id,tvdb_id,year,list_status\nmovie,Filme Native,501,0,2024,for_later\n';
  const wat='type,title,tmdb_id,tvdb_id,first_watched_at,last_watched_at,plays\nmovie,Filme Native,501,0,2026-01-01T00:00:00Z,2026-01-01T00:00:00Z,2\n';
  await page.evaluate(({lib,wat})=>{const enc=s=>btoa(unescape(encodeURIComponent(s)));window.__ctNativeFiles.library={name:'library.csv',mime:'text/csv',b64:enc(lib)};window.__ctNativeFiles.watches={name:'watches.csv',mime:'text/csv',b64:enc(wat)};window.ct15RestoreNativeFiles();},{lib,wat});
  if(!/library\.csv/.test(await page.locator('#ct11-library-name').innerText()))throw new Error('native library not restored');
  if(!/watches\.csv/.test(await page.locator('#ct11-watches-name').innerText()))throw new Error('native watches not restored');
  await page.locator('#ct11-read-csv').click();await page.locator('#ct10-preview').waitFor({state:'visible',timeout:2500});
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(`HOTFIX15_NATIVE_PICKER_OK root=${process.env.CINETRACKER_TEST_ROOT||'dist'}; buttons=library,watches; bridge=${picks.join('>')}; restored=2; preview=OK`);
}finally{await browser.close().catch(()=>{});await new Promise(r=>server.close(r));}
