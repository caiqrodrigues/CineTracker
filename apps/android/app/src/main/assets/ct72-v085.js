(() => {
'use strict';
if (window.__ct72Loaded) return;
window.__ct72Loaded = true;
window.__ctAndroidBuild = '0.0.85';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
const poster=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';

async function api(path,params={}){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
  u.searchParams.set('path',path); u.searchParams.set('language','pt-BR');
  Object.entries(params).forEach(([k,v])=>{if(v!=null)u.searchParams.set(k,String(v));});
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});
  if(!r.ok) throw new Error('TMDB '+r.status);
  return r.json();
}

const style=document.createElement('style');
style.id='ct72-style';
style.textContent=`
.ct85-search{position:sticky;top:0;z-index:4500;padding:8px 0 10px;background:#090909}.ct85-search-row{display:flex;gap:8px}.ct85-search-row input{flex:1;min-width:0;border:1px solid #29485f;background:#0c141a;color:#fff;border-radius:12px;padding:11px 13px}.ct85-search-row button{border:1px solid #31536d;background:#102230;color:#e7f5ff;border-radius:12px;padding:0 14px}.ct85-results{display:grid;gap:8px;margin-top:8px}.ct85-result{display:grid;grid-template-columns:56px 1fr;gap:9px;border:1px solid #203646;background:#0b1218;border-radius:11px;padding:7px;cursor:pointer}.ct85-result-poster{width:56px;aspect-ratio:2/3;border-radius:7px;background:#101b23 center/cover no-repeat}.ct85-result small{display:block;color:#8193a1;margin-top:4px}.ct85-provider-section{margin-top:18px}.ct85-providers{display:flex;gap:7px;flex-wrap:wrap}.ct85-provider{display:flex;align-items:center;gap:6px;border:1px solid #29404f;border-radius:9px;padding:6px 8px;font-size:10px}.ct85-provider img{width:25px;height:25px;border-radius:6px}.ct85-hidden{display:none!important}.ct85-episode-open{cursor:pointer}.ct85-episode-page{padding-bottom:24px}.ct85-episode-page button{border:1px solid #2c465a;background:#0b141b;color:#fff;border-radius:10px;padding:8px 11px}.ct85-episode-page p{color:#aab7c0;line-height:1.55}.ct85-version{font-weight:700}
`;
document.head.appendChild(style);

function mediaType(el){
  const t=String(el?.dataset?.type||el?.dataset?.mediaType||el?.dataset?.apiType||'').toLowerCase();
  if(t.includes('movie')||t==='film')return 'movie';
  if(t.includes('tv')||t.includes('series'))return 'tv';
  return /\bfilme\b/i.test(el?.textContent||'')?'movie':'tv';
}
function mediaId(el){
  const raw=el?.dataset?.mediaId||'';
  const m=raw.match(/tmdb-(movie|tv)-(\d+)/);
  return Number(m?.[2]||el?.dataset?.tmdbId||el?.dataset?.id||0);
}
async function resolveCard(el){
  const node=el.closest?.('[data-tmdb-id],[data-media-id],[data-id],.card,.ct47-card,.history-item,.ct55-history-card,.panel,.ct84-card')||el;
  const type=mediaType(node); const id=mediaId(node);
  if(id)return {type,id,node};
  const title=(node.querySelector?.('h1,h2,h3,strong,.title,.card-title,.ct84-name')?.textContent||'').trim();
  if(!title)return null;
  const r=await api(`/search/${type}`,{query:title,page:1});
  const hit=r?.results?.[0];
  return hit?.id?{type,id:Number(hit.id),node}:null;
}

async function openEpisode(tvId,season,episode,back){
  const app=$('#app'); if(!app)return;
  app.innerHTML='<div class="app"><main class="content"><div class="ct84-empty">Carregando episódio…</div></main></div>';
  try{
    const [show,ep]=await Promise.all([api(`/tv/${tvId}`),api(`/tv/${tvId}/season/${season}/episode/${episode}`)]);
    app.innerHTML=`<div class="app"><main class="content ct85-episode-page"><button id="ct85-ep-back">← Voltar</button><h1>${esc(show.name||'Série')}</h1><h2>T${season}E${episode} · ${esc(ep.name||'Episódio')}</h2><div class="ct84-meta">★ ${Number(ep.vote_average||0).toFixed(1)} · ${esc(ep.air_date||'')}</div><p>${esc(ep.overview||'Sem sinopse disponível.')}</p></main></div>`;
    $('#ct85-ep-back').onclick=back;
  }catch{ if(typeof back==='function')back(); }
}

function ensureSearch(){
  const view=String(window.view||'');
  if(view==='profile'||view==='settings'||!$('.content')){ $('.ct85-search')?.remove(); return; }
  if($('.ct85-search'))return;
  const box=document.createElement('div'); box.className='ct85-search';
  box.innerHTML='<div class="ct85-search-row"><input type="search" placeholder="Buscar filmes e séries por nome"><button type="button">Buscar</button></div><div class="ct85-results"></div>';
  $('.content').prepend(box);
  const input=$('input',box), button=$('button',box), results=$('.ct85-results',box);
  const run=async()=>{
    const q=input.value.trim(); if(q.length<2){results.innerHTML='';return;}
    results.innerHTML='<div class="ct84-empty">Buscando…</div>';
    try{
      const data=await api('/search/multi',{query:q,page:1,include_adult:false});
      const rows=(data.results||[]).filter(x=>x.media_type==='movie'||x.media_type==='tv').slice(0,24);
      results.innerHTML=rows.map(x=>`<article class="ct85-result" data-type="${x.media_type}" data-id="${x.id}"><div class="ct85-result-poster"${x.poster_path?` style="background-image:url('${poster(x.poster_path)}')"`:''}></div><div><b>${esc(x.title||x.name||'Sem título')}</b><small>${x.media_type==='movie'?'FILME':'SÉRIE'} · ${String(x.release_date||x.first_air_date||'').slice(0,4)}</small></div></article>`).join('')||'<div class="ct84-empty">Nenhum resultado.</div>';
      $$('.ct85-result',results).forEach(el=>el.onclick=()=>window.ct84OpenMedia?.(el.dataset.type,Number(el.dataset.id)));
    }catch{results.innerHTML='<div class="ct84-empty">Falha na busca.</div>';}
  };
  button.onclick=run; input.onkeydown=e=>{if(e.key==='Enter')run();};
}

async function addProviders(){
  const detail=$('.ct84-detail'); if(!detail||detail.dataset.ct85Providers)return;
  let type=detail.dataset.ct71Type||detail.dataset.type||'';
  let id=Number(detail.dataset.ct71Id||detail.dataset.id||0);
  if(!type||!id){
    const h=detail.querySelector('h1'); if(!h)return;
    type=/\bFILME\b/i.test(detail.textContent||'')?'movie':'tv';
    try{const r=await api(`/search/${type}`,{query:h.textContent.trim(),page:1});id=Number(r?.results?.[0]?.id||0);}catch{return;}
  }
  if(!id)return; detail.dataset.ct85Providers='1';
  try{
    const p=await api(`/${type}/${id}/watch/providers`); const br=p?.results?.BR||{};
    const providers=[...(br.flatrate||[]),...(br.free||[]),...(br.ads||[])].filter((x,i,a)=>a.findIndex(y=>y.provider_id===x.provider_id)===i);
    const sec=document.createElement('section'); sec.className='ct85-provider-section';
    sec.innerHTML='<h2>Onde assistir</h2><div class="ct85-providers">'+(providers.length?providers.map(x=>`<div class="ct85-provider"><img src="${poster(x.logo_path,'w92')}"><span>${esc(x.provider_name)}</span></div>`).join(''):'<span class="ct84-meta">Nenhum streaming informado para o Brasil.</span>')+'</div>';
    const over=detail.querySelector('.ct84-over'); if(over)over.after(sec); else detail.appendChild(sec);
  }catch{}
}

function makeEpisodesClickable(){
  const detail=$('.ct84-detail'); if(!detail)return;
  const type=detail.dataset.ct71Type||''; const id=Number(detail.dataset.ct71Id||0);
  if(type!=='tv'||!id)return;
  $$('.ct84-season').forEach(seasonBox=>{
    const s=Number(seasonBox.querySelector('[data-season]')?.dataset?.season||0); if(!s)return;
    $$('.ct84-ep',seasonBox).forEach(ep=>{
      if(ep.dataset.ct85Open)return; ep.dataset.ct85Open='1'; ep.classList.add('ct85-episode-open');
      const m=(ep.textContent||'').match(/E(\d+)/i); const n=Number(m?.[1]||0); if(!n)return;
      ep.onclick=()=>openEpisode(id,s,n,()=>window.ct84OpenMedia?.('tv',id));
    });
  });
}

let excluded=null;
async function getExcluded(){
  const out={ids:new Set(),titles:new Set()};
  try{
    const rows=await sbApi('media_overrides?select=state,media:media(tmdb_id,media_type,title)&state=in.(AlreadySeen,Completed,AddedToWatchlist,WatchLater,InProgress)&limit=3000');
    (rows||[]).forEach(x=>{if(x.media?.tmdb_id)out.ids.add(`${x.media.media_type}:${x.media.tmdb_id}`);if(x.media?.title)out.titles.add(norm(x.media.title));});
    const cont=await sbRpc('cinetracker_continue_items_v2',{})||[];
    cont.forEach(x=>{if(x.tmdb_id)out.ids.add(`tv:${x.tmdb_id}`);if(x.title)out.titles.add(norm(x.title));});
  }catch{}
  return out;
}
async function filterDiscover(){
  if(String(window.view||'')!=='discover')return;
  const page=norm($('.content')?.textContent||'');
  if(!['em alta','mais aguardados','populares','mais bem avaliados'].some(x=>page.includes(x)))return;
  if(!excluded)excluded=await getExcluded();
  $$('.card,.ct47-card,[data-tmdb-id],[data-media-id]').forEach(el=>{
    const id=mediaId(el), type=mediaType(el), title=norm(el.querySelector('h2,h3,strong,.title,.card-title')?.textContent||'');
    if((id&&excluded.ids.has(`${type}:${id}`))||(title&&excluded.titles.has(title)))el.classList.add('ct85-hidden');
  });
}

function mergeHomeWatch(){
  $$('button,a,[role=button]').forEach(el=>{
    const t=norm(el.textContent);
    if(t==='assistir'){el.classList.add('ct85-hidden'); el.onclick=e=>{e.preventDefault();window.ct84Navigate?.('home');};}
  });
}
function fixHomeFilter(){
  if(String(window.view||'')!=='home')return;
  const sheet=$('.ct84-status'); if(!sheet||sheet.dataset.ct85)return; sheet.dataset.ct85='1';
  $$('.ct84-radio',sheet).forEach(label=>{
    const t=norm(label.textContent); const span=label.querySelector('span'); if(!span)return;
    if(t==='em dia')span.textContent='Histórico'; if(t==='acompanhando')span.textContent='Assistir a seguir';
  });
}
function fixProfile(){
  if(String(window.view||'')!=='profile')return;
  const host=$('#ct54-profile')||$('.content'); if(!host)return;
  $$('button,a,.tab,[role=tab]',host).forEach(e=>{if(norm(e.textContent)==='historico')e.remove();});
  const main=$('.ct54-profile-main',host);
  const chart=$$('.ct54-box,.panel,section',host).find(x=>/episódios por dia/i.test(x.textContent||''));
  const extraHead=$$('h2,h3,.ct54-section-head',host).find(x=>/estatísticas extras/i.test(x.textContent||''));
  if(main&&chart&&main.nextElementSibling!==chart)main.after(chart);
  if(chart&&extraHead&&chart.nextElementSibling!==extraHead)chart.after(extraHead);
}
function fixSettings(){
  if(String(window.view||'')!=='settings')return;
  const host=$('.content')||document.body;
  $$('*',host).forEach(e=>{const t=e.textContent?.trim()||'';if(/^Web\s*0\./i.test(t)||/vers[aã]o web/i.test(t))e.remove();});
  let footer=$('.ct85-version',host);
  if(!footer){footer=document.createElement('div');footer.className='ct85-version';footer.textContent='Android 0.0.85';host.appendChild(footer);}else footer.textContent='Android 0.0.85';
}

function installClicks(){
  document.addEventListener('click',async e=>{
    if(e.target.closest('button,a,input,select,textarea,.ct85-search,.ct84-detail,.ct71-credit'))return;
    const view=String(window.view||''); if(!['home','discover','history'].includes(view))return;
    const card=e.target.closest('.card,.ct47-card,.history-item,.ct55-history-card,[data-tmdb-id],[data-media-id],.panel,.ct84-card'); if(!card)return;
    try{
      const m=await resolveCard(card); if(!m)return; e.preventDefault(); e.stopPropagation();
      if(view==='history'&&m.type==='tv'){
        const txt=card.textContent||'';
        const hit=txt.match(/T(?:emporada)?\s*(\d+)\D+E(?:pis[oó]dio)?\s*(\d+)/i)||txt.match(/S(\d+)E(\d+)/i);
        if(hit)return openEpisode(m.id,Number(hit[1]),Number(hit[2]),()=>render?.());
      }
      window.ct84OpenMedia?.(m.type,m.id);
    }catch{}
  },true);
}

const oldNav=window.ct84Navigate;
window.ct85Navigate=target=>{if(target==='watch'||target==='assistir')target='home';if(oldNav)return oldNav(target);window.view=target;render?.();return true;};
installClicks();
const refresh=()=>{ensureSearch();addProviders();makeEpisodesClickable();mergeHomeWatch();fixHomeFilter();fixProfile();fixSettings();filterDiscover();};
new MutationObserver(refresh).observe(document.documentElement,{subtree:true,childList:true});
setTimeout(refresh,250);
})();
