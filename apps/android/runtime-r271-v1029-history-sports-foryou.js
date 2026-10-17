/* CineTracker Android r271 / 1.0.29 — exact sports optimistic action, complete movie history, cached personal recommendations. Web r541 frozen. */
(()=>{
'use strict';
if(window.__ctR271AndroidV1029)return;
window.__ctR271AndroidV1029='sports-stays-put+chronological-all-movies+foryou-fast-snapshot';
const q=(sel,root=document)=>root?.querySelector?.(sel)||null;
const esc271=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const userKey=()=>String(session?.user?.id||user?.id||'');
/* SPORTS: capture on WINDOW before old DOCUMENT listeners. Those listeners
   either await a full sportsPayload(true)+paintSports or recreate the modal,
   moving the screen back to the top after the first tap. */
const sportsLocks271=new Set();
const buttonSelector271='[data-sport-watch],[data-sport-watched],[data-ct263-sport-watch]';
function watchState271(id){
 const all=[...(sportsCache?.events||[]),...(sportsCache?.watch_history||[]),...(sportsDetail263?.events||[])];
 return all.find(x=>Number(x?.id||x?.event_id||0)===id)||null;
}
function setWatch271(id,on){
 for(const obj of [...(sportsCache?.events||[]),...(sportsCache?.watch_history||[]),...(sportsDetail263?.events||[])])
  if(Number(obj?.id||obj?.event_id||0)===id)obj.is_watched=on;
 const buttons=[...document.querySelectorAll(buttonSelector271)].filter(b=>
  Number(b.dataset.sportWatch||b.dataset.sportWatched||b.dataset.ct263SportWatch||0)===id);
 for(const b of buttons){
  b.dataset.on=on?'1':'0';b.dataset.watched=on?'1':'0';
  b.classList.toggle('on',on);b.classList.toggle('active',on);
  b.textContent=on?(b.matches('[data-ct263-sport-watch]')?'↶ Desmarcar assistido':'✓ Assistido'):'✓ Marcar como assistido';
  b.setAttribute('aria-pressed',on?'true':'false');
 }
 return buttons;
}
function sportsClick271(event){
 const button=event.target?.closest?.(buttonSelector271);
 if(!button||!session||route()!=='sports')return;
 const id=Number(button.dataset.sportWatch||button.dataset.sportWatched||button.dataset.ct263SportWatch||0);
 if(!Number.isSafeInteger(id)||id<=0)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(sportsLocks271.has(id))return;
 const row=watchState271(id);
 const prior=row?Boolean(row.is_watched):(button.dataset.on==='1'||button.dataset.watched==='1');
 const next=!prior;
 sportsLocks271.add(id);
 const buttons=setWatch271(id,next);
 for(const b of buttons)b.disabled=true;
 Promise.resolve(rpc('cinetracker_sport_mark_watched_v1',{
  p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()
 })).then(result=>{
  const actual=typeof result?.is_watched==='boolean'?result.is_watched:next;
  setWatch271(id,actual);
  if(sportsCache)try{ct163Write('sports',sportsCache)}catch{}
  profileCache=null;try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}
  // Deliberately DO NOT dispatch a broad data-changed event. Legacy listeners
  // use it to rebuild the full Sports screen and modal.
  try{toast(actual?'Evento marcado como assistido.':'Evento removido dos assistidos.')}catch{}
 }).catch(error=>{
  setWatch271(id,prior);
  try{toast('Esportes: '+(error?.message||String(error)))}catch{}
 }).finally(()=>{
  sportsLocks271.delete(id);
  for(const b of buttons)if(b.isConnected)b.disabled=false;
 });
}
window.addEventListener('click',sportsClick271,true);

/* MOVIES: the Home RPC intentionally limits watch_history to 80 newest rows.
   Fetch the authenticated user's actual pages and join the media metadata.
   Render only the movie history stack, without repainting Home or resetting the
   currently selected tab/scroll position. Never fabricate dates or watched rows. */
const HISTORY_PAGE=120,MAX_PAGES=10;
let movieJob271=null,movieStamp271='',movieRetryAt271=0;
function sorted271(rows){
 return [...rows].sort((a,b)=>(Date.parse(b.watched_at||'')||0)-(Date.parse(a.watched_at||'')||0)||Number(b.id||0)-Number(a.id||0));
}
async function fetchAllMovies271(){
 if(!session?.access_token||!userKey())return[];
 const result=[];
 for(let page=0;page<MAX_PAGES;page++){
  const uri='watch_history?select=id,media_id,title,watched_at,item_type&profile_id=eq.'+
   encodeURIComponent(userKey())+'&item_type=eq.movie&order=watched_at.desc,id.desc&limit='+HISTORY_PAGE+'&offset='+(page*HISTORY_PAGE);
  const data=await api(uri);
  if(!Array.isArray(data))throw new Error('movie history: invalid data');
  result.push(...data.filter(x=>x&&x.watched_at&&x.media_id));
  if(data.length<HISTORY_PAGE)break;
 }
 if(!result.length)return[];
 const ids=[...new Set(result.map(x=>Number(x.media_id)).filter(x=>x>0))];
 const byId=new Map();
 // Retrieve only the fields needed for card titles, ids and posters.
 for(let p=0;p<ids.length;p+=120){
  const section=ids.slice(p,p+120);
  const rows=await api('media?select=id,tmdb_id,title,poster_path,media_type&id=in.('+section.join(',')+')');
  for(const m of Array.isArray(rows)?rows:[])if(m&&m.media_type==='movie')byId.set(Number(m.id),m);
 }
 const seen=new Set();
 return sorted271(result.map(h=>{
  const m=byId.get(Number(h.media_id))||{};
  return {id:h.id,media_id:Number(h.media_id),tmdb_id:Number(m.tmdb_id||0),
   media_title:String(m.title||h.title||'').trim(),title:h.title||m.title||'',
   poster_path:m.poster_path||null,watched_at:h.watched_at};
 }).filter(x=>x.media_title&&x.watched_at&&
  (seen.has(String(x.id))?false:(seen.add(String(x.id)),true))));
}
function paintMovieHistory271(data){
 const vp=q('[data-home-viewport="movies"]'),stack=q('.home-history .stack',vp);
 if(!vp||!stack||route()!=='home')return false;
 const pos=vp.scrollTop,oldHeight=q('.home-history',vp)?.offsetHeight||0;
 stack.innerHTML=sorted271(data).reverse().map(x=>homeMovieRow158(x,true)).join('')||
  '<div class="empty">Nenhum filme no histórico.</div>';
 const newHeight=q('.home-history',vp)?.offsetHeight||oldHeight;
 // The history is ABOVE "Assistir a seguir": compensate changes in height
 // while leaving user at exactly the same visible card.
 vp.scrollTop=Math.max(0,pos+newHeight-oldHeight);
 return true;
}
async function ensureMovieHistory271(){
 const id=userKey();
 if(!id||route()!=='home'||!session||homeActiveTab158!=='movies'||movieJob271)return;
 const key=id+':'+localDay(),now=Date.now();
 if(movieStamp271===key||now<movieRetryAt271)return;
 movieJob271=fetchAllMovies271().then(rows=>{
  if(!rows.length||!session||userKey()!==id)return;
  movieStamp271=key;
  const old=Array.isArray(homeCache?.history_movies)?homeCache.history_movies:[];
  const result=sorted271(rows);
  // Only replace when paginated information is at least as complete.
  if(result.length>=old.length){
   if(homeCache)homeCache.history_movies=result;
   if(route()==='home'&&homeActiveTab158==='movies')paintMovieHistory271(result);
  }
 }).catch(e=>{
  movieRetryAt271=Date.now()+60000;
  try{console.warn('r271 movie history',e?.message||e)}catch{}
 }).finally(()=>{movieJob271=null});
 await movieJob271;
}
const paintBase271=paintHome;
paintHome=function(...args){
 const out=paintBase271.apply(this,args);
 if(route()==='home'&&homeActiveTab158==='movies')setTimeout(()=>{void ensureMovieHistory271()},40);
 return out;
};
document.addEventListener('click',e=>{
 const t=e.target?.closest?.('[data-home-tab]');
 if(t&&(t.dataset.homeTab==='movies'||t.dataset.homeTab==='films'))setTimeout(()=>void ensureMovieHistory271(),70);
},true);
window.addEventListener('cinetracker:data-changed',()=>{movieStamp271='';movieRetryAt271=0});

/* PRA VOCÊ: reuse ONLY an existing validated, owner-scoped selection snapshot
   during quick tab switching. The original full source remains authoritative;
   no extra items are inserted into Da sua Watchlist. */
const forYouOrig271=ct186LoadForYou;
const forYouKey271=()=> 'ct:r271:foryou:'+userKey()+':'+localDay();
let forYouRequest271=null;
function persistForYou271(data){
 if(!data?._ct186_fresh||!session)return;
 try{
  const copied={};
  for(const name of ['_ct186_fresh','_ct186_watchlist']){
   const v=data[name]||{};copied[name]={};
   for(const kind of ['movie','series','anime'])copied[name][kind]=(Array.isArray(v[kind])?v[kind]:[]).slice(0,40);
  }
  if(!copied._ct186_fresh.movie?.length&&!copied._ct186_fresh.series?.length)return;
  localStorage.setItem(forYouKey271(),JSON.stringify({at:Date.now(),data:copied}));
 }catch{}
}
ct186LoadForYou=async function(force=false){
 const key=forYouKey271();
 if(!force){
  try{
   const snapshot=JSON.parse(localStorage.getItem(key)||'null');
   if(snapshot?.at&&Date.now()-Number(snapshot.at)<8*60000&&snapshot.data){
    const data={...snapshot.data,_ct186_fallback:{movie:[],series:[],anime:[]}};
    const s=ct186Select(data);
    if(s.daily||s.fm||s.fs||s.fa){
     Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,
      watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,
      wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
     ct186ForYouData=data;
     return data;
    }
   }
  }catch{}
 }
 if(forYouRequest271)return forYouRequest271;
 forYouRequest271=Promise.resolve(forYouOrig271(force)).then(data=>{
  persistForYou271(data);return data;
 }).finally(()=>{forYouRequest271=null});
 return forYouRequest271;
};
const refreshOriginal271=ct186RefreshVisible;
ct186RefreshVisible=async function(...args){
 try{localStorage.removeItem(forYouKey271())}catch{}
 const data=await refreshOriginal271.apply(this,args);
 if(data)persistForYou271(data);
 return data;
};
window.addEventListener('cinetracker:data-changed',()=>{try{localStorage.removeItem(forYouKey271())}catch{}});
window.__ctR271Test={sportsClick271,setWatch271,sorted271,paintMovieHistory271,fetchAllMovies271,persistForYou271};
})();