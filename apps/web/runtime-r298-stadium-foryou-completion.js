/* CineTracker Web 1.0.89 r298 — stadium flow + exact Pra Você completion. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR298)return;
window.__ctR298='stadium-real-controls+exact-foryou-live-pipeline';
window.__ctR298Sports='ct255-real-watch-button+tv-or-stadium+watched-badge';
window.__ctR298Profile='stadium-stat-inside-sports-assisted-only';
window.__ctR298ForYou='1-daily+3-watchlist+3-new+bounded-no-spinner';
window.__ctR298Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||{},M=window.__ctR295Test,S=window.__ctR296Test,discover=R.discover263;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const scoreOf=typeof R.score263==='function'?R.score263:(x=>Number(x?.vote_average||x?.raw_tmdb?.vote_average||0));
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4));
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function host(){try{return R.discoverHost263?.()||q('[data-ct263-discover-content]')}catch{return q('[data-ct263-discover-content]')}}
function anime(x){if(typeOf(x)==='movie')return false;const ids=[...(x?.genre_ids||[]),...((x?.raw_tmdb?.genre_ids)||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))}
function cat(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function dedupe(rows){const seen=new Set(),out=[];for(const x of Array.isArray(rows)?rows:[]){const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function rich(x){return !!(x&&idOf(x)&&posterOf(x)&&Number(yearOf(x)||0)&&Number(scoreOf(x)||0))}
async function hydrate(x){if(!x||!idOf(x))return x;if(rich(x)&&((x?.genre_ids?.length)||(x?.genres?.length)||(x?.raw_tmdb?.genre_ids?.length)))return x;try{if(typeof tmdb!=='function')return x;const d=await tmdb(`/${typeOf(x)}/${idOf(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:typeOf(x),tmdb_id:idOf(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}}
async function pages(path,params,type,count=4){if(typeof tmdb!=='function')return[];const jobs=[];for(let page=1;page<=count;page++)jobs.push(Promise.resolve(tmdb(path,{language:'pt-BR',include_adult:false,...params,page})).catch(()=>({results:[]})));const packs=await Promise.all(jobs),rows=[];for(const p of packs)for(const x of p?.results||[])rows.push({...x,media_type:type,tmdb_id:Number(x?.id||x?.tmdb_id||0)});return dedupe(rows)}
function strict(x,{watch=false}={}){if(!x||!validKey(keyOf(x)))return false;try{if(typeof S?.strictEligible==='function'&&!S.strictEligible(x))return false}catch{return false}try{if(!watch&&typeof M?.blocked==='function'&&M.blocked(x))return false}catch{}return true}
function choose(rows,category,used){const x=(rows||[]).find(v=>cat(v)===category&&!used.has(keyOf(v)));if(x)used.add(keyOf(x));return x||null}
let fyToken=0,fyPinned=null,fyBusy=false;
async function buildForYou298(force=false){
 const token=++fyToken;fyBusy=true;const h=host();if(h)h.innerHTML='<div class="ct263-loading ct298-fy-loading">Montando recomendações pra você…</div>';
 try{
  if(!M||!S||!discover)throw new Error('Autoridade de recomendações indisponível');
  await Promise.all([Promise.resolve(M.authority?.(!!force)),Promise.resolve(S.loadRecent296?.())]);
  if(token!==fyToken||routeNow()!=='discover'||String(discover.tab)!=='foryou')return false;
  const cache=M.cache||{},watchBase=dedupe(cache.watchRows||[]),watchHydrated=await Promise.all(watchBase.slice(0,45).map(hydrate)),watchPool=watchHydrated.filter(x=>strict(x,{watch:true}));
  const [movies,series,animes]=await Promise.all([
   pages('/discover/movie',{'vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.gte':'1991-01-01',sort_by:'vote_average.desc'},'movie',5),
   pages('/discover/tv',{'vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.gte':'1991-01-01',sort_by:'vote_average.desc'},'tv',5),
   pages('/discover/tv',{'with_genres':'16','with_original_language':'ja','vote_average.gte':7.5,'vote_count.gte':30,'first_air_date.gte':'1991-01-01',sort_by:'vote_average.desc'},'tv',4)
  ]);
  if(token!==fyToken||routeNow()!=='discover'||String(discover.tab)!=='foryou')return false;
  const freshPool=dedupe([...movies,...series,...animes]).filter(x=>strict(x));
  const used=new Set();
  const wMovie=choose(watchPool,'movie',used),wSeries=choose(watchPool,'series',used),wAnime=choose(watchPool,'anime',used);
  const daily=choose(freshPool,'movie',used),fMovie=choose(freshPool,'movie',used),fSeries=choose(freshPool,'series',used),fAnime=choose(freshPool,'anime',used);
  const selected=[wMovie,wSeries,wAnime,daily,fMovie,fSeries,fAnime];
  discover.forYou={watch:[wMovie,wSeries,wAnime].filter(Boolean),fresh:[daily,fMovie,fSeries,fAnime].filter(Boolean),picks:daily?[daily]:[]};
  let composed=null;try{composed=S.strictCompose?.()||null}catch{}
  if(composed&&Array.isArray(S.selection)&&S.selection.length===7){fyPinned={watch:discover.forYou.watch.slice(),fresh:discover.forYou.fresh.slice(),picks:discover.forYou.picks.slice()}}
  else fyPinned={watch:[wMovie,wSeries,wAnime].filter(Boolean),fresh:[fMovie,fSeries,fAnime].filter(Boolean),picks:daily?[daily]:[]};
  if(token!==fyToken)return false;
  if(selected.every(Boolean)){
   discover.forYou={watch:fyPinned.watch.slice(),fresh:fyPinned.fresh.slice(),picks:fyPinned.picks.slice()};
   window.__ctR288PaintForYou?.();
   try{const record=[wMovie,wSeries,wAnime,daily,fMovie,fSeries,fAnime].map((x,i)=>({media_type:typeOf(x),tmdb_id:idOf(x),slot:['watch_movie','watch_series','watch_anime','daily','fresh_movie','fresh_series','fresh_anime'][i]}));await rpc('cinetracker_shown_recommendations_record_v296',{p_items:record})}catch{}
   return true;
  }
  window.__ctR288PaintForYou?.();
  const root=q('[data-ct288-foryou]',h);if(root){root.insertAdjacentHTML('afterbegin','<div class="ct298-fy-note">Algumas categorias não têm um título elegível agora. Atualize para tentar novamente.</div>')}
  return false;
 }catch(e){if(token===fyToken&&h)h.innerHTML=`<div class="empty ct298-fy-error">Não foi possível montar o Pra Você agora.<br><small>${esc(e?.message||'Tente novamente.')}</small><br><button type="button" class="chip" data-ct298-fy-retry>Tentar novamente</button></div>`;return false}
 finally{if(token===fyToken)fyBusy=false}
}

/* Keep the exact r298 selection authoritative if an inherited async painter fires later. */
const fyPaintBase=window.__ctR288PaintForYou;
if(typeof fyPaintBase==='function'&&!fyPaintBase.__ctR298Exact){
 const wrapped=function(){if(fyPinned&&discover?.tab==='foryou')discover.forYou={watch:fyPinned.watch.slice(),fresh:fyPinned.fresh.slice(),picks:fyPinned.picks.slice()};return fyPaintBase.apply(this,arguments)};wrapped.__ctR298Exact=true;window.__ctR288PaintForYou=wrapped;
}
const loadBase=window.__ctR288LoadDiscover;
if(typeof loadBase==='function'&&!loadBase.__ctR298Exact){
 const wrapped=function(tab=discover?.tab,force=false){const t=String(tab||discover?.tab||'foryou');if(t!=='foryou'){fyToken++;fyPinned=null;return loadBase.apply(this,arguments)};discover.tab='foryou';fyPinned=null;const out=loadBase.call(this,t,force);void buildForYou298(!!force);return out};wrapped.__ctR298Exact=true;window.__ctR288LoadDiscover=wrapped;
}

/* SPORTS: r255 owns the live button. Capture on window before its document capture handler. */
let sportHistory=new Map(),sportHistoryAt=0,sportSyncBusy=false;
const sportKey=(provider,id)=>`${String(provider||'unknown')}::${String(id||'')}`;
async function history298(force=false){if(!force&&Date.now()-sportHistoryAt<15000&&sportHistory.size)return sportHistory;try{const rows=await rpc('cinetracker_sports_watch_history_v296',{});sportHistory=new Map((Array.isArray(rows)?rows:[]).map(x=>[sportKey(x?.provider,x?.provider_event_id),x]));sportHistoryAt=Date.now()}catch{}return sportHistory}
function cardData(btn){const card=btn?.closest?.('.ct255-sport-card');return{card,provider:String(btn?.dataset?.provider||'unknown'),id:String(btn?.dataset?.ct255Watch||btn?.dataset?.ct296Watch||''),title:(q('h3',card)?.textContent||qa('.ct255-match strong',card).map(x=>x.textContent).filter(Boolean).join(' × ')||'Evento').trim(),venue:(q('.ct255-sport-card>small',card)?.textContent||'').split(' · ').slice(1).join(' · ').trim()||null}}
function closeSportPop(){qa('.ct298-watch-popover').forEach(x=>x.remove())}
function openSportPop(btn){closeSportPop();const {card}=cardData(btn);if(!card)return;const box=document.createElement('div');box.className='ct298-watch-popover';box.innerHTML='<button type="button" data-ct298-choice="screen">📺 Assistido na TV / Tela</button><button type="button" data-ct298-choice="stadium">🏟️ Fui ao Estádio (In Loco)</button><div class="ct298-stadium-form" hidden><input type="text" maxlength="120" data-ct298-stadium placeholder="Nome do Estádio (opcional)"><button type="button" data-ct298-save-stadium>Salvar</button></div><button type="button" class="ct298-pop-close" data-ct298-close aria-label="Fechar">×</button>';card.appendChild(box)}
async function saveSport(btn,inPerson,name,watched=true){const d=cardData(btn);if(!d.id)throw new Error('Evento esportivo sem identificador');await rpc('cinetracker_sports_watch_set_v296',{p_provider:d.provider,p_provider_event_id:d.id,p_sport_slug:null,p_competition_name:null,p_title:d.title,p_starts_at:null,p_attended_in_person:!!inPerson,p_stadium_name:inPerson?(name||null):null,p_watched:!!watched,p_metadata:{venue:d.venue}});sportHistoryAt=0;await history298(true);document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r298-stadium'}}));if(typeof render==='function')await render()}
function addStadiumBadge(card,row){if(!card||!row?.attended_in_person)return;let b=q('[data-ct298-stadium-badge]',card);if(!b){b=document.createElement('span');b.className='ct298-stadium-badge';b.dataset.ct298StadiumBadge='1';card.appendChild(b)}b.textContent='🏟️ No Estádio';b.title=row?.stadium_name?`No Estádio · ${row.stadium_name}`:'No Estádio'}
async function decorateSports298(force=false){if(routeNow()!=='sports')return false;const map=await history298(force);let changed=false;for(const btn of qa('[data-ct255-watch]')){const d=cardData(btn),row=map.get(sportKey(d.provider,d.id));if(row){btn.dataset.watched='1';btn.classList.add('on');btn.textContent='↶ Desmarcar assistido';if(row.attended_in_person){addStadiumBadge(d.card,row);changed=true}}}return changed}
window.addEventListener('click',e=>{
 const btn=e.target?.closest?.('[data-ct255-watch]');if(btn){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();if(btn.dataset.watched==='1'){btn.disabled=true;void saveSport(btn,false,null,false).catch(err=>{try{toast(err?.message||err)}catch{}}).finally(()=>btn.disabled=false)}else openSportPop(btn);return}
 const choice=e.target?.closest?.('[data-ct298-choice]');if(choice){e.preventDefault();e.stopImmediatePropagation();const box=choice.closest('.ct298-watch-popover'),card=box?.closest('.ct255-sport-card'),btn=q('[data-ct255-watch]',card);if(choice.dataset.ct298Choice==='screen'){closeSportPop();if(btn){btn.disabled=true;void saveSport(btn,false,null,true).catch(err=>{try{toast(err?.message||err)}catch{}}).finally(()=>btn.disabled=false)}}else{const f=q('.ct298-stadium-form',box);if(f)f.hidden=false;q('[data-ct298-stadium]',box)?.focus()}return}
 const save=e.target?.closest?.('[data-ct298-save-stadium]');if(save){e.preventDefault();e.stopImmediatePropagation();const box=save.closest('.ct298-watch-popover'),card=box?.closest('.ct255-sport-card'),btn=q('[data-ct255-watch]',card),name=q('[data-ct298-stadium]',box)?.value?.trim()||null;closeSportPop();if(btn){btn.disabled=true;void saveSport(btn,true,name,true).catch(err=>{try{toast(err?.message||err)}catch{}}).finally(()=>btn.disabled=false)}return}
 if(e.target?.closest?.('[data-ct298-close]')){e.preventDefault();e.stopImmediatePropagation();closeSportPop();return}
 const retry=e.target?.closest?.('[data-ct298-fy-retry]');if(retry){e.preventDefault();e.stopImmediatePropagation();void buildForYou298(true)}
},true);

/* PROFILE: remove misplaced legacy stat and attach it only to the Esportes assistidos panel. */
function sportsPanel(root){const headings=qa('h1,h2,h3,h4,.panel-title,.section-title',root);const h=headings.find(x=>norm(x.textContent).includes('esportes assistidos'));return h?.closest?.('.panel,section,article')||h?.parentElement||null}
function placeStadiumStat(count){const root=q('[data-profile]');if(!root)return false;qa('[data-ct296-stadium-stat],[data-ct298-stadium-stat]',root).forEach(x=>x.remove());const panel=sportsPanel(root);if(!panel)return false;const grid=q('.stats,.stats-grid,.profile-stats,.stat-grid,[data-stats]',panel)||panel;const card=document.createElement('div');card.className='stat ct298-profile-stat';card.dataset.ct298StadiumStat='1';card.innerHTML=`<small>Jogos no Estádio</small><b>${Number(count||0).toLocaleString('pt-BR')}</b>`;grid.appendChild(card);return true}
async function repairProfile298(){if(routeNow()!=='profile')return false;try{const s=await rpc('cinetracker_sports_stadium_summary_v296',{}),count=Number(s?.stadium_events??s?.[0]?.stadium_events??0);return placeStadiumStat(count)}catch{return false}}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);queueMicrotask(()=>void repairProfile298());setTimeout(()=>void repairProfile298(),180);return out}}}catch{}

/* Finite reconciliation covers authenticated renders without a perpetual observer. */
let reconcileTimer=0;function reconcile298(){clearTimeout(reconcileTimer);let n=0;const tick=()=>{n++;if(routeNow()==='sports')void decorateSports298(n===1);if(routeNow()==='profile')void repairProfile298();if(n<12)reconcileTimer=setTimeout(tick,350)};tick()}
document.addEventListener('cinetracker:data-changed',reconcile298);window.addEventListener('popstate',reconcile298);for(const ms of[0,250,900])setTimeout(reconcile298,ms);

window.__ctR298Test={anime,cat,dedupe,strict,buildForYou298,cardData,placeStadiumStat,sportsPanel,decorateSports298,history298,get forYouBusy(){return fyBusy},get pinned(){return fyPinned}};
})();