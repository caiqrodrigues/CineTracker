/* CineTracker Android 1.0.50/r292 — only the original Home F1 remains visible;
   NFL shows distinct full-history count; no DB mutation, no Web change. */
(()=>{'use strict';
if(window.__ctR292Home)return;
window.__ctR292Home='exact-f1-duplicate-hidden-nfl-full-episodes-counter';
const mediaId='-1895884984',f1Id='-1321137963';
const countTotal=120;
const uid=()=>String(session?.user?.id||user?.id||'');
const isHome=()=>route()==='home'&&homeActiveTab158==='series'&&Boolean(uid());
const qs=(selector,root=document)=>root?.querySelector?.(selector)||null;
const qsa=(selector,root=document)=>Array.from(root?.querySelectorAll?.(selector)||[]);
let current='',watched=null,loading=null,stamp=0;
function removeF1Duplicates(){
 if(!isHome())return 0;
 const view=qs('[data-home-viewport="series"]')||qs('[data-home-view="series"]')||qs('[data-home]');
 if(!view)return 0;
 let removed=0;
 for(const row of qsa('.media-row',view)){
  if(row.hasAttribute('data-ct263-special')||row.closest('[data-ct290-home-special]'))continue;
  const raw=String(row.dataset.media||''),title=String(qs('b',row)?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  if(raw==='tv:'+f1Id||((title==='formula 1'||title==='formula one')&&!qs('.thumb[style]',row))){
   const section=row.closest('section');
   row.remove();removed++;
   if(section){
    const stack=qs(':scope > .stack',section),count=qs('.panel-head small',section);
    if(stack&&count)count.textContent=String(qsa(':scope > .media-row,:scope > .home-action-row',stack).length);
   }
  }
 }
 document.documentElement.dataset.ct292HiddenDuplicateF1=String(removed);
 return removed;
}
function countEpisodes(rows){
 const unique=new Set();
 for(const x of Array.isArray(rows)?rows:[]){
  const s=Number(x.season_number),e=Number(x.episode_number);
  if(x.watched===true&&(s===1||s===2)&&e>=1&&e<=60)unique.add(s+':'+e);
 }
 return unique.size;
}
function repaintNFL(){
 if(!isHome())return;
 const view=qs('[data-home-viewport="series"]')||qs('[data-home-view="series"]')||qs('[data-home]');
 if(!view)return;
 for(const row of qsa('.media-row',view)){
  const raw=String(row.dataset.media||''),title=String(qs('b',row)?.textContent||'').trim().toLowerCase();
  if(raw!=='tv:'+mediaId&&title!=='nfl super bowls'&&title!=='nfl super bowl')continue;
  const small=qs('small',row);
  if(small){
   small.textContent=watched==null?'Histórico de 120 episódios · sincronizando':watched+' / '+countTotal+' episódios assistidos';
   small.title=watched==null?'120 episódios (jogo e show do intervalo por ano)':'Dos '+countTotal+' episódios históricos (jogo e show do intervalo)';
  }
 }
}
async function refresh(force=false){
 if(!isHome())return null;
 const id=uid();
 if(id!==current){current=id;watched=null;loading=null;stamp=0}
 if(loading)return loading;
 if(!force&&watched!==null&&Date.now()-stamp<90000)return watched;
 loading=(async()=>{
  const data=await api('episode_progress?select=season_number,episode_number,watched&media_id=eq.837&profile_id=eq.'+
   encodeURIComponent(id)+'&limit=500');
  if(uid()!==id)return null;
  watched=countEpisodes(data);
  stamp=Date.now();repaintNFL();return watched;
 })().catch(e=>{
  document.documentElement.dataset.ct292NFLHistoryError=String(e?.message||e);
  return watched;
 }).finally(()=>{loading=null});
 return loading;
}
function update(){
 if(!isHome())return;
 removeF1Duplicates();repaintNFL();
 void refresh(false);
}
const oldPaint=paintHome;
paintHome=function(...args){
 const out=oldPaint.apply(this,args);
 if(isHome()){queueMicrotask(update);requestAnimationFrame(update)}
 return out;
};
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-home-tab="series"],[data-nav="home"]'))setTimeout(update,120);
},false);
document.addEventListener('cinetracker:nfl-super-bowl-episode',()=>{stamp=0;void refresh(true)},false);
const css=document.createElement('style');css.id='ct292-old-f1-hidden';
css.textContent=[
 '[data-home] .media-row[data-media="tv:-1321137963"]:not([data-ct263-special]){display:none!important}',
 '[data-home] .ct290-home-text small{max-width:100%!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}'
].join('\n');document.head.appendChild(css);
window.__ctR292HomeTest={countEpisodes,removeF1Duplicates,refresh,update,getWatched:()=>watched};
})();