/* CineTracker Web 1.0.24 r232 — final Web consolidation on top of 1.0.23 Sports. */
(()=>{
'use strict';
if(window.__ctR232V124)return;
window.__ctR232V124='final-web-consolidation-preserve-v123-sports';
window.__ctV124Discover='semantic-empty+year-genres+stable-actions';
window.__ctV124Profile='same-renderable-rows-for-count-and-modal';
window.__ctV124Sports='preserve-v123-authority';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const mid=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const mtype=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
const title=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'').trim();
const year=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4))||0;
const GEN={12:'Aventura',14:'Fantasia',16:'Animação',18:'Drama',27:'Terror',28:'Ação',35:'Comédia',36:'História',37:'Faroeste',53:'Suspense',80:'Crime',99:'Documentário',878:'Ficção científica',9648:'Mistério',10402:'Música',10749:'Romance',10751:'Família',10752:'Guerra',10759:'Ação e Aventura',10762:'Infantil',10764:'Reality',10765:'Sci-Fi e Fantasia',10766:'Novela',10768:'Guerra e Política'};
const genreNames=x=>{const named=(x?.genres||x?.raw_tmdb?.genres||[]).map(g=>g?.name).filter(Boolean);const ids=(x?.genre_ids||x?.raw_tmdb?.genre_ids||[]).map(Number).map(i=>GEN[i]).filter(Boolean);return [...new Set(named.length?named:ids)].slice(0,3)};
const cardTitle=c=>qa('b,strong,h3,h4,.title,.name',c).map(e=>String(e.textContent||'').trim()).find(Boolean)||String(c.innerText||'').split('\n').map(s=>s.trim()).find(s=>s&&!/^(filme|s[eé]rie|anime|na watchlist|buscando|sem item|[＋+↻])$/i.test(s)&&!/[★☆]\s*\d/.test(s))||'';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function stripLegends(){
 for(const e of qa('small,p,span,div')){
  if(e.childElementCount!==0)continue;
  const t=norm(e.textContent);
  if(!t||t.length>320)continue;
  if(t.startsWith('regra ativa personalizado')||t.includes('baseado nos seus vistos e favoritos')||t.includes('prioridade pelo seu gosto')||t.includes('separado de filmes e series')||t.includes('filmes e series ficam nas estatisticas acima')||t.includes('respeita historico progresso e watchlist'))e.remove();
 }
}
function poolIndex(){
 const m=new Map(),all=[];
 for(const k of ['movie','series','anime'])for(const x of(window.__ctV118LastPools?.[k]||[]))all.push(x);
 try{all.push(...(profileCache?.dashboard||[]))}catch{}
 for(const x of all){const k=norm(title(x));if(k&&!m.has(k))m.set(k,x)}
 return m;
}
function actionKind(b){
 const raw=String(b?.textContent||'').trim(),t=norm(raw),a=norm(b?.getAttribute?.('aria-label')||'');
 if(raw==='↻'||t.includes('trocar')||a.includes('trocar'))return'swap';
 if(raw==='+'||raw==='＋'||t.includes('watchlist')||a.includes('watchlist'))return'watch';
 return'';
}
function ensureActionBar(card){
 let bar=q(':scope > .ct122-media-actions',card);
 if(!bar){bar=document.createElement('div');bar.className='ct122-media-actions';card.appendChild(bar)}
 const candidates=qa('button,a',card).filter(b=>actionKind(b));
 for(const kind of ['watch','swap']){
  const found=candidates.filter(b=>actionKind(b)===kind);
  if(!found.length)continue;
  const keep=found[0];for(const x of found.slice(1))x.remove();
  keep.classList.add('ct122-media-action');keep.textContent=kind==='watch'?'＋':'↻';
  keep.setAttribute('aria-label',kind==='watch'?'Adicionar à Watchlist':'Trocar');
  keep.setAttribute('title',kind==='watch'?'Adicionar à Watchlist':'Trocar');
  if(keep.parentElement!==bar)bar.appendChild(keep);
 }
 if(!bar.children.length){bar.remove();return null}
 return bar;
}
async function metadataFor(x){
 if(!x)return null;if(year(x)&&genreNames(x).length)return x;
 if(typeof safeTmdb!=='function'||mid(x)<=0)return x;
 try{return {...x,...await safeTmdb(`/${mtype(x)==='movie'?'movie':'tv'}/${mid(x)}`)}}catch{return x}
}
let discoverTask=null;
async function discover(){
 if(discoverTask)return discoverTask;
 discoverTask=(async()=>{
  const root=q('[data-page="discover"],[data-discover]');if(!root)return;
  const idx=poolIndex();
  const sections=qa('section,.panel',root).filter(sec=>['indicacao do dia','da sua watchlist','100 novos'].includes(norm(q('h2,h3',sec)?.textContent||'')));
  for(const sec of sections){
   sec.classList.add('ct124-section');
   const cards=qa('article,.card,.media-card',sec).filter(c=>q('img',c));
   for(const card of cards){
    card.classList.add('ct124-card','ct122-media-card');
    const bar=ensureActionBar(card);
    const x=idx.get(norm(cardTitle(card)));
    if(x){const d=await metadataFor(x);const text=[year(d),genreNames(d).join(', ')].filter(Boolean).join(' · ');if(text){let info=q(':scope > .ct122-media-info',card);if(!info){info=document.createElement('div');info.className='ct122-media-info';bar?card.insertBefore(info,bar):card.appendChild(info)}let meta=q('.ct122-card-meta',info);if(!meta){meta=document.createElement('div');meta.className='ct122-card-meta';info.appendChild(meta)}meta.textContent=text}}
   }
   const loose=qa('button,a',sec).filter(b=>!b.closest('.ct124-card')&&actionKind(b)==='swap');
   for(const b of loose){const target=cards.find(c=>!qa('button,a',c).some(x=>actionKind(x)==='swap'));if(!target)break;const bar=ensureActionBar(target)||(()=>{const z=document.createElement('div');z.className='ct122-media-actions';target.appendChild(z);return z})();bar.appendChild(b);b.classList.add('ct122-media-action');b.textContent='↻';b.setAttribute('aria-label','Trocar');b.setAttribute('title','Trocar')}
   for(const e of qa('div,article',sec))if(norm(e.textContent)==='sem item elegivel')e.classList.add('ct124-empty');
  }
  try{await window.__ctV122MetadataRun?.()}catch{}
 })().finally(()=>{discoverTask=null});
 return discoverTask;
}

let wlCache=null,wlAt=0,wlTask=null;
async function fullWatchlist(force=false){
 if(!force&&wlCache&&Date.now()-wlAt<60000)return wlCache;
 if(wlTask)return wlTask;
 wlTask=Promise.resolve().then(()=>typeof window.__ctV121FullWatchlist==='function'?window.__ctV121FullWatchlist(force):rpc('cinetracker_watchlist_full_v119',{})).then(d=>{wlCache=d||{rows:[]};wlAt=Date.now();return wlCache}).finally(()=>wlTask=null);
 return wlTask;
}
const rowsFor=(d,kind)=>(Array.isArray(d?.rows)?d.rows:[]).filter(x=>(kind==='movie'?mtype(x)==='movie':mtype(x)==='tv')&&mid(x)>0);
async function profile(){
 const root=q('[data-profile]');if(!root)return null;
 let d;try{d=await fullWatchlist(false)}catch{return null}
 for(const kind of ['movie','series'])for(const el of qa('.stat,button.stat',root)){
  const label=norm(q('small',el)?.textContent||'');if((kind==='movie'&&label!=='filmes watchlist')||(kind==='series'&&label!=='series watchlist'))continue;
  for(const a of [...el.attributes].map(a=>a.name))if(/^data-ct1/.test(a))el.removeAttribute(a);
  el.dataset.ct124Watchlist=kind;el.setAttribute('type','button');const b=q('b',el);if(b)b.textContent=rowsFor(d,kind).length.toLocaleString('pt-BR');
 }
 return d;
}
const addedAt=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
function sortRows(list,mode){const a=[...list],az=(x,y)=>title(x).localeCompare(title(y),'pt-BR',{numeric:true,sensitivity:'base'});if(mode==='release_desc')return a.sort((x,y)=>year(y)-year(x)||az(x,y));if(mode==='release_asc')return a.sort((x,y)=>year(x)-year(y)||az(x,y));if(mode==='added_desc')return a.sort((x,y)=>addedAt(y)-addedAt(x)||az(x,y));return a.sort(az)}
function rowHtml(x){const kind=mtype(x),id=mid(x),t=title(x)||'Sem título',y=year(x),g=genreNames(x).join(', ');let p=x?.poster_path||x?.raw_tmdb?.poster_path||'';if(p&&!/^https?:/i.test(p))p='https://image.tmdb.org/t/p/w185'+(String(p).startsWith('/')?'':'/')+p;return `<button type="button" class="ct122-watch-row ct124-wl-row" data-ct124-media="${kind}:${id}">${p?`<img src="${esc(p)}" alt="" loading="lazy">`:''}<span><b>${esc(t)}</b><small>${esc([y,g].filter(Boolean).join(' · '))}</small></span><i>›</i></button>`}
function paintModal(m,kind,mode){const items=sortRows(rowsFor(m.__data,kind),mode);q('[data-ct124-count]',m).textContent=items.length.toLocaleString('pt-BR');q('[data-ct124-list]',m).innerHTML=items.length?items.map(rowHtml).join(''):'<div class="empty">Nenhum item nessa Watchlist.</div>'}
async function openWatchlist(kind){
 q('[data-ct124-modal]')?.remove();
 const m=document.createElement('div');m.className='ct122-modal ct124-modal';m.dataset.ct124Modal=kind;
 m.innerHTML=`<div class="ct122-dialog"><header><h2>${kind==='movie'?'Filmes':'Séries'} na Watchlist · <span data-ct124-count>…</span></h2><button type="button" data-ct124-close>×</button></header><div class="ct122-toolbar"><select data-ct124-sort><option value="alpha">Alfabética</option><option value="release_desc">Mais recente lançada</option><option value="release_asc">Mais antigo lançado</option><option value="added_desc">Mais recente adicionada</option></select></div><div class="ct122-list" data-ct124-list>Carregando…</div></div>`;
 document.body.appendChild(m);
 try{m.__data=await fullWatchlist(true);paintModal(m,kind,'alpha')}catch{q('[data-ct124-list]',m).textContent='Não foi possível carregar a Watchlist.'}
 return m;
}
document.addEventListener('click',e=>{
 const s=e.target.closest?.('[data-ct124-watchlist]');if(s){e.preventDefault();e.stopImmediatePropagation();void openWatchlist(s.dataset.ct124Watchlist);return}
 if(e.target.closest?.('[data-ct124-close]')){e.preventDefault();e.stopImmediatePropagation();q('[data-ct124-modal]')?.remove();return}
 const r=e.target.closest?.('[data-ct124-media]');if(r){e.preventDefault();e.stopImmediatePropagation();const[k,id]=String(r.dataset.ct124Media).split(':');q('[data-ct124-modal]')?.remove();if(Number(id)>0){try{go(`/${k==='movie'?'movie':'series'}/${Number(id)}`)}catch{location.href=`/${k==='movie'?'movie':'series'}/${Number(id)}`}}}
},true);
document.addEventListener('change',e=>{const s=e.target.closest?.('[data-ct124-sort]');if(!s)return;const m=s.closest('[data-ct124-modal]');if(m?.__data)paintModal(m,m.dataset.ct124Modal,s.value)},true);
async function sync(){stripLegends();await discover();await profile()}
let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(()=>void sync().catch(()=>{}),70)}
try{new MutationObserver(queue).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
setInterval(queue,1200);queue();
const st=document.createElement('style');st.id='ct-v124-web-final';st.textContent=`.ct124-card{width:200px!important;min-width:200px!important;max-width:200px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}.ct124-card>img,.ct124-card picture,.ct124-card picture>img{width:100%!important;display:block!important}.ct124-card .ct122-media-info{min-width:0!important;overflow:hidden!important}.ct124-card .ct122-card-meta{display:block!important;white-space:normal!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.35!important;max-height:2.7em!important}.ct124-card .ct122-media-actions{margin-top:auto!important;display:flex!important;align-items:center!important;gap:8px!important;padding:10px!important}.ct124-card .ct122-media-action{width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;padding:0!important;display:inline-grid!important;place-items:center!important;flex:0 0 36px!important}.ct124-empty{min-height:300px!important;display:grid!important;place-items:center!important}`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctV124Rows=rowsFor;
window.__ctV124Discover=discover;
window.__ctV124Profile=profile;
window.__ctV124OpenWatchlist=openWatchlist;
window.__ctV124Sync=sync;
})();
