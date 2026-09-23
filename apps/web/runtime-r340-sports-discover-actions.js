/* CineTracker Web 1.0.131 r340 — Sports sync on every open + exact Discover action geometry on every tab. */
(()=>{
'use strict';
if(window.__ctR340?.version==='1.0.131')return;
window.__ctR340Marker='sports-every-open-auth-retry+discover-all-tabs-exact-card-width';
window.__ctR340Sports='warm-existing+force-provider-sync-every-open+auth-retry+refresh-payload';
window.__ctR340Discover='all-action-rows=measured-poster-width+equal-flex+nowrap+no-slack';
window.__ctR340Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const imp=(el,k,v)=>el?.style?.setProperty?.(k,v,'important');
const wait340=ms=>new Promise(r=>setTimeout(r,ms));
let testBridge340=window.__ctR340TestBridge||null,sportsOpenTask340=null,discoverRaf340=0,discoverObserver340=null,discoverObserved340=null;

/* Sports: every real page open warms cached DB data immediately, then forces provider refresh in background.
   Authentication can still be settling during boot, so authorization/session failures are retried. */
const baseLoadSports340=typeof loadSports255==='function'?loadSports255:null;
function day340(offset=0){
 const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
 return y+'-'+m+'-'+day;
}
async function loadSports340(force=false){
 if(testBridge340?.load)return testBridge340.load(!!force);
 if(!baseLoadSports340)return null;
 return baseLoadSports340(!!force);
}
async function syncSportsWindow340(from,to){
 if(testBridge340?.sync)return testBridge340.sync(from,to,true);
 if(typeof SUPABASE_URL==='undefined'||typeof authHeaders!=='function')throw new Error('sports auth pending');
 const headers=authHeaders()||{};
 const auth=String(headers.Authorization||headers.authorization||'');
 if(!/^Bearer\s+\S+/i.test(auth))throw new Error('sports auth pending');
 const r=await fetch(SUPABASE_URL+'/functions/v1/ct-sports-sync',{
  method:'POST',headers:{...headers,'content-type':'application/json'},
  body:JSON.stringify({action:'sync',date_from:from,date_to:to,force:true})
 });
 if(!r.ok){const body=await r.text().catch(()=> '');const e=new Error('sports sync '+r.status+' '+body.slice(0,160));e.status=r.status;throw e}
 return r.json().catch(()=>({ok:true}));
}
function retryableSports340(err){
 const status=n(err?.status),msg=String(err?.message||err||'').toLowerCase();
 return status===0||status===401||status===403||status===408||status===425||status===429||status>=500||/auth|session|network|fetch|timeout|pending/.test(msg);
}
async function syncSportsOnOpen340(){
 if(sportsOpenTask340)return sportsOpenTask340;
 sportsOpenTask340=(async()=>{
  document.documentElement.dataset.ct340Sports='warming';
  try{await loadSports340(false)}catch{}
  const delays=[0,220,550,1100,2200,3800];
  let synced=false,lastError=null;
  for(let i=0;i<delays.length&&!synced;i++){
   if(delays[i])await wait340(delays[i]);
   try{
    await syncSportsWindow340(day340(-3),day340(-1));
    await syncSportsWindow340(day340(0),day340(2));
    synced=true;
   }catch(e){lastError=e;if(!retryableSports340(e))break}
  }
  if(synced){
   try{await loadSports340(true)}catch{}
   if(routeNow()==='sports'&&typeof paintSports255==='function'){try{paintSports255()}catch{}}
   document.documentElement.dataset.ct340Sports='synced';
  }else{
   document.documentElement.dataset.ct340Sports='failed';
   document.documentElement.dataset.ct340SportsError=String(lastError?.message||lastError||'unknown').slice(0,120);
  }
  return synced;
 })();
 return sportsOpenTask340;
}
function startSportsEveryOpen340(){
 setTimeout(()=>void syncSportsOnOpen340(),80);
}
startSportsEveryOpen340();
window.addEventListener('pageshow',e=>{if(e.persisted){sportsOpenTask340=null;startSportsEveryOpen340()}},{passive:true});

/* Discover: one geometry contract for ForYou, Top 10 and all public tabs.
   Combined action width must equal the rendered poster/card width, with no wrap, overflow or unused tail space. */
const ACTION_ROWS_340='.ct336-actions,.ct329-actions,.ct328-actions,.ct309-actions,.ct319-actions';
const OWNER_340='.ct336-slot,[data-ct319-item],.ct329-slot,.ct328-slot,.ct309-slot,.ct329-daily,.ct328-daily,.ct309-daily';
function ownerForRow340(row){return row?.closest?.(OWNER_340)||row?.parentElement||null}
function cardForRow340(row){
 const owner=ownerForRow340(row);if(!owner)return null;
 const selectors=[
  ':scope > .ct336-cardwrap .ct288-card',':scope > .ct336-cardwrap .ct288-poster',
  ':scope > .ct329-cardwrap .ct288-card',':scope > .ct328-cardwrap .ct288-card',':scope > .ct309-cardwrap .ct288-card',
  ':scope > .ct288-card',':scope > .ct288-poster','.ct288-card','.ct288-poster'
 ];
 for(const s of selectors){
  const el=q(s,owner),w=n(el?.getBoundingClientRect?.().width);
  if(w>40)return el;
 }
 return null;
}
function width340(el){const w=n(el?.getBoundingClientRect?.().width);return w>40?Math.round(w*1000)/1000:0}
function fixActionRow340(row){
 if(!row)return false;
 const buttons=qa(':scope > button',row);if(buttons.length<2||buttons.length>4)return false;
 const owner=ownerForRow340(row),card=cardForRow340(row),w=width340(card);if(!owner||!card||!w)return false;
 const px=w+'px';
 imp(row,'box-sizing','border-box');imp(row,'display','flex');imp(row,'flex-flow','row nowrap');
 imp(row,'align-items','stretch');imp(row,'justify-content','stretch');imp(row,'align-self','flex-start');
 imp(row,'width',px);imp(row,'min-width',px);imp(row,'max-width',px);
 imp(row,'height',buttons.length>=3?'28px':'30px');imp(row,'min-height',buttons.length>=3?'28px':'30px');imp(row,'max-height',buttons.length>=3?'28px':'30px');
 imp(row,'gap',buttons.length>=3?'3px':'4px');imp(row,'margin','5px 0 0');imp(row,'padding','0');
 imp(row,'position','static');imp(row,'inset','auto');imp(row,'transform','none');imp(row,'translate','none');
 imp(row,'overflow','hidden');imp(row,'direction','ltr');imp(row,'contain','layout paint');
 buttons.forEach((b,index)=>{
  imp(b,'box-sizing','border-box');imp(b,'display','flex');imp(b,'visibility','visible');
  imp(b,'position','static');imp(b,'inset','auto');imp(b,'left','auto');imp(b,'right','auto');imp(b,'top','auto');imp(b,'bottom','auto');
  imp(b,'transform','none');imp(b,'translate','none');imp(b,'rotate','none');imp(b,'scale','none');imp(b,'float','none');imp(b,'clear','none');
  imp(b,'flex','1 1 0px');imp(b,'flex-basis','0px');imp(b,'width','0');imp(b,'min-width','0');imp(b,'max-width','none');
  imp(b,'height',buttons.length>=3?'28px':'30px');imp(b,'min-height',buttons.length>=3?'28px':'30px');imp(b,'max-height',buttons.length>=3?'28px':'30px');
  imp(b,'margin','0');imp(b,'padding',buttons.length>=3?'1px 1px':'2px 4px');
  imp(b,'align-items','center');imp(b,'justify-content','center');imp(b,'align-self','stretch');
  imp(b,'grid-area','auto');imp(b,'grid-row','auto');imp(b,'grid-column','auto');imp(b,'order',String(index));
  imp(b,'font-size',buttons.length>=3?'7.1px':'9px');imp(b,'line-height','1');imp(b,'letter-spacing','-.08px');
  imp(b,'white-space','nowrap');imp(b,'overflow','hidden');imp(b,'text-overflow','ellipsis');imp(b,'pointer-events','auto');
 });
 row.dataset.ct340Width=String(w);row.dataset.ct340Actions=String(buttons.length);
 owner.dataset.ct340ActionsWidth=String(w);
 return true;
}
function fixDiscoverActions340(){
 if(routeNow()!=='discover')return false;
 const root=q('[data-ct319-discover]')||document;
 let fixed=0;for(const row of qa(ACTION_ROWS_340,root))if(fixActionRow340(row))fixed++;
 if(root?.dataset)root.dataset.ct340ActionRows=String(fixed);
 return fixed>0;
}
function queueDiscoverActions340(){
 cancelAnimationFrame(discoverRaf340);discoverRaf340=requestAnimationFrame(()=>fixDiscoverActions340());
}
function bindDiscoverObserver340(){
 if(routeNow()!=='discover'){discoverObserver340?.disconnect?.();discoverObserved340=null;return false}
 const content=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(!content)return false;
 if(content===discoverObserved340&&discoverObserver340)return true;
 discoverObserver340?.disconnect?.();discoverObserved340=content;
 if(window.MutationObserver){
  discoverObserver340=new MutationObserver(muts=>{if(muts.some(m=>m.addedNodes.length||m.removedNodes.length))queueDiscoverActions340()});
  discoverObserver340.observe(content,{subtree:true,childList:true});
 }
 queueDiscoverActions340();return true;
}
try{
 const baseRender340=renderDiscover;
 renderDiscover=function(){
  const out=baseRender340.apply(this,arguments);
  setTimeout(()=>{bindDiscoverObserver340();fixDiscoverActions340()},0);
  setTimeout(()=>fixDiscoverActions340(),160);
  return out;
 };
}catch{}
document.addEventListener('click',e=>{
 if(!e.target?.closest)return;
 if(e.target.closest('[data-ct319-tab],[data-ct319-type],[data-ct334-fy-kind],[data-ct336-fy-kind],[data-ct319-provider],[data-ct319-action],[data-ct336-action],[data-ct336-swap],[data-ct329-action],[data-ct329-swap]')){
  for(const ms of [0,120,360,900])setTimeout(()=>{bindDiscoverObserver340();fixDiscoverActions340()},ms);
 }
},true);
window.addEventListener('resize',queueDiscoverActions340,{passive:true});
window.addEventListener('orientationchange',queueDiscoverActions340,{passive:true});
setTimeout(()=>{if(routeNow()==='discover'){bindDiscoverObserver340();fixDiscoverActions340()}},0);
setTimeout(()=>{if(routeNow()==='discover')fixDiscoverActions340()},420);

const style=document.createElement('style');style.id='ct-web-r340';style.textContent=`
/* All Discover item actions: always one horizontal row exactly as wide as the poster/card. */
[data-ct319-discover] .ct319-actions,
[data-ct319-discover] .ct336-actions,
[data-ct319-discover] .ct329-actions,
[data-ct319-discover] .ct328-actions,
[data-ct319-discover] .ct309-actions{
 box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:stretch!important;
 justify-content:stretch!important;overflow:hidden!important;padding:0!important;transform:none!important;contain:layout paint!important
}
[data-ct319-discover] .ct319-actions>button,
[data-ct319-discover] .ct336-actions>button,
[data-ct319-discover] .ct329-actions>button,
[data-ct319-discover] .ct328-actions>button,
[data-ct319-discover] .ct309-actions>button{
 box-sizing:border-box!important;position:static!important;inset:auto!important;transform:none!important;float:none!important;
 flex:1 1 0px!important;flex-basis:0!important;width:0!important;min-width:0!important;max-width:none!important;
 margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
`;
document.head.appendChild(style);

window.__ctR340={
 version:'1.0.131',day:day340,syncSportsOnOpen:syncSportsOnOpen340,startSportsEveryOpen:startSportsEveryOpen340,
 fixDiscoverActions:fixDiscoverActions340,fixActionRow:fixActionRow340,bindDiscoverObserver:bindDiscoverObserver340,
 setTestBridge(v){testBridge340=v&&typeof v==='object'?v:null;sportsOpenTask340=null}
};
window.__ctR340Test={day340,retryableSports340,fixActionRow340,fixDiscoverActions340,cardForRow340,ownerForRow340,setTestBridge(v){testBridge340=v&&typeof v==='object'?v:null;sportsOpenTask340=null}};
})();
