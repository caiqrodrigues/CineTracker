import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v159.js'),'utf8'),
  readFile(resolve(dist,'app-v159.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

if(!js.includes("const REVISION='r159-sports-watch';"))throw new Error('r160 requires r159 single-runtime base');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('r160 single authority missing');
if(!js.includes('\nasync function globalSearch'))throw new Error('r160 insertion point missing');
if(!html.includes('/app-v159.js?ct=r159-sports-watch'))throw new Error('r160 base script tag missing');
if(!html.includes('/app-v159.css?ct=r159-sports-watch'))throw new Error('r160 base stylesheet tag missing');

js=js.replace("const REVISION='r159-sports-watch';","const REVISION='r160-sports-recent-history-order';");

const r160=String.raw`
/* r160 recent sports + explicit watched time + hidden Home history newest-first */
const paintHome159For160=paintHome;
paintHome=function(){
  const p=homeCache;
  if(!p||typeof p!=='object')return paintHome159For160();
  const episodes=p.history_episodes,movies=p.history_movies;
  if(Array.isArray(episodes))p.history_episodes=[...episodes].reverse();
  if(Array.isArray(movies))p.history_movies=[...movies].reverse();
  try{return paintHome159For160()}finally{
    if(Array.isArray(episodes))p.history_episodes=episodes;
    if(Array.isArray(movies))p.history_movies=movies;
  }
};

sportsPayload=async function(force=false){
  if(!force&&sportsCache)return sportsCache;
  const from=new Date(shiftDays(-7)+'T00:00:00'),to=new Date(shiftDays(9)+'T00:00:00');
  sportsCache=await rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});
  if(!sportsCache||typeof sportsCache!=='object')sportsCache={sports:[],events:[],favorites:[],watch_history:[],stats:{watched_events:0,sports_minutes:0},preferences:{}};
  if(!sportsCache.stats)sportsCache.stats=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  if(!Array.isArray(sportsCache.watch_history))sportsCache.watch_history=[];
  return sportsCache;
};

sportsFiltered=function(p){
  let a=sportsState.tab==='watched'?(Array.isArray(p.watch_history)?p.watch_history:[]):(Array.isArray(p.events)?p.events:[]);
  if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);
  if(sportsState.tab==='today')a=a.filter(x=>new Date(x.starts_at).toLocaleDateString('sv-SE')===localDay());
  if(sportsState.tab==='recent'){
    const lo=shiftDays(-7),hi=localDay();
    a=a.filter(x=>{const d=new Date(x.starts_at).toLocaleDateString('sv-SE');return d>=lo&&d<hi})
      .sort((x,y)=>new Date(y.starts_at)-new Date(x.starts_at));
  }
  if(sportsState.tab==='live')a=a.filter(x=>x.status==='live');
  if(sportsState.tab==='favorites')a=a.filter(x=>x.has_favorite);
  if(sportsState.tab==='watched')a=[...a].sort((x,y)=>new Date(y.sport_watched_at||0)-new Date(x.sport_watched_at||0));
  return a;
};

const paintSports159For160=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports159For160(p);
  const h=$('[data-sports]');if(!h)return;
  const stats=p.stats||{},minutes=Math.max(0,Number(stats.sports_minutes||0)),watched=Math.max(0,Number(stats.watched_events||0));
  const summary=[...h.querySelectorAll('.sports-summary .stat')];
  const timeCard=summary.find(x=>x.querySelector('small')?.textContent?.trim()==='Tempo esportes');
  if(timeCard){const s=timeCard.querySelector('small');if(s)s.textContent='Tempo assistido'}
  const tabs=h.querySelector('.tabs');
  if(tabs&&!tabs.querySelector('[data-sports-tab="recent"]')){
    const today=tabs.querySelector('[data-sports-tab="today"]');
    const b=document.createElement('button');b.className='chip '+(sportsState.tab==='recent'?'active':'');b.dataset.sportsTab='recent';b.textContent='Recentes';
    today?.insertAdjacentElement('afterend',b);
  }
  if(sportsState.tab==='recent'){
    const sections=[...h.querySelectorAll('section.panel')],last=sections.at(-1),title=last?.querySelector('.panel-head h2');
    if(title)title.textContent='Últimos 7 dias';
  }
  const first=h.querySelector(':scope > .panel');
  if(first&&!h.querySelector('[data-sports-time-banner]')){
    const banner=document.createElement('div');banner.className='sports-time-banner';banner.dataset.sportsTimeBanner='1';
    banner.innerHTML='<span>⏱ Tempo esportivo assistido</span><b>'+sportMinutes159(minutes)+'</b><small>'+watched+' evento'+(watched===1?'':'s')+' marcado'+(watched===1?'':'s')+' · este tempo já entra no Tempo total do Perfil</small>';
    first.insertAdjacentElement('afterend',banner);
  }
};

syncSports=async function(force){
  if(sportsState.syncing)return;
  sportsState.syncing=true;paintSports();
  try{
    const p=sportsCache||{},fav=p.preferences?.favorite_sports||['soccer','formula_1','mma','basketball','american_football','ice_hockey'];
    await edge('ct-sports-sync',{action:'sync',date_from:shiftDays(-7),date_to:shiftDays(-1),sports:fav,force},50000);
    await edge('ct-sports-sync',{action:'sync',date_from:localDay(),date_to:shiftDays(2),sports:fav,force},50000);
    sportsCache=null;await sportsPayload(true);paintSports();
  }catch(e){toast('Esportes: '+(e?.message||e))}finally{sportsState.syncing=false;paintSports()}
};

const renderProfile159For160=renderProfile;
renderProfile=async function(seq){
  await renderProfile159For160(seq);
  if(seq!==navSeq||route()!=='profile')return;
  const root=$('[data-profile]');if(!root)return;
  const ss=profileCache?.sports_stats||await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0}));
  const minutes=Math.max(0,Number(ss?.sports_minutes||0)),watched=Math.max(0,Number(ss?.watched_events||0));
  const existing=[...root.querySelectorAll('.stat small')].find(x=>x.textContent?.trim()==='Tempo em esportes');
  if(existing)existing.textContent='Tempo esportivo assistido';
  if(!root.querySelector('[data-profile-sports-panel]')){
    const panel=document.createElement('section');panel.className='panel sports-profile-panel';panel.dataset.profileSportsPanel='1';
    panel.innerHTML='<div class="panel-head"><h2>Esportes assistidos</h2><small>só conta quando você marca ✓ Assistido</small></div><div class="sports-profile-time"><div><small>Tempo assistido</small><b>'+fmtMinutes(minutes)+'</b></div><div><small>Eventos assistidos</small><b>'+watched.toLocaleString('pt-BR')+'</b></div><p>O Tempo total acima já inclui filmes + séries + esportes assistidos.</p></div>';
    const first=root.querySelector('.panel');first?.insertAdjacentElement('afterend',panel);
  }
};
`;

js=js.replace('\nasync function globalSearch',r160+'\nasync function globalSearch');

css+=String.raw`
/* r160 sports recent/time visibility + Home history order */
.sports-time-banner{border:1px solid #315f78;background:linear-gradient(135deg,#07141d,#0b2230);border-radius:14px;padding:10px 13px;display:grid;grid-template-columns:auto auto minmax(0,1fr);gap:10px;align-items:center}.sports-time-banner span{font-size:10px;color:#8fc8e8}.sports-time-banner b{font-size:18px}.sports-time-banner small{font-size:8px;color:#7f9aaa}.sports-profile-time{display:grid;grid-template-columns:repeat(2,minmax(0,190px)) minmax(220px,1fr);gap:10px;align-items:center}.sports-profile-time>div{border:1px solid #203f52;background:#08151d;border-radius:12px;padding:10px}.sports-profile-time small{display:block;color:#7e9aaa;font-size:8px}.sports-profile-time b{display:block;font-size:18px;margin-top:4px}.sports-profile-time p{margin:0;color:#8fa8b6;font-size:9px}@media(max-width:700px){.sports-time-banner{grid-template-columns:1fr auto}.sports-time-banner small{grid-column:1/-1}.sports-profile-time{grid-template-columns:1fr 1fr}.sports-profile-time p{grid-column:1/-1}}
`;

html=html.replace('/app-v159.js?ct=r159-sports-watch','/app-v160.js?ct=r160-sports-recent-history-order').replace('/app-v159.css?ct=r159-sports-watch','/app-v160.css?ct=r160-sports-recent-history-order');
sw=sw.replace(/ct-web-0\.99\.7-r159-sports-watch/g,'ct-web-0.99.7-r160-sports-recent-history-order');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v160.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v160.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v159.js'),{force:true}),rm(resolve(dist,'app-v159.css'),{force:true})]);
console.log('WEB_R160_BUILT runtime=single sports=recent7+explicit-time home=history-newest-first');
