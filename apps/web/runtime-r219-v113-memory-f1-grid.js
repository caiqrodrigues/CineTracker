/* CineTracker 1.0.13 — persistent Pra Voce memory + collapsible F1 Hub + starting grid. */
(()=>{
'use strict';
if(window.__ctR219V113)return;
window.__ctR219V113='persistent-foryou-memory-f1-collapse-grid';
window.__ctV113ForYou='supabase-direct-memory-score-gt-7.8-year-gt-1990-no-bad-genres-no-fill';
window.__ctV113Memory='fresh-never-repeat-watchlist-30d-swapped-never-return-cross-device';
window.__ctV113F1='collapsible-hub-next-qualifying-grid';

const q113=(s,r=document)=>r?.querySelector?.(s)||null;
const qa113=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n113=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const esc113=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slot113=['fresh:movie','fresh:series','fresh:anime','watchlist:movie','watchlist:series','watchlist:anime'];
let mem113=[],mem113At=0,mem113Task=null,shownSession113=new Set();

function type113(x){try{return mediaType(x)==='movie'?'movie':'tv'}catch{return x?.media_type==='movie'?'movie':'tv'}}
function id113(x){try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}}
function year113(x){return Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}
function score113(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0}
function genres113(x){try{return [...new Set((genreIds158(x)||x?.genre_ids||x?.raw_tmdb?.genre_ids||[]).map(Number).filter(Boolean))]}catch{return (x?.genre_ids||[]).map(Number)}}
function anime113(x){try{return isAnime158(x)}catch{const g=genres113(x),c=x?.origin_country||x?.raw_tmdb?.origin_country||[];return type113(x)==='tv'&&(g.includes(16)||c.includes('JP'))}}
function badGenre113(x){const g=genres113(x);return g.includes(99)||g.includes(18)||g.includes(10766)}
function dorama113(x){if(type113(x)!=='tv'||anime113(x))return false;const c=x?.origin_country||x?.raw_tmdb?.origin_country||[];return ['KR','CN','TW','HK','JP','TH'].some(k=>c.includes(k))}
function quality113(x){return Boolean(x&&id113(x)>0&&score113(x)>7.8&&year113(x)>1990&&!badGenre113(x)&&!dorama113(x))}

async function loadMem113(force=false){
 if(!force&&Date.now()-mem113At<15000)return mem113;if(mem113Task)return mem113Task;
 mem113Task=Promise.resolve(rpc('cinetracker_recommendation_memory_v113',{})).then(r=>{mem113=Array.isArray(r)?r:[];mem113At=Date.now();return mem113}).catch(()=>mem113).finally(()=>mem113Task=null);return mem113Task;
}
function memBlocked113(slot,id){
 const rows=mem113.filter(r=>String(r.slot)===slot&&n113(r.tmdb_id)===n113(id));if(!rows.length)return false;
 if(rows.some(r=>String(r.action)==='swapped'))return true;
 if(slot.startsWith('fresh:'))return rows.some(r=>String(r.action)==='shown');
 const cut=Date.now()-30*86400000;return rows.some(r=>String(r.action)==='shown'&&Date.parse(r.shown_at||0)>=cut);
}
function memoryEligible113(x,slot){return quality113(x)&&!memBlocked113(slot,id113(x))}
function filter113(rows,slot){return (Array.isArray(rows)?rows:[]).filter(x=>memoryEligible113(x,slot))}
function bag113(b,prefix){if(!b||typeof b!=='object')return b;return {...b,movie:filter113(b.movie,`${prefix}:movie`),series:filter113(b.series,`${prefix}:series`),anime:filter113(b.anime,`${prefix}:anime`)}}
function filterData113(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return data;const o={...data};
 for(const k of ['_ct186_fresh','_ct186_reserve','_ct186_fallback','_ct166_fresh','_ct186Fresh'])if(o[k])o[k]=bag113(o[k],'fresh');
 for(const k of ['_ct186_watchlist','_ct166_watchlist'])if(o[k])o[k]=bag113(o[k],'watchlist');
 for(const [k,s] of [['movie','fresh:movie'],['series','fresh:series'],['anime','fresh:anime'],['fresh_movie','fresh:movie'],['fresh_series','fresh:series'],['fresh_anime','fresh:anime'],['watchlist_movie','watchlist:movie'],['watchlist_series','watchlist:series'],['watchlist_anime','watchlist:anime']])if(o[k]){const a=Array.isArray(o[k])?filter113(o[k],s):filter113([o[k]],s);o[k]=Array.isArray(o[k])?a:(a[0]||null)}
 if(o.daily&&!memoryEligible113(o.daily,'fresh:movie'))o.daily=null;
 return o;
}

/* Replace old 7.5 / fallback behavior with the exact 1.0.13 contract. */
try{ct186BadGenre=badGenre113;ct186Quality=quality113}catch{}
try{
 ct186Select=function(data){
  const d=filterData113(data||{}),f=d?._ct186_fresh||{movie:[],series:[],anime:[]},w=d?._ct186_watchlist||{movie:[],series:[],anime:[]},used=new Set();
  const usable=(rows,slot)=>(rows||[]).filter(x=>memoryEligible113(x,slot)&&!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)));
  const take=(rows,slot,key)=>{const a=usable(rows,slot);if(!a.length)return null;const idx=typeof ct166SwapIndex!=='undefined'?Math.max(0,Number(ct166SwapIndex[key]||0)):0,x=a[idx%a.length]||a[0];if(x)used.add(ct186Key(x));return x};
  const daily=take(f.movie,'fresh:movie','daily:movie');
  const wm=take(w.movie,'watchlist:movie','watchlist:movie'),ws=take(w.series,'watchlist:series','watchlist:series'),wa=take(w.anime,'watchlist:anime','watchlist:anime');
  const fm=take(f.movie,'fresh:movie','fresh:movie'),fs=take(f.series,'fresh:series','fresh:series'),fa=take(f.anime,'fresh:anime','fresh:anime');
  return{daily,wm,ws,wa,fm,fs,fa,wmPool:usable(w.movie,'watchlist:movie'),wsPool:usable(w.series,'watchlist:series'),waPool:usable(w.anime,'watchlist:anime'),used};
 };
}catch{}
try{const base113=discoverRows;discoverRows=async function(tab){if(String(tab)==='foryou')await loadMem113(true);const d=await base113(tab);return String(tab)==='foryou'?filterData113(d):d}}catch{}
try{const baseSel113=ct186Select;ct186Select=function(data){return baseSel113(filterData113(data))}}catch{}

function localRecord113(slot,id,type,action){mem113.unshift({slot,tmdb_id:n113(id),media_type:type,action,shown_at:new Date().toISOString()});mem113At=Date.now()}
async function record113(slot,id,type,action='shown'){
 if(!slot113.includes(slot)||!(n113(id)>0))return;const k=`${slot}:${id}:${action}`;if(action==='shown'&&shownSession113.has(k))return;if(action==='shown')shownSession113.add(k);
 localRecord113(slot,id,type,action);
 for(let i=0;i<2;i++){try{await rpc('cinetracker_recommendation_record_v113',{p_tmdb_id:n113(id),p_media_type:type,p_slot:slot,p_action:action});return}catch(e){if(i===1){try{console.warn('ct113 memory record failed',e)}catch{}}else await new Promise(r=>setTimeout(r,250))}}
}
function scan113(){for(const el of qa113('[data-ct241-slot-key],.ct166-slot,.foryou-slot')){const slot=String(el.dataset?.ct241SlotKey||el.dataset?.ct166Slot||'');if(!slot113.includes(slot))continue;const raw=String(q113('[data-media]',el)?.dataset?.media||''),[type,id]=raw.split(':');if(n113(id)>0)void record113(slot,n113(id),type==='movie'?'movie':'tv','shown')}}
try{const p113=paintDiscover;paintDiscover=function(...a){const out=p113.apply(this,a);requestAnimationFrame(scan113);return out}}catch{}
try{const swapBase113=swapNow237;swapNow237=function(button){const el=button?.closest?.('[data-ct241-slot-key],.ct166-slot,.foryou-slot'),slot=String(el?.dataset?.ct241SlotKey||button?.dataset?.ct237Swap||''),raw=String(q113('[data-media]',el)?.dataset?.media||''),[type,id]=raw.split(':');if(slot113.includes(slot)&&n113(id)>0)void record113(slot,n113(id),type==='movie'?'movie':'tv','swapped');const out=swapBase113(button);requestAnimationFrame(scan113);return out};try{window.__ctR237SwapNow=swapNow237}catch{}}catch{}
window.__ctV113FilterForYou=filterData113;window.__ctV113MemoryBlocked=memBlocked113;window.__ctV113Quality=quality113;

/* F1 Hub collapse + next-race starting grid. */
let gridActive113=false,gridTask113=null;
const collapseKey113='ct:v113:f1:collapsed';
function f1Race113(x){return x?.MRData?.RaceTable?.Races?.[0]||{}}
function driver113(d){return `${d?.givenName||''} ${d?.familyName||''}`.trim()}
function applyCollapse113(hub){const c=localStorage.getItem(collapseKey113)==='1';hub.classList.toggle('ct113-f1-collapsed',c);const b=q113('[data-ct113-f1-toggle]',hub);if(b){b.textContent=c?'Expandir':'Recolher';b.setAttribute('aria-expanded',String(!c))}}
function enhanceF1113(){
 const hub=q113('#ct-f1-v111');if(!hub)return;
 const head=q113('.ct111-f1-head',hub),tabs=q113('.ct111-f1-tabs',hub);if(!head||!tabs)return;
 if(!q113('[data-ct113-f1-toggle]',head)){const b=document.createElement('button');b.type='button';b.className='btn ct113-f1-toggle';b.dataset.ct113F1Toggle='1';head.appendChild(b)}
 if(!q113('[data-ct113-f1-grid]',tabs)){const b=document.createElement('button');b.type='button';b.dataset.ct113F1Grid='1';b.textContent='Grid de largada';tabs.appendChild(b)}
 applyCollapse113(hub);if(gridActive113&&!q113('[data-ct113-grid-rendered]',hub))void renderGrid113(hub);
}
async function renderGrid113(hub=q113('#ct-f1-v111')){
 if(!hub||gridTask113)return gridTask113;const body=q113('[data-ct111-f1-body]',hub);if(!body)return;body.innerHTML='<div class="loader">Carregando grid de largada...</div>';
 gridTask113=(async()=>{try{const d=await edge('cinetracker-f1-v1',{season:new Date().getFullYear()},30000),r=f1Race113(d?.nextQualifying),rows=r?.QualifyingResults||[];if(!rows.length){body.innerHTML='<div class="ct111-f1-card" data-ct113-grid-rendered><h3>Grid de largada</h3><div class="empty">Ainda não disponível. O grid aparecerá após a classificação do próximo GP.</div></div>';return}body.innerHTML=`<div class="ct111-f1-card" data-ct113-grid-rendered><h3>Grid de largada · ${esc113(d?.next?.raceName||r?.raceName||'Próximo GP')}</h3>${rows.slice().sort((a,b)=>n113(a.position)-n113(b.position)).map(x=>`<div class="ct111-f1-row"><b>P${esc113(x.position||'')}</b><span>${esc113(driver113(x.Driver))}<small>${esc113(x.Constructor?.name||'')}</small></span><strong>${esc113(x.Q3||x.Q2||x.Q1||'')}</strong></div>`).join('')}</div>`}catch(e){body.innerHTML=`<div class="error" data-ct113-grid-rendered>Grid indisponível.<small>${esc113(e?.message||String(e))}</small></div>`}})().finally(()=>gridTask113=null);return gridTask113;
}
document.addEventListener('click',ev=>{const t=ev.target.closest?.('[data-ct113-f1-toggle]');if(t){ev.preventDefault();const hub=q113('#ct-f1-v111'),next=!(hub?.classList.contains('ct113-f1-collapsed'));localStorage.setItem(collapseKey113,next?'1':'0');if(hub)applyCollapse113(hub);return}const g=ev.target.closest?.('[data-ct113-f1-grid]');if(g){ev.preventDefault();gridActive113=true;for(const b of qa113('#ct-f1-v111 [data-ct111-f1]'))b.classList.remove('active');g.classList.add('active');void renderGrid113();return}if(ev.target.closest?.('#ct-f1-v111 [data-ct111-f1]'))gridActive113=false},true);
let mo113Timer=0;try{new MutationObserver(()=>{clearTimeout(mo113Timer);mo113Timer=setTimeout(enhanceF1113,25)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}

const st113=document.createElement('style');st113.id='ct-v113-f1';st113.textContent=`
#ct-f1-v111 .ct113-f1-toggle{margin-left:auto;align-self:flex-start;white-space:nowrap}
#ct-f1-v111.ct113-f1-collapsed .ct111-f1-tabs,#ct-f1-v111.ct113-f1-collapsed [data-ct111-f1-body]{display:none!important}
#ct-f1-v111.ct113-f1-collapsed .ct111-f1-head{margin-bottom:0!important}
`;
document.getElementById(st113.id)?.remove();document.head.appendChild(st113);requestAnimationFrame(enhanceF1113);

(function midnight113(){const now=new Date(),next=new Date(now);next.setHours(24,0,0,50);setTimeout(()=>{mem113At=0;shownSession113.clear();try{discoverCache?.clear?.()}catch{};try{ct186ForYouData=null;ct186ContextAt=0}catch{};if((()=>{try{return route()==='discover'&&discoverState?.tab==='foryou'}catch{return false}})())try{render()}catch{};midnight113()},Math.max(1000,+next-Date.now()))})();
})();
