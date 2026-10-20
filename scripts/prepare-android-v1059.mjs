import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1058.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r300-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Android 1.0.58 source missing');
let js=html.slice(a+tag.length,b);
function one(s,from,to,label){
 const hits=s.split(from).length-1;
 if(hits!==1)throw Error('r301 '+label+' expected exactly one pattern, found '+hits);
 return s.replace(from,to);
}
function scoped(begin,end,change,label){
 const a=js.indexOf(begin),b=a<0?-1:js.indexOf(end,a+begin.length);
 if(a<0||b<=a)throw Error('r301 cannot locate '+label);
 const before=js.slice(a,b),after=change(before);
 if(after===before)throw Error('r301 no changes in '+label);
 js=js.slice(0,a)+after+js.slice(b);
}
js=one(js,"const REVISION='r300-android-official-1.0.58';",
 "const REVISION='r301-android-official-1.0.59';",'revision');
js=one(js,"window.__ctWebBuild='1.0.58';window.__ctOfficialVersion='1.0.58';window.__ctAndroidOfficialVersion='1.0.58';window.__ctAndroidOfficialCode=10100;",
 "window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';window.__ctAndroidOfficialVersion='1.0.59';window.__ctAndroidOfficialCode=10101;",'metadata');
// Sports: remove only the third top-level tab. All existing favoriting,
// favorite teams, mark-watched, F1 Hub and server queries stay unmodified.
js=one(js,"[['previous','Anteriores'],['upcoming','Próximos'],['favorites','Favoritos']]",
 "[['previous','Anteriores'],['upcoming','Próximos']]",'two Sports tabs');

// Remove redundant delayed r290 reconciliation; r293 is the structural
// guard, r278 remains the one authoritative interactive slot controller.
scoped('/* r290 Discover guarded extension */','/* r291 scoped 0 */',section=>{
 const start=section.indexOf('function check(revision){');
 const finish=section.indexOf('window.__ctR290DiscoverTest=',start);
 if(start<0||finish<start)throw Error('r290 delayed callback block missing');
 section=section.slice(0,start)+
  '// r301: no delayed checks, click/data listeners, or duplicate discoverRows wrapper.\n'+
  section.slice(finish);
 return one(section,'window.__ctR290DiscoverTest={valid,check,schedule,get:()=>stable};',
 'window.__ctR290DiscoverTest={valid,get:()=>stable};','old reconciler API');
},'r290 competing repaint loop');

// Strong no-repetition law for new media across the four NEW discovery slots.
// Watchlist slots retain their own independent known titles, as intended.
scoped('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.','/* CineTracker Android 1.0.37/r279',section=>{
 const freshMemory=[
 'function ct301Exposed(key,ref){',
 ' if(watchKind(key))return seenIn(key).has(ref);',
 " return ['daily:movie','fresh:movie','fresh:series','fresh:anime'].some(slot=>seenIn(slot).has(ref));",
 '}'
 ].join('\n')+'\n';
 section=one(section,'function candidates(key,current){',freshMemory+'function candidates(key,current){','shared exposure memory');
 section=one(section,'const newRows=available.filter(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x));',
 'const newRows=available.filter(x=>!ct301Exposed(key,mediaRef(x))&&!blockedMemory(key,x));','swap history');
 section=one(section,'ct300Choice(usable.filter(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)))||null;',
 'ct300Choice(usable.filter(x=>!ct301Exposed(key,mediaRef(x))&&!blockedMemory(key,x)))||null;','initial filtered recommendation');
 section=one(section,'const keys=Object.keys(labels),picked=new Map(),busy=new Set();',
 'const keys=Object.keys(labels),picked=new Map(),busy=new Set(),swapping=new Set();','slot lock');
 section=one(section,'  let slot=q(\'[data-ct241-slot-key="\'+key+\'"]\',root);\n  if(!slot)continue;',
 '  let slot=q(\'[data-ct241-slot-key="\'+key+\'"]\',root);\n  if(!slot)continue;\n  if(swapping.has(key))continue;','no busy replace');
 section=one(section,"  busy.add(key);changeOne(key);\n  try{\n   const next=await slotChoice(key,ref);",
 "  busy.add(key);swapping.add(key);changeOne(key);\n  try{\n   const next=await slotChoice(key,ref);",'swap lock start');
 section=one(section,'  }finally{busy.delete(key);changeOne(key)}\n  return;',
 '  }finally{swapping.delete(key);busy.delete(key);changeOne(key)}\n  return;','swap lock finish');
 // r278 already schedules a targeted change on success/error. A global
 // event from an unrelated Profile/Sports/F1 action cannot repaint seven cards.
 section=one(section,"window.addEventListener('cinetracker:data-changed',()=>{if(isVisible())schedule()});",
 "/* r301: r278 owns its local operations; no global page data-change repaint. */",
 'global event repaint');
 return section;
},'authenticated recommendation laws');

// r294 server-authoritative Raw/SmackDown: fill rows missing FROM THE FIRST
// PAINT instead of only moving existing rows. Use v527 user library records
// and v4 watched keys, never create a fake or unowned show. Cache the
// verified result to repair a later Home repaint without another network call.
scoped('/* Android r294: isolated WWE sync */','/* r295 Raw/SmackDown durable Home rows */',section=>{
 section=one(section,'let pending=null,checkedAt=0,revised=0;',
 'let pending=null,checkedAt=0,revised=0,lastValid=null;','verified result cache');
 const insert=[
 ' // Materialize a missing verified Home card from the authenticated v527',
 ' // user series row, never from a guessed poster or an invented media ID.',
 ' if(continued){',
 "  const target=q(':scope > .stack',continued);",
 '  if(target)for(const id of [4656,1549]){',
 '   if(all(\'.media-row\',home).some(row=>{',
 "    const media=String(row.dataset.media||q('[data-media]',row)?.dataset.media||'');",
 '    const name=normalize(q(\'b\',row)?.textContent);',
 '    return media===\'tv:\'+id||(id===4656?name===\'raw\'||name===\'wwe monday night raw\':name.includes(\'smackdown\'));',
 '   }))continue;',
 '   const record=data.get(id),episode=latest.get(id)||record?.latest_episode_to_air;',
 '   const status=list(watches).find(x=>Number(x.tmdb_id)===id);',
 '   const air=String(episode?.air_date||\'\').slice(0,10);',
 '   const sn=Number(episode?.season_number),en=Number(episode?.episode_number);',
 '   const age=(Date.parse(today())-Date.parse(air))/86400000;',
 '   if(!record||!(Number(record.media_id)>0)||!status||',
 '      !Number.isFinite(age)||age<0||age>16||',
 '      !(sn>0&&en>0)||watchSet(watches,id).has(sn+\':\'+en))continue;',
 '   const holder=document.createElement(\'div\');',
 '   holder.innerHTML=homeSeriesRow158({...record,home_bucket:\'continue\'});',
 "   const row=holder.querySelector('.home-action-row');if(!row)continue;",
 '   row.dataset.ct301VerifiedWwe=String(id);',
 '   target.appendChild(row);',
 "   q(':scope > .empty',target)?.remove();",
 '   const count=q(\'.panel-head small\',continued);',
 "   if(count)count.textContent=String(all(':scope > .home-action-row,:scope > .media-row',target).length);",
 '   changes++;',
 '  }',
 ' }'
 ].join('\n')+'\n';
 section=one(section,' revised+=changes;\n document.documentElement.dataset.ct294RecentWwe=String(revised);',
 insert+' revised+=changes;\n document.documentElement.dataset.ct294RecentWwe=String(revised);','rehydrate first paint');
 section=one(section,'   patch(homeRows,result,watched);\n   return result;',
 '   lastValid={rows:homeRows,result,watches:watched,account:String(session?.user?.id||user?.id),at:Date.now()};\n   patch(homeRows,result,watched);\n   return result;','remember audited result');
 section=one(section,'window.__ctR294Wwe={sync,patch,watchSet,today,getUpdates:()=>revised};',
 "const restoreCached=()=>{const id=String(session?.user?.id||user?.id);return active()&&lastValid?.account===id&&Date.now()-lastValid.at<1800000?patch(lastValid.rows,lastValid.result,lastValid.watches):0};\n"+
 "document.addEventListener('click',event=>{\n"+
 " const row=event.target?.closest?.('.home-action-row');\n"+
 " const media=String(row?.querySelector?.('.media-row')?.dataset?.media||'');\n"+
 " if(event.target?.closest?.('button')&&/^(tv:4656|tv:1549)$/.test(media)){\n"+
 "  lastValid=null;checkedAt=0;\n"+
 " }\n"+
 "},true);\n"+
 'window.__ctR294Wwe={sync,patch,watchSet,today,restoreCached,getUpdates:()=>revised};','cache/invalidations');
 return section;
},'WWE authenticated fallback');

// Guard r296 retained nodes against inactivity expiry and apply the r294
// verified cache AFTER a Home repaint. Never reinsert a row after a watched
// action because the cache and retained node are invalidated by that action.
scoped('/* r295 Raw/SmackDown durable Home rows */','boot();',section=>{
 section=one(section,'  if(node.dataset.ct296Retained)continue;',
 '  if(node.dataset.ct296Retained){const saved=snapshots.get(id);if(saved?.node===node)saved.verifiedAt=Date.now();continue;}',
 'refresh observed retained row lifetime');
 section=one(section,' if(active()){repair();attach();queueMicrotask(schedule)}',
 ' if(active()){repair();try{window.__ctR294Wwe?.restoreCached?.()}catch{}attach();queueMicrotask(schedule)}',
 'restore valid server-backed rows');
 return section;
},'WWE real DOM owner');

js=js.replaceAll('CineTracker • v1.0.58','CineTracker • v1.0.59')
 .replaceAll("JSON.stringify({version:'1.0.58',revision:REVISION","JSON.stringify({version:'1.0.59',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.58'","window.__ctAndroidRelease='1.0.59'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r301-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1058','ct-android-v1059').replaceAll('content="1.0.58"','content="1.0.59"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_59_READY: Sports only Previous/Upcoming; r290 redundant repaint loop removed; fresh slots share no-repeat memory; authenticated missing WWE rows restored on first paint or later; Web and database untouched.');
