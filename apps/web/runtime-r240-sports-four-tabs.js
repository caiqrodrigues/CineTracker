/* CineTracker Web 1.0.32 r240 — Sports has only Próximos, Anteriores, Favoritos and Assistidos. */
(()=>{
'use strict';
if(window.__ctR240)return;
window.__ctR240='sports-four-data-authority';
window.__ctR240Sports='next-today-only+previous-last-3-days+favorites-only+watched';

const R240_TABS=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
const r240Now=()=>window.__ctR240Now?new Date(window.__ctR240Now):new Date();
const r240DayStart=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const r240Shift=(d,n)=>{const x=r240DayStart(d);x.setDate(x.getDate()+n);return x};
const r240Limit=()=>Math.max(120,Number(typeof SPORT_PAGE_SIZE!=='undefined'?SPORT_PAGE_SIZE:24)*6);
const r240Text=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

let legacyTabsHtml240='';
try{legacyTabsHtml240=String(sportsTabs())}catch{}
function legacyWatchedKey240(){
 try{
  const host=document.createElement('div');host.innerHTML=legacyTabsHtml240;
  const b=[...host.querySelectorAll('[data-sport-tab]')].find(x=>r240Text(x.textContent)==='assistidos');
  return b?.dataset?.sportTab||'watched';
 }catch{return'watched'}
}
const LEGACY_WATCHED_KEY_240=legacyWatchedKey240();
const legacyPayload240=typeof sportsPayload==='function'?sportsPayload:null;
const legacyFiltered240=typeof sportsFiltered==='function'?sportsFiltered:null;

async function withLegacyTab240(fn,key,arg){const old=sportsState.tab;sportsState.tab=key;try{return await fn(arg)}finally{sportsState.tab=old}}
function withLegacyFilter240(fn,key,arg){const old=sportsState.tab;sportsState.tab=key;try{return fn(arg)}finally{sportsState.tab=old}}
function r240StartMs(x){try{return Number(sportStartMs(x)||0)}catch{return Number(new Date(x?.starts_at||x?.start_time||x?.date||0).getTime()||0)}}
function r240Ended(x){try{return Boolean(sportEnded(x))}catch{const s=r240Text(x?.status||'');return ['ended','finished','final','encerrado','finalizado'].some(v=>s.includes(v))}}
function r240Search(rows){const query=r240Text(sportsState.query||'');if(!query)return rows;return (rows||[]).filter(x=>r240Text([x?.title,x?.home_name,x?.away_name,x?.competition_name,x?.league_name,x?.sport_name].filter(Boolean).join(' ')).includes(query))}
function r240Unique(rows){const out=[],seen=new Set();for(const x of rows||[]){const k=String(x?.event_id||x?.id||`${x?.provider||''}|${x?.starts_at||''}|${x?.home_name||''}|${x?.away_name||''}|${x?.title||''}`);if(seen.has(k))continue;seen.add(k);out.push(x)}return out}

sportsTabs=function(){
 if(!R240_TABS.some(([k])=>k===sportsState.tab))sportsState.tab='next';
 return R240_TABS.map(([k,l])=>`<button class="chip ${sportsState.tab===k?'active':''}" data-sport-tab="${k}">${l}</button>`).join('');
};

sportsPayload=async function(){
 if(!R240_TABS.some(([k])=>k===sportsState.tab))sportsState.tab='next';
 if(sportsState.tab==='next')return rpc('cinetracker_sports_events_v0997',{p_scope:'today',p_limit:r240Limit(),p_offset:0,p_favorite_only:false});
 if(sportsState.tab==='previous'){
  const [month,yesterday]=await Promise.all([
   rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:r240Limit(),p_offset:0,p_favorite_only:false}).catch(()=>[]),
   rpc('cinetracker_sports_events_v0997',{p_scope:'yesterday',p_limit:r240Limit(),p_offset:0,p_favorite_only:false}).catch(()=>[])
  ]);
  return r240Unique([...(Array.isArray(month)?month:[]),...(Array.isArray(yesterday)?yesterday:[])]);
 }
 if(sportsState.tab==='favorites')return rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:r240Limit(),p_offset:0,p_favorite_only:true});
 if(sportsState.tab==='watched'&&legacyPayload240)return withLegacyTab240(legacyPayload240,LEGACY_WATCHED_KEY_240);
 return [];
};

sportsFiltered=function(rows){
 const list=Array.isArray(rows)?rows:[];
 if(sportsState.tab==='watched'&&legacyFiltered240)return withLegacyFilter240(legacyFiltered240,LEGACY_WATCHED_KEY_240,list);
 if(sportsState.tab==='favorites')return r240Search(list);
 const now=r240Now(),today=r240DayStart(now),tomorrow=r240Shift(now,1),threeDaysAgo=r240Shift(now,-3);
 let out=list;
 if(sportsState.tab==='next')out=list.filter(x=>{const ms=r240StartMs(x);return ms>=now.getTime()&&ms<tomorrow.getTime()&&ms>=today.getTime()&&!r240Ended(x)}).sort((a,b)=>r240StartMs(a)-r240StartMs(b));
 if(sportsState.tab==='previous')out=list.filter(x=>{const ms=r240StartMs(x);return ms>=threeDaysAgo.getTime()&&ms<today.getTime()&&(r240Ended(x)||ms<now.getTime())}).sort((a,b)=>r240StartMs(b)-r240StartMs(a));
 return r240Search(out);
};

function tuneSports240(){
 const root=document.querySelector('[data-sports]');if(!root)return;
 const tabLabels=[...root.querySelectorAll('[data-sport-tab]')].map(x=>x.textContent.trim());
 root.dataset.ct240Tabs=tabLabels.join('|');
 const grid=root.querySelector('.event-grid');const panel=grid?.closest?.('section,.panel,article')||grid?.parentElement;const h=panel?.querySelector?.('h1,h2,h3');
 if(h){const title={next:'Próximos de hoje',previous:'Anteriores · últimos 3 dias',favorites:'Jogos dos favoritos',watched:'Assistidos'}[sportsState.tab];if(title)h.textContent=title}
 root.dataset.ct240Sports='four-data-tabs';
}
try{const prior=renderSports;renderSports=async function(...a){if(!R240_TABS.some(([k])=>k===sportsState.tab))sportsState.tab='next';const out=await prior.apply(this,a);tuneSports240();return out}}catch{}
try{const prior=paintSports;paintSports=function(...a){const out=prior.apply(this,a);setTimeout(tuneSports240,0);return out}}catch{}

window.__ctR240Filter=(rows,tab,now)=>{const oldTab=sportsState.tab,oldNow=window.__ctR240Now;try{sportsState.tab=tab;window.__ctR240Now=new Date(now).toISOString();return sportsFiltered(rows)}finally{sportsState.tab=oldTab;if(oldNow===undefined)delete window.__ctR240Now;else window.__ctR240Now=oldNow}};
window.__ctR240LegacyWatchedKey=LEGACY_WATCHED_KEY_240;
})();