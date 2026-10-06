/* CineTracker Web 0.3.17 r490 — one visible authority per requested screen. */
(()=>{
'use strict';
if(window.__ctR490?.version==='0.3.17')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc490=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route490=()=>{try{return String(window.__ctR469Route?.()||route?.()||'')}catch{return''}};
const unwrap=v=>Array.isArray(v)&&v.length===1?v[0]:v?.data??v;
const rpc490=(name,args={})=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(window.__ctCoreR471?.rpc)return Promise.resolve(window.__ctCoreR471.rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('RPC_UNAVAILABLE'))};
const timeout490=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT_'+ms)),ms))]);
const profileLabels={series:'Séries',movies:'Filmes',seriesFav:'Séries Favoritas',movieFav:'Filmes Favoritos',actors:'Atores Favoritos'};
const countKeys={series:'series',movies:'movies',seriesFav:'series_favorites',movieFav:'movie_favorites',actors:'actors'};
let profileTask490=null,profileRun490=0,profileFragmentsTask490=null;

function footer490(){
 const v=q('.version');if(v)v.textContent='CineTracker • v0.3.17 • r490-official-0.3.17';
 document.documentElement.dataset.ct490Version='0.3.17';
}
function panel490(label){
 const root=q('[data-profile]'),wanted=norm(label);if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null;
}
function mediaCard490(x){
 try{if(typeof mediaCard==='function'){const h=mediaCard(x);if(typeof h==='string'&&h.trim())return h}}catch{}
 const type=String(x?.media_type||'tv')==='movie'?'movie':'tv',id=Number(x?.tmdb_id||0),p=String(x?.poster_path||''),src=p?(p.startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="card"><button type="button" data-media="'+type+':'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc490(src)+'\')"':'')+'></div><div class="card-body"><b>'+esc490(x?.title||'Sem título')+'</b></div></button></article>';
}
function actorCard490(a){
 const id=Number(a?.tmdb_person_id||0),p=String(a?.profile_path||''),src=p?(p.startsWith('http')?p:(typeof img==='function'?img(p,'w185'):p)):'';
 return '<article class="card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\''+esc490(src)+'\')"':'')+'></div><div class="card-body"><b>'+esc490(a?.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>';
}
function profileList490(summary,key){
 if(key==='series')return rows(summary?.series);
 if(key==='movies')return rows(summary?.movies);
 if(key==='seriesFav')return rows(summary?.series_favorites);
 if(key==='movieFav')return rows(summary?.movie_favorites);
 return rows(summary?.actors);
}
function patchProfileLists490(summary){
 if(route490()!=='profile'||!summary)return false;
 for(const key of Object.keys(profileLabels)){
  const panel=panel490(profileLabels[key]);if(!panel)continue;
  const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);if(!row)continue;
  const data=profileList490(summary,key).slice(0,12),total=Number(summary?.counts?.[countKeys[key]]??data.length);
  qa('[data-ct467-more],[data-ct465-more],[data-ct457-more],[data-ct455-more],[data-ct424-more],.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card',panel).forEach(x=>x.remove());
  qa('.panel-head button,.panel-head a',panel).filter(b=>norm(b.textContent).includes('ver mais')).forEach(b=>b.remove());
  row.className='row ct490-profile-grid';row.dataset.ct490ProfileGrid=key;
  row.innerHTML=data.map(x=>key==='actors'?actorCard490(x):mediaCard490(x)).join('')||'<div class="empty">Nenhum item nesta seção.</div>';
  const count=q('.panel-head small',panel);if(count)count.textContent=total.toLocaleString('pt-BR');
  if(total>12){
   const head=q('.panel-head',panel)||panel,b=document.createElement('button');b.type='button';b.className='chip ct476-header-more ct490-profile-more';b.dataset.ct476HeaderMore=key;b.textContent='Ver mais';b.setAttribute('aria-label','Ver mais '+profileLabels[key]);head.appendChild(b);
  }
 }
 const root=q('[data-profile]');if(root)root.dataset.ct490Lists='12-exact';
 return true;
}
function stat490(panel,label){
 const want=norm(label);
 return qa('.stat,[data-stat],.stat-card,.profile-stat',panel).find(c=>norm(q('small,label,.stat-label,.label',c)?.textContent||'')===want)||null;
}
function statValue490(card){return q('b,strong,.value,.stat-value',card)}
function patchSports490(sportsRaw,stadiumRaw){
 if(route490()!=='profile')return false;
 const sports=unwrap(sportsRaw)||{},stadium=unwrap(stadiumRaw)||{},panel=qa('section.panel,.panel',q('[data-profile]')).find(p=>norm(q('.panel-head h2,.panel-head h3,h2,h3',p)?.textContent||'').includes('esportes assistidos'));
 if(!panel)return false;
 const minutes=Number(sports?.sports_minutes||0),events=Number(sports?.watched_events??stadium?.watched_events??0),stadiumEvents=Number(stadium?.stadium_events||0);
 const time=stat490(panel,'Tempo assistido'),ev=stat490(panel,'Eventos assistidos');let st=stat490(panel,'Jogos no Estádio');
 if(time&&statValue490(time))statValue490(time).textContent=typeof fmtMinutes==='function'?fmtMinutes(minutes):String(minutes)+' min';
 if(ev&&statValue490(ev)){statValue490(ev).textContent=events.toLocaleString('pt-BR');ev.dataset.ct299History='all';ev.classList.add('ct299-clickable-stat');ev.setAttribute('role','button');ev.tabIndex=0}
 if(!st){
  const stats=q('.stats',panel)||panel;st=document.createElement('div');st.className='stat ct299-clickable-stat';st.innerHTML='<small>Jogos no Estádio</small><b>0</b>';stats.appendChild(st);
 }
 if(statValue490(st))statValue490(st).textContent=stadiumEvents.toLocaleString('pt-BR');
 st.dataset.ct299History='stadium';st.classList.add('ct299-clickable-stat');st.setAttribute('role','button');st.tabIndex=0;
 panel.dataset.ct490Sports=events+':'+stadiumEvents;return true;
}
async function profileData490(){
 const zone=typeof tz==='function'?tz():'America/Sao_Paulo';
 const basePromise=timeout490(rpc490('cinetracker_profile_v380',{p_tz:zone}),8000).catch(()=>timeout490(rpc490('cinetracker_profile_payload_v0997',{p_tz:zone}),8000));
 const [base,summary,sports,stadium]=await Promise.all([
  basePromise,
  timeout490(rpc490('cinetracker_profile_summary_v489',{}),6500),
  timeout490(rpc490('cinetracker_sport_stats_v421',{}),6500),
  timeout490(rpc490('cinetracker_sports_stadium_summary_v296',{}),6500)
 ]);
 return{base:unwrap(base)||{},summary:unwrap(summary)||{},sports:unwrap(sports)||{},stadium:unwrap(stadium)||{}};
}
async function renderProfile490(seq){
 const run=++profileRun490;
 try{setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile><div class="ct490-profile-loading"><div class="loader">Carregando Perfil...</div></div></div>'))}catch{}
 footer490();
 if(profileTask490)return profileTask490;
 profileTask490=(async()=>{try{
  const data=await profileData490();if(run!==profileRun490||route490()!=='profile')return false;
  const merged={...data.base,sports_stats:{...(data.base?.sports_stats||{}),...data.sports}};
  try{profileCache=merged}catch{}
  if(typeof ct168PaintProfile==='function')ct168PaintProfile(merged,'');else throw new Error('PROFILE_PAINTER_UNAVAILABLE');
  patchProfileLists490(data.summary);patchSports490(data.sports,data.stadium);footer490();
  const root=q('[data-profile]');if(root)root.dataset.ct490Ready='1';
  document.documentElement.dataset.ct490Profile='single-paint';return true;
 }catch(e){if(run===profileRun490&&route490()==='profile'){const root=q('[data-profile]');if(root)root.innerHTML='<div class="error">Não foi possível carregar o Perfil.<br><button type="button" class="btn" data-ct490-profile-retry>Tentar novamente</button></div>';document.documentElement.dataset.ct490ProfileError=String(e?.message||e)}return false}
 finally{profileTask490=null}})();
 return profileTask490;
}
async function refreshProfileFragments490(){
 if(route490()!=='profile'||profileFragmentsTask490)return profileFragmentsTask490||false;
 profileFragmentsTask490=(async()=>{try{
  const [summary,sports,stadium]=await Promise.all([
   timeout490(rpc490('cinetracker_profile_summary_v489',{}),6500),
   timeout490(rpc490('cinetracker_sport_stats_v421',{}),6500),
   timeout490(rpc490('cinetracker_sports_stadium_summary_v296',{}),6500)
  ]);
  if(route490()!=='profile')return false;patchProfileLists490(unwrap(summary)||{});patchSports490(unwrap(sports)||{},unwrap(stadium)||{});footer490();return true;
 }catch{return false}finally{profileFragmentsTask490=null}})();return profileFragmentsTask490;
}
async function renderHome490(){
 for(const k of ['ct413HomeEntering','ct415HomeEntering','ct417HomeEntering','ct418HomeEntering','ct424HomeEntering','ct461SeriesGate'])delete document.documentElement.dataset[k];
 try{document.documentElement.style.removeProperty('overflow')}catch{}
 footer490();try{return await window.__ctR388?.renderHome?.()}finally{footer490()}
}
function activateForYou490(){
 if(route490()!=='discover')return false;try{window.__ctR464?.activate?.();return true}catch{return false}
}
window.addEventListener('click',e=>{
 const retry=e.target?.closest?.('[data-ct490-foryou-retry]');if(retry){e.preventDefault();delete document.documentElement.dataset.ct490ForYouReady;try{window.__ctR464?.load?.(false)}catch{}return}
 if(e.target?.closest?.('[data-ct490-profile-retry]')){e.preventDefault();profileTask490=null;void renderProfile490(typeof navSeq!=='undefined'?navSeq:0);return}
 if(e.target?.closest?.('[data-nav],[data-home-tab],[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]'))requestAnimationFrame(footer490);
},true);
window.addEventListener('popstate',()=>requestAnimationFrame(footer490));
window.addEventListener('cinetracker:data-changed',()=>{if(route490()==='profile')void refreshProfileFragments490()});
try{renderProfile=renderProfile490}catch{}
try{renderHome=renderHome490}catch{}
const style=document.createElement('style');style.id='ct490-style';style.textContent=[
 'html body [data-home-view="series"]:not(.hidden){visibility:visible!important;opacity:1!important}',
 'html body [data-home-view="movies"] .ct489-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;gap:14px!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct489-movie-card .poster{aspect-ratio:2/3!important;height:auto!important;background-size:cover!important;background-position:center!important}',
 'html body [data-profile] .ct490-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:12px!important;overflow:visible!important;width:100%!important;padding-bottom:0!important}',
 'html body [data-profile] .ct490-profile-grid>.card{display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important}.ct490-profile-grid .poster{aspect-ratio:2/3!important;height:auto!important;background-size:cover!important;background-position:center!important}.ct490-profile-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 'html body [data-ct321-top-content] .ct319-top-row{align-items:start!important;grid-auto-rows:auto!important;height:auto!important}',
 'html body [data-ct321-top-content] .ct319-item,html body [data-ct321-top-content] .ct288-card,html body [data-ct321-top-content] .ct288-open{height:auto!important;min-height:0!important;max-height:none!important}',
 'html body [data-ct321-top-content] .ct288-poster,html body [data-ct321-top-content] .poster{width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;overflow:hidden!important;background-size:cover!important;background-position:center!important}',
 'html body [data-ct321-top-content] .ct288-poster img,html body [data-ct321-top-content] .poster img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important}',
 '.ct490-profile-more{flex:0 0 auto!important}',
 '@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:8px!important}}',
 '@media(max-width:720px){html body [data-profile] .ct490-profile-grid,html body [data-home-view="movies"] .ct489-movie-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct490-profile-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct490-style'))document.head.appendChild(style);
footer490();
window.__ctR490Marker='real-video-authority+legacy-writers-retired+compact-foryou+profile-single-paint+sw-network-shell';
window.__ctR490={version:'0.3.17',scope:'home+discover-foryou+top10+profile',renderProfile:renderProfile490,refreshProfile:refreshProfileFragments490,renderHome:renderHome490,activateForYou:activateForYou490,patchLists:patchProfileLists490,patchSports:patchSports490};
})();