import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v126-v0997-video3124-recovery.js';
const source=resolve(root,'apps/web',patch);

const oldCss='#ct120-profile [data-ct120-slot="series"] .ct120-row,#ct120-profile [data-ct120-slot="movies"] .ct120-row,.ct126-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(128px,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;max-width:100%!important;width:100%!important;overflow-x:hidden!important;gap:10px!important}.ct126-more{';
const newCss=`#ct43-profile{display:none!important}\n#ct120-profile [data-ct120-slot="series"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="movies"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="series-favorites"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="movie-favorites"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="actors"] .ct120-actor:nth-child(n+5),#ct118-profile .ct118-section .ct118-card:nth-child(n+5),#ct118-profile .ct118-actors .ct118-actor:nth-child(n+5){display:none!important}\n#ct120-profile .ct126-profile-grid.ct126-expanded .ct120-card:nth-child(n+5),#ct120-profile .ct126-profile-grid.ct126-expanded .ct120-actor:nth-child(n+5),#ct118-profile .ct126-profile-grid.ct126-expanded .ct118-card:nth-child(n+5),#ct118-profile .ct126-profile-grid.ct126-expanded .ct118-actor:nth-child(n+5){display:block!important}\n.ct126-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(128px,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;max-width:100%!important;width:100%!important;overflow-x:hidden!important;gap:10px!important}.ct126-more{`;
const oldMobile='@media(max-width:720px){#ct120-profile [data-ct120-slot="series"] .ct120-row,#ct120-profile [data-ct120-slot="movies"] .ct120-row,.ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}';
const newMobile='@media(max-width:720px){.ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}';
const oldRemove="function removeStandaloneHistory(){if(route()!=='profile')return;const content=$$('.content').filter(visible).at(-1);";
const newRemove="function removeStandaloneHistory(){if(route()!=='profile')return;document.getElementById('ct43-profile')?.remove();const content=$$('.content').filter(visible).at(-1);";
const oldApply="function applyFourMore(name){const sec=findProfileSection(name);if(!sec)return;const row=sec.querySelector('.ct120-row,.ct118-row');if(!row)return;row.classList.add('ct126-profile-grid');const cards=[...row.children].filter(x=>x.matches?.('.ct120-card,.ct118-card'));if(!cards.length)return;row.querySelectorAll(':scope > .ct124-more,:scope > .ct122-more-card,:scope > .ct126-more').forEach(x=>x.remove());cards.forEach((c,i)=>{c.hidden=i>=4});if(cards.length<=4)return;const more=document.createElement('button');more.type='button';more.className='ct126-more';more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-4}</small></span>`;let open=false;more.onclick=()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=4});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':`+${cards.length-4}`};row.appendChild(more)}";
const newApply="function applyFourMore(name){const sec=findProfileSection(name);if(!sec)return;const row=sec.querySelector('.ct120-row,.ct118-row,.ct120-actors,.ct118-actors');if(!row)return;row.classList.add('ct126-profile-grid');const cards=[...row.children].filter(x=>x.matches?.('.ct120-card,.ct118-card,.ct120-actor,.ct118-actor'));if(!cards.length)return;const signature=String(cards.length);const existing=row.querySelector(':scope > .ct126-more');if(row.dataset.ct126Four===signature&&(cards.length<=4||existing))return;row.querySelectorAll(':scope > .ct124-more,:scope > .ct122-more-card,:scope > .ct126-more').forEach(x=>x.remove());row.classList.remove('ct126-expanded');cards.forEach((c,i)=>{c.hidden=i>=4});row.dataset.ct126Four=signature;if(cards.length<=4)return;const actorMode=cards.some(x=>x.matches?.('.ct120-actor,.ct118-actor'));const more=document.createElement('button');more.type='button';more.className='ct126-more'+(actorMode?' ct126-more-actor':'');more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-4}</small></span>`;let open=false;more.onclick=()=>{open=!open;row.classList.toggle('ct126-expanded',open);cards.forEach((c,i)=>{c.hidden=!open&&i>=4});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':`+${cards.length-4}`};row.appendChild(more)}";
const oldCleanup="function cleanupProfile(){if(route()!=='profile')return;removeStandaloneHistory();applyFourMore('Séries');applyFourMore('Filmes')}";
const newCleanup="function cleanupProfile(){if(route()!=='profile')return;removeStandaloneHistory();applyFourMore('Séries');applyFourMore('Filmes');applyFourMore('Séries Favoritas');applyFourMore('Filmes Favoritos');applyFourMore('Atores Favoritos')}";

const legacy43Run="function run(){if(!currentUser)return;insertProfileBlocks();hydrateAll();if(typeof view!=='undefined'&&view==='settings')document.body.classList.add('ct43-settings-fix');else document.body.classList.remove('ct43-settings-fix')}";
const fixed43Run="function run(){if(!currentUser)return;document.getElementById('ct43-profile')?.remove();hydrateAll();if(typeof view!=='undefined'&&view==='settings')document.body.classList.add('ct43-settings-fix');else document.body.classList.remove('ct43-settings-fix')}";
const legacy44Run="function run(){if(!currentUser)return;enhanceProfile();$$('[data-view=\"stats\"]').forEach(x=>x.remove());$$('[data-view=\"account\"]').forEach(x=>{x.dataset.view='settings';x.textContent=x.closest('.mobile-nav')?'Config.':'⚙ Configurações'})}";
const fixed44Run="function run(){if(!currentUser)return;$$('[data-view=\"stats\"]').forEach(x=>x.remove());$$('[data-view=\"account\"]').forEach(x=>{x.dataset.view='settings';x.textContent=x.closest('.mobile-nav')?'Config.':'⚙ Configurações'})}";

const legacy99Nav="window.ct98Navigate=function(target){const t=target==='history'?'profile':target;if(t==='profile')return renderProfile99();return typeof previousNavigate99==='function'?previousNavigate99(t):false};\nwindow.ct99RenderProfile=renderProfile99;\nwindow.ct99RefreshProfile=async()=>{if(currentCollection99)return renderCollection99(currentCollection99);if($99('#ct99-profile'))return fillProfile99();return fetch99()};";
const fixed99Nav="window.ct98Navigate=function(target){const t=target==='history'?'profile':target;return typeof previousNavigate99==='function'?previousNavigate99(t):false};\nwindow.ct99RenderProfile=()=>false;\nwindow.ct99RefreshProfile=async()=>false;";
const legacy99Delayed="setTimeout(()=>{let v='';try{v=String(view||'')}catch{}if(v==='profile'||v==='history')renderProfile99()},180);";
const fixed99Delayed="/* v0.99.7: ct99 Profile takeover disabled; v120 is authoritative. */";

const oldBuckets994="function buckets994(p){\n  const s=Array.isArray(p.series)?p.series:[];\n  return {cont:s.filter(x=>x.home_bucket==='continue'),dust:s.filter(x=>x.home_bucket==='dust'),up:s.filter(x=>x.home_bucket==='up_to_date'),watch:s.filter(x=>x.home_bucket==='not_started'),done:s.filter(x=>x.home_bucket==='completed')};\n}";
const newBuckets994="function buckets994(p){\n  const s=Array.isArray(p.series)?p.series:[];\n  const released=x=>Number(x?.released_episodes||0),seen=x=>Number(x?.watched_episodes||0),caught=x=>released(x)>0&&seen(x)>=released(x);\n  return {cont:s.filter(x=>x.home_bucket==='continue'&&!caught(x)),dust:s.filter(x=>x.home_bucket==='dust'),up:s.filter(x=>x.home_bucket==='up_to_date'||(x.home_bucket==='continue'&&caught(x))),watch:s.filter(x=>x.home_bucket==='not_started'),done:s.filter(x=>x.home_bucket==='completed')};\n}";

const oldFetchProfile120="async function fetchProfile120(force=false){if(profileData120&&!force)return profileData120;profileData120=await rpc120('cinetracker_profile_payload_v0997',{p_tz:(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}})()});return profileData120||{}}";
const newFetchProfile120=`async function fetchProfile120(force=false){if(profileData120&&!force)return profileData120;const tz=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}})();try{profileData120=await rpc120('cinetracker_profile_payload_v0997',{p_tz:tz});return profileData120||{}}catch(primaryError){const [dash,st,ss,activity,actors]=await Promise.all([rpc120('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc120('cinetracker_profile_stats',{}).catch(()=>({})),rpc120('cinetracker_series_state_stats',{}).catch(()=>({})),rpc120('cinetracker_consumption_daily',{p_limit_days:30}).catch(()=>[]),sb120('favorite_actors?select=tmdb_person_id,actor_name,profile_path&order=created_at.desc').catch(()=>[])]);if(!Array.isArray(dash)||!dash.length)throw primaryError;const one=x=>Array.isArray(x)?(x[0]||{}):(x||{}),tvw=dash.filter(x=>x.media_type==='tv'&&x.is_watchlist&&!x.is_completed),mvw=dash.filter(x=>x.media_type==='movie'&&x.is_watchlist&&!x.is_seen),seriesRemaining=tvw.reduce((n,x)=>n+Math.max(0,Number(x.total_episodes||x.raw_tmdb?.number_of_episodes||0)-Number(x.watched_episodes||0))*Number(x.runtime_minutes||x.raw_tmdb?.episode_run_time?.[0]||0),0),movieRemaining=mvw.reduce((n,x)=>n+Number(x.runtime_minutes||x.raw_tmdb?.runtime||0),0);profileData120={dashboard:dash,stats:one(st),series_stats:one(ss),activity:Array.isArray(activity)?activity:[],favorite_actors:Array.isArray(actors)?actors:[],remaining:{watchlist_series:tvw.length,watchlist_movies:mvw.length,watchlist_series_remaining_minutes:seriesRemaining,watchlist_unseen_movie_minutes:movieRemaining},_ct120Fallback:true};return profileData120}}`;
const profileViewportCss=`\n#ct120-page[data-ct120-route="profile"] .content{width:auto!important;max-width:none!important;min-width:0!important;padding-left:clamp(16px,2vw,30px)!important;padding-right:clamp(16px,2vw,30px)!important}\n#ct120-profile,#ct120-profile>.ct120-page{width:100%!important;max-width:none!important;min-width:0!important;margin:0!important}\n#ct120-profile .ct120-section{width:100%!important;max-width:none!important;box-sizing:border-box!important}\n`;

function replaceRequired(js,from,to,label,file){if(!js.includes(from))throw new Error(`${label} missing in ${file}`);return js.replace(from,to)}
function strictPosterRepair(js,file){
  const oldSelect='media?select=id,tmdb_id,media_type,poster_path,raw_tmdb&id=in.(';
  const newSelect='media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb&id=in.(';
  js=replaceRequired(js,oldSelect,newSelect,'Visible poster media select',file);
  const startText="if(need.length){const headers=typeof authHeaders==='function'?{...authHeaders()}:{},token=(()=>{try{return ctSession?.access_token||''}catch{return''}})();";
  const start=js.indexOf(startText),endText='}finally{posterRepairBusy118=false}}',end=js.indexOf(endText,start);
  if(start<0||end<0)throw new Error(`Visible poster legacy enrichment block missing in ${file}`);
  const strict=`if(need.length){for(const c of still){const row=by.get(cardMediaId118(c)),p=missingPosterEl118(c);if(!row||!p)continue;const type=row.media_type==='movie'?'movie':'tv',clean=v=>norm118(String(v||'').replace(/\\s*\\((?:18|19|20)\\d{2}\\)\\s*$/,'')),want=clean(row.title),yr=Number(row.release_year||0),matches=x=>[x?.title,x?.name,x?.original_title,x?.original_name].some(v=>clean(v)===want),cy=x=>year118(x);let d=null,id=Number(row.tmdb_id||row.raw_tmdb?.source_tmdb_id||row.raw_tmdb?.id||0);if(id>0&&want){const x=await api118('/'+type+'/'+id,{}).catch(()=>null);if(x&&matches(x)&&(!yr||cy(x)===yr))d=x}if(!d&&want){const params={query:row.title,include_adult:false,page:1};if(yr)params[type==='movie'?'year':'first_air_date_year']=yr;const s=await api118('/search/'+type,params).catch(()=>null);d=(s?.results||[]).find(x=>matches(x)&&(!yr||cy(x)===yr))||null}if(d?.poster_path){p.style.backgroundImage="url('"+img118(d.poster_path)+"')";p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%'}}}`;
  return js.slice(0,start)+strict+js.slice(end);
}

for(const dir of dirs){
  const legacy91=resolve(dir,'patch-v091-v099-profile-lru.js');
  let legacy91Js=await readFile(legacy91,'utf8');
  legacy91Js=replaceRequired(legacy91Js,legacy99Nav,fixed99Nav,'Profile legacy ct99 nav takeover',legacy91);
  legacy91Js=replaceRequired(legacy91Js,legacy99Delayed,fixed99Delayed,'Profile legacy delayed render',legacy91);
  await writeFile(legacy91,legacy91Js,'utf8');

  const home99=resolve(dir,'patch-v099-v0994-web.js');
  let home99Js=await readFile(home99,'utf8');
  home99Js=replaceRequired(home99Js,oldBuckets994,newBuckets994,'Home zero-remaining bucket fix',home99);
  await writeFile(home99,home99Js,'utf8');

  const v118=resolve(dir,'patch-v118-v0997-authoritative.js');
  let v118Js=await readFile(v118,'utf8');
  v118Js=strictPosterRepair(v118Js,v118);
  await writeFile(v118,v118Js,'utf8');

  const v120=resolve(dir,'patch-v120-v0997-structural-authority.js');
  let v120Js=await readFile(v120,'utf8');
  v120Js=replaceRequired(v120Js,oldFetchProfile120,newFetchProfile120,'Profile resilient fallback loader',v120);
  const styleAnchor='document.getElementById(css.id)?.remove();document.head.appendChild(css);';
  v120Js=replaceRequired(v120Js,styleAnchor,`css.textContent+=${JSON.stringify(profileViewportCss)};\n${styleAnchor}`,'Profile viewport CSS',v120);
  await writeFile(v120,v120Js,'utf8');

  const legacy43=resolve(dir,'patch-v043.js');
  let legacy43Js=await readFile(legacy43,'utf8');
  if(!legacy43Js.includes(legacy43Run))throw new Error(`Profile no-flicker: legacy v043 run hook missing in ${legacy43}`);
  legacy43Js=legacy43Js.replace(legacy43Run,fixed43Run);
  await writeFile(legacy43,legacy43Js,'utf8');

  const legacy44=resolve(dir,'patch-v044.js');
  let legacy44Js=await readFile(legacy44,'utf8');
  if(!legacy44Js.includes(legacy44Run))throw new Error(`Profile no-flicker: legacy v044 run hook missing in ${legacy44}`);
  legacy44Js=legacy44Js.replace(legacy44Run,fixed44Run);
  await writeFile(legacy44,legacy44Js,'utf8');

  const out=resolve(dir,patch);
  await copyFile(source,out);
  let js=await readFile(out,'utf8');
  for(const [from,to,label] of [[oldCss,newCss,'profile immediate css'],[oldMobile,newMobile,'mobile grid css'],[oldRemove,newRemove,'legacy profile removal'],[oldApply,newApply,'idempotent four-plus-more function'],[oldCleanup,newCleanup,'all profile card sections']]){
    if(!js.includes(from))throw new Error(`Video3124 profile transform missing: ${label}`);
    js=js.replace(from,to);
  }
  await writeFile(out,js,'utf8');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patch.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>';
  if(!html.includes(anchor))throw new Error(`Video3124 recovery: v125 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: Perfil autoritativo/full-width, Home sem Faltam 0 e capas com resolução estrita.');
