/* CineTracker Web 1.0.111 r320 — exact candidate filtering + Profile history parity with Home. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR320)return;
window.__ctR320='discover-exact-candidate-filter+profile-home-history-parity';
window.__ctR320Discover='server-check-each-candidate+hidden-until-validated+foryou-pools';
window.__ctR320Profile='activity-from-watch-history+home-metadata';
window.__ctR320Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let testBridge=null,validationSeq=0,validationTimer=0,fyBusy=false;

function validKey320(k){return /^(movie|tv):[1-9]\d*$/.test(String(k||''))}
function keyOf320(x){
 const type=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
 return id?type+':'+id:'';
}
function candidateFromNode320(node){
 const key=String(node?.dataset?.ct319Item||node?.dataset?.media||q('[data-media]',node)?.getAttribute('data-media')||'');
 if(!validKey320(key))return null;
 const [media_type,idRaw]=key.split(':'),tmdb_id=Number(idRaw||0);
 const title=(q('.card-body b,.ct288-card b,strong',node)?.textContent||'').trim();
 const text=node?.textContent||'',m=text.match(/\b(19|20)\d{2}\b/);
 return {media_type,tmdb_id,title,release_year:m?Number(m[0]):null,key};
}
function toAuthority320(payload){
 if(!payload||typeof payload!=='object'||!Array.isArray(payload.blocked_keys))throw new Error('Filtro pessoal inválido');
 return {
  ready:true,
  blocked:new Set(rows(payload.blocked_keys).map(String)),
  watch:new Set(rows(payload.watch_keys).map(String)),
  seen:new Set(rows(payload.seen_keys).map(String)),
  notInterested:new Set(rows(payload.not_interested_keys).map(String))
 };
}
async function exact320(items){
 const clean=[],seen=new Set();
 for(const x of rows(items)){
  const key=x?.key||keyOf320(x);if(!validKey320(key)||seen.has(key))continue;seen.add(key);
  const [media_type,idRaw]=key.split(':');
  clean.push({media_type,tmdb_id:Number(idRaw),title:x?.title||x?.name||x?.media_title||'',release_year:Number(x?.release_year||String(x?.release_date||x?.first_air_date||'').slice(0,4))||null});
 }
 if(!clean.length)return{ready:true,blocked:new Set(),watch:new Set(),seen:new Set(),notInterested:new Set()};
 if(testBridge?.exact)return toAuthority320(await testBridge.exact(clean));
 if(typeof rpc!=='function')throw new Error('Sessão pessoal indisponível');
 return toAuthority320(await rpc('cinetracker_discover_filter_v320',{p_items:clean}));
}
function failDiscover320(message='Não foi possível validar sua biblioteca agora.'){
 const h=q('[data-ct319-content]')||q('[data-ct318-content]')||q('[data-ct315-content]');
 if(h)h.innerHTML='<div class="empty ct320-block-error">'+esc(message)+'<br><button type="button" class="chip" data-ct319-retry>Tentar novamente</button></div>';
}
async function validatePublic320(root=document){
 if(routeNow()!=='discover')return false;
 const nodes=qa('[data-ct319-item]',root).filter(n=>!n.dataset.ct320Validated);
 if(!nodes.length)return false;
 const seq=++validationSeq,cands=nodes.map(candidateFromNode320).filter(Boolean);
 try{
  const a=await exact320(cands);if(seq!==validationSeq||routeNow()!=='discover')return false;
  for(const node of nodes){
   const c=candidateFromNode320(node);if(!c){node.remove();continue}
   if(a.blocked.has(c.key))node.remove();else node.dataset.ct320Validated='1';
  }
  for(const rail of new Set(nodes.map(n=>n.parentElement).filter(Boolean))){
   if(!rail.isConnected)continue;
   if(!q('[data-ct319-item]',rail)&&!q('.empty',rail))rail.insertAdjacentHTML('beforeend','<div class="empty">Nenhum item elegível no momento.</div>');
   const sec=rail.closest('section.panel'),count=sec&&q('.panel-head small',sec);if(count)count.textContent=String(qa('[data-ct319-item]',rail).length);
  }
  return true;
 }catch(e){
  for(const n of nodes)n.remove();failDiscover320(e?.message||String(e));return false;
 }
}
function allForYouItems320(state){
 const out=[];if(!state)return out;
 for(const k of ['movie','series','anime'])for(const x of rows(state.watchPools?.[k]))out.push(x);
 for(const k of ['movie','series','anime'])for(const x of rows(state.freshPools?.[k]))out.push(x);
 for(const x of rows(state.dailyPool))out.push(x);
 return out;
}
async function sanitizeForYou320(){
 if(fyBusy||routeNow()!=='discover')return false;
 const state=window.__ctR309Test?.state,root=q('[data-ct309-foryou]');if(!state||!root)return false;
 fyBusy=true;root.removeAttribute('data-ct320-validated');
 try{
  const a=await exact320(allForYouItems320(state));
  for(const k of ['movie','series','anime']){
   state.watchPools[k]=rows(state.watchPools?.[k]).filter(x=>{const key=keyOf320(x);return a.watch.has(key)&&!a.seen.has(key)});
   state.freshPools[k]=rows(state.freshPools?.[k]).filter(x=>!a.blocked.has(keyOf320(x)));
   state.watchIndex[k]=0;state.freshIndex[k]=0;
  }
  state.dailyPool=rows(state.dailyPool).filter(x=>!a.blocked.has(keyOf320(x)));state.dailyIndex=0;
  window.__ctR309Test?.setForYouState?.(state);
  await window.__ctR309?.buildForYou?.(false);
  const painted=q('[data-ct309-foryou]');if(painted){painted.dataset.ct320Validated='1';try{window.__ctR319?.applyForYouFilter?.()}catch{}}
  return true;
 }catch(e){
  const h=q('[data-ct319-content]')||q('[data-ct318-content]');if(h)h.innerHTML='<div class="empty ct320-block-error">'+esc(e?.message||'Não foi possível validar suas recomendações.')+'</div>';
  return false;
 }finally{fyBusy=false}
}
function scheduleValidate320(){
 clearTimeout(validationTimer);validationTimer=setTimeout(()=>{
  if(routeNow()!=='discover')return;
  if(String((window.__ctR288R263?.discover263||{}).tab||'')==='foryou')void sanitizeForYou320();
  else void validatePublic320(document);
 },20);
}
function preClick320(target){
 if(!target?.closest)return false;
 if(target.closest('[data-ct319-tab],[data-ct318-tab]')){
  const h=q('[data-ct319-content]')||q('[data-ct318-content]')||q('[data-ct315-content]');
  if(h)h.innerHTML='<div class="ct263-loading ct320-loading">Validando sua biblioteca…</div>';
  ++validationSeq;
 }
 return false;
}
window.__ctR320EarlyPre=preClick320;

/* Profile activity: same media source as Home (watch_history), with the same useful metadata. */
function fmtDate320(v){try{return new Date(v).toLocaleDateString('pt-BR')}catch{return''}}
function fmtTime320(v){try{return new Date(v).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}catch{return''}}
function activityItemHtml320(x){
 const type=String(x?.item_type||''),isSport=type==='sport',isMovie=type==='movie',tmdb=Number(x?.tmdb_id||0),mediaType=isMovie?'movie':'tv';
 const poster=x?.poster_path&&!isSport?(typeof img==='function'?img(x.poster_path,'w154'):x.poster_path):'';
 const rating=Number(x?.vote_average||0),plays=Number(x?.plays||1),remaining=Number(x?.remaining_episodes||0),date=fmtDate320(x?.watched_at),time=fmtTime320(x?.watched_at);
 let meta='',sub='';
 if(type==='episode'){
  const se='S'+String(Number(x?.season_number||0)).padStart(2,'0')+'E'+String(Number(x?.episode_number||0)).padStart(2,'0');
  meta=[se,x?.title&&x.title!==x.media_title?'Ep: '+x.title:'',rating?'★ '+rating.toFixed(1):'',date,plays>1?plays+'x':''].filter(Boolean).join(' · ');
  sub=remaining>0?remaining+' episódio'+(remaining===1?'':'s')+' '+(remaining===1?'disponível':'disponíveis')+' para ver':'Em dia';
 }else if(isMovie){
  meta=['Filme',rating?'★ '+rating.toFixed(1):'',date,plays>1?plays+'x':''].filter(Boolean).join(' · ');
  sub=time?('Assistido às '+time):'';
 }else{
  meta=['Esporte',date,time,Number(x?.runtime_minutes||0)?Number(x.runtime_minutes)+' min':''].filter(Boolean).join(' · ');
 }
 return '<article class="ct171-activity-item ct320-activity-item"'+(tmdb?' data-media="'+mediaType+':'+tmdb+'"':'')+'><div class="ct171-activity-thumb"'+(poster?' style="background-image:url(\''+poster+'\')"':'')+'>'+(isSport?'🏆':'')+'</div><div><b>'+esc(x?.media_title||x?.title||'Item assistido')+'</b><span>'+esc(meta)+'</span>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'+(tmdb?'<i>›</i>':'')+'</article>';
}
async function openActivityDay320(day){
 q('.ct171-activity-overlay')?.remove();const ov=document.createElement('div');ov.className='ct171-activity-overlay';ov.dataset.ct320Activity='1';
 ov.innerHTML='<div class="ct171-activity-box"><div class="panel-head"><div><small>HISTÓRICO · MESMA FONTE DA HOME</small><h2>'+esc(new Date(day+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))+'</h2></div><button type="button" class="btn" data-ct171-activity-close>✕ Fechar</button></div><div data-ct171-activity-items>'+loading('Carregando histórico...')+'</div></div>';document.body.appendChild(ov);
 try{
  const list=testBridge?.activityItems?await testBridge.activityItems(day):await rpc('cinetracker_activity_items_by_day_v320',{p_day:day,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
  const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML=rows(list).map(activityItemHtml320).join('')||'<div class="empty">Nenhum item registrado neste dia.</div>';
 }catch(e){const box=q('[data-ct171-activity-items]',ov);if(box)box.innerHTML='<div class="error">'+esc(e?.message||e)+'</div>'}
}
async function hydrateActivity320(){
 if(routeNow()!=='profile')return false;
 try{
  const data=testBridge?.activityDays?await testBridge.activityDays():await rpc('cinetracker_activity_by_day_v320',{p_days:15,p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
  if(routeNow()!=='profile')return false;
  if(typeof ct169RenderActivity==='function')ct169RenderActivity(data);return true;
 }catch{return false}
}
try{ct169HydrateActivity=hydrateActivity320}catch{}
try{ct171OpenActivityDay=openActivityDay320}catch{}

function earlyHandle320(target){
 const day=target?.closest?.('[data-ct171-activity-day]');if(day){void openActivityDay320(String(day.dataset.ct171ActivityDay||''));return true}
 return false;
}
window.__ctR320EarlyHandle=earlyHandle320;

try{
 const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(routeNow()==='discover')scheduleValidate320();
  if(routeNow()==='profile'&&muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&((n.matches?.('[data-profile]'))||n.querySelector?.('[data-profile]')))))setTimeout(()=>void hydrateActivity320(),60);
 }).observe(app,{subtree:true,childList:true});
}catch{}
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='discover')scheduleValidate320();if(routeNow()==='profile')setTimeout(()=>void hydrateActivity320(),40)});
setTimeout(()=>{if(routeNow()==='discover')scheduleValidate320();if(routeNow()==='profile')void hydrateActivity320()},0);

const style=document.createElement('style');style.id='ct-web-r320';style.textContent=`
[data-ct319-item]:not([data-ct320-validated]){visibility:hidden!important}
[data-ct309-foryou]:not([data-ct320-validated]){visibility:hidden!important}
.ct320-block-error{min-height:84px!important;display:grid!important;place-items:center!important}
.ct320-activity-item>div:nth-child(2){display:flex!important;flex-direction:column!important;gap:3px!important}.ct320-activity-item span{font-size:12px!important;opacity:.9!important}.ct320-activity-item small{opacity:.68!important}
`;document.head.appendChild(style);

window.__ctR320={exact:exact320,validatePublic:validatePublic320,sanitizeForYou:sanitizeForYou320,hydrateActivity:hydrateActivity320,openActivityDay:openActivityDay320,version:'1.0.111'};
window.__ctR320Test={toAuthority320,activityItemHtml320,validKey320,candidateFromNode320,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},sanitizeState(state,payload){const a=toAuthority320(payload);for(const k of ['movie','series','anime']){state.watchPools[k]=rows(state.watchPools?.[k]).filter(x=>a.watch.has(keyOf320(x))&&!a.seen.has(keyOf320(x)));state.freshPools[k]=rows(state.freshPools?.[k]).filter(x=>!a.blocked.has(keyOf320(x)))}state.dailyPool=rows(state.dailyPool).filter(x=>!a.blocked.has(keyOf320(x)));return state}};
})();
