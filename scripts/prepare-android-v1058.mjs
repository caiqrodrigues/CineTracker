import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1057.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const marker='<script data-ct-android="r299-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw Error('Android 1.0.57 runtime missing');
let js=html.slice(a+marker.length,b);
function once(s,from,to,label){const count=s.split(from).length-1;if(count!==1)throw Error('r300 '+label+': expected 1 match, found '+count);return s.replace(from,to)}
function scoped(begin,end,edit,label){const a=js.indexOf(begin),b=js.indexOf(end,a+begin.length);if(a<0||b<=a)throw Error('r300 missing scope '+label);const old=js.slice(a,b),next=edit(old);if(old===next)throw Error('r300 unchanged '+label);js=js.slice(0,a)+next+js.slice(b)}
js=once(js,"const REVISION='r299-android-official-1.0.57';","const REVISION='r300-android-official-1.0.58';",'revision');
js=once(js,"window.__ctWebBuild='1.0.57';window.__ctOfficialVersion='1.0.57';window.__ctAndroidOfficialVersion='1.0.57';window.__ctAndroidOfficialCode=10099;",
 "window.__ctWebBuild='1.0.58';window.__ctOfficialVersion='1.0.58';window.__ctAndroidOfficialVersion='1.0.58';window.__ctAndroidOfficialCode=10100;",'version metadata');

// Sports: change only top-level tabs and event segmentation. Keep F1 Hub,
// watched actions, providers, history, favorites and sport filters unchanged.
js=once(js,"let sportsState={tab:'today',sport:'all',syncing:false,provider:null};",
 "let sportsState={tab:'upcoming',sport:'all',syncing:false,provider:null};",'sports default');
js=once(js,"[['today','Hoje'],['live','Ao vivo'],['calendar','Calendário'],['favorites','Favoritos'],['watched','Assistidos']]",
 "[['previous','Anteriores'],['upcoming','Próximos'],['favorites','Favoritos']]",'sports tabs');
js=once(js,"sportsState.tab==='watched'?'Histórico assistido':'Próximos eventos';",
 "sportsState.tab==='watched'?'Histórico assistido':sportsState.tab==='previous'?'Eventos anteriores':'Próximos eventos';",'sports title');
scoped('/* r160 recent sports + explicit watched time','let releaseCheckBusy161=',section=>{
 const oldFilter="sportsFiltered=function(p){\n  if(sportsState.tab==='yesterday'){";
 const fresh=[
 'function ct300SportsRange(p){',
 ' const all=Array.isArray(p?.events)?p.events:[];',
 " const sport=sportsState.sport,now=Date.now(),previous=sportsState.tab==='previous';",
 ' return all.filter(e=>{',
 "  if(sport!=='all'&&e.sport_slug!==sport)return false;",
 "  const ms=Date.parse(e.starts_at||'');if(!Number.isFinite(ms))return false;",
 "  const finished=e.status==='finished',live=e.status==='live';",
 '  return previous?(finished||(!live&&ms<now)):(!finished&&(live||ms>=now));',
 ' }).sort((x,y)=>previous?Date.parse(y.starts_at)-Date.parse(x.starts_at):Date.parse(x.starts_at)-Date.parse(y.starts_at));',
 '}',
 'sportsFiltered=function(p){',
 " if(sportsState.tab==='previous'||sportsState.tab==='upcoming')return ct300SportsRange(p);",
 " if(sportsState.tab==='yesterday'){"
 ].join('\n');
 section=once(section,oldFilter,fresh,'previous/upcoming event date');
 for(const legacy of ['recent','yesterday']){
  const regex=new RegExp("  const tabs=h.querySelector\\('\\.tabs'\\);\\n  if\\(tabs&&!tabs.querySelector\\('\\[data-sports-tab=\\\""+legacy+"\\\"\\]'\\)\\)\\{[\\s\\S]*?\\n  \\}\\n");
  if(!regex.test(section))throw Error('r300 legacy sports tab '+legacy+' not found');
  section=section.replace(regex,'');
 }
 return section;
},'sport tab sources');

// Pra Você: weighted random among v525-authorized choices, session/day
// exclusion remains authoritative. Neither Watchlist nor seen filters change.
scoped('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.','/* CineTracker Android 1.0.37/r279',section=>{
 const weighted=[
 'function ct300Random(){',
 ' try{const n=new Uint32Array(1);globalThis.crypto.getRandomValues(n);return n[0]/4294967296}catch{return Math.random()}',
 '}',
 'function ct300Weight(x){',
 ' const rating=Math.max(0,Math.min(10,Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0));',
 ' const votes=Math.max(0,Number(x?.vote_count??x?.raw_tmdb?.vote_count??0)||0);',
 ' return 1+Math.max(0,rating-4)*0.45+Math.min(2,Math.log1p(votes)/6);',
 '}',
 'function ct300Choice(rows){',
 ' if(!rows?.length)return null;',
 ' const weights=rows.map(ct300Weight),sum=weights.reduce((a,b)=>a+b,0);',
 ' let r=ct300Random()*sum;',
 ' for(let i=0;i<rows.length;i++){r-=weights[i];if(r<0)return rows[i]}',
 ' return rows[rows.length-1];',
 '}'
 ].join('\n')+'\n';
 section=once(section,'function candidates(key,current){',weighted+'function candidates(key,current){','weighted options');
 section=once(section,'return options[0]||null;','return ct300Choice(options);','random swap');
 const ca=section.indexOf('  let candidate=usable.find(x=>mediaRef(x)===override)||');
 const cb=section.indexOf('  if(!candidate){',ca);
 if(ca<0||cb<ca)throw Error('r300 first candidate logic missing');
 section=section.slice(0,ca)+[
 '  let candidate=usable.find(x=>mediaRef(x)===override)||',
 '   usable.find(x=>mediaRef(x)===mediaIn(slot))||',
 '   ct300Choice(usable.filter(x=>!seenIn(key).has(mediaRef(x))&&!blockedMemory(key,x)))||null;',''
 ].join('\n')+section.slice(cb);
 return section;
},'foryou selection');

// Exact chronological continuation after highest watched episode. WWE
// weekly shows use newest RELEASED episode instead of historic episode 14.
scoped('/* r176 —','/* r177 —',section=>{
 const a=section.indexOf('async function ct176ReleasedUnwatched(showId,watched,limit=6){');
 const b=section.indexOf('async function ct176PrimeWithWatched(',a);
 if(a<0||b<a)throw Error('r300 canonical next episode function not found');
 const fn=[
 'async function ct176ReleasedUnwatched(showId,watched,limit=6){',
 ' showId=Number(showId);if(!(showId>0))return[];',
 " const today=localDay(),show=await tmdb('/tv/'+showId);",
 ' const seen=watched instanceof Set?watched:new Set(watched||[]);',
 ' const isWwe=showId===4656||showId===1549;',
 " const episode=row=>({season:Number(row?.season_number||0),episode:Number(row?.episode_number||0),title:row?.name||null,runtime:Number(row?.runtime||0)||null,status:show?.status||null,vote_average:Number(row?.vote_average||0),air_date:String(row?.air_date||'').slice(0,10)});",
 " const current=show?.last_episode_to_air,air=String(current?.air_date||'').slice(0,10);",
 " const fresh=air&&air<=today&&Date.parse(today+'T12:00:00Z')-Date.parse(air+'T12:00:00Z')<=21*86400000;",
 ' const latest=episode(current),latestKey=ct176EpisodeKey(latest.season,latest.episode);',
 ' if(isWwe)return fresh&&latest.season>0&&latest.episode>0&&!seen.has(latestKey)?[latest]:[];',
 " const last=[...seen].map(k=>String(k).split(':').map(Number)).filter(v=>v.length===2&&v[0]>0&&v[1]>0).sort((a,b)=>b[0]-a[0]||b[1]-a[1])[0]||null;",
 ' const seasons=(show?.seasons||[]).filter(s=>Number(s.season_number)>0).sort((a,b)=>Number(a.season_number)-Number(b.season_number));',
 ' const out=[];',
 ' async function scan(onlyAfter){',
 '  for(const s of seasons){',
 '   const sn=Number(s.season_number);if(onlyAfter&&last&&sn<last[0])continue;',
 '   let sd;try{sd=await ct172Season(showId,sn)}catch{continue}',
 '   const episodes=(sd?.episodes||[]).filter(ep=>{',
 "    const en=Number(ep?.episode_number||0),date=String(ep?.air_date||'').slice(0,10);",
 '    if(!(en>0&&date&&date<=today))return false;',
 '    if(onlyAfter&&last&&(sn<last[0]||(sn===last[0]&&en<=last[1])))return false;',
 '    return !seen.has(ct176EpisodeKey(sn,en));',
 '   }).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number));',
 '   for(const raw of episodes){out.push({...episode(raw),season:sn});if(out.length>=limit)return true}',
 '  }',
 '  return false;',
 ' }',
 ' if(await scan(true))return out;',
 ' if(out.length)return out;',
 ' if(!isWwe)await scan(false);',
 ' return out;',
 '}',''
 ].join('\n');
 return section.slice(0,a)+fn+section.slice(b);
},'canonical episode queue');

js=js.replaceAll('CineTracker • v1.0.57','CineTracker • v1.0.58')
 .replaceAll("JSON.stringify({version:'1.0.57',revision:REVISION","JSON.stringify({version:'1.0.58',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.57'","window.__ctAndroidRelease='1.0.58'");
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r300-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1057','ct-android-v1058').replaceAll('content="1.0.57"','content="1.0.58"');
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_58_READY: only Anteriores/Proximos/Favoritos sports tabs; eligible weighted nonrepeating Trocar; canonical next after latest watched, WWE prioritizes recent aired. Web and Supabase unchanged.');
