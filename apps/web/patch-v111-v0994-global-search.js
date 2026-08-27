(() => {
'use strict';
if(window.__ct0994GlobalSearchLoaded)return;
window.__ct0994GlobalSearchLoaded=true;
window.__ct0994GlobalSearch='v111-home-discover-global-search';

const $111=(s,r=document)=>r.querySelector(s);
const $$111=(s,r=document)=>[...r.querySelectorAll(s)];
const esc111=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img111=(p,size='w342')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
let timer111=null,seq111=0,lastQuery111='',lastResults111=[];

const style=document.createElement('style');
style.id='ct0994-global-search-v111-style';
style.textContent=`
.ct111-search{position:relative;width:100%;margin:0 0 18px;z-index:12000}
.ct111-searchbar{display:grid;grid-template-columns:34px minmax(0,1fr) 38px;align-items:center;width:100%;min-height:44px;border:1px solid #28526b;background:linear-gradient(145deg,#07131b,#0a1821);border-radius:13px;box-shadow:inset 0 1px 0 #ffffff0a,0 12px 34px #0003;overflow:hidden}
.ct111-searchbar:focus-within{border-color:#55bce9;box-shadow:0 0 0 2px #39baf51c,0 15px 40px #0005}
.ct111-search-icon{display:grid;place-items:center;color:#79bbd9;font-size:15px;pointer-events:none}
.ct111-input{width:100%;height:42px;border:0!important;outline:0!important;background:transparent!important;color:#eaf8ff!important;padding:0 4px!important;font-size:13px!important;box-shadow:none!important}
.ct111-input::placeholder{color:#6e8797}
.ct111-clear{display:grid;place-items:center;width:34px;height:34px;margin:auto;border:0;background:transparent;color:#7892a3;border-radius:9px;cursor:pointer;font-size:18px}
.ct111-clear:hover{background:#123041;color:#fff}
.ct111-results{position:absolute;top:calc(100% + 7px);left:0;right:0;max-height:min(68vh,620px);overflow:auto;border:1px solid #315c74;background:#061018f5;backdrop-filter:blur(18px);border-radius:14px;padding:7px;box-shadow:0 24px 70px #000c;display:none}
.ct111-results.open{display:grid;gap:5px}
.ct111-result{appearance:none;width:100%;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid transparent;background:transparent;color:#eef9ff;border-radius:11px;padding:7px;text-align:left;cursor:pointer;min-width:0}
.ct111-result:hover,.ct111-result:focus{outline:0;border-color:#28566f;background:#0d2431}
.ct111-thumb{width:48px;height:66px;border-radius:8px;background:#101d26 center/cover no-repeat;display:grid;place-items:center;color:#527080;font-weight:900;overflow:hidden}
.ct111-result.person .ct111-thumb{height:48px;border-radius:50%}
.ct111-info{min-width:0}.ct111-info b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct111-info small{display:block;color:#8199a8;font-size:10px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct111-type{font-size:9px;color:#8fdfff;border:1px solid #285a72;background:#0a2230;border-radius:999px;padding:4px 7px;white-space:nowrap}
.ct111-state{padding:15px;color:#7892a3;font-size:12px;text-align:center}
.ct111-person-overlay{position:fixed;inset:0;z-index:999999;background:#02070cf2;backdrop-filter:blur(8px);overflow:auto;padding:18px}
.ct111-person-card{width:min(1040px,100%);margin:0 auto;border:1px solid #2b536b;background:#07131b;border-radius:18px;padding:16px;box-shadow:0 30px 90px #000c}
.ct111-person-head{display:grid;grid-template-columns:160px minmax(0,1fr) auto;gap:16px;align-items:start}.ct111-person-photo{width:160px;aspect-ratio:2/3;border-radius:14px;background:#101d26 center/cover no-repeat}.ct111-person-head h2{margin:4px 0 7px}.ct111-person-meta{font-size:11px;color:#83a0b1}.ct111-person-bio{margin-top:12px;color:#bfd0db;font-size:12px;line-height:1.55}.ct111-close{border:1px solid #315b75;background:#0b1922;color:#fff;border-radius:10px;padding:8px 11px;cursor:pointer}.ct111-known{margin-top:18px;padding-top:15px;border-top:1px solid #1f4053}.ct111-known h3{margin:0 0 10px}.ct111-known-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,150px));gap:10px}.ct111-credit{appearance:none;border:1px solid #24495e;background:#0b1720;color:#fff;border-radius:12px;overflow:hidden;text-align:left;padding:0;cursor:pointer}.ct111-credit:hover{border-color:#55a9d7}.ct111-credit-poster{aspect-ratio:2/3;background:#101d26 center/cover no-repeat}.ct111-credit-body{padding:7px}.ct111-credit-body b{display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct111-credit-body small{font-size:9px;color:#7891a0}
@media(max-width:700px){.ct111-search{margin-bottom:13px}.ct111-searchbar{min-height:42px}.ct111-input{height:40px!important}.ct111-results{max-height:62vh}.ct111-result{grid-template-columns:42px minmax(0,1fr) auto}.ct111-thumb{width:42px;height:58px}.ct111-result.person .ct111-thumb{height:42px}.ct111-person-overlay{padding:10px}.ct111-person-card{padding:12px}.ct111-person-head{grid-template-columns:92px minmax(0,1fr) auto;gap:10px}.ct111-person-photo{width:92px}.ct111-known-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

function route111(){
  const active=$111('.sidebar .nav button.active,.mobile-nav button.active');
  const data=String(active?.dataset?.view||active?.dataset?.view991||active?.dataset?.view99||'').toLowerCase();
  if(data)return data==='history'?'profile':data;
  try{const v=String(typeof view!=='undefined'?view:window.view||'').toLowerCase();if(v)return v==='history'?'profile':v}catch{}
  const h=String($111('.content h1')?.textContent||'').toLowerCase();if(h.includes('descobrir'))return 'discover';if(h.includes('home')||h.includes('início')||h.includes('inicio'))return 'home';return '';
}
async function api111(path,params={}){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json();
}
function year111(x){return String(x?.release_date||x?.first_air_date||'').slice(0,4)||'—'}
function type111(x){return x.media_type==='movie'?'Filme':x.media_type==='tv'?'Série':'Pessoa'}
function sub111(x){if(x.media_type==='person'){const known=(x.known_for||[]).map(k=>k.title||k.name).filter(Boolean).slice(0,3).join(' · ');return known||x.known_for_department||'Pessoa'}return `${year111(x)}${Number(x.vote_average||0)>0?` · ★ ${Number(x.vote_average).toFixed(1)}`:''}`}
function thumb111(x){const p=x.media_type==='person'?x.profile_path:x.poster_path;return p?` style="background-image:url('${img111(p,x.media_type==='person'?'w185':'w154')}')"`:''}
function renderResults111(host,items,q){
  if(!host)return;lastResults111=items||[];
  if(!items?.length){host.innerHTML=`<div class="ct111-state">Nenhum filme, série ou ator encontrado para “${esc111(q)}”.</div>`;host.classList.add('open');return}
  host.innerHTML=items.slice(0,18).map((x,i)=>`<button type="button" class="ct111-result ${x.media_type==='person'?'person':''}" data-ct111-result="${i}"><span class="ct111-thumb"${thumb111(x)}>${x.poster_path||x.profile_path?'':(x.media_type==='person'?'◉':'▶')}</span><span class="ct111-info"><b>${esc111(x.title||x.name||'Sem título')}</b><small>${esc111(sub111(x))}</small></span><span class="ct111-type">${type111(x)}</span></button>`).join('');host.classList.add('open');
}
async function search111(q,host){
  const my=++seq111;host.innerHTML='<div class="ct111-state">Buscando no catálogo…</div>';host.classList.add('open');
  try{const d=await api111('/search/multi',{query:q,include_adult:false,page:1});if(my!==seq111)return;const items=(d.results||[]).filter(x=>['movie','tv','person'].includes(x.media_type));renderResults111(host,items,q)}catch(error){if(my!==seq111)return;console.error('[CineTracker 0.99.4] busca global',error);host.innerHTML='<div class="ct111-state">Não foi possível consultar o catálogo agora.</div>';host.classList.add('open')}
}
function openMedia111(type,id){const open=window.__ct0994OpenDetail||window.ct92OpenMedia||window.ct91OpenMedia;if(typeof open==='function')return open(type,Number(id))}
async function openPerson111(id){
  $111('#ct111-person-overlay')?.remove();const o=document.createElement('div');o.className='ct111-person-overlay';o.id='ct111-person-overlay';o.innerHTML='<div class="ct111-person-card"><div class="ct111-state">Carregando pessoa…</div></div>';document.body.appendChild(o);
  try{const [p,c]=await Promise.all([api111(`/person/${id}`),api111(`/person/${id}/combined_credits`)]),credits=(c.cast||[]).filter(x=>['movie','tv'].includes(x.media_type)&&x.poster_path).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).filter((x,i,a)=>a.findIndex(y=>y.media_type===x.media_type&&Number(y.id)===Number(x.id))===i).slice(0,12);const meta=[p.known_for_department,p.birthday,p.place_of_birth].filter(Boolean).join(' · ');o.innerHTML=`<div class="ct111-person-card"><div class="ct111-person-head"><div class="ct111-person-photo"${p.profile_path?` style="background-image:url('${img111(p.profile_path,'w342')}')"`:''}></div><div><h2>${esc111(p.name||'Pessoa')}</h2><div class="ct111-person-meta">${esc111(meta)}</div><div class="ct111-person-bio">${esc111(p.biography||'Biografia não disponível em português.')}</div></div><button type="button" class="ct111-close" data-ct111-close>✕</button></div><section class="ct111-known"><h3>Filmes e séries</h3><div class="ct111-known-grid">${credits.map((x,i)=>`<button type="button" class="ct111-credit" data-ct111-credit="${i}"><div class="ct111-credit-poster" style="background-image:url('${img111(x.poster_path,'w342')}')"></div><div class="ct111-credit-body"><b>${esc111(x.title||x.name||'')}</b><small>${x.media_type==='movie'?'Filme':'Série'} · ${esc111(year111(x))}</small></div></button>`).join('')||'<div class="ct111-state">Sem créditos disponíveis.</div>'}</div></section></div>`;o.querySelector('[data-ct111-close]').onclick=()=>o.remove();o.addEventListener('click',e=>{if(e.target===o)o.remove();const b=e.target.closest?.('[data-ct111-credit]');if(b){const x=credits[Number(b.dataset.ct111Credit)];if(x){o.remove();openMedia111(x.media_type,x.id)}}})}catch(error){console.error('[CineTracker 0.99.4] pessoa',error);o.innerHTML='<div class="ct111-person-card"><button type="button" class="ct111-close" data-ct111-close>✕</button><div class="ct111-state">Não foi possível carregar essa pessoa.</div></div>';o.querySelector('[data-ct111-close]').onclick=()=>o.remove()}
}
function bind111(root){
  const input=$111('.ct111-input',root),results=$111('.ct111-results',root),clear=$111('.ct111-clear',root);if(!input||!results)return;
  input.value=lastQuery111;
  input.oninput=()=>{lastQuery111=input.value.trim();clearTimeout(timer111);if(lastQuery111.length<2){seq111++;results.classList.remove('open');results.innerHTML='';return}timer111=setTimeout(()=>void search111(lastQuery111,results),260)};
  input.onfocus=()=>{if(lastQuery111.length>=2&&lastResults111.length)renderResults111(results,lastResults111,lastQuery111)};
  input.onkeydown=e=>{if(e.key==='Escape'){results.classList.remove('open');input.blur()}if(e.key==='Enter'){e.preventDefault();const first=$111('[data-ct111-result]',results);if(first)first.click()}};
  clear.onclick=()=>{lastQuery111='';lastResults111=[];seq111++;input.value='';results.classList.remove('open');results.innerHTML='';input.focus()};
  results.onclick=e=>{const b=e.target.closest?.('[data-ct111-result]');if(!b)return;const x=lastResults111[Number(b.dataset.ct111Result)];if(!x)return;results.classList.remove('open');if(x.media_type==='person')void openPerson111(x.id);else openMedia111(x.media_type,x.id)};
}
function mount111(){
  const r=route111(),content=$111('.content');if(!content)return false;const old=$111('#ct111-global-search');if(!['home','discover'].includes(r)){old?.remove();return false}if(old&&old.isConnected)return true;
  $$111('.content>.search').forEach(x=>{if(!x.closest('#ct111-global-search'))x.style.display='none'});
  const root=document.createElement('div');root.className='ct111-search';root.id='ct111-global-search';root.innerHTML='<div class="ct111-searchbar"><span class="ct111-search-icon">⌕</span><input class="ct111-input" type="search" autocomplete="off" spellcheck="false" placeholder="Buscar filmes, séries e atores…" aria-label="Buscar filmes, séries e atores"><button type="button" class="ct111-clear" title="Limpar busca" aria-label="Limpar busca">×</button></div><div class="ct111-results" role="listbox"></div>';
  const anchor=$111('.header',content)||content.firstElementChild;content.insertBefore(root,anchor||null);bind111(root);return true;
}
function schedule111(){for(const d of [0,80,220,520,980])setTimeout(mount111,d)}

const rawNav111=window.__ct0994Navigate;if(typeof rawNav111==='function'&&!rawNav111.__ct111Wrapped){const fn=async function(target){const r=await rawNav111.apply(this,arguments);schedule111();return r};fn.__ct111Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view],[data-view991],[data-view99],[data-ct994-tab],.ct991-tab,.ct991-filter'))schedule111()},true);
document.addEventListener('click',e=>{const root=$111('#ct111-global-search');if(root&&!root.contains(e.target))$111('.ct111-results',root)?.classList.remove('open')});
window.addEventListener('cinetracker:data-changed',schedule111);
if(localStorage.getItem('ct0994_catalog_fix_v111')!=='1'){localStorage.setItem('ct0994_catalog_fix_v111','1');try{localStorage.removeItem('ct0994_home_preload_v1');window.__ct0994PreloadedHome=null}catch{}setTimeout(()=>window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'web-0.99.4-catalog-fix-v111'}})),0)}
schedule111();
})();