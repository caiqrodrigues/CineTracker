/* Android 0.99.7.44 — Top 10 on current state + compact person + one-screen season chart */
(() => {
'use strict';
if(window.__ctAndroidR216Loaded)return;
window.__ctAndroidR216Loaded=true;
window.__ctAndroidR216='top10-current-state-person-summary-season-one-screen';
window.__ctAndroidTop10='current-dom-token-no-legacy-nav-guard';
window.__ctAndroidPerson='photo-name-short-biography-no-intro';
window.__ctAndroidSeasonChart='whole-season-one-screen-swipe-season-only';
window.__ctAndroidScope='android-only-web-untouched';
window.__ctAndroidBundle='android-v0.99.7.44-r216-top10-person-season';
window.__ctAndroidWebRevision='r196-watchlist-toggle';

function shortBio216(value){
  const text=String(value||'').replace(/\s+/g,' ').trim();
  if(!text)return '';
  const max=420;
  if(text.length<=max)return text;
  const sentences=text.match(/[^.!?]+[.!?]+(?:[”"']|$)?/g)||[];
  let out='';
  for(const sentence of sentences){
    const next=(out+' '+sentence.trim()).trim();
    if(next.length>max)break;
    out=next;
    if(out.length>=220&&out.split(/[.!?]+/).filter(Boolean).length>=2)break;
  }
  if(out.length>=160)return out;
  const cut=text.slice(0,max+1),at=cut.lastIndexOf(' ');
  return (at>260?cut.slice(0,at):text.slice(0,max)).trim().replace(/[,:;\-–—]+$/,'')+'…';
}
window.ctR216ShortBio=shortBio216;

let topToken216=0;
function topRoot216(token=topToken216){
  try{return document.querySelector('[data-ct216-top10="'+String(token)+'"]')}catch{return null}
}
function topAlive216(token=topToken216){
  const root=topRoot216(token);
  if(!root||!root.isConnected)return false;
  try{return String(discoverState?.tab||'')==='top10'&&String(route())==='discover'}catch{return true}
}
function providerButtons216(rows){
  return (rows||[]).map(p=>`<button type="button" class="ct171-provider-tab ${Number(p.provider_id)===Number(ct171TopProvider)?'active':''}" data-ct171-provider="${Number(p.provider_id)}">${p.logo_path?`<span style="background-image:url('${img(p.logo_path,'w92')}')"></span>`:''}<b>${esc(p.provider_name)}</b></button>`).join('')||'<div class="empty">Nenhum streaming configurado.</div>';
}
async function paintTop216(provider,token=topToken216){
  const root=topRoot216(token),content=root?.querySelector('[data-ct171-top-content]');
  if(!content)return;
  content.innerHTML=loading('Montando Top 10...');
  try{
    const data=await ct171TopRows(Number(provider));
    if(!topAlive216(token))return;
    const p=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider));
    content.innerHTML=`<div class="ct216-top-provider"><b>${esc(p?.provider_name||'Streaming')}</b></div><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>${data.series.length}</small></div><div class="ct171-top-row">${data.series.map(ct171TopCard).join('')||'<div class="empty">Sem séries disponíveis neste streaming.</div>'}</div></section><section class="panel ct171-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>${data.movies.length}</small></div><div class="ct171-top-row">${data.movies.map(ct171TopCard).join('')||'<div class="empty">Sem filmes disponíveis neste streaming.</div>'}</div></section>`;
    try{if(typeof ct171DecorateSeen==='function')void ct171DecorateSeen(false)}catch{}
  }catch(e){if(topAlive216(token))content.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover')}
}
async function renderTop216(seq){
  try{discoverState.tab='top10';discoverState.type='all'}catch{}
  const token=++topToken216;
  let rail='';
  try{rail=ctR180TabRail()}catch{}
  setApp(shell('Descobrir','','discover',`<div class="page" data-discover data-ct216-top10="${token}">${rail}<section class="ct171-top10-shell"><div class="ct171-top10-title"><h2>Top 10</h2></div><div class="ct171-provider-tabs" data-ct171-provider-tabs>${loading('Carregando streamings...')}</div><div data-ct171-top-content>${loading('Carregando Top 10...')}</div></section></div>`));
  try{
    ct171ProviderList=null;
    const providers=await ct171Providers();
    if(!topAlive216(token))return true;
    if(!ct171TopProvider||!providers.some(x=>Number(x.provider_id)===Number(ct171TopProvider)))ct171TopProvider=Number(providers[0]?.provider_id||0);
    const box=topRoot216(token)?.querySelector('[data-ct171-provider-tabs]');
    if(box)box.innerHTML=providerButtons216(providers);
    if(ct171TopProvider)await paintTop216(ct171TopProvider,token);
    try{if(typeof ct214CleanExplanatory==='function')ct214CleanExplanatory()}catch{}
    return true;
  }catch(e){
    const h=topRoot216(token)?.querySelector('[data-ct171-top-content]');
    if(h)h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover');
    return true;
  }
}
window.ctR216RenderTop10=renderTop216;
try{ct171PaintTopProvider=paintTop216}catch{}
try{ctR180PaintTopProvider=paintTop216}catch{}

const style216=document.createElement('style');
style216.id='ct-android-099744-top10-person-season';
style216.textContent=`
[data-page="person"] .page-subtitle,
[data-page="person"] .subtitle,
.ct170-person-page .ct169-kicker{display:none!important}
.ct170-person-page{gap:9px!important}
.ct170-person-hero{padding:11px!important;gap:14px!important;align-items:start!important}
.ct170-person-hero h1{margin:0 0 5px!important}
.ct170-person-facts{margin-bottom:8px!important}
.ct170-person-hero h3{margin:10px 0 4px!important}
.ct170-biography{line-height:1.45!important;margin:0!important;max-width:none!important}
@media(max-width:760px){
  .ct170-person-hero{grid-template-columns:128px minmax(0,1fr)!important}
  .ct170-person-photo{width:128px!important}
  .ct170-person-hero h1{font-size:24px!important}
  .ct170-person-facts{font-size:9px!important;line-height:1.3!important}
  .ct170-person-fav{padding:7px 9px!important;font-size:9px!important}
  .ct170-biography{font-size:11px!important}
}
.ct169-season-chart-carousel{
  gap:0!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 0 10px!important;
  scroll-snap-type:x mandatory!important;scroll-behavior:smooth!important;overscroll-behavior-x:contain!important
}
.ct169-season-chart-card{
  box-sizing:border-box!important;flex:0 0 100%!important;width:100%!important;max-width:100%!important;min-width:100%!important;
  scroll-snap-align:start!important;scroll-snap-stop:always!important;margin:0!important
}
.ct169-chart-body{width:100%!important;max-width:100%!important;min-width:0!important}
.ct169-chart-scroll{
  width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;overflow-y:visible!important
}
.ct169-chart-scroll svg{
  display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;height:215px!important
}
`;
document.getElementById(style216.id)?.remove();document.head.appendChild(style216);
})();
