/* CineTracker Web 1.0.92 r301 — F1 calendar authority + Sports next recovery + fast exact Pra Você. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR301)return;
window.__ctR301='f1-calendar-interactive+sports-next-wide+discover-fast-1-3-3+profile-stable';
window.__ctR301F1='no-drivers-tab+calendar-detail+canonical-watch';
window.__ctR301Sports='f1-first+next-120d+four-tabs';
window.__ctR301Discover='fast-exact-1+3+3+stable-watchlist-actions';
window.__ctR301Profile='stable-stats+watchlist-match-stadium-style';
window.__ctR301Android='preserved-1.0.20-10062';

const R301=window.__ctR288R263||{},T298=window.__ctR298Test||{},T299=window.__ctR299Test||{},T300=window.__ctR300Test||{},M301=window.__ctR295Test||{},S301=window.__ctR296Test||{};
const q301=(s,r=document)=>r?.querySelector?.(s)||null,qa301=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm301=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc301=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
const num301=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const route301=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const type301=typeof R301.type263==='function'?R301.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const id301=typeof R301.id263==='function'?R301.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const poster301=typeof R301.poster263==='function'?R301.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const key301=x=>`${type301(x)==='movie'?'movie':'tv'}:${id301(x)}`;
const cat301=typeof T298.cat==='function'?T298.cat:(x=>type301(x)==='movie'?'movie':'series');
const validMedia301=x=>!!(x&&id301(x)>0&&poster301(x));
const uniq301=rows=>{const seen=new Set(),out=[];for(const x of Array.isArray(rows)?rows:[]){const k=key301(x);if(!validMedia301(x)||seen.has(k))continue;seen.add(k);out.push(x)}return out};

/* SPORTS — load a useful future window instead of only nine days. */
try{
 if(typeof loadSports255==='function'){
  loadSports255=async function(force=false){
   if(!force&&sport255?.payload&&Date.now()-Number(sport255.at||0)<45000)return sport255.payload;
   const p=await rpc('cinetracker_sports_payload_v1',{p_from:new Date(Date.now()-14*86400000).toISOString(),p_to:new Date(Date.now()+120*86400000).toISOString()});
   sport255.payload=p||{};sport255.at=Date.now();return sport255.payload;
  };
 }
}catch{}

/* Old r263 watched rail opened before the Hub content. r301 replaces it with Calendar interaction. */
try{if(typeof enhanceF1Watch263==='function')enhanceF1Watch263=async()=>false}catch{}
try{window.__ctR263EnhanceF1Watch=async()=>false}catch{}
try{
 if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)){
  for(let i=F1_TABS255.length-1;i>=0;i--)if(String(F1_TABS255[i]?.[0])==='drivers'||norm301(F1_TABS255[i]?.[1])==='pilotos')F1_TABS255.splice(i,1);
  if(typeof f1255!=='undefined'&&String(f1255?.tab)==='drivers')f1255.tab='overview';
 }
}catch{}

const f1History301={rows:new Map(),at:0};
const f1Key301=(provider,id)=>`${String(provider||'jolpica')}::${String(id||'')}`;
async function loadF1History301(force=false){
 if(!force&&Date.now()-f1History301.at<20000&&f1History301.rows.size)return f1History301.rows;
 try{const rows=await rpc('cinetracker_sports_watch_history_v296',{});f1History301.rows=new Map((Array.isArray(rows)?rows:[]).filter(x=>String(x?.sport_slug||'')==='formula_1'||/formula\s*1|f1/i.test(String(x?.competition_name||x?.title||''))).map(x=>[f1Key301(x?.provider,x?.provider_event_id),x]));f1History301.at=Date.now()}catch{}
 return f1History301.rows;
}
function f1Start301(r){return new Date(`${String(r?.date||'')}T${String(r?.time||'00:00:00Z')}`).getTime()||0}
function f1Canonical301(r){
 const start=f1Start301(r),events=Array.isArray(typeof sport255!=='undefined'?sport255?.payload?.events:null)?sport255.payload.events:[];
 const candidates=events.filter(x=>String(x?.sport_slug||'')==='formula_1').map(x=>({x,t:new Date(x?.starts_at||0).getTime()})).filter(v=>v.t&&Math.abs(v.t-start)<=36*3600000).sort((a,b)=>Math.abs(a.t-start)-Math.abs(b.t-start));
 const hit=candidates[0]?.x||null,season=String((typeof f1255!=='undefined'&&f1255?.data?.season)||new Date().getFullYear()),round=String(r?.round||'0');
 return {provider:String(hit?.provider||'jolpica'),id:String(hit?.provider_event_id||hit?.event_id||hit?.id||`${season}-${round}`),title:String(hit?.title||r?.raceName||'Fórmula 1'),startsAt:hit?.starts_at||new Date(start).toISOString(),venue:String(hit?.venue||r?.Circuit?.circuitName||''),country:String(r?.Circuit?.Location?.country||''),season:String(hit?.season||season),status:String(hit?.status||'')};
}
function f1CalendarHtml301(d){
 const schedule=Array.isArray(d?.schedule)?d.schedule:[];
 return `<div class="ct301-f1-calendar">${schedule.map(r=>{const c=f1Canonical301(r),past=f1Start301(r)<=Date.now();return `<button type="button" class="ct301-f1-event" data-ct301-f1-event data-provider="${esc301(c.provider)}" data-event-id="${esc301(c.id)}" data-title="${esc301(c.title)}" data-starts-at="${esc301(c.startsAt)}" data-venue="${esc301(c.venue)}" data-country="${esc301(c.country)}" data-season="${esc301(c.season)}" data-started="${past?'1':'0'}"><b>${esc301(r.round)}. ${esc301(r.raceName||c.title)}</b><span>${esc301(r?.Circuit?.circuitName||c.venue||'')} · ${esc301(r?.Circuit?.Location?.country||'')}</span><small>${esc301(typeof f1time255==='function'?f1time255(r):new Date(c.startsAt).toLocaleString('pt-BR'))}</small><em data-ct301-f1-state>${past?'Abrir detalhes':'Ver informações'}</em></button>`}).join('')||'<div class="empty">Calendário da Fórmula 1 indisponível.</div>'}</div>`;
}
try{
 if(typeof f1content255==='function'){
  const baseF1Content301=f1content255;
  f1content255=function(d){if(typeof f1255!=='undefined'&&String(f1255?.tab)==='calendar')return f1CalendarHtml301(d);return baseF1Content301.apply(this,arguments)};
 }
}catch{}

function removeLegacyF1Panel301(){qa301('[data-ct263-f1-watch-panel],.ct263-f1-watch-panel').forEach(x=>x.remove())}
function removeDrivers301(){
 for(const b of qa301('[data-ct255-f1tab],[data-ct257-f1tab]'))if(String(b.dataset.ct255F1tab||b.dataset.ct257F1tab||'')==='drivers'||norm301(b.textContent)==='pilotos')b.remove();
}
function orderSports301(){
 const root=q301('[data-ct255-sports],[data-sports]');if(!root)return false;removeLegacyF1Panel301();removeDrivers301();
 try{T300.enforceSportsTabs300?.(false)}catch{}
 const f1=q301('.ct255-f1hub,[data-ct255-f1]',root),tabs=q301('.ct255-sports-tabs',root),filters=q301('.ct255-sport-filters',root),feed=q301('.ct255-sports-feed',root);if(!f1)return false;
 if(root.firstElementChild!==f1)root.insertBefore(f1,root.firstElementChild);if(tabs&&f1.nextElementSibling!==tabs)f1.after(tabs);if(filters&&tabs&&tabs.nextElementSibling!==filters)tabs.after(filters);const anchor=filters||tabs||f1;if(feed&&anchor.nextElementSibling!==feed)anchor.after(feed);root.dataset.ct301Order='f1-tabs-filters-feed';return true;
}
async function decorateF1Calendar301(force=false){
 if(route301()!=='sports')return false;const map=await loadF1History301(force);for(const b of qa301('[data-ct301-f1-event]')){const row=map.get(f1Key301(b.dataset.provider,b.dataset.eventId)),watched=!!(row&&row.is_watched!==false);b.dataset.watched=watched?'1':'0';b.classList.toggle('watched',watched);const s=q301('[data-ct301-f1-state]',b);if(s)s.textContent=watched?'✓ Assistido':b.dataset.started==='1'?'Abrir detalhes':'Ver informações'}return true;
}
function closeF1Modal301(){q301('[data-ct301-f1-modal]')?.remove()}
function fmt301(v){const d=new Date(v);if(Number.isNaN(d.getTime()))return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'full',timeStyle:'short'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function openF1Modal301(btn){
 closeF1Modal301();const watched=btn.dataset.watched==='1',started=btn.dataset.started==='1',back=document.createElement('div');back.className='ct301-f1-modal-backdrop';back.dataset.ct301F1Modal='1';back.innerHTML=`<section class="ct301-f1-modal" role="dialog" aria-modal="true"><header><div><small>F1 Hub · Calendário</small><h2>${esc301(btn.dataset.title||'Fórmula 1')}</h2></div><button type="button" data-ct301-f1-close aria-label="Fechar">×</button></header><div class="ct301-f1-modal-body"><p><b>Data:</b> ${esc301(fmt301(btn.dataset.startsAt))}</p><p><b>Circuito:</b> ${esc301(btn.dataset.venue||'—')}</p><p><b>Local:</b> ${esc301(btn.dataset.country||'—')}</p><p><b>Temporada:</b> ${esc301(btn.dataset.season||'—')}</p></div><footer>${started?`<button type="button" class="chip ${watched?'on':''}" data-ct301-f1-toggle data-provider="${esc301(btn.dataset.provider)}" data-event-id="${esc301(btn.dataset.eventId)}" data-title="${esc301(btn.dataset.title)}" data-starts-at="${esc301(btn.dataset.startsAt)}" data-venue="${esc301(btn.dataset.venue||'')}" data-season="${esc301(btn.dataset.season||'')}" data-watched="${watched?'1':'0'}">${watched?'↶ Desmarcar assistido':'✓ Marcar como assistido'}</button>`:'<span class="ct301-f1-upcoming">A marcação como assistido será liberada após o início do evento.</span>'}</footer></section>`;document.body.appendChild(back);q301('[data-ct301-f1-close]',back)?.focus();
}
async function toggleF1CalendarWatch301(btn){
 if(!btn||btn.disabled)return;const watched=btn.dataset.watched==='1',provider=String(btn.dataset.provider||'jolpica'),id=String(btn.dataset.eventId||'');if(!id)return;btn.disabled=true;
 try{await rpc('cinetracker_sports_watch_set_v296',{p_provider:provider,p_provider_event_id:id,p_sport_slug:'formula_1',p_competition_name:'Fórmula 1',p_title:btn.dataset.title||'Fórmula 1',p_starts_at:btn.dataset.startsAt||null,p_attended_in_person:false,p_stadium_name:null,p_watched:!watched,p_metadata:{venue:btn.dataset.venue||null,season:btn.dataset.season||null}});f1History301.at=0;try{sport255.payload=null;sport255.at=0}catch{}try{profileCache=null}catch{}await loadF1History301(true);closeF1Modal301();await decorateF1Calendar301(false);const ev=new CustomEvent('cinetracker:data-changed',{detail:{source:'r301-f1-calendar',provider,id,watched:!watched}});document.dispatchEvent(ev);try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:ev.detail}))}catch{}try{toast(!watched?'Evento marcado como assistido':'Evento desmarcado')}catch{}}
 catch(e){try{toast(e?.message||String(e))}catch{}}
 finally{btn.disabled=false}
}

/* DISCOVER — exact 1 + 3 + 3 with bounded concurrent requests, no delayed recovery. */
let fyToken301=0,fyBusy301=false,fyCache301=null,fyCacheAt301=0;
async function tmdbPages301(path,params,type,pages=2){if(typeof tmdb!=='function')return[];const jobs=[];for(let page=1;page<=pages;page++)jobs.push(Promise.resolve(tmdb(path,{language:'pt-BR',include_adult:false,...params,page})).catch(()=>({results:[]})));const packs=await Promise.all(jobs);return uniq301(packs.flatMap(p=>(p?.results||[]).map(x=>({...x,media_type:type,tmdb_id:Number(x?.id||0)}))))}
async function hydrate301(x){if(!x||!id301(x)||poster301(x))return x;try{const d=await tmdb(`/${type301(x)}/${id301(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:type301(x),tmdb_id:id301(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}}
function pickCat301(pool,cat,used){const x=pool.find(v=>cat301(v)===cat&&!used.has(key301(v)));if(x)used.add(key301(x));return x||null}
function fill301(out,pool,used,n){for(const x of pool){if(out.length>=n)break;const k=key301(x);if(used.has(k))continue;used.add(k);out.push(x)}return out}
function eligibleFresh301(x){if(!validMedia301(x))return false;try{return typeof T298.strict==='function'?T298.strict(x):!M301.blocked?.(x)}catch{return false}}
function eligibleWatch301(x){if(!validMedia301(x))return false;try{return typeof T298.strict==='function'?T298.strict(x,{watch:true}):true}catch{return true}}
async function buildForYou301(force=false){
 const token=++fyToken301;fyBusy301=true;const host=R301.discoverHost263?.()||q301('[data-ct263-discover-content]');if(host)host.innerHTML='<div class="ct263-loading ct301-fy-loading">Montando recomendações pra você…</div>';
 try{
  if(!R301.discover263)throw new Error('Descobrir indisponível');const discover=R301.discover263;
  await Promise.all([Promise.resolve(M301.authority?.(!!force)),Promise.resolve(S301.loadRecent296?.())]);if(token!==fyToken301||route301()!=='discover'||String(discover.tab)!=='foryou')return false;
  let watch=uniq301(M301.cache?.watchRows||[]).filter(eligibleWatch301);if(watch.length<3){const candidates=uniq301(M301.cache?.watchRows||[]).slice(0,12),hydrated=await Promise.all(candidates.map(hydrate301));watch=uniq301([...watch,...hydrated]).filter(eligibleWatch301)}
  let freshPool=[];if(!force&&fyCache301&&Date.now()-fyCacheAt301<90000)freshPool=fyCache301.slice();else{
   const [movies,series,animes]=await Promise.all([
    tmdbPages301('/discover/movie',{'vote_average.gte':7.2,'vote_count.gte':80,'primary_release_date.gte':'1991-01-01',sort_by:'popularity.desc'},'movie',2),
    tmdbPages301('/discover/tv',{'vote_average.gte':7.2,'vote_count.gte':60,'first_air_date.gte':'1991-01-01',sort_by:'popularity.desc'},'tv',2),
    tmdbPages301('/discover/tv',{'with_genres':'16','with_original_language':'ja','vote_average.gte':7.2,'vote_count.gte':30,'first_air_date.gte':'1991-01-01',sort_by:'popularity.desc'},'tv',2)
   ]);freshPool=uniq301([...movies,...series,...animes]).filter(eligibleFresh301);fyCache301=freshPool.slice();fyCacheAt301=Date.now();
  }
  if(token!==fyToken301||route301()!=='discover'||String(discover.tab)!=='foryou')return false;
  const used=new Set(),watchPicks=[];for(const c of['movie','series','anime']){const x=pickCat301(watch,c,used);if(x)watchPicks.push(x)}fill301(watchPicks,watch,used,3);
  const daily=freshPool.find(x=>!used.has(key301(x)))||null;if(daily)used.add(key301(daily));const fresh=[];for(const c of['movie','series','anime']){const x=pickCat301(freshPool,c,used);if(x)fresh.push(x)}fill301(fresh,freshPool,used,3);
  discover.forYou={watch:watchPicks.slice(0,3),fresh:fresh.slice(0,3),picks:daily?[daily]:[]};paintForYou301(discover.forYou);return !!daily&&watchPicks.length===3&&fresh.length===3;
 }catch(e){if(token===fyToken301&&host)host.innerHTML=`<div class="empty ct301-fy-error">Não foi possível montar o Pra Você agora.<br><button type="button" class="chip" data-ct301-fy-retry>Tentar novamente</button></div>`;return false}finally{if(token===fyToken301)fyBusy301=false}
}
function mediaCard301(x,watch=false){try{return typeof ct288Card==='function'?ct288Card(x,{watch,add:!watch}):''}catch{return''}}
function trio301(title,rows,watch=false){const labels=['Filme','Série','Anime'];return `<section class="panel ct301-fy-block"><div class="panel-head"><h2>${esc301(title)}</h2></div><div class="ct288-slot-grid ct301-fy-grid">${(rows||[]).slice(0,3).map((x,i)=>`<section class="ct288-slot"><div class="ct288-slot-head"><h3>${labels[i]||'Título'}</h3></div>${mediaCard301(x,watch)}</section>`).join('')}</div></section>`}
function paintForYou301(data){const host=R301.discoverHost263?.()||q301('[data-ct263-discover-content]');if(!host)return;host.innerHTML=`<div data-ct288-foryou data-ct301-foryou><section class="panel ct301-daily"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct301-daily-card">${mediaCard301(data?.picks?.[0],false)||'<div class="empty">Sem indicação elegível agora.</div>'}</div></section>${trio301('Da sua Watchlist',data?.watch||[],true)}${trio301('100% novos',data?.fresh||[],false)}</div>`;try{armDiscoverRails263?.(host)}catch{}ensureWatchButtons301(host)}
function ensureWatchButtons301(root=q301('[data-discover]')||document){
 for(const card of qa301('.ct288-browse-block .ct288-card,[data-ct288-calendar] .ct288-card,[data-ct301-foryou] .ct301-daily .ct288-card,[data-ct301-foryou] .ct301-fy-block:last-child .ct288-card',root)){
  if(q301('[data-ct288-add],.ct288-state.on',card))continue;const k=String(card.dataset.ct288Card||'');if(!/^(movie|tv):[1-9]\d*$/.test(k))continue;const b=document.createElement('button');b.type='button';b.className='ct288-state ct301-watch-action';b.dataset.ct288Add=k;b.setAttribute('aria-label','Adicionar à Watchlist');b.textContent='+';card.appendChild(b)
 }
}
const baseLoadDiscover301=(()=>{try{return typeof loadDiscover263==='function'?loadDiscover263:null}catch{return null}})();
async function loadDiscover301(tab=R301.discover263?.tab,force=false){
 const discover=R301.discover263,t=String(tab||discover?.tab||'foryou');if(!discover)return baseLoadDiscover301?.apply(this,arguments);discover.tab=t;if(t==='foryou'||t==='top10')discover.type='all';try{if(typeof ct288SyncShell==='function')ct288SyncShell()}catch{}
 if(t==='foryou'){discover.gen=Number(discover.gen||0)+1;void buildForYou301(!!force);return}
 if(['trending','popular','new','anticipated','top','calendar'].includes(t)&&typeof T300.buildBrowse300==='function'){discover.gen=Number(discover.gen||0)+1;const h=R301.discoverHost263?.();if(h)h.innerHTML='<div class="ct263-loading">Carregando títulos…</div>';void T300.buildBrowse300(t,!!force).then(()=>ensureWatchButtons301());return}
 return baseLoadDiscover301?.apply(this,arguments);
}
try{if(baseLoadDiscover301){loadDiscover263=loadDiscover301;window.__ctR288LoadDiscover=loadDiscover301}}catch{try{window.__ctR288LoadDiscover=loadDiscover301}catch{}}

/* PROFILE — apply Watchlist cards synchronously and keep the same card geometry as Jogos no Estádio. */
function statCard301(root,label){const want=norm301(label);for(const x of qa301('small,label,[data-stat-label],.stat-label',root)){if(norm301(x.textContent).includes(want)){const c=x.closest?.('.stat,[data-stat],button,a,.profile-stat');if(c)return c}}return qa301('.stat,[data-stat],button,a,.profile-stat',root).find(x=>norm301(x.textContent).includes(want))||null}
function stripStatIcon301(card,label){if(!card)return;qa301('svg,img,.icon,[data-icon]',card).forEach(x=>x.remove());for(const x of qa301('small,label,[data-stat-label],.stat-label',card))if(norm301(x.textContent).includes(norm301(label)))x.textContent=label;card.dataset.ct301NoIcon='1'}
function stabilizeProfile301(){
 const root=q301('[data-profile]');if(!root)return false;let stadium=null;try{const sp=T299.sportsPanel?.(root)||root;stadium=T299.statByLabel?.(sp,'jogos no estadio')||statCard301(root,'Jogos no Estádio')}catch{stadium=statCard301(root,'Jogos no Estádio')}
 for(const label of['Séries Watchlist','Filmes Watchlist']){const c=statCard301(root,label);if(!c)continue;if(stadium){for(const cls of [...stadium.classList])if(!/^ct299-history/.test(cls))c.classList.add(cls);c.classList.add('ct300-watchlist-stat','ct301-watchlist-stat')}stripStatIcon301(c,label)}
 root.dataset.ct301StatsStable='1';return true;
}

try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(){const out=base.apply(this,arguments);orderSports301();queueMicrotask(()=>decorateF1Calendar301(false));return out}}}catch{}
try{if(typeof paintF1255==='function'){const base=paintF1255;paintF1255=async function(){const out=await base.apply(this,arguments);removeDrivers301();removeLegacyF1Panel301();if(typeof f1255!=='undefined'&&String(f1255?.tab)==='calendar')await decorateF1Calendar301(false);return out}}}catch{}
try{if(typeof renderSports==='function'){const base=renderSports;renderSports=async function(){const out=await base.apply(this,arguments);orderSports301();for(const ms of[0,80,260])setTimeout(()=>{orderSports301();void decorateF1Calendar301(false)},ms);return out}}}catch{}
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);stabilizeProfile301();queueMicrotask(stabilizeProfile301);return out}}}catch{}

let obsQueued301=false;const app301=q301('#app');if(app301&&window.MutationObserver){try{new MutationObserver(()=>{if(obsQueued301)return;obsQueued301=true;queueMicrotask(()=>{obsQueued301=false;const r=route301();if(r==='sports'){orderSports301();if(typeof f1255!=='undefined'&&String(f1255?.tab)==='calendar')void decorateF1Calendar301(false)}else if(r==='discover')ensureWatchButtons301();else if(r==='profile')stabilizeProfile301()})}).observe(app301,{subtree:true,childList:true})}catch{}}

document.addEventListener('click',e=>{
 const ev=e.target?.closest?.('[data-ct301-f1-event]');if(ev){e.preventDefault();e.stopImmediatePropagation();openF1Modal301(ev);return}
 const toggle=e.target?.closest?.('[data-ct301-f1-toggle]');if(toggle){e.preventDefault();e.stopImmediatePropagation();void toggleF1CalendarWatch301(toggle);return}
 if(e.target?.closest?.('[data-ct301-f1-close]')||e.target?.matches?.('[data-ct301-f1-modal]')){e.preventDefault();closeF1Modal301();return}
 const ftab=e.target?.closest?.('[data-ct255-f1tab],[data-ct257-f1tab]');if(ftab)for(const ms of[0,80,220])setTimeout(()=>{removeDrivers301();removeLegacyF1Panel301();if(String(ftab.dataset.ct255F1tab||ftab.dataset.ct257F1tab)==='calendar')void decorateF1Calendar301(false)},ms);
 if(e.target?.closest?.('[data-ct301-fy-retry]')){e.preventDefault();e.stopImmediatePropagation();void buildForYou301(true);return}
 const dtab=e.target?.closest?.('[data-ct263-discover-tab]');if(dtab){const t=String(dtab.dataset.ct263DiscoverTab||'');if(t==='foryou'){e.preventDefault();e.stopImmediatePropagation();void loadDiscover301('foryou',false)}}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeF1Modal301()},true);
document.addEventListener('cinetracker:data-changed',()=>{f1History301.at=0;fyCacheAt301=0;for(const ms of[0,100,350])setTimeout(()=>{const r=route301();if(r==='sports'){orderSports301();void decorateF1Calendar301(ms===0)}else if(r==='profile')stabilizeProfile301()},ms)});
for(const ms of[0,250,900])setTimeout(()=>{const r=route301();if(r==='sports'){orderSports301();void decorateF1Calendar301(false)}else if(r==='discover')ensureWatchButtons301();else if(r==='profile')stabilizeProfile301()},ms);

window.__ctR301Test={orderSports301,removeDrivers301,buildForYou301,paintForYou301,ensureWatchButtons301,stabilizeProfile301,f1Canonical301,loadF1History301,get forYouBusy(){return fyBusy301}};
})();
