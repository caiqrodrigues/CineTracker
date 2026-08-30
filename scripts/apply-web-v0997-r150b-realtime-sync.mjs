import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v150b-v0997-realtime-sync.js');
const name='patch-v150b-v0997-realtime-sync.js';
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r150b: '+msg)};

const js=await readFile(source,'utf8');
must(js.includes("event==='postgres_changes'"),'postgres_changes listener missing');
must(js.includes('cinetracker:app-foreground'),'Android foreground bridge missing');
must(js.includes("['media_overrides','profile_id']"),'media_overrides subscription missing');
must(js.includes("['favorite_actors','user_id']"),'favorite_actors subscription missing');
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});

for(const dir of dirs){
  const runtimePath=resolve(dir,name);
  await copyFile(source,runtimePath);
  execFileSync(process.execPath,['--check',runtimePath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(/<script src="\/patch-v150b-v0997-realtime-sync\.js(?:\?r\w+)?"><\/script>/g,'');
  const anchor='<script src="/patch-v150-v0997-calendar-release-sync.js?r150"></script>';
  const tag='<script src="/patch-v150b-v0997-realtime-sync.js?r150b"></script>';
  must(html.includes(anchor),'r150 anchor missing');
  html=html.replace(anchor,`${anchor}${tag}`);
  must(html.indexOf(tag)>html.indexOf(anchor),'r150b must load after r150');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC browser lock must survive');
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  let sw=await readFile(swPath,'utf8');
  sw=sw.replace(/ct-web-0\.99\.7-r(?:\d+\w*)/g,'ct-web-0.99.7-r150b');
  await writeFile(swPath,sw,'utf8');
}

console.log('WEB_R150B_APPLIED realtime=user-filtered focus=refetch visibility=refetch android=foreground cache=invalidate layout=unchanged');
await import('./test-web-v0997-r150b-realtime-sync.mjs');
