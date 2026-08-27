(() => {
'use strict';
if (window.__ct0992FixLoaded) return;
window.__ct0992FixLoaded = true;
window.__ct0992Fix = 'authoritative-runtime-navigation-profile-writes';
const VERSION='0.99.2';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';

/* v0.99.1 timeline used a strict-mode global identifier. Keep a real global binding so the
   historical implementation can render while 0.99.2 remains the release identity. */
if (!('days' in window)) window.days=[];

/* Central write hardening. Legacy v95/v99.1 actions omit profile_id and some media inserts omit
   media_kind. Inject only fields required by the authenticated schema; explicit values win. */
const rawSbApi=window.sbApi;
if (typeof rawSbApi==='function' && !rawSbApi.__ct0992Wrapped) {
  const wrapped=async function(path,options={}){
    let next=options;
    const method=String(options?.method||'GET').toUpperCase();
    if(method==='POST' && typeof options?.body==='string'){
      try{
        const parsed=JSON.parse(options.body),table=String(path||'').split('?')[0];
        const pid=window.currentUser?.id || (typeof currentUser!=='undefined'&&currentUser?currentUser.id:null);
        const fixOne=o=>{
          if(!o||typeof o!=='object'||Array.isArray(o))return o;
          const v={...o};
          if(pid&&['watch_history','episode_progress','media_overrides'].includes(table)&&!v.profile_id)v.profile_id=pid;
          if(table==='media'&&!v.media_kind){
            if(v.media_type==='movie')v.media_kind='movie';
            else if(v.media_type==='tv'){
              const raw=v.raw_tmdb||{},ids=(raw.genre_ids||raw.genres?.map?.(g=>g.id)||[]).map(Number),countries=raw.origin_country||[];
              v.media_kind=ids.includes(16)&&(countries.includes('JP')||countries.length===0)?'anime':'series';
            }
          }
          return v;
        };
        const body=Array.isArray(parsed)?parsed.map(fixOne):fixOne(parsed);
        next={...options,body:JSON.stringify(body)};
      }catch{}
    }
    return rawSbApi(path,next);
  };
  wrapped.__ct0992Wrapped=true;
  window.sbApi=wrapped;
}

const baseNavigate992=window.ct0992Navigate;
const baseNavigate991=window.ct991Navigate;
const baseOpen=window.ct92OpenMedia||window.ct91OpenMedia;

function currentView(){try{return String(view||window.view||'home')}catch{return String(window.view||'home')}}
function setCurrent(v){try{view=v}catch{}try{window.view=v}catch{}}
function desiredNav(active){return [
  ['home','⌂ Home','Home'],['discover','✦ Descobrir','Descobrir'],['profile','◉ Perfil','Perfil'],['settings','⚙ Configurações','Config.']
].map(([v,desk,mob])=>({v,desk,mob,active:v===active}))}
function canonicalNav(){
  const active=currentView()==='history'?'profile':currentView(),items=desiredNav(active);
  const desk=$('.sidebar .nav'),mobile=$('.mobile-nav');
  if(desk){const sig=[...desk.querySelectorAll('button')].map(b=>`${b.dataset.view||b.dataset.view991||''}:${(b.textContent||'').trim()}`).join('|'),want=items.map(x=>`${x.v}:${x.desk}`).join('|');if(sig!==want)desk.innerHTML=items.map(x=>`<button data-view="${x.v}" class="${x.active?'active':''}">${x.desk}</button>`).join('')}
  if(mobile){const sig=[...mobile.querySelectorAll('button')].map(b=>`${b.dataset.view||b.dataset.view991||''}:${(b.textContent||'').trim()}`).join('|'),want=items.map(x=>`${x.v}:${x.mob}`).join('|');if(sig!==want)mobile.innerHTML=items.map(x=>`<button data-view="${x.v}" class="${x.active?'active':''}">${x.mob}</button>`).join('')}
  $$('.sidebar .nav button,.mobile-nav button').forEach(b=>b.classList.toggle('active',(b.dataset.view||b.dataset.view991)===active));
}
function canonicalFooter(){
  const host=$('.content');if(!host)return;
  $$('.ct991-version,.ct99-version,.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version',host).forEach(x=>x.style.display='none');
  let f=$('.ct992-version',host);if(!f){f=document.createElement('div');f.className='ct992-version';host.appendChild(f)}f.textContent='CineTracker • v0.99.2';window.__ctAndroidBuild=VERSION;
}
function settle(){for(const ms of [0,40,120,300,700])setTimeout(()=>{canonicalNav();canonicalFooter();decorateProfileHeaders()},ms)}

function navigate(target){
  const t=target==='history'?'profile':target;if(!['home','discover','profile','settings'].includes(t))return false;
  if(t==='profile'&&!('days' in window))window.days=[];
  setCurrent(t);
  let result;
  if(t==='home'&&typeof baseNavigate992==='function')result=baseNavigate992('home');
  else if(typeof baseNavigate991==='function')result=baseNavigate991(t);
  else if(typeof baseNavigate992==='function')result=baseNavigate992(t);
  settle();Promise.resolve(result).finally(settle);return result??true;
}
window.ct0992Navigate=navigate;window.ct991Navigate=navigate;window.ct98Navigate=navigate;

/* Window capture runs before every legacy document-capture handler. This is the authoritative
   desktop/mobile navigation gate and prevents stopImmediatePropagation conflicts from old patches. */
window.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-view],[data-view99],[data-view991]');if(!b)return;
  const t=b.dataset.view||b.dataset.view99||b.dataset.view991;if(!['home','discover','profile','settings','history'].includes(t))return;
  e.preventDefault();e.stopImmediatePropagation();navigate(t);
},true);

function openLocal(row){const o=document.createElement('div');o.className='ct991-modal';o.innerHTML=`<div class="ct991-modal-card"><div class="ct991-modal-head"><h3>${esc(row.title||'Sem título')}</h3><button class="ct991-close" data-close-fix>Fechar</button></div><div class="ct991-local"><div class="ct991-local-poster"${row.poster_path?` style="background-image:url('${image(row.poster_path,'w500')}')"`:''}></div><div><p>${row.media_type==='movie'?'Filme':'Série'}</p><p>${row.media_type==='tv'?`${Number(row.watched_episodes||0)}/${Number(row.total_episodes||0)||'—'} episódios`:(row.is_seen?'Visto ✓':'Não visto')}</p></div></div></div>`;document.body.appendChild(o);$('[data-close-fix]',o).onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()}}
function openMedia(row){const id=Number(row.tmdb_id||0);if(id>0&&typeof baseOpen==='function')baseOpen(row.media_type,id);else openLocal(row)}
function miniCard(row){const seen=Number(row.watched_episodes||0),total=Number(row.total_episodes||0),p=row.media_type==='movie'?(row.is_seen?'Visto ✓':'Na Watchlist'):(total?`${seen}/${total}`:`${seen} episódios`);return `<button class="ct991-card" data-fix-media="${row.media_id}"><div class="ct991-poster"${row.poster_path?` style="background-image:url('${image(row.poster_path)}')"`:''}>${row.is_favorite?'<span class="ct991-fav">♥</span>':''}</div><div class="ct991-body"><b>${esc(row.title)}</b><div class="ct991-progress">${esc(p)}</div></div></button>`}
let expandRows=[];
async function openExpanded(kind){
  const rows=await sbRpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>sbRpc('cinetracker_profile_media_dashboard',{}).catch(()=>[]));expandRows=Array.isArray(rows)?rows:[];
  const series=expandRows.filter(x=>x.media_type==='tv'),movies=expandRows.filter(x=>x.media_type==='movie');
  const groups=kind==='series'?[['Em andamento',series.filter(x=>x.is_in_progress)],['Não iniciadas / Watchlist',series.filter(x=>x.is_watchlist&&!x.is_seen)],['Assistir mais tarde / Watchlist',series.filter(x=>x.is_watch_later||x.is_added_to_watchlist)],['Em dia',series.filter(x=>x.is_up_to_date)],['Concluídas',series.filter(x=>x.is_completed)]]:kind==='movies'?[['Assistir a seguir / Watchlist',movies.filter(x=>x.is_watchlist&&!x.is_seen)],['Já vistos',movies.filter(x=>x.is_seen)]]:kind==='series-fav'?[['Séries favoritas',series.filter(x=>x.is_favorite)]]:[['Filmes favoritos',movies.filter(x=>x.is_favorite)]];
  const o=document.createElement('div');o.className='ct991-modal';o.innerHTML=`<div class="ct991-modal-card" style="width:min(980px,100%)"><div class="ct991-modal-head"><h3>${kind.startsWith('series')?'Séries':'Filmes'}</h3><button class="ct991-close" data-close-fix>Fechar</button></div>${groups.map(([name,list])=>`<section class="ct991-section"><div class="ct991-head"><h3>${name}</h3><span class="ct991-count">${list.length}</span></div><div class="ct991-items grid">${list.map(miniCard).join('')||'<div class="ct991-empty">Nenhum item.</div>'}</div></section>`).join('')}</div>`;document.body.appendChild(o);$('[data-close-fix]',o).onclick=()=>o.remove();$$('[data-fix-media]',o).forEach(b=>b.onclick=()=>openMedia(expandRows.find(x=>Number(x.media_id)===Number(b.dataset.fixMedia))));o.onclick=e=>{if(e.target===o)o.remove()}
}
function decorateProfileHeaders(){
  const sections=$$('#ct991-profile .ct991-sections > .ct991-section');if(sections.length<4)return;
  [['series','Séries'],['series-fav','Séries favoritas'],['movies','Filmes'],['movies-fav','Filmes favoritos']].forEach(([kind,label],i)=>{const h=sections[i]?.querySelector('.ct991-head h3');if(!h)return;h.dataset.expand992fix=kind;h.tabIndex=0;h.style.cursor='pointer';h.textContent=`${label} ›`;h.title='Abrir visualização completa'});
}
window.addEventListener('click',e=>{const h=e.target?.closest?.('[data-expand992fix]');if(!h)return;e.preventDefault();e.stopImmediatePropagation();void openExpanded(h.dataset.expand992fix)},true);
window.addEventListener('keydown',e=>{const h=e.target?.closest?.('[data-expand992fix]');if(h&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void openExpanded(h.dataset.expand992fix)}});

let obsTimer=null;const obs=new MutationObserver(()=>{clearTimeout(obsTimer);obsTimer=setTimeout(()=>{canonicalNav();canonicalFooter();decorateProfileHeaders()},50)});setTimeout(()=>{const app=$('#app');if(app)obs.observe(app,{childList:true,subtree:true})},250);
window.addEventListener('cinetracker:data-changed',settle);

/* Re-render the actual current destination once all legacy patches have initialized. */
setTimeout(()=>{const v=currentView()==='history'?'profile':currentView();navigate(['home','discover','profile','settings'].includes(v)?v:'home')},760);
})();
