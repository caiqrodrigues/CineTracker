/* r195 Web — hard dorama exclusion in Pra Voce + denser Profile statistics */
(() => {
'use strict';
if(window.__ctR195WebLoaded)return;
window.__ctR195WebLoaded=true;
window.__ctR195Web='foryou-no-dorama-profile-stats-dense';
window.__ctWebRevision='r195-no-dorama-sports-profile-density';
window.__ctR195DoramaFilter='asian-scripted-tv-excluded-from-foryou';
window.__ctR195ProfileDensity='statistics-less-vertical-space';

const norm195=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function countries195(x){
  const r=x?.raw_tmdb||{},vals=[...(Array.isArray(x?.origin_country)?x.origin_country:[]),...(Array.isArray(r?.origin_country)?r.origin_country:[])];
  return [...new Set(vals.map(v=>String(v||'').toUpperCase()).filter(Boolean))];
}
function language195(x){const r=x?.raw_tmdb||{};return String(x?.original_language||r?.original_language||'').toLowerCase()}
function isDorama195(x){
  let type='';try{type=ct186Type(x)}catch{type=String(x?.media_type||x?.type||'').toLowerCase()}
  if(type!=='tv')return false;
  try{if(ct186Anime(x))return false}catch{}
  let genres=[];try{genres=ct186GenresOf(x)}catch{}
  /* Do not classify Asian reality/news/talk as dorama. Scripted Asian TV is excluded. */
  if(genres.includes(10764)||genres.includes(10763)||genres.includes(10767))return false;
  const cs=countries195(x),lang=language195(x);
  const asianCountry=cs.some(c=>['KR','JP','CN','TW','HK','TH'].includes(c));
  const asianLanguage=['ko','ja','zh','th'].includes(lang);
  return asianCountry||asianLanguage;
}
window.__ctIsDorama=isDorama195;

/* Keep every r186/r194 rule and add dorama as a hard eligibility exclusion. */
try{
  const freshEligible195=ct186FreshEligible;
  ct186FreshEligible=function(x,c){return freshEligible195(x,c)&&!isDorama195(x)};
}catch{}
try{
  const watchEligible195=ct186WatchEligible;
  ct186WatchEligible=function(x,c){return watchEligible195(x,c)&&!isDorama195(x)};
}catch{}
try{
  const renderForYou195=ct166RenderForYou;
  ct166RenderForYou=function(data){
    let html=renderForYou195(data);
    html=html.replaceAll('priorizada pelo seu gosto · somente não assistidos · Filme · Série · Anime','priorizada pelo seu gosto · sem doramas · somente não assistidos · Filme · Série · Anime');
    return html;
  };
  renderForYou158=ct166RenderForYou;
}catch{}
try{
  ct186ContextValue=null;ct186ContextAt=0;ct186ForYouData=null;
  discoverCache.clear();
  for(const k of Object.keys(localStorage))if(k.includes('discover:foryou')||k.includes('r186:foryou'))localStorage.removeItem(k);
}catch{}

/* Estatísticas: same information and readable values, substantially less vertical air. */
const style=document.createElement('style');style.id='ct195-profile-stats-dense';style.textContent=`
[data-page="profile"] .page{gap:7px!important}
[data-page="profile"] section.panel{padding:9px 11px!important;margin-bottom:7px!important;border-radius:16px!important}
[data-page="profile"] .panel-head{min-height:23px!important;margin:0 0 5px!important;gap:6px!important}
[data-page="profile"] .panel-head h2{font-size:15px!important;line-height:1.1!important;margin:0!important}
[data-page="profile"] .panel-head small{font-size:9px!important;line-height:1.15!important;margin:0!important}
[data-page="profile"] .stats,[data-page="profile"] .ct-r180-profile-stats,[data-page="profile"] .ct180-profile-stats,[data-page="profile"] .profile-stat-grid{gap:5px!important;margin-top:4px!important;margin-bottom:4px!important}
[data-page="profile"] .stat,[data-page="profile"] .ct-r180-profile-stats .stat,[data-page="profile"] .ct180-profile-stats .stat,[data-page="profile"] .profile-stat-grid .stat{min-height:50px!important;padding:6px 8px!important;border-radius:11px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
[data-page="profile"] .stat small{font-size:8.5px!important;line-height:1.1!important;margin:0 0 3px!important}
[data-page="profile"] .stat b{font-size:19px!important;line-height:1!important;margin:0!important}
[data-page="profile"] [data-profile-sports-panel] p{margin:5px 0 0!important;font-size:9px!important;line-height:1.2!important}
[data-page="profile"] h3{margin-top:7px!important;margin-bottom:5px!important;line-height:1.15!important}
@media(max-width:760px){
  [data-page="profile"] .page{gap:6px!important}
  [data-page="profile"] section.panel{padding:8px 9px!important;margin-bottom:6px!important}
  [data-page="profile"] .panel-head{margin-bottom:4px!important}
  [data-page="profile"] .stat,[data-page="profile"] .ct-r180-profile-stats .stat,[data-page="profile"] .ct180-profile-stats .stat,[data-page="profile"] .profile-stat-grid .stat{min-height:47px!important;padding:5px 7px!important}
  [data-page="profile"] .stat b{font-size:18px!important}
}
`;document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
