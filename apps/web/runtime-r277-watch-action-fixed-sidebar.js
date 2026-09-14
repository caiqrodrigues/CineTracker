/* CineTracker Web 1.0.68 / r277 — visible watched actions on Home cards and permanently fixed desktop sidebar. */
window.__ctR277='watch-action-host+fixed-sidebar';
window.__ctR277Watch='continue+dust+movie-watchlist-visible-right';
window.__ctR277Sidebar='desktop-fixed-full-height';
window.__ctR277Frozen='r276-history+episode-meta+dedupe+rewatch+discover+detail+sports+android-preserved';
function ct277EnsureWatchActions(root=document){
 const home=root?.matches?.('[data-home]')?root:root?.querySelector?.('[data-home]');
 if(!home)return 0;
 let changed=0;
 for(const card of home.querySelectorAll('.ct274-media-card')){
  let action=card.querySelector(':scope > [data-ct266-watch]');
  const context=card.dataset.ct274Context||'';
  if(!action&&(context==='continue'||context==='dust')&&typeof ct266WatchAction==='function'){
   const tmdb=Number(card.dataset.ct274Tmdb||0),s=Number(card.dataset.ct274Season||0),e=Number(card.dataset.ct274Episode||0),title=card.dataset.ct274FallbackTitle||card.querySelector('b,strong')?.textContent||'';
   if(tmdb>0&&s>0&&e>0){card.insertAdjacentHTML('beforeend',ct266WatchAction('episode',tmdb,s,e,title));action=card.querySelector(':scope > [data-ct266-watch]');if(action)changed++}
  }
  if(action&&!card.classList.contains('ct266-home-watch-host')){card.classList.add('ct266-home-watch-host');changed++}
 }
 return changed;
}
const ct277BasePaintHome=ct275PaintHome;
function ct277PaintHome(...args){const out=ct277BasePaintHome.apply(this,args);ct277EnsureWatchActions(document);return out}
ct275PaintHome=ct277PaintHome;
paintHome=ct277PaintHome;
window.__ctR277Test={ensureWatchActions:ct277EnsureWatchActions,basePaintHome:ct277BasePaintHome};
