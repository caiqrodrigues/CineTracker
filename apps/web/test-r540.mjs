import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';await import('./build-r540.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw,migration,build]=await Promise.all([
 readFile(resolve('dist/app-v540.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v540.css'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20261016170545_r540_fast_auth_safe_special_counts.sql'),'utf8'),readFile(resolve('build-r540.mjs'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r540 regression: '+m)};
yes(rootPkg.version==='0.3.67'&&webPkg.version==='0.3.67','versions');
yes(release.version==='0.3.67'&&release.revision==='r540-official-0.3.67','release');
yes(html.includes('app-v540.js')&&html.includes('app-v540.css'),'assets');
yes(js.includes("window.__ctR540SummaryMarker='auth-wait+fast-db-counts+bounded-retry+no-stuck-loading'"),'summary marker');
yes(js.includes("window.__ctR540Marker='special-counts-auth-safe+fast-v540+no-stuck-placeholder'"),'release marker');
yes(!js.includes("window.__ctR539SummaryMarker='db-first-global-progress+f1-race-only+ufc-wwe-events'"),'r539 summary replaced');
yes(js.includes('cinetracker_special_series_counts_v540'),'v540 RPC');
const rs=js.indexOf('/* CineTracker Web 0.3.67 r540'),re=js.indexOf("window.__ctR540SummaryMarker=",rs),rr=js.slice(rs,re);
yes(rr.includes('async function waitAuth()')&&rr.includes('for(let i=0;i<96;i++)'),'bounded auth wait');
yes(rr.includes('for(const delay of [0,250,750])'),'bounded RPC retry');
const s=js.indexOf('/* CineTracker Web 0.3.47 r520 — F1 + UFC + WWE Pay-Per-View single Home owner. */'),e=js.indexOf("window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';",s),region=js.slice(s,e);
yes(s>=0&&e>s,'special owner region');
yes(region.includes("window.__ctR516SpecialSummary?.get?.(key)"),'existing Home card preserved');
yes(region.includes("globalTotal.toLocaleString('pt-BR')+' '+unit+' assistidos'"),'exact historical progress preserved');
yes(migration.includes('cinetracker_special_series_counts_v540')&&migration.includes('watched_movies as materialized'),'fast migration');
yes(!migration.includes('cinetracker_special_series_progress_v520()'),'heavy progress removed');
yes(migration.includes('grant execute on function public.cinetracker_special_series_counts_v540() to authenticated'),'authenticated grant');
yes(js.includes('ct537-movie-list'),'Home Movies preserved');
yes(!css.includes('.ct536-movie-rail'),'obsolete movie rail absent');
yes(!build.includes('replaceScoped'),'no repeated r520 surgery');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!rr.includes(bad),'forbidden '+bad);
console.log('WEB_R540_REGRESSION_OK auth race + fast counts');
