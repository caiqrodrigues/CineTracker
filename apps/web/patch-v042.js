(() => {
'use strict';
const VERSION='0.4.5';
const BUILD='0.0.27';
const onAuth=()=>!!document.querySelector('.auth-page,#auth-form,#auth-email,#auth-password')||!window.currentUser;

const css=document.createElement('style');
css.id='ct42-style';
css.textContent=`
.ct41-stat{text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}
.ct41-stat span,.ct41-stat strong,.ct41-stat small{text-align:center!important;width:100%!important}
.ct42-build{margin:26px 0 6px;padding:14px 0 4px;border-top:1px solid #1d2a36;color:#6f8191;font-size:11px;text-align:center}
`;
document.head.appendChild(css);

const directPoster=p=>p?`https://image.tmdb.org/t/p/w342${p}`:'';
const detailCache=new Map();
async function detail(type,id){
  const key=type+':'+id;if(detailCache.has(key))return detailCache.get(key);
  try{const raw=sessionStorage.getItem('ct42:'+key);if(raw){const v=JSON.parse(raw);if(Date.now()-v.t<86400000){detailCache.set(key,v.d);return v.d}}}catch{}
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}`);u.searchParams.set('language','pt-BR');
  const r=await fetch(u,{headers:authHeaders()});if(!r.ok)throw new Error('TMDB '+r.status);const d=await r.json();detailCache.set(key,d);try{sessionStorage.setItem('ct42:'+key,JSON.stringify({t:Date.now(),d}))}catch{}return d;
}
function identity(card){
  let id=Number(card.dataset.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0),type=card.dataset.tmdbType||card.dataset.ct29Type||card.dataset.apiType||'';
  const mid=card.dataset.mediaId||'';try{const item=window.mediaRegistry?.get?.(mid);if(item){id=id||Number(item.tmdbId||0);type=type||item.apiType||item.type||'';if(item.posterUrl){const p=card.querySelector('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster');if(p&&!p.style.backgroundImage)p.style.backgroundImage=`url('${item.posterUrl}')`}}}catch{}
  const m=mid.match(/^tmdb-(movie|tv)-(\d+)$/);if(!id&&m){type=m[1];id=Number(m[2])}
  type=String(type).toLowerCase();type=(type.includes('movie')||type.includes('filme'))?'movie':'tv';return{id,type};
}
let active=0;const queue=[];
function pump(){while(active<4&&queue.length){const fn=queue.shift();active++;Promise.resolve().then(fn).finally(()=>{active--;pump()})}}
function enqueue(fn){queue.push(fn);pump()}
function hydrate(card){
  if(onAuth()||card.dataset.ct42==='1')return;const poster=card.querySelector('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster');if(!poster)return;
  const titleEl=card.querySelector('h3,h2,.ct38-title,.ct30-fav-body strong,.ct30-history-body strong');const title=(titleEl?.textContent||'').trim();const bg=poster.style.backgroundImage||'';
  if(bg&&bg!=='none'&&!bg.includes('tmdb-image')&&!/^tmdb\s*#/i.test(title)){card.dataset.ct42='1';return}
  const {id,type}=identity(card);if(!id)return;card.dataset.ct42='1';
  enqueue(async()=>{try{const d=await detail(type,id);const real=d.title||d.name||title;if(d.poster_path){poster.style.backgroundImage=`url('${directPoster(d.poster_path)}')`;poster.style.backgroundSize='cover';poster.style.backgroundPosition='center 18%'}if(titleEl&&real&&(!title||/^tmdb\s*#/i.test(title)))titleEl.textContent=real}catch{card.dataset.ct42='0'}})
}
const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){io.unobserve(e.target);hydrate(e.target)}},{rootMargin:'160px 0px'});
function observeCards(){if(onAuth())return;document.querySelectorAll('.card,.feature,.ct38-card,.ct30-fav,.ct30-history-card').forEach(c=>{if(!c.dataset.ct42Observed){c.dataset.ct42Observed='1';io.observe(c)}})}
function settingsFooter(){
  if(onAuth())return;const body=(document.body.textContent||'').toLowerCase();const isSettings=body.includes('segurança e acesso')||body.includes('importar e exportar');if(!isSettings)return;
  const content=document.querySelector('.content,#app');if(!content||document.getElementById('ct42-build'))return;const f=document.createElement('div');f.id='ct42-build';f.className='ct42-build';f.textContent=`CineTracker Android • build ${BUILD}`;content.appendChild(f);
}
function run(){if(onAuth())return;observeCards();settingsFooter()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;run()})}).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
setTimeout(run,0);setTimeout(run,350);
})();
