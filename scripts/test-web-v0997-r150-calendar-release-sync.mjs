import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v150-v0997-calendar-release-sync.js');
const js=await readFile(source,'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error('r150-test: '+msg)};

must(js.includes("['foryou','Pra você']"),'Pra você must remain');
must(js.includes("['trending','Em alta']"),'Em alta missing');
must(js.includes("['popular','Populares']"),'Populares missing');
must(js.includes("['new','Novidades']"),'Novidades missing');
must(js.includes("['releases','Lançamentos']"),'Lançamentos missing');
must(js.includes("['anticipated','Mais Aguardados']"),'Mais Aguardados missing');
must(js.includes("['top','Mais bem avaliados']"),'Mais bem avaliados missing');
must(js.includes("['calendar','Calendário']"),'Calendário missing');
must(js.includes("const FILTERS=[['all','Todos'],['movie','Filmes'],['tv','Séries']]"),'shared subfilters missing');
must(js.includes("state.tab==='calendar'?[...FILTERS,['watchlist','Minha Watchlist']]:FILTERS"),'Minha Watchlist must be Calendar-only');
must(js.includes("if(state.tab==='foryou')return''"),'Pra você must not receive subfilters');
must(js.includes('cinetracker_calendar_watchlist_v0997'),'calendar must read real watchlist RPC');
must(js.includes("state.type==='watchlist'"),'watchlist filter logic missing');
must(js.includes('calendar_date'),'episode calendar date support missing');
must(js.includes('next-episode')||js.includes('HOME_LIVE_R3'),'Home r3 bridge missing');
must(js.includes('p_today:localDay()'),'client-local date missing');
must(js.includes('cinetracker_set_timezone_v0997'),'timezone persistence missing');
must(js.includes('armMidnight()'),'midnight timer missing');
must(js.includes("document.addEventListener('visibilitychange'"),'resume revalidation missing');
must(js.includes('ct131-row'),'horizontal carousel missing');
must(!js.includes('max-device-width'),'must not reintroduce mobile-web layout switch');
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});

for(const rel of ['dist','apps/web/dist']){
  const dir=resolve(root,rel),runtime=resolve(dir,'patch-v150-v0997-calendar-release-sync.js');
  execFileSync(process.execPath,['--check',runtime],{stdio:'pipe'});
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const r149='<script src="/patch-v149-v0997-discover-contract.js?r149"></script>';
  const r150='<script src="/patch-v150-v0997-calendar-release-sync.js?r150"></script>';
  must(html.includes(r149),'r149 runtime missing');
  must(html.includes(r150),'r150 runtime missing');
  must(html.indexOf(r150)>html.indexOf(r149),'r150 order invalid');
  must(html.includes('ct-r148-web-pc-android'),'Web PC Android lock missing');
  const sw=await readFile(resolve(dir,'service-worker.js'),'utf8');
  must(sw.includes('ct-web-0.99.7-r150'),'service worker revision missing');
}

console.log('WEB_R150_TEST_OK filters=calendar-parity watchlist=real-library home=local-day midnight=reactive carousel=horizontal web-pc-lock=preserved');
