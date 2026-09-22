import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r329.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v329.js'),'utf8'),
 readFile(resolve(dist,'app-v329.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r330-home-discover-speed.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r330 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r330 expected one '+l+', found '+n);return s.replace(a,b)};
const replaceRange=(s,start,end,next,label)=>{
 const a=s.indexOf(start),b=s.indexOf(end,a+start.length);
 if(a<0||b<0||b<=a)throw new Error('r330 range '+label+' missing');
 return s.slice(0,a)+next+'\n'+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';",
 "const REVISION='r329-official-1.0.120';",
 "const version='1.0.120',revision='r329-official-1.0.120';",
 "window.__ctR329Marker='discover-fixed-card-rail+one-line-actions+no-page-overflow'",
 "function ct285PaintHome(){",
 "async function ct287PrepareHome(payload,seq){",
 "async function paintTop321(provider,token,force=false){",
 "async function loadTop321(force=false){",
 "cinetracker_discover_filter_v326",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR330Marker='home-immediate-paint+cancel-stale-reconcile+discover-buttons-grid+top10-up-no-provider-duplicate'",
 "grid-template-columns:repeat(3,minmax(0,1fr))",
 "ct288-top-title,.ct288-top-name"
])must(runtime,x);

/* Home: paint the DB payload immediately. Reconcile live series metadata only after first paint. */
const paint285=[
"function ct285PaintHome(){",
" const payload=ct274Payload();if(!payload)return;",
" if(payload!==ct285HomePayload){",
"  const seq=++ct285HomeSeq;",
"  const rows=ct275DedupSeries(payload?.series||[]).map(ct285CloneRow);",
"  ct285HomePayload=payload;",
"  ct285CommittedRows=rows.map(ct285CloneRow);",
"  ct275SourcePayload=payload;",
"  ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow);",
"  const out=ct285PaintBase();ct285DecorateCovers(document);",
"  window.__ctR330HomeFirstPaintAt=Date.now();",
"  const kick=()=>{try{if(seq===ct285HomeSeq&&route()==='home'&&ct274Payload()===payload)void ct285PrepareHome(payload,seq)}catch{}};",
"  if(typeof requestIdleCallback==='function')requestIdleCallback(kick,{timeout:750});else setTimeout(kick,80);",
"  return out;",
" }",
" if(ct285CommittedRows){ct275SourcePayload=payload;ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow)}",
" const out=ct285PaintBase();ct285DecorateCovers(document);return out;",
"}"
].join('\n');
js=replaceRange(js,'function ct285PaintHome(){','ct275PaintHome=ct285PaintHome;',paint285,'ct285PaintHome');

/* Background reconciliation is disposable: once the user leaves Home it may finish network work,
   but it cannot commit or repaint the old route. */
const prep287=[
"async function ct287PrepareHome(payload,seq){",
" if(seq!==ct285HomeSeq||ct274Payload()!==payload||route()!=='home')return;",
" const rows=ct275DedupSeries(payload?.series||[]).map(ct285CloneRow);",
" try{",
"  const state=await ct275FetchWatchState(rows);",
"  if(seq!==ct285HomeSeq||ct274Payload()!==payload||route()!=='home')return;",
"  ct275ApplyWatchState(rows,state);",
"  const candidates=ct287Candidates(rows);",
"  await ct275MapLimit(candidates,6,async row=>{",
"   if(seq!==ct285HomeSeq||route()!=='home')return;",
"   await ct275ReconcileOne(row);",
"  });",
" }catch(_){/* The already-painted Home remains usable if live enrichment fails. */}",
" if(seq!==ct285HomeSeq||ct274Payload()!==payload||route()!=='home')return;",
" ct285HomePayload=payload;",
" ct285CommittedRows=rows.map(ct285CloneRow);",
" ct275SourcePayload=payload;",
" ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow);",
" if(route()==='home'&&typeof ct275PaintHome==='function')ct275PaintHome();",
" ct285DecorateCovers(document);",
"}"
].join('\n');
js=replaceRange(js,'async function ct287PrepareHome(payload,seq){','ct285PrepareHome=ct287PrepareHome;',prep287,'ct287PrepareHome');

/* Do not compete with initial navigation. Keep the live TV metadata refresh, but start it after
   the first screen is interactive and only if Home is still the active route. */
js=once(js,
 "setTimeout(()=>void refreshTv325(false),40);",
 "setTimeout(()=>{if(routeNow()==='home')void refreshTv325(false)},1600);",
 'r325 refresh delay'
);

/* Final Top 10 audit: the list returned by the progressive page loader is validated again immediately
   before markup, and the selected provider is not repeated as a second textual heading. */
const paintTop=[
"async function paintTop321(provider,token,force=false){",
" const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;",
" content.innerHTML='<div class=\"ct263-loading\">Montando Top 10…</div>';",
" try{",
"  const raw=await topRaw321(provider,force);",
"  if(token!==topToken||String(discover?.tab)!=='top10')return false;",
"  const a=await exact321([...raw.movies,...raw.series]);",
"  if(token!==topToken||String(discover?.tab)!=='top10')return false;",
"  const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);",
"  const series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);",
"  content.innerHTML=",
"   '<section class=\"panel ct288-top-section\"><div class=\"panel-head\"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class=\"ct319-top-row\">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class=\"empty\">Sem séries elegíveis neste streaming.</div>')+'</div></section>'+",
"   '<section class=\"panel ct288-top-section\"><div class=\"panel-head\"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class=\"ct319-top-row\">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class=\"empty\">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';",
"  loaded321();try{window.__ctR330?.normalizeDiscover?.(document)}catch{}return true;",
" }catch(e){content.innerHTML='<div class=\"empty\">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}",
"}"
].join('\n');
js=replaceRange(js,'async function paintTop321(provider,token,force=false){','async function loadTop321(force=false){',paintTop,'paintTop321');

const loadTop=[
"async function loadTop321(force=false){",
" const h=host();if(!h)return false;const token=++topToken;loading321('Carregando Top 10…');",
" h.innerHTML='<section class=\"ct288-top-shell\"><div class=\"ct288-provider-row\" data-ct321-providers><div class=\"ct263-loading\">Carregando streamings…</div></div><div data-ct321-top-content><div class=\"ct263-loading\">Carregando Top 10…</div></div></section>';",
" try{",
"  const providers=typeof ct171Providers==='function'?await ct171Providers():[];",
"  if(token!==topToken||String(discover?.tab)!=='top10')return false;",
"  if(!state.topProvider||!providers.some(p=>Number(p.provider_id)===Number(state.topProvider)))state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||providers[0]?.provider_id||0);",
"  try{ct171TopProvider=state.topProvider}catch{}",
"  const box=q('[data-ct321-providers]');",
"  if(box)box.innerHTML=rows(providers).map(p=>'<button type=\"button\" class=\"ct288-provider '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'\" data-ct321-provider=\"'+Number(p.provider_id)+'\">'+(p.logo_path?'<span style=\"background-image:url(\\\''+img(p.logo_path,'w92')+'\\\')\"></span>':'')+'<b>'+esc(p.provider_name||'Streaming')+'</b></button>').join('')||'<div class=\"empty\">Nenhum streaming disponível.</div>';",
"  try{window.__ctR330?.normalizeDiscover?.(document)}catch{}",
"  if(state.topProvider)return paintTop321(state.topProvider,token,force);",
"  loaded321();return false;",
" }catch(e){const c=q('[data-ct321-top-content]');if(c)c.innerHTML='<div class=\"empty\">Não foi possível carregar os streamings agora.</div>';loaded321();return false}",
"}"
].join('\n');
js=replaceRange(js,'async function loadTop321(force=false){','async function loadDiscover321(tab=discover?.tab,force=false){',loadTop,'loadTop321');

js=once(js,"window.__ctWebBuild='1.0.120';window.__ctOfficialVersion='1.0.120';","window.__ctR330Build='fast-home+final-top10-audit+compact-discover';window.__ctWebBuild='1.0.121';window.__ctOfficialVersion='1.0.121';",'web version');
js=once(js,"const REVISION='r329-official-1.0.120';","const REVISION='r330-official-1.0.121';",'revision');
js=once(js,"const version='1.0.120',revision='r329-official-1.0.120';","const version='1.0.121',revision='r330-official-1.0.121';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v329.js','app-v330.js').replaceAll('app-v329.css','app-v330.css').replaceAll('v1.0.120','v1.0.121').replaceAll('r329-official-1.0.120','r330-official-1.0.121');
sw=sw.replaceAll('ct-web-1.0.120-r329','ct-web-1.0.121-r330').replaceAll('app-v329.js','app-v330.js').replaceAll('app-v329.css','app-v330.css');
css+='\n/* CineTracker Web 1.0.121 r330 — immediate Home paint + compact Discover + strict Top 10. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.121',
 revision:'r330-official-1.0.121',
 base:'r329-production',
 scope:'home-first-paint-performance+navigation-stability+discover-final-layout+top10-audit',
 home_initial_render:'db-payload-first-before-live-series-reconcile',
 home_reconcile:'background-idle+route-and-sequence-guard',
 home_refresh_tv_start:'after-1600ms-only-if-home-active',
 home_history_behavior:'r328-preserved-above-initial-viewport-newest-nearest-content',
 discover_filter_authority:'cinetracker_discover_filter_v326',
 discover_foryou_actions:'three-equal-compact-buttons-one-row',
 discover_foryou_filters:'r329-preserved-all+movies+series+anime',
 discover_top10:'progressive-fill-ten+v326-final-audit',
 discover_top10_heading:'provider-pills-only-no-duplicate-provider-name',
 discover_top10_geometry:'top-title-removed+provider-row-raised',
 discover_public_actions:'two-equal-compact-buttons-one-row',
 profile_watchlist_counts:'r324-preserved-exact',
 profile_watchlist_sort:'r324-preserved',
 home_episode_live_reconcile:'r325-preserved-background',
 web_version_ui:'1.0.121+r330-official-1.0.121',
 sports_changes:'none-r330',
 f1_changes:'none-r330',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r330 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v330.js'),js),
 writeFile(resolve(dist,'app-v330.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v329.js'),{force:true}),rm(resolve(dist,'app-v329.css'),{force:true})]);
console.log('WEB_R330_READY immediate Home + stable navigation + compact Discover + strict Top10');
