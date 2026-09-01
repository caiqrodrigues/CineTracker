/* r173: detail hero restored as a left-side windowed information panel */
window.__ctR173='detail-left-windowed-hero';
window.__ct173Detail='poster-title-meta-synopsis-actions-left-window';

/* Structural marker used by the release validator and for future layout overrides. */
const ct173RenderDetailBase=renderDetail;
renderDetail=async function(kind,id,seq){
  await ct173RenderDetailBase(kind,id,seq);
  if(seq!==navSeq||!['movie','series'].includes(route()))return;
  const hero=document.querySelector('.ct169-detail-hero');
  if(hero)hero.classList.add('ct173-detail-window');
};
