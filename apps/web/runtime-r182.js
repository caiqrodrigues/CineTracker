/* r182 — Home sem selo circular redundante + temporada compacta e bem enquadrada */
window.__ctR182='home-clean-status-season-compact-control';
window.__ct182Home='remove-noninteractive-circle-badge-keep-row-navigation';
window.__ct182Season='compact-inline-season-toggle-no-giant-button';
window.__ct182SeasonPlacement='season-card-footer-and-drawer-progress';

/*
 * O círculo que aparecia à direita das linhas da Home era apenas um <span class="badge">:
 * ele não tinha ação própria. A linha inteira já abre a mídia e o botão azul continua sendo
 * a ação explícita de marcar o próximo episódio. A r182 remove esse ornamento redundante.
 */
function ct182CleanHomeBadges(){
  document.querySelectorAll('[data-home] .media-row > .badge').forEach(el=>el.remove());
}
const ct182PaintHomeBase=paintHome;
paintHome=function(){
  const out=ct182PaintHomeBase();
  requestAnimationFrame(ct182CleanHomeBadges);
  return out;
};

function ct182SeasonToggleHtml(showId,sn,state,scope='card'){
  const on=Boolean(state?.complete),total=Number(state?.total||0),seen=Number(state?.seen||0),disabled=total===0;
  const card=scope==='card';
  const label=disabled?'Sem lançados':on?(card?'✓ Vista':'✓ Vista · desfazer'):(card?'○ Marcar vista':'○ Marcar temporada vista');
  const title=disabled?'Ainda não há episódios lançados nesta temporada':on?'Desmarcar os episódios lançados desta temporada':'Marcar todos os episódios já lançados desta temporada como vistos';
  const progress=total>0?`${seen}/${total}`:'—';
  return `<button type="button" class="ct181-season-toggle ct182-season-toggle ${on?'on':''} ${scope==='drawer'?'drawer':''}" data-ct181-season-toggle="${Number(showId)}:${Number(sn)}" data-on="${on?'1':'0'}" title="${esc(title)}" aria-label="${esc(title)}" ${disabled?'disabled':''}><span>${label}</span>${card?`<small>${progress}</small>`:''}</button>`;
}

/* Substitui a apresentação r181, preservando integralmente sua lógica de marcar/desmarcar. */
ct181SeasonToggleHtml=ct182SeasonToggleHtml;
ct181SetCardToggle=function(showId,sn,state){
  const article=document.querySelector(`.ct169-season-card [data-ct169-season="${Number(showId)}:${Number(sn)}"]`)?.closest('.ct169-season-card');if(!article)return;
  let host=article.querySelector('.ct181-season-control');
  if(!host){host=document.createElement('div');host.className='ct181-season-control ct182-season-control';article.appendChild(host)}
  else host.classList.add('ct182-season-control');
  const total=Number(state?.total||0),seen=Number(state?.seen||0);
  host.innerHTML=`<span class="ct182-season-progress" aria-hidden="true">${total>0?`${seen}/${total} vistos`:'sem episódios lançados'}</span>${ct182SeasonToggleHtml(showId,sn,state,'card')}`;
};
ct181SetDrawerToggle=function(showId,sn,state){
  const progress=document.querySelector('.ct169-drawer-progress');if(!progress||Number(ct169DrawerState?.showId)!==Number(showId)||Number(ct169DrawerState?.seasonNo)!==Number(sn))return;
  let host=progress.querySelector('.ct181-drawer-season-control');
  if(!host){host=document.createElement('div');host.className='ct181-drawer-season-control ct182-drawer-season-control';progress.appendChild(host)}
  else host.classList.add('ct182-drawer-season-control');
  host.innerHTML=ct182SeasonToggleHtml(showId,sn,state,'drawer');
};

/* Quando a tela já estiver montada por restauração rápida, aplica a nova composição imediatamente. */
setTimeout(()=>{ct182CleanHomeBadges();if(route()==='series'&&Number(ct169CurrentDetail?.id)>0)void ct181DecorateSeasons(Number(ct169CurrentDetail.id))},0);
