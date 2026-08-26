(() => {
'use strict';
if (window.__ct98Loaded) return;
window.__ct98Loaded = true;
window.__ct98Version = '0.0.98';
const VERSION = '0.0.98';
const $98 = (s,r=document) => r.querySelector(s);
const $$98 = (s,r=document) => [...r.querySelectorAll(s)];
const esc98 = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img98 = (p,size='w500') => p ? `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}` : '';
const sleep98 = ms => new Promise(r=>setTimeout(r,ms));

const css98=document.createElement('style');
css98.id='ct98-style';
css98.textContent=`
.ct89-version,.ct90-version,.ct91-version,.ct92-version,.ct93-version,.ct94-version,.ct95-version,.ct54-version,.ct-version-footer,#ct56-version{display:none!important}
.ct98-version{text-align:center;color:#647887;font-size:11px;margin:28px 0 8px}
.ct98-tabs,.ct98-filters{display:flex;gap:8px;overflow:auto;padding:3px 0 12px;scrollbar-width:thin}
.ct98-tab,.ct98-filter{white-space:nowrap;border:1px solid #28455c;background:#0b151d;color:#dce8f1;border-radius:999px;padding:9px 13px;cursor:pointer}
.ct98-tab.active,.ct98-filter.active{background:linear-gradient(135deg,#153b56,#215f87);border-color:#55a8d9;color:white;box-shadow:0 0 24px #2187bd22}
.ct98-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.ct98-media{border:1px solid #203646;background:#0b1218;border-radius:14px;overflow:hidden;color:#fff;text-align:left;padding:0;cursor:pointer}
.ct98-media[disabled]{cursor:default;opacity:.78}
.ct98-poster{aspect-ratio:2/3;background:#101b23 center/cover no-repeat}
.ct98-body{padding:9px}.ct98-body b{display:block;font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct98-meta{font-size:10px;color:#8fa4b3;margin-top:5px}
.ct98-skeleton{min-height:360px;border-radius:14px;background:linear-gradient(110deg,#0e1820 20%,#172735 40%,#0e1820 60%);background-size:220% 100%;animation:ct98sh 1.2s linear infinite}@keyframes ct98sh{to{background-position:-220% 0}}
.ct98-profile{max-width:1060px;margin:0 auto;display:grid;gap:18px}
.ct98-mainstats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
.ct98-stat{border:1px solid #203b4e;background:linear-gradient(145deg,#091219,#0c1720);border-radius:13px;padding:10px;text-align:center;min-width:0}
.ct98-stat .l{font-size:9px;color:#8ea5b6;text-transform:uppercase;letter-spacing:.05em}.ct98-stat .v{font-size:17px;font-weight:800;margin-top:4px;line-height:1.2}.ct98-stat .s{font-size:9px;color:#7890a1;margin-top:3px}
.ct98-panel{border:1px solid #203b4e;background:radial-gradient(circle at 15% 0,#12304766,transparent 36%),linear-gradient(145deg,#071017,#0b151d);border-radius:16px;padding:14px;box-shadow:inset 0 1px 0 #ffffff08}
.ct98-panel-head{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:10px}.ct98-panel-head h3{margin:0}.ct98-panel-head small{color:#7890a1}
.ct98-tech-chart{height:240px;overflow:hidden;border-radius:12px;background:linear-gradient(180deg,#0c1d2a,#071018);position:relative}
.ct98-tech-chart:before{content:'';position:absolute;inset:0;background:linear-gradient(#3e76941a 1px,transparent 1px),linear-gradient(90deg,#3e76941a 1px,transparent 1px);background-size:100% 25%,10% 100%}
.ct98-tech-chart svg{position:absolute;inset:12px;width:calc(100% - 24px);height:calc(100% - 24px);overflow:visible}
.ct98-extra{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}
.ct98-history-block{display:grid;gap:16px}.ct98-carousel{display:grid;grid-auto-flow:column;grid-auto-columns:150px;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 1px 8px}
.ct98-history-card{scroll-snap-align:start;border:1px solid #203b4e;background:#0b1218;border-radius:12px;overflow:hidden;color:white;text-align:left;padding:0;cursor:pointer}
.ct98-history-card[disabled]{cursor:default}.ct98-history-poster{aspect-ratio:2/3;background:#101b23 center/cover no-repeat}.ct98-history-body{padding:8px}.ct98-history-body b{display:block;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct98-history-body small{font-size:9px;color:#8198a8}
.ct98-calendar{display:grid;gap:12px}.ct98-day{border:1px solid #203646;background:#091219;border-radius:13px;padding:12px}.ct98-day h3{margin:0 0 9px}.ct98-dayrow{display:grid;grid-auto-flow:column;grid-auto-columns:140px;gap:9px;overflow-x:auto}
.ct98-settings-card{border:1px solid #2a4b61;background:linear-gradient(145deg,#09131b,#0c1923);border-radius:14px;padding:14px;margin-top:10px}.ct98-settings-card h3{margin:0 0 5px}.ct98-settings-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.ct98-action{border:1px solid #32617f;background:#0c1a24;color:#f2f8fc;border-radius:12px;padding:13px;cursor:pointer;font-weight:700}.ct98-action:hover{border-color:#67b5e0}.ct98-status{font-size:11px;color:#91a7b6;margin-top:10px;min-height:16px}.ct98-hidden{display:none!important}
@media(max-width:900px){.ct98-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ct98-mainstats,.ct98-extra{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.ct98-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ct98-mainstats{grid-template-columns:repeat(2,minmax(0,1fr))}.ct98-extra{grid-template-columns:repeat(2,minmax(0,1fr))}.ct98-settings-actions{grid-template-columns:1fr}.ct98-tech-chart{height:205px}.ct98-carousel{grid-auto-columns:132px}}
`;
document.head.appendChild(css98);

function setView98(t){try{view=t}catch{}try{window.view=t}catch{}}
function footer98(){
  const host=$98('.content');
  if(!host)return;
  $$98('.ct98-version',host).slice(1).forEach(x=>x.remove());
  let f=$98('.ct98-version',host);
  if(!f){f=document.createElement('div');f.className='ct98-version';host.appendChild(f)}
  if(f.textContent!=='CineTracker • v0.0.98')f.textContent='CineTracker • v0.0.98';
  window.__ctAndroidBuild=VERSION;
}
function navButton98(v,label,active){return `<button data-view="${v}" class="${active===v?'active':''}">${label}</button>`}
function shell98(title,subtitle,content,active){
  return `<div class="app"><aside class="sidebar"><div class="logo">CINETRACKER</div><nav class="nav">${navButton98('home','⌂ Home',active)}${navButton98('discover','✦ Descobrir',active)}${navButton98('profile','◉ Perfil',active)}${navButton98('settings','⚙ Configurações',active)}</nav></aside><main class="content"><h1 class="ct54-title">${esc98(title)}</h1><p class="ct54-sub">${esc98(subtitle)}</p>${content}<nav class="mobile-nav">${navButton98('home','Home',active)}${navButton98('discover','Descobrir',active)}${navButton98('profile','Perfil',active)}${navButton98('settings','Config.',active)}</nav><div class="ct98-version">CineTracker • v0.0.98</div></main></div>`;
}
function normalizeNav98(){
  $$98('[data-view="history"],#nav_history').forEach(x=>x.remove());
  $$98('[data-view="home"]').forEach(b=>{if(/Início|Hoje/i.test(b.textContent||''))b.textContent=(b.closest('.mobile-nav')?'Home':'⌂ Home')});
  $$98('[data-view]').forEach(b=>{const t=b.dataset.view;if(!['home','discover','profile','settings'].includes(t))return;if(b.dataset.ct98Nav)return;b.dataset.ct98Nav='1';b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();navigate98(t)}});
  footer98();
}
function toast98(msg){
  const t=document.createElement('div');t.className='ct90-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
}
function fmt98(minutes){
  let h=Math.max(0,Math.floor(Number(minutes||0)/60)),months=Math.floor(h/720);h-=months*720;const days=Math.floor(h/24);h-=days*24;
  return `${months} ${months===1?'mês':'meses'} ${days} ${days===1?'dia':'dias'} ${h} ${h===1?'hora':'horas'}`;
}

const tmdbCache98=new Map();
async function api98(path,params={}){
  const idMatch=String(path).match(/^\/(?:movie|tv)\/(-?\d+)/);
  if(idMatch&&Number(idMatch[1])<=0)throw new Error('TMDB_ID_SUBSTITUTO');
  const key=path+'?'+new URLSearchParams(params);
  const hit=tmdbCache98.get(key);if(hit&&Date.now()-hit.t<10*60*1000)return hit.p;
  const p=(async()=>{const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()})();
  tmdbCache98.set(key,{t:Date.now(),p});p.catch(()=>tmdbCache98.delete(key));return p;
}
async function fetchAll98(path,page=1000,max=100000){
  const out=[];let offset=0;
  for(;;){const sep=path.includes('?')?'&':'?';const rows=await sbApi(`${path}${sep}limit=${page}&offset=${offset}`).catch(()=>[]);if(!Array.isArray(rows)||!rows.length)break;out.push(...rows);if(rows.length<page||out.length>=max)break;offset+=rows.length}
  return out;
}

function mediaCard98(x){
  const type=x.media_type==='movie'?'movie':'tv',date=x.release_date||x.first_air_date||'',id=Number(x.id||x.tmdb_id),clickable=id>0;
  return `<button class="ct98-media" data-open98 data-type="${type}" data-id="${id}" ${clickable?'':'disabled'}><div class="ct98-poster"${x.poster_path?` style="background-image:url('${img98(x.poster_path)}')"`:''}></div><div class="ct98-body"><b>${esc98(x.title||x.name||'Sem título')}</b><div class="ct98-meta">${type==='movie'?'FILME':'SÉRIE'} · ${String(date).slice(0,4)||x.release_year||'—'} · ★ ${Number(x.vote_average??x.raw_tmdb?.vote_average??0).toFixed(1)}</div></div></button>`;
}
function bindOpen98(root=document){
  $$98('[data-open98]',root).forEach(b=>{if(b.dataset.ct98Open)return;b.dataset.ct98Open='1';if(b.disabled)return;b.onclick=e=>{e.preventDefault();const type=b.dataset.type,id=Number(b.dataset.id);if(id>0)(window.ct92OpenMedia||window.ct91OpenMedia)?.(type,id)}});
}

let exclusions98=null,exclusionsAt98=0;
async function exclusionsForDiscover98(){
  if(exclusions98&&Date.now()-exclusionsAt98<5*60*1000)return exclusions98;
  const [hist,ov]=await Promise.all([sbRpc('cinetracker_profile_history_media',{p_limit_per_type:2000}).catch(()=>[]),fetchAll98('media_overrides?select=media_id,state')]);
  const set=new Set((Array.isArray(hist)?hist:[]).filter(x=>Number(x.tmdb_id)>0).map(x=>`${x.media_type}:${Number(x.tmdb_id)}`));
  const ids=[...new Set(ov.filter(x=>['AddedToWatchlist','AlreadySeen','Completed','InProgress','UpToDate','WatchLater'].includes(x.state)).map(x=>Number(x.media_id)).filter(Boolean))];
  for(let i=0;i<ids.length;i+=120){const rows=await sbApi(`media?select=id,tmdb_id,media_type&id=in.(${ids.slice(i,i+120).join(',')})`).catch(()=>[]);for(const m of rows||[])if(Number(m.tmdb_id)>0)set.add(`${m.media_type}:${Number(m.tmdb_id)}`)}
  exclusions98=set;exclusionsAt98=Date.now();return set;
}

const discover98={tab:'foryou',filter:'all'};
const tabDefs98=[
  ['foryou','Pra você'],['trending','Em alta'],['anticipated','Mais aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']
];
function activateDiscoverTabs98(){
  $$98('[data-tab98]').forEach(b=>b.classList.toggle('active',b.dataset.tab98===discover98.tab));
}
function renderDiscoverControls98(){
  const host=$98('#ct98-discover-controls');if(!host)return;
  if(discover98.tab==='foryou'){host.innerHTML='';return}
  host.innerHTML=`<div class="ct98-filters"><button class="ct98-filter ${discover98.filter==='all'?'active':''}" data-filter98="all">Todos</button><button class="ct98-filter ${discover98.filter==='movie'?'active':''}" data-filter98="movie">Filmes</button><button class="ct98-filter ${discover98.filter==='tv'?'active':''}" data-filter98="tv">Séries</button></div>`;
  $$98('[data-filter98]',host).forEach(b=>b.onclick=()=>{discover98.filter=b.dataset.filter98;void loadDiscover98()});
}
async function loadMixed98(kind){
  const filter=discover98.filter;
  if(kind==='trending'){
    const jobs=[];if(filter!=='tv')jobs.push(api98('/trending/movie/week').then(x=>(x.results||[]).map(y=>({...y,media_type:'movie'}))));if(filter!=='movie')jobs.push(api98('/trending/tv/week').then(x=>(x.results||[]).map(y=>({...y,media_type:'tv'}))));
    return (await Promise.all(jobs)).flat().sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0));
  }
  if(kind==='anticipated'){
    const jobs=[];if(filter!=='tv')jobs.push(api98('/movie/upcoming').then(x=>(x.results||[]).map(y=>({...y,media_type:'movie'}))));if(filter!=='movie')jobs.push(api98('/tv/on_the_air').then(x=>(x.results||[]).map(y=>({...y,media_type:'tv'}))));
    return (await Promise.all(jobs)).flat().sort((a,b)=>String(a.release_date||a.first_air_date||'9999').localeCompare(String(b.release_date||b.first_air_date||'9999')));
  }
  if(kind==='top'){
    const jobs=[];if(filter!=='tv')jobs.push(api98('/movie/top_rated').then(x=>(x.results||[]).map(y=>({...y,media_type:'movie'}))));if(filter!=='movie')jobs.push(api98('/tv/top_rated').then(x=>(x.results||[]).map(y=>({...y,media_type:'tv'}))));
    return (await Promise.all(jobs)).flat().sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)||Number(b.vote_count||0)-Number(a.vote_count||0));
  }
  return [];
}
async function forYouRows98(){
  const excluded=await exclusionsForDiscover98(),hist=await sbRpc('cinetracker_profile_history_media',{p_limit_per_type:2000}).catch(()=>[]);
  const seeds=(Array.isArray(hist)?hist:[]).filter(x=>Number(x.tmdb_id)>0).sort((a,b)=>String(b.last_watched_at||'').localeCompare(String(a.last_watched_at||''))).slice(0,8);
  let rows=[];
  if(seeds.length){
    const packs=await Promise.all(seeds.map(s=>api98(`/${s.media_type}/${s.tmdb_id}/recommendations`).then(p=>(p.results||[]).map(x=>({...x,media_type:s.media_type}))).catch(()=>[])));
    rows=packs.flat();
  }
  if(rows.length<20){
    const [m,t]=await Promise.all([api98('/trending/movie/week').catch(()=>({results:[]})),api98('/trending/tv/week').catch(()=>({results:[]}))]);
    rows.push(...(m.results||[]).map(x=>({...x,media_type:'movie'})),...(t.results||[]).map(x=>({...x,media_type:'tv'})));
  }
  return rows.filter(x=>!excluded.has(`${x.media_type}:${Number(x.id)}`)).filter((x,i,a)=>a.findIndex(y=>y.media_type===x.media_type&&Number(y.id)===Number(x.id))===i).sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)).slice(0,30);
}
function ymd98(d){return d.toISOString().slice(0,10)}
async function calendarRows98(){
  const a=new Date(),b=new Date(a);b.setDate(b.getDate()+45);const jobs=[];
  if(discover98.filter!=='tv')jobs.push(api98('/discover/movie',{'primary_release_date.gte':ymd98(a),'primary_release_date.lte':ymd98(b),sort_by:'primary_release_date.asc',include_adult:false}).then(p=>(p.results||[]).map(x=>({...x,media_type:'movie',d:x.release_date}))));
  if(discover98.filter!=='movie')jobs.push(api98('/discover/tv',{'first_air_date.gte':ymd98(a),'first_air_date.lte':ymd98(b),sort_by:'first_air_date.asc',include_adult:false}).then(p=>(p.results||[]).map(x=>({...x,media_type:'tv',d:x.first_air_date}))));
  return (await Promise.all(jobs)).flat().filter(x=>x.d).sort((a,b)=>String(a.d).localeCompare(String(b.d)));
}
async function loadDiscover98(){
  activateDiscoverTabs98();renderDiscoverControls98();const host=$98('#ct98-discover-results');if(!host)return;host.innerHTML='<div class="ct98-skeleton"></div>';
  try{
    if(discover98.tab==='calendar'){
      const rows=await calendarRows98(),groups={};for(const x of rows)(groups[x.d]||(groups[x.d]=[])).push(x);
      host.innerHTML=`<div class="ct98-calendar">${Object.entries(groups).map(([d,list])=>`<section class="ct98-day"><h3>${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct98-dayrow">${list.map(mediaCard98).join('')}</div></section>`).join('')||'<div class="ct90-box">Nenhum lançamento encontrado.</div>'}</div>`;bindOpen98(host);return;
    }
    const rows=discover98.tab==='foryou'?await forYouRows98():await loadMixed98(discover98.tab);
    let filtered=rows;
    if(discover98.tab!=='foryou'&&discover98.filter!=='all')filtered=rows.filter(x=>x.media_type===discover98.filter);
    if(discover98.tab==='top')filtered=[...filtered].sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)||Number(b.vote_count||0)-Number(a.vote_count||0));
    host.innerHTML=filtered.length?`<div class="ct98-grid">${filtered.slice(0,40).map(mediaCard98).join('')}</div>`:'<div class="ct90-box">Nenhum título encontrado para este filtro.</div>';bindOpen98(host);
  }catch(e){host.innerHTML=`<div class="ct90-box">Falha ao carregar Descobrir: ${esc98(e?.message||e)}</div>`}
}
function renderDiscover98(){
  setView98('discover');const app=$98('#app');if(!app)return;
  app.innerHTML=shell98('Descobrir','Explore filmes e séries com filtros estritos por tipo.',`<div class="ct98-tabs">${tabDefs98.map(([k,l])=>`<button class="ct98-tab ${discover98.tab===k?'active':''}" data-tab98="${k}">${l}</button>`).join('')}</div><div id="ct98-discover-controls"></div><div id="ct98-discover-results"></div>`,'discover');
  $$98('[data-tab98]').forEach(b=>b.onclick=()=>{discover98.tab=b.dataset.tab98;discover98.filter='all';void loadDiscover98()});normalizeNav98();void loadDiscover98();
}

function chartSvg98(rows){
  const data=(Array.isArray(rows)?rows:[]).slice(-30),w=1000,h=200,pad=18;
  if(!data.length)return '<div class="ct90-box">Sem consumo registrado.</div>';
  const max=Math.max(1,...data.map(x=>Number(x.plays||0))),step=(w-pad*2)/Math.max(1,data.length-1);
  const pts=data.map((x,i)=>[pad+i*step,h-pad-(Number(x.plays||0)/max)*(h-pad*2)]);
  const line=pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ');
  const area=`${pad},${h-pad} ${line} ${pts[pts.length-1][0].toFixed(1)},${h-pad}`;
  const dots=pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"><title>${esc98(String(data[i].day||''))}: ${Number(data[i].plays||0)} reproduções</title></circle>`).join('');
  return `<div class="ct98-tech-chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="ct98g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55b8ec" stop-opacity=".35"/><stop offset="1" stop-color="#55b8ec" stop-opacity=".02"/></linearGradient></defs><polygon points="${area}" fill="url(#ct98g)"/><polyline points="${line}" fill="none" stroke="#67c5f4" stroke-width="4" vector-effect="non-scaling-stroke"/><g fill="#bdeaff" stroke="#0b1821" stroke-width="2">${dots}</g></svg></div>`;
}
function historyCard98(x){
  const id=Number(x.tmdb_id),clickable=id>0;
  return `<button class="ct98-history-card" data-hist98 data-type="${x.media_type}" data-id="${id}" ${clickable?'':'disabled'}><div class="ct98-history-poster"${x.poster_path?` style="background-image:url('${img98(x.poster_path,'w342')}')"`:''}></div><div class="ct98-history-body"><b>${esc98(x.title||'Sem título')}</b><small>${Number(x.plays||0).toLocaleString('pt-BR')} reproduç${Number(x.plays||0)===1?'ão':'ões'}</small></div></button>`;
}
function bindHistory98(root){
  $$98('[data-hist98]',root).forEach(b=>{if(b.disabled)return;b.onclick=()=>{const id=Number(b.dataset.id);if(id>0)(window.ct92OpenMedia||window.ct91OpenMedia)?.(b.dataset.type,id)}});
}
async function fillProfile98(){
  const host=$98('#ct98-profile');if(!host)return;
  try{
    const [st0,ss0,daily0,hist0]=await Promise.all([
      sbRpc('cinetracker_profile_stats',{}).catch(()=>({})),
      sbRpc('cinetracker_series_state_stats',{}).catch(()=>({})),
      sbRpc('cinetracker_consumption_daily',{p_limit_days:30}).catch(()=>[]),
      sbRpc('cinetracker_profile_history_media',{p_limit_per_type:2000}).catch(()=>[])
    ]);
    const s=Array.isArray(st0)?st0[0]||{}:st0||{},ss=Array.isArray(ss0)?ss0[0]||{}:ss0||{},hist=Array.isArray(hist0)?hist0:[],series=hist.filter(x=>x.media_type==='tv'),movies=hist.filter(x=>x.media_type==='movie');
    host.innerHTML=`<div class="ct98-profile"><section><div class="ct98-mainstats"><div class="ct98-stat"><div class="l">Episódios</div><div class="v">${Number(s.episodes_watched||0).toLocaleString('pt-BR')}</div><div class="s">${Number(ss.history_series??s.series_watched??0).toLocaleString('pt-BR')} séries com histórico</div></div><div class="ct98-stat"><div class="l">Filmes</div><div class="v">${Number(s.movies_watched||0).toLocaleString('pt-BR')}</div></div><div class="ct98-stat"><div class="l">Tempo séries</div><div class="v">${fmt98(s.series_minutes||0)}</div></div><div class="ct98-stat"><div class="l">Tempo filmes</div><div class="v">${fmt98(s.movie_minutes||0)}</div></div><div class="ct98-stat"><div class="l">Tempo total</div><div class="v">${fmt98(s.total_minutes||0)}</div></div></div></section><section class="ct98-panel"><div class="ct98-panel-head"><h3>Atividade</h3><small>Últimos 30 dias · reproduções</small></div>${chartSvg98(daily0)}</section><section class="ct98-panel"><div class="ct98-panel-head"><h3>Estatísticas extras</h3><small>Estados atuais das séries e Watchlist</small></div><div class="ct98-extra"><div class="ct98-stat"><div class="l">Concluídas</div><div class="v">${Number(ss.completed_series||0).toLocaleString('pt-BR')}</div></div><div class="ct98-stat"><div class="l">Em dia</div><div class="v">${Number(ss.up_to_date_series||0).toLocaleString('pt-BR')}</div></div><div class="ct98-stat"><div class="l">Em andamento</div><div class="v">${Number(ss.in_progress_series||0).toLocaleString('pt-BR')}</div></div><div class="ct98-stat"><div class="l">Não iniciadas</div><div class="v">${Number(ss.not_started_series||0).toLocaleString('pt-BR')}</div></div><div class="ct98-stat"><div class="l">Filmes Watchlist</div><div class="v">${Number(ss.watchlist_movies||0).toLocaleString('pt-BR')}</div></div></div></section><section class="ct98-panel" id="ct98-history-section"><div class="ct98-panel-head"><h3>Histórico</h3><small>${series.length} séries · ${movies.length} filmes</small></div><div class="ct98-history-block"><div><h4>Séries assistidas</h4><div class="ct98-carousel">${series.map(historyCard98).join('')||'<div class="ct90-box">Nenhuma série no histórico.</div>'}</div></div><div><h4>Filmes assistidos</h4><div class="ct98-carousel">${movies.map(historyCard98).join('')||'<div class="ct90-box">Nenhum filme no histórico.</div>'}</div></div></div></section></div>`;
    bindHistory98(host);
  }catch(e){host.innerHTML=`<div class="ct90-box">Falha ao carregar Perfil: ${esc98(e?.message||e)}</div>`}
}
function renderProfile98(scrollHistory=false){
  setView98('profile');const app=$98('#app');if(!app)return;app.innerHTML=shell98('Perfil','Estatísticas, atividade e histórico em um só lugar.','<div id="ct98-profile"><div class="ct98-skeleton"></div></div>','profile');normalizeNav98();void fillProfile98().then(()=>{if(scrollHistory)setTimeout(()=>$98('#ct98-history-section')?.scrollIntoView({behavior:'smooth'}),50)});
}

function bytesBase6498(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s)}
function u1698(n){return[n&255,(n>>>8)&255]}function u3298(n){return[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function crc3298(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
function zipStore98(files){
  const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
  for(const [name,text] of Object.entries(files)){const n=enc.encode(name),d=enc.encode(text),crc=crc3298(d),local=new Uint8Array([...u3298(0x04034b50),...u1698(20),0,0,0,0,0,0,0,0,...u3298(crc),...u3298(d.length),...u3298(d.length),...u1698(n.length),0,0,...n,...d]),central=new Uint8Array([...u3298(0x02014b50),...u1698(20),...u1698(20),0,0,0,0,0,0,0,0,...u3298(crc),...u3298(d.length),...u3298(d.length),...u1698(n.length),0,0,0,0,0,0,0,0,0,0,0,0,...u3298(offset),...n]);locals.push(local);centrals.push(central);offset+=local.length}
  const centralSize=centrals.reduce((n,x)=>n+x.length,0),end=new Uint8Array([...u3298(0x06054b50),0,0,0,0,...u1698(locals.length),...u1698(locals.length),...u3298(centralSize),...u3298(offset),0,0]),len=offset+centralSize+end.length,out=new Uint8Array(len);let p=0;for(const x of [...locals,...centrals,end]){out.set(x,p);p+=x.length}return out;
}
function csv98(rows){
  const a=Array.isArray(rows)?rows:[];if(!a.length)return '';
  const headers=[...new Set(a.flatMap(r=>Object.keys(r||{})))];
  const val=v=>{if(v==null)return '';const s=typeof v==='object'?JSON.stringify(v):String(v);return /[",\n\r]/.test(s)?`"${s.replace(/"/g,'""')}"`:s};
  return [headers.map(val).join(','),...a.map(r=>headers.map(h=>val(r?.[h])).join(','))].join('\r\n');
}
function parseCsv98(text){
  if(!text)return[];const rows=[],row=[];let cur='',q=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(q){if(ch==='"'&&text[i+1]==='"'){cur+='"';i++}else if(ch==='"')q=false;else cur+=ch}else if(ch==='"')q=true;else if(ch===','){row.push(cur);cur=''}else if(ch==='\n'){row.push(cur.replace(/\r$/,''));rows.push([...row]);row.length=0;cur=''}else cur+=ch}
  if(cur||row.length){row.push(cur.replace(/\r$/,''));rows.push(row)}const head=(rows.shift()||[]).map(x=>x.trim());return rows.filter(r=>r.some(x=>x!=='')).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
}
async function readZipFiles98(file){
  const ab=await file.arrayBuffer(),b=new Uint8Array(ab),dv=new DataView(ab),dec=new TextDecoder(),out={};let p=0;
  while(p+30<=b.length&&dv.getUint32(p,true)===0x04034b50){const method=dv.getUint16(p+8,true),size=dv.getUint32(p+18,true),nl=dv.getUint16(p+26,true),el=dv.getUint16(p+28,true),name=dec.decode(b.slice(p+30,p+30+nl)),start=p+30+nl+el,bytes=b.slice(start,start+size);let text;if(method===0)text=dec.decode(bytes);else if(method===8&&typeof DecompressionStream==='function'){const ds=new DecompressionStream('deflate-raw');text=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text()}else throw new Error(`Compressão ZIP não suportada: ${method}`);out[name]=text;p=start+size}
  return out;
}
function saveBytes98(name,bytes,mime='application/zip'){
  if(window.CineTrackerNative?.exportBackup){window.CineTrackerNative.exportBackup(name,bytesBase6498(bytes),mime);return}
  const blob=new Blob([bytes],{type:mime}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
}
async function edge98(body){
  const call=()=>fetch(`${SUPABASE_URL}/functions/v1/ct-backup-user`,{method:'POST',headers:{...(typeof authHeaders==='function'?authHeaders():{}),'Content-Type':'application/json'},body:JSON.stringify(body)});
  let r=await call();if(r.status===401&&typeof window.ctRefreshSession==='function'){await window.ctRefreshSession().catch(()=>{});r=await call()}const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok)throw new Error(d.error||`Backup ${r.status}`);return d;
}
async function exportBackup98(status){
  status.textContent='Preparando dados sincronizados…';
  const snapshot=(await edge98({action:'snapshot'})).data||{},profile=snapshot.profile||[],imports=snapshot.imports||[],media=snapshot.media||[],overrides=snapshot.media_overrides||[],history=snapshot.watch_history||[],progress=snapshot.episode_progress||[];
  const manifest=[{format:'cinetracker-csv-backup',version:VERSION,created_at:new Date().toISOString(),files:'profile.csv|imports.csv|media.csv|media_overrides.csv|watch_history.csv|episode_progress.csv'}];
  const files={'manifest.csv':csv98(manifest),'profile.csv':csv98(profile),'imports.csv':csv98(imports),'media.csv':csv98(media),'media_overrides.csv':csv98(overrides),'watch_history.csv':csv98(history),'episode_progress.csv':csv98(progress)};
  status.textContent='Gerando ZIP…';saveBytes98(`cinetracker-backup-${VERSION}.zip`,zipStore98(files));status.textContent=`Backup exportado: ${history.length.toLocaleString('pt-BR')} registros de histórico.`;
}
async function importBackup98(file,status){
  status.textContent='Lendo backup…';const files=await readZipFiles98(file),manifest=parseCsv98(files['manifest.csv']||'')[0];if(!manifest||manifest.format!=='cinetracker-csv-backup')throw new Error('ZIP não é um backup CineTracker CSV válido.');
  const data={format:'cinetracker-csv-backup',version:manifest.version||'',profile:parseCsv98(files['profile.csv']||''),imports:parseCsv98(files['imports.csv']||''),media:parseCsv98(files['media.csv']||''),media_overrides:parseCsv98(files['media_overrides.csv']||''),watch_history:parseCsv98(files['watch_history.csv']||''),episode_progress:parseCsv98(files['episode_progress.csv']||'')};
  status.textContent=`Restaurando ${data.watch_history.length.toLocaleString('pt-BR')} registros…`;const d=await edge98({action:'restore',data});status.textContent=`Restauração concluída: ${Number(d.restored?.watch_history||0).toLocaleString('pt-BR')} registros.`;exclusions98=null;tmdbCache98.clear();window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'backup-v098'}}));
}
async function clearCache98(status){
  status.textContent='Limpando cache local…';try{sessionStorage.clear()}catch{}
  try{for(const k of Object.keys(localStorage)){if(/^(ct-web-|ct98_|cinetracker_(cache|tmdb|meta))/i.test(k))localStorage.removeItem(k)}}catch{}
  try{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('ct-web-')||k.startsWith('cinetracker')).map(k=>caches.delete(k)))}catch{}
  tmdbCache98.clear();exclusions98=null;try{const regs=await navigator.serviceWorker?.getRegistrations?.();await Promise.all((regs||[]).map(r=>r.update().catch(()=>{})))}catch{}
  status.textContent='Cache local limpo com sucesso.';toast98('Cache limpo');
}
async function userMedia98(){
  const [hist,ov,prog]=await Promise.all([sbRpc('cinetracker_profile_history_media',{p_limit_per_type:2000}).catch(()=>[]),fetchAll98('media_overrides?select=media_id'),fetchAll98('episode_progress?select=media_id')]);
  const ids=new Set((Array.isArray(hist)?hist:[]).map(x=>Number(x.media_id)).filter(Boolean));for(const x of [...ov,...prog])if(Number(x.media_id))ids.add(Number(x.media_id));const out=[];const arr=[...ids];
  for(let i=0;i<arr.length;i+=120){const rows=await sbApi(`media?select=*&id=in.(${arr.slice(i,i+120).join(',')})`).catch(()=>[]);out.push(...(rows||[]))}return out;
}
async function updateMetadata98(status){
  const media=await userMedia98(),valid=media.filter(m=>Number(m.tmdb_id)>0);let done=0,ok=0,failed=0,skipped=media.length-valid.length;
  for(let i=0;i<valid.length;i+=6){
    await Promise.all(valid.slice(i,i+6).map(async m=>{try{const d=await api98(`/${m.media_type}/${m.tmdb_id}`),body={title:d.title||d.name||m.title,original_title:d.original_title||d.original_name||m.original_title||null,release_year:Number(String(d.release_date||d.first_air_date||'').slice(0,4))||m.release_year||null,poster_path:d.poster_path||m.poster_path||null,runtime_minutes:Number(d.runtime||(d.episode_run_time||[])[0]||m.runtime_minutes||0)||null,total_seasons:m.media_type==='tv'?Number(d.number_of_seasons||m.total_seasons||0)||null:null,total_episodes:m.media_type==='tv'?Number(d.number_of_episodes||m.total_episodes||0)||null:null,genres:Array.isArray(d.genres)?d.genres:[],raw_tmdb:d};await sbApi(`media?id=eq.${m.id}`,{method:'PATCH',body:JSON.stringify(body)});ok++}catch{failed++}finally{done++;status.textContent=`Atualizando metadados ${done}/${valid.length}…`}}));await sleep98(35)
  }
  tmdbCache98.clear();status.textContent=`Metadados atualizados: ${ok} sucesso, ${failed} falhas, ${skipped} IDs substitutos ignorados.`;window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'metadata-v098'}}));toast98('Atualização de metadados concluída');
}
function enhanceSettings98(){
  normalizeNav98();const settings=$98('.ct91-settings');if(!settings)return;
  const backup=$$98('.ct91-setting',settings).find(x=>/Backup e restauração/i.test(x.textContent||''));if(backup&&!backup.dataset.ct98Backup){backup.dataset.ct98Backup='1';backup.innerHTML=`<div class="ct98-settings-card"><h3>Backup & Restauração</h3><div class="ct91-muted">O backup é um ZIP com CSVs de perfil, mídia, estados, histórico, progresso e auditoria de importações.</div><div class="ct98-settings-actions"><button class="ct98-action" id="ct98-export">Exportar</button><button class="ct98-action" id="ct98-import">Importar</button></div><input id="ct98-backup-file" class="ct98-hidden" type="file" accept=".zip,application/zip"><div id="ct98-backup-status" class="ct98-status"></div></div>`;const status=$98('#ct98-backup-status',backup),file=$98('#ct98-backup-file',backup);$98('#ct98-export',backup).onclick=async()=>{try{await exportBackup98(status)}catch(e){status.textContent='Erro: '+(e?.message||e)}};$98('#ct98-import',backup).onclick=()=>file.click();file.onchange=async()=>{if(!file.files?.[0])return;try{await importBackup98(file.files[0],status)}catch(e){status.textContent='Erro: '+(e?.message||e)}finally{file.value=''}}}
  const maintenance=$$98('.ct91-setting',settings).find(x=>/Manutenção/i.test(x.textContent||''));if(maintenance){let status=$98('#ct98-maint-status',maintenance);if(!status){status=document.createElement('div');status.id='ct98-maint-status';status.className='ct98-status';maintenance.appendChild(status)}const clear=$98('#ct91-clear',maintenance),refresh=$98('#ct91-refresh',maintenance);if(clear)clear.onclick=()=>void clearCache98(status);if(refresh)refresh.onclick=()=>void updateMetadata98(status)}
  footer98();
}
function renderSettings98(){
  setView98('settings');const fn=window.ct95Navigate||window.ct94Navigate||window.ct92Navigate||window.ct91Navigate;try{fn?.('settings')}catch{}
  setTimeout(enhanceSettings98,30);setTimeout(enhanceSettings98,160);setTimeout(()=>{window.ct15EnhanceNativePicker?.();window.ct15RestoreNativeFiles?.()},260);
}
function renderHome98(){
  setView98('home');const fn=window.ct95Navigate||window.ct94Navigate||window.ct92Navigate||window.ct91Navigate;try{fn?.('home')}catch{try{render?.()}catch{}}
  for(const d of [0,50,180,500])setTimeout(normalizeNav98,d);
}
function navigate98(target){
  const t=target==='history'?'profile':target;
  if(t==='home'){renderHome98();return true}
  if(t==='discover'){discover98.tab='foryou';discover98.filter='all';renderDiscover98();return true}
  if(t==='profile'){renderProfile98(target==='history');return true}
  if(t==='settings'){renderSettings98();return true}
  return false;
}
window.ct98Navigate=navigate98;
window.ct98ClearCache=clearCache98;
window.ct98UpdateMetadata=updateMetadata98;
window.ct98ExportBackup=exportBackup98;

let mut98=null;
new MutationObserver(()=>{clearTimeout(mut98);mut98=setTimeout(()=>{normalizeNav98();let v='';try{v=String(view||'')}catch{}if(v==='settings'||v==='ct91-settings'||v==='ct92-settings')enhanceSettings98()},70)}).observe($98('#app')||document.documentElement,{subtree:true,childList:true});
window.addEventListener('cinetracker:data-changed',()=>{let v='';try{v=String(view||'')}catch{}if(v==='profile'&&$98('#ct98-profile'))void fillProfile98()});
setTimeout(()=>{normalizeNav98();let v='';try{v=String(view||'')}catch{}if(v==='profile')renderProfile98();else if(v==='discover')renderDiscover98();else if(v==='settings'||v==='ct91-settings'||v==='ct92-settings')enhanceSettings98()},120);
})();
