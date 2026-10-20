/* Web 0.3.69/r542: ONLY Raw and SmackDown live episode updates.
   No full document or Home reload, no recomputation of any unrelated card. */
(()=>{'use strict';
if(window.__ctR542Wwe)return;
const core=()=>window.__ctCoreR471;
const home=()=>core()?.route?.()==='home';
const stamp='ct542:wwe-sync:performed';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const recents={4656:'Raw',1549:'SmackDown'};
let pending=null,checkedAt=0,calls=0;
const asRows=v=>Array.isArray(v)?v:Array.isArray(v?.rows)?v.rows:[];
const today=()=>new Intl.DateTimeFormat('en-CA',{
 timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'
}).format(new Date());
function recentEpisode(row){
 const aired=String(row?.next_episode_air_date||'').slice(0,10);
 if(!aired||aired>today())return null;
 const days=(Date.parse(today())-Date.parse(aired))/86400000;
 return days>=0&&days<=15?{air:aired,title:String(row?.next_episode_title||'').trim()}:null;
}
function applyToHome(rows){
 if(!home())return 0;
 const view=q('[data-home-view="series"]')||q('[data-home]');if(!view)return 0;
 const current=asRows(rows),byId=new Map(current.map(x=>[Number(x.tmdb_id),x]));
 let painted=0;
 for(const element of all('.media-row',view)){
  const raw=String(element.dataset.media||element.querySelector?.('[data-media]')?.dataset.media||'');
  const id=Number(raw.match(/(?:tv|series):(\d+)/)?.[1]||0);
  const rec=byId.get(id);if(!rec||!recents[id])continue;
  const ep=recentEpisode(rec);
  const small=q('small',element);if(!small)continue;
  const marker=small.querySelector?.('[data-ct542-live]')||document.createElement('span');
  marker.dataset.ct542Live='1';
  if(!ep){marker.remove();continue}
  const date=ep.air.split('-').reverse().join('/');
  marker.textContent=' · Novo episódio: '+date;
  if(!marker.isConnected)small.appendChild(marker);
  painted++;
 }
 document.documentElement.dataset.ct542UpdatedCards=String(painted);
 return painted;
}
async function sync(force=false){
 if(!home()||!core()?.edge||!core()?.rpc)return false;
 if(pending)return pending;
 const now=Date.now();if(!force&&now-checkedAt<30*60000)return false;
 checkedAt=now;
 pending=(async()=>{
  try{
   const refreshed=await core().edge('ct-wwe-tv-refresh',{source:'home-web-r542'});
   if(!home())return refreshed;
   const refreshedRows=await core().rpc('cinetracker_home_series_v527',{p_today:today(),p_limit_per_bucket:250});
   applyToHome(refreshedRows);
   calls++;
   document.documentElement.dataset.ct542WweSync=refreshed?.ok?'updated':'no-change';
   return refreshed;
  }catch(err){
   checkedAt=Date.now()-25*60000;
   document.documentElement.dataset.ct542WweSyncError=String(err?.message||err).slice(0,160);
   return false;
  }finally{pending=null}
 })();
 return pending;
}
function schedule(){
 if(!home())return;
 for(const ms of [500,1750])setTimeout(()=>{if(home())void sync(false)},ms);
}
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-nav="home"],[data-home-tab="series"]'))setTimeout(schedule,60);
},false);
window.addEventListener('popstate',()=>setTimeout(schedule,100),false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()},false);
window.addEventListener('focus',schedule,false);
for(const ms of [1100,3400])setTimeout(schedule,ms);
window.__ctR542Wwe={version:'0.3.69',scope:'WWE-recent-episodes-only',sync,
 applyToHome,recentEpisode,getCalls:()=>calls};
})();