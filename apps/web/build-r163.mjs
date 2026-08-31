import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const run=spawnSync(process.execPath,[resolve(root,'build-r162.mjs')],{cwd:root,stdio:'inherit'});
if(run.status!==0)process.exit(run.status||1);
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v162.js'),'utf8'),
  readFile(resolve(dist,'app-v162.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const marker="const REVISION='r162-home-discover-sports';";
if(!js.includes(marker))throw new Error('r163 base revision missing');
js=js.replaceAll('r162-home-discover-sports','r163-sports-atomic-discover-home');
const r163=String.raw`
/* r163: sports atomic snapshot + deterministic yesterday + discover cache stability */
window.__ctR163='sports-atomic-snapshot-discover-stable';

function mergeSportsEvents163(...payloads){
  const map=new Map();
  for(const p of payloads){
    for(const e of (p?.events||[])){
      const provider=String(e?.provider||'').toLowerCase();
      const pid=String(e?.provider_event_id||e?.id||'');
      const h=norm(e?.home_name||''),a=norm(e?.away_name||'');
      const day=new Date(e?.starts_at||0).toLocaleDateString('sv-SE');
      const key=provider&&pid?provider+'|'+pid:e?.sport_slug+'|'+day+'|'+[h,a].sort().join('|');
      const old=map.get(key);
      if(!old){map.set(key,e);continue}
      const score=e?.is_watched?100:0;
      const oldScore=old?.is_watched?100:0;
      if(score>oldScore || (!old?.home_logo&&e?.home_logo) || (!old?.competition_logo&&e?.competition_logo))map.set(key,{...old,...e});
    }
  }
  return [...map.values()].sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
}

const sportsPayload162For163=sportsPayload;
sportsPayload=async function(force=false){
  if(!force&&sportsCache)return sportsCache;
  const from=new Date(shiftDays(-7)+'T00:00:00'),to=new Date(shiftDays(9)+'T00:00:00');
  const fresh=await rpc('cinetracker_sports_payload_v1',{p_from:from.toISOString(),p_to:to.toISOString()});
  const base=(fresh&&typeof fresh==='object')?fresh:{sports:[],events:[],favorites:[],watch_history:[],stats:{watched_events:0,sports_minutes:0},preferences:{}};
  base.events=mergeSportsEvents163(base);
  if(!base.stats)base.stats=await rpc('cinetracker_sport_stats_v1',{}).catch(()=>({watched_events:0,sports_minutes:0,by_sport:[]}));
  if(!Array.isArray(base.watch_history))base.watch_history=[];
  sportsCache=base;
  return sportsCache;
};

const sportsFiltered162For163=sportsFiltered;
sportsFiltered=function(p){
  let rows=sportsFiltered162For163(p)||[];
  const yesterday=shiftDays(-1);
  if(sportsState.tab==='yesterday')rows=rows.filter(e=>new Date(e.starts_at).toLocaleDateString('sv-SE')===yesterday).sort((a,b)=>new Date(b.starts_at)-new Date(a.starts_at));
  if(sportsState.tab==='recent')rows=rows.filter(e=>{const d=new Date(e.starts_at).toLocaleDateString('sv-SE');return d>=shiftDays(-7)&&d<localDay()}).sort((a,b)=>new Date(b.starts_at)-new Date(a.starts_at));
  return rows;
};

const paintSports162For163=paintSports;
paintSports=function(p=sportsCache||{}){
  paintSports162For163(p);
  const h=$('[data-sports]');if(!h)return;
  const tabs=h.querySelector('.tabs');
  if(tabs){
    const wanted=[['recent','Recentes'],['yesterday','Ontem']];
    for(const [k,label] of wanted){if(!tabs.querySelector('[data-sports-tab="'+k+'"])){const b=document.createElement('button');b.className='chip '+(sportsState.tab===k?'active':'');b.dataset.sportsTab=k;b.textContent=label;tabs.appendChild(b)}}
    tabs.style.cssText+=';display:flex;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;max-width:100%;scrollbar-width:thin;';
  }
  if(sportsState.tab==='yesterday'||sportsState.tab==='recent'){
    const sections=[...h.querySelectorAll('section.panel')],last=sections.at(-1),title=last?.querySelector('.panel-head h2');
    if(title)title.textContent=sportsState.tab==='yesterday'?'Jogos de ontem':'Últimos 7 dias';
  }
};

const syncSports162For163=syncSports;
syncSports=async function(force=false){
  if(sportsState.syncing)return;
  sportsState.syncing=true;paintSports();
  try{
    const sports=sportsList162();
    const yesterday=shiftDays(-1),today=localDay();
    /* date-scoped calls are intentionally sequential: one provider refresh cannot overwrite another date snapshot */
    await edge('ct-sports-sync',{action:'sync',date_from:yesterday,date_to:yesterday,sports,force:true},90000);
    await edge('ct-sports-sync',{action:'sync',date_from:today,date_to:today,sports,force:true},90000);
    sportsCache=null;
    await sportsPayload(true);
    paintSports();
  }catch(e){toast('Esportes: '+(e?.message||e))}
  finally{sportsState.syncing=false;paintSports()}
};

const renderSports162For163=renderSports;
renderSports=async function(seq){
  await renderSports162For163(seq);
  if(seq!==navSeq||route()!=='sports')return;
  const count=(sportsCache?.events||[]).filter(e=>new Date(e.starts_at).toLocaleDateString('sv-SE')===shiftDays(-1)).length;
  if(count<10&&!sessionStorage.getItem('ct:r163:yesterday:recovery:'+shiftDays(-1))){
    sessionStorage.setItem('ct:r163:yesterday:recovery:'+shiftDays(-1),'1');
    void (async()=>{try{
      sportsState.syncing=true;paintSports();
      await edge('ct-sports-sync',{action:'sync',date_from:shiftDays(-1),date_to:shiftDays(-1),sports:sportsList162(),force:true},90000);
      sportsCache=null;await sportsPayload(true);paintSports();
    }catch(e){toast('Recuperação de ontem: '+(e?.message||e))}finally{sportsState.syncing=false;paintSports()}})();
  }
};

/* Do not invalidate the already-rendered Discover content while switching tabs; keep per-tab promises until resolved. */
const discoverRows162For163=discoverRows;
discoverRows=async function(tab){
  const key='r163:'+tab+':'+localDay();
  if(discoverCache.has(key))return discoverCache.get(key);
  const promise=discoverRows162For163(tab);
  discoverCache.set(key,promise);
  try{return await promise}catch(e){discoverCache.delete(key);throw e}
};
`;
js=js.replace('\nasync function globalSearch',r163+'\nasync function globalSearch');
css+=String.raw`
/* r163 */
[data-page="sports"] .tabs,[data-page="sports"] .filters{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap;max-width:100%;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
[data-page="sports"] .tabs>.chip,[data-page="sports"] .filters>.chip{flex:0 0 auto}
`;
html=html.replaceAll('app-v162.js','app-v163.js').replaceAll('app-v162.css','app-v163.css');
sw=sw.replaceAll('app-v162.js','app-v163.js').replaceAll('app-v162.css','app-v163.css').replaceAll('r162-home-discover-sports','r163-sports-atomic-discover-home');
const release={version:'0.99.7',revision:'r163-sports-atomic-discover-home',runtime:'single-clean-runtime',generated_at:new Date().toISOString()};
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v163.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v163.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release),'utf8')
]);
console.log('WEB_R163_READY sports=atomic+forced-yesterday discover=stable-cache home=preserved');
