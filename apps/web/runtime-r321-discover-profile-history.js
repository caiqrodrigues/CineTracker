/* CineTracker Web 1.0.112 r321 — restore loading, exact pre-render Discover filter, Home-parity Profile history. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR321)return;
window.__ctR321='discover-pre-render-exact-filter+profile-home-history-parity';
window.__ctR321Discover='no-hidden-post-render-gate+exact-before-paint';
window.__ctR321Profile='watch-history-same-source-as-home';
window.__ctR321Android='preserved-1.0.20-10062';

const B=window.__ctR319Test||{},O=window.__ctR319||{},R=window.__ctR288R263||{};
const discover=R.discover263||null,state=B.state||{filterOpen:false,fyKind:'all',topProvider:0,topToken:0,loadToken:0};
const TABS=B.TABS||[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const LABELS=Object.fromEntries(TABS),STRICT=B.STRICT||new Set(['trending','popular','new','releases','anticipated','top']);
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.title||x?.name||x?.media_title||'');
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4));
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const validKey=k=>/^(movie|tv):[1-9]\d*$/.test(String(k||''));
const STALE=5*60*1000;
let sourceCache=new Map(),topCache=new Map(),loadToken=0,topToken=0,testBridge=null;

function host(){return q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')}
function loading321(text){const l=q('[data-ct319-loadline]');if(l){l.hidden=false;l.textContent=text||'Carregando…'}const h=host();if(h)h.innerHTML='<div class="ct263-loading ct321-loading">'+esc(text||'Carregando títulos…')+'</div>'}
function loaded321(){const l=q('[data-ct319-loadline]');if(l){l.hidden=true;l.textContent=''}}
function sync321(){
 const root=q('[data-ct319-discover]');if(!root||!discover)return;
 const tab=String(discover.tab||'foryou'),canFilter=tab==='foryou'||STRICT.has(tab);
 qa('[data-ct319-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.ct319Tab===tab));
 const filter=q('[data-ct319-filter]',root),types=q('[data-ct319-types]',root);
 if(filter){filter.hidden=!canFilter;filter.setAttribute('aria-expanded',String(canFilter&&state.filterOpen))}
 if(types){
  types.innerHTML=typeof B.filterMarkup319==='function'?B.filterMarkup319():'';
  types.hidden=!canFilter||!state.filterOpen;types.classList.toggle('open',canFilter&&state.filterOpen);
 }
}
function candidatePayload321(list){
 const out=[],seen=new Set();
 for(const x of rows(list)){
  const key=keyOf(x);if(!validKey(key)||seen.has(key))continue;seen.add(key);
  out.push({media_type:typeOf(x)==='movie'?'movie':'tv',tmdb_id:Number(idOf(x)),title:titleOf(x)||'',release_year:Number(yearOf(x))||null});
 }
 return out;
}
function auth321(payload){
 if(!payload||typeof payload!=='object'||!Array.isArray(payload.blocked_keys))throw new Error('Não foi possível validar sua biblioteca.');
 return {blocked:new Set(rows(payload.blocked_keys).map(String)),watch:new Set(rows(payload.watch_keys).map(String)),seen:new Set(rows(payload.seen_keys).map(String)),notInterested:new Set(rows(payload.not_interested_keys).map(String))};
}
async function exact321(list){
 const items=candidatePayload321(list);if(!items.length)return auth321({blocked_keys:[],watch_keys:[],seen_keys:[],not_interested_keys:[]});
 if(testBridge?.exact)return auth321(await testBridge.exact(items));
 if(typeof rpc!=='function')throw new Error('Sessão pessoal indisponível.');
 return auth321(await rpc('cinetracker_discover_filter_v320',{p_items:items}));
}
function dedupe321(list){
 const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!validKey(k)||seen.has(k)||!posterOf(x))continue;seen.add(k);out.push(x)}return out;
}
function applyType321(list){
 const want=String(discover?.type||'all');return (want==='movie'||want==='tv')?list.filter(x=>typeOf(x)===want):list;
}
async function source321(tab,force=false){
 if(testBridge?.source)return dedupe321(await testBridge.source(tab,force));
 const key=tab+'|'+String(discover?.type||'all'),hit=sourceCache.get(key);
 if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 const raw=typeof B.sourceNetwork319==='function'?await B.sourceNetwork319(tab):[];
 sourceCache.set(key,{at:Date.now(),rows:raw});return raw;
}
async function loadPublic321(tab,force=false){
 const token=++loadToken;loading321('Carregando '+(LABELS[tab]||'títulos')+'…');
 try{
  const raw=dedupe321(await source321(tab,force));
  const a=await exact321(raw);
  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;
  const clean=applyType321(raw.filter(x=>!a.blocked.has(keyOf(x))));
  const neutral={ready:true,blocked:new Set(),aliases:new Set()};
  if(typeof B.paintPublic319==='function'){B.paintPublic319(clean,tab,neutral);const sec=q('.ct319-public');if(sec)sec.dataset.ct321Checked='1'}
  else{const h=host();if(h)h.innerHTML='<div class="empty">Renderer do Descobrir indisponível.</div>'}
  loaded321();return true;
 }catch(e){
  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar esta área agora.')+'<br><button class="chip" type="button" data-ct321-retry>Tentar novamente</button></div>';loaded321()}
  return false;
 }
}
function allFy321(st){
 const out=[];if(!st)return out;
 for(const k of ['movie','series','anime'])out.push(...rows(st.watchPools?.[k]),...rows(st.freshPools?.[k]));
 out.push(...rows(st.dailyPool));return dedupe321(out);
}
async function loadForYou321(force=false){
 const token=++loadToken;loading321('Montando recomendações…');
 try{
  if(!window.__ctR309?.buildForYou)throw new Error('Recomendações indisponíveis.');
  await window.__ctR309.buildForYou(!!force);
  if(token!==loadToken||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;
  const st=window.__ctR309Test?.state;if(!st)throw new Error('Recomendações indisponíveis.');
  const a=await exact321(allFy321(st));
  for(const k of ['movie','series','anime']){
   st.watchPools[k]=rows(st.watchPools?.[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));
   st.freshPools[k]=rows(st.freshPools?.[k]).filter(x=>!a.blocked.has(keyOf(x)));
   st.watchIndex[k]=0;st.freshIndex[k]=0;
  }
  st.dailyPool=rows(st.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));st.dailyIndex=0;
  window.__ctR309Test?.setForYouState?.(st);
  await window.__ctR309.buildForYou(false);
  O.applyForYouFilter?.();loaded321();return true;
 }catch(e){
  if(token===loadToken){const h=host();if(h)h.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível montar as recomendações agora.')+'<br><button class="chip" type="button" data-ct321-retry>Tentar novamente</button></div>';loaded321()}
  return false;
 }
}
async function tmdbPage321(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const p=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(p?.results).map(x=>({...x,media_type:x.media_type||type||'tv',tmdb_id:Number(x.id||x.tmdb_id||0)})).filter(x=>['movie','tv'].includes(x.media_type)&&idOf(x)>0&&posterOf(x))}catch{return[]}
}
async function topRaw321(provider,force=false){
 if(testBridge?.top)return testBridge.top(provider,force);
 const key=String(provider),hit=topCache.get(key);if(!force&&hit&&Date.now()-hit.at<STALE)return hit.rows;
 const common={watch_region:'BR',with_watch_providers:Number(provider),with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};
 const [m1,m2,t1,t2]=await Promise.all([
  tmdbPage321('/discover/movie',{...common,page:1},'movie'),tmdbPage321('/discover/movie',{...common,page:2},'movie'),
  tmdbPage321('/discover/tv',{...common,page:1},'tv'),tmdbPage321('/discover/tv',{...common,page:2},'tv')
 ]);
 const data={movies:dedupe321([...m1,...m2]),series:dedupe321([...t1,...t2])};topCache.set(key,{at:Date.now(),rows:data});return data;
}
function card321(x,rank=0){
 let c='';try{c=typeof ct288Card==='function'?ct288Card(x,{rank,watch:false,add:false,slot:true}):''}catch{}
 const k=keyOf(x);return '<div class="ct319-item" data-ct319-item="'+esc(k)+'">'+c+'<div class="ct319-actions"><button type="button" class="chip" data-ct319-action="watchlist" data-media="'+esc(k)+'">+ Watchlist</button><button type="button" class="chip" data-ct319-action="seen" data-media="'+esc(k)+'">✓ Visto</button></div></div>';
}
async function paintTop321(provider,token,force=false){
 const content=q('[data-ct321-top-content]');if(!content||token!==topToken||String(discover?.tab)!=='top10')return false;
 content.innerHTML='<div class="ct263-loading">Montando Top 10…</div>';
 try{
  const raw=await topRaw321(provider,force),a=await exact321([...raw.movies,...raw.series]);
  if(token!==topToken||String(discover?.tab)!=='top10')return false;
  const movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10),series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10);
  let name='Streaming';try{name=(ct171ProviderList||[]).find(x=>Number(x.provider_id)===Number(provider))?.provider_name||name}catch{}
  content.innerHTML='<div class="ct288-top-name"><b>'+esc(name)+'</b></div>'+
   '<section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Séries</h2><small>'+series.length+'</small></div><div class="ct319-top-row">'+(series.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem séries elegíveis neste streaming.</div>')+'</div></section>'+
   '<section class="panel ct288-top-section"><div class="panel-head"><h2>Top 10 Filmes</h2><small>'+movies.length+'</small></div><div class="ct319-top-row">'+(movies.map((x,i)=>card321(x,i+1)).join('')||'<div class="empty">Sem filmes elegíveis neste streaming.</div>')+'</div></section>';
  loaded321();return true;
 }catch(e){content.innerHTML='<div class="empty">'+esc(e?.message||'Não foi possível carregar o Top 10 agora.')+'</div>';loaded321();return false}
}
async function loadTop321(force=false){
 const h=host();if(!h)return false;const token=++topToken;loading321('Carregando Top 10…');
 h.innerHTML='<section class="ct288-top-shell"><div class="ct288-top-title"><h2>Top 10</h2></div><div class="ct288-provider-row" data-ct321-providers><div class="ct263-loading">Carregando streamings…</div></div><div data-ct321-top-content><div class="ct263-loading">Carregando Top 10…</div></div></section>';
 try{
  const providers=typeof ct171Providers==='function'?await ct171Providers():[];
  if(token!==topToken||String(discover?.tab)!=='top10')return false;
  if(!state.topProvider||!providers.some(p=>Number(p.provider_id)===Number(state.topProvider)))state.topProvider=Number((typeof ct171TopProvider!=='undefined'&&ct171TopProvider)||providers[0]?.provider_id||0);
  try{ct171TopProvider=state.topProvider}catch{}
  const box=q('[data-ct321-providers]');if(box)box.innerHTML=rows(providers).map(p=>'<button type="button" class="ct288-provider '+(Number(p.provider_id)===Number(state.topProvider)?'active':'')+'" data-ct321-provider="'+Number(p.provider_id)+'">'+(p.logo_path?'<span style="background-image:url(\''+img(p.logo_path,'w92')+'\')"></span>':'')+'<b>'+esc(p.provider_name||'Streaming')+'</b></button>').join('')||'<div class="empty">Nenhum streaming disponível.</div>';
  if(state.topProvider)return paintTop321(state.topProvider,token,force);
  loaded321();return false;
 }catch(e){const c=q('[data-ct321-top-content]');if(c)c.innerHTML='<div class="empty">Não foi possível carregar os streamings agora.</div>';loaded321();return false}
}
async function loadDiscover321(tab=discover?.tab,force=false){
 if(!discover)return false;const t=String(tab||'foryou');discover.tab=t;if(t==='top10')discover.type='all';sync321();
 if(t==='foryou')return loadForYou321(force);
 if(t==='top10')return loadTop321(force);
 if(STRICT.has(t))return loadPublic321(t,force);
 if(t==='calendar'){loaded321();try{return await window.__ctR315?.loadDiscover?.('calendar',force)}catch{return false}}
 return false;
}
function renderDiscover321(seq){
 setApp(shell('Descobrir','Recomendações, Top 10, tendências, novidades, lançamentos e calendário.','discover',typeof B.shell319==='function'?B.shell319():''));
 if(seq!==navSeq||routeNow()!=='discover')return;sync321();void loadDiscover321(discover?.tab||'foryou',false);
}
try{renderDiscover=renderDiscover321}catch{}
window.__ctR288LoadDiscover=loadDiscover321;

function early321(target){
 if(!target?.closest)return false;
 const tab=target.closest('[data-ct319-tab]');if(tab){state.filterOpen=false;discover.tab=tab.dataset.ct319Tab;if(discover.tab==='top10')discover.type='all';sync321();void loadDiscover321(discover.tab,false);return true}
 const filter=target.closest('[data-ct319-filter]');if(filter){state.filterOpen=!state.filterOpen;sync321();return true}
 const fy=target.closest('[data-ct319-fy-kind]');if(fy){state.fyKind=fy.dataset.ct319FyKind||'all';state.filterOpen=false;sync321();O.applyForYouFilter?.();return true}
 const ty=target.closest('[data-ct319-type]');if(ty){discover.type=ty.dataset.ct319Type||'all';state.filterOpen=false;sync321();void loadPublic321(String(discover.tab),false);return true}
 const provider=target.closest('[data-ct321-provider]');if(provider){state.topProvider=Number(provider.dataset.ct321Provider||0);try{ct171TopProvider=state.topProvider}catch{};qa('[data-ct321-provider]').forEach(b=>b.classList.toggle('active',Number(b.dataset.ct321Provider)===state.topProvider));void paintTop321(state.topProvider,topToken,false);return true}
 const retry=target.closest('[data-ct321-retry]');if(retry){void loadDiscover321(String(discover?.tab||'foryou'),true);return true}
 if(target.closest('[data-ct319-prev]')){q('[data-ct319-tabs]')?.scrollBy({left:-360,behavior:'smooth'});return true}
 if(target.closest('[data-ct319-next]')){q('[data-ct319-tabs]')?.scrollBy({left:360,behavior:'smooth'});return true}
 return false;
}
window.__ctR321EarlyHandle=early321;

/* Perfil: mesmos registros de mídia da Home (watch_history) */
function fmtDate321(v){try{return new Date(v).toLocaleDateString('pt-BR')}catch{return''}}
function fmtTime321(v){try{return new Date(v).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}catch{return''}}
function activityHtml321(x){
 const type=String(x?.item_type||''),isSport=type==='sport',isMovie=type==='movie',tmdb=Number(x?.tmdb_id||0),mt=isMovie?'movie':'tv';
 const poster=x?.poster_path&&!isSport?(typeof img==='function'?img(x.poster_path,'w154'):x.poster_path):'';
 const rating=Number(x?.vote_average||0),plays=Number(x?.plays||1),remain=Number(x?.remaining_episodes||0);
 let meta='',sub='';
 if(type==='episode'){
  const se='S'+String(Number(x?.season_number||0)).padStart(2,'0')+'E'+String(Number(x?.episode_number||0)).padStart(2,'0');
  meta=[se,x?.title&&x.title!==x.media_title?'Ep: '+x.title:'',rating?'★ '+rating.toFixed(1):'',fmtDate321(x?.watched_at),plays>1?plays+'x':''].filter(Boolean).join(' · ');
  sub=remain>0?remain+' episódio'+(remain===1?'':'s')+' '+(remain===1?'disponível':'disponíveis')+' para ver':'Em dia';
 }else if(isMovie){meta=['Filme',rating?'★ '+rating.toFixed(1):'',fmtDate321(x?.watched_at),plays>1?plays+'x':''].filter(Boolean).join(' · ');sub=fmtTime321(x?.watched_at)?'Assistido às '+fmtTime321(x?.watched_at):''}
 else meta=['Esporte',fmtDate321(x?.watched_at),fmtTime321(x?.watched_at),Number(x?.runtime_minutes||0)?Number(x.runtime_minutes)+' min':''].filter(Boolean).join(' · ');
 return '<article class="ct171-activity-item ct321-activity-item"'+(tmdb?' data-media="'+mt+':'+tmdb+'"':'')+'><div class="ct171-activity-thumb"'+(poster?' style="background-image:url(\''+poster+'\')"':'')+'>'+(isSport?'🏆':'')+'</div><div><b>'+esc(x?.media_title||x?.title||'Item assistido')+'</b><span>'+esc(meta)+'</span>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'+(tmdb?'<i>›</i>':'')+'</article>';
}
async function openDay321(day){
 q('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';ov.dataset.ct321Activity='1';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO</small><h2>'+esc(new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items>'+loading('Carregando histórico...')+'</div></div>';document.body.appendChild(ov);
 try{const list=testBridge?.activityItems?await testBridge.activityItems(day):await rpc('cinetracker_activity_items_by_day_v320',{p_day:day,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML=rows(list).map(activityHtml321).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>'}catch(e){const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML='<div class="error">'+esc(e?.message||e)+'</div>'}
}
async function hydrateProfile321(){
 if(routeNow()!=='profile')return false;
 try{const data=testBridge?.activityDays?await testBridge.activityDays():await rpc('cinetracker_activity_by_day_v320',{p_days:15,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});if(routeNow()!=='profile')return false;if(typeof ct169RenderActivity==='function')ct169RenderActivity(data);return true}catch{return false}
}
try{ct169HydrateActivity=hydrateProfile321}catch{}
try{ct171OpenActivityDay=openDay321}catch{}

const style=document.createElement('style');style.id='ct-web-r321';style.textContent=`
.ct321-loading{min-height:84px!important}
.ct321-activity-item>div:nth-child(2){display:flex!important;flex-direction:column!important;gap:3px!important}.ct321-activity-item span{font-size:12px!important;opacity:.9!important}.ct321-activity-item small{opacity:.68!important}
`;document.head.appendChild(style);

window.addEventListener('cinetracker:data-changed',()=>{sourceCache.clear();topCache.clear();if(routeNow()==='discover')setTimeout(()=>void loadDiscover321(String(discover?.tab||'foryou'),true),80);if(routeNow()==='profile')setTimeout(()=>void hydrateProfile321(),80)});
setTimeout(()=>{if(routeNow()==='profile')void hydrateProfile321()},0);

window.__ctR321={renderDiscover:renderDiscover321,loadDiscover:loadDiscover321,loadPublic:loadPublic321,loadForYou:loadForYou321,loadTop:loadTop321,exact:exact321,hydrateProfile:hydrateProfile321,openDay:openDay321,version:'1.0.112'};
window.__ctR321Test={auth321,candidatePayload321,dedupe321,activityHtml321,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},setDiscover(tab,type='all'){if(discover){discover.tab=tab;discover.type=type}}};
})();
