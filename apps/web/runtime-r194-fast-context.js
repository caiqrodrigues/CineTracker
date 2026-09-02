/* r194 companion — fast recommendation context */
(() => {
'use strict';
if(window.__ctR194FastContextLoaded)return;
window.__ctR194FastContextLoaded=true;
window.__ctR194FastContext='dashboard-v0997-fast';
try{
  let task=null;
  ct186Context=async function(force=false){
    if(!force&&ct186ContextValue&&Date.now()-Number(ct186ContextAt||0)<60000)return ct186ContextValue;
    if(task)return task;
    task=(async()=>{
      const dash=await rpc('cinetracker_profile_media_dashboard_v0997_fast',{});
      const historyMovieIds=new Set(),historyTvIds=new Set(),watchMovieIds=new Set(),watchTvIds=new Set(),historyAliases=new Set(),watchAliases=new Set();
      for(const x of dash||[]){
        const t=ct186Type(x),id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);
        if(ct186DashHistory(x)){if(id>0)(t==='movie'?historyMovieIds:historyTvIds).add(id);ct186AddAliases(historyAliases,t,x)}
        if(ct186DashWatchlist(x)){if(id>0)(t==='movie'?watchMovieIds:watchTvIds).add(id);ct186AddAliases(watchAliases,t,x)}
      }
      ct186ContextValue={dash:dash||[],historyMovieIds,historyTvIds,watchMovieIds,watchTvIds,historyAliases,watchAliases};
      ct186ContextAt=Date.now();
      return ct186ContextValue;
    })().finally(()=>{task=null});
    return task;
  };
}catch{}
})();
