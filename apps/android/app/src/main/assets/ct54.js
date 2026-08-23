(() => {
'use strict';
if(window.__ct54Loaded)return;window.__ct54Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let active={id:0,type:'tv'};

const style=document.createElement('style');style.id='ct54-style';style.textContent=`
.ct48-next,.ct48-card-check,[data-ct50-seen],.ct47-seen{background:#0b131a!important;border-color:#2b4051!important;color:#d7dee4!important;box-shadow:none!important}
.ct48-next.ct54-clicked,.ct48-card-check.ct54-clicked,[data-ct50-seen].ct52-on,[data-ct50-seen].ct54-on,.ct47-seen.on,.ct47-seen.ct52-on{background:#153a25!important;border-color:#39754d!important;color:#a8dfb7!important}
.ct54-following{background:#102331!important;border-color:#31536d!important;color:#9bc9ea!important}
.ct48-home-card{min-height:126px!important}.ct48-home-body{padding:10px!important}.ct48-home-actions{margin-top:8px!important}
.ct47-card{min-height:0!important}.ct47-card .ct47-body{min-height:0!important;padding-bottom:10px!important}
.ct54-hide{display:none!important}
`;
document.head.appendChild(style);

function rememberActive(){document.addEventListener('click',e=>{const c=e.target.closest('[data-media-id].card,.ct47-card[data-id],.ct48-home-card[data-id]');if(!c)return;if(c.dataset.mediaId){const m=String(c.dataset.mediaId).match(/^tmdb-(movie|tv)-(\d+)$/);if(m)active={type:m[1],id:Number(m[2])}}else active={type:c.dataset.type==='movie'?'movie':'tv',id:Number(c.dataset.id||0)}},true)}

function cleanRepeatedScores(){
  $$('.ct50-card-score').forEach((el,i,all)=>{const host=el.parentElement;if(!host)return;const same=all.filter(x=>x.parentElement===host);if(same[0]!==el)el.remove()});
  $$('.ct48-home-meta,.ct47-meta,.media-meta,.rating-row').forEach(el=>{
    const score=$('.ct50-card-score',el);let raw=(el.textContent||'').replace(score?.textContent||'',' ');
    raw=raw.replace(/(?:\s*[·•|]?\s*★?\s*\d{1,2}(?:[.,]\d)?\s*){2,}$/g,' ').replace(/\s+/g,' ').trim();
    if(!raw)return;
    [...el.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());
    el.insertBefore(document.createTextNode(raw+(score?' · ':'')),el.firstChild);
  });
}

function normalizeHomeProgress(){
  $$('.ct48-home-card').forEach(card=>{
    const meta=$('.ct48-home-meta',card);if(!meta)return;
    const text=(meta.textContent||'').replace(/\s+/g,' ');
    const kind=(text.match(/\b(ANIME|SÉRIE)\b/i)||[])[1]||'SÉRIE';
    const prog=(text.match(/\b\d{1,4}\s*\/\s*\d{1,4}\b/)||[])[0];
    const faltam=(text.match(/Faltam\s+\d{1,4}\s+episódios?/i)||[])[0];
    const rating=(text.match(/★\s*\d{1,2}(?:[.,]\d)?/)||[])[0];
    const bits=[kind.toUpperCase(),prog,faltam,rating].filter(Boolean);
    if(bits.length>=2)meta.textContent=bits.join(' · ');
  });
}

async function detailState(){
  if(!active.id||!$('.ct50-actions'))return;
  let seen=false,following=false,watchlist=false;
  try{
    const [over,cont]=await Promise.all([
      sbApi('media_overrides?select=state,media:media(tmdb_id,media_type)&limit=5000').catch(()=>[]),
      active.type==='tv'?sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]):Promise.resolve([])
    ]);
    for(const r of over||[]){const m=r?.media;if(!m||Number(m.tmdb_id)!==active.id||m.media_type!==active.type)continue;if(['AlreadySeen','Completed'].includes(r.state))seen=true;if(r.state==='AddedToWatchlist'||r.state==='WatchLater')watchlist=true}
    if(active.type==='tv')following=(cont||[]).some(r=>Number(r.tmdb_id)===active.id&&['following','in_progress'].includes(String(r.status||'').toLowerCase()));
  }catch{}
  const seenBtn=$('[data-ct50-seen]');if(seenBtn){seenBtn.classList.toggle('ct54-on',seen);seenBtn.textContent=seen?'✓ Assistido':'Assistido'}
  const watchBtn=$('[data-ct50-watch]');if(watchBtn){
    watchBtn.classList.remove('ct54-following');
    if(following){watchBtn.textContent='Acompanhando';watchBtn.classList.add('ct54-following');watchBtn.disabled=true}
    else{watchBtn.disabled=false;watchBtn.textContent=watchlist?'Na Watchlist':'＋ Watchlist'}
  }
}

function fixEpisodeAndHomeButtons(){
  $$('.ct47-seen').forEach(b=>{b.textContent=b.classList.contains('on')?'✓ Assistido':'Assistido'});
  $$('.ct48-next,.ct48-card-check').forEach(b=>{if(/Em dia|Tentar novamente/i.test(b.textContent||''))return;b.textContent='Assistido';if(!b.dataset.ct54Bound){b.dataset.ct54Bound='1';b.addEventListener('click',()=>{b.classList.add('ct54-clicked');setTimeout(()=>b.classList.remove('ct54-clicked'),1400)},true)}});
}

function fixProfileLoading(){
  if(typeof view==='undefined'||view!=='profile')return;
  const hasChart=!!($('.ct41-wrap')||$('.ct52-profile-chart'));
  if(!hasChart)return;
  $$('*').filter(el=>el.children.length===0&&/^Carregando perfil\.\.\.$/i.test((el.textContent||'').trim())).forEach(el=>{const p=el.closest('.panel,.card,section,div');if(p&&p!==$('.content'))p.remove();else el.remove()});
  const body=$('#ct43-screen-body');if(body)body.style.removeProperty('display');
  const full=$('.ct43-full');if(full)full.style.removeProperty('display');
}

function unifyDetailRatings(){
  const hero=$('.ct47-hero');if(!hero)return;
  const official=$('.ct50-ratingbar');if(!official)return;
  const siblings=[...hero.parentElement.children];
  for(const el of siblings){if(el===official||el.classList.contains('ct50-actions')||el===hero)continue;const t=(el.textContent||'').trim();if(/TMDB\s*\d/i.test(t)&&( /IMDb|temporadas|episódios|avaliações/i.test(t) ))el.classList.add('ct54-hide')}
}

function fixBuild(){if(typeof view!=='undefined'&&view==='settings'){const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.64'}}
async function applyAsync(){await detailState()}
function apply(){fixBuild();cleanRepeatedScores();normalizeHomeProgress();fixEpisodeAndHomeButtons();fixProfileLoading();unifyDetailRatings();void applyAsync()}
rememberActive();let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,80);setTimeout(apply,450);setTimeout(apply,1200);
})();
