/* CineTracker Web 1.0.173 r382 — restore pre-r380 Home/Profile, strict Pra Voce actions. */
(()=>{
'use strict';
if(window.__ctR382?.version==='1.0.173')return;
window.__ctR382Marker='baseline-r376-home-profile+home-v382-first-paint+fresh-v381-audit+actions-3-2-3';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>{const id=idOf(x);return id>0?typeOf(x)+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
const wwe=x=>/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x)));

const state=()=>window.__ctR309Test?.state||null;
function cloneState(s=state()){if(!s)return null;return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
const save=s=>{window.__ctR309Test?.setForYouState?.(s);return s};
function pool(name,s=state()){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function index(name,s=state()){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=state()){const p=pool(name,s);if(!p.length)return null;return p[((index(name,s)%p.length)+p.length)%p.length]||null}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function candidate(x){return{media_type:typeOf(x),tmdb_id:idOf(x),title:titleOf(x),original_title:String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||''),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4)||0)}}

let auditCache=new Map(),auditAt=0;
async function audit(items,force=false){
 const list=[],seen=new Set();for(const x of rows(items)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);list.push(candidate(x))}
 if(!list.length)return{blocked:new Set(),seen:new Set(),watch:new Set(),liked:new Set()};
 const sig=list.map(x=>(x.media_type+':'+x.tmdb_id+':'+x.title+':'+x.original_title+':'+x.release_year)).join('|');
 if(!force&&auditCache.has(sig)&&Date.now()-auditAt<30000)return auditCache.get(sig);
 const d=await rpc('cinetracker_discover_filter_v381',{p_items:list});
 if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria pessoal incompleta');
 const out={blocked:new Set(rows(d.blocked_keys)),seen:new Set(rows(d.seen_keys)),watch:new Set(rows(d.watch_keys)),liked:new Set(rows(d.liked_keys))};
 auditCache.set(sig,out);auditAt=Date.now();return out;
}
async function sanitize(){
 const s=cloneState();if(!s)return false;
 const all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools?.[k]),...rows(s.freshPools?.[k])])],a=await audit(all,true);
 s.dailyPool=unique(s.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));
 for(const k of ['movie','series','anime']){
  s.watchPools[k]=unique(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));
  s.freshPools[k]=unique(s.freshPools[k]).filter(x=>!a.blocked.has(keyOf(x)));
  s.watchIndex[k]=0;s.freshIndex[k]=0;
 }
 s.dailyIndex=0;save(s);return a;
}
function freshLocal(x,kind){const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);return !!keyOf(x)&&!!posterOf(x)&&kindOf(x)===kind&&!wwe(x)&&score>=7.5&&year>1990}
async function refillFresh(kind){
 if(typeof tmdb!=='function')return false;
 for(let round=0;round<2;round++){
  const base=2+Math.floor(Math.random()*14)+round*19,pages=[base,base+5,base+11],controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3400);
  try{
   const packs=await Promise.allSettled(pages.map(page=>kind==='movie'
    ?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,include_adult:false},{signal:controller.signal,timeout:3000})
    :kind==='anime'
      ?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5},{signal:controller.signal,timeout:3000})
      :tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5},{signal:controller.signal,timeout:3000})));
   const raw=unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>freshLocal(x,kind));
   if(!raw.length)continue;const a=await audit(raw,true),good=raw.filter(x=>!a.blocked.has(keyOf(x)));if(!good.length)continue;
   const s=cloneState(),old=unique(s.freshPools?.[kind]).filter(x=>!a.blocked.has(keyOf(x))),keys=new Set(old.map(keyOf));
   for(const x of good)if(!keys.has(keyOf(x))){old.push(x);keys.add(keyOf(x))}
   s.freshPools[kind]=old.slice(-90);s.freshIndex[kind]=0;save(s);if(old.length)return true;
  }finally{clearTimeout(timer)}
 }return false;
}
async function ensureFresh(){await Promise.all(['movie','series','anime'].map(async k=>{if(!pool('fresh:'+k).length)await refillFresh(k)}));return true}

function spec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function ensureSlot(slot){
 if(!slot)return false;const name=String(slot.dataset.ct336Slot||''),item=current(name);let row=q(':scope > .ct336-actions',slot);
 if(!row){row=document.createElement('div');row.className='ct336-actions';slot.appendChild(row)}
 row.classList.add('ct382-actions');row.replaceChildren();
 if(!item){row.hidden=true;return false}row.hidden=false;
 for(const[label,action]of spec(name)){const b=document.createElement('button');b.type='button';b.className='chip ct382-action';b.textContent=label;b.dataset.ct382Action=action;b.dataset.ct382Slot=name;row.appendChild(b)}
 row.dataset.ct382Cols=String(spec(name).length);slot.dataset.ct382Ready='1';return true;
}
function ensureAll(){if(window.__ctR383ForYouOwner)return false;const root=q('[data-ct336-foryou]');if(!root)return false;q('.ct378-filters',root)?.remove();for(const s of qa('[data-ct336-slot]',root))ensureSlot(s);return true}
const baseRender=window.__ctR359?.renderSlot?.bind(window.__ctR359);
function renderSlot(name){let ok=false;try{ok=!!baseRender?.(name,{animate:true})}catch{};ensureSlot(q('[data-ct336-slot="'+CSS.escape(name)+'"]'));return ok}
if(window.__ctR359&&baseRender)window.__ctR359.renderSlot=renderSlot;

const locks=new Set(),excluded=new Map();
const exSet=n=>{if(!excluded.has(n))excluded.set(n,new Set());return excluded.get(n)};
function select(name,item){const s=cloneState(),p=pool(name,s),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(!s||i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}save(s);return true}
async function refillSlot(name){
 if(name.startsWith('fresh:'))return refillFresh(name.split(':')[1]);
 if(name.startsWith('watch:')){try{await window.__ctR363?.refill?.(name,{force:true});await sanitize();return pool(name).length>1}catch{return false}}
 try{await window.__ctR309?.buildForYou?.(true);await sanitize();return pool(name).length>1}catch{return false}
}
async function swap(name,btn){
 if(locks.has(name))return false;locks.add(name);if(btn)btn.disabled=true;
 try{const cur=keyOf(current(name)),ex=exSet(name);if(cur)ex.add(cur);let p=pool(name),eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)));
  if(!eligible.length){await refillSlot(name);p=pool(name);eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)))}
  if(!eligible.length)eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur);if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)];ex.add(keyOf(item));if(!select(name,item))return false;renderSlot(name);return true
 }finally{locks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function optimistic(action,key,name){
 try{const tx=window.__ctR359Test?.mutate359?.(action,key,name);if(tx)return true}catch{}
 const s=cloneState();if(!s)return false;
 if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key)}
 s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}save(s);return true;
}
async function act(action,name,btn){
 if(action==='swap')return swap(name,btn);const item=current(name),key=keyOf(item);if(!key)return false;
 optimistic(action,key,name);renderSlot(name);
 Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).then(async()=>{auditCache.clear();auditAt=0;if(name.startsWith('fresh:')){await refillFresh(name.split(':')[1]);renderSlot(name)}}).catch(()=>{});
 return true;
}
function early(target,event){
 if(window.__ctR383ForYouOwner&&typeof window.__ctR383Early==='function')return window.__ctR383Early(target,event);
 const b=target?.closest?.('[data-ct382-action]');if(!b||routeNow()!=='discover')return false;
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 void act(String(b.dataset.ct382Action||''),String(b.dataset.ct382Slot||''),b);return true;
}
async function loadForYou(force=false){
 if(window.__ctR383ForYouOwner&&typeof window.__ctR383LoadForYou==='function')return window.__ctR383LoadForYou(!!force);
 if(routeNow()!=='discover')return false;const h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 const s=state(),has=s&&([...(rows(s.dailyPool)),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools?.[k]),...rows(s.freshPools?.[k])])].length>0);
 if(!has||force){h.innerHTML='<div class="ct263-loading">Montando recomendações…</div>';try{await Promise.race([Promise.resolve(window.__ctR309?.buildForYou?.(!!force)),new Promise(r=>setTimeout(r,5000))])}catch{}}
 try{await sanitize()}catch{h.innerHTML='<div class="empty">Não foi possível validar as recomendações agora.</div>';return false}
 await ensureFresh();try{window.__ctR336?.paintForYou?.()}catch{};ensureAll();queueMicrotask(ensureAll);requestAnimationFrame(ensureAll);document.documentElement.dataset.ct382ForYou='ready';return true;
}
window.__ctR382Early=early;window.__ctR382LoadForYou=loadForYou;if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;
window.__ctR336EarlyHandle=early;

/* Home movie Watchlist: one truthful count, no leftover 240 counter. */
function fixMovieWatchHeader(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="movies"]');if(!view)return false;
 const sec=[...view.querySelectorAll(':scope > .home-section')].find(x=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''));if(!sec)return false;
 const head=q('.panel-head',sec),tools=q('[data-ct376-tools]',head);if(!head||!tools)return false;
 for(const child of [...head.children])if(child.tagName==='SMALL'&&!tools.contains(child))child.remove();
 const count=q('[data-ct376-count]',tools),total=Number(window.__ctR376?.home?.total||0);if(count&&total>0)count.textContent=total.toLocaleString('pt-BR');
 return true;
}
for(const ms of [0,100,350,900])setTimeout(()=>{if(routeNow()==='home'){void window.__ctR376?.hydrateHome?.(false).then?.(fixMovieWatchHeader);fixMovieWatchHeader()}if(routeNow()==='discover'&&!window.__ctR383ForYouOwner)void loadForYou(false)},ms);

const style=document.createElement('style');style.id='ct-web-r382';style.textContent=`
[data-ct336-foryou] .ct382-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:100%!important;height:34px!important;min-height:34px!important;margin:5px 0 0!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;z-index:50!important}
[data-ct336-foryou] [data-ct336-slot^="watch:"] .ct382-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct382-actions>.ct382-action{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:34px!important;margin:0!important;padding:0 3px!important;border-radius:7px!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:9px!important;touch-action:manipulation!important}
[data-ct336-foryou] .ct291-card{position:relative!important;overflow:hidden!important}
[data-ct336-foryou] .ct291-favorite{position:absolute!important;top:7px!important;right:7px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:70!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important;border-radius:999px!important;background:rgba(0,0,0,.5)!important}
`;document.head.appendChild(style);

window.__ctR382={version:'1.0.173',loadForYou,sanitize,refillFresh,ensureAll,ensureSlot,swap,early,fixMovieWatchHeader};
window.__ctR382Test={audit,sanitize,refillFresh,ensureAll,ensureSlot,swap,early,fixMovieWatchHeader,current,cloneState};
})();