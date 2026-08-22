(() => {
'use strict';
const VERSION='0.4.3';
const image=(p,s='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${encodeURIComponent(s)}`:'';
const cache=new Map();
const css=document.createElement('style');css.id='ct41-style';css.textContent=`
/* Perfil compacto em 3 linhas */
.ct41-profile-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
.ct41-stat{border:1px solid #172b3d;background:#081019;border-radius:14px;padding:14px;min-width:0}
.ct41-stat span{display:block;color:#86a3be;font-size:10px;text-transform:uppercase}
.ct41-stat strong{display:block;font-size:21px;margin-top:6px;line-height:1.15;white-space:nowrap}
.ct41-stat small{display:block;color:#b7c7d5;font-size:12px;margin-top:6px;white-space:nowrap}
.ct41-total{grid-column:1/-1;text-align:center}
.ct41-total strong{font-size:24px}
@media(max-width:560px){.ct41-profile-stats{grid-template-columns:1fr 1fr;gap:8px}.ct41-stat{padding:12px}.ct41-stat strong{font-size:18px}.ct41-stat small{font-size:10px}.ct41-total strong{font-size:22px}}
`;
document.head.appendChild(css);

async function tmdb(type,id){const key=type+':'+id;if(cache.has(key))return cache.get(key);try{const raw=sessionStorage.getItem('ct41:'+key);if(raw){const v=JSON.parse(raw);if(Date.now()-v.t<86400000){cache.set(key,v.d);return v.d}}}catch{}const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',`/${type}/${id}`);u.searchParams.set('language','pt-BR');const r=await fetch(u,{headers:authHeaders()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error('TMDB '+r.status);cache.set(key,d);try{sessionStorage.setItem('ct41:'+key,JSON.stringify({t:Date.now(),d}))}catch{}return d}
function mediaIdentity(card){let id=Number(card.dataset.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0),type=card.dataset.tmdbType||card.dataset.ct29Type||card.dataset.apiType||'';const mid=card.dataset.mediaId||'';try{const item=mediaRegistry?.get?.(mid);if(item){id=id||Number(item.tmdbId||0);type=type||item.apiType||item.type||''}}catch{}const m=mid.match(/^tmdb-(movie|tv)-(\d+)$/);if(!id&&m){type=m[1];id=Number(m[2])}type=String(type).toLowerCase();if(type.includes('movie')||type.includes('filme'))type='movie';else type='tv';return{id,type}}
async function hydrateCard(card){if(card.dataset.ct41==='1')return;const poster=card.querySelector('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster');if(!poster)return;const bg=poster.style.backgroundImage||'';const titleEl=card.querySelector('h3,h2,.ct38-title,.ct30-fav-body strong,.ct30-history-body strong');const title=(titleEl?.textContent||'').trim();if(bg&&bg!=='none'&&!/^tmdb\s*#/i.test(title))return;const {id,type}=mediaIdentity(card);if(!id)return;card.dataset.ct41='1';try{const d=await tmdb(type,id);const real=d.title||d.name||title;if(d.poster_path){poster.style.backgroundImage=`url('${image(d.poster_path,'w342')}')`;poster.style.backgroundSize='cover';poster.style.backgroundPosition='center 18%'}if(titleEl&&real&&(!title||/^tmdb\s*#/i.test(title)))titleEl.textContent=real}catch{card.dataset.ct41='0'}}
const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){io.unobserve(e.target);hydrateCard(e.target)}},{rootMargin:'500px 0px'});
function watchCards(){document.querySelectorAll('.card,.feature,.ct38-card,.ct30-fav,.ct30-history-card').forEach(c=>{if(!c.dataset.ct41Observed){c.dataset.ct41Observed='1';io.observe(c)}})}

function profileCompact(){if(typeof view!=='undefined'&&view!=='profile')return;const old=document.querySelector('.ct30-stat-grid');if(!old||old.dataset.ct41done)return;const cards=[...old.querySelectorAll('.ct30-stat')];const val=label=>cards.find(c=>(c.querySelector('span')?.textContent||'').trim().toLowerCase()===label)?.querySelector('strong')?.textContent?.trim()||'0';const episodes=val('episódios vistos'),series=val('séries acompanhadas'),seriesTime=val('tempo em séries'),movies=val('filmes vistos'),movieTime=val('tempo em filmes'),total=val('tempo total assistido');const n=document.createElement('div');n.className='ct41-profile-stats';n.innerHTML=`<div class="ct41-stat"><span>Séries e episódios</span><strong>${episodes} episódios</strong><small>de ${series} séries acompanhadas</small></div><div class="ct41-stat"><span>Tempo em séries</span><strong>${seriesTime}</strong></div><div class="ct41-stat"><span>Filmes assistidos</span><strong>${movies}</strong></div><div class="ct41-stat"><span>Tempo em filmes</span><strong>${movieTime}</strong></div><div class="ct41-stat ct41-total"><span>Tempo total assistido</span><strong>${total}</strong></div>`;old.replaceWith(n)}

let homeRetry=0,homeTimer=0;
function homeFirstPaint(){if(typeof view!=='undefined'&&view!=='home'){homeRetry=0;return}const sections=[...document.querySelectorAll('.section')].filter(s=>/Da sua Watchlist|Fora da lista/i.test(s.querySelector('.section-title h2')?.textContent||''));for(const s of sections){const g=s.querySelector('.grid');if(g){g.classList.add('ct36-trio','ct-home-trio')}}const trioCount=sections.reduce((n,s)=>n+s.querySelectorAll('.card').length,0);if(trioCount<6&&homeRetry<8){homeRetry++;clearTimeout(homeTimer);homeTimer=setTimeout(()=>{try{if(typeof render==='function'&&view==='home')render()}catch{}setTimeout(run,30)},350)}else homeRetry=0}
function run(){profileCompact();homeFirstPaint();watchCards()}
let queued=false;const mo=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})});mo.observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
setTimeout(run,0);setTimeout(run,500);setTimeout(run,1500);
})();
