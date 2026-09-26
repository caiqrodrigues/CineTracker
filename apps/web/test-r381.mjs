import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R381_SKIP_BUILD!=='1')await import('./build-r381.mjs');
const [html,js,sw,rel,src,mig]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v381.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r381-restore-home-profile-foryou.js'),'utf8'),readFile(resolve('../../supabase/migrations/20260926022500_r381_strict_user_evidence_discover_filter.sql'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR381Marker='home-full-v359-first+bounded-live-episode-patch+profile-original-structure+fresh-audit-required+actions-3-2-3'","rpc('cinetracker_home_payload_v359'","rpc('cinetracker_profile_v380'","rpc('cinetracker_discover_filter_v381'","ct381-actions","profileSection381('Séries'","profileSection381('Filmes Favoritos'"])ok(src.includes(x),'r381 missing '+x);
ok(src.includes("if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria pessoal incompleta')"),'Fresh audit can fail open');
ok(mig.includes("mo.state in ('AlreadySeen','Completed','InProgress','UpToDate')")&&mig.includes("i.norm_original"),'v381 alias seen evidence missing');
ok(html.includes('app-v381.js')&&sw.includes('ct-web-1.0.172-r381'),'asset identity');
ok(r.version==='1.0.172'&&r.revision==='r381-official-1.0.172','release identity');
console.log('WEB_R381_TEST_OK');
