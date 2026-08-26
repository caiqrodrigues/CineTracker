import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root=join(process.cwd(),process.env.CINETRACKER_TEST_ROOT||'dist');
const mime=new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml']]);
const server=http.createServer(async(req,res)=>{try{const rawPath=new URL(req.url||'/','http://127.0.0.1').pathname,rel=rawPath==='/'?'index.html':rawPath.replace(/^\/+/,''),safe=normalize(rel).replace(/^(\.\.(\/|\\|$))+/,'');const file=join(root,safe),info=await stat(file);if(!info.isFile())throw new Error('not file');res.writeHead(200,{'content-type':mime.get(extname(file))||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file))}catch{res.writeHead(404,{'content-type':'text/plain'});res.end('not found')}});
await new Promise(resolve=>server.listen(4178,'127.0.0.1',resolve));

const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage();
const errors=[],edgeCalls=[],rpcBodies=[],dbWrites=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(`console.error: ${m.text()}`)});

function parseBody(request){try{return JSON.parse(request.postData()||'null')}catch{return request.postData()||null}}
await page.route('https://pjmkxryboypluleuuupp.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),method=req.method();
  if(url.pathname==='/auth/v1/token'&&url.searchParams.get('grant_type')==='password')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob3RmaXgxMCIsImVtYWlsIjoiaG90Zml4MTBAZXhhbXBsZS5jb20ifQ.signature',refresh_token:'hotfix10-refresh',expires_in:3600,token_type:'bearer',user:{id:'00000000-0000-4000-8000-000000000010',email:'hotfix10@example.com'}})});
  if(url.pathname==='/auth/v1/user')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'00000000-0000-4000-8000-000000000010',email:'hotfix10@example.com'})});
  if(url.pathname==='/functions/v1/ct-import-bingers-user'){edgeCalls.push(req.postData()||'');return route.fulfill({status:500,contentType:'application/json',body:'{"ok":false,"error":"preview must not call edge"}'})}
  if(url.pathname==='/rest/v1/rpc/cinetracker_upsert_media'&&method==='POST'){rpcBodies.push(parseBody(req));return route.fulfill({status:200,contentType:'application/json',body:'999'})}
  if(url.pathname==='/rest/v1/media_overrides'){
    if(method==='GET')return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    dbWrites.push({table:'media_overrides',method,body:parseBody(req)});return route.fulfill({status:200,contentType:'application/json',body:'[{"id":7001}]'});
  }
  if(url.pathname==='/rest/v1/watch_history'){
    if(method==='GET')return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    dbWrites.push({table:'watch_history',method,body:parseBody(req)});return route.fulfill({status:200,contentType:'application/json',body:'[{"id":8001}]'});
  }
  if(url.pathname.startsWith('/functions/v1/'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({results:[]})});
  if(url.pathname.startsWith('/rest/v1/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  return route.fulfill({status:200,contentType:'application/json',body:'{}'});
});

async function currentView(){return page.evaluate(()=>{try{return String(view)}catch{return String(window.view||'')}})}
async function clickView(target){await page.locator(`.nav button[data-view="${target}"]`).first().click({timeout:2000});await page.waitForTimeout(220);const got=await currentView(),accepted=target==='settings'?['settings','ct91-settings']:[target];if(!accepted.includes(got))throw new Error(`Navigation ${target}: expected ${accepted.join(' or ')}, got ${got}`);if(errors.length)throw new Error(`Navigation ${target}: browser errors:\n${errors.join('\n')}`)}

try{
  await page.goto('http://127.0.0.1:4178/',{waitUntil:'domcontentloaded',timeout:10000});
  await page.locator('#auth-form').waitFor({state:'visible',timeout:1600});
  await page.locator('#auth-email').fill('hotfix10@example.com');
  await page.locator('#auth-password').fill('password123');
  await page.locator('#auth-form button[type="submit"]').click();
  await page.locator('.content').waitFor({state:'visible',timeout:1600});
  await page.waitForTimeout(300);
  const runtime=await page.evaluate(()=>({v97:window.__ct97Loaded===true,selective:window.__ctHotfix10Selective===true,actions:window.__ctHotfix10Actions===true}));
  if(runtime.v97)throw new Error('HOTFIX10: forbidden v97 overlay executed.');
  if(!runtime.selective||!runtime.actions)throw new Error(`HOTFIX10: selective/action runtime missing: ${JSON.stringify(runtime)}`);

  await clickView('home');
  if(!/Início|Acompanhar/i.test(await page.locator('.content').innerText()))throw new Error('Home marker missing.');

  await clickView('discover');
  await page.locator('#ct92-discover-results').waitFor({state:'attached',timeout:1800});
  const fy=page.locator('[data-ct95-tab="for-you"]');await fy.waitFor({state:'visible',timeout:1800});await page.waitForTimeout(180);
  if(!(await fy.evaluate(el=>el.classList.contains('active'))))throw new Error('Descobrir did not default to Pra Você.');
  const tabTexts=(await page.locator('.ct92-tabs button').allInnerTexts()).map(x=>x.trim());
  if(tabTexts[0]!=='Pra Você'||tabTexts.at(-1)!=='Calendário')throw new Error(`Discover order wrong: ${tabTexts.join(' | ')}`);

  await page.evaluate(()=>{
    const old=document.querySelector('#ct10-action-fixture');if(old)old.remove();
    const card=document.createElement('article');card.id='ct10-action-fixture';card.className='ct95-card';card.dataset.type='movie';card.dataset.id='101';
    card.innerHTML='<div class="ct95-body"><div class="ct95-title">Filme Teste</div><div class="ct95-meta">FILME · 2024 · ★ 8.3</div><div class="ct95-actions"><button class="ct95-btn" data-seen95>Assistido</button><button class="ct95-btn" data-watch95>Adicionar à Watchlist</button></div></div>';
    document.querySelector('.content')?.appendChild(card);
  });
  await page.locator('#ct10-action-fixture [data-seen95]').click();
  await page.locator('#ct10-action-fixture [data-seen95]').filter({hasText:'Assistido'}).waitFor({state:'visible',timeout:1800});
  await page.waitForTimeout(120);
  if(!rpcBodies.some(b=>b?.p_tmdb_id===101&&b?.p_media_type==='movie'&&b?.p_media_kind==='movie'))throw new Error(`Assistido RPC schema incorrect: ${JSON.stringify(rpcBodies)}`);
  if(!dbWrites.some(w=>w.table==='media_overrides'&&w.method==='POST'&&w.body?.profile_id==='00000000-0000-4000-8000-000000000010'&&w.body?.media_id===999&&w.body?.state==='AlreadySeen'&&w.body?.origin==='manual'))throw new Error(`Assistido override write incorrect: ${JSON.stringify(dbWrites)}`);
  if(!dbWrites.some(w=>w.table==='watch_history'&&w.method==='POST'&&w.body?.profile_id==='00000000-0000-4000-8000-000000000010'&&w.body?.media_id===999&&w.body?.item_type==='movie'&&w.body?.source==='manual'))throw new Error(`Assistido history write incorrect: ${JSON.stringify(dbWrites)}`);
  await page.locator('#ct10-action-fixture [data-watch95]').click();
  await page.waitForTimeout(180);
  if(!dbWrites.some(w=>w.table==='media_overrides'&&w.method==='POST'&&w.body?.state==='AddedToWatchlist'&&w.body?.origin==='manual'&&w.body?.media_id===999))throw new Error(`Watchlist override write incorrect: ${JSON.stringify(dbWrites)}`);

  await clickView('history');
  await page.locator('#ct92-history').waitFor({state:'attached',timeout:1800});
  if(!/Histórico/i.test(await page.locator('.content').innerText()))throw new Error('History marker missing.');

  await clickView('profile');
  await page.locator('#ct94-profile,#ct92-profile').first().waitFor({state:'attached',timeout:1800});
  if(!/Perfil|Episódios/i.test(await page.locator('.content').innerText()))throw new Error('Profile marker missing.');

  await clickView('settings');
  await page.locator('#ct10-import-panel').waitFor({state:'visible',timeout:1800});
  if(!/Configurações|Backup|Importar dados/i.test(await page.locator('.content').innerText()))throw new Error('Settings marker missing.');
  const accept=await page.locator('#ct10-files').getAttribute('accept');
  for(const ext of ['.zip','.json','.csv'])if(!String(accept).includes(ext))throw new Error(`Importer does not accept ${ext}`);

  const library='type,title,tmdb_id,tvdb_id,year,list_status\nmovie,Filme Teste,101,0,2024,for_later\n';
  const watches='type,title,tmdb_id,tvdb_id,first_watched_at,last_watched_at,plays\nmovie,Filme Teste,101,0,2026-01-01T12:00:00Z,2026-01-01T12:00:00Z,1\n';
  await page.locator('#ct10-files').setInputFiles([{name:'library.csv',mimeType:'text/csv',buffer:Buffer.from(library)},{name:'watches.csv',mimeType:'text/csv',buffer:Buffer.from(watches)}]);
  await page.locator('#ct10-read').click();
  await page.locator('#ct10-preview').waitFor({state:'visible',timeout:1800});
  const preview=await page.locator('#ct10-preview').innerText();
  if(!preview.includes('Prévia da importação')||!preview.includes('1')||!preview.includes('Títulos'))throw new Error(`CSV preview incorrect: ${preview}`);
  if(!preview.includes('decisões manuais')&&!preview.includes('Dados criados'))throw new Error('Importer safety guarantee missing from preview.');
  if(edgeCalls.length)throw new Error('Importer called backend before confirmation.');
  await page.locator('[data-close10]').click();

  const heartbeat=await Promise.race([page.evaluate(()=>new Promise(r=>setTimeout(()=>r('alive'),1000))),new Promise(r=>setTimeout(()=>r('starved'),2200))]);
  if(heartbeat!=='alive')throw new Error('HOTFIX10 UI thread starved.');
  if(errors.length)throw new Error(`Browser errors after HOTFIX10 flow:\n${errors.join('\n')}`);
  console.log(`HOTFIX10_SELECTIVE_OK root=${process.env.CINETRACKER_TEST_ROOT||'dist'}; views=home,discover,history,profile,settings; discover=Pra Você first/Calendário last; actions=manual-schema-correct; CSV preview=OK; edge-before-confirm=0; browser errors=0`);
}finally{await browser.close().catch(()=>{});await new Promise(resolve=>server.close(resolve))}
