(() => {
'use strict';
window.__ctAndroidBuild = window.CineTrackerNative ? '0.0.89' : (window.__ctAndroidBuild || '0.0.89');
if (window.__ct89CoreLoaded) { window.__ctAndroidBuild='0.0.89'; return; }
window.__ct89CoreLoaded = true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img=(p,size='w500')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
let route = '';
let searchTimer = 0;
const css=document.createElement('style');
css.id='ct89-style';
css.textContent=`
.ct89-search{position:sticky;top:0;z-index:1000;background:#090909eF;backdrop-filter:blur(12px);padding:0 0 14px;margin:0 0 16px}
.ct89-searchbox{display:flex;align-items:center;gap:9px;border:1px solid #29445a;background:#0b131a;border-radius:13px;padding:9px 12px}
.ct89-searchbox input{width:100%;border:0;outline:0;background:transparent;color:#fff;font-size:14px}
.ct89-search-results{position:absolute;left:0;right:0;top:48px;max-height:420px;overflow:auto;border:1px solid #29445a;background:#071019;border-radius:13px;box-shadow:0 18px 50px #000c}
.ct89-result{display:grid;grid-template-columns:46px 1fr;gap:10px;align-items:center;width:100%;border:0;border-bottom:1px solid #172b3d;background:transparent;color:#fff;text-align:left;padding:9px;cursor:pointer}
.ct89-result:hover{background:#0d2232}.ct89-thumb{width:46px;height:64px;border-radius:8px;background:#12212c center/cover no-repeat}
.ct89-result b{display:block;font-size:13px}.ct89-result span{font-size:10px;color:#8ea0ad}
.ct89-overlay{position:fixed;inset:0;z-index:300000;background:#02070cf7;overflow:auto;padding:18px}
.ct89-wrap{width:min(1100px,100%);margin:0 auto}.ct89-back{position:sticky;top:4px;z-index:3;border:1px solid #31506a;background:#0b151d;color:#fff;border-radius:10px;padding:9px 12px;margin-bottom:12px}
.ct89-hero{display:grid;grid-template-columns:210px minmax(0,1fr);gap:18px}.ct89-poster{aspect-ratio:2/3;border-radius:15px;background:#101b23 center/cover no-repeat}
.ct89-meta{font-size:11px;color:#8ea0ad;margin:6px 0}.ct89-over{line-height:1.55;color:#c6d3dd}
.ct89-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.ct89-btn{border:1px solid #31506a;background:#0b151d;color:#eef7ff;border-radius:10px;padding:8px 10px;cursor:pointer}
.ct89-sec{margin-top:20px;padding-top:15px;border-top:1px solid #203646}.ct89-sec h2{font-size:17px}
.ct89-cast{display:grid;grid-auto-flow:column;grid-auto-columns:105px;gap:9px;overflow-x:auto}.ct89-person{border:0;background:transparent;color:#fff;text-align:left;padding:0;cursor:pointer}.ct89-face{aspect-ratio:2/3;border-radius:10px;background:#101b23 center/cover no-repeat}.ct89-person b{font-size:10px;display:block;margin-top:5px}
.ct89-seasons{display:flex;gap:7px;overflow:auto}.ct89-season{white-space:nowrap}.ct89-eps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.ct89-ep{border:1px solid #203646;border-radius:10px;padding:9px;background:#0b1218}
.ct89-charts{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(300px,82%);gap:10px;overflow-x:auto;scroll-snap-type:x mandatory}.ct89-chart{scroll-snap-align:start;border:1px solid #203646;border-radius:12px;padding:10px;background:#0b1218}.ct89-chart svg{width:100%;height:170px}.ct89-line{fill:none;stroke:#5db1ff;stroke-width:2.5}.ct89-dot{fill:#8ab8d8;stroke:#07101a;stroke-width:2}.ct89-dot.max{fill:#42c86a}.ct89-dot.min{fill:#ed5a5a}.ct89-axis{stroke:#294155}.ct89-txt{fill:#dceeff;font-size:8px}.ct89-lbl{fill:#8ea0ad;font-size:8px}
.ct89-film{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.ct89-credit{border:1px solid #203646;border-radius:11px;background:#0b1218;padding:7px}.ct89-credit-p{aspect-ratio:2/3;border-radius:8px;background:#101b23 center/cover no-repeat}.ct89-credit b{font-size:11px;display:block;margin-top:6px}
.ct89-profile-main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ct89-profile-main .ct54-box{text-align:center!important}.ct89-profile-main .ct89-wide{grid-column:1/-1}.ct89-profile-main .ct54-box-label,.ct89-profile-main .ct54-box-value,.ct89-profile-main .ct54-sub{text-align:center!important}
.ct89-settings-error{border:1px solid #7b3d3d;background:#241313;border-radius:12px;padding:10px;color:#ffd1d1;margin-bottom:12px}
.ct89-version{text-align:center;color:#71808b;font-size:11px;margin:28px 0 6px}
@media(max-width:700px){.ct89-hero{grid-template-columns:1fr}.ct89-poster{width:min(220px,70vw);margin:auto}.ct89-eps{grid-template-columns:1fr}.ct89-film{grid-template-columns:repeat(2,minmax(0,1fr))}.ct89-profile-main{grid-template-columns:repeat(2,minmax(0,1fr))}.ct89-charts{grid-auto-columns:94%}}
`;
document.head.appendChild(css);

async function api(path,params={}){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
  u.searchParams.set('path',path);u.searchParams.set('language','pt-BR');
  Object.entries(params).forEach(([k,v])=>v!=null&&u.searchParams.set(k,String(v)));
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});
  if(!r.ok)throw new Error(`TMDB ${r.status}`);
  return r.json();
}
async function ensureMedia(type,id,d){
  if(typeof sbApi!=='function')return null;
  let rows=await sbApi(`media?select=id&tmdb_id=eq.${id}&media_type=eq.${type}&limit=1`);
  if(rows?.[0])return rows[0];
  rows=await sbApi('media',{method:'POST',body:JSON.stringify({tmdb_id:Number(id),media_type:type,title:d?.title||d?.name||`TMDB #${id}`,poster_path:d?.poster_path||null,release_year:Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||null,raw_tmdb:d||{}})});
  return rows?.[0]||null;
}
async function toggleState(type,id,d,state,btn){
  try{
    const m=await ensureMedia(type,id,d);if(!m)return;
    const rows=await sbApi(`media_overrides?select=id&media_id=eq.${encodeURIComponent(m.id)}&state=eq.${state}&limit=1`);
    const on=!!rows?.[0];
    if(on)await sbApi(`media_overrides?id=eq.${encodeURIComponent(rows[0].id)}`,{method:'DELETE'});
    else await sbApi('media_overrides',{method:'POST',body:JSON.stringify({media_id:m.id,state})});
    if(btn){
      btn.classList.toggle('on',!on);
      btn.textContent=state==='AddedToWatchlist'?(!on?'✓ Na Watchlist':'Watchlist'):(!on?'✓ Visto':'Marcar como visto');
    }
    stateChanged();
  }catch{}
}

function footer(){
  const host=$('.content'); if(!host)return;
  let f=$('.ct89-version',host);
  if(!f){f=document.createElement('div');f.className='ct89-version';host.appendChild(f)}
  f.textContent='CineTracker • v89';
}
function safeSettings(error){
  route='settings';
  try{ if(typeof view!=='undefined') view='ct89-settings'; }catch{}
  const app=$('#app'); if(!app)return;
  const email=(typeof currentUser!=='undefined'&&currentUser?.email)||'Usuário';
  app.innerHTML=`<div class="app"><aside class="sidebar"><div class="logo">CINETRACKER</div><nav class="nav">
  <button data-view="home">⌂ Início</button><button data-view="discover">✦ Descobrir</button><button data-view="history">◷ Histórico</button><button data-view="profile">◉ Perfil</button><button class="active" data-view="settings">⚙ Configurações</button></nav></aside>
  <main class="content"><div class="ct54-top">Preferências</div><h1 class="ct54-title">Configurações</h1><p class="ct54-sub">Conta, dados e comportamento do aplicativo.</p>
  ${error?`<div class="ct89-settings-error">A tela anterior falhou e foi recuperada sem bloquear a navegação.</div>`:''}
  <div class="ct54-section-head"><h3>Conta</h3></div><div class="ct54-setting"><strong>${esc(email)}</strong><div class="ct54-meta">Conta conectada</div></div>
  <div class="ct54-section-head"><h3>Dados</h3></div>
  <div class="ct54-setting" data-ct89-setting="refresh"><strong>Atualizar metadados</strong><div class="ct54-meta">Recarrega títulos, episódios, notas e provedores.</div></div>
  <div class="ct54-setting" data-ct89-setting="clear"><strong>Limpar cache temporário</strong><div class="ct54-meta">Não apaga histórico nem estados manuais.</div></div>
  <div class="ct54-section-head"><h3>Experiência</h3></div>
  <div class="ct54-setting"><strong>Visualização padrão</strong><select id="ct89-layout"><option value="carousel">Carrossel</option><option value="grid">Grade</option><option value="list">Lista</option></select></div>
  <div class="ct54-setting"><label><input id="ct89-notify" type="checkbox"> Notificações de novos episódios e temporadas</label></div>
  <div class="ct54-setting" data-ct89-setting="logout"><strong>Sair da conta</strong></div>
  <nav class="mobile-nav"><button data-view="home">Início</button><button data-view="discover">Descobrir</button><button data-view="history">Histórico</button><button data-view="profile">Perfil</button><button class="active" data-view="settings">Config.</button></nav></main></div>`;
  $('#ct89-layout').value=localStorage.getItem('ct54-layout')||'carousel';
  $('#ct89-notify').checked=localStorage.getItem('ct89-notify')!=='0';
  $('#ct89-layout').onchange=e=>localStorage.setItem('ct54-layout',e.target.value);
  $('#ct89-notify').onchange=e=>localStorage.setItem('ct89-notify',e.target.checked?'1':'0');
  $$('[data-ct89-setting]').forEach(x=>x.onclick=async()=>{
    const a=x.dataset.ct89Setting;
    if(a==='clear'){try{sessionStorage.clear()}catch{};try{const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}catch{}}
    if(a==='refresh'){try{await window.ct53Refresh?.()}catch{}}
    if(a==='logout'){try{await signOut?.();}catch{};try{if(typeof render==='function')render()}catch{}}
  });
  footer();
}
const previousRender=typeof render==='function'?render:null;
try{
  render=function(){
    if(typeof view!=='undefined'&&view==='settings'){safeSettings(false);return}
    if(typeof view!=='undefined'&&view==='ct89-settings'){safeSettings(false);return}
    try{previousRender?.()}catch(e){if(typeof view!=='undefined'&&view==='settings'){safeSettings(true);return}throw e}
    queueMicrotask(enhance);
    setTimeout(enhance,80);
  };
}catch{}

function navigate(target){
  if(!target)return false;
  route=target;
  try{
    if(target==='settings'){safeSettings(false);window.scrollTo(0,0);return true}
    if(typeof view!=='undefined')view=target;
    if(typeof render==='function'){render();window.scrollTo(0,0);return true}
  }catch(e){if(target==='settings'){safeSettings(true);return true}}
  return false;
}
window.ct89Navigate=navigate;

function mediaNode(el){
  return el?.closest?.('[data-ct89-result],[data-tmdb-id],[data-media-id],[data-ct29-media],[data-id],.ct54-card,.ct87-card,.card,.feature,.ct67-history-row,.ct55-history-card,.ct71-credit,.ct86-credit')||null;
}
function titleOf(n){return (n?.querySelector?.('.ct54-name,.ct87-name,h1,h2,h3,strong,.title,.card-title')?.textContent||'').trim().split('\n')[0]}
function typeOf(n){
  const raw=String(n?.dataset?.mediaId||''),m=raw.match(/tmdb-(movie|tv)-(\d+)/);if(m)return m[1];
  const t=String(n?.dataset?.type||n?.dataset?.mediaType||n?.dataset?.apiType||'').toLowerCase();
  if(t.includes('movie')||t==='film'||t.includes('filme'))return'movie';
  if(t.includes('tv')||t.includes('series')||t.includes('serie'))return'tv';
  return /\bfilme\b/i.test(n?.textContent||'')?'movie':'tv';
}
async function resolveMedia(n){
  let id=Number(n?.dataset?.tmdbId||n?.dataset?.id||0),type=typeOf(n);
  const raw=String(n?.dataset?.mediaId||''),m=raw.match(/tmdb-(movie|tv)-(\d+)/);if(m){type=m[1];id=Number(m[2])}
  if(id&&n?.hasAttribute('data-ct29-media'))return{type,id};
  if(id&&n?.hasAttribute('data-tmdb-id'))return{type,id};
  const title=titleOf(n); if(!title)return null;
  const r=await api('/search/multi',{query:title,include_adult:false,page:1});
  let rows=(r.results||[]).filter(x=>['movie','tv'].includes(x.media_type));
  const preferred=rows.find(x=>x.media_type===type&&(x.title||x.name||'').toLowerCase()===title.toLowerCase())||rows.find(x=>x.media_type===type)||rows[0];
  return preferred?{type:preferred.media_type,id:Number(preferred.id)}:null;
}
function chartSvg(episodes){
  const rows=(episodes||[]).filter(x=>Number(x.vote_average)>0);
  if(!rows.length)return'<div class="ct89-meta">Sem avaliações disponíveis.</div>';
  const vals=rows.map(x=>Number(x.vote_average)),max=Math.max(...vals),min=Math.min(...vals),w=Math.max(300,rows.length*38),h=150,p=20;
  const x=i=>p+(w-p*2)*(rows.length===1?.5:i/(rows.length-1)),y=v=>p+(h-p*2)*(1-v/10);
  const pts=rows.map((r,i)=>`${x(i)},${y(Number(r.vote_average))}`).join(' ');
  const dots=rows.map((r,i)=>{const v=Number(r.vote_average),c=v===max?'max':v===min?'min':'';return `<circle class="ct89-dot ${c}" cx="${x(i)}" cy="${y(v)}" r="5"/><text class="ct89-txt" x="${x(i)}" y="${y(v)-8}" text-anchor="middle">${v.toFixed(1)}</text><text class="ct89-lbl" x="${x(i)}" y="${h-2}" text-anchor="middle">E${r.episode_number}</text>`}).join('');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line class="ct89-axis" x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}"/><polyline class="ct89-line" points="${pts}"/>${dots}</svg>`;
}
function overlay(html){
  let o=$('#ct89-overlay');if(!o){o=document.createElement('div');o.id='ct89-overlay';o.className='ct89-overlay';document.body.appendChild(o)}
  o.innerHTML=`<div class="ct89-wrap"><button class="ct89-back" data-ct89-close>← Voltar</button>${html}</div>`;
  $('[data-ct89-close]',o).onclick=()=>o.remove();
  return o;
}
async function openDetail(type,id){
  const o=overlay('<div class="ct54-box">Carregando detalhes…</div>');
  try{
    const [d,credits,providers]=await Promise.all([api(`/${type}/${id}`),api(`/${type}/${id}/credits`),api(`/${type}/${id}/watch/providers`).catch(()=>({}))]);
    const br=providers.results?.BR||{},streams=[...(br.flatrate||[]),...(br.free||[]),...(br.ads||[])].filter((x,i,a)=>a.findIndex(y=>y.provider_id===x.provider_id)===i);
    const cast=(credits.cast||[]).slice(0,14),seasons=type==='tv'?(d.seasons||[]).filter(s=>s.season_number>0):[];
    o.innerHTML=`<div class="ct89-wrap"><button class="ct89-back" data-ct89-close>← Voltar</button>
      <div class="ct89-hero"><div class="ct89-poster"${d.poster_path?` style="background-image:url('${img(d.poster_path)}')"`:''}></div><div><h1>${esc(d.title||d.name||'Sem título')}</h1>
      <div class="ct89-meta">${type==='movie'?'FILME':'SÉRIE'} · ${String(d.release_date||d.first_air_date||'').slice(0,4)} · ★ ${Number(d.vote_average||0).toFixed(1)}</div>
      <p class="ct89-over">${esc(d.overview||'Sem sinopse disponível.')}</p><div class="ct89-actions"><button class="ct89-btn" data-ct89-seen>Marcar como visto</button><button class="ct89-btn" data-ct89-watch>Watchlist</button></div>
      <div class="ct89-meta">Onde assistir: ${streams.map(x=>esc(x.provider_name)).join(' • ')||'não informado para o Brasil'}</div></div></div>
      ${type==='tv'?`<section class="ct89-sec"><h2>Temporadas e episódios</h2><div class="ct89-seasons">${seasons.map((s,i)=>`<button class="ct89-btn ct89-season" data-season="${s.season_number}">${esc(s.name||`Temporada ${s.season_number}`)}</button>`).join('')}</div><div class="ct89-eps" id="ct89-eps"></div></section><section class="ct89-sec"><h2>Avaliação dos episódios</h2><div class="ct89-charts" id="ct89-charts"><div class="ct89-chart">Carregando avaliações…</div></div></section>`:''}
      <section class="ct89-sec"><h2>Elenco</h2><div class="ct89-cast">${cast.map(p=>`<button class="ct89-person" data-person="${p.id}"><div class="ct89-face"${p.profile_path?` style="background-image:url('${img(p.profile_path,'w342')}')"`:''}></div><b>${esc(p.name)}</b></button>`).join('')}</div></section></div>`;
    $('[data-ct89-close]',o).onclick=()=>o.remove();
    $$('[data-person]',o).forEach(b=>b.onclick=()=>openPerson(Number(b.dataset.person)));
    $('[data-ct89-seen]',o).onclick=e=>void toggleState(type,id,d,'AlreadySeen',e.currentTarget);
    $('[data-ct89-watch]',o).onclick=e=>void toggleState(type,id,d,'AddedToWatchlist',e.currentTarget);
    if(type==='tv'){
      const loadSeason=async n=>{const s=await api(`/tv/${id}/season/${n}`);$('#ct89-eps',o).innerHTML=(s.episodes||[]).map(e=>`<div class="ct89-ep"><b>E${e.episode_number} · ${esc(e.name||'Episódio')}</b><div class="ct89-meta">★ ${Number(e.vote_average||0).toFixed(1)}</div><button class="ct89-btn" data-ep-seen>Visto</button></div>`).join('');$$('[data-ep-seen]',o).forEach(b=>b.onclick=stateChanged)};
      $$('[data-season]',o).forEach(b=>b.onclick=()=>loadSeason(Number(b.dataset.season)));
      if(seasons[0])void loadSeason(seasons[0].season_number);
      Promise.all(seasons.map(async s=>{try{const d=await api(`/tv/${id}/season/${s.season_number}`);return `<article class="ct89-chart"><b>Temporada ${s.season_number}</b>${chartSvg(d.episodes)}</article>`}catch{return `<article class="ct89-chart"><b>Temporada ${s.season_number}</b><div class="ct89-meta">Falha ao carregar.</div></article>`}})).then(cards=>{const c=$('#ct89-charts',o);if(c)c.innerHTML=cards.join('')});
    }
  }catch(e){o.innerHTML=`<div class="ct89-wrap"><button class="ct89-back" data-ct89-close>← Voltar</button><div class="ct54-box">Falha ao carregar detalhes: ${esc(e.message||e)}</div></div>`;$('[data-ct89-close]',o).onclick=()=>o.remove()}
}
async function openPerson(id){
  const o=overlay('<div class="ct54-box">Carregando ator…</div>');
  try{
    const [p,c]=await Promise.all([api(`/person/${id}`),api(`/person/${id}/combined_credits`)]);
    const credits=(c.cast||[]).filter(x=>['movie','tv'].includes(x.media_type)).sort((a,b)=>String(b.release_date||b.first_air_date||'').localeCompare(String(a.release_date||a.first_air_date||''))).filter((x,i,a)=>a.findIndex(y=>y.id===x.id&&y.media_type===x.media_type)===i).slice(0,60);
    o.innerHTML=`<div class="ct89-wrap"><button class="ct89-back" data-ct89-close>← Voltar</button><div class="ct89-hero"><div class="ct89-poster"${p.profile_path?` style="background-image:url('${img(p.profile_path,'w342')}')"`:''}></div><div><h1>${esc(p.name||'Ator')}</h1><div class="ct89-meta">${esc(p.known_for_department||'Elenco')}</div><p class="ct89-over">${esc(p.biography||'Sem biografia disponível.')}</p></div></div><section class="ct89-sec"><h2>Filmografia</h2><div class="ct89-film">${credits.map(x=>`<article class="ct89-credit" data-credit="${x.id}" data-type="${x.media_type}"><div class="ct89-credit-p"${x.poster_path?` style="background-image:url('${img(x.poster_path,'w342')}')"`:''}></div><b>${esc(x.title||x.name||'Sem título')}</b><div class="ct89-meta">${x.media_type==='movie'?'FILME':'SÉRIE'} · ${String(x.release_date||x.first_air_date||'').slice(0,4)}</div><div class="ct89-actions"><button class="ct89-btn" data-open>Abrir</button><button class="ct89-btn" data-seen>Visto</button><button class="ct89-btn" data-watch>Watchlist</button></div></article>`).join('')}</div></section></div>`;
    $('[data-ct89-close]',o).onclick=()=>o.remove();
    $$('[data-credit]',o).forEach(c=>{const credit=credits.find(x=>x.id===Number(c.dataset.credit)&&x.media_type===c.dataset.type),go=()=>openDetail(c.dataset.type,Number(c.dataset.credit));$('[data-open]',c).onclick=go;$('.ct89-credit-p',c).onclick=go;$('[data-seen]',c).onclick=e=>void toggleState(c.dataset.type,Number(c.dataset.credit),credit,'AlreadySeen',e.currentTarget);$('[data-watch]',c).onclick=e=>void toggleState(c.dataset.type,Number(c.dataset.credit),credit,'AddedToWatchlist',e.currentTarget)});
  }catch(e){o.innerHTML=`<div class="ct89-wrap"><button class="ct89-back" data-ct89-close>← Voltar</button><div class="ct54-box">Falha ao carregar ator: ${esc(e.message||e)}</div></div>`;$('[data-ct89-close]',o).onclick=()=>o.remove()}
}
function injectSearch(){
  let v='';try{v=String(view||'')}catch{}
  if(route==='settings'||v==='ct89-settings'||v==='settings'||v==='profile'){ $('.ct89-search')?.remove(); return }
  const host=$('.content');if(!host||$('.ct89-search',host))return;
  const wrap=document.createElement('div');wrap.className='ct89-search';wrap.innerHTML=`<div class="ct89-searchbox">⌕ <input type="search" placeholder="Buscar filmes, séries e atores…" autocomplete="off"></div><div class="ct89-search-results" hidden></div>`;
  host.prepend(wrap);const input=$('input',wrap),results=$('.ct89-search-results',wrap);
  input.oninput=()=>{clearTimeout(searchTimer);const q=input.value.trim();if(q.length<2){results.hidden=true;results.innerHTML='';return}searchTimer=setTimeout(async()=>{try{const d=await api('/search/multi',{query:q,include_adult:false,page:1});const rows=(d.results||[]).filter(x=>['movie','tv','person'].includes(x.media_type)).slice(0,15);results.innerHTML=rows.map(x=>`<button class="ct89-result" data-kind="${x.media_type}" data-id="${x.id}"><div class="ct89-thumb"${(x.poster_path||x.profile_path)?` style="background-image:url('${img(x.poster_path||x.profile_path,'w185')}')"`:''}></div><div><b>${esc(x.title||x.name||'Sem título')}</b><span>${x.media_type==='movie'?'Filme':x.media_type==='tv'?'Série':'Ator'}</span></div></button>`).join('')||'<div class="ct89-meta" style="padding:12px">Nenhum resultado.</div>';results.hidden=false;$$('.ct89-result',results).forEach(b=>b.onclick=()=>{results.hidden=true;input.blur();if(b.dataset.kind==='person')openPerson(Number(b.dataset.id));else openDetail(b.dataset.kind,Number(b.dataset.id))})}catch{results.hidden=true}},280)};
}
function formatTime(minutes){
  let h=Math.max(0,Math.floor(Number(minutes||0)/60)),months=Math.floor(h/(24*30));h-=months*24*30;const days=Math.floor(h/24);h-=days*24;
  return `${months} ${months===1?'mês':'meses'} ${days} ${days===1?'dia':'dias'} ${h} ${h===1?'hora':'horas'}`;
}
async function enhanceProfile(){
  let v='';try{v=String(view||'')}catch{};if(v!=='profile')return;
  const root=$('#ct54-profile');if(!root)return;
  const main=$('.ct54-profile-main',root);if(main){
    main.classList.add('ct89-profile-main');
    const b=$$('.ct54-box',main);
    if(b.length>=5){const [ep,seriesTime,movies,movieTime,total]=b;main.innerHTML='';for(const x of [ep,movies,seriesTime,movieTime,total])main.appendChild(x);seriesTime.classList.add('ct89-wide');movieTime.classList.add('ct89-wide');total.classList.add('ct89-wide')}
  }
  const histHead=$$('.ct54-section-head',root).find(x=>/histórico/i.test(x.textContent||''));if(histHead){histHead.nextElementSibling?.remove();histHead.remove()}
  const chartBox=$$('.ct54-box',root).find(x=>/episódios por dia/i.test(x.textContent||''));const extraHead=$$('.ct54-section-head',root).find(x=>/estatísticas extras/i.test(x.textContent||''));if(chartBox&&extraHead)root.insertBefore(chartBox,extraHead);
  try{
    if(typeof sbRpc==='function'){
      const st=await sbRpc('cinetracker_profile_stats',{}),s=Array.isArray(st)?st[0]:st||{};
      const b=$$('.ct54-box',main);if(b.length>=5){
        const [ep,movies,seriesTime,movieTime,total]=b;
        $('.ct54-box-value',ep).textContent=`${Number(s.episodes_watched||0).toLocaleString('pt-BR')} episódios`;
        const sub=$('.ct54-sub',ep);if(sub)sub.textContent=`de ${Number(s.series_watched||0).toLocaleString('pt-BR')} séries acompanhadas`;
        $('.ct54-box-value',movies).textContent=Number(s.movies_watched||0).toLocaleString('pt-BR');
        $('.ct54-box-value',seriesTime).textContent=formatTime(s.series_minutes||0);
        $('.ct54-box-value',movieTime).textContent=formatTime(s.movie_minutes||0);
        $('.ct54-box-value',total).textContent=formatTime(s.total_minutes||0);
      }
    }
  }catch{}
}
function stateChanged(){
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{version:89}}));
  setTimeout(async()=>{let v='';try{v=String(view||'')}catch{};if(v==='profile')await enhanceProfile();if(v==='history'){try{render()}catch{}}},250);
  setTimeout(()=>{let v='';try{v=String(view||'')}catch{};if(v==='profile')void enhanceProfile()},900);
}
function enhance(){injectSearch();footer();void enhanceProfile()}
document.addEventListener('click',async e=>{
  if(e.target.closest?.('[data-view]'))return;
  if(e.target.closest?.('.ct89-search,.ct89-overlay,button,input,select,a,label'))return;
  const n=mediaNode(e.target);if(!n)return;
  e.preventDefault();e.stopImmediatePropagation();
  try{const r=await resolveMedia(n);if(r)openDetail(r.type,r.id)}catch{}
},true);
document.addEventListener('click',e=>{
  const t=(e.target.closest?.('button')?.textContent||'').toLowerCase();
  if(/assistido|visto|marcar assistido|marcar como visto/.test(t))setTimeout(stateChanged,50);
},false);
window.addEventListener('cinetracker:data-changed',()=>{void enhanceProfile()});
new MutationObserver(()=>{clearTimeout(window.__ct89EnhanceTimer);window.__ct89EnhanceTimer=setTimeout(enhance,30)}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(enhance,120);
})();