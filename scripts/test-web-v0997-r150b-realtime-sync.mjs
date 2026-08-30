import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r150b test: '+msg)};
const runtime=await readFile(resolve(root,'apps/web/patch-v150b-v0997-realtime-sync.js'),'utf8');
for(const marker of[
  "['media_overrides','profile_id']",
  "['episode_progress','profile_id']",
  "['watch_history','profile_id']",
  "['watch_play_events_v0994','profile_id']",
  "['favorite_actors','user_id']",
  "['profiles','id']",
  "event==='postgres_changes'",
  "cinetracker:app-foreground",
  "visibilitychange",
  "window-focus",
  "access_token",
  "cinetracker_home_live_v0997_r3",
  "cinetracker:data-changed"
])must(runtime.includes(marker),`missing runtime marker ${marker}`);

const androidPrepare=await readFile(resolve(root,'scripts/prepare-android-hotfix2-web.mjs'),'utf8');
for(const marker of[
  'protected void onResume()',
  "cinetracker:app-foreground",
  "source:'android-onResume'",
  "window.__ct0997R150b='r150b-realtime-sync'"
])must(androidPrepare.includes(marker),`missing Android lifecycle marker ${marker}`);

for(const dir of[resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const r150='<script src="/patch-v150-v0997-calendar-release-sync.js?r150"></script>';
  const r150b='<script src="/patch-v150b-v0997-realtime-sync.js?r150b"></script>';
  must(html.includes(r150),'r150 anchor missing');
  must(html.includes(r150b),'r150b runtime tag missing');
  must(html.indexOf(r150b)>html.indexOf(r150),'r150b must load after r150');
  must(html.includes('ct-r148-web-pc-android'),'r148 Web PC lock was lost');
  const emitted=await readFile(resolve(dir,'patch-v150b-v0997-realtime-sync.js'),'utf8');
  must(emitted.includes("window.__ct0997R150b='r150b-realtime-sync'"),'emitted runtime mismatch');
  const sw=await readFile(resolve(dir,'service-worker.js'),'utf8');
  must(sw.includes('ct-web-0.99.7-r150b'),'service worker revision missing');
}
console.log('WEB_R150B_TEST_OK realtime=filtered focus=refetch android=onResume cache=invalidate layout=unchanged');
