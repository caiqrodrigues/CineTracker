/* CineTracker Web 1.0.103 r312 — single-owner Discover, resilient auth, live Profile, inline Sports filters. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR312)return;
window.__ctR312='single-owner-discover+auth-retry+live-profile+inline-sports-filters';
window.__ctR312Discover='persistent-shell+compact-foryou+filtered-public+stable-scroll';
window.__ctR312Sports='inline-dynamic-filter-next-previous+jwt-resilient';
window.__ctR312Profile='stadium-button+live-favorite-actors';
window.__ctR312Android='preserved-1.0.20-10062';

const TABS=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const PUBLIC=new Set(['trending','popular','new','anticipated','top']);
const LABELS=Object.fromEntries(TABS);
const R295=window.__ctR295Test||{},R309=window.__ctR309||{},T309=window.__ctR309Test||{},R310=window.__ctR310||{},R311=window.__ctR311||{},B255=window.__ctR312R255||{};
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const arr=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0);
const keyOf=x=>typeOf(x)+':'+idOf(x);
const titleOf=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const dateOf=x=>String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'');
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const state={tab:'foryou',type:'all',token:0,topProvider:0,personal:null,personalAt:0,source:new Map()};
let testBridge=null;

function imageUrl312(path,size){
 if(!path)return'';
 try{if(typeof img==='function')return img(path,size||'w342')}catch{}
 try{return String(SUPABASE_URL||'')+'/functions/v1/tmdb-image?path='+encodeURIComponent(path)+'&size='+(size||'w342')}catch{return''}
}
function anime312(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...arr(x?.genre_ids),...arr(x?.raw_tmdb?.genre_ids),...arr(x?.genres).map(g=>Number(g?.id||0))].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...arr(x?.origin_country),...arr(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function typeLabel312(x){return typeOf(x)==='movie'?'Filme':anime312(x)?'Anime':'Série'}
function dedupe312(list){
 const keys=new Set(),visual=new Set(),out=[];
 for(const x of arr(list)){
  const k=keyOf(x),v=typeOf(x)+'|'+norm(titleOf(x))+'|'+dateOf(x).slice(0,4);
  if(!validKey(k)||keys.has(k)||visual.has(v))continue;
  keys.add(k);visual.add(v);out.push(x);
 }
 return out;
}
async function personal312(force=false){
 if(testBridge?.personal)return testBridge.personal(force);
 if(!force&&state.personal&&Date.now()-state.personalAt<20000)return state.personal;
 const [a,w]=await Promise.all([
  Promise.resolve(R295.authority?.(!!force)).catch(()=>null),
  Promise.resolve(R310.canonicalWatchlist?.(!!force)).catch(()=>null)
 ]);
 const seen=new Set(a?.seen||[]),watch=new Set(a?.watch||[]);
 for(const k of w?.keys||[])watch.add(String(k));
 state.personal={seen,watch,raw:a||null};state.personalAt=Date.now();
 return state.personal;
}
function filterRows312(list,p,filter=true){
 let out=dedupe312(list);
 if(state.type==='movie'||state.type==='tv')out=out.filter(x=>typeOf(x)===state.type);
 if(filter)out=out.filter(x=>!p?.seen?.has?.(keyOf(x))&&!p?.watch?.has?.(keyOf(x)));
 return out;
}
function poster312(x){
 const u=imageUrl312(posterOf(x),'w342');
 return u?'<img class="ct312-poster" loading="lazy" src="'+esc(u)+'" alt="">':'<div class="ct312-poster ct312-poster-empty">Sem capa</div>';
}
function meta312(x){
 const y=dateOf(x).slice(0,4),score=scoreOf(x),parts=[y,typeLabel312(x)];
 if(score>0)parts.push('★ '+score.toFixed(1));
 return parts.filter(Boolean).join(' · ');
}
function action312(x,opt={}){
 if(!x)return'';
 const k=keyOf(x),saved=!!opt.saved,seen=!!opt.seen,swap=String(opt.swap||'');
 let h='<div class="ct312-actions">';
 h+='<button type="button" class="chip ct312-action" data-ct312-action="watchlist" data-media="'+esc(k)+'" '+(saved?'disabled':'')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button>';
 h+='<button type="button" class="chip ct312-action" data-ct312-action="seen" data-media="'+esc(k)+'" '+(seen?'disabled':'')+'>'+(seen?'✓ Visto':'✓ Visto')+'</button>';
 if(swap)h+='<button type="button" class="chip ct312-swap" data-ct312-swap="'+esc(swap)+'">↻ Trocar</button>';
 return h+'</div>';
}
function card312(x,opt={}){
 if(!x)return'<article class="ct312-media ct312-empty"><div class="ct312-poster ct312-poster-empty">Sem item</div><div class="ct312-copy"><b>Sem item elegível</b></div></article>';
 const k=keyOf(x);
 let h='<article class="ct312-item" data-ct312-item="'+esc(k)+'">';
 h+='<button type="button" class="ct312-media" data-media="'+esc(k)+'">';
 if(opt.rank)h+='<span class="ct312-rank">'+Number(opt.rank)+'</span>';
 h+=poster312(x);
 h+='<span class="ct312-copy"><b>'+esc(titleOf(x))+'</b><small>'+esc(meta312(x)||'—')+'</small></span></button>';
 if(opt.actions!==false)h+=action312(x,opt);
 return h+'</article>';
}
function host312(){return q('[data-ct312-content]')}
function root312(){return q('[data-ct312-discover]')}
function shellTabs312(){
 return TABS.map(([k,l])=>'<button type="button" class="chip '+(state.tab===k?'active':'')+'" data-ct312-tab="'+k+'">'+l+'</button>').join('');
}
function shellTypes312(){
 return [['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>'<button type="button" class="chip '+(state.type===k?'active':'')+'" data-ct312-type="'+k+'">'+l+'</button>').join('');
}
function syncShell312(){
 const root=root312();if(!root)return;
 for(const b of qa('[data-ct312-tab]',root))b.classList.toggle('active',b.dataset.ct312Tab===state.tab);
 for(const b of qa('[data-ct312-type]',root))b.classList.toggle('active',b.dataset.ct312Type===state.type);
 const types=q('[data-ct312-types]',root);if(types)types.hidden=state.tab==='foryou'||state.tab==='top10';
 const active=q('[data-ct312-tab].active',root),rail=q('[data-ct312-tabs]',root);
 if(active&&rail){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();if(ar.left<rr.left||ar.right>rr.right)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}
}
function loading312(label){
 const h=host312();if(h)h.innerHTML='<div class="ct312-loading"><span></span><b>'+esc(label||'Carregando…')+'</b></div>';
}
async function source312(tab,force=false){
 if(testBridge?.source)return dedupe312(await testBridge.source(tab,force));
 const k=tab+'|'+state.type;if(!force&&state.source.has(k)&&Date.now()-state.source.get(k).at<90000)return state.source.get(k).rows;
 if(typeof window.__ctR300Test?.sourceRows300!=='function')throw new Error('Fonte do Descobrir indisponível');
 const rows=dedupe312(await window.__ctR300Test.sourceRows300(tab));
 state.source.set(k,{at:Date.now(),rows});return rows;
}
function publicMarkup312(rows,tab,p,filter){
 const clean=filterRows312(rows,p,filter),title=LABELS[tab]||'Descobrir';
 let h='<section class="panel ct312-public"><div class="panel-head"><h2>'+esc(title)+'</h2><small>'+clean.length+'</small></div><div class="ct312-rail">';
 for(const x of clean){const k=keyOf(x);h+=card312(x,{saved:p?.watch?.has?.(k),seen:p?.seen?.has?.(k),actions:true})}
 h+=clean.length?'':'<div class="empty">Nenhum item elegível neste filtro.</div>';
 return h+'</div></section>';
}
async function loadPublic312(tab,force=false){
 const token=++state.token;loading312('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const [p,raw]=await Promise.all([personal312(!!force),source312(tab,!!force)]);
  if(token!==state.token||state.tab!==tab||routeNow()!=='discover')return false;
  const h=host312();if(h)h.innerHTML=publicMarkup312(raw,tab,p,PUBLIC.has(tab));
  return true;
 }catch(e){if(token===state.token&&host312())host312().innerHTML='<div class="empty">Não foi possível carregar agora.<br><button type="button" class="chip" data-ct312-retry>Tentar novamente</button></div>';return false}
}
function current312(pool,index){return arr(pool).length?arr(pool)[Math.abs(Number(index||0))%arr(pool).length]:null}
function fyModel312(s){
 if(!s)return null;
 const w={},f={};for(const kind of ['movie','series','anime']){w[kind]=current312(s.watchPools?.[kind],s.watchIndex?.[kind]);f[kind]=current312(s.freshPools?.[kind],s.freshIndex?.[kind])}
 const used=new Set([...Object.values(w),...Object.values(f)].filter(Boolean).map(keyOf));
 let daily=current312(s.dailyPool,s.dailyIndex);if(daily&&used.has(keyOf(daily)))daily=arr(s.dailyPool).find(x=>!used.has(keyOf(x)))||daily;
 return{watch:w,fresh:f,daily};
}
function fySlot312(label,kind,x,bucket,saved){
 return '<section class="ct312-fy-slot"><h3>'+label+'</h3>'+card312(x,{saved,actions:true,swap:bucket+':'+kind})+'</section>';
}
function renderForYou312(){
 const s=T309.state,m=fyModel312(s),h=host312();if(!h)return false;
 if(!m){h.innerHTML='<div class="empty">Recomendações indisponíveis agora.</div>';return false}
 let html='<div class="ct312-foryou"><section class="panel ct312-daily"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct312-daily-item">'+card312(m.daily,{actions:true,swap:'daily'})+'</div></section>';
 html+='<section class="panel ct312-fy-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct312-fy-grid">';
 html+=fySlot312('Filme','movie',m.watch.movie,'watch',true)+fySlot312('Série','series',m.watch.series,'watch',true)+fySlot312('Anime','anime',m.watch.anime,'watch',true)+'</div></section>';
 html+='<section class="panel ct312-fy-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct312-fy-grid">';
 html+=fySlot312('Filme','movie',m.fresh.movie,'fresh',false)+fySlot312('Série','series',m.fresh.series,'fresh',false)+fySlot312('Anime','anime',m.fresh.anime,'fresh',false)+'</div></section></div>';
 h.innerHTML=html;return true;
}
async function loadForYou312(force=false){
 const token=++state.token;loading312('Montando recomendações…');
 try{
  if(typeof R309.buildForYou!=='function')throw new Error('Compositor indisponível');
  await R309.buildForYou(!!force);
  if(token!==state.token||state.tab!=='foryou'||routeNow()!=='discover')return false;
  return renderForYou312();
 }catch(e){if(token===state.token&&host312())host312().innerHTML='<div class="empty">Não foi possível montar as recomendações agora.<br><button type="button" class="chip" data-ct312-retry>Tentar novamente</button></div>';return false}
}
function swapForYou312(name){
 const s=T309.state;if(!s)return false;
 if(name==='daily'){if(arr(s.dailyPool).length<2)return false;s.dailyIndex=(Number(s.dailyIndex||0)+1)%s.dailyPool.length}
 else{const p=String(name||'').split(':'),bucket=p[0],kind=p[1],pools=s[bucket+'Pools'],idx=s[bucket+'Index'];if(!pools||!idx||!arr(pools[kind]).length)return false;idx[kind]=(Number(idx[kind]||0)+1)%pools[kind].length}
 return renderForYou312();
}
async function loadTop10312(force=false){
 const token=++state.token;loading312('Carregando Top 10…');
 try{
  if(typeof ct171Providers!=='function'||typeof ct171TopRows!=='function')throw new Error('Top 10 indisponível');
  const providers=await ct171Providers();if(token!==state.token||state.tab!=='top10')return false;
  if(!state.topProvider||!providers.some(p=>Number(p.provider_id)===Number(state.topProvider)))state.topProvider=Number(providers[0]?.provider_id||0);
  const data=state.topProvider?await ct171TopRows(Number(state.topProvider)):{series:[],movies:[]};if(token!==state.token||state.tab!=='top10')return false;
  let h='<section class="ct312-top"><div class="ct312-provider-rail">';
  for(const p of providers)h+='<button type="button" class="chip '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'" data-ct312-provider="'+Number(p.provider_id)+'">'+esc(p.provider_name||'Streaming')+'</button>';
  h+='</div><section class="panel"><div class="panel-head"><h2>Top 10 Séries</h2></div><div class="ct312-rail">';
  arr(data.series).slice(0,10).forEach((x,i)=>h+=card312(x,{rank:i+1,actions:false}));
  h+='</div></section><section class="panel"><div class="panel-head"><h2>Top 10 Filmes</h2></div><div class="ct312-rail">';
  arr(data.movies).slice(0,10).forEach((x,i)=>h+=card312(x,{rank:i+1,actions:false}));
  h+='</div></section></section>';if(host312())host312().innerHTML=h;return true;
 }catch(e){if(token===state.token&&host312())host312().innerHTML='<div class="empty">Não foi possível carregar o Top 10 agora.</div>';return false}
}
async function loadTab312(tab=state.tab,force=false){
 state.tab=TABS.some(x=>x[0]===tab)?tab:'foryou';try{if(typeof discover263!=='undefined'){discover263.tab=state.tab;discover263.type=state.type}}catch{}
 syncShell312();
 if(state.tab==='foryou')return loadForYou312(force);
 if(state.tab==='top10')return loadTop10312(force);
 return loadPublic312(state.tab,force);
}
async function renderDiscover312(seq){
 try{if(typeof discover263!=='undefined'){if(TABS.some(x=>x[0]===String(discover263.tab)))state.tab=String(discover263.tab);state.type=['all','movie','tv'].includes(String(discover263.type))?String(discover263.type):'all'}}catch{}
 const body='<div class="page ct312-discover" data-discover data-ct312-discover><div class="ct312-tab-shell"><button type="button" class="ct312-arrow" data-ct312-prev aria-label="Abas anteriores">‹</button><div class="tabs ct312-tabs" data-ct312-tabs>'+shellTabs312()+'</div><button type="button" class="ct312-arrow" data-ct312-next aria-label="Próximas abas">›</button></div><div class="filters ct312-types" data-ct312-types>'+shellTypes312()+'</div><div data-ct312-content><div class="ct312-loading"><span></span><b>Carregando…</b></div></div><div class="ct312-legacy-sink" data-ct263-discover-content hidden></div></div>';
 setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',body));
 if(seq!=null&&typeof navSeq!=='undefined'&&seq!==navSeq)return;
 syncShell312();void loadTab312(state.tab,false);
}
try{renderDiscover=renderDiscover312}catch{}
try{loadDiscover263=loadTab312}catch{}
window.__ctR288LoadDiscover=loadTab312;

async function persistDiscover312(btn){
 if(!btn||btn.disabled)return false;const raw=String(btn.dataset.media||''),p=raw.split(':'),type=p[0],id=Number(p[1]||0),action=String(btn.dataset.ct312Action||'');if(!id)return false;
 const old=btn.textContent;btn.disabled=true;btn.textContent='…';
 try{
  if(action==='watchlist'){if(testBridge?.addWatchlist)await testBridge.addWatchlist(type,id);else await addWatchlist(type,id)}
  else if(action==='seen'){if(testBridge?.markSeen)await testBridge.markSeen(type,id);else await markSeen(type,id)}
  else return false;
  state.personal=null;state.personalAt=0;state.source.clear();try{R310.invalidateWatch?.()}catch{}
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r312-discover',action,type,id}}));
  await loadTab312(state.tab,true);return true;
 }catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||String(e))}catch{}return false}
}

/* Profile: stadium is guaranteed as the same control family; favorite actors are loaded live from the table. */
function findStat312(root,label){
 const n=norm(label);
 for(const x of qa('small,label,.stat-label,[data-stat-label]',root)){if(norm(x.textContent).includes(n)){const c=x.closest('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]');if(c)return c}}
 return qa('.stat,[data-stat],.stat-card,.profile-stat,button,a,[role="button"]',root).find(x=>norm(x.textContent).includes(n))||null;
}
async function ensureStadium312(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;
 const events=findStat312(root,'Eventos assistidos');if(!events)return false;
 let stadium=findStat312(root,'Jogos no Estádio'),count=0;
 if(testBridge&&testBridge.stadiumCount!=null){count=Number(typeof testBridge.stadiumCount==='function'?await testBridge.stadiumCount():testBridge.stadiumCount)||0}
 else try{const s=await rpc('cinetracker_sports_stadium_summary_v296',{});count=Number(s?.stadium_events??s?.[0]?.stadium_events??0)}catch{try{const h=arr(await rpc('cinetracker_sports_watch_history_v296',{}));count=h.filter(x=>x?.is_watched!==false&&x?.attended_in_person===true).length}catch{}}
 if(!stadium){
  stadium=events.cloneNode(true);stadium.removeAttribute('data-ct299-history');stadium.removeAttribute('data-ct311-stat');events.parentElement?.appendChild(stadium);
 }
 stadium.className=events.className;stadium.dataset.ct299History='stadium';stadium.dataset.ct312Stadium='1';stadium.setAttribute('role','button');stadium.setAttribute('tabindex','0');stadium.setAttribute('aria-label','Ver jogos no estádio');stadium.setAttribute('title','Ver jogos no estádio');
 const label=q('small,label,.stat-label,[data-stat-label]',stadium);if(label)label.textContent='Jogos no Estádio';
 const val=q('b,strong,.value,.stat-value',stadium);if(val)val.textContent=Number(count).toLocaleString('pt-BR');
 try{R311.unifyProfileStats?.(root)}catch{};return true;
}
async function actorRows312(){
 if(testBridge?.actors)return arr(await testBridge.actors());
 if(typeof sbApi!=='function')return[];
 return arr(await sbApi('favorite_actors?select=id,tmdb_person_id,actor_name,profile_path,created_at&order=created_at.desc&limit=500'));
}
function actorMarkup312(a){
 const id=Number(a?.tmdb_person_id||0),u=imageUrl312(a?.profile_path,'w342');
 return '<article class="ct312-actor-card"><button type="button" class="ct312-actor-open" data-person="'+id+'">'+(u?'<img loading="lazy" src="'+esc(u)+'" alt="">':'<span class="ct312-actor-empty"></span>')+'<b>'+esc(a?.actor_name||('TMDB #'+id))+'</b></button><button type="button" class="ct312-actor-remove" data-ct312-actor-remove="'+id+'" aria-label="Remover ator favorito">♥</button></article>';
}
async function refreshActors312(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;
 const rows=await actorRows312();if(routeNow()!=='profile')return false;
 let heading=qa('h1,h2,h3,h4,.panel-title,.section-title',root).find(x=>norm(x.textContent).includes('atores favoritos')),section=heading?.closest('section,.panel,article');
 if(!section){section=document.createElement('section');section.className='panel ct312-actors-section';section.innerHTML='<div class="panel-head"><h2>Atores Favoritos</h2><small data-ct312-actor-count>0</small></div><div class="ct312-actor-rail" data-ct312-actor-rail></div>';root.appendChild(section);heading=q('h2',section)}
 let rail=q('[data-ct312-actor-rail],.ct115-actors-grid,.ct310-actor-rail,.ct309-actor-rail',section);
 if(!rail){const existing=qa('.row,.profile-actors,.actors-row',section).find(x=>q('[data-person],[data-person-id]',x));rail=existing||document.createElement('div');if(!existing)section.appendChild(rail)}
 rail.className='ct312-actor-rail';rail.dataset.ct312ActorRail='1';rail.innerHTML=rows.map(actorMarkup312).join('')||'<div class="empty">Nenhum ator favorito ainda.</div>';
 let count=q('[data-ct312-actor-count],.ct991-count',section);if(!count){count=document.createElement('small');count.dataset.ct312ActorCount='1';heading?.parentElement?.appendChild(count)}if(count)count.textContent=String(rows.length);
 section.classList.add('ct312-actors-section');return true;
}
async function refreshProfile312(){
 if(routeNow()!=='profile')return false;await Promise.all([ensureStadium312(),refreshActors312()]);return true;
}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);await refreshProfile312();return out}}}catch{}

/* Sports: filters exist only inside Próximos/Anteriores and come from payload.sports. */
function sportsFilter312(sports,current){
 let h='<div class="ct312-sport-filter" data-ct312-sport-filter-row><button type="button" class="chip '+(current==='all'?'active':'')+'" data-ct312-sport="all">Todos</button>';
 for(const s of arr(sports)){const slug=String(s?.slug||''),name=String(s?.name||s?.name_pt||slug);if(!slug)continue;h+='<button type="button" class="chip '+(current===slug?'active':'')+'" data-ct312-sport="'+esc(slug)+'">'+esc((s?.icon||'🏆')+' '+name)+'</button>'}
 return h+'</div>';
}
function paintSports312(){
 const bridge=window.__ctR312R255;if(!bridge)return false;const st=bridge.sportState,p=st?.payload||{},tab=String(st?.tab||'next');
 if(!['next','previous'].includes(tab))st.sport='all';
 const rows=bridge.sportRows(tab),stats=p.stats||{},sports=p.sports||[],host=q('[data-ct255-sports]');if(!host)return false;
 let h='<section class="ct255-f1hub" data-ct255-f1></section><div class="ct312-sports-tabs">';
 for(const x of bridge.sportsTabs){const k=String(x?.[0]||''),l=String(x?.[1]||k);h+='<button type="button" class="ct255-sports-tab '+(tab===k?'active':'')+'" data-ct312-sport-tab="'+esc(k)+'">'+esc(l)+'</button>'}
 h+='</div><section class="panel ct255-sports-feed"><div class="panel-head ct312-sports-head"><div class="ct312-sports-title"><h2>'+esc(bridge.sportLabel(tab))+'</h2><small>'+(tab==='watched'?Number(stats.watched_events||rows.length).toLocaleString('pt-BR')+' assistidos':rows.length)+'</small></div>';
 if(tab==='next'||tab==='previous')h+=sportsFilter312(sports,String(st.sport||'all'));
 h+='</div><div class="ct255-sport-grid">'+(rows.map(e=>bridge.sportCard(e)).join('')||'<div class="empty">Nenhum evento disponível neste filtro.</div>')+'</div></section>';
 host.innerHTML=h;void bridge.paintF1();return true;
}
if(B255?.setPaintSports)B255.setPaintSports(paintSports312);
if(B255?.setF1Content)B255.setF1Content(function(d){
 if(!d)return'<div class="empty">Dados da Fórmula 1 indisponíveis.</div>';
 if(String(B255.f1State?.tab||'')!=='calendar')return B255.baseF1Content(d);
 let h='<div class="ct312-f1-calendar">';
 for(const r of arr(d.schedule)){const season=Number(d.season||new Date().getFullYear()),round=Number(r?.round||0);h+='<button type="button" class="ct312-f1-race" data-ct312-f1-race="'+season+'-'+round+'" data-season="'+season+'" data-round="'+round+'"><b>'+esc(round+'. '+String(r?.raceName||'GP'))+'</b><span>'+esc(String(r?.Circuit?.circuitName||''))+' · '+esc(String(r?.Circuit?.Location?.country||''))+'</span><small>'+esc(B255.f1Time(r))+'</small><em>Abrir corrida</em></button>'}
 return h+'</div>';
});

/* One exact authority before legacy handlers. */
window.__ctR312EarlyHandle=function(target,e){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct312-tab]');if(tab){state.tab=String(tab.dataset.ct312Tab||'foryou');state.type=(state.tab==='foryou'||state.tab==='top10')?'all':state.type;void loadTab312(state.tab,false);return true}
 const type=target.closest('[data-ct312-type]');if(type){state.type=String(type.dataset.ct312Type||'all');void loadTab312(state.tab,false);return true}
 const prev=target.closest('[data-ct312-prev]'),next=target.closest('[data-ct312-next]');if(prev||next){const rail=q('[data-ct312-tabs]');rail?.scrollBy({left:(next?1:-1)*Math.max(240,rail.clientWidth*.75),behavior:'smooth'});return true}
 const retry=target.closest('[data-ct312-retry]');if(retry){void loadTab312(state.tab,true);return true}
 const act=target.closest('[data-ct312-action]');if(act){void persistDiscover312(act);return true}
 const sw=target.closest('[data-ct312-swap]');if(sw){swapForYou312(sw.dataset.ct312Swap);return true}
 const provider=target.closest('[data-ct312-provider]');if(provider){state.topProvider=Number(provider.dataset.ct312Provider||0);void loadTop10312(true);return true}
 const stab=target.closest('[data-ct312-sport-tab]');if(stab&&B255?.sportState){B255.sportState.tab=String(stab.dataset.ct312SportTab||'next');B255.sportState.sport='all';paintSports312();return true}
 const sf=target.closest('[data-ct312-sport]');if(sf&&B255?.sportState){B255.sportState.sport=String(sf.dataset.ct312Sport||'all');paintSports312();return true}
 const race=target.closest('[data-ct312-f1-race]');if(race){const season=Number(race.dataset.season||0),round=Number(race.dataset.round||0),r=arr(B255.f1State?.data?.schedule).find(x=>Number(x?.round||0)===round);if(r)void R311.openRace?.({...r,season,round,title:r?.raceName||('GP '+round)});return true}
 const remove=target.closest('[data-ct312-actor-remove]');if(remove){const id=Number(remove.dataset.ct312ActorRemove||0);if(id>0&&typeof sbApi==='function')void sbApi('favorite_actors?tmdb_person_id=eq.'+id,{method:'DELETE'}).then(()=>{document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'favorite-actor-r312',tmdb_person_id:id,favorite:false}}));return refreshActors312()});return true}
 return false;
};
document.addEventListener('cinetracker:data-changed',e=>{
 state.personal=null;state.personalAt=0;state.source.clear();
 const src=String(e?.detail?.source||'');if(src.includes('favorite-actor'))void refreshActors312();
 if(src.includes('stadium')||src.includes('sports'))void ensureStadium312();
});

const style=document.createElement('style');style.id='ct-web-r312-single-owner';style.textContent=
'.ct312-legacy-sink{display:none!important}.ct312-discover{min-width:0!important}.ct312-tab-shell{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;gap:6px!important;align-items:center!important;margin-bottom:8px!important}.ct312-tabs{display:flex!important;flex-wrap:nowrap!important;gap:6px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 8px!important;scrollbar-width:auto!important}.ct312-tabs::-webkit-scrollbar,.ct312-rail::-webkit-scrollbar,.ct312-provider-rail::-webkit-scrollbar,.ct312-sport-filter::-webkit-scrollbar,.ct312-actor-rail::-webkit-scrollbar,.ct312-f1-calendar::-webkit-scrollbar{height:9px!important;display:block!important}.ct312-arrow{width:30px;height:30px;border:1px solid #27485b;border-radius:9px;background:#0c1c25;color:inherit;cursor:pointer}.ct312-types{display:flex!important;gap:6px!important;min-height:32px!important;margin-bottom:8px!important}.ct312-types[hidden]{visibility:hidden!important;display:flex!important}.ct312-loading{min-height:120px;display:flex;align-items:center;justify-content:center;gap:9px;opacity:.8}.ct312-loading span{width:14px;height:14px;border:2px solid #31576a;border-top-color:#78c9ed;border-radius:50%;animation:ct312spin .8s linear infinite}@keyframes ct312spin{to{transform:rotate(360deg)}}'+
'.ct312-rail{display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scrollbar-width:auto!important}.ct312-item{box-sizing:border-box!important;position:relative!important;display:flex!important;flex:0 0 168px!important;width:168px!important;min-width:168px!important;max-width:168px!important;flex-direction:column!important;overflow:visible!important}.ct312-media{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;border:1px solid #193849!important;border-radius:12px!important;background:#091720!important;color:inherit!important;padding:0!important;text-align:left!important;overflow:visible!important;cursor:pointer!important}.ct312-poster{display:block!important;width:100%!important;aspect-ratio:2/3!important;object-fit:cover!important;border-radius:11px 11px 0 0!important;background:#0f202a!important}.ct312-poster-empty{display:grid!important;place-items:center!important;color:#7892a2!important}.ct312-copy{display:block!important;box-sizing:border-box!important;width:100%!important;padding:8px!important;overflow:visible!important;white-space:normal!important}.ct312-copy b{display:block!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.25!important;font-size:12px!important;word-break:normal!important}.ct312-copy small{display:block!important;margin-top:4px!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.3!important;font-size:10px!important;opacity:.72!important}.ct312-rank{position:absolute;z-index:3;left:5px;top:5px;min-width:25px;height:25px;display:grid;place-items:center;border-radius:8px;background:#050a0fd9;font-weight:900}.ct312-actions{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:5px!important;width:100%!important;margin-top:5px!important;position:static!important}.ct312-actions .chip{position:static!important;inset:auto!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;height:30px!important;min-height:30px!important;margin:0!important;padding:4px 5px!important;border-radius:8px!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct312-actions .ct312-swap{grid-column:1/-1!important}.ct312-public>.panel-head{margin-bottom:8px!important}.ct312-provider-rail{display:flex!important;gap:6px!important;overflow-x:auto!important;padding:2px 2px 8px!important;margin-bottom:8px!important}.ct312-top .panel{margin-bottom:10px!important}'+
'.ct312-foryou{display:grid!important;gap:10px!important}.ct312-daily-item{width:168px!important}.ct312-fy-grid{display:grid!important;grid-template-columns:repeat(3,168px)!important;gap:10px!important;justify-content:start!important;align-items:start!important}.ct312-fy-slot{min-width:0!important}.ct312-fy-slot h3{margin:0 0 5px!important;font-size:12px!important}.ct312-fy-slot .ct312-item{width:168px!important}.ct312-daily,.ct312-fy-block{padding:10px!important}.ct312-daily .panel-head,.ct312-fy-block .panel-head{margin-bottom:7px!important}.ct312-daily .panel-head h2,.ct312-fy-block .panel-head h2{font-size:15px!important;margin:0!important}'+
'.ct312-sports-tabs{display:flex;gap:7px;overflow-x:auto;padding:0 0 10px}.ct312-sports-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important;flex-wrap:wrap!important}.ct312-sports-title{display:flex;align-items:baseline;gap:8px;flex:none}.ct312-sports-title h2{margin:0!important}.ct312-sport-filter{display:flex!important;gap:6px!important;overflow-x:auto!important;max-width:min(900px,100%)!important;padding:0 0 7px!important;scrollbar-width:auto!important}.ct312-sport-filter .chip{white-space:nowrap!important;flex:none!important}.ct312-f1-calendar{display:flex!important;gap:10px!important;overflow-x:auto!important;padding:2px 2px 10px!important}.ct312-f1-race{box-sizing:border-box!important;flex:0 0 230px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:5px!important;padding:12px!important;border:1px solid #23495d!important;border-radius:12px!important;background:#0a1821!important;color:inherit!important;text-align:left!important;cursor:pointer!important}.ct312-f1-race span,.ct312-f1-race small{opacity:.76}.ct312-f1-race em{font-style:normal;color:#6ec8ee;font-weight:700;margin-top:auto}'+
'.ct312-actors-section{overflow:hidden!important}.ct312-actor-rail{display:flex!important;flex-flow:row nowrap!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scrollbar-width:auto!important}.ct312-actor-card{position:relative!important;box-sizing:border-box!important;flex:0 0 118px!important;width:118px!important;min-width:118px!important;border:1px solid #1d4051!important;border-radius:12px!important;background:#091720!important;padding:7px!important}.ct312-actor-open{display:block!important;width:100%!important;border:0!important;background:transparent!important;color:inherit!important;padding:0!important;cursor:pointer!important}.ct312-actor-open img,.ct312-actor-empty{display:block!important;width:100%!important;aspect-ratio:3/4!important;object-fit:cover!important;border-radius:8px!important;background:#10242f!important}.ct312-actor-open b{display:block!important;margin-top:6px!important;font-size:10px!important;white-space:normal!important;line-height:1.25!important}.ct312-actor-remove{position:absolute!important;right:10px!important;top:10px!important;width:27px!important;height:27px!important;border-radius:50%!important;border:1px solid #7c4058!important;background:#241019e8!important;color:#ff9dbc!important;cursor:pointer!important}'+
'@media(max-width:720px){.ct312-item,.ct312-daily-item{flex-basis:148px!important;width:148px!important;min-width:148px!important;max-width:148px!important}.ct312-fy-grid{display:flex!important;flex-flow:row nowrap!important;overflow-x:auto!important;grid-template-columns:none!important;padding-bottom:8px!important}.ct312-fy-slot{flex:0 0 148px!important}.ct312-fy-slot .ct312-item{width:148px!important}.ct312-actions{grid-template-columns:1fr!important}.ct312-actions .ct312-swap{grid-column:auto!important}.ct312-sports-head{display:block!important}.ct312-sport-filter{margin-top:8px!important;max-width:100%!important}}';
document.head.appendChild(style);

window.__ctR312={renderDiscover:renderDiscover312,loadTab:loadTab312,filterRows:filterRows312,refreshProfile:refreshProfile312,paintSports:paintSports312,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},version:'1.0.103'};
window.__ctR312Test={dedupe312,filterRows312,publicMarkup312,card312,fyModel312,renderForYou312,ensureStadium312,refreshActors312,sportsFilter312,paintSports312,setState(v){if(v?.tab)state.tab=v.tab;if(v?.type)state.type=v.type;if(v?.personal){state.personal=v.personal;state.personalAt=Date.now()}},setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get state(){return state}};
})();