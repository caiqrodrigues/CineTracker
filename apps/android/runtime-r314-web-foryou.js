/* CineTracker Android official 1.0/r314.
   Web parity for Discover > Pra Voce, independently scoped.
   Uses the same authenticated v421 pools as Web r464, the existing
   v525 user-state audit, and existing Android taste feedback.
   Never changes routes, navigation, Home, Sports, Profile or F1. */
(()=>{
'use strict';
if(window.__ctR314ForYou)return;
const KINDS=['movie','series','anime'];
const SLOTS=['daily',...KINDS.map(x=>'watch:'+x),...KINDS.map(x=>'fresh:'+x)];
const empty=()=>({movie:[],series:[],anime:[]});
const blank=()=>({watch:empty(),fresh:empty(),selected:new Map()});
const arr=v=>Array.isArray(v)?v:[];
const userId=()=>String(session?.user?.id||user?.id||'');
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!userId();
const q=(selector,scope=document)=>scope?.querySelector?.(selector)||null;
const esc314=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const identity=x=>{
 const id=Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0);
 return Number.isSafeInteger(id)&&id>0?(x.media_type==='movie'?'movie':'tv')+':'+id:'';
};
const kindMatch=(x,kind)=>x?.media_type===(kind==='movie'?'movie':'tv')&&
 (kind==='movie'?x?.media_kind!=='anime':kind==='anime'?x?.media_kind==='anime':x?.media_kind!=='anime');
const title=x=>String(x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const kindName={movie:'Filme',series:'Série',anime:'Anime'};
const slotName=s=>s==='daily'?'Indicação do dia':kindName[s.split(':')[1]]||'';
const complete=()=>KINDS.some(k=>model.watch[k].length||model.fresh[k].length);
const taste=()=>window.__ctR307Taste;
const blocked=x=>ct186LocalBlocked.has(identity(x));
const canUse=(x,kind,watch)=>Boolean(
 identity(x)&&x?.__ct421_eligible===true&&kindMatch(x,kind)&&
 window.__ctR265Test?.allowed?.(x)===true&&!blocked(x)&&
 window.__ctR279Audit?.permitted?.(x,watch)===true);
const verifyData=x=>x&&!x._ct280AuditPartial&&
 x._ct279AuditedFor&&x._ct186_fresh&&x._ct186_watchlist;
let model=blank(),owner='',visit=-1,request=null,serial=0,lastError='',succeeded=0,swaps=0,clicks=0;
const excluded=new Map(),locks=new Set();
function reset(){
 const id=userId();
 if(id===owner)return;
 owner=id;serial++;model=blank();visit=-1;request=null;excluded.clear();locks.clear();lastError='';
}
function root(){return q('[data-discover-content]')}
function current(s){return model.selected.get(s)||null}
function selectedRefs(skip=''){
 return new Set([...model.selected].filter(([s])=>s!==skip).map(([,x])=>identity(x)).filter(Boolean));
}
function poolFor(slot){
 if(slot==='daily')return [...model.fresh.movie,...model.fresh.series,...model.fresh.anime];
 const[g,k]=slot.split(':');return arr(model[g]?.[k]);
}
function admissible(slot,item){
 if(slot==='daily')return KINDS.some(k=>canUse(item,k,false));
 const[g,k]=slot.split(':');return canUse(item,k,g==='watch');
}
function seenFor(slot){if(!excluded.has(slot))excluded.set(slot,new Set());return excluded.get(slot)}
function randomness(){
 try{if(globalThis.crypto?.getRandomValues){const n=new Uint32Array(1);globalThis.crypto.getRandomValues(n);return n[0]/4294967296}}catch{}
 return Math.random();
}
function choose(slot,skip=''){
 const occupied=selectedRefs(slot),seen=seenFor(slot);
 const rows=poolFor(slot).filter(x=>admissible(slot,x)&&!occupied.has(identity(x))&&
 identity(x)!==skip&&!seen.has(identity(x)));
 if(!rows.length)return null;
 const weighted=taste()?.choose?.(slot,rows,skip);
 const next=weighted&&rows.some(x=>identity(x)===identity(weighted))?weighted:
   rows[Math.floor(randomness()*rows.length)];
 return next||null;
}
function setCurrent(slot,item,remember=true){
 if(item){model.selected.set(slot,item);seenFor(slot).add(identity(item));
  if(remember)taste()?.shown?.(slot,item)}
 else model.selected.delete(slot);
}
function initialize(){
 model.selected.clear();
 // Choose daily across all three categories as on Web.
 for(const slot of SLOTS)setCurrent(slot,choose(slot));
}
function card(item){
 if(!item)return '<div class="ct314-missing">Sem indicação elegível agora.</div>';
 const ref=identity(item),p=mediaPoster(item),poster=p?img(p,'w342'):'',score=Number(item.vote_average||0);
 const label=item.media_type==='movie'?'Filme':item.media_kind==='anime'?'Anime':'Série';
 return '<article class="card discover-card ct314-card"><button type="button" data-media="'+esc314(ref)+'" aria-label="Abrir '+esc314(title(item))+'">'+
 '<div class="poster"'+(poster?' style="background-image:url(\''+esc314(poster)+'\')"':'')+'></div>'+
 '<div class="card-body"><b>'+esc314(title(item))+'</b><small>'+label+(score>0?' · ★ '+score.toFixed(1):'')+
 '</small></div></button></article>';
}
function slotHtml(slot){
 const item=current(slot),watch=slot.startsWith('watch:');
 const actions=item?(watch?[['seen','✓ Visto'],['swap','↻ Trocar']]:
   [['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]):[];
 return '<div class="ct314-slot" data-ct314-slot="'+slot+'">'+(slot==='daily'?'':'<h3>'+slotName(slot)+'</h3>')+
 '<div class="ct314-cardwrap">'+card(item)+'</div>'+
 '<div class="ct314-actions '+(watch?'two':'three')+'">'+actions.map(([action,label])=>
 '<button type="button" class="chip" data-ct314-action="'+action+'" data-ct314-for="'+slot+'">'+label+'</button>').join('')+
 '</div></div>';
}
function paintSlot(slot){
 if(!active())return false;const container=root(),old=q('[data-ct314-slot="'+slot+'"]',container);
 if(!old)return false;
 const template=document.createElement('template');template.innerHTML=slotHtml(slot);
 old.replaceWith(template.content.firstElementChild);return true;
}
function paint(){
 if(!active())return false;
 const target=root();if(!target)return false;
 target.innerHTML='<div data-ct314-foryou>'+
 '<section class="panel ct314-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct314-rail daily">'+slotHtml('daily')+'</div></section>'+
 '<section class="panel ct314-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct314-rail">'+KINDS.map(k=>slotHtml('watch:'+k)).join('')+'</div></section>'+
 '<section class="panel ct314-block"><div class="panel-head"><h2>100% Novos</h2></div><div class="ct314-rail">'+KINDS.map(k=>slotHtml('fresh:'+k)).join('')+'</div></section></div>';
 document.documentElement.dataset.ct314ForYou='ready';
 document.documentElement.dataset.ct314Slots=String(target.querySelectorAll('[data-ct314-slot]').length);
 return true;
}
function message(text,retry=false){
 const target=root();if(!active()||!target)return;
 target.innerHTML='<div class="panel"><div class="empty">'+esc314(text)+
 (retry?'<button type="button" class="chip" data-ct314-retry>Tentar novamente</button>':'')+'</div></div>';
}
async function timebox(p,ms){
 let timer;try{return await Promise.race([Promise.resolve(p),new Promise((_,reject)=>{
  timer=setTimeout(()=>reject(Error('Tempo limite ao consultar as indicações')),ms)})])}
 finally{clearTimeout(timer)}
}
async function fetchPool(group,kind){
 const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
 const p_limit=group==='watch'?30:48;
 const response=await timebox(rpc(name,{p_kind:kind,p_limit}),16000);
 if(!Array.isArray(response))throw Error('Resposta inválida da fonte '+name);
 return response.filter(x=>identity(x)&&kindMatch(x,kind)&&x.__ct421_eligible===true);
}
async function auditedPools(id){
 const keys=[...KINDS.map(k=>['watch',k]),...KINDS.map(k=>['fresh',k])];
 const results=await Promise.allSettled([
  ...keys.map(([group,kind])=>fetchPool(group,kind)),
  timebox(ct186Context(true),18000),
  timebox(taste()?.warm?.(true)||Promise.resolve(true),18000)
 ]);
 if(id!==userId())throw Error('Usuário alterado durante a consulta');
 if(results[6].status!=='fulfilled'||!results[6].value?.dash)
  throw Error('Não foi possível confirmar sua biblioteca para filtrar as indicações');
 const success=results.slice(0,6).filter(x=>x.status==='fulfilled').length;
 if(!success)throw Error('As fontes autenticadas de recomendações não responderam');
 const raw={_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty()};
 for(let i=0;i<6;i++)if(results[i].status==='fulfilled'){
  const[group,kind]=keys[i];
  raw[group==='watch'?'_ct186_watchlist':'_ct186_fresh'][kind]=results[i].value;
 }
 const audited=await timebox(window.__ctR279Audit.auditData(raw),20000);
 if(id!==userId())throw Error('Usuário alterado durante a auditoria');
 if(!verifyData(audited))throw Error('O servidor não conseguiu confirmar a elegibilidade dos itens');
 const clean=blank();
 for(const kind of KINDS){
  clean.watch[kind]=arr(audited._ct186_watchlist[kind]).filter(x=>canUse(x,kind,true));
  clean.fresh[kind]=arr(audited._ct186_fresh[kind]).filter(x=>canUse(x,kind,false));
 }
 // Preserve only server-audited pools; no fabricated fallback recommendations.
 raw.__ct283ServerAudited=true;raw.__ct288Canonical=true;
 ct186ForYouData=raw;ct166ForYouData=raw;
 return clean;
}
async function load(force=false,preserve=false){
 reset();
 if(!active()||!session?.access_token)return false;
 if(request&&!force)return request;
 const id=userId(),ticket=++serial;
 if(!preserve&&!complete())message('Buscando indicações personalizadas…');
 const job=(async()=>{
  const updated=await auditedPools(id);
  if(id!==userId()||ticket!==serial||!active())return false;
  const previous=model.selected;
  model=updated;
  if(preserve){
   for(const slot of SLOTS){
    const old=previous.get(slot);
    if(old&&poolFor(slot).some(x=>identity(x)===identity(old))&&admissible(slot,old))
     model.selected.set(slot,old);
   }
   for(const slot of SLOTS)if(!model.selected.has(slot))setCurrent(slot,choose(slot));
  }else initialize();
  succeeded++;lastError='';
  if(!complete())message('Não há títulos elegíveis nas categorias consultadas.',true);
  else paint();
  return true;
 })().catch(error=>{
  if(ticket===serial&&id===userId()){
   lastError=String(error?.message||error);
   document.documentElement.dataset.ct314LastError=lastError;
   if(!complete())message('Falha ao carregar recomendações: '+lastError,true);
  }
  return false;
 }).finally(()=>{if(ticket===serial)request=null});
 request=job;return job;
}
async function swap(slot){
 if(!SLOTS.includes(slot)||locks.has(slot)||!active())return false;
 locks.add(slot);const button=q('[data-ct314-action="swap"][data-ct314-for="'+slot+'"]',root());
 if(button)button.disabled=true;
 try{
  const old=current(slot),oldKey=identity(old);
  if(oldKey)seenFor(slot).add(oldKey);
  taste()?.feedback?.(slot,old,'swap');
  let next=choose(slot,oldKey);
  if(!next&&!slot.startsWith('watch:')){
   // Replenish from the pre-existing v525-audited Android explorer. Never
   // recycle the same handful merely because the authenticated page is small.
   const refill=slot==='daily'?'fresh:movie':slot;
   const added=await timebox(taste()?.refill?.(refill)||Promise.resolve(false),12000).catch(()=>false);
   if(added&&active()){
    const kind=refill.split(':')[1],source=arr(ct186ForYouData?._ct186_fresh?.[kind]);
    for(const item of source)if(canUse(item,kind,false)&&!model.fresh[kind].some(x=>identity(x)===identity(item)))
     model.fresh[kind].push(item);
    next=choose(slot,oldKey);
   }
  }
  if(!next){toast('Não há outra indicação elegível neste momento.');return false}
  setCurrent(slot,next);swaps++;paintSlot(slot);
  return true;
 }finally{locks.delete(slot);if(button?.isConnected)button.disabled=false}
}
async function action(type,slot){
 if(!['seen','watchlist'].includes(type)||!SLOTS.includes(slot)||locks.has(slot))return false;
 const old=current(slot),key=identity(old);if(!old||!key)return false;
 const uid=userId();locks.add(slot);clicks++;
 const original={watch:model.watch,fresh:model.fresh,selected:new Map(model.selected)};
 const[g]=slot.split(':');
 const buttons=root()?.querySelectorAll('[data-ct314-slot="'+slot+'"] [data-ct314-action]')||[];
 for(const b of buttons)b.disabled=true;
 try{
  const mediaType=old.media_type==='movie'?'movie':'tv',id=Number(old.tmdb_id||old.id);
  // Optimistic update is limited to the selected slot, not the entire page.
  if(g==='watch'&&type==='seen')model.watch={...model.watch,[slot.split(':')[1]]:model.watch[slot.split(':')[1]].filter(x=>identity(x)!==key)};
  for(const kind of KINDS)model.fresh[kind]=model.fresh[kind].filter(x=>identity(x)!==key);
  setCurrent(slot,choose(slot,key));paintSlot(slot);
  if(type==='seen')await markSeen(mediaType,id);
  else await window.__ctR293AddWatchlist(mediaType,id);
  if(uid!==userId())return false;
  const context=ct186ContextValue;
  if(context){
   const set=type==='seen'?(mediaType==='movie'?context.historyMovieIds:context.historyTvIds):
    (mediaType==='movie'?context.watchMovieIds:context.watchTvIds);
   set?.add?.(id);
  }
  taste()?.feedback?.(slot,old,type);
  toast(type==='seen'?'Marcado como visto.':'Adicionado à Watchlist.');
  return true;
 }catch(error){
  if(uid===userId()){
   model.watch=original.watch;model.fresh=original.fresh;model.selected=original.selected;
   paintSlot(slot);
   toast('Não foi possível salvar: '+String(error?.message||error));
  }
  return false;
 }finally{locks.delete(slot);for(const b of buttons)if(b.isConnected)b.disabled=false}
}
function mount(){
 const id=userId();reset();
 if(!id||!session?.access_token){message('Entre na sua conta para ver suas recomendações.',false);return false}
 if(visit!==navSeq){visit=navSeq;excluded.clear();model=blank()}
 void load(true,false);return true;
}
// Wrap only the ForYou route. Every other Discover tab retains its original
// renderer, loaders, event handlers and route navigation unchanged.
const oldRender=renderDiscover;
renderDiscover=async function(seq){
 if(discoverState?.tab!=='foryou')return oldRender.apply(this,arguments);
 try{
  discoverState.type='all';
  const tabs=[['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],
   ['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],
   ['top','Mais bem avaliados'],['calendar','Calendário']];
  const html='<div class="page" data-discover><div class="tabs">'+tabs.map(([k,label])=>
   '<button type="button" class="chip '+(k==='foryou'?'active':'')+
   '" data-discover-tab="'+k+'">'+label+'</button>').join('')+
   '</div><div data-discover-content></div></div>';
  setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',html));
  if(seq!==navSeq||!active())return;
  mount();
 }catch(error){
  lastError=String(error?.message||error);
  if(active())message('Falha ao abrir Pra Você: '+lastError,true);
 }
};
const oldPaint=paintDiscover;
paintDiscover=function(...args){
 if(active())return true; // Stale old asynchronous painter has no authority.
 return oldPaint.apply(this,args);
};
window.addEventListener('click',event=>{
 if(!active())return;
 const button=event.target?.closest?.('[data-ct314-action],[data-ct314-retry]');
 if(!button||!root()?.contains(button))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(button.disabled)return;
 if(button.hasAttribute('data-ct314-retry')){void load(true,false);return}
 const slot=button.dataset.ct314For,command=button.dataset.ct314Action;
 if(command==='swap')void swap(slot);
 else if(command==='seen'||command==='watchlist')void action(command,slot);
},true);
window.addEventListener('pageshow',()=>{if(active()&&complete())void load(true,true)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active()&&complete())void load(true,true)});
window.addEventListener('cinetracker:data-changed',()=>{
 if(active()&&!locks.size&&complete())void load(false,true);
});
const style=document.createElement('style');style.id='ct314-web-parity-foryou';
style.textContent=[
 '[data-ct314-foryou] .ct314-block{min-width:0}',
 '[data-ct314-foryou] .ct314-rail{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;min-width:0!important}',
 '[data-ct314-foryou] .ct314-rail.daily{grid-template-columns:minmax(0,min(190px,100%))!important}',
 '[data-ct314-foryou] .ct314-slot{display:flex!important;flex-direction:column!important;min-width:0!important;max-width:100%!important}',
 '[data-ct314-foryou] .ct314-slot h3{margin:2px 0 7px!important;font-size:13px!important}',
 '[data-ct314-foryou] .ct314-cardwrap{flex:1;min-width:0}',
 '[data-ct314-foryou] .ct314-card{width:100%!important;height:auto!important;max-width:100%!important;min-width:0!important;margin:0!important}',
 '[data-ct314-foryou] .ct314-card>button{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;padding:0!important}',
 '[data-ct314-foryou] .ct314-card .poster{width:100%!important;aspect-ratio:2/3!important;height:auto!important;background-size:cover!important}',
 '[data-ct314-foryou] .ct314-card .card-body{min-height:43px!important;max-height:43px!important;overflow:hidden!important}',
 '[data-ct314-foryou] .ct314-card .card-body>b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-ct314-foryou] .ct314-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;margin-top:7px!important}',
 '[data-ct314-foryou] .ct314-actions.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}',
 '[data-ct314-foryou] .ct314-actions .chip{display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;min-height:38px!important;height:38px!important;padding:0 3px!important;font-size:10px!important;line-height:1.1!important;white-space:normal!important;animation:none!important;transition:none!important;pointer-events:auto!important}',
 '[data-ct314-foryou] .ct314-missing{min-height:90px;padding:14px 6px;font-size:11px;opacity:.8}',
 '@media(max-width:600px){[data-ct314-foryou] .ct314-rail{gap:6px!important}[data-ct314-foryou] .ct314-actions{gap:3px!important}[data-ct314-foryou] .ct314-actions .chip{font-size:9px!important;padding:0 2px!important}}'
].join('\n');
document.head.appendChild(style);
window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:()=>({
 account:owner,visits:visit,loaded:succeeded,swaps,actions:clicks,error:lastError,
 watch:Object.fromEntries(KINDS.map(k=>[k,model.watch[k].length])),
 fresh:Object.fromEntries(KINDS.map(k=>[k,model.fresh[k].length])),
 slots:root()?.querySelectorAll('[data-ct314-slot]')?.length||0
}),scope:'Discover Pra Voce only',source:'Web v421 six pools plus v525 personalized audit'};
})();