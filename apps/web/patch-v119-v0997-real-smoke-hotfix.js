(() => {
'use strict';
if(window.__ct0997RealSmoke119Loaded)return;
window.__ct0997RealSmoke119Loaded=true;
window.__ct0997RealSmoke119='v119-real-device-smoke-hotfix';

const $119=(s,r=document)=>r.querySelector(s);
const $$119=(s,r=document)=>[...r.querySelectorAll(s)];
const norm119=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const year119=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4))||Number(x?.release_year||0)||0;
const rawFetch119=window.fetch.bind(window);
const rawRpc119=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
const rawNavigate119=typeof window.__ct0994Navigate==='function'?window.__ct0994Navigate.bind(window):null;
const POSTER_CACHE119='ct0997_real_smoke_poster_cache_v1';
let sanitizeTimer119=null,posterTimer119=null,posterBusy119=false;

function route119(){
  const active=$119('.sidebar .nav [data-view118].active,.mobile-nav [data-view118].active');
  if(active?.dataset?.view118)return active.dataset.view118;
  try{const v=String(typeof view!=='undefined'?view:(window.view||'')).toLowerCase();if(v)return v==='history'?'profile':v}catch{}
  const h=String($119('.content h1')?.textContent||'').toLowerCase();
  if(h.includes('descobrir'))return'discover';if(h.includes('perfil'))return'profile';if(h.includes('config'))return'settings';return'home';
}
function target119(btn){return String(btn?.dataset?.view118||btn?.dataset?.view991||btn?.dataset?.view99||btn?.dataset?.view||btn?.dataset?.view92||btn?.dataset?.view91||'').replace('history','profile')}
function sanitizeNav119(){
  if(!$119('[data-view118]'))return;
  for(const nav of $119('.sidebar .nav')?[$119('.sidebar .nav'),...$$119('.mobile-nav')]:$$119('.mobile-nav')){
    if(!nav)continue;
    const seen=new Set();
    for(const b of $$119('button',nav)){
      const t=target119(b);
      if(!['home','discover','profile','settings'].includes(t))continue;
      if(!b.hasAttribute('data-view118')||seen.has(t)){b.remove();continue}
      seen.add(t);
    }
  }
}
function sanitizeProfile119(){
  if(route119()!=='profile'||!$119('#ct118-profile'))return;
  $$119('.ct99-panel,.ct99-profile,.ct115-profile,.ct116-profile,.ct117-profile').forEach(x=>{if(!x.closest('#ct118-profile'))x.remove()});
  const content=$119('.content');if(!content)return;
  for(const el of [...content.children]){
    if(el.matches('h1,p,#ct118-profile,.mobile-nav,.ct118-version'))continue;
    if(/(^|\s)ct(99|115|116|117)-/.test(String(el.className||'')))el.remove();
  }
}
function sanitizeHome119(){
  if(route119()!=='home')return;
  const content=$119('.content'),authoritative=$119('#ct118-search');if(!content||!authoritative)return;
  $$119('#ct111-global-search,.ct111-search',content).forEach(x=>x.remove());
  $$119('.search',content).forEach(x=>{if(!x.closest('#ct118-search'))x.style.display='none'});
  for(const input of $$119('input[type="search"],input[placeholder*="Buscar" i]',content)){
    if(input.closest('#ct118-search'))continue;
    const box=input.closest('#ct111-global-search,.ct111-search,.search,[class*="search"]');
    if(box&&box!==authoritative&&!box.contains(authoritative))box.style.display='none';
  }
}
function sanitize119(){sanitizeNav119();sanitizeProfile119();sanitizeHome119()}
function scheduleSanitize119(){clearTimeout(sanitizeTimer119);sanitizeTimer119=setTimeout(sanitize119,35)}

function unwrapExclusions119(value){
  let v=value;
  if(typeof v==='string'){try{v=JSON.parse(v)}catch{}}
  if(v&&typeof v==='object'&&'data'in v&&v.data!=null)v=v.data;
  if(Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object')v=v[0];
  if(!v||!Array.isArray(v.movie_ids)||!Array.isArray(v.tv_ids))return null;
  return{movie_ids:v.movie_ids,tv_ids:v.tv_ids,aliases:Array.isArray(v.aliases)?v.aliases:[]};
}
function known119(x){return Boolean(x?.is_watchlist||x?.is_seen||x?.is_in_progress||x?.is_up_to_date||x?.is_completed||Number(x?.watched_episodes||0)>0||x?.last_watched_at)}
async function fallbackExclusions119(){
  if(!rawRpc119)throw new Error('RPC indisponível');
  const dash=await rawRpc119('cinetracker_profile_media_dashboard_v0991',{}),rows=(Array.isArray(dash)?dash:[]).filter(known119),movies=new Set(),tv=new Set(),aliases=[];
  for(const x of rows){
    const type=x.media_type==='movie'?'movie':'tv',id=Number(x.tmdb_id||0),raw=x.raw_tmdb||{};
    if(id>0)(type==='movie'?movies:tv).add(id);
    aliases.push({media_type:type,release_year:Number(x.release_year||0)||null,title:x.title||null,localized_title:raw.title||null,localized_name:raw.name||null,original_title:raw.original_title||null,original_name:raw.original_name||null});
  }
  return{movie_ids:[...movies],tv_ids:[...tv],aliases};
}
if(rawRpc119){
  window.sbRpc=async function(name,body={}){
    if(String(name)!=='cinetracker_discovery_exclusions_v0994')return rawRpc119(name,body);
    try{const normalized=unwrapExclusions119(await rawRpc119(name,body));if(normalized)return normalized}catch(error){console.warn('[CineTracker 0.99.7 v119] exclusions RPC fallback',error)}
    return fallbackExclusions119();
  };
}

function augmentSearch119(data,type){
  if(!data||!Array.isArray(data.results))return data;
  const out=[];
  for(const x of data.results){
    out.push(x);
    const original=type==='movie'?x.original_title:x.original_name,localized=type==='movie'?x.title:x.name;
    if(original&&norm119(original)!==norm119(localized))out.push({...x,[type==='movie'?'title':'name']:original,__ct119OriginalAlias:true});
  }
  return{...data,results:out};
}
window.fetch=async function(input,init){
  const response=await rawFetch119(input,init);
  try{
    const inputUrl=input instanceof URL?input.href:(typeof input==='string'?input:input?.url||String(input||''));
    const url=new URL(inputUrl,location.href);
    if(!url.pathname.endsWith('/functions/v1/tmdb-proxy'))return response;
    const path=url.searchParams.get('path')||'';
    const m=path.match(/^\/search\/(movie|tv)$/);if(!m||!response.ok)return response;
    const data=augmentSearch119(await response.clone().json(),m[1]);
    const headers=new Headers(response.headers);headers.delete('content-length');headers.delete('content-encoding');
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
  }catch{return response}
};

function cacheRead119(){try{const x=JSON.parse(localStorage.getItem(POSTER_CACHE119)||'{}');return x&&typeof x==='object'?x:{}}catch{return{}}}
function cacheWrite119(x){try{localStorage.setItem(POSTER_CACHE119,JSON.stringify(x))}catch{}}
function mediaId119(card){return Number(card?.dataset?.ct118MediaId||card?.dataset?.ct994Open||card?.dataset?.card991||card?.dataset?.mediaId||0)}
function posterEl119(card){return card?.querySelector?.('.ct118-poster,.ct994-poster,.ct991-poster,.poster,.media-poster')||null}
function hasPoster119(el){if(!el)return true;const inline=String(el.style.backgroundImage||'');if(inline&&inline!=='none')return true;try{return getComputedStyle(el).backgroundImage!=='none'}catch{return false}}
function img119(path,size='w342'){const base=typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(window.SUPABASE_URL||'');return path&&base?`${base}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`:''}
async function apiSearch119(type,row){
  const q=String(row?.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();if(!q)return null;
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/search/${type}`);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');u.searchParams.set('query',q);u.searchParams.set('include_adult','false');u.searchParams.set('page','1');
  const yr=Number(row.release_year||0);if(yr>0)u.searchParams.set(type==='movie'?'year':'first_air_date_year',String(yr));
  const r=await window.fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)return null;
  const d=await r.json(),want=norm119(q),hits=(d.results||[]).filter(x=>{
    const names=[x.title,x.name,x.original_title,x.original_name].map(norm119).filter(Boolean),y=year119(x);
    return names.some(n=>n===want||n.includes(want)||want.includes(n))&&(!yr||!y||Math.abs(y-yr)<=1)&&x.poster_path;
  }).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
  return hits[0]?.poster_path||null;
}
async function repairPosters119(){
  if(posterBusy119||typeof window.sbApi!=='function')return;
  const cards=[...new Set([...$$119('[data-ct994-open]'),...$$119('[data-card991]'),...$$119('.ct118-card[data-ct118-media-id]')])].filter(c=>{
    const r=c.getBoundingClientRect();return r.bottom>-500&&r.top<innerHeight+900&&!hasPoster119(posterEl119(c));
  }).slice(0,18),ids=[...new Set(cards.map(mediaId119).filter(x=>x>0))];if(!ids.length)return;
  posterBusy119=true;
  try{
    const rows=await window.sbApi(`media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb&id=in.(${ids.join(',')})`).catch(()=>[]),by=new Map((rows||[]).map(x=>[Number(x.id),x])),cache=cacheRead119();let dirty=false,searched=0;
    for(const card of cards){
      const id=mediaId119(card),row=by.get(id),el=posterEl119(card);if(!row||!el||hasPoster119(el))continue;
      let path=row.poster_path||row.raw_tmdb?.poster_path||cache[id]?.path||null;
      if(!path&&searched<12){searched++;try{path=await apiSearch119(row.media_type==='movie'?'movie':'tv',row)}catch{}}
      if(path){el.style.backgroundImage=`url('${img119(path)}')`;cache[id]={path,at:Date.now()};dirty=true}
    }
    if(dirty)cacheWrite119(cache);
  }finally{posterBusy119=false}
}
function schedulePosters119(delay=120){clearTimeout(posterTimer119);posterTimer119=setTimeout(()=>void repairPosters119(),delay)}

async function navigate119(target,...args){
  const t=String(target||'home').replace('history','profile');if(!rawNavigate119)return false;
  const out=await rawNavigate119(t,...args);
  for(const d of [0,80,260,700,1400])setTimeout(()=>{sanitize119();schedulePosters119(40)},d);
  return out;
}
navigate119.__ct119Wrapped=true;navigate119.__ct119Raw=rawNavigate119;
if(rawNavigate119){window.__ct0994Navigate=navigate119;window.ct0994Navigate=navigate119;window.ct0992Navigate=navigate119;window.ct991Navigate=navigate119;window.ct99Navigate=navigate119;window.ct98Navigate=navigate119}

document.addEventListener('click',e=>{
  const b=e.target.closest?.('.sidebar .nav button,.mobile-nav button');if(!b)return;const t=target119(b);if(!['home','discover','profile','settings'].includes(t)||!rawNavigate119)return;
  e.preventDefault();e.stopImmediatePropagation();void navigate119(t);
},true);
window.addEventListener('scroll',()=>schedulePosters119(160),{passive:true});
window.addEventListener('focus',()=>{scheduleSanitize119();schedulePosters119(100)});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){scheduleSanitize119();schedulePosters119(100)}});
const observer119=new MutationObserver(()=>scheduleSanitize119());
const app119=$119('#app');if(app119)observer119.observe(app119,{childList:true,subtree:true});
for(const d of [0,120,420,1100,2400])setTimeout(()=>{sanitize119();schedulePosters119(60)},d);
})();
