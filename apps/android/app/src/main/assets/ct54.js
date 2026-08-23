(() => {
'use strict';
if (window.__ct54Loaded) return;
window.__ct54Loaded = true;

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let currentMedia={type:null,id:0};
const navStack=[];
let sorting=false;

const style=document.createElement('style');
style.id='ct54-style';
style.textContent=`
.ct49-home-list{display:flex!important;gap:9px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important;padding-bottom:4px!important}
.ct49-home-card{flex:0 0 82%!important;min-width:82%!important;scroll-snap-align:start!important;cursor:pointer!important}
body.ct54-discover .content .grid,
body.ct54-discover .content .cards,
body.ct54-discover .content .tmdb-grid,
body.ct54-discover .content .discover-grid,
body.ct54-discover .content .ct49-force3{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
body.ct54-discover .content .card{min-width:0!important;width:auto!important;max-width:none!important}
body.ct54-discover .content .card .poster,
body.ct54-discover .content .card .tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important}
body.ct54-discover .content .card .card-body{padding:6px!important}
body.ct54-discover .content .card h3{font-size:10px!important;line-height:1.15!important}
.ct54-where{margin:14px 0;padding:12px;border:1px solid #1d3040;border-radius:12px;background:#0c1319;color:#dce6ee}
.ct54-where strong{display:block;margin-bottom:7px}.ct54-where .ct54-line{font-size:11px;color:#9eabb5;margin-top:5px;line-height:1.45}
`;
document.head.appendChild(style);

function forceDiscover3(){
  const on=typeof view!=='undefined'&&view==='discover';
  document.body.classList.toggle('ct54-discover',on);
  if(!on)return;
  const root=$('.content'); if(!root)return;
  for(const el of $$('div,section',root)){
    const cards=[...el.children].filter(c=>c.classList?.contains('card'));
    if(cards.length>=2){
      el.style.setProperty('display','grid','important');
      el.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      el.style.setProperty('gap','7px','important');
    }
  }
}

function openSeriesFromHome(id){
  if(!id)return;
  currentMedia={type:'tv',id:Number(id)};
  try{
    if(typeof window.ct47Navigate==='function')window.ct47Navigate('library');
    else {view='library';render();}
  }catch{return}
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    const card=$(`.ct47-card[data-id="${Number(id)}"]`);
    if(card){clearInterval(timer);card.click();return}
    if(tries>30)clearInterval(timer);
  },100);
}

function bindHomeCards(){
  $$('.ct49-home-card').forEach(card=>{
    if(card.dataset.ct54Bound)return;
    card.dataset.ct54Bound='1';
    card.addEventListener('click',e=>{
      if(e.target.closest('button,a,input,select'))return;
      const id=Number(card.dataset.id||0);
      openSeriesFromHome(id);
    });
  });
}

async function freshContinueRows(){
  try{return await sbRpc('cinetracker_continue_items_v2',{})||[]}catch{return []}
}

async function sortFollowing(){
  if(sorting||typeof view==='undefined'||view!=='library')return;
  const list=$('.ct47-section[data-section="following"] .ct47-list');
  if(!list)return;
  sorting=true;
  try{
    const rows=(await freshContinueRows()).filter(x=>x.status==='following');
    rows.sort((a,b)=>new Date(b.last_watched_at||b.updated_at||0)-new Date(a.last_watched_at||a.updated_at||0));
    const map=new Map($$('.ct47-card',list).map(c=>[Number(c.dataset.id),c]));
    for(const r of rows){const c=map.get(Number(r.tmdb_id));if(c)list.appendChild(c)}
  }finally{sorting=false}
}

async function markThrough(tmdbId,season,episode,title){
  let states=[];
  try{states=await sbRpc('cinetracker_episode_state',{p_tmdb_id:tmdbId})||[]}catch{}
  const watched=new Set(states.filter(x=>x.watched).map(x=>`${Number(x.season_number)}:${Number(x.episode_number)}`));
  const missing=[];
  for(let e=1;e<episode;e++)if(!watched.has(`${season}:${e}`))missing.push(e);
  if(missing.length){
    const yes=confirm(`Você está marcando o episódio ${episode}. Já assistiu também os episódios anteriores desta temporada?\n\nOK = marcar E1 até E${episode}\nCancelar = marcar apenas E${episode}`);
    if(yes){
      for(let e=1;e<=episode;e++){
        if(e===episode||!watched.has(`${season}:${e}`))await sbRpc('cinetracker_set_episode_watched',{p_tmdb_id:tmdbId,p_season:season,p_episode:e,p_watched:true,p_title:e===episode?(title||null):null});
      }
      return true;
    }
  }
  await sbRpc('cinetracker_set_episode_watched',{p_tmdb_id:tmdbId,p_season:season,p_episode:episode,p_watched:true,p_title:title||null});
  return true;
}

document.addEventListener('click',async e=>{
  const card=e.target.closest('.ct47-card');
  if(card)currentMedia={type:card.dataset.type||'tv',id:Number(card.dataset.id||0)};

  const btn=e.target.closest('.ct47-seen');
  if(!btn||btn.dataset.seen==='1')return;
  const row=btn.closest('.ct47-ep');
  if(!row||!currentMedia.id)return;
  const season=Number(row.dataset.season||0),episode=Number(row.dataset.episode||0),title=row.dataset.name||'';
  if(!season||episode<2)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  btn.disabled=true;
  try{
    await markThrough(currentMedia.id,season,episode,title);
    btn.dataset.seen='1';btn.classList.add('on');btn.textContent='✓';
    setTimeout(()=>{sortFollowing();window.ct49Refresh&&window.ct49Refresh();},120);
  }catch(err){console.error('ct54 smart seen',err)}finally{btn.disabled=false}
},true);

async function tmdb(type,id,extra=''){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
  u.searchParams.set('path',`/${type}/${id}${extra}`);u.searchParams.set('language','pt-BR');
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});
  if(!r.ok)throw new Error(`TMDB ${r.status}`);
  return r.json();
}

async function addAvailability(){
  if(!currentMedia.id||!$('.ct47-hero')||$('.ct54-where'))return;
  try{
    const data=await tmdb(currentMedia.type||'tv',currentMedia.id,'/watch/providers');
    const br=data?.results?.BR||{};
    const names=[...(br.flatrate||[]),...(br.free||[]),...(br.ads||[])].map(x=>x.provider_name).filter(Boolean);
    const rent=(br.rent||[]).map(x=>x.provider_name).filter(Boolean);
    const buy=(br.buy||[]).map(x=>x.provider_name).filter(Boolean);
    const lines=[];
    if(names.length)lines.push(`<div class="ct54-line"><b>Streaming:</b> ${[...new Set(names)].join(', ')}</div>`);
    if(rent.length)lines.push(`<div class="ct54-line"><b>Aluguel:</b> ${[...new Set(rent)].join(', ')}</div>`);
    if(buy.length)lines.push(`<div class="ct54-line"><b>Compra:</b> ${[...new Set(buy)].join(', ')}</div>`);
    if((currentMedia.type||'tv')==='movie'){
      try{
        const rd=await tmdb('movie',currentMedia.id,'/release_dates');
        const brd=(rd.results||[]).find(x=>x.iso_3166_1==='BR');
        const th=(brd?.release_dates||[]).filter(x=>Number(x.type)===3).sort((a,b)=>new Date(a.release_date)-new Date(b.release_date))[0];
        if(th?.release_date)lines.push(`<div class="ct54-line"><b>Cinema:</b> estreia ${new Date(th.release_date).toLocaleDateString('pt-BR')}</div>`);
      }catch{}
    }
    if(!lines.length)lines.push('<div class="ct54-line">Disponibilidade não informada para o Brasil neste momento.</div>');
    const box=document.createElement('div');box.className='ct54-where';box.innerHTML='<strong>Onde assistir</strong>'+lines.join('');
    const overview=$('.ct47-overview'); if(overview)overview.after(box);
  }catch{}
}

function refreshVersion(){
  if(typeof view==='undefined'||view!=='settings')return;
  $$('*','#app').forEach?.(()=>{});
  for(const el of $$('#app *')){
    if(el.children.length)return;
    const t=(el.textContent||'').trim();
    if(/^0\.0\.\d+$/.test(t)&&el.parentElement&&/\bBuild\b/i.test(el.parentElement.textContent||''))el.textContent='0.0.54';
    if(/^CineTracker Android/i.test(t)&&/build/i.test(t))el.textContent='CineTracker Android • build 0.0.54';
  }
}

function refresh(){
  forceDiscover3();bindHomeCards();sortFollowing();addAvailability();refreshVersion();
}

window.ct54Navigate=(target)=>{
  try{
    if(typeof view!=='undefined'&&view!==target)navStack.push(view);
    if(typeof window.ct48Navigate==='function'&&window.ct48Navigate(target)){setTimeout(refresh,80);return true}
    if(typeof window.ct47Navigate==='function'&&window.ct47Navigate(target)){setTimeout(refresh,80);return true}
    view=target;render();window.scrollTo(0,0);setTimeout(refresh,80);return true;
  }catch{return false}
};

window.ct54Back=()=>{
  const epBack=$('#ct47-epback');if(epBack){epBack.click();return true}
  const detailBack=$('#ct47-back');if(detailBack&&$('.ct47-hero')){detailBack.click();return true}
  if(navStack.length){const prev=navStack.pop();try{if(window.ct48Navigate&&window.ct48Navigate(prev))return true;if(window.ct47Navigate&&window.ct47Navigate(prev))return true;view=prev;render();return true}catch{}}
  return false;
};

let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(refresh,100);setTimeout(refresh,500);setInterval(()=>{if(typeof view!=='undefined'&&view==='library')sortFollowing()},3000);
})();
