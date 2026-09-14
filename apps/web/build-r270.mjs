import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r269-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v269.js'),'utf8'),
  readFile(resolve(dist,'app-v269.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);if(i<0)throw new Error('r270 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r270 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};

js=replaceOnce(js,"window.__ctWebBuild='1.0.60';window.__ctOfficialVersion='1.0.60';","window.__ctWebBuild='1.0.61';window.__ctOfficialVersion='1.0.61';",'web version');
js=replaceOnce(js,"const REVISION='r269-official-1.0.60';","const REVISION='r270-official-1.0.61';",'revision');

/* r269 used the obsolete r3 payload as a second history authority. Production r5 already owns
   history_episodes/history_movies directly from watch_history, so r270 switches that request to r5. */
js=replaceOnce(js,"window.__ctR269='video-history-r3+series-watch-inline';","window.__ctR269='video-history-r5+series-watch-inline';",'r269 history marker');
js=replaceOnce(js,"window.__ctR269Home='canonical-r3-history+orphan-watch-reparent';","window.__ctR269Home='canonical-r5-history+orphan-watch-reparent';",'r269 Home marker');
js=replaceOnce(js,"const p=await rpc('cinetracker_home_live_v0997_r3',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});","const p=await rpc('cinetracker_profile_home_payload_v0997_r5',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)});",'r269 history RPC');
js=js.replaceAll("ct269HistorySource='r3'","ct269HistorySource='r5'");

/* r270 is the only persistent Home DOM reconciler. Older observers depended on intermediate DOM
   shapes and could hide/rewrite the History while the real producer was still settling. */
js=replaceOnce(js,"new MutationObserver(ct268Schedule).observe(document.documentElement,{childList:true,subtree:true});","/* r270 owns persistent Home reconciliation; r268 observer retired */",'r268 observer');
js=replaceOnce(js,"window.addEventListener('hashchange',ct268Schedule,{passive:true});","/* r270 owns Home hash reconciliation; r268 listener retired */",'r268 hash listener');
js=replaceOnce(js,"new MutationObserver(ct269Schedule).observe(document.documentElement,{childList:true,subtree:true});","/* r270 owns persistent Home reconciliation; r269 observer retired */",'r269 observer');

const runtime=String.raw`
/* CT270_HOME_REAL_DOM_START */
window.__ctR270='real-r5-history+dom-order-watch-host';
window.__ctR270Home='r5-watch-history+direct-child-right-check';
window.__ctR270Frozen='discover+detail+sports+android-r269-preserved';
const ct270State={queued:false};
function ct270Norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function ct270HistoryTitle(sec){return ct270Norm(sec?.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent)}
function ct270IsHistory(sec){const t=ct270HistoryTitle(sec);return t==='historico recente'||t==='filmes vistos'}
function ct270PinHistoryFirst(sec){
 if(typeof ct268PinHistoryFirst==='function')return ct268PinHistoryFirst(sec);
 const parent=sec?.parentElement;if(!parent)return false;
 const sections=[...parent.children].filter(el=>el instanceof Element&&el.matches('.home-section'));
 const first=sections.find(el=>!ct270IsHistory(el));
 if(!first||sections.indexOf(sec)<sections.indexOf(first))return false;
 parent.insertBefore(sec,first);return true;
}
function ct270ShowHistoryShell(){
 const root=document.querySelector('[data-home]');if(!root)return false;let changed=false;
 for(const sec of root.querySelectorAll('.home-section')){
  if(!ct270IsHistory(sec))continue;
  if(ct270PinHistoryFirst(sec))changed=true;
  if(sec.hidden){sec.hidden=false;changed=true}
  if(sec.classList.contains('hidden')){sec.classList.remove('hidden');changed=true}
  sec.dataset.ct270HistoryVisible='1';
  if(window.__ctHomeHistoryPending===true&&!ct269State?.history){
   const stack=sec.querySelector('.stack');
   if(stack&&/nenhum (episodio|filme)/.test(ct270Norm(stack.textContent))){stack.innerHTML='<div class="empty" data-ct270-history-loading>Carregando histórico…</div>';changed=true}
  }
 }
 return changed;
}
function ct270AdoptCanonicalHistory(pack=window.homeCache){
 if(!pack||pack.__ctHistoryAuthoritative!==true||typeof ct269HistoryRows!=='function')return false;
 const hist=ct269HistoryRows(pack);
 ct269State.history=hist;ct269State.historyAt=Date.now();window.__ctHomeHistoryPending=false;
 const painted=typeof ct269PaintHistory==='function'?ct269PaintHistory():false;
 ct270ShowHistoryShell();return painted||true;
}
function ct270LooksLikeWatch(el){
 if(!el||el.matches?.('.media-row'))return false;
 if(el.matches?.('[data-ct266-watch],.ct266-watch-action,.ct269-inline-watch-action,.ct270-inline-watch-action'))return true;
 const aria=ct270Norm(el.getAttribute?.('aria-label')||'')+' '+ct270Norm(el.getAttribute?.('title')||'');if(/assistido|watched/.test(aria))return true;
 const txt=String(el.textContent||'').replace(/\s+/g,'').trim();return (txt==='✓'||txt==='✔')&&el.matches?.('button,span,[role="button"]');
}
function ct270WatchActions(view){
 const out=[],seen=new Set();
 for(const el of view?.querySelectorAll?.('[data-ct266-watch],.ct266-watch-action,.ct269-inline-watch-action,.ct270-inline-watch-action,[aria-label*="assistido" i],[title*="assistido" i],button,span,[role="button"]')||[]){
  if(!ct270LooksLikeWatch(el)||seen.has(el))continue;seen.add(el);out.push(el);
 }
 return out;
}
function ct270RowForAction(action,view){
 const inside=action?.closest?.('.media-row');if(inside)return inside;
 const scope=action?.closest?.('.home-section')||view;if(!scope)return null;
 const rows=[...scope.querySelectorAll('.media-row')];let previous=null;
 for(const row of rows){
  if(row.contains(action))return row;
  const relation=row.compareDocumentPosition(action);
  if(relation&Node.DOCUMENT_POSITION_FOLLOWING)previous=row;
 }
 return previous;
}
function ct270SetImportant(el,name,value){if(el?.style?.setProperty)el.style.setProperty(name,value,'important')}
function ct270HardenWatch(row,action){
 if(!row||!action)return false;let changed=false;
 const direct=[...row.children].filter(ct270LooksLikeWatch);
 const keep=direct.find(x=>x!==action)||action;
 if(keep!==action){if(action.isConnected)action.remove();action=keep;changed=true}
 const oldParent=action.parentElement;
 if(oldParent!==row){row.appendChild(action);changed=true}
 row.classList.add('ct266-home-watch-host','ct269-inline-watch-host','ct270-watch-host');
 action.classList.add('ct269-inline-watch-action','ct270-inline-watch-action');action.dataset.ct270Inline='1';
 ct270SetImportant(row,'position','relative');ct270SetImportant(row,'padding-right','52px');ct270SetImportant(row,'box-sizing','border-box');
 const props={position:'absolute',right:'10px',left:'auto',top:'50%',bottom:'auto',transform:'translateY(-50%)',margin:'0',width:'28px','min-width':'28px','max-width':'28px',height:'28px','min-height':'28px','max-height':'28px',padding:'0',display:'flex','align-items':'center','justify-content':'center','box-sizing':'border-box','flex':'0 0 28px','grid-column':'auto','grid-row':'auto','z-index':'9','line-height':'1'};
 for(const [k,v] of Object.entries(props))ct270SetImportant(action,k,v);
 if(oldParent&&oldParent!==row&&oldParent.isConnected&&!oldParent.matches('.stack,.home-section,[data-home-view]')&&oldParent.children.length===0&&!String(oldParent.textContent||'').trim()){oldParent.remove();changed=true}
 for(const dup of [...row.children].filter(x=>x!==action&&ct270LooksLikeWatch(x))){dup.remove();changed=true}
 return changed;
}
function ct270RepairSeriesWatch(){
 const view=document.querySelector('[data-home] [data-home-view="series"]');if(!view)return false;let changed=false;
 for(const action of ct270WatchActions(view)){
  const sec=action.closest?.('.home-section'),title=ct270HistoryTitle(sec);
  if(/historico|concluid|em dia|nao iniciada/.test(title)&&!action.matches('[data-ct266-watch],.ct266-watch-action,.ct269-inline-watch-action'))continue;
  const row=ct270RowForAction(action,view);if(row)changed=ct270HardenWatch(row,action)||changed;
 }
 return changed;
}
function ct270RepairHome(){
 if(String(typeof route==='function'?route():'')!=='home'&&!document.querySelector('[data-home]'))return false;
 const a=ct270AdoptCanonicalHistory(window.homeCache),b=ct270ShowHistoryShell(),c=ct270RepairSeriesWatch();return a||b||c;
}
function ct270Schedule(){if(ct270State.queued)return;ct270State.queued=true;queueMicrotask(()=>{ct270State.queued=false;ct270RepairHome()})}
const ct270PaintHomeBase=typeof paintHome==='function'?paintHome:null;
if(ct270PaintHomeBase)paintHome=function(...args){const out=ct270PaintHomeBase.apply(this,args);ct270RepairHome();return out};
const ct270RenderHomeBase=typeof renderHome==='function'?renderHome:null;
if(ct270RenderHomeBase)renderHome=async function(...args){const out=await ct270RenderHomeBase.apply(this,args);ct270RepairHome();return out};
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-home-tab]'))setTimeout(ct270RepairHome,0)},true);
new MutationObserver(ct270Schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(ct270RepairHome,0),{passive:true});
for(const ms of [0,30,100,300])setTimeout(ct270RepairHome,ms);
window.__ctR270Test={repairSeriesWatch:ct270RepairSeriesWatch,repairHome:ct270RepairHome,adoptCanonicalHistory:ct270AdoptCanonicalHistory,showHistoryShell:ct270ShowHistoryShell,rowForAction:ct270RowForAction};
/* CT270_HOME_REAL_DOM_END */`;
js=replaceOnce(js,'\nboot();','\n'+runtime+'\nboot();','boot insertion');

css+=`\n/* CineTracker Web 1.0.61 r270 — real production Home DOM. Inline important styles are also applied by runtime. */
[data-home-view="series"] .media-row.ct270-watch-host{position:relative!important;padding-right:52px!important;box-sizing:border-box!important}
[data-home-view="series"] .media-row.ct270-watch-host>.ct270-inline-watch-action{position:absolute!important;right:10px!important;left:auto!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;margin:0!important;width:28px!important;min-width:28px!important;max-width:28px!important;height:28px!important;min-height:28px!important;max-height:28px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;flex:0 0 28px!important;z-index:9!important;line-height:1!important}
`;
html=html.replaceAll('app-v269.js','app-v270.js').replaceAll('app-v269.css','app-v270.css');
sw=sw.replaceAll('ct-web-1.0.60-r269','ct-web-1.0.61-r270').replaceAll('app-v269.js','app-v270.js').replaceAll('app-v269.css','app-v270.css');
const release={version:'1.0.61',revision:'r270-official-1.0.61',base:'r269-production',home_history_source:'cinetracker_profile_home_payload_v0997_r5',home_history_restored:true,home_history_first:true,home_series_watch_direct_child:true,home_series_watch_inline_right:true,discover:'r269-preserved',detail:'r269-preserved',sports:'r269-preserved',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v270.js'),js,'utf8'),writeFile(resolve(dist,'app-v270.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v269.js'),{force:true}),rm(resolve(dist,'app-v269.css'),{force:true})]);
console.log('WEB_R270_READY history=r5-real watch=real-dom-direct-child-right frozen=r269');
