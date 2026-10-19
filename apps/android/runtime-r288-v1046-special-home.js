/* Android 1.0.46/r288 — restore all three special Home rows; scoped r263 module. */
(()=>{
'use strict';
if(window.__ctR288HomeV1046)return;
window.__ctR288HomeV1046='three-special-rows+compact-quick-watch+retain-on-sync-failure';
const kinds=['ufc','wwe','f1'],snapshots={ufc:null,wwe:null,f1:null};
const show=()=>route263()==='home'&&homeActiveTab158==='series'&&!!(session?.user?.id||user?.id);
const root=()=>homeView263('series');
function retain(){
 for(const kind of kinds){
  const row=special263.current[kind];
  if(row?.series)snapshots[kind]=row;
  else if(snapshots[kind]?.series)special263.current[kind]=snapshots[kind];
 }
}
function readyEvent(data){
 const events=rows263(data?.events).filter(e=>e?.released!==false&&e?.is_watched!==true&&
  num263(e?.episode_number)>0&&(!e.starts_at||Date.parse(e.starts_at)<=Date.now()+60000));
 const selected=num263(data?.series?.next_episode_number||data?.series?.next_episode);
 return events.find(e=>num263(e.episode_number)===selected)||
  events.sort((a,b)=>Date.parse(a?.starts_at||0)-Date.parse(b?.starts_at||0))[0]||null;
}
function fallbackCard(kind){
 const title=specialCfg263[kind].title;
 const safe=esc263(title);
 return '<div class="media-row ct263-special ct288-special" data-ct263-special="'+kind+
  '" data-ct288-special="'+kind+'" role="button" tabindex="0"><div class="thumb"></div>'+
  '<div class="ct288-info"><b>'+safe+'</b><small>Sincronização pendente — toque para abrir a série</small></div>'+
  '<span class="badge">›</span></div>';
}
function realCard(kind,data){
 const raw=specialCard263(kind,data);
 if(!readyEvent(data))return raw.replace('class="media-row ct263-special"','class="media-row ct263-special ct288-special" data-ct288-special="'+kind+'"');
 const label=kind==='f1'?'Marcar sessão da Fórmula 1 como assistida':kind==='wwe'?'Marcar evento WWE como assistido':'Marcar evento UFC como assistido';
 return raw.replace('class="media-row ct263-special"','class="media-row ct263-special ct288-special" data-ct288-special="'+kind+'"')
  .replace('<span class="badge">›</span></div>',
   '<button type="button" class="ct286-quick ct288-quick" data-ct286-special-quick="'+kind+
   '" aria-label="'+label+'" title="'+label+'">✓</button><span class="badge">›</span></div>');
}
let painting=false;
mountSpecial263=function(){
 if(!show())return false;
 if(painting)return false;
 painting=true;
 try{
  retain();
  const view=root();if(!view)return false;
  // Remove only the three old special presentations, not ordinary series.
  for(const node of Array.from(view.querySelectorAll('.ct286-special-holder,[data-ct263-special]'))){
   const section=node.closest('section');node.remove();if(section)recount263(section);
  }
  // A sync error never erases F1/WWE; if this is a fresh install, render
  // a neutral navigable row rather than guessing any watched count.
  let inserted=0;
  const ordered=[...kinds].sort((a,b)=>{
   const da=special263.current[a]||snapshots[a],db=special263.current[b]||snapshots[b];
   const ta=Date.parse(da?.series?.last_watched_at||da?.last_watched_at||'')||0;
   const tb=Date.parse(db?.series?.last_watched_at||db?.last_watched_at||'')||0;
   return tb-ta||kinds.indexOf(a)-kinds.indexOf(b);
  });
  for(const kind of ordered){
   const data=special263.current[kind]||snapshots[kind];
   const bucket=data?.series?.home_bucket==='continue'?'continue':
    data?.series?.home_bucket==='up_to_date'?'up_to_date':
    data?.series?.available_episodes>0?'continue':'continue';
   const panel=specialPanel263(bucket)||specialPanel263('continue')||specialPanel263('up_to_date');
   const stack=panel?.querySelector(':scope > .stack');
   if(!stack)continue;
   // Keep normal series at their natural original sorting; do not pin the
   // special cards to the first rows unconditionally.
   stack.querySelector(':scope > .empty')?.remove();
   stack.insertAdjacentHTML('beforeend',data?.series?realCard(kind,data):fallbackCard(kind));
   recount263(panel);inserted++;
  }
  document.documentElement.dataset.ct288HomeRows=String(inserted);
  return inserted===3;
 }finally{painting=false}
};
// Restore after any sync error, including the r286 routine which previously
// set UFC/WWE to null before receiving new server data.
// r286 keeps its syncHomeEvents function PRIVATE inside a nested IIFE.
// The visible r263 loadCurrentSpecial263 hook below restores snapshots
// even when that private sync sets UFC/WWE to null.
const originalLoad=loadCurrentSpecial263;
loadCurrentSpecial263=async function(force=false){
 const result=await originalLoad(force);
 retain();if(show())mountSpecial263();
 return result;
};
// This explicit selector overrides the old page-wide button styling.
const css=document.createElement('style');
css.id='ct288-special-compact';
css.textContent=[
 '[data-home] .ct288-special{display:grid!important;grid-template-columns:52px minmax(0,1fr) auto auto!important;align-items:center!important;gap:9px!important;min-height:64px!important;width:100%!important;box-sizing:border-box!important}',
 '[data-home] .ct288-special>.thumb{width:48px!important;height:68px!important;min-width:48px!important;max-width:48px!important}',
 '[data-home] .ct288-special>div:nth-child(2){min-width:0!important;overflow:hidden!important}',
 '[data-home] .ct288-special>div:nth-child(2)>small,[data-home] .ct288-special>div:nth-child(2)>b{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}',
 '[data-home] .ct288-special>.ct288-quick{display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:36px!important;max-width:36px!important;min-width:36px!important;height:36px!important;max-height:36px!important;min-height:36px!important;flex:0 0 36px!important;margin:0!important;padding:0!important;font-size:16px!important;line-height:1!important;overflow:hidden!important;align-self:center!important;border-radius:9px!important}',
 '[data-home] .ct288-special>.badge{width:24px!important;min-width:24px!important;justify-self:end!important}',
 '@media(max-width:420px){[data-home] .ct288-special{grid-template-columns:45px minmax(0,1fr) 36px 17px!important;gap:6px!important}[data-home] .ct288-special>.thumb{width:42px!important;min-width:42px!important;height:62px!important}}'
].join('\n');
document.head.appendChild(css);
window.__ctR288HomeTest={retain,readyEvent,realCard,fallbackCard,mount:()=>mountSpecial263(),snapshots};
})();