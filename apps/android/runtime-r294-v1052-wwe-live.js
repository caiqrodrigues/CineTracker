/* Android 1.0.52/r294 — Raw and SmackDown automatic background synchronization.
   Do not reload any page; only move two freshly unwatched series rows. */
(()=>{'use strict';
if(window.__ctR294Wwe)return;
window.__ctR294Wwe='new-Raw-SmackDown-episodes-without-page-refresh';
const active=()=>route()==='home'&&homeActiveTab158==='series'&&!!(session?.user?.id||user?.id);
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const list=x=>Array.isArray(x)?x:Array.isArray(x?.rows)?x.rows:[];
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const today=()=>new Intl.DateTimeFormat('en-CA',{
 timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'
}).format(new Date());
let pending=null,checkedAt=0,revised=0;
function watchSet(d,id){
 const row=list(d).find(x=>Number(x.tmdb_id)===id);
 return new Set(list(row?.watched_keys).map(x=>Number(x.s)+':'+Number(x.e)));
}
function patch(rows,result,watches){
 if(!active())return 0;
 const home=q('[data-home-view="series"]')||q('[data-home]');if(!home)return 0;
 const data=new Map(list(rows).map(x=>[Number(x.tmdb_id),x]));
 const latest=new Map(list(result?.shows).map(x=>[Number(x.tmdb_id),x.last_episode_to_air]));
 const panels=all('section',home),continued=panels.find(x=>
  normalize(q('.panel-head h3,h3',x)?.textContent)==='continuar assistindo');
 let changes=0;
 for(const row of all('.media-row',home)){
  const raw=String(row.dataset.media||q('[data-media]',row)?.dataset.media||'');
  const title=normalize(q('b',row)?.textContent);
  let id=Number(raw.match(/(?:tv|series):(\d+)/)?.[1]||0);
  if(![1549,4656].includes(id))id=title==='raw'?4656:title.includes('smackdown')?1549:0;
  if(!id||!data.has(id))continue;
  const info=latest.get(id)||data.get(id).latest_episode_to_air||null;
  const air=String(info?.air_date||''),season=Number(info?.season_number),episode=Number(info?.episode_number);
  const ago=(Date.parse(today())-Date.parse(air))/86400000;
  const newPending=Number.isFinite(ago)&&ago>=0&&ago<=16&&
   !watchSet(watches,id).has(season+':'+episode);
  const small=q('small',row);if(!small)continue;
  const label=q('[data-ct294-wwe-recent]',small)||document.createElement('span');
  label.dataset.ct294WweRecent='1';
  if(!newPending){label.remove();continue}
  label.textContent=' · Novo episódio: '+air.split('-').reverse().join('/');
  if(!label.isConnected)small.appendChild(label);
  const container=row.closest('.home-action-row')||row;
  if(continued&&!continued.contains(container)){
   const stack=q(':scope > .stack',continued);
   if(stack){
    const old=container.closest('section');stack.appendChild(container);
    q(':scope > .empty',stack)?.remove();
    for(const section of [old,continued])if(section){
     const count=q('.panel-head small',section);
     if(count){const items=all(':scope > .home-action-row,:scope > .media-row',q(':scope > .stack',section));
      count.textContent=String(items.length)}
    }
   }
  }
  changes++;
 }
 revised+=changes;
 document.documentElement.dataset.ct294RecentWwe=String(revised);
 return changes;
}
async function sync(force=false){
 if(!active()||!session?.access_token)return false;
 if(pending)return pending;
 const time=Date.now();if(!force&&time-checkedAt<30*60000)return false;
 checkedAt=time;
 pending=(async()=>{
  try{
   const result=await edge('ct-wwe-tv-refresh',{source:'android-r294'},18000);
   if(!active())return result;
   const [homeRows,watched]=await Promise.all([
    rpc('cinetracker_home_series_v527',{p_today:today(),p_limit_per_bucket:250}),
    rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:[4656,1549]})
   ]);
   patch(homeRows,result,watched);
   return result;
  }catch(error){
   checkedAt=Date.now()-25*60000;
   document.documentElement.dataset.ct294WweError=String(error?.message||error).slice(0,180);
   return false;
  }finally{pending=null}
 })();
 return pending;
}
function schedule(){
 if(!active())return;
 for(const delay of [300,1400])setTimeout(()=>{if(active())void sync()},delay);
}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-nav="home"],[data-home-tab="series"]'))setTimeout(schedule,100);
},false);
window.addEventListener('popstate',schedule,false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()},false);
window.addEventListener('focus',schedule,false);
for(const wait of [1600,4200])setTimeout(schedule,wait);
window.__ctR294Wwe={sync,patch,watchSet,today,getUpdates:()=>revised};
})();