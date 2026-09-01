/* r173: Onde Assistir volta para a coluna esquerda, em painel fechado */
window.__ctR173='watch-providers-left-window';
window.__ct173WatchLayout='left-rail-under-poster-windowed';

function ct173PlaceWatchWindow(){
  if(!['movie','series'].includes(route()))return;
  const hero=document.querySelector('.ct169-detail-hero');
  const watch=document.querySelector('.ct171-watch-section');
  if(!hero||!watch)return;
  hero.classList.add('ct173-left-watch');
  watch.classList.add('ct173-watch-window');
  if(watch.parentElement!==hero)hero.appendChild(watch);
}

const ct173RenderDetailBase=renderDetail;
renderDetail=async function(kind,id,seq){
  await ct173RenderDetailBase(kind,id,seq);
  if(seq!==navSeq||!['movie','series'].includes(route()))return;
  ct173PlaceWatchWindow();
};
