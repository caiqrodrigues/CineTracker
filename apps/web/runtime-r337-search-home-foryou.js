/* CineTracker Web 1.0.128 r337 — indexed episode search, deterministic Home state, readable ForYou actions. */
(()=>{
'use strict';
if(window.__ctR337?.version==='1.0.128')return;
window.__ctR337Marker='episode-catalog-search+home-desired-tab-settle+foryou-readable-same-kind-actions';
window.__ctR337Search='movie+series+person+episode-catalog+live';
window.__ctR337Home='authoritative-desired-tab+hidden-history-during-anchor-settle';
window.__ctR337Discover='readable-one-row-actions+same-kind-rotation+optimistic-replacement';
window.__ctR337Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

/* ---------- HOME: desired tab is state, never inferred from a stale repaint ---------- */
let homeDesired337='';
try{const k=sessionStorage.getItem('cinetracker_home_tab_v337');if(k==='series'||k==='movies')homeDesired337=k}catch{}
let homeToken337=0,homeTimers337=[],homeUserMoved337=false;
function currentHome337(){
 const a=q('[data-home-tab].active');if(a)return a.dataset.homeTab==='movies'?'movies':'series';
 const v=qa('[data-home-view]').find(x=>!x.hidden&&!x.classList.contains('hidden'));
 return v?.dataset?.homeView==='movies'?'movies':'series';
}
function desiredHome337(){return homeDesired337||currentHome337()}
function rememberHome337(kind){
 homeDesired337=kind==='movies'?'movies':'series';
 try{sessionStorage.setItem('cinetracker_home_tab_v337',homeDesired337)}catch{}
 window.__ctR337HomeDesired=homeDesired337;return homeDesired337;
}
function applyHome337(kind){
 const wanted=kind==='movies'?'movies':'series',root=q('[data-home]');if(!root)return false;
 try{ct266HomeTab=wanted}catch{}
 root.dataset.ct266HomeTab=wanted;
 qa('[data-home-tab]',root).forEach(b=>{const on=b.dataset.homeTab===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 qa('[data-home-view]',root).forEach(v=>{const on=v.dataset.homeView===wanted;v.hidden=!on;v.classList.toggle('hidden',!on)});
 return true;
}
function homeAnchor337(kind){
 const wanted=kind==='movies'?'movies':'series',view=q('[data-home-view="'+wanted+'"]');if(!view)return null;
 const re=wanted==='movies'?/assistir\s*a\s*seguir\s*\/\s*watchlist/i:/^assistir\s*a\s*seguir$/i;
 return [...view.children].find(sec=>sec.nodeType===1&&!sec.matches('[data-ct274-history]')&&re.test((q('.panel-head h3,.panel-head h2,h3,h2',sec)?.textContent||'').trim()))
  || [...view.children].find(sec=>sec.nodeType===1&&!sec.matches('[data-ct274-history]'))||null;
}
function homeTargetTop337(){
 const active=q('[data-home-tab].active')||q('[data-home-tab]'),bar=active?.closest?.('.home-tabs,.tabs')||active?.parentElement;
 const bottom=bar?.getBoundingClientRect?.().bottom;return Math.max(8,Math.ceil(Number.isFinite(bottom)?bottom:0)+8);
}
function alignHome337(kind){
 if(routeNow()!=='home')return false;
 try{window.__ctR336?.normalizeHistory?.()}catch{}
 applyHome337(kind);
 const target=homeAnchor337(kind);if(!target)return false;
 const delta=target.getBoundingClientRect().top-homeTargetTop337();
 if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'});
 target.dataset.ct337HomeAnchor='1';return true;
}
function clearHomeTimers337(){for(const id of homeTimers337)clearTimeout(id);homeTimers337=[]}
function finishHome337(token){if(token!==homeToken337)return;delete document.documentElement.dataset.ct337HomeAligning}
function armHome337(kind=desiredHome337()){
 if(routeNow()!=='home')return false;
 const wanted=rememberHome337(kind),token=++homeToken337;homeUserMoved337=false;clearHomeTimers337();
 document.documentElement.dataset.ct337HomeAligning='1';
 applyHome337(wanted);alignHome337(wanted);
 requestAnimationFrame(()=>{if(token===homeToken337&&!homeUserMoved337){applyHome337(wanted);alignHome337(wanted)}});
 for(const ms of [60,160,320])homeTimers337.push(setTimeout(()=>{if(token!==homeToken337||homeUserMoved337)return;applyHome337(wanted);alignHome337(wanted);if(ms===320)finishHome337(token)},ms));
 return true;
}
function userMovedHome337(){
 if(routeNow()!=='home')return;homeUserMoved337=true;homeToken337++;clearHomeTimers337();delete document.documentElement.dataset.ct337HomeAligning;
}
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,userMovedHome337,{passive:true});
window.addEventListener('keydown',e=>{if(['PageUp','PageDown','ArrowUp','ArrowDown','Home','End'].includes(e.key))userMovedHome337()},true);
try{
 const baseRenderHome337=renderHome;
 renderHome=async function(){
  const wanted=desiredHome337();document.documentElement.dataset.ct337HomeAligning='1';
  const out=await baseRenderHome337.apply(this,arguments);
  if(routeNow()==='home')armHome337(wanted);else delete document.documentElement.dataset.ct337HomeAligning;
  return out;
 };
}catch{}
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='home')setTimeout(()=>armHome337(desiredHome337()),0)});

/* ---------- SEARCH: local catalog + live recent episodes + TMDB movie/tv/person ---------- */
let searchSeq337=0,testBridge337=null;
function normalizeEpisode337(x){
 const tmdbId=Number(x?.tmdb_id||x?.show_tmdb_id||0),sn=Number(x?.season_number||0),en=Number(x?.episode_number||0);
 return {...x,media_type:'episode',tmdb_id:tmdbId,series_title:x?.series_title||x?.show_name||'Série',episode_title:x?.episode_title||x?.name||('Episódio '+en),season_number:sn,episode_number:en,source:x?.source||'catalog'};
}
async function catalogEpisodes337(term){
 if(testBridge337?.catalog)return rows(await testBridge337.catalog(term)).map(normalizeEpisode337);
 try{return rows(await rpc('cinetracker_episode_search_v337',{p_query:term,p_limit:12})).map(normalizeEpisode337)}catch{return[]}
}
function episodeKey337(x){return [Number(x?.tmdb_id||0),Number(x?.season_number||0),Number(x?.episode_number||0)].join(':')}
function mergeEpisodes337(local,live,term){
 const map=new Map();
 for(const raw of [...rows(local),...rows(live)]){
  const x=normalizeEpisode337(raw),key=episodeKey337(x);if(key==='0:0:0')continue;
  const prev=map.get(key);if(!prev||x.source==='catalog')map.set(key,{...prev,...x});
 }
 const nq=norm(term);
 const rank=x=>{const n=norm(x?.episode_title);if(n===nq)return 0;if(n.startsWith(nq))return 1;if(n.includes(nq))return 2;return Number(x?.match_score??3)};
 return [...map.values()].sort((a,b)=>rank(a)-rank(b)||String(b.air_date||'').localeCompare(String(a.air_date||''))).slice(0,12);
}
function episodeHtml337(x){
 const poster=x?.still_path||x?.poster_path||'',src=poster?(String(poster).startsWith('http')?poster:img(poster,x?.still_path?'w300':'w154')):'';
 const se='T'+String(Number(x?.season_number||0)).padStart(2,'0')+'E'+String(Number(x?.episode_number||0)).padStart(2,'0');
 return '<div class="global-result ct337-episode-result" data-media="tv:'+Number(x?.tmdb_id||0)+'">'+
  '<div class="thumb"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div><b>'+esc(x?.episode_title||'Episódio')+'</b>'+
  '<small class="muted">Episódio · '+esc(x?.series_title||'Série')+' · '+se+(x?.air_date?' · '+esc(x.air_date):'')+'</small></div></div>';
}
function standardHtml337(x){
 if(x.media_type==='person')return '<div class="global-result person" data-person="'+Number(x.id||0)+'"><div class="thumb"'+(x.profile_path?' style="background-image:url(\''+img(x.profile_path,'w185')+'\')"':'')+'></div><div><b>'+esc(x.name)+'</b><small class="muted">Pessoa</small></div></div>';
 return '<div class="global-result" data-media="'+x.media_type+':'+Number(x.id||0)+'"><div class="thumb"'+(x.poster_path?' style="background-image:url(\''+img(x.poster_path,'w154')+'\')"':'')+'></div><div><b>'+esc(x.title||x.name)+'</b><small class="muted">'+(x.media_type==='movie'?'Filme':'Série')+'</small></div></div>';
}
function paintSearch337(out,episodes,standard){
 const html=[...rows(episodes).map(episodeHtml337),...rows(standard).map(standardHtml337)];
 out.innerHTML='<div class="global-results">'+(html.join('')||'<div class="empty">Nenhum resultado.</div>')+'</div>';
}
async function globalSearch337(query){
 const out=q('[data-global-results]');if(!out)return;const term=String(query||'').trim(),seq=++searchSeq337;
 if(term.length<2){out.innerHTML='';return}
 out.innerHTML='<div class="global-results"><div class="loader">Buscando...</div></div>';
 try{
  const standardP=testBridge337?.standard?Promise.resolve(testBridge337.standard(term)):
   Promise.all([safeTmdb('/search/movie',{query:term,page:1}),safeTmdb('/search/tv',{query:term,page:1}),safeTmdb('/search/person',{query:term,page:1})]).then(([m,t,p])=>[
    ...rows(m?.results).slice(0,5).map(x=>({...x,media_type:'movie'})),
    ...rows(t?.results).slice(0,5).map(x=>({...x,media_type:'tv'})),
    ...rows(p?.results).slice(0,5).map(x=>({...x,media_type:'person'}))
   ]);
  const [standard,catalog]=await Promise.all([standardP,catalogEpisodes337(term)]);
  if(seq!==searchSeq337)return;paintSearch337(out,mergeEpisodes337(catalog,[],term),standard);
  let live=[];try{live=rows(await window.__ctR336?.liveEpisodes?.(term))}catch{}
  if(seq!==searchSeq337)return;paintSearch337(out,mergeEpisodes337(catalog,live,term),standard);
 }catch(e){if(seq===searchSeq337)out.innerHTML='<div class="global-results"><div class="error">'+esc(e?.message||e)+'</div></div>'}
}
try{globalSearch=globalSearch337}catch{}

/* ---------- FIRST CAPTURE OWNER: one click, one behavior ---------- */
function earlyHandle337(target){
 if(!target?.closest)return false;
 const ht=target.closest('[data-home-tab]');if(ht&&routeNow()==='home'){armHome337(String(ht.dataset.homeTab||'series'));return true}
 const dt=target.closest('[data-ct319-tab]');if(dt&&routeNow()==='discover'){void window.__ctR336?.switchDiscover?.(dt.dataset.ct319Tab);return true}
 const filter=target.closest('[data-ct336-fy-kind]');if(filter&&routeNow()==='discover'){
  const st=window.__ctR319Test?.state;if(st)st.fyKind=['movie','series','anime'].includes(filter.dataset.ct336FyKind)?filter.dataset.ct336FyKind:'all';
  window.__ctR336?.applyForYouFilter?.();return true;
 }
 const swap=target.closest('[data-ct336-swap-only]');if(swap&&routeNow()==='discover'){window.__ctR336?.swapForYou?.(String(swap.dataset.ct336SwapOnly||''));return true}
 const action=target.closest('[data-ct336-action]');if(action&&routeNow()==='discover'){void window.__ctR336?.persistForYou?.(action);return true}
 return false;
}
/* r336 installed the earliest capture listener. Repoint that listener to r337 so legacy listeners never race it. */
window.__ctR336EarlyHandle=earlyHandle337;

const style=document.createElement('style');style.id='ct-web-r337';style.textContent=`
/* Do not flash the history above the landing section while Home is finding its anchor. */
html[data-ct337-home-aligning="1"] [data-home] [data-ct274-history]{visibility:hidden!important}

/* Pra você: card keeps established size; action rail is wider so labels stay readable in one row. */
[data-ct336-foryou]{--ct337-card-w:154px;--ct337-slot-w:190px}
@media(min-width:1100px){[data-ct336-foryou]{--ct337-card-w:176px;--ct337-slot-w:206px}}
[data-ct336-foryou] .ct336-slot{flex:0 0 var(--ct337-slot-w)!important;width:var(--ct337-slot-w)!important;min-width:var(--ct337-slot-w)!important;max-width:var(--ct337-slot-w)!important}
[data-ct336-foryou] .ct336-slot-head,[data-ct336-foryou] .ct336-cardwrap{width:var(--ct337-card-w)!important;min-width:var(--ct337-card-w)!important;max-width:var(--ct337-card-w)!important}
[data-ct336-foryou] .ct336-actions{display:grid!important;width:var(--ct337-slot-w)!important;min-width:var(--ct337-slot-w)!important;max-width:var(--ct337-slot-w)!important;height:28px!important;min-height:28px!important;gap:4px!important;overflow:visible!important}
[data-ct336-foryou] .ct336-actions-two{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions-three{grid-template-columns:1.25fr .88fr .95fr!important}
[data-ct336-foryou] .ct336-actions>.ct336-action{display:flex!important;position:static!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:28px!important;min-height:28px!important;margin:0!important;padding:2px 4px!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
@media(max-width:430px){[data-ct336-foryou]{--ct337-slot-w:186px}[data-ct336-foryou] .ct336-actions>.ct336-action{font-size:8.5px!important;padding-inline:3px!important}}
.ct337-episode-result small{white-space:normal!important}
`;document.head.appendChild(style);

setTimeout(()=>{if(routeNow()==='home')armHome337(desiredHome337());if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'')==='foryou')window.__ctR336?.paintForYou?.()},0);

window.__ctR337={
 version:'1.0.128',rememberHome:rememberHome337,applyHome:applyHome337,alignHome:alignHome337,armHome:armHome337,
 globalSearch:globalSearch337,catalogEpisodes:catalogEpisodes337,mergeEpisodes:mergeEpisodes337,earlyHandle:earlyHandle337,
 setTestBridge(v){testBridge337=v&&typeof v==='object'?v:null}
};
window.__ctR337Test={currentHome337,desiredHome337,rememberHome337,applyHome337,homeAnchor337,alignHome337,normalizeEpisode337,mergeEpisodes337,episodeHtml337,setTestBridge(v){testBridge337=v&&typeof v==='object'?v:null}};
})();
