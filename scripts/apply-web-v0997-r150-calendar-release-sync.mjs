import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v150-v0997-calendar-release-sync.js');
const name='patch-v150-v0997-calendar-release-sync.js';
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r150: '+msg)};

const sourceJs=await readFile(source,'utf8');
must(sourceJs.includes("['releases','Lançamentos']"),'Lançamentos tab missing');
must(sourceJs.includes("const FILTERS=[['all','Todos'],['movie','Filmes'],['tv','Séries']]"),'Todos/Filmes/Séries contract missing');
must(sourceJs.includes("['watchlist','Minha Watchlist']"),'Calendar Minha Watchlist filter missing');
must(sourceJs.includes('cinetracker_calendar_watchlist_v0997'),'real watchlist calendar RPC missing');
must(sourceJs.includes('cinetracker_home_live_v0997_r3'),'local-day Home RPC missing');
must(sourceJs.includes('p_today:localDay()'),'local date parameter missing');
must(sourceJs.includes('cinetracker_set_timezone_v0997'),'timezone sync missing');
must(sourceJs.includes('armMidnight()'),'midnight revalidation missing');
must(sourceJs.includes('data-ct149-root'),'r149 observer compatibility guard missing');
must(sourceJs.includes('ct131-row'),'horizontal carousel contract missing');
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});

for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await copyFile(source,runtimePath);
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v150-v0997-calendar-release-sync\.js(?:\?r\d+)?"><\/script>/g,'');
  const tag='<script src="/patch-v150-v0997-calendar-release-sync.js?r150"></script>';
  const r149='<script src="/patch-v149-v0997-discover-contract.js?r149"></script>';
  must(html.includes(r149),'r149 anchor missing');
  html=html.replace(r149,`${r149}${tag}`);
  must(html.indexOf(tag)>html.indexOf(r149),'r150 must load after r149');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC browser lock must survive');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r\d+/g,'ct-web-0.99.7-r150');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R150_APPLIED discover=Todos+Filmes+Series calendar=MinhaWatchlist real-library releases=local-day home=next-episode timezone=local midnight=reactive layout=unchanged');
await import('./test-web-v0997-r150-calendar-release-sync.mjs');
