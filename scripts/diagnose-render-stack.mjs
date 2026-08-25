import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(process.cwd(), 'dist');
const mime = new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml']]);
const server = http.createServer(async (req,res)=>{
  try {
    const rawPath = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    const rel = rawPath === '/' ? 'index.html' : rawPath.replace(/^\/+/, '');
    const safe = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, '');
    const file = join(root, safe);
    const info = await stat(file);
    if(!info.isFile()) throw new Error('not file');
    const body = await readFile(file);
    res.writeHead(200, {'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({serviceWorkers:'block'});
const page=await context.newPage();
await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password'){
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwMC1wb3N0LWxvZ2luIiwiZW1haWwiOiJwMEBleGFtcGxlLmNvbSJ9.signature',
      refresh_token:'p0-refresh',expires_in:3600,user:{id:'p0-post-login',email:'p0@example.com'}
    })}); return;
  }
  if(url.pathname.startsWith('/rest/v1/')){await route.fulfill({status:200,contentType:'application/json',body:'[]'});return;}
  if(url.pathname.startsWith('/functions/v1/')){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})});return;}
  await route.fulfill({status:200,contentType:'application/json',body:'{}'});
});

try {
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded',timeout:10000});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:1500});
  const result=await page.evaluate(async()=>{
    try {
      await signIn('p0@example.com','password123');
    } catch(e) {
      return {phase:'signIn',error:String(e?.stack||e),body:document.body.innerText.slice(0,500)};
    }
    try {
      view='home';
      render();
      return {phase:'render-ok',body:document.body.innerText.slice(0,500),content:!!document.querySelector('.content')};
    } catch(e) {
      return {phase:'render-error',error:String(e?.stack||e),name:e?.name,message:e?.message,body:document.body.innerText.slice(0,500),html:document.body.innerHTML.slice(0,1000)};
    }
  });
  console.log('DIRECT_RENDER_RESULT '+JSON.stringify(result));
  if(result.phase!=='render-error') throw new Error('Expected current production chain to reproduce swallowed render error.');
} finally {
  await browser.close().catch(()=>{});
  await new Promise(r=>server.close(r));
}
