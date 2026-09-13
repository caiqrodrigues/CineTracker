/* CineTracker Web 1.0.54 r263 — restore approved Home list, complete Discover rails/providers and F1 watched controls. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR263)return;
window.__ctR263='approved-home-list-discover-intelligence-f1-watched';
window.__ctR263Home='vertical-list+hidden-history+no-home-carousel';
window.__ctR263Discover='nine-tabs-local-rails+personal-exclusions+top10-streaming';
window.__ctR263Sports='f1-db-events+mark-unmark-watched';
window.__ctR263Horizontal='document-fixed+component-local-only';

const q263=(s,r=document)=>r?.querySelector?.(s)||null;
const qa263=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n263=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const esc263=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm263=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const DAY263=86400000;
function day263(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function shift263(days,base=new Date()){const d=new Date(base);d.setHours(12,0,0,0);d.setDate(d.getDate()+Number(days||0));return day263(d)}
const timeout263=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p).catch(()=>fallback),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
const type263=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const id263=x=>n263(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const title263=x=>x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const poster263=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const year263=x=>String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const score263=x=>n263(x?.vote_average??x?.raw_tmdb?.vote_average);
const popularity263=x=>n263(x?.popularity??x?.raw_tmdb?.popularity);
const key263=x=>`${type263(x)}:${id263(x)}`;
function image263(p,size='w342'){try{return typeof img==='function'?img(p,size):p||''}catch{return p||''}}

/* ---------------------------------------------------------------------
   HOME — r262 accidentally converted every .stack into a horizontal flex rail. Restore the
   approved vertical list without touching the canonical bucket/progress logic inherited from
   r261/r262. History remains in the original hidden/upper Home structure. */
function restoreHomeList263(root=document){
 const home=q263('[data-home]',root)||q263('[data-home-view]',root)||(String(typeof route==='function'?route():'')==='home'?q263('#app',root):null);if(!home)return false;
 let changed=false;
 for(const stack of qa263('.home-section .stack,[data-home-view] .stack',home)){
  if(stack.classList.contains('ct262-xrail')){stack.classList.remove('ct262-xrail');changed=true}
  if(stack.classList.contains('ct262-home-rail')){stack.classList.remove('ct262-home-rail');changed=true}
  if(stack.dataset.ct262Rail==='home'){delete stack.dataset.ct262Rail;changed=true}
  if(stack.scrollLeft)stack.scrollLeft=0;
 }
 return changed;
}
function scheduleHomeRestore263(){for(const ms of[0,60,140,420,1000])setTimeout(()=>restoreHomeList263(),ms)}
const paintHome263Base=typeof paintHome==='function'?paintHome:null;
if(paintHome263Base)paintHome=function(...args){const out=paintHome263Base.apply(this,args);scheduleHomeRestore263();return out};
const renderHome263Base=typeof renderHome==='function'?renderHome:null;
if(renderHome263Base)renderHome=async function(...args){const out=await renderHome263Base.apply(this,args);scheduleHomeRestore263();return out};

/* ---------------------------------------------------------------------
   DISCOVER — own the nine approved tabs again. Every browse tab keeps a local horizontal rail,
   personal seen/watchlist/following/not-interested exclusions are applied before paint, and Top
   10 enriches each title with Brazilian streaming providers from TMDB watch/providers. */
const GENRES263={28:'Ação',12:'Aventura',16:'Animação',35:'Comédia',80:'Crime',99:'Documentário',18:'Drama',10751:'Família',14:'Fantasia',36:'História',27:'Terror',10402:'Música',9648:'Mistério',10749:'Romance',878:'Ficção científica',10770:'Cinema TV',53:'Thriller',10752:'Guerra',37:'Faroeste',10759:'Ação e aventura',10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Sci-Fi e fantasia',10766:'Novela',10767:'Talk show',10768:'Guerra e política'};
function genres263(x,limit=3){const named=Array.isArray(x?.genres)?x.genres.map(g=>typeof g==='string'?g:g?.name).filter(Boolean):Array.isArray(x?.raw_tmdb?.genres)?x.raw_tmdb.genres.map(g=>typeof g==='string'?g:g?.name).filter(Boolean):[];if(named.length)return named.slice(0,limit);const ids=Array.isArray(x?.genre_ids)?x.genre_ids:Array.isArray(x?.raw_tmdb?.genre_ids)?x.raw_tmdb.genre_ids:[];return [...new Set(ids.map(v=>GENRES263[n263(v)]).filter(Boolean))].slice(0,limit)}
const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const discover263={tab:'foryou',type:'all',gen:0,personal:null,personalAt:0,cache:new Map(),providers:new Map(),forYou:null,swap:0};
function rowsSet263(rows){return new Set((Array.isArray(rows)?rows:[]).map(x=>key263(x)).filter(k=>!/:(0)$/.test(k)))}
function union263(...sets){const out=new Set();for(const s of sets)for(const x of s||[])out.add(x);return out}
async function personal263(force=false){
 if(!force&&discover263.personal&&Date.now()-discover263.personalAt<120000)return discover263.personal;
 const bad=Symbol.for('ct263-personal-fail');let raw=await timeout263(rpc('cinetracker_recommendation_state_v108',{}),3500,bad);
 if(raw===bad){const old=await timeout263(rpc('cinetracker_recommendation_state_v107',{}),3500,bad);if(old===bad)throw new Error('Biblioteca pessoal indisponível');raw={hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:[]}}
 const hard=rowsSet263(raw?.hard_excluded),fresh=rowsSet263(raw?.fresh_excluded),watch=rowsSet263(raw?.watchlist),excluded=union263(hard,fresh,watch);
 const p={raw,hard,fresh,watch,excluded,watchlist:Array.isArray(raw?.watchlist)?raw.watchlist:[]};discover263.personal=p;discover263.personalAt=Date.now();return p;
}
function strictEligible263(x,p,{allowWatch=false,fresh=false}={}){const id=id263(x),yr=n263(year263(x)),sc=score263(x),t=norm263(title263(x));if(!id||!poster263(x)||sc<7.5||yr<=1990||/wwe|(^| )raw( |$)|smackdown/.test(t))return false;const gs=genres263(x,8).map(norm263);if(gs.length&&gs.every(g=>g==='drama'||g==='documentario'))return false;const k=key263(x);if(p.hard.has(k)||p.fresh.has(k)||(!allowWatch&&p.watch.has(k)))return false;if(fresh){const ds=String(x?.release_date||x?.first_air_date||'').slice(0,10);if(!ds||ds<shift263(-30)||ds>day263())return false}return true}
function browseEligible263(x,p){if(!id263(x)||!poster263(x)||p.excluded.has(key263(x)))return false;if(discover263.type!=='all'&&type263(x)!==discover263.type)return false;return true}
function dedupe263(rows){const seen=new Set(),out=[];for(const x of rows||[]){if(!['movie','tv'].includes(type263(x))||!id263(x))continue;const k=key263(x);if(seen.has(k))continue;seen.add(k);out.push(x)}return out}
async function tmdbPages263(path,params={},kind=null,pages=3){const jobs=[];for(let page=1;page<=pages;page++)jobs.push(timeout263(tmdb(path,{language:'pt-BR',include_adult:false,...params,page}),6000,{results:[]}));const packs=await Promise.all(jobs),all=[];for(const d of packs)for(const x of d?.results||[]){const mt=kind||x?.media_type;if(mt!=='movie'&&mt!=='tv')continue;all.push({...x,media_type:mt})}return dedupe263(all)}
async function pair263(moviePath,tvPath,movieParams={},tvParams={},pages=3){if(discover263.type==='movie')return tmdbPages263(moviePath,movieParams,'movie',pages);if(discover263.type==='tv')return tmdbPages263(tvPath,tvParams,'tv',pages);const [m,t]=await Promise.all([tmdbPages263(moviePath,movieParams,'movie',pages),tmdbPages263(tvPath,tvParams,'tv',pages)]);return dedupe263([...m,...t])}
async function source263(tab){
 if(tab==='top10')return tmdbPages263('/trending/all/week',{},null,3);
 if(tab==='trending')return tmdbPages263('/trending/all/day',{},null,3);
 if(tab==='popular'){const a=await pair263('/movie/popular','/tv/popular',{}, {},3);return a.sort((a,b)=>popularity263(b)-popularity263(a))}
 if(tab==='top'){const a=await pair263('/movie/top_rated','/tv/top_rated',{}, {},3);return a.sort((a,b)=>score263(b)-score263(a))}
 if(tab==='new')return pair263('/discover/movie','/discover/tv',{'primary_release_date.gte':shift263(-30),'primary_release_date.lte':day263(),sort_by:'primary_release_date.desc'},{'first_air_date.gte':shift263(-30),'first_air_date.lte':day263(),sort_by:'first_air_date.desc'},3);
 if(tab==='releases')return pair263('/discover/movie','/discover/tv',{'primary_release_date.gte':shift263(-7),'primary_release_date.lte':shift263(30),sort_by:'primary_release_date.asc'},{'first_air_date.gte':shift263(-7),'first_air_date.lte':shift263(30),sort_by:'first_air_date.asc'},3);
 if(tab==='anticipated')return pair263('/discover/movie','/discover/tv',{'primary_release_date.gte':shift263(1),'primary_release_date.lte':shift263(365),sort_by:'popularity.desc'},{'first_air_date.gte':shift263(1),'first_air_date.lte':shift263(365),sort_by:'popularity.desc'},3);
 if(tab==='calendar')return pair263('/discover/movie','/discover/tv',{'primary_release_date.gte':day263(),'primary_release_date.lte':shift263(90),sort_by:'primary_release_date.asc'},{'first_air_date.gte':day263(),'first_air_date.lte':shift263(90),sort_by:'first_air_date.asc'},3);
 return [];
}
function pickProviders263(data){const br=data?.results?.BR||{},raw=[...(br?.flatrate||[]),...(br?.free||[]),...(br?.ads||[])],seen=new Set(),out=[];for(const x of raw){const id=n263(x?.provider_id);if(!id||seen.has(id))continue;seen.add(id);out.push({id,name:x?.provider_name||'Streaming',logo_path:x?.logo_path||''});if(out.length>=3)break}return out}
async function providers263(x){const k=key263(x),old=discover263.providers.get(k);if(old&&Date.now()-old.at<600000)return old.rows;const d=await timeout263(tmdb(`/${type263(x)}/${id263(x)}/watch/providers`),5000,null),rows=pickProviders263(d);discover263.providers.set(k,{at:Date.now(),rows});return rows}
async function hydrateProviders263(rows){let i=0;async function worker(){while(i<rows.length){const x=rows[i++];x._ct263Providers=await providers263(x)}}await Promise.all(Array.from({length:Math.min(3,Math.max(1,rows.length))},worker));return rows}
function providerHtml263(x,show){if(!show)return'';if(!Array.isArray(x?._ct263Providers))return'<div class="ct263-streaming pending">Buscando streaming…</div>';if(!x._ct263Providers.length)return'<div class="ct263-streaming empty-provider">Streaming não informado</div>';return `<div class="ct263-streaming">${x._ct263Providers.map(p=>`<span title="${esc263(p.name)}">${p.logo_path?`<img src="${esc263(image263(p.logo_path,'w45'))}" alt="">`:''}<i>${esc263(p.name)}</i></span>`).join('')}</div>`}
function card263(x,{providers=false}={}){const type=type263(x),id=id263(x),p=poster263(x),yr=year263(x),gs=genres263(x),sc=score263(x);return `<article class="ct263-media-card"><button type="button" data-media="${type}:${id}">${p?`<img class="ct263-media-poster" src="${esc263(image263(p,'w342'))}" alt="" loading="lazy">`:'<div class="ct263-media-poster ct263-poster-empty">Sem capa</div>'}<div class="ct263-media-copy"><b>${esc263(title263(x))}</b><small>${esc263([yr,gs.join(' · ')].filter(Boolean).join(' · ')||'—')}</small><span>${sc?`★ ${sc.toFixed(1)}`:'Sem nota'}</span>${providerHtml263(x,providers)}</div></button></article>`}
function rail263(rows,opts={}){return `<div class="ct263-media-rail" data-ct263-rail>${(rows||[]).map(x=>card263(x,opts)).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div>`}
function block263(title,rows,extra='',opts={}){return `<section class="panel ct263-discover-block"><div class="panel-head"><h2>${esc263(title)}</h2>${extra||`<small>${rows?.length||0}</small>`}</div>${rail263(rows,opts)}</section>`}
function armRail263(el){if(!el||el.dataset.ct263Drag==='1')return;el.dataset.ct263Drag='1';let st=null,moved=false;el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||(e.button!=null&&e.button!==0)||el.scrollWidth<=el.clientWidth+2)return;st={id:e.pointerId,x:e.clientX,left:el.scrollLeft};moved=false;try{el.setPointerCapture(e.pointerId)}catch{}});el.addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x;if(Math.abs(dx)>4)moved=true;if(moved){el.scrollLeft=st.left-dx;e.preventDefault()}});const end=e=>{if(!st||e.pointerId!==st.id)return;st=null;try{el.releasePointerCapture(e.pointerId)}catch{}};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true)}
function armDiscoverRails263(root=document){for(const el of qa263('.ct263-discover-tabs,.ct263-discover-types,.ct263-media-rail',root))armRail263(el)}
function syncDiscover263(){qa263('[data-ct263-discover-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ct263DiscoverTab===discover263.tab));qa263('[data-ct263-discover-type]').forEach(b=>b.classList.toggle('active',b.dataset.ct263DiscoverType===discover263.type))}
function discoverHost263(){return q263('[data-ct263-discover-content]')}
function paintBrowse263(rows,tab){const h=discoverHost263();if(!h)return;h.innerHTML=rail263(rows,{providers:tab==='top10'});armDiscoverRails263(h)}
async function hydrateCard263(x){if(poster263(x)&&year263(x)&&score263(x))return x;const d=await timeout263(tmdb(`/${type263(x)}/${id263(x)}`),5000,null);return d?{...x,...d,media_type:type263(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}
async function forYou263(gen,force=false){
 try{
  const p=await personal263(force),[trend,mov,tv]=await Promise.all([tmdbPages263('/trending/all/day',{},null,2),tmdbPages263('/discover/movie',{'primary_release_date.gte':shift263(-30),'primary_release_date.lte':day263(),sort_by:'vote_average.desc','vote_count.gte':25},'movie',2),tmdbPages263('/discover/tv',{'first_air_date.gte':shift263(-30),'first_air_date.lte':day263(),sort_by:'vote_average.desc','vote_count.gte':20},'tv',2)]);
  if(gen!==discover263.gen||String(typeof route==='function'?route():'')!=='discover'||discover263.tab!=='foryou')return;
  const picks=dedupe263(trend).filter(x=>strictEligible263(x,p)).slice(0,12),watchCandidates=p.watchlist.filter(x=>id263(x)&&!p.hard.has(key263(x))).slice(0,14),watch=(await Promise.all(watchCandidates.map(hydrateCard263))).filter(x=>poster263(x)).slice(0,10),fresh=dedupe263([...mov,...tv]).filter(x=>strictEligible263(x,p,{fresh:true})).slice(0,30);
  discover263.forYou={picks,watch,fresh};paintForYou263();
 }catch(_){const h=discoverHost263();if(h&&gen===discover263.gen)h.innerHTML='<div class="empty">Não foi possível validar sua biblioteca agora. Tente novamente.</div>'}
}
function paintForYou263(){const h=discoverHost263(),d=discover263.forYou;if(!h||!d)return;const pick=d.picks?.length?d.picks[discover263.swap%d.picks.length]:null;h.innerHTML=`<div data-ct263-foryou>${block263('Indicação do Dia',pick?[pick]:[],d.picks?.length>1?'<button type="button" class="chip" data-ct263-swap>Trocar</button>':'')}${block263('Da sua Watchlist',d.watch||[])}${block263('100% Novos',d.fresh||[])}</div>`;armDiscoverRails263(h)}
async function loadBrowse263(tab,gen,force=false){
 const cacheKey=`${day263()}:${discover263.type}:${tab}`;
 try{
  const p=await personal263(false);let rows=!force?discover263.cache.get(cacheKey):null;if(!rows){rows=(await source263(tab)).filter(x=>browseEligible263(x,p));if(tab==='top10')rows=rows.slice(0,10);else rows=rows.slice(0,60);discover263.cache.set(cacheKey,rows)}
  if(gen!==discover263.gen||String(typeof route==='function'?route():'')!=='discover'||discover263.tab!==tab)return;paintBrowse263(rows,tab);
  if(tab==='top10'&&rows.length){await hydrateProviders263(rows);if(gen===discover263.gen&&String(typeof route==='function'?route():'')==='discover'&&discover263.tab===tab)paintBrowse263(rows,tab)}
 }catch(_){const h=discoverHost263();if(h&&gen===discover263.gen)h.innerHTML='<div class="empty">Não foi possível atualizar esta aba agora. Tente novamente.</div>'}
}
function loadDiscover263(tab=discover263.tab,force=false){discover263.tab=tab;const gen=++discover263.gen;syncDiscover263();const h=discoverHost263();if(h)h.innerHTML='<div class="ct263-loading">Carregando títulos…</div>';if(tab==='foryou'){void forYou263(gen,force);return}void loadBrowse263(tab,gen,force)}
renderDiscover=async function(seq){setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct263-discover><div class="tabs ct263-discover-tabs">${DTABS263.map(([k,l])=>`<button type="button" class="chip ${discover263.tab===k?'active':''}" data-ct263-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters ct263-discover-types">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${discover263.type===k?'active':''}" data-ct263-discover-type="${k}">${l}</button>`).join('')}</div><div data-ct263-discover-content><div class="ct263-loading">Carregando títulos…</div></div></div>`));if(seq!==navSeq||String(typeof route==='function'?route():'')!=='discover')return;armDiscoverRails263(q263('[data-ct263-discover]'));loadDiscover263(discover263.tab,false)};

/* ---------------------------------------------------------------------
   SPORTS / F1 — use the existing canonical sport event + watch-history RPC. The F1 Hub gets a
   DB-backed recent/upcoming event rail with the same mark/unmark behavior as every other sport. */
const f1Watch263={payload:null,at:0,loading:null};
function sportEventKey263(x){return `${String(x?.provider||'')}:${String(x?.provider_event_id||x?.event_id||x?.id||'')}`}
function f1Rows263(payload,now=Date.now()){const events=Array.isArray(payload?.events)?payload.events:[],hist=Array.isArray(payload?.watch_history)?payload.watch_history:[],map=new Map();for(const x of [...hist,...events]){if(String(x?.sport_slug||'')!=='formula_1')continue;const k=sportEventKey263(x);if(!k||k===':')continue;map.set(k,{...(map.get(k)||{}),...x})}const from=now-21*DAY263,to=now+35*DAY263;return [...map.values()].filter(x=>{const t=new Date(x?.starts_at||0).getTime();return Number.isFinite(t)&&t>=from&&t<=to}).sort((a,b)=>new Date(b?.starts_at||0)-new Date(a?.starts_at||0)).slice(0,16)}
async function loadF1Watch263(force=false){if(!force&&f1Watch263.payload&&Date.now()-f1Watch263.at<45000)return f1Watch263.payload;if(f1Watch263.loading)return f1Watch263.loading;f1Watch263.loading=timeout263(rpc('cinetracker_sports_payload_v1',{p_from:new Date(Date.now()-22*DAY263).toISOString(),p_to:new Date(Date.now()+36*DAY263).toISOString()}),7000,null);try{const p=await f1Watch263.loading;if(p){f1Watch263.payload=p;f1Watch263.at=Date.now()}return p}finally{f1Watch263.loading=null}}
function eventTime263(x){const t=new Date(x?.starts_at||0);if(!Number.isFinite(t.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(t)}catch{return t.toLocaleString('pt-BR')}}
function f1WatchCard263(x){const key=String(x?.provider_event_id||x?.event_id||x?.id||''),provider=String(x?.provider||''),started=new Date(x?.starts_at||0).getTime()<=Date.now(),watched=!!(x?.is_watched||x?.watched||x?.sport_watched_at),status=norm263(x?.status||'');const finished=watched||status==='finished'||status==='ended'||status==='final'||started;return `<article class="ct263-f1-event ${watched?'watched':''}"><small>${esc263(eventTime263(x))}</small><b>${esc263(x?.title||'Fórmula 1')}</b><span>${esc263(x?.venue||`Temporada ${x?.season||new Date().getFullYear()}`)}</span>${key&&provider?`<button type="button" class="ct263-f1-watch-btn ${watched?'on':''}" data-ct263-f1-watch="${esc263(key)}" data-ct263-provider="${esc263(provider)}" data-ct263-watched="${watched?'1':'0'}" ${finished?'':'disabled'}>${watched?'↶ Desmarcar assistido':finished?'✓ Marcar como assistido':'Em breve'}</button>`:''}</article>`}
async function enhanceF1Watch263(force=false){if(String(typeof route==='function'?route():'')!=='sports')return;const host=q263('.ct255-f1hub[data-ct255-f1],[data-ct255-f1]');if(!host)return;const p=await loadF1Watch263(force);if(!host.isConnected||!p)return;const rows=f1Rows263(p);let panel=q263('[data-ct263-f1-watch-panel]',host);if(!panel){panel=document.createElement('section');panel.className='ct263-f1-watch-panel';panel.dataset.ct263F1WatchPanel='1';const content=q263('.ct255-f1-content',host);if(content)host.insertBefore(panel,content);else host.append(panel)}panel.innerHTML=`<div class="ct263-f1-watch-head"><div><small>Seu registro</small><b>Fórmula 1 assistida</b></div><span>Use os eventos abaixo para marcar ou desmarcar.</span></div><div class="ct263-f1-watch-rail">${rows.map(f1WatchCard263).join('')||'<div class="empty">Nenhum evento de Fórmula 1 encontrado neste período.</div>'}</div>`;armRail263(q263('.ct263-f1-watch-rail',panel))}
function scheduleF1Watch263(force=false){for(const ms of[180,650,1500,2600])setTimeout(()=>{if(String(typeof route==='function'?route():'')==='sports')void enhanceF1Watch263(force&&ms===180)},ms)}
const renderSports263Base=typeof renderSports==='function'?renderSports:null;
if(renderSports263Base)renderSports=async function(...args){const out=await renderSports263Base.apply(this,args);scheduleF1Watch263(false);return out};
async function toggleF1Watch263(btn){if(!btn||btn.disabled)return;const provider=btn.dataset.ct263Provider,id=btn.dataset.ct263F1Watch,watched=btn.dataset.ct263Watched==='1';if(!provider||!id)return;btn.disabled=true;try{await rpc('cinetracker_sport_mark_watched_v1',{p_provider:provider,p_provider_event_id:id,p_watched:!watched,p_watched_at:new Date().toISOString(),p_duration_minutes:null});f1Watch263.payload=null;f1Watch263.at=0;await enhanceF1Watch263(true);document.dispatchEvent(new CustomEvent('cinetracker:data-changed'))}catch(_){btn.disabled=false}}

document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-ct263-discover-tab]');if(tab){e.preventDefault();e.stopImmediatePropagation();loadDiscover263(tab.dataset.ct263DiscoverTab,false);return}
 const ty=e.target?.closest?.('[data-ct263-discover-type]');if(ty){e.preventDefault();e.stopImmediatePropagation();discover263.type=ty.dataset.ct263DiscoverType;loadDiscover263(discover263.tab,false);return}
 if(e.target?.closest?.('[data-ct263-swap]')){e.preventDefault();e.stopImmediatePropagation();if(discover263.forYou?.picks?.length){discover263.swap++;paintForYou263()}return}
 const fw=e.target?.closest?.('[data-ct263-f1-watch]');if(fw){e.preventDefault();e.stopImmediatePropagation();void toggleF1Watch263(fw);return}
 if(e.target?.closest?.('[data-ct257-f1tab],[data-ct257-f1collapse],[data-ct255-f1tab],[data-ct255-f1collapse]'))scheduleF1Watch263(false);
 setTimeout(()=>restoreHomeList263(),90);
},true);
window.addEventListener('cinetracker:data-changed',()=>{discover263.personal=null;discover263.personalAt=0;discover263.cache.clear();f1Watch263.payload=null;f1Watch263.at=0;if(String(typeof route==='function'?route():'')==='sports')scheduleF1Watch263(true)});
window.addEventListener('pageshow',()=>{scheduleHomeRestore263();if(String(typeof route==='function'?route():'')==='sports')scheduleF1Watch263(false)});
window.addEventListener('resize',()=>{restoreHomeList263();armDiscoverRails263()});

window.__ctR263Test={shift263,strictEligible263,browseEligible263,pickProviders263,f1Rows263,sportEventKey263,restoreHomeList263};
scheduleHomeRestore263();
})();
