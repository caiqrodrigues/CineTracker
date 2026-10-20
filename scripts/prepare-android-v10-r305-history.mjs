import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// CineTracker Android 1.0, r305. Only Sports presentation and Home/Movies history.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-sportsfix.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r304-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('CineTracker 1.0/r304 official baseline not found');
let js=html.slice(a+tag.length,b);
function one(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('1.0/r305 '+label+' expected 1 match, found '+n);
 js=js.replace(from,to);
}
one("const REVISION='r304-android-official-1.0';",
 "const REVISION='r305-android-official-1.0';",'diagnostic revision');
one("window.__ctAndroidOfficialCode=10105;",
 "window.__ctAndroidOfficialCode=10106;",'update-compatible native code');
// Sports — remove just the "Ver eventos" button next to the existing
// working watched action. Keep the same DOM node and backend click listener.
one("if(events)bar.appendChild(events);",
 "if(events)events.remove();",'delete event button');
one("[data-sports] .event-grid .ct304-sports-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;",
 "[data-sports] .event-grid .ct304-sports-actions{display:grid!important;grid-template-columns:minmax(0,1fr)!important;",
 'make watched button full width');

// Home / Filmes — the r271->r273->r283->r284 cascade can finish an old
// asynchronous request after a more recent event and repaint stale cards.
// Keep its full authenticated archive while pinning the 200 newest verified
// movie records from v542. Fetch only the recent page on each fresh visit,
// foreground resume, movie-watch mutation, and bounded active interval.
// Never reload the page and never replace an unrelated section.
const module=[
 '/* Android 1.0 / r305 — authorized recent-movie-history overlay */',
 "(()=>{'use strict';",
 'if(window.__ctR305MovieHistory)return;',
 'const bridge=window.__ctR271Bridge;',
 "if(!bridge?.getPainter||!bridge?.setPainter)throw Error('r305 movie history bridge missing');",
 "const uid=()=>String(session?.user?.id||user?.id||'');",
 "const active=()=>route()==='home'&&homeActiveTab158==='movies';",
 "const list=v=>Array.isArray(v)?v:[];",
 "const time=x=>Date.parse(x?.watched_at||x?.last_watched_at||'')||0;",
 "const valid=x=>Number(x?.media_id)>0&&time(x)>0&&Boolean(String(x.media_title||x.title||'').trim());",
 "let account='',fresh=[],inflight=null,epoch=0,lastAttempt=0,lastSynced=0,lastError='',successes=0,paints=0;",
 'function reset(id){',
 ' if(account===id)return;',
 ' account=id;fresh=[];inflight=null;lastAttempt=0;lastSynced=0;lastError="";epoch++;',
 '}',
 'function merge(items){',
 ' const joined=[...fresh,...list(items)].filter(valid);',
 ' const combined=window.__ctR283History?.combine?.([joined])||joined;',
 ' return combined.sort((a,b)=>time(b)-time(a)||Number(b.media_id||0)-Number(a.media_id||0));',
 '}',
 'const previousPainter=bridge.getPainter();',
 'bridge.setPainter(function(items){',
 ' const id=uid();reset(id);',
 ' const combined=merge(items);',
 ' if(combined.length&&homeCache)homeCache={...homeCache,history_movies:combined};',
 ' const result=previousPainter.call(this,combined.length?combined:items);',
 ' if(result&&active())paints++;',
 ' return result;',
 '});',
 'function recentKey(rows){',
 ' return rows.slice(0,12).map(x=>String(x.media_id)+":"+(x.watched_at||"")).join("|");',
 '}',
 'async function refresh(force=false){',
 ' const id=uid();reset(id);',
 ' if(!id||!session?.access_token)return [];',
 ' if(inflight)return inflight;',
 ' if(!force&&Date.now()-lastAttempt<20000)return fresh;',
 ' lastAttempt=Date.now();',
 ' const request=++epoch;',
 ' inflight=(async()=>{',
 "  const timer=new Promise((_,reject)=>setTimeout(()=>reject(new Error('movie-history-timeout')),15000));",
 "  const payload=await Promise.race([rpc('cinetracker_home_movie_history_v542',{p_limit:200,p_offset:0}),timer]);",
 "  if(!payload||!Array.isArray(payload.rows)||!Number.isFinite(Number(payload.total)))",
 "   throw new Error('Histórico recente não confirmado pelo servidor');",
 '  if(uid()!==id||epoch!==request)return [];',
 '  const next=payload.rows.filter(valid).sort((a,b)=>time(b)-time(a));',
 '  const changed=recentKey(next)!==recentKey(fresh)||next.length!==fresh.length;',
 '  fresh=next;lastSynced=Date.now();lastError="";successes++;',
 '  // A server-confirmed newer event is put at the bottom chronologically.',
 '  // The complete archive from r271/r283/r284 is never truncated.',
 '  if(active()&&changed){',
 '   const existing=list(homeCache?.history_movies);',
 '   bridge.getPainter()(existing);',
 '  }',
 '  document.documentElement.dataset.ct305MovieLatest=next[0]?.watched_at||"none";',
 '  document.documentElement.dataset.ct305MovieSyncedAt=new Date(lastSynced).toISOString();',
 '  return next;',
 ' })().catch(error=>{',
 '  if(uid()===id&&epoch===request){lastError=String(error?.message||error);',
 '   document.documentElement.dataset.ct305MovieError=lastError}',
 '  return fresh;',
 ' }).finally(()=>{if(uid()===id&&epoch===request)inflight=null});',
 ' return inflight;',
 '}',
 'const oldPaintHome=paintHome;',
 'paintHome=function(...args){',
 ' const result=oldPaintHome.apply(this,args);',
 ' if(active())queueMicrotask(()=>{void refresh(false)});',
 ' return result;',
 '};',
 "document.addEventListener('click',event=>{",
 " if(event.target?.closest?.('[data-home-tab=\"movies\"],[data-home-tab=\"films\"]'))",
 '  queueMicrotask(()=>{if(active())void refresh(true)});',
 '},false);',
 "window.addEventListener('pageshow',()=>{if(active())void refresh(true)});",
 "document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active())void refresh(true)});",
 "window.addEventListener('focus',()=>{if(!document.hidden&&active())void refresh(false)});",
 "window.addEventListener('cinetracker:data-changed',event=>{",
 " const reason=String(event?.detail?.source||'');",
 " if(/movie|watch|seen|history/i.test(reason)&&active())void refresh(true);",
 '});',
 'setInterval(()=>{if(!document.hidden&&active())void refresh(false)},120000);',
 'window.__ctR305MovieHistory={refresh,merge,stats:()=>({account,latest:fresh[0]?.watched_at||null,',
 ' lastSynced,lastError,successes,paints,count:fresh.length}),scope:"Home Movies only"};',
 '})();'
].join('\n')+'\n';
one('boot();\n})();',module+'boot();\n})();','add movie-only newest-first refresh authority');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r305-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R305_READY: Sports only Assistido with full width; movie history latest v542 first page on app open/resume, authenticated merge into complete archive; Web/Supabase/F1/Discover untouched.');
