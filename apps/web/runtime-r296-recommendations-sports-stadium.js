/* CineTracker Web 1.0.87 r296 — strict recommendations, four-tab sports, stadium metadata and Web polish. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR296)return;
window.__ctR296='strict-foryou-four-sports-stadium-web-polish';
window.__ctR296ForYou='score-7.5+year-1990+genre+wwe+seven-day+exact-slots+zero-duplicates';
window.__ctR296Sports='today+72h+favorites+watched+stadium';
window.__ctR296Profile='stadium-total';
window.__ctR296Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||globalThis;
const DAY=86400000,SEVEN=7*DAY;
const asRows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.media_title||x?.title||x?.name||'');
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4));
const scoreOf=typeof R.score263==='function'?R.score263:(x=>Number(x?.vote_average||x?.raw_tmdb?.vote_average||0));
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):\d+$/.test(String(k||''))&&!String(k).endsWith(':0');
const discover=R.discover263||null;

function saoDay(ms=Date.now()){
 try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ms))}
 catch{return new Date(ms).toISOString().slice(0,10)}
}
function anime(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...asRows(x?.genre_ids),...asRows(x?.raw_tmdb?.genre_ids),...asRows(x?.genres).map(g=>Number(g?.id||0))].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...asRows(x?.origin_country),...asRows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function genreTokens(x){
 const ids=[...asRows(x?.genre_ids),...asRows(x?.raw_tmdb?.genre_ids),...asRows(x?.genres).map(g=>Number(g?.id||0))].map(Number).filter(Boolean);
 const names=asRows(x?.genres).map(g=>norm(g?.name||g)).filter(Boolean);
 return {ids:[...new Set(ids)],names:[...new Set(names)]};
}
function pureDramaDocumentary(x){
 const g=genreTokens(x),allIds=g.ids.length&&g.ids.every(id=>id===18||id===99),allNames=g.names.length&&g.names.every(n=>n==='drama'||n==='documentario'||n==='documentary');
 return !!(allIds||allNames);
}
const WWE_RE=/(^| )(wwe|world wrestling entertainment|wrestlemania|royal rumble|summerslam|summer slam|survivor series|money in the bank|elimination chamber|wwe nxt|nxt|wwe raw|monday night raw|wwe smackdown|friday night smackdown)( |$)/;
function wweRelated(x){
 const extra=[x?.overview,x?.tagline,...asRows(x?.networks).map(v=>v?.name),...asRows(x?.production_companies).map(v=>v?.name)].filter(Boolean).join(' ');
 return WWE_RE.test(norm(`${titleOf(x)} ${extra}`));
}
function dedupe(rows){const s=new Set(),out=[];for(const x of asRows(rows)){const k=keyOf(x);if(!validKey(k)||s.has(k))continue;s.add(k);out.push(x)}return out}

const RECENT_KEY='ct:r296:shown-recommendations:v1';
let backendRecent=new Set(),sessionPinned=new Set(),lastSelection=[],rotation=0,recordBusy=false;
function localRecent(){
 try{
  const now=Date.now(),raw=JSON.parse(localStorage.getItem(RECENT_KEY)||'[]'),keep=asRows(raw).filter(x=>validKey(x?.key)&&now-Number(x?.at||0)<SEVEN);
  if(keep.length!==asRows(raw).length)localStorage.setItem(RECENT_KEY,JSON.stringify(keep));
  return new Set(keep.map(x=>x.key));
 }catch{return new Set()}
}
function saveRecent(keys){
 try{
  const now=Date.now(),raw=asRows(JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')).filter(x=>validKey(x?.key)&&now-Number(x?.at||0)<SEVEN);
  const map=new Map(raw.map(x=>[x.key,x]));for(const key of keys)if(validKey(key))map.set(key,{key,at:now});
  localStorage.setItem(RECENT_KEY,JSON.stringify([...map.values()]));
 }catch{}
}
function recentSet(){return new Set([...localRecent(),...backendRecent])}
function strictEligible(x,{allowRecent=false}={}){
 const k=keyOf(x),year=Number(yearOf(x)||0),score=Number(scoreOf(x)||0);
 if(!validKey(k)||!posterOf(x)||score<7.5||year<=1990||wweRelated(x)||pureDramaDocumentary(x))return false;
 if(!allowRecent&&recentSet().has(k)&&!sessionPinned.has(k))return false;
 return true;
}
function dailyIndex(n){if(!n)return 0;const d=new Date(),stamp=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);return stamp%n}
function r293SeenStorageKey(){
 let uid='anon';try{uid=String(window.user?.id||globalThis.user?.id||'anon')}catch{}
 const d=new Date(`${saoDay()}T12:00:00Z`),wd=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-wd);
 return `ct293:foryou:fresh-seen:${uid}:${d.toISOString().slice(0,10)}`;
}
function releaseSessionPinsFromR293(){
 try{
  const key=r293SeenStorageKey(),arr=asRows(JSON.parse(localStorage.getItem(key)||'[]')).map(String).filter(k=>!sessionPinned.has(k));
  localStorage.setItem(key,JSON.stringify([...new Set(arr)]));
 }catch{}
}
function strictCompose(){
 if(!discover?.forYou)return null;
 const d=discover.forYou,watchPool=dedupe(d.watch).filter(x=>strictEligible(x)),freshPool=dedupe(d.fresh).filter(x=>strictEligible(x));
 const used=new Set(),pick=(rows,cat,offset=0)=>{
  const filtered=rows.filter(x=>category(x)===cat&&!used.has(keyOf(x)));
  if(!filtered.length)return null;
  const item=filtered[Math.min(offset,filtered.length-1)];used.add(keyOf(item));return item;
 };
 const wMovie=pick(watchPool,'movie'),wSeries=pick(watchPool,'series'),wAnime=pick(watchPool,'anime');
 const movies=freshPool.filter(x=>category(x)==='movie'&&!used.has(keyOf(x)));
 const daily=movies.length?movies[rotation%movies.length]:null;if(daily)used.add(keyOf(daily));
 const fMovie=pick(freshPool,'movie'),fSeries=pick(freshPool,'series'),fAnime=pick(freshPool,'anime');
 const selected=[wMovie,wSeries,wAnime,daily,fMovie,fSeries,fAnime].filter(Boolean);
 const expected={watch:[wMovie,wSeries,wAnime].filter(Boolean),fresh:[fMovie,fSeries,fAnime].filter(Boolean),daily};
 if(new Set(selected.map(keyOf)).size!==selected.length)throw new Error('r296 duplicate recommendation selection');
 const extras=freshPool.filter(x=>!used.has(keyOf(x)));
 let fresh=[...expected.fresh,...extras];
 if(daily&&fresh.length){
  if(!fresh.some(x=>keyOf(x)===keyOf(daily)))fresh.push(daily);
  const target=dailyIndex(fresh.length),at=fresh.findIndex(x=>keyOf(x)===keyOf(daily));
  if(at>=0&&at!==target)[fresh[target],fresh[at]]=[fresh[at],fresh[target]];
 }
 d.watch=expected.watch;
 d.fresh=fresh;
 d.picks=daily?[daily]:[];
 try{
  if(typeof ct288State==='object'&&ct288State&&fMovie){
   const grouped=fresh.filter(x=>category(x)==='movie'),idx=grouped.findIndex(x=>keyOf(x)===keyOf(fMovie));
   if(idx>=0)ct288State.freshIndex.movie=idx;
  }
 }catch{}
 lastSelection=selected.map(x=>({key:keyOf(x),media_type:typeOf(x)==='movie'?'movie':'tv',tmdb_id:Number(idOf(x)),slot:x===daily?'daily':expected.watch.includes(x)?`watch_${category(x)}`:`fresh_${category(x)}`}));
 releaseSessionPinsFromR293();
 return expected;
}
async function loadRecent296(){
 if(typeof rpc!=='function')return;
 try{
  const rows=await rpc('cinetracker_shown_recommendations_recent_v296',{p_days:7});
  backendRecent=new Set(asRows(rows).map(x=>`${String(x?.media_type)==='movie'?'movie':'tv'}:${Number(x?.tmdb_id||0)}`).filter(validKey));
 }catch{}
}
async function recordSelection296(){
 if(recordBusy||!lastSelection.length)return;
 const root=document.querySelector('[data-ct288-foryou]');if(!root)return;
 const visible=new Set(lastSelection.map(x=>x.key));sessionPinned=visible;saveRecent(visible);
 for(const k of visible)backendRecent.add(k);
 recordBusy=true;
 try{if(typeof rpc==='function')await rpc('cinetracker_shown_recommendations_record_v296',{p_items:lastSelection})}catch{}finally{recordBusy=false}
}
const basePaint296=typeof paintForYou263==='function'?paintForYou263:null;
if(basePaint296)paintForYou263=function(){
 strictCompose();
 const out=basePaint296.apply(this,arguments);
 queueMicrotask(()=>{sessionPinned=new Set(lastSelection.map(x=>x.key));releaseSessionPinsFromR293();void recordSelection296()});
 return out;
};
window.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct288-refresh],[data-ct263-swap]')){rotation++;sessionPinned.clear()}
},true);
void loadRecent296().then(()=>{try{if(discover?.tab==='foryou'&&typeof paintForYou263==='function')paintForYou263()}catch{}});

/* SPORTS — mutate the existing r255 authority in place so F1/order fixes from later runtimes remain intact. */
function startMs(x){return new Date(x?.starts_at||x?.start_time||x?.date||0).getTime()||0}
function finished(x){return ['finished','ended','final','completed'].includes(String(x?.status||'').toLowerCase())}
function sportsRows296(p,tab){
 const now=Date.now(),from=now-72*3600000,events=asRows(p?.events),hist=asRows(p?.watch_history);let rows=[];
 if(tab==='watched')rows=hist;
 else if(tab==='next')rows=events.filter(x=>saoDay(startMs(x))===saoDay(now)&&!finished(x));
 else if(tab==='previous')rows=events.filter(x=>{const t=startMs(x);return t<now&&t>=from});
 else if(tab==='favorites')rows=events.filter(x=>x?.has_favorite===true||x?.has_favorite===1);
 if(typeof sport255!=='undefined'&&sport255?.sport&&sport255.sport!=='all')rows=rows.filter(x=>String(x?.sport_slug||'')===sport255.sport);
 return rows.sort((a,b)=>tab==='previous'||tab==='watched'?startMs(b)-startMs(a):startMs(a)-startMs(b));
}
try{
 if(typeof SPORT_TABS255!=='undefined'&&Array.isArray(SPORT_TABS255)){
  SPORT_TABS255.splice(0,SPORT_TABS255.length,['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']);
  if(typeof sport255!=='undefined'&&sport255?.tab==='live')sport255.tab='next';
 }
 if(typeof sportRows255==='function')sportRows255=sportsRows296;
}catch{}

const baseLoadSports296=typeof loadSports255==='function'?loadSports255:null;
if(baseLoadSports296)loadSports255=async function(force=false){
 const p=await baseLoadSports296.call(this,force);
 try{
  const hist=await rpc('cinetracker_sports_watch_history_v296',{});
  if(Array.isArray(hist)){
   p.watch_history=hist;
   const watched=new Map(hist.map(x=>[`${String(x?.provider||'')}:${String(x?.provider_event_id||'')}`,x]));
   for(const e of asRows(p.events)){const h=watched.get(`${String(e?.provider||'')}:${String(e?.provider_event_id||e?.event_id||e?.id||'')}`);if(h){e.is_watched=true;e.sport_watched_at=h.watched_at;e.attended_in_person=!!h.attended_in_person;e.stadium_name=h.stadium_name||null}}
   if(p.stats)p.stats.watched_events=hist.length;
  }
 }catch{}
 return p;
};

const baseSportCard296=typeof sportCard255==='function'?sportCard255:null;
if(baseSportCard296)sportCard255=function(e,p){
 let html=baseSportCard296.call(this,e,p);
 html=html.replaceAll('data-ct255-watch=','data-ct296-watch=');
 if(e?.attended_in_person)html=html.replace('</article>',`<span class="ct296-stadium-badge" title="${esc(e?.stadium_name||'Assistido no estádio')}">🏟️ No Estádio</span></article>`);
 return html;
};
function eventForButton(btn){
 const provider=String(btn?.dataset?.provider||''),id=String(btn?.dataset?.ct296Watch||'');
 const p=typeof sport255!=='undefined'?sport255?.payload:null;
 return [...asRows(p?.events),...asRows(p?.watch_history)].find(x=>String(x?.provider_event_id||x?.event_id||x?.id||'')===id&&(!provider||String(x?.provider||'')===provider))||{provider,provider_event_id:id,title:'Evento'};
}
function closeSportsPopover(){document.querySelectorAll('.ct296-watch-popover').forEach(x=>x.remove())}
function openSportsPopover(btn,e){
 closeSportsPopover();const box=document.createElement('div');box.className='ct296-watch-popover';box.dataset.ct296Event=String(e?.provider_event_id||e?.event_id||e?.id||'');
 box.innerHTML=`<button type="button" class="ct296-choice" data-ct296-choice="screen">📺 Assistido na TV / Tela</button><button type="button" class="ct296-choice" data-ct296-choice="stadium">🏟️ Fui ao Estádio (In Loco)</button><div class="ct296-stadium-form" hidden><input type="text" maxlength="120" data-ct296-stadium-name placeholder="Nome do Estádio (opcional)"><button type="button" data-ct296-save-stadium>Salvar</button></div><button type="button" class="ct296-close" data-ct296-close aria-label="Fechar">×</button>`;
 btn.closest('.ct255-sport-card')?.appendChild(box);
}
async function saveSport296(e,inPerson=false,stadiumName=null,watched=true){
 await rpc('cinetracker_sports_watch_set_v296',{
  p_provider:String(e?.provider||'unknown'),p_provider_event_id:String(e?.provider_event_id||e?.event_id||e?.id||''),
  p_sport_slug:e?.sport_slug||null,p_competition_name:e?.competition_name||null,p_title:e?.title||[e?.home_name,e?.away_name].filter(Boolean).join(' × ')||'Evento',
  p_starts_at:e?.starts_at||e?.start_time||e?.date||null,p_attended_in_person:!!inPerson,p_stadium_name:stadiumName||null,p_watched:!!watched,
  p_metadata:{venue:e?.venue||null,home_name:e?.home_name||null,away_name:e?.away_name||null}
 });
 try{sport255.payload=null;sport255.at=0;await loadSports255(true);if(String(route())==='sports')paintSports255()}catch{}
 document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r296-sports-watch'}}));
}
window.addEventListener('click',e=>{
 const watch=e.target?.closest?.('[data-ct296-watch]');
 if(watch){e.preventDefault();e.stopPropagation();const ev=eventForButton(watch);if(watch.dataset.watched==='1'){watch.disabled=true;void saveSport296(ev,false,null,false).finally(()=>watch.disabled=false)}else openSportsPopover(watch,ev);return}
 const choice=e.target?.closest?.('[data-ct296-choice]');
 if(choice){e.preventDefault();const box=choice.closest('.ct296-watch-popover'),btn=box?.closest('.ct255-sport-card')?.querySelector('[data-ct296-watch]'),ev=eventForButton(btn);if(choice.dataset.ct296Choice==='screen'){void saveSport296(ev,false,null,true);closeSportsPopover()}else{const form=box?.querySelector('.ct296-stadium-form');if(form)form.hidden=false;box?.querySelector('[data-ct296-stadium-name]')?.focus()}return}
 const save=e.target?.closest?.('[data-ct296-save-stadium]');
 if(save){e.preventDefault();const box=save.closest('.ct296-watch-popover'),btn=box?.closest('.ct255-sport-card')?.querySelector('[data-ct296-watch]'),ev=eventForButton(btn),name=box?.querySelector('[data-ct296-stadium-name]')?.value?.trim()||null;void saveSport296(ev,true,name,true);closeSportsPopover();return}
 if(e.target?.closest?.('[data-ct296-close]')){e.preventDefault();closeSportsPopover()}
},true);

/* PROFILE — append one real metric sourced from sports_watch_history. */
function injectStadiumMetric296(count){
 const root=document.querySelector('[data-profile]');if(!root)return false;
 let card=root.querySelector('[data-ct296-stadium-stat]');
 if(!card){card=document.createElement('div');card.className='stat ct296-profile-stat';card.dataset.ct296StadiumStat='1';card.innerHTML='<small>Jogos no Estádio</small><b>0</b>';const host=root.querySelector('.stats,.stats-grid,.profile-stats,.stat-grid,[data-stats]')||root;host.appendChild(card)}
 const val=card.querySelector('b,strong,.value,.stat-value');if(val)val.textContent=Number(count||0).toLocaleString('pt-BR');return true;
}
const baseProfile296=typeof renderProfile==='function'?renderProfile:null;
if(baseProfile296)renderProfile=async function(...args){
 const out=await baseProfile296.apply(this,args);
 try{if(String(route())==='profile'){const s=await rpc('cinetracker_sports_stadium_summary_v296',{}),count=Number(s?.stadium_events??s?.[0]?.stadium_events??0);injectStadiumMetric296(count)}}catch{}
 return out;
};

/* HOME micro-polish: keep layout, reduce action footprint and make the canonical watched control icon-only. */
function polishHome296(root=document){
 for(const btn of root.querySelectorAll?.('[data-home] .ct264-watch-btn')||[]){btn.setAttribute('aria-label','Marcar como assistido');btn.title='Marcar como assistido';btn.textContent='✓'}
}
const polishObserver=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)polishHome296(n)});
try{polishObserver.observe(document.documentElement,{subtree:true,childList:true});polishHome296(document)}catch{}

window.__ctR296Test={strictEligible,pureDramaDocumentary,wweRelated,category,sportsRows296,saoDay,strictCompose,loadRecent296,recordSelection296,injectStadiumMetric296,get selection(){return lastSelection.slice()}};
})();