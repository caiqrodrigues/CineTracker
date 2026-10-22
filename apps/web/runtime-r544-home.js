/* CineTracker Web 0.3.71 — Home Movies load recovery only. */
(()=>{'use strict';
if(window.__ctR544Home)return;
let pending=null,attempted=false;
const core=()=>window.__ctCoreR471;
const movies=()=>core()?.route?.()==='home'&&(
 document.querySelector('[data-home-tab="movies"].active')!==null||
 document.documentElement.dataset.ct504HomeKind==='movies'||window.__ctR504UserTab==='movies');
async function recover(force=false){
 if(!movies())return false;
 if(pending)return pending;
 if(attempted&&!force)return false;
 attempted=true;
 pending=(async()=>{try{
  const api=window.__ctR388;
  if(typeof api?.loadMovies!=='function')return false;
  const items=await api.loadMovies(!!force);
  if(!movies())return false;
  if(Array.isArray(items)&&items.length){
   api.renderMoviesAll?.();
   document.documentElement.dataset.ct544Movies='loaded:'+items.length;
   return true;
  }
  document.documentElement.dataset.ct544Movies='empty';return false;
 }catch(err){
  document.documentElement.dataset.ct544Movies='error:'+String(err?.message||err).slice(0,90);return false;
 }finally{pending=null}})();
 return pending;
}
document.addEventListener('click',e=>{
 const retry=e.target?.closest?.('[data-ct544-retry]');
 if(retry){e.preventDefault();e.stopPropagation();void recover(true);return}
 if(e.target?.closest?.('[data-home-tab="movies"]')){
  attempted=false;setTimeout(()=>void recover(false),90);
 }
},true);
window.addEventListener('popstate',()=>{attempted=false;if(movies())setTimeout(()=>void recover(false),100)});
window.__ctR544Home={version:'0.3.71',recover};
})();