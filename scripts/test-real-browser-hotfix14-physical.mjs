import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root=join(process.cwd(),process.env.CINETRACKER_TEST_ROOT||'dist');
const mime=new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml']]);
const server=http.createServer(async(req,res)=>{try{const raw=new URL(req.url||'/','http://127.0.0.1').pathname,rel=raw==='/'?'index.html':raw.replace(/^\/+/,''),safe=normalize(rel).replace(/^(\.\.(\/|\\|$))+/,'');const file=join(root,safe),info=await stat(file);if(!info.isFile())throw new Error('not file');res.writeHead(200,{'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file))}catch{res.writeHead(404,{'content-type':'text/plain'});res.end('not found')}});
await new Promise(resolve=>server.listen(4182,'127.0.0.1',resolve));

const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:900}}),page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(`console.error: ${m.text()}`)});
await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.pathname==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3RmaXgxNCIsImVtYWlsIjoiaG90Zml4MTRAZXhhbXBsZS5jb20ifQ.signature',refresh_token:'hotfix14-refresh',expires_in:3600,token_type:'bearer',user:{id:'00000000-0000-4000-8000-000000000014',email:'hotfix14@example.com'}})});
  if(url.pathname==='/auth/v1/user')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000014',email:'hotfix14@example.com'})});
  if(url.pathname.startsWith('/rest/v1/rpc/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  if(url.pathname.startsWith('/rest/v1/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  if(url.pathname.startsWith('/functions/v1/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})});
  return route.fulfill({status:200,contentType:'application/json',body:'{}'});
});

function marker(target){
  if(target==='discover')return '#ct92-discover-results';
  if(target==='history')return '#ct92-history';
  if(target==='profile')return '#ct94-profile,#ct92-profile,#ct93-profile';
  if(target==='settings')return '#ct10-import-panel,.ct91-settings';
  return '.content';
}

try{
  await page.goto('http://127.0.0.1:4182/',{waitUntil:'domcontentloaded',timeout:10000});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:2200});
  await page.locator('#auth-email').fill('hotfix14@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({state:'visible',timeout:2200});
  await page.waitForTimeout(350);
  const runtime=await page.evaluate(()=>({h14:window.__ctHotfix14PhysicalNavPicker===true,nav:typeof window.ct14Navigate==='function',v97:window.__ct97Loaded===true}));
  if(!runtime.h14||!runtime.nav||runtime.v97)throw new Error(`HOTFIX14 runtime invalid ${JSON.stringify(runtime)}`);

  const sidebar=page.locator('.sidebar').first();
  await sidebar.waitFor({state:'visible',timeout:1800});
  const sidebarStyle=await sidebar.evaluate(el=>({z:getComputedStyle(el).zIndex,pointer:getComputedStyle(el).pointerEvents}));
  if(sidebarStyle.pointer==='none'||Number.parseInt(sidebarStyle.z||'0',10)<12000)throw new Error(`Sidebar physical layer invalid: ${JSON.stringify(sidebarStyle)}`);

  for(const target of ['discover','history','profile','settings','home','history','settings']){
    const button=page.locator(`.nav button[data-view="${target}"]`).first();
    await button.waitFor({state:'visible',timeout:1800});
    const hit=await button.evaluate((el)=>{const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,node=document.elementFromPoint(x,y);return node?.closest?.('[data-view]')?.dataset?.view||''});
    if(hit!==target)throw new Error(`physical hit target ${target}: elementFromPoint resolved ${hit||'nothing'}`);
    await button.click({timeout:2500});
    await page.locator(marker(target)).first().waitFor({state:target==='settings'?'visible':'attached',timeout:3000});
    await page.waitForTimeout(180);
    if(target!=='home'){
      await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
      await page.waitForTimeout(180);
      await page.locator(marker(target)).first().waitFor({state:target==='settings'?'visible':'attached',timeout:2200});
    }
    const got=await page.evaluate(()=>{try{return String(view||'')}catch{return String(window.view||'')}});
    const accepted=target==='settings'?['settings','ct91-settings','ct92-settings']:[target];
    if(!accepted.includes(got))throw new Error(`physical nav ${target}: got ${got}`);
  }

  await page.locator('#ct11-library').waitFor({state:'visible',timeout:2000});
  await page.locator('#ct11-watches').waitFor({state:'visible',timeout:2000});
  const pointer=await page.locator('.nav button[data-view="settings"]').first().evaluate(el=>getComputedStyle(el).pointerEvents);
  if(pointer==='none')throw new Error('Settings physical button has pointer-events none');
  const beat=await Promise.race([page.evaluate(()=>new Promise(r=>setTimeout(()=>r('alive'),900))),new Promise(r=>setTimeout(()=>r('starved'),1900))]);
  if(beat!=='alive')throw new Error('HOTFIX14 UI thread starved');
  if(errors.length)throw new Error(`Browser errors:\n${errors.join('\n')}`);
  console.log(`HOTFIX14_PHYSICAL_BROWSER_OK root=${process.env.CINETRACKER_TEST_ROOT||'dist'}; desktop-tabs=discover>history>profile>settings>home>history>settings; hit-testing=OK; focus-return=OK; importer=visible; browser-errors=0`);
}finally{await browser.close().catch(()=>{});await new Promise(resolve=>server.close(resolve))}
