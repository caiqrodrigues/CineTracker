/* CineTracker Android 1.0 r327 — Home search and responsive interaction.
 * Android-only overlay: no Web files, database writes, reloads or navigation changes.
 */
(()=>{
'use strict';
if(window.__ctR327HomeSearch)return;

const $=(selector,root=document)=>root?.querySelector?.(selector)||null;
const arr=value=>Array.isArray(value)?value:[];
const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const home=()=>{try{return route()==='home'&&!!$('[data-page="home"]')}catch{return false}};
const liveInput=()=>home()?$('[data-page="home"] [data-global-search]'):null;
const output=()=>home()?$('[data-page="home"] [data-global-results]'):null;
const kind=x=>String(x?.media_type||x?.type||'').toLowerCase()==='movie'?'movie':'tv';
const key=x=>String(x?.media_type)+':'+Number(x?.id||0);
let sequence=0,painted='',searching=false,onlineTimer=0,requests=0;
let started=0,finished=0,lastLocal=0;
const cache=new Map();
const MAX_CACHE=26, CACHE_TTL=5*60*1000;

function localRows(term){
 const h=typeof homeCache==='object'&&homeCache?homeCache:{};
 const p=typeof profileCache==='object'&&profileCache?profileCache:{};
 const sources=[
  ...arr(h.series).map(x=>({...x,media_type:'tv'})),
  ...arr(h.movie_watchlist).map(x=>({...x,media_type:'movie'})),
  ...arr(h.history_movies).map(x=>({...x,media_type:'movie'})),
  ...arr(h.history_episodes).map(x=>({...x,media_type:'tv'})),
  ...arr(p.dashboard)
 ];
 const seen=new Set(),found=[];
 for(const x of sources){
  const id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.source_tmdb_id||0);
  if(!Number.isSafeInteger(id)||id<=0)continue;
  const type=kind(x),k=type+':'+id;
  if(seen.has(k))continue;seen.add(k);
  const title=String(x?.title||x?.name||x?.series_title||x?.media_title||'');
  const n=norm(title),at=n.indexOf(term);
  if(at<0)continue;
  found.push({id,media_type:type,title,poster_path:x?.poster_path||x?.raw_tmdb?.poster_path||null,
   score:at===0?0:at+2});
 }
 found.sort((a,b)=>a.score-b.score||a.title.localeCompare(b.title,'pt-BR'));
 return found.slice(0,12);
}
function poster(path,size){
 if(!path)return'';
 try{return typeof img==='function'?String(img(path,size)||''):''}catch{return''}
}
function card(x){
 const type=x.media_type,id=Number(x.id);
 if(!Number.isSafeInteger(id)||id<=0)return'';
 const person=type==='person',label=person?'Pessoa':type==='movie'?'Filme':'Série';
 const src=poster(person?x.profile_path:x.poster_path,person?'w185':'w154');
 return '<div class="global-result'+(person?' person':'')+'" '+(person?'data-person="'+id+'"':'data-media="'+type+':'+id+'"')+' role="button" tabindex="0">'+
  '<div class="thumb"'+(src?' style="background-image:url(&quot;'+esc(src)+'&quot;)"':'')+'></div>'+
  '<div><b>'+esc(x.title||x.name||'Sem título')+'</b><small class="muted">'+label+'</small></div></div>';
}
function position(){
 const input=liveInput();if(!input)return;
 const rect=input.getBoundingClientRect?.();if(!rect)return;
 document.documentElement.style.setProperty('--ct327-search-top',Math.max(8,Math.round(rect.bottom+6))+'px');
}
function paint(term,local,remote=[],pending=false,error=''){
 const input=liveInput(),out=output();
 if(!input||!out||norm(input.value)!==term)return false;
 const items=[],seen=new Set();
 for(const x of [...arr(local),...arr(remote)]){
  const k=key(x);if(seen.has(k)||!Number(x?.id))continue;
  seen.add(k);items.push(x);if(items.length>=18)break;
 }
 const body=items.map(card).join('')||
  (pending?'<div class="ct327-search-status" role="status">Buscando filmes, séries e pessoas...</div>':
  '<div class="ct327-search-status">'+(error?'Não foi possível consultar o catálogo. Tente novamente.':'Nenhum resultado encontrado.')+'</div>');
 const html='<div class="global-results ct327-search-popover" role="listbox" aria-label="Resultados da busca">'+body+'</div>';
 if(html!==painted||out.innerHTML!==html){out.innerHTML=html;painted=html}
 position();return true;
}
function cancel(){
 ++sequence;clearTimeout(onlineTimer);searching=false;painted='';
 const out=output();if(out)out.replaceChildren();
}
function valid(term,token){return token===sequence&&home()&&norm(liveInput()?.value)===term}
function cached(term){
 const c=cache.get(term);
 if(!c||Date.now()-c.at>CACHE_TTL){if(c)cache.delete(term);return null}
 return c.rows;
}
function store(term,rows){
 if(cache.size>=MAX_CACHE)cache.delete(cache.keys().next().value);
 cache.set(term,{at:Date.now(),rows});
}
function onInput(value){
 const input=liveInput();if(!input)return;
 const term=norm(value??input.value),token=++sequence;
 clearTimeout(onlineTimer);painted='';
 if(term.length<2){cancel();return}
 const local=localRows(term);lastLocal=local.length;
 const hit=cached(term);
 paint(term,local,hit||[],!hit);
 if(hit){searching=false;return}
 searching=true;
 onlineTimer=setTimeout(()=>{void load(term,local,token)},180);
}
async function load(term,local,token){
 if(!valid(term,token))return;
 requests++;started=Date.now();
 const found={movie:[],tv:[],person:[]};let pending=3,errors=0;
 const jobs=[['movie','/search/movie'],['tv','/search/tv'],['person','/search/person']];
 await Promise.all(jobs.map(async([type,path])=>{
  try{
   // Existing authenticated Supabase/TMDB proxy; requests are independent so
   // the first response paints without waiting for the slowest endpoint.
   const response=await tmdb(path,{query:term,page:1,include_adult:false});
   found[type]=arr(response?.results).slice(0,type==='person'?4:7).map(x=>({...x,media_type:type}));
  }catch{errors++}
  pending--;
  if(!valid(term,token))return;
  const all=[...found.movie,...found.tv,...found.person];
  paint(term,local,all,pending>0,errors===3?'offline':'');
 }));
 if(!valid(term,token))return;
 finished=Date.now();searching=false;
 store(term,[...found.movie,...found.tv,...found.person]);
}

// Legacy input listener already debounces at 250ms. Keep it wired to the new
// progressive search; immediately paint personal-library matches on keystrokes.
try{const originalSearch=globalSearch;globalSearch=async function(value){
 if(!home())return originalSearch.call(this,value);
 const input=liveInput();if(!input)return;
 if(String(value??'')!==String(input.value??''))return;
 if(norm(value).length<2){cancel();return}
 if(!searching&&cached(norm(value)))return;
 // If the input event was synthesized by a keyboard/IME, refresh its token.
 if(!sequence)onInput(value);
}}catch{}
document.addEventListener('input',e=>{
 if(e.target?.matches?.('[data-page="home"] [data-global-search]'))onInput(e.target.value);
},true);
document.addEventListener('search',e=>{
 if(e.target?.matches?.('[data-page="home"] [data-global-search]'))onInput(e.target.value);
},true);
document.addEventListener('click',e=>{
 const clear=e.target?.closest?.('[data-page="home"] [data-search-clear]');
 if(clear){cancel();return}
 if(!home()||e.target?.closest?.('[data-page="home"] .search-global,[data-page="home"] [data-global-results]'))return;
 if(output()?.innerHTML)cancel();
},false);
document.addEventListener('keydown',e=>{
 if(!home())return;
 if(e.key==='Escape'&&e.target===liveInput()){cancel();e.target.blur();return}
 if((e.key==='Enter'||e.key===' ')&&e.target?.matches?.('.ct327-search-popover [data-media],.ct327-search-popover [data-person]')){
  e.preventDefault();e.target.click();
 }
},false);
window.addEventListener('resize',()=>{if(home()&&output()?.innerHTML)position()},{passive:true});

const style=document.createElement('style');style.id='ct-android-r327-home-fluidity';
style.textContent=`
[data-page="home"] .search-global{position:relative!important;z-index:85!important;pointer-events:auto!important}
[data-page="home"] [data-global-search]{touch-action:manipulation!important;pointer-events:auto!important;min-height:40px!important;caret-color:#70d6ff}
[data-page="home"] [data-search-clear]{min-width:28px!important;min-height:36px!important;display:grid!important;place-items:center!important;cursor:pointer!important;touch-action:manipulation!important}
[data-page="home"] .ct327-search-popover{position:fixed!important;left:11px!important;right:11px!important;top:var(--ct327-search-top,56px)!important;max-height:min(68dvh,calc(100dvh - var(--ct327-search-top,56px) - 72px))!important;overflow-y:auto!important;z-index:10020!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;contain:layout paint!important}
[data-page="home"] .ct327-search-popover .global-result{min-height:58px!important;touch-action:manipulation!important;cursor:pointer!important}
[data-page="home"] .ct327-search-popover .global-result:active{background:#143548!important}
[data-page="home"] .ct327-search-status{padding:15px!important;text-align:center;color:#9ac8df;font-size:12px}
@media(min-width:701px){[data-page="home"] .ct327-search-popover{left:164px!important;right:28px!important}}
/* Mobile scroll and tap remain native, without smooth-scroll or snap animations competing with touch. */
@media(max-width:700px){
 [data-page="home"] [data-home-viewport], [data-page="home"] .home-viewport{scroll-behavior:auto!important;scroll-snap-type:none!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-y:contain!important}
 [data-page="home"] .media-row,[data-page="home"] .home-check{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
 [data-page="home"] .home-section .stack>.media-row{contain:paint!important}
}
`;
document.head.appendChild(style);
window.__ctR327HomeSearch={
 onInput,localRows,cancel,stats:()=>({requests,searching,localMatches:lastLocal,elapsedMs:finished-started,cache:cache.size}),
 version:327,scope:'Android Home search + interaction responsiveness; Web unchanged'
};
})();
