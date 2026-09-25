/* CineTracker Web 1.0.127 r336 — episode-name search, deterministic Home anchor, final ForYou actions/filters. */
(()=>{
'use strict';
if(window.__ctR336?.version==='1.0.127')return;
window.__ctR336Marker='episode-search+home-anchor-on-tab+foryou-actions-swap-immediate';
window.__ctR336Search='movie+series+person+episode';
window.__ctR336Home='history-above-anchor+tab-click-always-lands-on-next';
window.__ctR336Discover='inside-foryou-filters+watch-seen-swap-contract+optimistic-rotate';
window.__ctR336Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let testBridge=null,searchSeq=0,discoverSeq=0,seasonCache=new Map(),targetCache={at:0,rows:[]};

/* ---------- HOME: one owner, one tab switch, one anchor ---------- */
function homeKind336(){
 const active=q('[data-home-tab].active');if(active)return active.dataset.homeTab==='movies'?'movies':'series';
 const view=qa('[data-home-view]').find(x=>!x.hidden&&!x.classList.contains('hidden'));
 return view?.dataset?.homeView==='movies'?'movies':'series';
}
function normalizeHistory336(){
 const root=q('[data-home]');if(!root)return false;
 for(const sec of qa('[data-ct274-history]',root)){
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');sec.dataset.ct336History='above-anchor';
  qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct332-history-toggle],[data-ct333-history-toggle],[data-ct334-history-toggle],[data-ct335-history-toggle]',sec).forEach(x=>x.remove());
  for(const box of qa('.ct275-history-shell,.ct274-history-stack',sec)){
   box.hidden=false;box.setAttribute('aria-hidden','false');
   box.style.removeProperty('max-height');box.style.removeProperty('height');box.style.setProperty('overflow','visible','important');
  }
 }
 return true;
}
function applyHomeTab336(kind){
 const wanted=kind==='movies'?'movies':'series',root=q('[data-home]');if(!root)return false;
 try{ct266HomeTab=wanted}catch{}
 root.dataset.ct266HomeTab=wanted;
 qa('[data-home-tab]',root).forEach(b=>{const on=b.dataset.homeTab===wanted;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 qa('[data-home-view]',root).forEach(v=>{const on=v.dataset.homeView===wanted;v.hidden=!on;v.classList.toggle('hidden',!on)});
 return true;
}
function homeAnchor336(kind){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 const re=kind==='movies'?/assistir\s*a\s*seguir\s*\/\s*watchlist/i:/^assistir\s*a\s*seguir$/i;
 return [...view.children].find(sec=>sec.nodeType===1&&!sec.matches('[data-ct274-history]')&&re.test((q('.panel-head h3,.panel-head h2,h3,h2',sec)?.textContent||'').trim()))
  || [...view.children].find(sec=>sec.nodeType===1&&!sec.matches('[data-ct274-history]'))||null;
}
function anchorTop336(){
 const active=q('[data-home-tab].active')||q('[data-home-tab]');
 const bar=active?.closest?.('.home-tabs,.tabs')||active?.parentElement;
 const bottom=bar?.getBoundingClientRect?.().bottom;
 return Math.max(8,Math.ceil(Number.isFinite(bottom)?bottom:0)+8);
}
function alignHome336(kind){
 if(routeNow()!=='home')return false;
 normalizeHistory336();
 const target=homeAnchor336(kind);if(!target)return false;
 const delta=target.getBoundingClientRect().top-anchorTop336();
 if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'});
 target.dataset.ct336HomeAnchor='1';return true;
}
function switchHome336(kind){
 const wanted=kind==='movies'?'movies':'series';
 applyHomeTab336(wanted);normalizeHistory336();
 requestAnimationFrame(()=>{if(routeNow()==='home'){applyHomeTab336(wanted);alignHome336(wanted)}});
 return true;
}
try{
 const baseRenderHome336=renderHome;
 renderHome=async function(){
  const out=await baseRenderHome336.apply(this,arguments);
  const kind=homeKind336();normalizeHistory336();
  requestAnimationFrame(()=>alignHome336(kind));
  return out;
 };
}catch{}

/* ---------- PRA VOCE: final renderer ---------- */
const R=window.__ctR288R263||{};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0));
const catOf=x=>{try{return window.__ctR309Test?.category?.(x)|| (typeOf(x)==='movie'?'movie':'series')}catch{return typeOf(x)==='movie'?'movie':'series'}};
const keyOf=x=>{const id=Number(idOf(x)||0);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''};
function current336(pool,index){const a=rows(pool);return a.length?a[Math.abs(Number(index||0))%a.length]:null}
function fyModel336(){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const watch={},fresh={},lengths={watch:{},fresh:{}};
 for(const kind of ['movie','series','anime']){
  const w=rows(st.watchPools?.[kind]),f=rows(st.freshPools?.[kind]);
  watch[kind]=current336(w,st.watchIndex?.[kind]);fresh[kind]=current336(f,st.freshIndex?.[kind]);
  lengths.watch[kind]=w.length;lengths.fresh[kind]=f.length;
 }
 const used=new Set([...Object.values(watch),...Object.values(fresh)].filter(Boolean).map(keyOf));
 const dailyPool=rows(st.dailyPool);let daily=current336(dailyPool,st.dailyIndex);
 if(daily&&used.has(keyOf(daily)))daily=dailyPool.find(x=>!used.has(keyOf(x)))||daily;
 return{watch,fresh,daily,lengths,dailyLength:dailyPool.length};
}
function card336(x){
 if(!x)return '<div class="ct336-missing"><div class="ct288-empty-poster"></div><b>Sem item elegível</b><small>Nenhum título atende às regras.</small></div>';
 try{return typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false,slot:true}):''}catch{return''}
}
function actionRow336(x,{bucket,kind,swap,length}){
 if(!x)return'';const key=keyOf(x);
 if(bucket==='watch'){
  return '<div class="ct336-actions ct336-actions-two" data-ct336-bucket="watch">'+
   '<button type="button" class="chip ct336-action" data-ct336-action="seen" data-ct336-media="'+esc(key)+'" data-ct336-swap="'+esc(swap)+'">✓ Visto</button>'+
   '<button type="button" class="chip ct336-action" data-ct336-swap-only="'+esc(swap)+'">↻ Trocar</button>'+
  '</div>';
 }
 return '<div class="ct336-actions ct336-actions-three" data-ct336-bucket="'+esc(bucket)+'">'+
  '<button type="button" class="chip ct336-action" data-ct336-action="watchlist" data-ct336-media="'+esc(key)+'" data-ct336-swap="'+esc(swap)+'">+ Watchlist</button>'+
  '<button type="button" class="chip ct336-action" data-ct336-action="seen" data-ct336-media="'+esc(key)+'" data-ct336-swap="'+esc(swap)+'">✓ Visto</button>'+
  '<button type="button" class="chip ct336-action" data-ct336-swap-only="'+esc(swap)+'">↻ Trocar</button>'+
 '</div>';
}
function slot336(label,kind,item,bucket,length){
 if(!item)return'';
 const swap=bucket+':'+kind;
 return '<section class="ct336-slot" data-ct336-kind="'+kind+'" data-ct336-slot="'+swap+'">'+
  '<div class="ct336-slot-head"><h3>'+label+'</h3></div><div class="ct336-cardwrap">'+card336(item)+'</div>'+
  actionRow336(item,{bucket,kind,swap,length})+'</section>';
}
function rail336(title,items,bucket,lengths){
 const html=['movie','series','anime'].map(kind=>slot336(kind==='movie'?'Filme':kind==='series'?'Série':'Anime',kind,items[kind],bucket,lengths[kind])).join('');
 if(!html)return'';
 return '<section class="panel ct336-block" data-ct336-section="'+bucket+'"><div class="panel-head"><h2>'+title+'</h2></div><div class="ct336-rail">'+html+'</div></section>';
}
function filters336(){
 const st=window.__ctR319Test?.state,kind=['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';
 return '<div class="ct336-filters" data-ct336-filters>'+
  [['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']].map(([k,l])=>'<button type="button" class="chip '+(k===kind?'active':'')+'" data-ct336-fy-kind="'+k+'">'+l+'</button>').join('')+
 '</div>';
}
function paintForYou336(){
 if(routeNow()!=='discover')return false;
 const d=window.__ctR288R263?.discover263;if(d&&String(d.tab||'foryou')!=='foryou')return false;
 const m=fyModel336(),host=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!m||!host)return false;
 const dailyKind=m.daily?catOf(m.daily):'movie';
 host.innerHTML='<div data-ct328-foryou data-ct329-foryou data-ct336-foryou>'+
  filters336()+
  (m.daily?'<section class="panel ct336-block ct336-daily" data-ct336-kind="'+dailyKind+'"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct336-daily-inner"><div class="ct336-slot ct336-daily-slot" data-ct336-kind="'+dailyKind+'" data-ct336-slot="daily"><div class="ct336-cardwrap">'+card336(m.daily)+'</div>'+actionRow336(m.daily,{bucket:'daily',kind:dailyKind,swap:'daily',length:m.dailyLength})+'</div></div></section>':'')+
  rail336('Da sua Watchlist',m.watch,'watch',m.lengths.watch)+
  rail336('100% novos',m.fresh,'fresh',m.lengths.fresh)+
  '<div class="ct336-empty" hidden>Nenhum item elegível para este filtro.</div></div>';
 host.dataset.ct336Owned='foryou';applyForYouFilter336();return true;
}
function applyForYouFilter336(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 const st=window.__ctR319Test?.state,kind=['movie','series','anime'].includes(String(st?.fyKind))?String(st.fyKind):'all';
 root.dataset.ct336Filter=kind;let visible=0;
 for(const node of qa('[data-ct336-kind]',root)){
  if(node.closest('[data-ct336-kind]')!==node)continue;
  const show=kind==='all'||node.dataset.ct336Kind===kind;node.hidden=!show;if(show)visible++;
 }
 for(const block of qa('[data-ct336-section]',root)){
  block.hidden=!qa(':scope .ct336-slot',block).some(x=>!x.hidden);
 }
 const daily=q('.ct336-daily',root);if(daily)daily.hidden=!(kind==='all'||daily.dataset.ct336Kind===kind);
 qa('[data-ct336-fy-kind]',root).forEach(b=>b.classList.toggle('active',b.dataset.ct336FyKind===kind));
 const empty=q('.ct336-empty',root);if(empty)empty.hidden=visible>0;
 return true;
}
function removeKey336(arr,key){return rows(arr).filter(x=>keyOf(x)!==key)}
function normalizeIndexes336(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const pool=rows(st[bucket+'Pools']?.[kind]);if(st[bucket+'Index'])st[bucket+'Index'][kind]=pool.length?Math.min(Number(st[bucket+'Index'][kind]||0),pool.length-1):0;
 }
 const d=rows(st.dailyPool);st.dailyIndex=d.length?Math.min(Number(st.dailyIndex||0),d.length-1):0;
}
function optimisticRotate336(action,key){
 const st=window.__ctR309Test?.state;if(!st)return false;
 if(action==='seen'){
  for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])st[b+'Pools'][k]=removeKey336(st[b+'Pools'][k],key);
  st.dailyPool=removeKey336(st.dailyPool,key);
 }else if(action==='watchlist'){
  for(const k of ['movie','series','anime'])st.freshPools[k]=removeKey336(st.freshPools[k],key);
  st.dailyPool=removeKey336(st.dailyPool,key);
 }
 normalizeIndexes336(st);window.__ctR309Test?.setForYouState?.(st);paintForYou336();return true;
}
function swap336(name){
 const st=window.__ctR309Test?.state;if(!st)return false;
 if(name==='daily'){const pool=rows(st.dailyPool);if(pool.length<2)return false;st.dailyIndex=(Number(st.dailyIndex||0)+1)%pool.length}
 else{
  const [bucket,kind]=String(name||'').split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const pool=rows(st[bucket+'Pools']?.[kind]);if(pool.length<2)return false;
  st[bucket+'Index'][kind]=(Number(st[bucket+'Index'][kind]||0)+1)%pool.length;
 }
 window.__ctR309Test?.setForYouState?.(st);paintForYou336();return true;
}
async function persist336(btn){
 if(!btn||btn.disabled)return false;
 const action=String(btn.dataset.ct336Action||''),media=String(btn.dataset.ct336Media||''),[type,idRaw]=media.split(':'),id=Number(idRaw||0);
 if(!id||!['movie','tv'].includes(type)||!['watchlist','seen'].includes(action))return false;
 optimisticRotate336(action,media);
 try{
  if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');await addWatchlist(type,id)}
  else{if(typeof markSeen!=='function')throw new Error('Visto indisponível');await markSeen(type,id)}
  try{await window.__ctR295Test?.authority?.(true)}catch{}
  return true;
 }catch(e){
  try{toast(e?.message||String(e))}catch{}
  try{await window.__ctR321?.loadForYou?.(true);paintForYou336()}catch{}
  return false;
 }
}
function setFyKind336(kind){
 const st=window.__ctR319Test?.state;if(!st)return false;
 st.fyKind=['movie','series','anime'].includes(kind)?kind:'all';applyForYouFilter336();return true;
}

/* ---------- DISCOVER TAB OWNER ---------- */
async function switchDiscover336(tab){
 const d=window.__ctR288R263?.discover263;if(!d)return false;
 const wanted=String(tab||'foryou'),seq=++discoverSeq;d.tab=wanted;if(wanted==='top10')d.type='all';
 qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ct319Tab===wanted));
 try{
  if(wanted==='foryou'){await window.__ctR321?.loadForYou?.(false);if(seq===discoverSeq)paintForYou336()}
  else if(wanted==='top10')await window.__ctR321?.loadTop?.(false);
  else await window.__ctR321?.loadDiscover?.(wanted,false);
  return true;
 }catch(e){try{toast(e?.message||String(e))}catch{}return false}
}
if(window.__ctR328){window.__ctR328.paintForYou=paintForYou336;window.__ctR328.applyForYouFilter=applyForYouFilter336;window.__ctR328.swapForYou=swap336}
if(window.__ctR329){window.__ctR329.paintForYou=paintForYou336;window.__ctR329.applyFilter=applyForYouFilter336;window.__ctR329.swapForYou=swap336}

/* ---------- GLOBAL SEARCH: movies + series + people + episode names ---------- */
function levenshtein336(a,b){
 a=norm(a);b=norm(b);if(a===b)return 0;if(!a)return b.length;if(!b)return a.length;
 const prev=Array.from({length:b.length+1},(_,i)=>i),cur=new Array(b.length+1);
 for(let i=1;i<=a.length;i++){cur[0]=i;for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));for(let j=0;j<=b.length;j++)prev[j]=cur[j]}
 return prev[b.length];
}
function episodeScore336(name,query){
 const a=norm(name),b=norm(query);if(!a||!b)return 99;if(a===b)return 0;if(a.includes(b)||b.includes(a))return 1;return levenshtein336(a,b)<=2?2:99;
}
async function localEpisodes336(query){
 if(testBridge?.localEpisodes)return rows(await testBridge.localEpisodes(query));
 try{return rows(await rpc('cinetracker_episode_search_v336',{p_query:query,p_limit:8}))}catch{return[]}
}
async function targets336(){
 if(testBridge?.targets)return rows(await testBridge.targets());
 if(Date.now()-targetCache.at<300000&&targetCache.rows.length)return targetCache.rows;
 try{const data=rows(await rpc('cinetracker_episode_search_targets_v336',{p_limit:16}));targetCache={at:Date.now(),rows:data};return data}catch{return[]}
}
async function season336(tmdbId,seasonNo){
 const key=tmdbId+':'+seasonNo+':en-US';if(seasonCache.has(key))return seasonCache.get(key);
 const p=(async()=>{try{
  if(testBridge?.season)return await testBridge.season(tmdbId,seasonNo,'en-US');
  return await tmdb('/tv/'+tmdbId+'/season/'+seasonNo,{language:'en-US'});
 }catch{return null}})();
 seasonCache.set(key,p);return p;
}
async function liveEpisodes336(query){
 if(norm(query).length<4)return[];
 const targets=await targets336(),out=[],seen=new Set();
 for(let i=0;i<targets.length&&out.length<8;i+=4){
  const batch=targets.slice(i,i+4);
  const jobs=[];
  for(const t of batch){
   const seasons=[...new Set(rows(t?.season_numbers).map(Number).filter(x=>x>0))].slice(0,2);
   for(const sn of seasons)jobs.push((async()=>({t,sn,data:await season336(Number(t.tmdb_id),sn)}))());
  }
  const resolved=await Promise.all(jobs);
  for(const {t,sn,data} of resolved){
   for(const ep of rows(data?.episodes)){
    const score=episodeScore336(ep?.name,query);if(score>2)continue;
    const k=Number(t.tmdb_id)+':'+sn+':'+Number(ep?.episode_number||0);if(seen.has(k))continue;seen.add(k);
    out.push({media_type:'episode',tmdb_id:Number(t.tmdb_id),series_title:t.series_title,poster_path:t.poster_path,episode_title:ep.name,season_number:sn,episode_number:Number(ep.episode_number||0),air_date:ep.air_date||null,still_path:ep.still_path||null,source:'live',match_score:score});
   }
  }
 }
 return out.sort((a,b)=>(a.match_score??9)-(b.match_score??9)||String(b.air_date||'').localeCompare(String(a.air_date||''))).slice(0,8);
}
function episodeKey336(x){return [x?.tmdb_id,x?.season_number,x?.episode_number].join(':')}
function mergeEpisodes336(local,live){
 const map=new Map();
 for(const x of [...rows(local),...rows(live)]){
  const k=episodeKey336(x),prev=map.get(k);
  if(!prev||x.source==='live')map.set(k,{...prev,...x});
 }
 return [...map.values()].slice(0,8);
}
function episodeHtml336(x){
 const poster=x?.still_path||x?.poster_path||'',src=poster?(String(poster).startsWith('http')?poster:img(poster,x?.still_path?'w300':'w154')):'';
 const se='T'+String(Number(x?.season_number||0)).padStart(2,'0')+'E'+String(Number(x?.episode_number||0)).padStart(2,'0');
 return '<div class="global-result ct336-episode-result" data-media="tv:'+Number(x?.tmdb_id||0)+'">'+
  '<div class="thumb"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><div><b>'+esc(x?.episode_title||'Episódio')+'</b>'+
  '<small class="muted">Episódio · '+esc(x?.series_title||'Série')+' · '+se+(x?.air_date?' · '+esc(x.air_date):'')+'</small></div></div>';
}
function standardHtml336(x){
 if(x.media_type==='person')return '<div class="global-result person" data-person="'+Number(x.id||0)+'"><div class="thumb"'+(x.profile_path?' style="background-image:url(\''+img(x.profile_path,'w185')+'\')"':'')+'></div><div><b>'+esc(x.name)+'</b><small class="muted">Pessoa</small></div></div>';
 return '<div class="global-result" data-media="'+x.media_type+':'+Number(x.id||0)+'"><div class="thumb"'+(x.poster_path?' style="background-image:url(\''+img(x.poster_path,'w154')+'\')"':'')+'></div><div><b>'+esc(x.title||x.name)+'</b><small class="muted">'+(x.media_type==='movie'?'Filme':'Série')+'</small></div></div>';
}
function paintSearch336(out,episodes,standard){
 if(!out)return;
 const all=[...rows(episodes).map(episodeHtml336),...rows(standard).map(standardHtml336)];
 out.innerHTML='<div class="global-results">'+(all.join('')||'<div class="empty">Nenhum resultado.</div>')+'</div>';
}
async function globalSearch336(query){
 const out=q('[data-global-results]');if(!out)return;const term=String(query||'').trim(),seq=++searchSeq;
 if(term.length<2){out.innerHTML='';return}
 out.innerHTML='<div class="global-results"><div class="loader">Buscando...</div></div>';
 try{
  const baseP=testBridge?.standard
   ? Promise.resolve(testBridge.standard(term))
   : Promise.all([safeTmdb('/search/movie',{query:term,page:1}),safeTmdb('/search/tv',{query:term,page:1}),safeTmdb('/search/person',{query:term,page:1})]).then(([m,t,p])=>[
      ...rows(m?.results).slice(0,5).map(x=>({...x,media_type:'movie'})),
      ...rows(t?.results).slice(0,5).map(x=>({...x,media_type:'tv'})),
      ...rows(p?.results).slice(0,5).map(x=>({...x,media_type:'person'}))
    ]);
  const [standard,local]=await Promise.all([baseP,localEpisodes336(term)]);
  if(seq!==searchSeq)return;paintSearch336(out,local,standard);
  const live=await liveEpisodes336(term);if(seq!==searchSeq)return;
  paintSearch336(out,mergeEpisodes336(local,live),standard);
 }catch(e){if(seq===searchSeq)out.innerHTML='<div class="global-results"><div class="error">'+esc(e?.message||e)+'</div></div>'}
}
try{globalSearch=globalSearch336}catch{}

/* ---------- FIRST CAPTURE OWNER ---------- */
function earlyHandle336(target){
 if(!target?.closest)return false;
 const ht=target.closest('[data-home-tab]');if(ht&&routeNow()==='home'){switchHome336(ht.dataset.homeTab);return true}
 const dt=target.closest('[data-ct319-tab]');if(dt&&routeNow()==='discover'){void switchDiscover336(dt.dataset.ct319Tab);return true}
 const filter=target.closest('[data-ct336-fy-kind]');if(filter&&routeNow()==='discover'){setFyKind336(String(filter.dataset.ct336FyKind||'all'));return true}
 const swap=target.closest('[data-ct336-swap-only]');if(swap&&routeNow()==='discover'){swap336(String(swap.dataset.ct336SwapOnly||''));return true}
 const action=target.closest('[data-ct336-action]');if(action&&routeNow()==='discover'){void persist336(action);return true}
 return false;
}
window.__ctR336EarlyHandle=earlyHandle336;

const style=document.createElement('style');style.id='ct-web-r336';style.textContent=`
/* HOME: history is normal page content above the anchor; switching tabs lands on the first actionable section. */
[data-home] [data-ct274-history]{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,[data-home] [data-ct274-history] .ct274-history-stack{display:block!important;max-height:none!important;height:auto!important;overflow:visible!important}
[data-home] [data-ct275-history-toggle],[data-home] [data-ct324-history-toggle],[data-home] [data-ct332-history-toggle],[data-home] [data-ct333-history-toggle],[data-home] [data-ct334-history-toggle],[data-home] [data-ct335-history-toggle]{display:none!important}

/* Pra você filters live inside Pra você, never in the global Discover tab strip. */
[data-ct336-foryou]{--ct336-w:154px;min-width:0!important;max-width:100%!important}
@media(min-width:1100px){[data-ct336-foryou]{--ct336-w:176px}}
[data-ct336-foryou] .ct336-filters{display:flex!important;flex-flow:row nowrap!important;gap:5px!important;overflow-x:auto!important;margin:0 0 8px!important;padding:0 0 2px!important}
[data-ct336-foryou] .ct336-filters>.chip{flex:0 0 auto!important;min-height:28px!important;height:28px!important;padding:3px 9px!important;font-size:10px!important;white-space:nowrap!important}
[data-ct336-foryou] .ct336-block{box-sizing:border-box!important;width:100%!important;max-width:100%!important;overflow:hidden!important;margin-bottom:10px!important;padding-bottom:8px!important}
[data-ct336-foryou] .ct336-rail,[data-ct336-foryou] .ct336-daily-inner{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 1px 8px!important}
[data-ct336-foryou] .ct336-slot{box-sizing:border-box!important;display:flex!important;flex:0 0 var(--ct336-w)!important;flex-direction:column!important;width:var(--ct336-w)!important;min-width:var(--ct336-w)!important;max-width:var(--ct336-w)!important;overflow:visible!important}
[data-ct336-foryou] .ct336-slot[hidden],[data-ct336-foryou] .ct336-block[hidden]{display:none!important}
[data-ct336-foryou] .ct336-slot-head h3{margin:0 0 5px!important;font-size:11px!important}
[data-ct336-foryou] .ct336-cardwrap,[data-ct336-foryou] .ct336-cardwrap>.ct288-card{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important}
[data-ct336-foryou] .ct336-actions{box-sizing:border-box!important;display:grid!important;gap:3px!important;width:100%!important;height:26px!important;min-height:26px!important;margin:5px 0 0!important;overflow:visible!important}
[data-ct336-foryou] .ct336-actions-two{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions-three{grid-template-columns:repeat(3,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions>.ct336-action{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:26px!important;min-height:26px!important;margin:0!important;padding:2px 2px!important;border-radius:7px!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-ct336-foryou] .ct336-actions>.ct336-action[disabled]{opacity:.6!important}
.ct336-episode-result small{white-space:normal!important}
`;document.head.appendChild(style);

setTimeout(()=>{
 if(routeNow()==='home'){normalizeHistory336();requestAnimationFrame(()=>alignHome336(homeKind336()))}
 if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'')==='foryou')paintForYou336();
},0);

window.__ctR336={
 switchHome:switchHome336,normalizeHistory:normalizeHistory336,alignHome:alignHome336,
 paintForYou:paintForYou336,applyForYouFilter:applyForYouFilter336,swapForYou:swap336,persistForYou:persist336,switchDiscover:switchDiscover336,
 globalSearch:globalSearch336,liveEpisodes:liveEpisodes336,episodeScore:episodeScore336,
 version:'1.0.127',setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR336Test={homeAnchor336,applyHomeTab336,fyModel336,paintForYou336,applyForYouFilter336,optimisticRotate336,swap336,episodeScore336,mergeEpisodes336,episodeHtml336,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();
