import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r312.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v312.js'),'utf8'),
  readFile(resolve(dist,'app-v312.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r313-discover-sports-profile.js'),'utf8')
]);

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r313 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r313 missing '+x)};
function replaceFunction(src,name,replacement){
  const sig='function '+name+'(';const start=src.indexOf(sig);if(start<0)throw new Error('r313 missing function '+name);
  const open=src.indexOf('{',start);if(open<0)throw new Error('r313 missing body '+name);
  let depth=0,quote='',esc=false;
  for(let i=open;i<src.length;i++){
    const ch=src[i];
    if(quote){
      if(esc){esc=false;continue}
      if(ch==='\\'){esc=true;continue}
      if(ch===quote){quote='';continue}
      continue;
    }
    if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return src.slice(0,start)+replacement+src.slice(i+1);
  }
  throw new Error('r313 unterminated function '+name);
}

for(const x of[
  "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
  "const REVISION='r312-official-1.0.103';",
  "window.__ctR312='discover-single-shell+auth-refresh+profile-live-favorites+stadium-button+sports-inline-filters'",
  "window.__ctR312EarlyCapture=true",
  "function card312(x,saved=false){",
  "function paintSports255(){",
  "const version='1.0.103',revision='r312-official-1.0.103';",
  "\nboot();"
])must(js,x);

js=replaceFunction(js,'card312',`function card312(x,saved=false){
 const k=keyOf(x),media=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false}):'';
 return '<article class="ct313-item ct313-r312-fallback" data-ct313-item="'+esc(k)+'">'+media+'<div class="ct313-actions"><button type="button" class="chip ct313-watch '+(saved?'active':'')+'" data-ct313-action="watchlist" data-media="'+esc(k)+'" '+(saved?'disabled':'')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button><button type="button" class="chip ct313-seen" data-ct313-action="seen" data-media="'+esc(k)+'">✓ Visto</button></div></article>';
}`);

js=replaceFunction(js,'paintSports255',`function paintSports255(){
 const h=q255('[data-ct255-sports]');if(!h)return;cleanupLegacySports255();
 const p=sport255.payload||{},rows=sportRows255(p),stats=p.stats||{},sports=Array.isArray(p.sports)?p.sports:[],label=SPORT_TABS255.find(([k])=>k===sport255.tab)?.[1]||'Esportes';
 const inline=['next','previous'].includes(sport255.tab)?'<div class="ct313-sport-filter" data-ct313-sport-filter><button type="button" class="chip '+(sport255.sport==='all'?'active':'')+'" data-ct255-sport-filter="all">Todos</button>'+sports.map(s=>'<button type="button" class="chip '+(sport255.sport===s.slug?'active':'')+'" data-ct255-sport-filter="'+esc255(s.slug)+'">'+esc255(s.icon||'🏆')+' '+esc255(s.name||s.slug)+'</button>').join('')+'</div>':'';
 h.innerHTML='<section class="ct255-f1hub" data-ct255-f1></section><div class="ct255-sports-tabs">'+SPORT_TABS255.map(([k,l])=>'<button type="button" class="ct255-sports-tab '+(sport255.tab===k?'active':'')+'" data-ct255-sport-tab="'+k+'">'+l+'</button>').join('')+'</div><section class="panel ct255-sports-feed"><div class="panel-head"><div class="ct313-feed-title"><h2>'+label+'</h2>'+inline+'</div><small>'+(sport255.tab==='watched'?n255(stats.watched_events||rows.length)+' assistidos':rows.length)+'</small></div><div class="ct255-sport-grid">'+(rows.map(e=>sportCard255(e,p)).join('')||'<div class="empty">Nenhum evento disponível neste filtro.</div>')+'</div></section>';
 void paintF1255();setTimeout(cleanupLegacySports255,0);setTimeout(cleanupLegacySports255,180);
}`);

const early313=String.raw`(()=>{if(window.__ctR313EarlyCapture)return;window.__ctR313EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR313EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;
js=once(js,
  "const version='1.0.103',revision='r312-official-1.0.103';",
  "const version='1.0.104',revision='r313-official-1.0.104';",
  'footer identity'
);
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r313 insertion');
js=early313+'\n'+js;
js=once(js,
  "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
  "window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';",
  'Web version'
);
js=once(js,"const REVISION='r312-official-1.0.103';","const REVISION='r313-official-1.0.104';",'revision');

html=html.replaceAll('app-v312.js','app-v313.js').replaceAll('app-v312.css','app-v313.css').replaceAll('v1.0.103','v1.0.104').replaceAll('r312-official-1.0.103','r313-official-1.0.104');
sw=sw.replaceAll('ct-web-1.0.103-r312','ct-web-1.0.104-r313').replaceAll('app-v312.js','app-v313.js').replaceAll('app-v312.css','app-v313.css');
css+='\n/* CineTracker Web 1.0.104 r313 — approved Discover cards/hidden filter, Sports producer filter, one Profile renderer. */\n';

const prev=JSON.parse(releaseRaw),release={
  ...prev,
  version:'1.0.104',
  revision:'r313-official-1.0.104',
  base:'r312-production',
  scope:'discover-approved-layout+sports-producer-filter+profile-single-render-web-only',
  discover_type_filter:'compact-hidden-toggle',
  discover_type_filter_default_hidden:true,
  discover_custom_banner:false,
  discover_card_renderer:'ct288-approved',
  discover_tabs_persistent_during_load:true,
  discover_public_tabs:'trending+popular+new+anticipated+top',
  discover_public_exclusion:'seen+watchlist+alias-before-markup',
  discover_public_watchlist_button:true,
  discover_public_seen_button:true,
  discover_metadata_unclipped:true,
  discover_native_horizontal_scroll:true,
  discover_foryou_owner:'r309-exact-compact',
  sports_inline_filter_owner:'paintSports255-producer',
  sports_inline_filter_tabs:'next+previous',
  sports_inline_filter_source:'payload.sports',
  profile_renderer:'r313-single-canonical',
  profile_single_paint:true,
  profile_version_switching:false,
  profile_stadium_button_guaranteed:true,
  profile_stat_reference:'Eventos assistidos',
  auth_expired_jwt_refresh_retry:true,
  f1_calendar_renderer:'r311-clickable-race-buttons',
  f1_session_watch:true,
  android:'1.0.20/10062'
};

for(const x of[
  "window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'",
  "window.__ctR313EarlyCapture=true",
  "function shellHtml313",
  "ct288-filter-btn ct313-filter-btn",
  "function filterPublic313",
  "ct288Card(x,{watch:false,add:false})",
  "function renderProfile313",
  "data-ct313-sport-filter",
  "sport255.payload||{}",
  "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
  "window.__ctR312='discover-single-shell+auth-refresh+profile-live-favorites+stadium-button+sports-inline-filters'",
  "const version='1.0.104',revision='r313-official-1.0.104';"
])must(js,x);
if(!js.startsWith(early313+'\n'))throw new Error('r313 capture is not first');
if(js.includes('<article class="ct312-card"'))throw new Error('r313 custom r312 Discover card/banner survived');
if(js.includes('<div class="ct255-sport-filters">'))throw new Error('r313 old global Sports filter survived producer');
if(release.android!=='1.0.20/10062')throw new Error('r313 Android baseline changed');

await Promise.all([
  writeFile(resolve(dist,'app-v313.js'),js),
  writeFile(resolve(dist,'app-v313.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v312.js'),{force:true}),rm(resolve(dist,'app-v312.css'),{force:true})]);
console.log('WEB_R313_READY approved Discover + producer Sports filter + single Profile; Android preserved');
