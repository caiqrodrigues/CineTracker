/* CineTracker Web 1.0.26 r234 — real regression fix on proven r232/r229 visual baselines. */
(()=>{
'use strict';
if(window.__ctR234V126)return;
window.__ctR234V126='real-regressions-baseline-preserving-authority';
window.__ctV126Home='instant-payload-state+nonblocking-single-tmdb-refresh';
window.__ctV126Discover='r232-target-sections-only-top10-untouched';
window.__ctV126Sports='r123-layout-preserved-event-driven';
window.__ctV126Watchlist='full-logical-count+single-modal+visible-poster-enrichment';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc126=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mediaType126=x=>String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv';
const mediaId126=x=>{
 const ids=[x?.tmdb_id,x?.source_tmdb_id,x?.raw_tmdb?.source_tmdb_id,x?.raw_tmdb?.id];
 try{ids.unshift(mediaTmdb(x))}catch{}
 for(const v of ids){const id=n(v);if(id>0)return id}
 return 0;
};
const title126=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título').trim()||'Sem título';
const year126=x=>n(x?.release_year)||n(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4));
const poster126=x=>{
 let p=x?.poster_path||x?.raw_tmdb?.poster_path||'';
 if(!p)return'';
 if(/^https?:/i.test(p))return p;
 try{return img(p,'w185')}catch{return `https://image.tmdb.org/t/p/w185${String(p).startsWith('/')?'':'/'}${p}`}
};

/* ---------- Discover: reuse the last proven targeted authority. Top 10 is deliberately outside scope. ---------- */
let discoverQueued126=false;
function runDiscover126(){
 const root=q('[data-page="discover"],[data-discover]');
 if(!root)return;
 const allowed=new Set(['indicacao do dia','da sua watchlist','100 novos']);
 for(const sec of qa('section,.panel',root)){
   const heading=norm(q('h2,h3',sec)?.textContent||'');
   if(!allowed.has(heading))continue;
   sec.dataset.ct126DiscoverTarget='1';
 }
 try{window.__ctV124Discover?.()}catch{}
 root.dataset.ct126Discover='targeted-only';
}
function queueDiscover126(){
 if(discoverQueued126)return;
 discoverQueued126=true;
 requestAnimationFrame(()=>{discoverQueued126=false;runDiscover126()});
}
try{const base=paintDiscover;paintDiscover=function(...args){const out=base.apply(this,args);queueDiscover126();return out}}catch{}
try{const base=renderDiscover;renderDiscover=async function(...args){const out=await base.apply(this,args);queueDiscover126();return out}}catch{}

/* ---------- Sports: keep the exact r123 card/action layout; only schedule its existing canonicalizer. ---------- */
let sportsQueued126=false;
function runSports126(){
 try{window.__ctV123SportsNow?.()}catch{}
 const root=q('[data-sports]');
 if(root)root.dataset.ct126Sports='r123-layout';
}
function queueSports126(){
 if(sportsQueued126)return;
 sportsQueued126=true;
 requestAnimationFrame(()=>{sportsQueued126=false;runSports126()});
}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);queueSports126();return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);queueSports126();return out}}catch{}

/* ---------- Home: correct known state before paint; hydrate + revalidate in background with one show request. ---------- */
const homeDetail126=new Map();
let homeRefreshTask126=null;
let homeRepaintTimer126=0;
function localDay126(){try{return localDay()}catch{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}}
function latestPos126(row){
 return [
   n(row?.latest_released_season_number||row?.latest_episode_meta_season_number),
   n(row?.latest_released_episode_number||row?.latest_episode_meta_episode_number)
 ];
}
function lastPos126(row){return [n(row?.last_season_number),n(row?.last_episode_number)]}
function behind126(row){
 const [ls,le]=lastPos126(row),[rs,re]=latestPos126(row);
 if(rs>0&&re>0&&ls>0)return ls<rs||(ls===rs&&le<re);
 const released=n(row?.released_episodes),watched=n(row?.watched_episodes);
 return released>0&&watched>0&&watched<released;
}
function immediateHome126(){
 const rows=Array.isArray(homeCache?.series)?homeCache.series:[];
 let changed=false;
 for(const row of rows){
   if(n(row?.watched_episodes)<=0)continue;
   if(behind126(row)){
     if(row.is_caught_up!==false){row.is_caught_up=false;changed=true}
     if(row.home_bucket==='up_to_date'){row.home_bucket='continue';changed=true}
     const missing=Math.max(1,n(row.released_episodes)-n(row.watched_episodes));
     if(n(row.history_missing_episodes)!==missing){row.history_missing_episodes=missing;changed=true}
   }
 }
 return changed;
}
function releasedCount126(detail,latest){
 if(!(n(latest?.season_number)>0&&n(latest?.episode_number)>0))return 0;
 let total=0;
 for(const s of detail?.seasons||[]){
   const sn=n(s?.season_number);if(sn<=0)continue;
   if(sn<n(latest.season_number))total+=Math.max(0,n(s?.episode_count));
   else if(sn===n(latest.season_number))total+=Math.max(0,Math.min(n(s?.episode_count)||n(latest.episode_number),n(latest.episode_number)));
 }
 return total;
}
function caught126(row,latest,released){
 const ls=n(row?.last_season_number),le=n(row?.last_episode_number),rs=n(latest?.season_number),re=n(latest?.episode_number);
 if(rs>0&&re>0&&ls>0)return ls>rs||(ls===rs&&le>=re);
 return released>0&&n(row?.watched_episodes)>=released;
}
async function detail126(id){
 const day=localDay126(),key=`${day}:${id}`;
 if(homeDetail126.has(key))return homeDetail126.get(key);
 const task=Promise.resolve().then(()=>safeTmdb(`/tv/${id}`,{})).catch(()=>null);
 homeDetail126.set(key,task);
 return task;
}
function applyHomeDetail126(row,d){
 if(!d)return false;
 const latest=d.last_episode_to_air;
 const air=String(latest?.air_date||'').slice(0,10);
 if(!(n(latest?.season_number)>0&&n(latest?.episode_number)>0)||!air||air>localDay126())return false;
 let changed=false;
 const set=(k,v)=>{if(String(row[k]??'')!==String(v??'')){row[k]=v;changed=true}};
 set('latest_released_season_number',n(latest.season_number));
 set('latest_released_episode_number',n(latest.episode_number));
 set('latest_episode_meta_season_number',n(latest.season_number));
 set('latest_episode_meta_episode_number',n(latest.episode_number));
 set('latest_episode_name',String(latest.name||''));
 set('latest_episode_vote_average',n(latest.vote_average));
 set('latest_episode_air_date',air);
 set('latest_episode_runtime',n(latest.runtime));
 const released=releasedCount126(d,latest);
 if(released>0)set('released_episodes',released);
 if(n(d.number_of_episodes)>0)set('total_episodes',n(d.number_of_episodes));
 const caught=caught126(row,latest,released);
 if(Boolean(row.is_caught_up)!==caught){row.is_caught_up=caught;changed=true}
 if(!caught&&n(row.watched_episodes)>0&&row.home_bucket==='up_to_date'){row.home_bucket='continue';changed=true}
 const missing=Math.max(0,(released||n(row.released_episodes))-n(row.watched_episodes));
 if(n(row.history_missing_episodes)!==missing){row.history_missing_episodes=missing;changed=true}
 return changed;
}
function scheduleHomeRepaint126(){
 clearTimeout(homeRepaintTimer126);
 homeRepaintTimer126=setTimeout(()=>{if(String(location.pathname||'').startsWith('/home'))try{paintHome()}catch{}},80);
}
async function refreshHome126(){
 if(homeRefreshTask126)return homeRefreshTask126;
 const rows=(Array.isArray(homeCache?.series)?homeCache.series:[])
   .filter(x=>mediaId126(x)>0&&n(x?.watched_episodes)>0)
   .sort((a,b)=>{
     const ap=a.home_bucket==='up_to_date'?1:0,bp=b.home_bucket==='up_to_date'?1:0;
     if(bp!==ap)return bp-ap;
     return String(b.latest_episode_air_date||'').localeCompare(String(a.latest_episode_air_date||''));
   });
 if(!rows.length)return false;
 homeRefreshTask126=(async()=>{
   let cursor=0,changed=false;
   const worker=async()=>{
     while(cursor<rows.length){
       const row=rows[cursor++],id=mediaId126(row);
       try{const d=await detail126(id);if(applyHomeDetail126(row,d)){changed=true;scheduleHomeRepaint126()}}catch{}
     }
   };
   await Promise.all(Array.from({length:Math.min(8,rows.length)},worker));
   return changed;
 })().finally(()=>{homeRefreshTask126=null});
 return homeRefreshTask126;
}
/* r172 used season->show hydration, which doubled requests and caused the ~30s cascade. Disable only that hydrator. */
try{ct172HydrateHomeEpisodes=async function(){return false}}catch{}
try{
 const base=paintHome;
 paintHome=function(...args){
   immediateHome126();
   const out=base.apply(this,args);
   requestAnimationFrame(()=>void refreshHome126());
   return out;
 };
}catch{}
/* Deliberately do NOT wrap renderHome with an awaited remote validation. */

/* ---------- Watchlist: one full logical universe for stat + modal, with visible-row enrichment. ---------- */
let wlCache126=null,wlAt126=0,wlTask126=null;
const wlAttempted126=new Set(),wlEnriching126=new Set();
async function fullWatch126(force=false){
 if(!force&&wlCache126&&Date.now()-wlAt126<45000)return wlCache126;
 if(wlTask126)return wlTask126;
 wlTask126=Promise.resolve()
   .then(()=>typeof window.__ctV121FullWatchlist==='function'?window.__ctV121FullWatchlist(force):rpc('cinetracker_watchlist_full_v119',{}))
   .then(d=>{wlCache126=d||{rows:[]};wlAt126=Date.now();return wlCache126})
   .finally(()=>{wlTask126=null});
 return wlTask126;
}
function rows126(d,kind){
 return (Array.isArray(d?.rows)?d.rows:[]).filter(x=>kind==='movie'?mediaType126(x)==='movie':mediaType126(x)==='tv');
}
const added126=x=>Date.parse(x?.added_at||x?.created_at||x?.updated_at||0)||0;
function sort126(rows,mode){
 const a=[...rows],az=(x,y)=>title126(x).localeCompare(title126(y),'pt-BR',{numeric:true,sensitivity:'base'});
 if(mode==='release_desc')return a.sort((x,y)=>year126(y)-year126(x)||az(x,y));
 if(mode==='release_asc')return a.sort((x,y)=>year126(x)-year126(y)||az(x,y));
 if(mode==='added_desc')return a.sort((x,y)=>added126(y)-added126(x)||az(x,y));
 return a.sort(az);
}
function markStats126(){
 const root=q('[data-profile]');if(!root)return;
 for(const el of qa('.stat,button.stat',root)){
   const label=norm(q('small',el)?.textContent||'');
   const kind=label==='filmes watchlist'?'movie':label==='series watchlist'?'series':'';
   if(!kind)continue;
   for(const a of [...el.attributes].map(a=>a.name))if(/^data-ct\d+-watchlist/.test(a)||/^data-ct1\d\d-count/.test(a))el.removeAttribute(a);
   el.dataset.ct126Watchlist=kind;el.setAttribute('type','button');
 }
}
async function syncWatch126(force=false){
 const root=q('[data-profile]');if(!root)return null;
 markStats126();
 let d;try{d=await fullWatch126(force)}catch{return null}
 for(const el of qa('[data-ct126-watchlist]',root)){
   const kind=el.dataset.ct126Watchlist,b=q('b',el);
   if(b)b.textContent=rows126(d,kind).length.toLocaleString('pt-BR');
 }
 return d;
}
try{
 const base=ctR180StatCard;
 ctR180StatCard=function(label,value,wide=false){
   const kind=String(label||'')==='Filmes Watchlist'?'movie':String(label||'')==='Séries Watchlist'?'series':'';
   if(!kind)return base(label,value,wide);
   const shown=typeof value==='string'?value:Number(value||0).toLocaleString('pt-BR');
   return `<button type="button" class="stat ${wide?'ct-r180-stat-wide ':''}ct126-watch-stat" data-ct126-watchlist="${kind}"><small>${esc126(label)}</small><b>${esc126(shown)}</b><span class="ct121-chevron">›</span></button>`;
 };
}catch{}
function closeWatch126(){q('[data-ct126-watch-modal]')?.remove()}
function rowHtml126(x){
 const kind=mediaType126(x),id=mediaId126(x),mid=n(x?.media_id),p=poster126(x),t=title126(x),y=year126(x);
 const date=x?.added_at?new Date(x.added_at).toLocaleDateString('pt-BR'):'';
 const poster=p?`<img src="${esc126(p)}" loading="lazy" alt="">`:`<span class="ct126-poster-empty" aria-label="Capa sendo localizada"><span>◫</span></span>`;
 const copy=`<span class="ct121-watch-copy"><span class="ct121-watch-title"><b>${esc126(t)}</b>${y?`<small>${y}</small>`:''}</span><span class="ct121-watch-meta"><em>Na Watchlist</em>${date?`<em>Adicionado ${esc126(date)}</em>`:''}${id>0?'':`<em>Localizando capa…</em>`}</span></span>`;
 const inner=`${poster}${copy}<span class="ct121-open">${id>0?'›':'•'}</span>`;
 if(id>0)return `<button type="button" class="ct121-watch-row ct126-watch-row" data-ct126-media="${kind}:${id}" data-ct126-media-id="${mid}">${inner}</button>`;
 return `<div class="ct121-watch-row ct126-watch-row ct126-local-row" data-ct126-media-id="${mid}">${inner}</div>`;
}
function paintWatch126(m,kind,mode){
 const list=sort126(rows126(m.__ct126Data,kind),mode);
 const cnt=q('[data-ct126-count]',m),body=q('[data-ct126-list]',m);
 if(cnt)cnt.textContent=list.length.toLocaleString('pt-BR');
 if(body)body.innerHTML=list.length?list.map(rowHtml126).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>';
 m.dataset.ct126Sort=mode;
 requestAnimationFrame(()=>queueVisibleEnrich126(m));
}
let enrichTimer126=0;
function queueVisibleEnrich126(m){
 clearTimeout(enrichTimer126);
 enrichTimer126=setTimeout(()=>void enrichVisible126(m),120);
}
async function enrichVisible126(m){
 if(!m?.isConnected)return;
 const body=q('[data-ct126-list]',m);if(!body)return;
 const br=body.getBoundingClientRect();
 const ids=[];
 for(const el of qa('.ct126-watch-row[data-ct126-media-id]',body)){
   const mediaId=n(el.dataset.ct126MediaId);if(!(mediaId>0)||wlAttempted126.has(mediaId)||wlEnriching126.has(mediaId))continue;
   const hasPoster=Boolean(q('img',el)),hasRoute=Boolean(el.dataset.ct126Media);
   if(hasPoster&&hasRoute)continue;
   const r=el.getBoundingClientRect();
   if(r.bottom<br.top-250||r.top>br.bottom+500)continue;
   ids.push(mediaId);if(ids.length>=30)break;
 }
 if(!ids.length)return;
 ids.forEach(id=>wlEnriching126.add(id));
 try{
   const headers={...authHeaders(),'Content-Type':'application/json'};
   const res=await fetch(`${SUPABASE_URL}/functions/v1/ct-enrich-media-user?priority=visible-posters&limit=${ids.length}`,{
     method:'POST',headers,body:JSON.stringify({requested_media_ids:ids})
   });
   if(res.ok){
     ids.forEach(id=>wlAttempted126.add(id));
     wlCache126=null;wlAt126=0;
     const d=await fullWatch126(true);
     if(m.isConnected){
       const top=body.scrollTop;
       m.__ct126Data=d;paintWatch126(m,m.dataset.ct126WatchModal,m.dataset.ct126Sort||'alpha');
       const fresh=q('[data-ct126-list]',m);if(fresh)fresh.scrollTop=top;
       if(String(location.pathname||'').startsWith('/profile'))void syncWatch126(false);
     }
   }
 }catch{}
 finally{ids.forEach(id=>wlEnriching126.delete(id))}
}
async function openWatch126(kind){
 closeWatch126();
 const label=kind==='movie'?'Filmes na Watchlist':'Séries na Watchlist';
 const m=document.createElement('div');
 m.className='ct121-modal ct126-modal';m.dataset.ct126WatchModal=kind;
 m.innerHTML=`<div class="ct121-dialog"><header><div><small>WATCHLIST COMPLETA</small><h2>${label} · <span data-ct126-count>—</span></h2></div><button type="button" class="ct121-close" data-ct126-close>×</button></header><div class="ct121-toolbar"><select data-ct126-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct121-list ct126-list" data-ct126-list><div class="loader">Sincronizando Watchlist...</div></div></div>`;
 document.body.appendChild(m);
 try{
   m.__ct126Data=await fullWatch126(true);
   paintWatch126(m,kind,'alpha');
   void syncWatch126(false);
 }catch(e){q('[data-ct126-list]',m).innerHTML=`<div class="error">${esc126(e?.message||e)}</div>`}
 return m;
}
try{
 const base=renderProfile;
 renderProfile=async function(...args){
   const out=await base.apply(this,args);
   markStats126();
   void syncWatch126(false);
   return out;
 };
}catch{}
document.addEventListener('click',e=>{
 const stat=e.target.closest?.('[data-ct126-watchlist]');
 if(stat){e.preventDefault();e.stopImmediatePropagation();void openWatch126(stat.dataset.ct126Watchlist);return}
 if(e.target.closest?.('[data-ct126-close]')){e.preventDefault();e.stopImmediatePropagation();closeWatch126();return}
 const row=e.target.closest?.('[data-ct126-media]');
 if(row){
   e.preventDefault();e.stopImmediatePropagation();
   const [kind,id]=String(row.dataset.ct126Media||'').split(':');closeWatch126();
   if(n(id)>0){try{go(`/${kind==='movie'?'movie':'series'}/${n(id)}`)}catch{location.href=`/${kind==='movie'?'movie':'series'}/${n(id)}`}}
 }
},true);
document.addEventListener('change',e=>{
 const s=e.target.closest?.('[data-ct126-sort]');if(!s)return;
 const m=s.closest('[data-ct126-watch-modal]');if(m?.__ct126Data)paintWatch126(m,m.dataset.ct126WatchModal,s.value);
},true);
document.addEventListener('scroll',e=>{const body=e.target.closest?.('[data-ct126-list]');if(body){const m=body.closest('[data-ct126-watch-modal]');if(m)queueVisibleEnrich126(m)}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeWatch126()},true);

window.addEventListener('cinetracker:data-changed',()=>{
 wlCache126=null;wlAt126=0;homeDetail126.clear();
 if(String(location.pathname||'').startsWith('/profile'))void syncWatch126(true);
 if(String(location.pathname||'').startsWith('/home')){immediateHome126();requestAnimationFrame(()=>void refreshHome126())}
});

/* boot pass only; later work is coupled to app renders/events, not polling. */
queueDiscover126();queueSports126();
if(String(location.pathname||'').startsWith('/profile')){markStats126();void syncWatch126(false)}
if(String(location.pathname||'').startsWith('/home')){immediateHome126();requestAnimationFrame(()=>void refreshHome126())}

const st=document.createElement('style');st.id='ct-v126-real-regressions';st.textContent=`
.ct126-watch-row{grid-template-columns:52px minmax(0,1fr) 22px!important;min-height:82px!important}
.ct126-watch-row>img,.ct126-poster-empty{width:52px!important;height:78px!important;border-radius:8px!important;object-fit:cover!important;display:grid!important;place-items:center!important;flex:0 0 52px!important}
.ct126-poster-empty{background:linear-gradient(145deg,#202a2f,#10181d)!important;border:1px solid #28434e!important;color:#7e9ca8!important;font-size:20px!important}
.ct126-local-row{cursor:default!important}
.ct126-list{overscroll-behavior:contain}
`;
document.getElementById(st.id)?.remove();document.head.appendChild(st);

window.__ctV126RunDiscover=runDiscover126;
window.__ctV126RunSports=runSports126;
window.__ctV126ImmediateHome=immediateHome126;
window.__ctV126RefreshHome=refreshHome126;
window.__ctV126WatchRows=rows126;
window.__ctV126SyncWatchlist=syncWatch126;
window.__ctV126OpenWatchlist=openWatch126;
})();
