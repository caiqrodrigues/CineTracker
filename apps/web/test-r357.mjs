import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R357_SKIP_BUILD!=='1')await import('./build-r357.mjs');
const [js,html,rRaw,runtime,sports]=await Promise.all([
 readFile(resolve('dist/app-v357.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r357-card-meta-actions.js'),'utf8'),
 readFile(resolve('../../supabase/functions/ct-sports-sync/index.ts'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R357_STATIC '+m)};
ok(r.version==='1.0.148'&&r.revision==='r357-official-1.0.148','identity');
ok(html.includes('app-v357.js')&&html.includes('app-v357.css'),'assets');
ok(js.includes("window.__ctR357Marker='media-kind-badge+full-meta+foryou-final-click-owner+national-team-ready'"),'runtime marker');
ok(js.includes("const direct357=window.__ctR357DirectClick;if(typeof direct357==='function'&&direct357(t,e))return;"),'earliest click hook');
ok(runtime.includes("ct357-kind-badge")&&runtime.includes("metaText357"),'media badge/meta missing');
ok(runtime.includes("window.__ctR352?.action?.(btn)")&&runtime.includes("window.__ctR352?.swap?.(btn)"),'local action owner missing');
ok(runtime.includes("safeTmdb('/'+m[1]+'/'+m[2],{})"),'TMDB detail fallback missing');
for(const code of ['fifa.friendly','uefa.nations','fifa.worldq.uefa','fifa.worldq.conmebol','fifa.worldq.concacaf','fifa.worldq.afc','fifa.worldq.caf','fifa.worldq.ofc'])
 ok(sports.includes("'"+code+"'"),'sports route missing '+code);
ok(sports.includes('sports-hub-v5-national-teams'),'sports edge version missing');
ok(r.media_kind==='badge-on-poster-no-kind-in-meta','media kind contract');
ok(r.media_metadata==='year+rating+primary-genre+tmdb-detail-fallback','metadata contract');
ok(r.discover_foryou_actions==='r352-local-slot-only+background-persist','action contract');
ok(r.sports_national_teams==='espn-international-routes-v5','national-team contract');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R357_STATIC_OK');