/* CineTracker Web 1.0.167 r376 — Home Watchlist media-id authority + final Pra Voce owner. */
(()=>{
'use strict';
if(window.__ctR376?.version==='1.0.167')return;
window.__ctR376Marker='watchlist-media-id-authority+sort-no-rebuild+foryou-final-owner+fresh-never-empty';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

/* ---------------- Home / complete movie Watchlist ---------------- */
const home={rows:[],total:0,sort:'added_desc',loaded:false,loading:false,nodes:new Map(),rank:new Map(),renderGeneration:0,rendered:0,open:false,at:0};
let homeTask=null,homeHydrateToken=0;
const mediaId=x=>Number(x?.media_id||x?.id||0)||0;
const tmdbId=x=>Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||0)||0;
const title=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const added=x=>{const t=Date.parse(x?.added_at||x?.created_at||'');return Number.isFinite(t)?t:0};
const released=x=>{const raw=String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'');const t=Date.parse(raw.length===4?raw+'-01-01':raw);return Number.isFinite(t)?t:0};
function homeRows(p){return rows(p?.rows).filter(x=>String(x?.media_type||'')==='movie'&&mediaId(x)>0)}
function sortHome(list,mode=home.sort){
 const alpha=(a,b)=>title(a).localeCompare(title(b),'pt-BR',{sensitivity:'base',numeric:true}),out=[...rows(list)];
 if(mode==='added_desc')return out.sort((a,b)=>added(b)-added(a)||alpha(a,b));
 if(mode==='added_asc')return out.sort((a,b)=>added(a)-added(b)||alpha(a,b));
 if(mode==='release_desc')return out.sort((a,b)=>released(b)-released(a)||alpha(a,b));
 if(mode==='release_asc')return out.sort((a,b)=>released(a)-released(b)||alpha(a,b));
 if(mode==='za')return out.sort((a,b)=>alpha(b,a));
 return out.sort(alpha);
}
function homeSection(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 return [...view.querySelectorAll(':scope > .home-section')].find(sec=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',sec)?.textContent||''))||null;
}
function fallbackRow(x){
 const id=tmdbId(x)||mediaId(x),year=String(x?.release_year||x?.raw_tmdb?.release_date||'').slice(0,4);
 return '<div class="media-row ct376-watch-row" data-media="movie:'+id+'"><div class="thumb"></div><div><b>'+esc(title(x))+'</b><small>'+esc(year)+'</small></div><span class="badge">›</span></div>';
}
function makeHomeNode(x){
 let html='';
 try{if(typeof mediaRow==='function')html=mediaRow(x,'›')}catch{}
 if(!html)html=fallbackRow(x);
 const t=document.createElement('template');t.innerHTML=html.trim();
 const el=t.content.firstElementChild||document.createElement('div');
 el.classList.add('ct376-watch-row');el.dataset.ct376MediaId=String(mediaId(x));el.dataset.ct376TmdbId=String(tmdbId(x));
 return el;
}
function updateRanks(){
 home.rank.clear();sortHome(home.rows,home.sort).forEach((x,i)=>home.rank.set(mediaId(x),i));
 for(const [id,node] of home.nodes)node.style.order=String(home.rank.get(id)??999999);
}
function renderAllHomeRows(){
 const sec=homeSection(),stack=q('.stack',sec);if(!sec||!stack||!home.loaded)return false;
 const gen=++home.renderGeneration;home.nodes.clear();home.rendered=0;stack.replaceChildren();
 stack.style.setProperty('display','flex','important');stack.style.setProperty('flex-direction','column','important');
 updateRanks();
 const source=[...home.rows],BATCH=90;
 const step=()=>{
  if(gen!==home.renderGeneration||routeNow()!=='home')return;
  const frag=document.createDocumentFragment(),start=home.rendered,end=Math.min(source.length,start+BATCH);
  for(let i=start;i<end;i++){const x=source[i],node=makeHomeNode(x),id=mediaId(x);node.style.order=String(home.rank.get(id)??i);home.nodes.set(id,node);frag.appendChild(node)}
  stack.appendChild(frag);home.rendered=end;sec.dataset.ct376Rendered=String(end);
  if(end<source.length)requestAnimationFrame(step);
 };
 requestAnimationFrame(step);return true;
}
function sortLabel(mode=home.sort){return({added_desc:'Por último adicionado',added_asc:'Primeiro adicionado',release_desc:'Último lançado',release_asc:'Primeiro lançado',az:'A-Z',za:'Z-A'})[mode]||'Por último adicionado'}
function stopEvent(e){e?.preventDefault?.();e?.stopImmediatePropagation?.();e?.stopPropagation?.()}
function setHomeSort(mode){
 if(!['added_desc','added_asc','release_desc','release_asc','az','za'].includes(mode))return false;
 home.sort=mode;updateRanks();
 const sec=homeSection();if(sec)sec.dataset.ct376Sort=mode;
 q('[data-ct376-sort-trigger]')?.setAttribute('title',sortLabel(mode));
 for(const b of qa('[data-ct376-sort-option]')){const on=b.dataset.ct376SortOption===mode;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')}
 return true;
}
function setPopover(open){
 home.open=!!open;const pop=q('[data-ct376-sort-popover]'),btn=q('[data-ct376-sort-trigger]');
 pop?.classList.toggle('open',home.open);btn?.setAttribute('aria-expanded',home.open?'true':'false');return home.open;
}
function buildTools(head){
 q('[data-ct373-tools]',head)?.remove();
 let tools=q('[data-ct376-tools]',head);if(tools)return tools;
 tools=document.createElement('div');tools.className='ct376-watch-tools';tools.dataset.ct376Tools='1';
 const count=document.createElement('span');count.className='ct376-count';count.dataset.ct376Count='1';
 const trigger=document.createElement('button');trigger.type='button';trigger.className='ct376-sort-trigger';trigger.dataset.ct376SortTrigger='1';trigger.textContent='⇅';trigger.setAttribute('aria-label','Ordenar Watchlist');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
 const pop=document.createElement('div');pop.className='ct376-sort-popover';pop.dataset.ct376SortPopover='1';pop.setAttribute('role','listbox');
 const opts=[['added_desc','Por último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 for(const [mode,label] of opts){const b=document.createElement('button');b.type='button';b.className='ct376-sort-option';b.dataset.ct376SortOption=mode;b.textContent=label;b.setAttribute('role','option');
  b.addEventListener('pointerdown',stopEvent);b.addEventListener('touchstart',stopEvent,{passive:false});
  b.addEventListener('click',e=>{stopEvent(e);setHomeSort(mode);setTimeout(()=>setPopover(false),180)});
  pop.appendChild(b);
 }
 trigger.addEventListener('pointerdown',stopEvent);trigger.addEventListener('touchstart',stopEvent,{passive:false});trigger.addEventListener('click',e=>{stopEvent(e);setPopover(!home.open)});
 tools.addEventListener('click',e=>{if(e.target.closest('[data-ct376-sort-trigger],[data-ct376-sort-option]'))stopEvent(e)},true);
 tools.append(count,trigger,pop);head.appendChild(tools);return tools;
}
function paintHomeWatch(){
 if(routeNow()!=='home'||!home.loaded)return false;
 const sec=homeSection(),head=q('.panel-head',sec);if(!sec||!head)return false;
 const tools=buildTools(head),count=q('[data-ct376-count]',tools);if(count)count.textContent=home.total.toLocaleString('pt-BR');
 sec.dataset.ct376Total=String(home.total);sec.dataset.ct376Rows=String(home.rows.length);sec.dataset.ct376Authority='media-id-v376';
 setHomeSort(home.sort);if(home.nodes.size!==home.rows.length)renderAllHomeRows();return true;
}
async function loadHomeWatch(force=false){
 if(home.loading)return homeTask;if(!force&&home.loaded&&Date.now()-home.at<60000)return home.rows;
 home.loading=true;homeTask=Promise.resolve().then(()=>rpc('cinetracker_watchlist_full_v376',{})).then(p=>{
  const list=homeRows(p),reported=Number(p?.counts?.movie||0);home.rows=list;home.total=list.length;home.loaded=true;home.at=Date.now();
  document.documentElement.dataset.ct376WatchReported=String(reported);document.documentElement.dataset.ct376WatchRows=String(list.length);return list;
 }).finally(()=>{home.loading=false;homeTask=null});return homeTask;
}
async function hydrateHome(force=false){
 const token=++homeHydrateToken;try{await loadHomeWatch(force);if(token!==homeHydrateToken||routeNow()!=='home')return false;return paintHomeWatch()}catch{return false}
}
function invalidateHome(){home.loaded=false;home.at=0;home.rows=[];home.total=0;home.nodes.clear();home.renderGeneration++}

/* ---------------- Pra Voce final owner ---------------- */
const fyLocks=new Set();let fyAuthority={ready:false,seen:new Set(),watch:new Set(),blocked:new Set(),at:0},fyAuthorityTask=null;
const legacy367=window.__ctR367||null;
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
const keyOf=x=>{const id=idOf(x);return id>0?typeOf(x)+':'+id:''};
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const yearOf=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);
const titleOf=x=>x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'';
function anime(x){if(typeOf(x)==='movie')return false;const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[])].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))}
function kindOf(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function isWWE(x){return /wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x)))}
function fyPool(st,name){if(!st)return[];if(name==='daily')return rows(st.dailyPool);const[b,k]=String(name||'').split(':');return rows(st?.[b+'Pools']?.[k])}
function fyIndex(st,name){if(name==='daily')return Number(st?.dailyIndex||0);const[b,k]=String(name||'').split(':');return Number(st?.[b+'Index']?.[k]||0)}
function fyItem(name){const st=window.__ctR309Test?.state,p=fyPool(st,name);if(!p.length)return null;const i=((fyIndex(st,name)%p.length)+p.length)%p.length;return p[i]||null}
function fyClone(st){if(!st)return null;return{...st,freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},freshIndex:{...(st.freshIndex||{})}}}
async function refreshFyAuthority(force=false){
 if(fyAuthorityTask&&!force)return fyAuthorityTask;
 fyAuthorityTask=(async()=>{let p=null;try{p=await window.__ctR319?.personal?.(!!force)}catch{};if(!p?.ready)try{p=await window.__ctR295Test?.authority?.(!!force)}catch{};
  const seen=new Set(p?.seen||[]),watch=new Set(p?.watch||[]),blocked=new Set(p?.blocked||[]);for(const k of seen)blocked.add(k);for(const k of watch)blocked.add(k);fyAuthority={ready:true,seen,watch,blocked,at:Date.now()};return fyAuthority;
 })().finally(()=>{fyAuthorityTask=null});return fyAuthorityTask;
}
function freshClean(list,a=fyAuthority,kind=''){
 const used=new Set();return rows(list).filter(x=>{const k=keyOf(x);if(!k||used.has(k)||a.blocked.has(k)||a.seen.has(k)||a.watch.has(k)||!posterOf(x)||isWWE(x))return false;if(kind&&kindOf(x)!==kind)return false;used.add(k);return true});
}
function sanitizeFresh(a=fyAuthority){
 const cur=window.__ctR309Test?.state;if(!cur||!a.ready)return false;const st=fyClone(cur);let changed=false;
 for(const kind of ['movie','series','anime']){const old=rows(st.freshPools?.[kind]),clean=freshClean(old,a,kind);if(clean.length!==old.length){st.freshPools[kind]=clean;st.freshIndex[kind]=0;changed=true}}
 if(changed)window.__ctR309Test?.setForYouState?.(st);return changed;
}
function appendFresh(name,list){
 const kind=String(name).split(':')[1],cur=fyClone(window.__ctR309Test?.state);if(!cur)return 0;
 const old=freshClean(cur.freshPools?.[kind],fyAuthority,kind),seen=new Set(old.map(keyOf)),add=freshClean(list,fyAuthority,kind).filter(x=>{const k=keyOf(x);if(seen.has(k))return false;seen.add(k);return true}).slice(0,40);
 cur.freshPools[kind]=[...old,...add].slice(-80);cur.freshIndex[kind]=0;window.__ctR309Test?.setForYouState?.(cur);return add.length;
}
async function fallbackFresh(name,signal){
 const kind=String(name).split(':')[1];if(typeof tmdb!=='function')return 0;
 const pages=[2,5,9,14].map((p,i)=>p+Math.floor(Math.random()*4)+i),jobs=pages.map(page=>{
  if(kind==='movie')return tmdb('/discover/movie',{page,sort_by:'popularity.desc','primary_release_date.lte':new Date().toISOString().slice(0,10)},{signal,timeout:3000});
  if(kind==='anime')return tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','first_air_date.lte':new Date().toISOString().slice(0,10)},{signal,timeout:3000});
  return tmdb('/discover/tv',{page,sort_by:'popularity.desc','first_air_date.lte':new Date().toISOString().slice(0,10)},{signal,timeout:3000});
 });
 const packs=await Promise.allSettled(jobs);if(signal.aborted)return 0;
 const raw=packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:x.media_type||(kind==='movie'?'movie':'tv'),tmdb_id:Number(x.id||x.tmdb_id||0)}));
 return appendFresh(name,raw.filter(x=>scoreOf(x)>=6&&yearOf(x)>1980));
}
async function fillFresh(name){
 const kind=String(name).split(':')[1],controller=new AbortController();await refreshFyAuthority(false);sanitizeFresh(fyAuthority);
 if(freshClean(window.__ctR309Test?.state?.freshPools?.[kind],fyAuthority,kind).length)return true;
 try{await window.__ctR370?.fetchOnceIfNeeded?.(name,controller)}catch{}sanitizeFresh(fyAuthority);
 if(freshClean(window.__ctR309Test?.state?.freshPools?.[kind],fyAuthority,kind).length)return true;
 try{await fallbackFresh(name,controller)}catch{}sanitizeFresh(fyAuthority);
 return freshClean(window.__ctR309Test?.state?.freshPools?.[kind],fyAuthority,kind).length>0;
}
function fySpec(name){const bucket=name==='daily'?'daily':String(name).split(':')[0];return bucket==='watch'?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function fyButton(label,action,name,key){const b=document.createElement('button');b.type='button';b.className='chip ct336-action ct376-action';b.textContent=label;if(action==='swap')b.dataset.ct336SwapOnly=name;else{b.dataset.ct336Action=action;b.dataset.ct336Swap=name;b.dataset.ct336Media=key}return b}
function fyEnsureSlot(slot){
 if(!slot)return false;const name=String(slot.dataset.ct336Slot||''),item=fyItem(name),key=keyOf(item);if(!name||!item||!key)return false;
 const spec=fySpec(name),bucket=name==='daily'?'daily':name.split(':')[0];let row=q(':scope > .ct336-actions',slot);if(!row){row=document.createElement('div');slot.appendChild(row)}
 const btns=qa(':scope > button',row),valid=btns.length===spec.length&&btns.every((b,i)=>String(b.textContent||'').trim()===spec[i][0]);
 if(!valid)row.replaceChildren(...spec.map(([l,a])=>fyButton(l,a,name,key)));else for(const [i,b] of btns.entries()){const [l,a]=spec[i];b.type='button';if(a==='swap')b.dataset.ct336SwapOnly=name;else{b.dataset.ct336Action=a;b.dataset.ct336Swap=name;b.dataset.ct336Media=key}}
 row.className='ct336-actions ct376-actions '+(bucket==='watch'?'ct336-actions-two':'ct336-actions-three');row.hidden=false;row.removeAttribute('hidden');row.dataset.ct336Bucket=bucket;
 row.style.cssText='display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:space-between!important;gap:4px!important;width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;margin:6px 0 0!important;padding:0!important;overflow:visible!important;position:relative!important;z-index:6!important;';
 for(const b of qa(':scope > button',row)){b.type='button';b.hidden=false;b.removeAttribute('hidden');b.removeAttribute('inert');b.style.cssText='display:flex!important;align-items:center!important;justify-content:center!important;flex:1 1 0!important;min-width:0!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:2px 4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;position:relative!important;z-index:7!important;';if(!fyLocks.has(name)){b.disabled=false;b.removeAttribute('disabled')}}
 slot.dataset.ct376Actions=String(spec.length);return true;
}
function fyEnsureAll(){const root=q('[data-ct336-foryou]');if(!root)return false;let n=0;for(const slot of qa('[data-ct336-slot]',root))if(fyEnsureSlot(slot))n++;root.dataset.ct376ActionSlots=String(n);return n>0}
let baseRender=window.__ctR359?.renderSlot?.bind(window.__ctR359);
function fyRender(name,opts={animate:true}){let ok=false;try{ok=!!baseRender?.(name,opts)}catch{}const slot=q('[data-ct336-slot="'+CSS.escape(name)+'"]');fyEnsureSlot(slot);queueMicrotask(()=>fyEnsureSlot(slot));return ok}
function selectFresh(name,item){const kind=String(name).split(':')[1],st=fyClone(window.__ctR309Test?.state),pool=rows(st?.freshPools?.[kind]),idx=pool.findIndex(x=>keyOf(x)===keyOf(item));if(!st||idx<0)return false;st.freshIndex[kind]=idx;window.__ctR309Test?.setForYouState?.(st);return true}
async function swapFresh(meta){
 if(!meta||fyLocks.has(meta.name))return false;fyLocks.add(meta.name);if(meta.btn)meta.btn.disabled=true;
 try{await refreshFyAuthority(false);sanitizeFresh(fyAuthority);let kind=meta.name.split(':')[1],pool=freshClean(window.__ctR309Test?.state?.freshPools?.[kind],fyAuthority,kind),cur=keyOf(fyItem(meta.name)),excluded=window.__ctR370?.excluded||new Set();
  let eligible=pool.filter(x=>keyOf(x)!==cur&&!excluded.has(keyOf(x)));if(!eligible.length){await fillFresh(meta.name);pool=freshClean(window.__ctR309Test?.state?.freshPools?.[kind],fyAuthority,kind);eligible=pool.filter(x=>keyOf(x)!==cur&&!excluded.has(keyOf(x)))}
  if(!eligible.length)eligible=pool.filter(x=>keyOf(x)!==cur);if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)];if(!selectFresh(meta.name,item))return false;fyRender(meta.name);setTimeout(()=>void fillFresh(meta.name),0);return true;
 }finally{fyLocks.delete(meta.name);fyEnsureSlot(meta.slot);if(meta.btn?.isConnected){meta.btn.disabled=false;meta.btn.removeAttribute('disabled')}}
}
function fyMeta(target){const btn=target?.closest?.('.ct336-actions button');if(!btn||routeNow()!=='discover')return null;const slot=btn.closest('[data-ct336-slot]');if(!slot)return null;const name=String(slot.dataset.ct336Slot||''),item=fyItem(name),key=keyOf(item),label=norm(btn.textContent);const action=btn.matches('[data-ct336-swap-only]')||label.includes('trocar')?'swap':btn.dataset.ct336Action==='watchlist'||label.includes('watchlist')?'watchlist':btn.dataset.ct336Action==='seen'||label.includes('visto')?'seen':'';if(!name||!key||!action)return null;if(action==='watchlist'&&name.startsWith('watch:'))return null;return{btn,slot,name,key,action}}
function fyPersist(action,key,name){const p=window.__ctR365?.persistDirect;if(typeof p!=='function')return Promise.resolve();return Promise.resolve(p(action,key)).then(()=>refreshFyAuthority(true)).then(()=>fillFresh(name)).catch(()=>{})}
function fyHandle(meta){
 if(meta.name.startsWith('fresh:')){
  if(meta.action==='swap'){void swapFresh(meta);return true}
  const set=meta.action==='seen'?fyAuthority.seen:fyAuthority.watch;set.add(meta.key);fyAuthority.blocked.add(meta.key);
  let tx=null;try{tx=window.__ctR359Test?.mutate359?.(meta.action,meta.key,meta.name)}catch{};sanitizeFresh(fyAuthority);fyRender(meta.name);void fyPersist(meta.action,meta.key,meta.name);return !!tx||true;
 }
 if(meta.action==='swap'){void Promise.resolve(window.__ctR370?.handleSwap?.(meta)).finally(()=>fyEnsureSlot(meta.slot));return true}
 const ok=legacy367?.handle?.(meta);queueMicrotask(()=>fyEnsureSlot(meta.slot));return ok!==false;
}
function fyEarly(target,event){const m=fyMeta(target);if(!m)return false;stopEvent(event);const ok=fyHandle(m);document.documentElement.dataset.ct376LastFy=m.action+':'+m.name;return ok}
async function ensureFreshAll(){if(routeNow()!=='discover')return false;await refreshFyAuthority(true);sanitizeFresh(fyAuthority);for(const kind of ['movie','series','anime'])await fillFresh('fresh:'+kind);for(const kind of ['movie','series','anime'])fyRender('fresh:'+kind);fyEnsureAll();return true}

/* Retire r373 direct runtime surface; lexical callbacks are removed in build-r376. */
if(window.__ctR373){window.__ctR373.paint=()=>false;window.__ctR373.hydrate=()=>false;window.__ctR373.invalidate=()=>false}
if(window.__ctR359&&baseRender)window.__ctR359.renderSlot=fyRender;
window.__ctR367={...(window.__ctR367||{}),ensureSlot:fyEnsureSlot,ensureAll:fyEnsureAll,meta:fyMeta,handle:fyHandle,early:fyEarly};
window.__ctR336EarlyHandle=fyEarly;window.__ctR358Early=fyEarly;window.__ctR359Early=fyEarly;if(window.__ctR360)window.__ctR360.early=fyEarly;if(window.__ctR361)window.__ctR361.early=fyEarly;if(window.__ctR362)window.__ctR362.early=fyEarly;

function afterHomePaint(){if(routeNow()==='home')queueMicrotask(()=>void hydrateHome(false))}
try{const b=paintHome;paintHome=function(){const out=b.apply(this,arguments);afterHomePaint();return out}}catch{}
try{const b=ct275PaintHome;ct275PaintHome=function(){const out=b.apply(this,arguments);afterHomePaint();return out}}catch{}
try{const b=renderHome;renderHome=async function(){const out=await b.apply(this,arguments);await hydrateHome(false);return out}}catch{}
window.addEventListener('cinetracker:data-changed',()=>{invalidateHome();if(routeNow()==='home')void hydrateHome(true)});
setTimeout(()=>{if(routeNow()==='home')void hydrateHome(false);if(routeNow()==='discover')void ensureFreshAll()},0);

const style=document.createElement('style');style.id='ct-web-r376';style.textContent=`
.ct376-watch-tools{margin-left:auto;display:flex;align-items:center;gap:5px;position:relative;z-index:80;flex:0 0 auto}
.ct376-count{font-size:12px;line-height:28px;opacity:.74;font-variant-numeric:tabular-nums}
.ct376-sort-trigger{width:28px;height:28px;min-width:28px;display:grid;place-items:center;padding:0;border:1px solid var(--line,#273746);border-radius:8px;background:#0a1820;color:inherit;touch-action:manipulation;position:relative;z-index:82}
.ct376-sort-popover{display:none;position:absolute;right:0;top:34px;width:194px;padding:5px;border:1px solid var(--line,#273746);border-radius:10px;background:#07131a;box-shadow:0 16px 42px rgba(0,0,0,.5);z-index:100;pointer-events:auto}
.ct376-sort-popover.open{display:flex;flex-direction:column;gap:2px}
.ct376-sort-option{height:31px;width:100%;padding:0 9px;border:0;border-radius:7px;background:transparent;color:inherit;text-align:left;font-size:11px;white-space:nowrap;touch-action:manipulation}
.ct376-sort-option.active,.ct376-sort-option:hover{background:rgba(61,120,146,.24)}
[data-ct336-foryou] [data-ct336-slot^="fresh:"]{visibility:visible!important}
[data-ct336-foryou] .ct376-actions{display:flex!important;flex-flow:row nowrap!important;gap:4px!important;width:100%!important;height:30px!important;min-height:30px!important;overflow:visible!important}
[data-ct336-foryou] .ct376-actions>button{display:flex!important;flex:1 1 0!important;min-width:0!important;height:30px!important;min-height:30px!important;max-height:30px!important;white-space:nowrap!important;position:relative!important}
`;document.head.appendChild(style);

window.__ctR376={version:'1.0.167',hydrateHome,loadHomeWatch,paintHomeWatch,setHomeSort,sortHome,ensureFreshAll,fillFresh,swapFresh,fyEnsureAll,fyEnsureSlot,fyEarly,get home(){return home},get authority(){return fyAuthority}};
window.__ctR376Test={homeRows,sortHome,setHomeSort,renderAllHomeRows,ensureFreshAll,fillFresh,swapFresh,fyEnsureAll,fyEnsureSlot,setHomePayload(p){home.rows=homeRows(p);home.total=home.rows.length;home.loaded=true;home.at=Date.now()},setAuthority(p){const seen=new Set(p?.seen||[]),watch=new Set(p?.watch||[]),blocked=new Set(p?.blocked||[]);for(const k of seen)blocked.add(k);for(const k of watch)blocked.add(k);fyAuthority={ready:true,seen,watch,blocked,at:Date.now()}},get home(){return home},get authority(){return fyAuthority}};
})();