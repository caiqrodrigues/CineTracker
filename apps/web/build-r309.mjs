import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r308.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v308.js'),'utf8'),
 readFile(resolve(dist,'app-v308.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r309-video-truth.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error(`r309 expected one ${label}, found ${n}`);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r309 missing '+x)};
const segment=(s,startMarker,endMarker,replacement,label)=>{
 const m=s.indexOf(startMarker);if(m<0)throw new Error('r309 missing '+label+' marker');
 const a=s.lastIndexOf('renderProfile=async function',m);if(a<0)throw new Error('r309 missing '+label+' start');
 const b=s.indexOf(endMarker,m);if(b<0)throw new Error('r309 missing '+label+' end');
 return s.slice(0,a)+replacement+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.99';window.__ctOfficialVersion='1.0.99';",
 "const REVISION='r308-official-1.0.99';",
 "const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];",
 "const DTABS257=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];",
 "const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];",
 "const baseRenderSports257=renderSports;renderSports=async function(seq){const out=await baseRenderSports257(seq);if(seq===navSeq&&route()==='sports'){for(const ms of[0,180,700,1800])setTimeout(()=>{if(route()==='sports')void paintF1257()},ms)}return out};",
 "function repairF1257(){if(route()!=='sports')return;const host=q257('.ct255-f1hub[data-ct255-f1]');if(host&&!q257('[data-ct257-f1-root]',host))void paintF1257()}",
 "const cached=profileCache||ct163Read('profile')||null;",
 "const baseProfile255=renderProfile;",
 "const baseProfile296=typeof renderProfile==='function'?renderProfile:null;",
 "ct117-stat-chevron",
 "void authority295(false).then(()=>{if(discover.tab==='foryou'){sanitizeForYou();try{paintForYou263()}catch{}}});",
 "window.__ctR308='discover-exact-3+3+personal-filter+f1-four-tabs+calendar-click+profile-first-paint'",
 "\nboot();"
])must(js,x);

/* Discover: remove Lançamentos in the actual private producers, not after paint. */
const tabs8="[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']]";
js=once(js,
 "const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];",
 "const DTABS263="+tabs8+";",
 'DTABS263 source'
);
js=once(js,
 "const DTABS257=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];",
 "const DTABS257="+tabs8+";",
 'DTABS257 source'
);
js=once(js,
 "const ct288TabLabels={trending:'Em alta',popular:'Populares',new:'Novidades',releases:'Lançamentos',anticipated:'Mais Aguardados',top:'Mais bem avaliados',calendar:'Calendário'};",
 "const ct288TabLabels={trending:'Em alta',popular:'Populares',new:'Novidades',anticipated:'Mais Aguardados',top:'Mais bem avaliados',calendar:'Calendário'};",
 'r288 labels'
);

/* Remove the same unauthorized tab from every older private producer/label map still shipped. */
js=js.replaceAll("['releases','Lançamentos'],","").replaceAll("releases:'Lançamentos',","");
if(js.includes("['releases','Lançamentos']")||js.includes("releases:'Lançamentos'"))throw new Error('r309 legacy Lançamentos authority survived');

/* F1: retire the r257 six-tab producer and all of its delayed takeover behavior. */
js=once(js,
 "const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];",
 "const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];",
 'F1TABS257 source'
);
js=once(js,
 "const baseRenderSports257=renderSports;renderSports=async function(seq){const out=await baseRenderSports257(seq);if(seq===navSeq&&route()==='sports'){for(const ms of[0,180,700,1800])setTimeout(()=>{if(route()==='sports')void paintF1257()},ms)}return out};",
 "const baseRenderSports257=renderSports;renderSports=async function(seq){return baseRenderSports257(seq)};",
 'r257 delayed F1 repaint'
);
js=once(js,
 "function repairF1257(){if(route()!=='sports')return;const host=q257('.ct255-f1hub[data-ct255-f1]');if(host&&!q257('[data-ct257-f1-root]',host))void paintF1257()}",
 "function repairF1257(){return false}",
 'r257 F1 repair observer'
);

/* Profile: one canonical payload before the first visible paint. */
const profile309=String.raw`const ct309ProfileBound=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
renderProfile=async function(seq){
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 const cached=profileCache||ct163Read('profile')||null;
 const fullP=ct309ProfileBound(rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}),9000,null);
 const quickP=ct309ProfileBound(rpc('cinetracker_profile_quick_stats_v1',{}),6000,null);
 const sportsP=ct309ProfileBound(rpc('cinetracker_sport_stats_v1',{}),6000,null);
 const stadiumP=ct309ProfileBound(rpc('cinetracker_sports_stadium_summary_v296',{}),6000,null);
 const [full,quick,sports,stadium]=await Promise.all([fullP,quickP,sportsP,stadiumP]);
 if(seq!==navSeq||route()!=='profile')return;
 let merged=full?{...full}:(quick?ct168MergeQuick(cached,quick):(cached?{...cached}:{}));
 merged.sports_stats=sports||merged.sports_stats||{};
 profileCache=merged;try{ct163Write('profile',merged)}catch{}
 ct168PaintProfile(merged,'');
 const count=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??0);
 try{window.__ctR296Test?.injectStadiumMetric296?.(count)}catch{}
 return merged;
};
`;
js=segment(js,
 "const cached=profileCache||ct163Read('profile')||null;",
 "\n\n/* The database already stores sports watch history.",
 profile309,
 'r168 staged Profile'
);
/* r255 previously rewrote sports values with rAF/timers/MutationObserver after the profile was visible. */
{
 const a=js.indexOf("const baseProfile255=renderProfile;"),b=js.indexOf("\n\n/* Component-local horizontal overflow only. */",a);
 if(a<0||b<0)throw new Error('r309 r255 Profile wrapper markers');
 js=js.slice(0,a)+"const baseProfile255=renderProfile;\n"+js.slice(b);
}
/* r296 stadium insertion is now part of the canonical first paint; keep only its reusable helper. */
{
 const a=js.indexOf("const baseProfile296=typeof renderProfile==='function'?renderProfile:null;"),b=js.indexOf("\n\n/* HOME micro-polish",a);
 if(a<0||b<0)throw new Error('r309 r296 Profile wrapper markers');
 js=js.slice(0,a)+"const baseProfile296=typeof renderProfile==='function'?renderProfile:null;\n"+js.slice(b);
}
/* Watchlist cards remain clickable but never emit a visible chevron, even for one frame. */
js=once(js,
 '<span class="ct117-stat-chevron" aria-hidden="true">›</span>',
 '',
 'Watchlist producer chevron'
);

/* r295 must preload authority without repainting the legacy For You over r309. */
js=once(js,
 "void authority295(false).then(()=>{if(discover.tab==='foryou'){sanitizeForYou();try{paintForYou263()}catch{}}});",
 "void authority295(false);",
 'r295 initial legacy For You repaint'
);

/* r306 generic capture must let r309 own its own actions. */
js=once(js,
 "const bypass307=t=>!!t?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap]');",
 "const bypass307=t=>!!t?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap],[data-ct309-action],[data-ct309-swap]');",
 'r306 early r309 bypass'
);
js=once(js,
 "if(target.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap]'))return",
 "if(target.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap],[data-ct309-action],[data-ct309-swap]'))return",
 'r306 document r309 bypass'
);

/* Final runtime owns live Discover/Profile hooks after all inherited code exists. */
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r309 insertion');
js=once(js,
 "window.__ctWebBuild='1.0.99';window.__ctOfficialVersion='1.0.99';",
 "window.__ctWebBuild='1.0.100';window.__ctOfficialVersion='1.0.100';",
 'Web version'
);
js=once(js,"const REVISION='r308-official-1.0.99';","const REVISION='r309-official-1.0.100';",'revision');

html=html.replaceAll('app-v308.js','app-v309.js').replaceAll('app-v308.css','app-v309.css').replaceAll('CineTracker • v1.0.99','CineTracker • v1.0.100');
sw=sw.replaceAll('ct-web-1.0.99-r308','ct-web-1.0.100-r309').replaceAll('app-v308.js','app-v309.js').replaceAll('app-v308.css','app-v309.css');
css+='\n/* CineTracker Web 1.0.100 r309 — visible fixes are embedded in the runtime before boot. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,version:'1.0.100',revision:'r309-official-1.0.100',base:'r308-production',
 scope:'video-truth-discover-f1-profile-web-only',
 discover_tabs:'foryou+top10+trending+popular+new+anticipated+top+calendar',
 discover_releases_tab:false,
 discover_single_tab_rail:true,
 discover_parallel_personal_and_catalog:true,
 discover_visual_dedupe:true,
 discover_exact_watchlist_categories:true,
 discover_exact_fresh_categories:true,
 discover_daily_swap:true,
 discover_actions:'system-chip-watchlist+seen',
 f1_tabs:'overview+calendar+standings+circuits',
 f1_r257_delayed_repaint:false,
 f1_first_paint_redundant_tabs:false,
 profile_cached_intermediate_paint:false,
 profile_quick_intermediate_paint:false,
 profile_canonical_single_paint:true,
 profile_r255_delayed_patch:false,
 profile_stadium_first_paint:true,
 profile_watchlist_chevron:false,
 profile_actor_scroll:'actual-card-rail-bottom',
 android:'1.0.20/10062'
};
for(const x of[
 "window.__ctR309='video-truth-discover-first-paint-f1-stable-profile'",
 "const DTABS263="+tabs8+";",
 "const DTABS257="+tabs8+";",
 "const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];",
 "function repairF1257(){return false}",
 "const ct309ProfileBound=",
 "window.__ctR296Test?.injectStadiumMetric296",
 "[data-ct309-action]",
 "ct309-actor-rail"
])must(js,x);
if(js.includes("for(const ms of[0,180,700,1800])setTimeout(()=>{if(route()==='sports')void paintF1257()"))throw new Error('r309 legacy r257 repaint survived');
if(js.includes('<span class="ct117-stat-chevron" aria-hidden="true">›</span>'))throw new Error('r309 Watchlist chevron survived producer');

await Promise.all([
 writeFile(resolve(dist,'app-v309.js'),js),
 writeFile(resolve(dist,'app-v309.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v308.js'),{force:true}),rm(resolve(dist,'app-v308.css'),{force:true})]);
console.log('WEB_R309_READY video-truth Discover + first-paint F1 + single-paint Profile');
