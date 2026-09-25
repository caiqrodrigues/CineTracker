/* CineTracker Web 1.0.164 r373 — complete Home movie Watchlist + compact six-way sort. */
(()=>{
'use strict';
if(window.__ctR373?.version==='1.0.164')return;
window.__ctR373Marker='home-watchlist-full-v119+exact-count+compact-six-sort+dom-paging';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const PAGE_SIZE=80;
const state={rows:[],sort:'added_desc',visible:PAGE_SIZE,loaded:false,loading:false,open:false,at:0};
let task=null,paintToken=0;

const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const esc373=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idOf=x=>Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0;
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const addedMs=x=>{const n=Date.parse(x?.added_at||x?.created_at||'');return Number.isFinite(n)?n:0};
const releaseValue=x=>{
 const raw=String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'');
 const t=Date.parse(raw.length===4?raw+'-01-01':raw);return Number.isFinite(t)?t:0;
};
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const runtimeOf=x=>Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0;

function movieRows(payload){
 return rows(payload?.rows).filter(x=>String(x?.media_type||'')==='movie'&&idOf(x)>0);
}
function sortRows(list,mode=state.sort){
 const alpha=(a,b)=>titleOf(a).localeCompare(titleOf(b),'pt-BR',{sensitivity:'base',numeric:true});
 const out=[...rows(list)];
 if(mode==='added_desc')return out.sort((a,b)=>addedMs(b)-addedMs(a)||alpha(a,b));
 if(mode==='added_asc')return out.sort((a,b)=>addedMs(a)-addedMs(b)||alpha(a,b));
 if(mode==='release_desc')return out.sort((a,b)=>releaseValue(b)-releaseValue(a)||alpha(a,b));
 if(mode==='release_asc')return out.sort((a,b)=>releaseValue(a)-releaseValue(b)||alpha(a,b));
 if(mode==='za')return out.sort((a,b)=>alpha(b,a));
 return out.sort(alpha);
}
function section(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 return [...view.querySelectorAll(':scope > .home-section')].find(sec=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',sec)?.textContent||''))||null;
}
function rowHtml(x){
 const id=idOf(x),p=posterOf(x),year=String(x?.release_year||x?.release_date||x?.raw_tmdb?.release_date||'').slice(0,4),mins=runtimeOf(x);
 const poster=p?(/^https?:\/\//i.test(p)?p:(typeof window.img==='function'?window.img(p,'w154'):'https://image.tmdb.org/t/p/w154'+(String(p).startsWith('/')?'':'/')+p)):'';
 const meta=[year||'',mins?mins+' min':''].filter(Boolean).join(' · ');
 return '<div class="media-row ct373-watch-row" data-media="movie:'+id+'" data-ct373-watch-id="'+id+'">'+
   '<div class="thumb"'+(poster?' style="background-image:url(\''+esc373(poster)+'\')"':'')+'></div>'+
   '<div><b>'+esc373(titleOf(x))+'</b><small>'+esc373(meta)+'</small></div><span class="badge">›</span></div>';
}
function sortLabel(mode=state.sort){
 return ({added_desc:'Por último adicionado',added_asc:'Primeiro adicionado',release_desc:'Último lançado',release_asc:'Primeiro lançado',az:'A-Z',za:'Z-A'})[mode]||'Por último adicionado';
}
function optionsHtml(){
 const opts=[
  ['added_desc','Por último adicionado'],
  ['added_asc','Primeiro adicionado'],
  ['release_desc','Último lançado'],
  ['release_asc','Primeiro lançado'],
  ['az','A-Z'],
  ['za','Z-A']
 ];
 return opts.map(([k,l])=>'<button type="button" role="option" aria-selected="'+(state.sort===k)+'" class="ct373-sort-option'+(state.sort===k?' active':'')+'" data-ct373-sort="'+k+'">'+esc373(l)+'</button>').join('');
}
function paint(){
 if(routeNow()!=='home'||!state.loaded)return false;
 const sec=section();if(!sec)return false;
 const head=q('.panel-head',sec),stack=q('.stack',sec);if(!head||!stack)return false;
 const sorted=sortRows(state.rows,state.sort),visible=sorted.slice(0,state.visible);
 let tools=q('[data-ct373-tools]',head);
 if(!tools){
  const oldSmall=q(':scope > small',head);if(oldSmall)oldSmall.remove();
  tools=document.createElement('div');tools.className='ct373-watch-tools';tools.dataset.ct373Tools='1';head.appendChild(tools);
 }
 tools.innerHTML='<span class="ct373-count" data-ct373-count>'+state.rows.length.toLocaleString('pt-BR')+'</span>'+
  '<button type="button" class="ct373-sort-trigger" data-ct373-sort-trigger aria-label="Ordenar Watchlist" aria-haspopup="listbox" aria-expanded="'+state.open+'" title="'+esc373(sortLabel())+'">⇅</button>'+
  '<div class="ct373-sort-popover'+(state.open?' open':'')+'" data-ct373-sort-popover role="listbox" aria-label="Ordenar Watchlist">'+optionsHtml()+'</div>';
 stack.innerHTML=visible.length?visible.map(rowHtml).join(''):'<div class="empty">Nenhum filme na Watchlist.</div>';
 qa('[data-ct373-more]',sec).forEach(x=>x.remove());
 if(visible.length<sorted.length){
  const moreBtn=document.createElement('button');moreBtn.type='button';moreBtn.className='ct373-more';moreBtn.dataset.ct373More='1';
  moreBtn.innerHTML='Mostrar mais <small>'+visible.length.toLocaleString('pt-BR')+' de '+sorted.length.toLocaleString('pt-BR')+'</small>';
  moreBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();more()});
  stack.insertAdjacentElement('afterend',moreBtn);
 }
 sec.dataset.ct373Watchlist='full-v119';
 sec.dataset.ct373Total=String(state.rows.length);
 sec.dataset.ct373Sort=state.sort;
 sec.dataset.ct373Rendered=String(visible.length);
 return true;
}
async function loadFull(force=false){
 if(state.loading)return task;
 if(!force&&state.loaded&&Date.now()-state.at<60000)return state.rows;
 state.loading=true;
 task=(async()=>{
  const payload=await rpc('cinetracker_watchlist_full_v119',{});
  const all=movieRows(payload);
  state.rows=all;state.loaded=true;state.at=Date.now();state.visible=Math.min(Math.max(PAGE_SIZE,state.visible),Math.max(PAGE_SIZE,all.length));
  return all;
 })().finally(()=>{state.loading=false;task=null});
 return task;
}
async function hydrate(force=false){
 const token=++paintToken;
 try{await loadFull(force);if(token!==paintToken||routeNow()!=='home')return false;return paint()}catch{return false}
}
function setSort(mode){
 if(!['added_desc','added_asc','release_desc','release_asc','az','za'].includes(mode))return false;
 state.sort=mode;state.open=false;state.visible=PAGE_SIZE;paint();return true;
}
function toggleSort(){
 state.open=!state.open;paint();return state.open;
}
function more(){
 state.visible=Math.min(state.rows.length,state.visible+PAGE_SIZE);paint();return state.visible;
}
function invalidate(){
 state.loaded=false;state.at=0;state.rows=[];state.visible=PAGE_SIZE;
}

window.addEventListener('click',e=>{
 if(routeNow()!=='home')return;
 const trigger=e.target?.closest?.('[data-ct373-sort-trigger]');
 if(trigger){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();toggleSort();return}
 const opt=e.target?.closest?.('[data-ct373-sort]');
 if(opt){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();setSort(String(opt.dataset.ct373Sort||'added_desc'));return}
 if(state.open&&!e.target?.closest?.('[data-ct373-sort-popover]')){state.open=false;paint()}
},true);

function afterHomePaint(){if(routeNow()==='home')queueMicrotask(()=>void hydrate(false))}
try{
 const base=paintHome;paintHome=function(){const out=base.apply(this,arguments);afterHomePaint();return out};
}catch{}
try{
 const base=ct275PaintHome;ct275PaintHome=function(){const out=base.apply(this,arguments);afterHomePaint();return out};
}catch{}
try{
 const base=renderHome;renderHome=async function(){const out=await base.apply(this,arguments);await hydrate(false);return out};
}catch{}
window.addEventListener('cinetracker:data-changed',()=>{invalidate();if(routeNow()==='home')void hydrate(true)});
setTimeout(()=>{if(routeNow()==='home')void hydrate(false)},0);

const style=document.createElement('style');style.id='ct-web-r373';style.textContent=`
[data-home-view="movies"] .panel-head{position:relative}
.ct373-watch-tools{margin-left:auto;display:flex;align-items:center;gap:5px;position:relative;flex:0 0 auto}
.ct373-count{font-variant-numeric:tabular-nums;opacity:.72;font-size:12px;line-height:28px}
.ct373-sort-trigger{width:28px;height:28px;min-width:28px;min-height:28px;padding:0;display:grid;place-items:center;border:1px solid var(--line,#273746);border-radius:8px;background:rgba(10,20,28,.72);color:inherit;cursor:pointer;font-size:15px;line-height:1}
.ct373-sort-trigger:hover,.ct373-sort-trigger:focus-visible{border-color:#4b8098;background:rgba(18,38,50,.94);outline:none}
.ct373-sort-popover{display:none;position:absolute;z-index:40;right:0;top:34px;width:188px;padding:5px;background:#09141b;border:1px solid var(--line,#273746);border-radius:10px;box-shadow:0 14px 38px rgba(0,0,0,.38)}
.ct373-sort-popover.open{display:flex;flex-direction:column;gap:2px}
.ct373-sort-option{display:flex;width:100%;height:30px;align-items:center;padding:0 9px;border:0;border-radius:7px;background:transparent;color:inherit;text-align:left;font-size:11px;white-space:nowrap;cursor:pointer}
.ct373-sort-option:hover,.ct373-sort-option.active{background:rgba(61,120,146,.22)}
.ct373-more{display:flex;width:100%;height:32px;margin:5px 0 0;align-items:center;justify-content:center;gap:6px;border:1px solid var(--line,#273746);border-radius:9px;background:transparent;color:inherit;cursor:pointer;font-size:11px}
.ct373-more small{opacity:.58}
`;document.head.appendChild(style);

window.__ctR373={version:'1.0.164',loadFull,hydrate,paint,setSort,toggleSort,more,invalidate,sortRows,get state(){return state}};
window.__ctR373Test={movieRows,sortRows,setSort,more,paint,loadFull,setRows(v){state.rows=rows(v);state.loaded=true;state.at=Date.now();state.visible=PAGE_SIZE},get state(){return state}};
})();