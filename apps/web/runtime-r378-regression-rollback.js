/* CineTracker Web 1.0.169 r378 — regression rollback: v359 Home + isolated Pra Voce owner. */
(()=>{
'use strict';
if(window.__ctR378?.version==='1.0.169')return;
window.__ctR378Marker='home-v359-cache-first+semantic-anchor+foryou-isolated-dom-owner';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

/* ---------- HOME: undo r377 payload regression, preserve a live snapshot across routes ---------- */
let homeSnapshot=null,homeRefreshRun=0;
const validHome=p=>!!p&&typeof p==='object'&&['series','movie_watchlist','history_episodes','history_movies'].every(k=>Array.isArray(p[k]));
function activeHomeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function saveHomeSnapshot(p){
 if(!validHome(p))return false;homeSnapshot=p;window.__ctR378HomeSnapshot=p;
 try{sessionStorage.setItem('ct379:home-snapshot',JSON.stringify(p))}catch{}
 return true;
}
function captureHome(){
 let p=null;try{p=typeof ct274Payload==='function'?ct274Payload():homeCache}catch{}
 if(validHome(p)){saveHomeSnapshot(p);return p}return null;
}
function prepareHome(p){if(!validHome(p))return false;try{homeCache=p}catch{};try{window.__ctR359?.fastPrepareHome?.(p)}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};return true}
function settleHome(kind=activeHomeKind()){
 try{window.__ctR371?.preserveAfterPaint?.()}catch{}
 const align=()=>{if(routeNow()==='home'){try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR375?.align?.(kind)}catch{}}};
 queueMicrotask(align);for(const ms of [40,180,520,950])setTimeout(align,ms);
}
function paintPreparedHome(p,kind=activeHomeKind()){
 if(!prepareHome(p)||routeNow()!=='home')return false;
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else if(typeof paintHome==='function')paintHome()}catch{return false}
 captureHome();settleHome(kind);
 Promise.resolve(window.__ctR376?.hydrateHome?.(false)).finally(()=>settleHome(kind));
 return true;
}
async function refreshHomeInBackground(seq,kind){
 const run=++homeRefreshRun;
 try{
  const data=await ct274FetchHome();
  if(run!==homeRefreshRun||seq!==navSeq||!validHome(data))return false;
  saveHomeSnapshot(data);
  document.documentElement.dataset.ct378HomeRefresh='stored-next-navigation';
  return true;
 }catch(e){
  document.documentElement.dataset.ct378HomeRefresh='failed-cache-kept';
  return false;
 }
}
let baseRenderHome378=null;
try{baseRenderHome378=renderHome}catch{}
async function renderHome378(seq){
 const snap=validHome(homeSnapshot)?homeSnapshot:captureHome(),kind=activeHomeKind();
 if(!validHome(snap)){
  const out=baseRenderHome378?await baseRenderHome378.apply(this,arguments):null;
  captureHome();settleHome(activeHomeKind());return out;
 }
 try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 paintPreparedHome(snap,kind);
 void refreshHomeInBackground(seq,kind);
 document.documentElement.dataset.ct378HomePaint='snapshot-first';
 return snap;
}
try{renderHome=renderHome378}catch{}
function wrapHomePaint(name){
 try{
  const base=eval(name);if(typeof base!=='function')return;
  const wrapped=function(){const out=base.apply(this,arguments);captureHome();settleHome(activeHomeKind());return out};
  if(name==='paintHome')paintHome=wrapped;else if(name==='ct274PaintHome')ct274PaintHome=wrapped;else if(name==='ct275PaintHome')ct275PaintHome=wrapped;
 }catch{}
}
wrapHomePaint('paintHome');wrapHomePaint('ct274PaintHome');wrapHomePaint('ct275PaintHome');

/* ---------- PRA VOCE: isolated DOM/classes so legacy button writers cannot touch it ---------- */
let fyLoadRun=0;const fyLocks=new Set(),fyExcluded=new Map();
let fyAuthority={blocked:new Set(),watch:new Set(),seen:new Set(),ready:false};
const host=()=>q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
const state=()=>window.__ctR309Test?.state||null;
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>idOf(x)>0?typeOf(x)+':'+idOf(x):'';
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const titleOf=x=>x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
const isWWE=x=>/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x)));
function pool(st,name){if(!st)return[];if(name==='daily')return rows(st.dailyPool);const[b,k]=String(name).split(':');return rows(st?.[b+'Pools']?.[k])}
function indexOfSlot(st,name){if(name==='daily')return Number(st?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(st?.[b+'Index']?.[k]||0)}
function current(name,st=state()){const p=pool(st,name);if(!p.length)return null;return p[((indexOfSlot(st,name)%p.length)+p.length)%p.length]||null}
function cloneState(st=state()){if(!st)return null;return{...st,dailyPool:[...rows(st.dailyPool)],watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},watchIndex:{...(st.watchIndex||{})},freshIndex:{...(st.freshIndex||{})}}}
function saveState(st){window.__ctR309Test?.setForYouState?.(st);return st}
function allItems(st=state()){if(!st)return[];return [...rows(st.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(st.watchPools?.[k]),...rows(st.freshPools?.[k])])]}
function hasAny(st=state()){return allItems(st).length>0}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
async function audit(st=state()){
 if(!st)return null;let a=null;
 try{if(typeof window.__ctR321?.exact==='function')a=await window.__ctR321.exact(allItems(st))}catch{}
 if(!a&&typeof rpc==='function')try{
  const items=unique(allItems(st)).map(x=>({media_type:typeOf(x),tmdb_id:idOf(x),title:titleOf(x),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)||null})).filter(x=>x.tmdb_id>0);
  const p=await rpc('cinetracker_discover_filter_v322',{p_items:items});
  a={blocked:new Set(rows(p?.blocked_keys).map(String)),watch:new Set(rows(p?.watch_keys).map(String)),seen:new Set(rows(p?.seen_keys).map(String))};
 }catch{}
 if(!a)try{a=await window.__ctR319?.personal?.(false)}catch{}
 const blocked=new Set(a?.blocked||[]),watch=new Set(a?.watch||[]),seen=new Set(a?.seen||[]);for(const k of seen)blocked.add(k);
 fyAuthority={blocked,watch,seen,ready:true};
 const next=cloneState(st);
 for(const k of ['movie','series','anime']){
  next.watchPools[k]=unique(next.watchPools[k]).filter(x=>watch.size?watch.has(keyOf(x))&&!seen.has(keyOf(x)):!seen.has(keyOf(x)));
  next.freshPools[k]=unique(next.freshPools[k]).filter(x=>!blocked.has(keyOf(x))&&!watch.has(keyOf(x))&&!seen.has(keyOf(x))&&!isWWE(x));
  next.watchIndex[k]=0;next.freshIndex[k]=0;
 }
 next.dailyPool=unique(next.dailyPool).filter(x=>!blocked.has(keyOf(x))&&!watch.has(keyOf(x))&&!seen.has(keyOf(x))&&!isWWE(x));next.dailyIndex=0;
 return saveState(next);
}
function fyKind(){const k=String(state()?.fyKind||'all');return ['movie','series','anime'].includes(k)?k:'all'}
function setFyKind(k){const st=state();if(st)st.fyKind=['movie','series','anime'].includes(k)?k:'all';applyFilter()}
function cardHtml(x){
 if(!x)return '<div class="ct378-placeholder"><div class="ct378-poster-skeleton"></div><b>Buscando indicação…</b></div>';
 try{if(typeof ct288Card==='function')return ct288Card(x,{watch:false,add:false,slot:true})}catch{}
 const p=posterOf(x),src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct378-fallback-card" data-media="'+typeOf(x)+':'+idOf(x)+'"><div class="ct378-poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>';
}
function actionHtml(name,x){
 if(!x)return'';const watch=name.startsWith('watch:'),spec=watch?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
 return '<div class="ct378-actions">'+spec.map(([label,action])=>'<button type="button" data-ct378-action="'+action+'" data-ct378-slot-action="'+esc(name)+'">'+label+'</button>').join('')+'</div>';
}
function labelFor(k){return k==='movie'?'Filme':k==='anime'?'Anime':'Série'}
function slotHtml(name){
 const x=current(name),kind=name==='daily'?(x?kindOf(x):'movie'):String(name).split(':')[1];
 return '<div class="ct378-slot" data-ct378-slot="'+esc(name)+'" data-ct378-kind="'+esc(kind)+'">'+(name==='daily'?'':'<h3>'+labelFor(kind)+'</h3>')+'<div class="ct378-cardwrap">'+cardHtml(x)+'</div>'+actionHtml(name,x)+'</div>';
}
function blockHtml(title,bucket){
 if(bucket==='daily')return '<section class="panel ct378-block ct378-daily" data-ct378-section="daily"><div class="panel-head"><h2>'+title+'</h2></div><div class="ct378-rail">'+slotHtml('daily')+'</div></section>';
 return '<section class="panel ct378-block" data-ct378-section="'+bucket+'"><div class="panel-head"><h2>'+title+'</h2></div><div class="ct378-rail">'+['movie','series','anime'].map(k=>slotHtml(bucket+':'+k)).join('')+'</div></section>';
}
function renderForYou(){
 if(routeNow()!=='discover')return false;const h=host();if(!h)return false;
 h.innerHTML='<div data-ct378-foryou><div class="ct378-filters">'+[['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']].map(([k,l])=>'<button type="button" class="'+(fyKind()===k?'active':'')+'" data-ct378-filter="'+k+'">'+l+'</button>').join('')+'</div>'+blockHtml('Indicação do Dia','daily')+blockHtml('Da sua Watchlist','watch')+blockHtml('100% novos','fresh')+'</div>';
 h.dataset.ct378Owned='1';const line=q('[data-ct319-loadline]');if(line){line.hidden=true;line.textContent=''}applyFilter();return true;
}
function applyFilter(){
 const root=q('[data-ct378-foryou]');if(!root)return false;const k=fyKind();
 for(const b of qa('[data-ct378-filter]',root))b.classList.toggle('active',b.dataset.ct378Filter===k);
 for(const slot of qa('[data-ct378-slot]',root)){const show=k==='all'||slot.dataset.ct378Kind===k;slot.hidden=!show}
 for(const block of qa('[data-ct378-section]',root)){const slots=qa('[data-ct378-slot]',block);block.hidden=!slots.some(s=>!s.hidden)}
 return true;
}
function renderSlot(name){
 const root=q('[data-ct378-foryou]'),old=q('[data-ct378-slot="'+CSS.escape(name)+'"]',root);if(!old)return renderForYou();
 const t=document.createElement('template');t.innerHTML=slotHtml(name);old.replaceWith(t.content.firstElementChild);applyFilter();return true;
}
function setSlotItem(name,item){
 const st=cloneState();if(!st||!item)return false;const p=pool(st,name),idx=p.findIndex(x=>keyOf(x)===keyOf(item));if(idx<0)return false;
 if(name==='daily')st.dailyIndex=idx;else{const[b,k]=name.split(':');st[b+'Index'][k]=idx}saveState(st);return true;
}
function exclusion(name){if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)}
function freshEligible(x,kind){
 const k=keyOf(x),score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);
 return !!k&&!!posterOf(x)&&kindOf(x)===kind&&!isWWE(x)&&score>=6&&year>=1980&&!fyAuthority.blocked.has(k)&&!fyAuthority.watch.has(k)&&!fyAuthority.seen.has(k);
}
async function refillFresh(kind){
 const st=state();if(!st||typeof tmdb!=='function')return false;
 if(unique(st.freshPools?.[kind]).filter(x=>freshEligible(x,kind)).length>=3)return true;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3000),base=2+Math.floor(Math.random()*8),pages=[base,base+4,base+9];
 try{
  const jobs=pages.map(page=>kind==='movie'
   ?tmdb('/discover/movie',{page,sort_by:'popularity.desc',include_adult:false,'primary_release_date.lte':new Date().toISOString().slice(0,10)},{signal:controller.signal,timeout:3000})
   :kind==='anime'
    ?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','first_air_date.lte':new Date().toISOString().slice(0,10)},{signal:controller.signal,timeout:3000})
    :tmdb('/discover/tv',{page,sort_by:'popularity.desc','first_air_date.lte':new Date().toISOString().slice(0,10)},{signal:controller.signal,timeout:3000}));
  const packs=await Promise.allSettled(jobs),raw=packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}));
  const next=cloneState(),old=unique(next.freshPools?.[kind]),seen=new Set(old.map(keyOf)),add=[];
  for(const x of raw){const k=keyOf(x);if(!freshEligible(x,kind)||seen.has(k))continue;seen.add(k);add.push(x);if(add.length>=35)break}
  next.freshPools[kind]=[...old,...add].slice(-80);if(!Number.isFinite(next.freshIndex[kind]))next.freshIndex[kind]=0;saveState(next);return next.freshPools[kind].length>0;
 }catch{return false}finally{clearTimeout(timer)}
}
async function refillSlot(name){
 if(name.startsWith('fresh:'))return refillFresh(name.split(':')[1]);
 try{if(typeof window.__ctR363?.refill==='function'){await window.__ctR363.refill(name,{force:true});return pool(state(),name).length>1}}catch{}
 try{if(typeof window.__ctR309?.buildForYou==='function'){await window.__ctR309.buildForYou(true);await audit(state());return pool(state(),name).length>1}}catch{}
 return false;
}
async function swap(name,btn){
 if(fyLocks.has(name))return false;fyLocks.add(name);if(btn)btn.disabled=true;
 try{
  const ex=exclusion(name),cur=keyOf(current(name));if(cur)ex.add(cur);
  let p=pool(state(),name),eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)));
  if(!eligible.length){await refillSlot(name);p=pool(state(),name);eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)))}
  if(!eligible.length)eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur);
  if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)];ex.add(keyOf(item));if(!setSlotItem(name,item))return false;renderSlot(name);return true;
 }finally{fyLocks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function removeKeyFallback(action,key,name){
 const st=cloneState();if(!st)return false;
 if(action==='seen'){for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])st[b+'Pools'][k]=rows(st[b+'Pools'][k]).filter(x=>keyOf(x)!==key);st.dailyPool=rows(st.dailyPool).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){for(const k of ['movie','series','anime'])st.freshPools[k]=rows(st.freshPools[k]).filter(x=>keyOf(x)!==key);st.dailyPool=rows(st.dailyPool).filter(x=>keyOf(x)!==key)}
 for(const k of ['movie','series','anime']){st.watchIndex[k]=0;st.freshIndex[k]=0}st.dailyIndex=0;saveState(st);return true;
}
async function persist(action,key){
 try{if(typeof window.__ctR365?.persistDirect==='function')return await window.__ctR365.persistDirect(action,key)}catch{}
 const[t,idRaw]=String(key).split(':'),id=Number(idRaw||0);if(!(id>0))return false;
 if(action==='watchlist'&&typeof addWatchlist==='function')return addWatchlist(t,id);
 if(action==='seen'&&typeof markSeen==='function')return markSeen(t,id);
 return false;
}
function act(action,name,btn){
 if(action==='swap'){void swap(name,btn);return true}
 const item=current(name),key=keyOf(item);if(!key)return false;
 let tx=null;try{tx=window.__ctR359Test?.mutate359?.(action,key,name)}catch{}
 if(!tx)removeKeyFallback(action,key,name);renderSlot(name);
 void Promise.resolve(persist(action,key)).then(async()=>{if(action==='seen')fyAuthority.seen.add(key);if(action==='watchlist')fyAuthority.watch.add(key);fyAuthority.blocked.add(key);if(name.startsWith('fresh:')){await refillFresh(name.split(':')[1]);renderSlot(name)}}).catch(e=>{try{toast(e?.message||String(e))}catch{}});
 return true;
}
function actionMeta(target){const b=target?.closest?.('[data-ct378-action]');if(!b)return null;const name=String(b.dataset.ct378SlotAction||''),action=String(b.dataset.ct378Action||'');return name&&['swap','seen','watchlist'].includes(action)?{btn:b,name,action}:null}
function stop(e){e?.preventDefault?.();e?.stopImmediatePropagation?.();e?.stopPropagation?.()}
function early378(target,event){
 if(window.__ctR380ForYouOwner&&typeof window.__ctR380Early==='function')return window.__ctR380Early(target,event);
 if(window.__ctR379ForYouOwner&&typeof window.__ctR379Early==='function')return window.__ctR379Early(target,event);
 if(!target?.closest)return false;
 const meta=actionMeta(target);if(meta&&routeNow()==='discover'){stop(event);act(meta.action,meta.name,meta.btn);return true}
 const filter=target.closest('[data-ct378-filter]');if(filter&&routeNow()==='discover'){stop(event);setFyKind(String(filter.dataset.ct378Filter||'all'));return true}
 const tab=target.closest('[data-ct319-tab="foryou"]');if(tab&&routeNow()==='discover'){stop(event);try{const d=window.__ctR288R263?.discover263;if(d)d.tab='foryou'}catch{};qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',b===tab));void loadForYou(false);return true}
 return false;
}
async function loadForYou(force=false){
 if(window.__ctR380ForYouOwner&&typeof window.__ctR380LoadForYou==='function')return window.__ctR380LoadForYou(!!force);
 if(window.__ctR379ForYouOwner&&typeof window.__ctR379LoadForYou==='function')return window.__ctR379LoadForYou(!!force);
 if(routeNow()!=='discover')return false;const run=++fyLoadRun,h=host();if(!h)return false;
 const existing=hasAny();h.innerHTML='<div data-ct378-loading><section class="panel ct378-loading"><h2>Indicação do Dia</h2></section><section class="panel ct378-loading"><h2>Da sua Watchlist</h2></section><section class="panel ct378-loading"><h2>100% novos</h2></section></div>';
 try{
  if(!existing||force)await window.__ctR309?.buildForYou?.(!!force);
  if(run!==fyLoadRun||routeNow()!=='discover')return false;
  await audit(state());if(run!==fyLoadRun||routeNow()!=='discover')return false;renderForYou();
  await Promise.allSettled(['movie','series','anime'].map(async kind=>{if(!pool(state(),'fresh:'+kind).length)await refillFresh(kind);if(run===fyLoadRun&&routeNow()==='discover')renderSlot('fresh:'+kind)}));
  if(run===fyLoadRun&&routeNow()==='discover')renderForYou();return true;
 }catch(e){
  if(run!==fyLoadRun)return false;if(hasAny()){renderForYou();return true}
  h.innerHTML='<div class="empty">Não foi possível montar as recomendações agora.<br><button type="button" class="chip" data-ct378-retry>Tentar novamente</button></div>';return false;
 }
}
window.__ctR378LoadForYou=loadForYou;
if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;
if(window.__ctR336)window.__ctR336.paintForYou=renderForYou;
if(window.__ctR328)window.__ctR328.paintForYou=renderForYou;
if(window.__ctR329)window.__ctR329.paintForYou=renderForYou;
window.__ctR336EarlyHandle=early378;
window.addEventListener('click',e=>{if(early378(e.target,e)){stop(e)}},true);
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct378-retry]');if(b){stop(e);void loadForYou(true)}},true);

const style=document.createElement('style');style.id='ct-web-r378';style.textContent=`
[data-ct378-foryou]{--ct378-w:154px;min-width:0;max-width:100%}
@media(min-width:1100px){[data-ct378-foryou]{--ct378-w:176px}}
.ct378-filters{display:flex;flex-flow:row nowrap;gap:5px;overflow-x:auto;margin:0 0 8px;padding-bottom:2px}
.ct378-filters>button{height:28px;min-height:28px;padding:3px 9px;border:1px solid var(--line,#28404f);border-radius:999px;background:transparent;color:inherit;font-size:10px;white-space:nowrap}
.ct378-filters>button.active{background:rgba(31,110,145,.28);border-color:#347a9b}
.ct378-block{width:100%;max-width:100%;overflow:hidden;margin-bottom:10px;padding-bottom:8px}
.ct378-rail{display:flex;flex-flow:row nowrap;gap:10px;width:100%;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:2px 1px 8px}
.ct378-slot{display:flex;flex:0 0 var(--ct378-w);flex-direction:column;width:var(--ct378-w);min-width:var(--ct378-w);max-width:var(--ct378-w);box-sizing:border-box}
.ct378-slot[hidden],.ct378-block[hidden]{display:none!important}.ct378-slot>h3{margin:0 0 5px;font-size:11px}
.ct378-cardwrap{width:100%;min-width:0;min-height:231px}.ct378-cardwrap>.ct288-card{width:100%!important;min-width:0!important;max-width:100%!important}
.ct378-actions{display:flex!important;flex-flow:row nowrap!important;gap:4px!important;width:100%!important;height:34px!important;min-height:34px!important;margin-top:5px!important;position:relative!important;z-index:40!important}
.ct378-actions>button{display:flex!important;align-items:center!important;justify-content:center!important;flex:1 1 0!important;min-width:0!important;height:34px!important;padding:0 4px!important;border:1px solid var(--line,#28404f)!important;border-radius:8px!important;background:rgba(8,25,34,.92)!important;color:inherit!important;font-size:9px!important;white-space:nowrap!important;touch-action:manipulation!important;position:relative!important;z-index:41!important}
.ct378-placeholder{height:270px;display:flex;flex-direction:column;gap:8px;justify-content:center;align-items:center;border:1px dashed rgba(120,170,190,.22);border-radius:12px;opacity:.72}.ct378-poster-skeleton{width:76%;height:72%;border-radius:10px;background:linear-gradient(110deg,#0b2230 8%,#123547 18%,#0b2230 33%);background-size:200% 100%}
.ct378-loading{min-height:92px;display:flex;align-items:center;padding:12px}.ct378-loading h2{font-size:14px;opacity:.72}
`;document.head.appendChild(style);

window.__ctR378={version:'1.0.169',renderHome:renderHome378,captureHome,saveHomeSnapshot,settleHome,renderForYou,loadForYou,renderSlot,swap,refillFresh,early:early378,get homeSnapshot(){return homeSnapshot},get authority(){return fyAuthority}};
window.__ctR378Test={validHome,cloneState,current,slotHtml,renderForYou,applyFilter,refillFresh,swap,loadForYou,early378,setHomeSnapshot(v){saveHomeSnapshot(v)},setAuthority(v){fyAuthority={blocked:new Set(v?.blocked||[]),watch:new Set(v?.watch||[]),seen:new Set(v?.seen||[]),ready:true}},get homeSnapshot(){return homeSnapshot}};
})();
