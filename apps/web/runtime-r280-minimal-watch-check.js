/* CineTracker Web 1.0.71 / r280 — minimal watched check matching History controls. */
window.__ctR280='minimal-watch-check+green-active';
window.__ctR280Watch='check-only+muted-idle+green-on-click';
window.__ctR280Frozen='r279-writer+effective-tmdb+r278-fixed-tabs+r277-sidebar+r276-history+android-preserved';

const ct280BaseExplicitWatchAction=ct279ExplicitWatchAction;
const ct280BaseMarkWatched=ct279MarkWatched;

function ct280MinimalWatchAction(kind,tmdb,s=0,e=0,title=''){
 const k=kind==='episode'?'episode':'movie',id=Number(tmdb||0),sn=Number(s||0),en=Number(e||0);
 if(!(id>0)||(k==='episode'&&(!(sn>0)||!(en>0))))return'';
 const aria=k==='episode'?'Marcar episódio como assistido':'Marcar filme como assistido';
 return '<button type="button" class="ct266-watch-action ct279-watch-button ct280-watch-button" aria-label="'+aria+'" title="'+aria+'" aria-pressed="false" data-ct279-watch="'+k+'" data-tmdb="'+id+'"'+(sn?' data-season="'+sn+'"':'')+(en?' data-episode="'+en+'"':'')+(title?' data-title="'+ct279Attr(title)+'"':'')+'><span class="ct279-watch-check" aria-hidden="true">✓</span></button>'
}
function ct280SetActive(action,on=true){
 if(!action)return;action.classList.toggle('ct280-watch-active',!!on);action.setAttribute('aria-pressed',on?'true':'false')
}
function ct280NormalizeButtons(root=document){
 let changed=0;for(const old of root.querySelectorAll?.('[data-ct279-watch]')||[]){
  if(old.classList.contains('ct280-watch-button')&&!old.querySelector('.ct279-watch-label'))continue;
  const k=old.dataset.ct279Watch,id=Number(old.dataset.tmdb||0),s=Number(old.dataset.season||0),e=Number(old.dataset.episode||0),title=old.dataset.title||'';
  const host=old.parentElement,html=ct280MinimalWatchAction(k,id,s,e,title);if(!host||!html)continue;old.outerHTML=html;host.classList.add('ct279-watch-host');changed++
 }
 return changed
}
async function ct280MarkWatched(action){
 if(!action)return;ct280SetActive(action,true);
 await ct280BaseMarkWatched(action);
 if(action.isConnected&&!action.disabled)ct280SetActive(action,false)
}

ct279ExplicitWatchAction=ct280MinimalWatchAction;
ct279MarkWatched=ct280MarkWatched;
if(typeof ct279ReconcileWatchButtons==='function')ct279ReconcileWatchButtons(document);
ct280NormalizeButtons(document);
if(typeof ct279ScheduleReconcile==='function')ct279ScheduleReconcile();
window.__ctR280Test={minimalWatchAction:ct280MinimalWatchAction,setActive:ct280SetActive,normalize:ct280NormalizeButtons,markWatched:ct280MarkWatched,baseExplicitWatchAction:ct280BaseExplicitWatchAction,baseMarkWatched:ct280BaseMarkWatched};
