(() => {
'use strict';
if(window.__ct52Loaded)return;window.__ct52Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let profileBusy=false,profileCache=null,profileAt=0,active={id:0,type:'tv'};

const css=document.createElement('style');css.id='ct52-style';css.textContent=`
/* 0.0.62: estado visual consistente de Assistido + recuperação do gráfico. */
.ct50-action.primary,.ct48-next,.ct48-card-check,.ct47-seen{background:#0b131a!important;border-color:#2b4051!important;color:#d7dee4!important;box-shadow:none!important}
.ct50-action.primary.ct52-on,.ct48-next.ct52-on,.ct48-card-check.ct52-on,.ct47-seen.on,.ct47-seen.ct52-on{background:#153a25!important;border-color:#39754d!important;color:#a8dfb7!important}
.ct52-profile-chart{margin:12px 0;border:1px solid #1d2b37;border-radius:15px;background:#090e12;padding:12px}.ct52-profile-title{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:10px}.ct52-profile-title strong{font-size:12px}.ct52-profile-title span{font-size:9px;color:#83919b}.ct52-profile-bars{height:155px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;align-items:end}.ct52-profile-day{min-width:0;text-align:center}.ct52-profile-slot{height:112px;display:flex;align-items:flex-end;justify-content:center}.ct52-profile-bar{width:68%;min-height:3px;border-radius:5px 5px 2px 2px;background:#5d93ba}.ct52-profile-day.today .ct52-profile-bar{background:#d6b55b}.ct52-profile-n{font-size:10px;font-weight:700;margin-top:5px}.ct52-profile-l{font-size:7px;color:#7c8993;margin-top:3px;white-space:nowrap}.ct52-profile-empty{font-size:10px;color:#82909a;padding:12px 2px}
`;
document.head.appendChild(css);

function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function mediaKey(type,id){return `tmdb-${type}-${Number(id)}`}
function rememberActive(){document.addEventListener('click',e=>{const c=e.target.closest('[data-media-id].card,.ct47-card[data-id],.ct48-home-card[data-id]');if(!c)return;if(c.dataset.mediaId){const m=String(c.dataset.mediaId).match(/^tmdb-(movie|tv)-(\d+)$/);if(m)active={type:m[1],id:Number(m[2])}}else active={type:c.dataset.type==='movie'?'movie':'tv',id:Number(c.dataset.id||0)}},true)}

function buttonStateFromDom(){
  $$('.ct47-seen').forEach(b=>b.classList.toggle('ct52-on',b.classList.contains('on')));
  $$('[data-ct50-seen]').forEach(b=>{if(b.dataset.ct52Known==='1')b.classList.add('ct52-on');else b.classList.remove('ct52-on')});
}
async function syncDetailSeen(){
  if(!active.id)return;
  try{
    const rows=await sbApi(`media_overrides?select=state,media:media(tmdb_id,media_type)&limit=5000`);let seen=false;
    for(const r of rows||[]){const m=r?.media;if(!m)continue;if(Number(m.tmdb_id)===active.id&&m.media_type===active.type&&['AlreadySeen','Completed'].includes(r.state)){seen=true;break}}
    const b=$('[data-ct50-seen]');if(b){b.dataset.ct52Known=seen?'1':'0';b.classList.toggle('ct52-on',seen)}
  }catch{}
}
function bindSeenFeedback(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-ct50-seen],.ct48-next,.ct48-card-check,.ct47-seen');if(!b)return;
    if(b.matches('.ct47-seen')){setTimeout(()=>buttonStateFromDom(),250);return}
    if(b.matches('[data-ct50-seen]')){setTimeout(()=>{b.dataset.ct52Known='1';b.classList.add('ct52-on');void syncDetailSeen()},500);return}
    b.classList.add('ct52-on');setTimeout(()=>b.classList.remove('ct52-on'),1200);
  },true)
}

function sanitizeHomeMeta(){
  $$('.ct48-home-card .ct48-home-meta').forEach(el=>{
    const score=$('.ct50-card-score',el);const raw=(el.textContent||'').replace(score?.textContent||'',' ').replace(/\s+/g,' ').trim();
    const kind=(raw.match(/\b(ANIME|SÉRIE)\b/i)||[])[1]||'SÉRIE';
    const ep=(raw.match(/T\d{1,2}\s*E\d{1,3}/i)||[])[0];
    const progress=(raw.match(/\b\d{1,4}\s*\/\s*\d{1,4}\b/)||[])[0];
    const faltam=(raw.match(/Faltam\s+\d{1,4}\s+episódios?/i)||[])[0];
    const bits=[kind.toUpperCase(),ep,progress,faltam].filter(Boolean);
    if(bits.length<2)return;
    const stable=bits.join(' · ');
    const textNodes=[...el.childNodes].filter(n=>n.nodeType===3);textNodes.forEach(n=>n.remove());
    el.insertBefore(document.createTextNode(stable+(score?' ':'') ),el.firstChild);
  })
}

async function profileData(){
  if(profileCache&&Date.now()-profileAt<30000)return profileCache;
  if(profileBusy)return null;profileBusy=true;
  try{profileCache=await sbRpc('cinetracker_watch_daily_timeline',{p_days_back:15,p_days_forward:3});profileAt=Date.now();return profileCache}catch{return null}finally{profileBusy=false}
}
function dlabel(v){const d=new Date(String(v)+'T12:00:00');return d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}
async function ensureProfileChart(){
  if(typeof view==='undefined'||view!=='profile')return;
  $$('.ct41-wrap').forEach(x=>x.style.setProperty('display','block','important'));
  if($('.ct41-wrap')){$('.ct52-profile-chart')?.remove();return}
  const host=$('#ct43-screen-body')||$('.ct43-full')||$('.content');if(!host||$('.ct52-profile-chart',host))return;
  const data=await profileData();if(typeof view==='undefined'||view!=='profile'||!data)return;
  const days=(data.days||[]);const today=String(data.today||'');const idx=days.findIndex(x=>String(x.date)===today);const start=Math.max(0,idx<0?Math.max(0,days.length-7):idx-3);const windowDays=days.slice(start,start+7);const max=Math.max(1,...windowDays.map(x=>Number(x.episodes||0)));
  const box=document.createElement('section');box.className='ct52-profile-chart';box.innerHTML=`<div class="ct52-profile-title"><strong>Episódios por dia</strong><span>últimos dias</span></div>${windowDays.length?`<div class="ct52-profile-bars">${windowDays.map(x=>{const n=Number(x.episodes||0),is=String(x.date)===today;return `<div class="ct52-profile-day${is?' today':''}"><div class="ct52-profile-slot"><div class="ct52-profile-bar" style="height:${Math.max(3,Math.round(n/max*100))}%"></div></div><div class="ct52-profile-n">${n}</div><div class="ct52-profile-l">${dlabel(x.date)}</div></div>`}).join('')}</div>`:'<div class="ct52-profile-empty">Sem dados de atividade.</div>'}`;
  const grid=$('.ct43-full-grid',host);if(grid)grid.before(box);else host.prepend(box)
}
function fixLoadingArtifacts(){
  if(typeof view==='undefined')return;
  if(view!=='history')$$('.ct47-loading,.loading').filter(x=>/Carregando (detalhes|histórico)/i.test(x.textContent||'')).forEach(x=>{if(!x.closest('.ct47-detail'))x.remove()});
}
function fixBuild(){if(typeof view!=='undefined'&&view==='settings'){const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.62'}}
async function applyAsync(){await ensureProfileChart();await syncDetailSeen()}
function apply(){fixBuild();sanitizeHomeMeta();buttonStateFromDom();fixLoadingArtifacts();void applyAsync()}
rememberActive();bindSeenFeedback();let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,80);setTimeout(apply,450);setTimeout(apply,1200);setInterval(()=>{if(typeof view!=='undefined'&&view==='profile')void ensureProfileChart()},2500);
})();
