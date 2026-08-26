import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root=join(process.cwd(),process.env.CINETRACKER_TEST_ROOT||'dist');
const mime=new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml']]);
const server=http.createServer(async(req,res)=>{try{const rawPath=new URL(req.url||'/','http://127.0.0.1').pathname,rel=rawPath==='/'?'index.html':rawPath.replace(/^\/+/,''),safe=normalize(rel).replace(/^(\.\.(\/|\\|$))+/,'');const file=join(root,safe),info=await stat(file);if(!info.isFile())throw new Error('not file');res.writeHead(200,{'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file))}catch{res.writeHead(404,{'content-type':'text/plain'});res.end('not found')}});
await new Promise(resolve=>server.listen(4180,'127.0.0.1',resolve));

const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
let importFinished=false,cloudReadsAfterImport=0;const edgeActions=[];

async function buildContext(viewport,label){
  const context=await browser.newContext({serviceWorkers:'block',viewport});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(`console.error: ${m.text()}`)});
  await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',async route=>{
    const req=route.request(),url=new URL(req.url()),method=req.method();
    if(url.pathname==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3RmaXgxMiIsImVtYWlsIjoiaG90Zml4MTJAZXhhbXBsZS5jb20ifQ.signature',refresh_token:'hotfix12-refresh',expires_in:3600,token_type:'bearer',user:{id:'00000000-0000-4000-8000-000000000012',email:'hotfix12@example.com'}})});
    if(url.pathname==='/auth/v1/user')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000012',email:'hotfix12@example.com'})});
    if(url.pathname==='/functions/v1/ct-import-bingers-user'){
      const body=JSON.parse(req.postData()||'{}'),action=String(body.action||'');edgeActions.push(action);
      if(action==='begin')return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"import_id":812}'});
      if(action==='library_batch'||action==='watches_batch')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,count:(body.rows||[]).length,cursor:Number(body.cursor||0)+(body.rows||[]).length})});
      if(action==='finish'){importFinished=true;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,summary:body.summary||{}})});}
      return route.fulfill({status:400,contentType:'application/json',body:'{"ok":false,"error":"unexpected action"}'});
    }
    if(url.pathname.startsWith('/rest/v1/')){
      if(importFinished&&method==='GET')cloudReadsAfterImport++;
      return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    }
    if(url.pathname.startsWith('/functions/v1/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})});
    return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });
  await page.goto('http://127.0.0.1:4180/',{waitUntil:'domcontentloaded',timeout:10000});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:1800});
  await page.locator('#auth-email').fill('hotfix12@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({state:'visible',timeout:1800});
  await page.waitForTimeout(400);
  const runtime=await page.evaluate(()=>({v97:window.__ct97Loaded===true,h12nav:window.__ctHotfix12NavPre===true,h12picker:window.__ctHotfix12PickerGuard===true,navigate:typeof window.ct12Navigate==='function'}));
  if(runtime.v97||!runtime.h12nav||!runtime.h12picker||!runtime.navigate)throw new Error(`${label}: HOTFIX12 runtime invalid ${JSON.stringify(runtime)}`);
  return {context,page,errors};
}

async function currentView(page){return page.evaluate(()=>{try{return String(view||'')}catch{return String(window.view||'')}})}
async function clickDesktop(page,target,errors){
  const button=page.locator(`.nav button[data-view="${target}"]`).first();
  await button.waitFor({state:'visible',timeout:1800});
  await button.click({timeout:2200});
  await page.waitForTimeout(260);
  const got=await currentView(page),accepted=target==='settings'?['settings','ct91-settings','ct92-settings']:[target];
  if(!accepted.includes(got))throw new Error(`desktop nav ${target}: expected ${accepted.join('/')}, got ${got}`);
  if(target==='history')await page.locator('#ct92-history').waitFor({state:'attached',timeout:1800});
  if(target==='profile')await page.locator('#ct94-profile,#ct92-profile').first().waitFor({state:'attached',timeout:1800});
  if(target==='settings')await page.locator('#ct10-import-panel').waitFor({state:'visible',timeout:2200});
  if(target==='discover')await page.locator('#ct92-discover-results').waitFor({state:'attached',timeout:1800});
  if(errors.length)throw new Error(`desktop nav ${target}: ${errors.join('\n')}`);
}

try{
  // Regression 1: actual desktop top-nav buttons must all remain interactive.
  const desktop=await buildContext({width:1280,height:900},'desktop');
  for(const target of ['home','discover','history','profile','settings','home','profile','history'])await clickDesktop(desktop.page,target,desktop.errors);
  const navPointer=await desktop.page.locator('.nav button[data-view="profile"]').first().evaluate(el=>getComputedStyle(el).pointerEvents);
  if(navPointer==='none')throw new Error('desktop nav: profile button has pointer-events none');
  const desktopBeat=await Promise.race([desktop.page.evaluate(()=>new Promise(r=>setTimeout(()=>r('alive'),800))),new Promise(r=>setTimeout(()=>r('starved'),1800))]);
  if(desktopBeat!=='alive')throw new Error('desktop nav: UI thread starved');
  await desktop.context.close();

  // Regression 2: returning from the mobile OS file picker must NOT rebuild Settings.
  const mobile=await buildContext({width:390,height:844},'mobile');
  await mobile.page.evaluate(()=>window.ct12Navigate('settings'));
  await mobile.page.locator('#ct10-import-panel[data-ct11="1"]').waitFor({state:'visible',timeout:2500});
  for(const id of ['#ct11-library','#ct11-watches','#ct11-read-csv'])await mobile.page.locator(id).waitFor({state:'visible',timeout:1400});
  await mobile.page.locator('#ct10-import-panel').evaluate(el=>{el.dataset.ct12Identity='keep-me'});

  const library='\uFEFFtype;title;tmdb_id;tvdb_id;year;list_status\nmovie;Filme Mobile;301;0;2024;for_later\nshow;Série Mobile;302;0;2023;following\n';
  const watches='type\ttitle\ttmdb_id\ttvdb_id\tseason_number\tepisode_number\tfirst_watched_at\tlast_watched_at\tplays\nmovie\tFilme Mobile\t301\t0\t\t\t2026-02-01T12:00:00Z\t2026-02-01T12:00:00Z\t1\nepisode\tSérie Mobile\t302\t0\t1\t1\t2026-02-02T12:00:00Z\t2026-02-02T12:00:00Z\t1\n';
  await mobile.page.locator('#ct11-library').setInputFiles({name:'library-mobile.csv',mimeType:'text/csv',buffer:Buffer.from(library)});
  await mobile.page.evaluate(()=>{window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))});
  await mobile.page.waitForTimeout(350);
  if(await mobile.page.locator('#ct10-import-panel').getAttribute('data-ct12-identity')!=='keep-me')throw new Error('mobile picker: Settings panel was rebuilt after first file');
  if(!/library-mobile\.csv/.test(await mobile.page.locator('#ct11-library-name').innerText()))throw new Error('mobile picker: first CSV name/state disappeared after focus');
  await mobile.page.locator('#ct11-watches').waitFor({state:'visible',timeout:1200});

  await mobile.page.locator('#ct11-watches').setInputFiles({name:'watches-mobile.csv',mimeType:'text/csv',buffer:Buffer.from(watches)});
  await mobile.page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await mobile.page.waitForTimeout(350);
  if(await mobile.page.locator('#ct10-import-panel').getAttribute('data-ct12-identity')!=='keep-me')throw new Error('mobile picker: Settings panel was rebuilt after second file');
  if(!/watches-mobile\.csv/.test(await mobile.page.locator('#ct11-watches-name').innerText()))throw new Error('mobile picker: second CSV name/state disappeared after focus');

  await mobile.page.locator('#ct11-read-csv').click();
  await mobile.page.locator('#ct10-preview').waitFor({state:'visible',timeout:2400});
  const preview=await mobile.page.locator('#ct10-preview').innerText();
  if(!/Prévia da importação/.test(preview)||!/2\s*Títulos/.test(preview.replace(/\n/g,' ')))throw new Error(`mobile picker preview wrong: ${preview}`);
  if(edgeActions.length)throw new Error(`mobile picker: backend called before confirmation: ${edgeActions.join(',')}`);

  await mobile.page.locator('[data-confirm10]').click();
  await mobile.page.waitForFunction(()=>document.querySelector('.ct10-progress-label')?.textContent?.includes('Importação concluída'),null,{timeout:4500});
  await mobile.page.waitForTimeout(1100);
  for(const action of ['begin','library_batch','watches_batch','finish'])if(!edgeActions.includes(action))throw new Error(`mobile import missing ${action}: ${edgeActions.join(',')}`);
  if(cloudReadsAfterImport<1)throw new Error('mobile import: cloud state was not reloaded after completed import');
  if(mobile.errors.length)throw new Error(`mobile browser errors:\n${mobile.errors.join('\n')}`);
  const mobileBeat=await Promise.race([mobile.page.evaluate(()=>new Promise(r=>setTimeout(()=>r('alive'),800))),new Promise(r=>setTimeout(()=>r('starved'),1800))]);
  if(mobileBeat!=='alive')throw new Error('mobile picker: UI thread starved');
  await mobile.context.close();

  console.log(`HOTFIX12_NAV_MOBILE_IMPORT_OK root=${process.env.CINETRACKER_TEST_ROOT||'dist'}; desktop-tabs=home>discover>history>profile>settings; mobile-first-file-panel=retained; second-selector=retained; preview-before-write=OK; backend=${edgeActions.join('>')}; cloud-refresh=${cloudReadsAfterImport}; browser-errors=0`);
}finally{
  await browser.close().catch(()=>{});
  await new Promise(resolve=>server.close(resolve));
}