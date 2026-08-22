(() => {
'use strict';
if (window.__ct31Loaded) return;
window.__ct31Loaded = true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const auth=()=>!!$('.auth-page,#auth-form,#auth-email,#auth-password')||!window.currentUser;
const SUPA=window.SUPABASE_URL||'https://pjmkxryboypluleuuupp.supabase.co';
const img=p=>p?`https://image.tmdb.org/t/p/w342${p}`:'';
const css=document.createElement('style');
css.textContent=`
.ct31-profile-block{margin:18px 0;border-top:1px solid #202933;padding-top:12px}.ct31-block-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.ct31-block-title{border:0;background:none;color:#fff;font-weight:800;font-size:19px;padding:6px 0;text-align:left}.ct31-toggle{border:0;background:none;color:#fff;font-size:24px;width:40px;height:40px}.ct31-row{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(138px,155px);gap:8px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none}.ct31-mini{min-height:106px;border:1px solid #172b3d;background:#0b0d10;border-radius:14px;padding:12px;display:flex;flex-direction:column;justify-content:space-between}.ct31-mini span{color:#8f98a3;font-size:11px}.ct31-mini strong{font-size:18px;white-space:nowrap}.ct31-full{min-height:70vh}.ct31-full-head{display:flex;align-items:center;gap:10px}.ct31-back{border:1px solid #24384a;background:#0b1118;color:#fff;border-radius:12px;padding:9px 12px}.ct31-full-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px}
`;
document.head.appendChild(css);

// Cache curto para não repetir as mesmas consultas ao trocar de aba.
try{
 if(!window.__ct31ApiCache && typeof sbApi==='function'){
  window.__ct31ApiCache=new Map(); const base=sbApi;
  sbApi=async function(path,opts={}){const method=(opts.method||'GET').toUpperCase();if(method!=='GET')return base(path,opts);const k='api:'+path,now=Date.now(),c=window.__ct31ApiCache.get(k);if(c&&now-c.t<60000)return c.v;const v=await base(path,opts);window.__ct31ApiCache.set(k,{t:now,v});return v};
 }
 if(!window.__ct31RpcCache && typeof sbRpc==='function'){
  window.__ct31RpcCache=new Map(); const baseRpc=sbRpc;
  sbRpc=async function(name,body={}){const k='rpc:'+name+':'+JSON.stringify(body),now=Date.now(),c=window.__ct31RpcCache.get(k);if(c&&now-c.t<45000)return c.v;const v=await baseRpc(name,body);window.__ct31RpcCache.set(k,{t:now,v});return v};
 }
}catch(e){}

function clickSettingsReal(){
 const target=$('#ct40-settings-target');
 if(target){target.click();setTimeout(()=>target.click(),80);return true;}
 const buttons=$$('button,a').filter(e=>/^(configurações|configuracoes|config\.)$/i.test((e.textContent||'').trim()));
 if(buttons.length){buttons[0].click();setTimeout(()=>buttons[0].click(),80);return true;}
 return false;
}
window.ct31OpenSettings=clickSettingsReal;

function removeStatsIfMisrouted(){
 const txt=(document.body.textContent||'').toLowerCase();
 if(txt.includes('seu histórico em números')&&txt.includes('preferências percebidas')) setTimeout(clickSettingsReal,0);
}

function statValue(key){
 const nodes=$$('.ct41-stat,.ct30-stat,.metric');
 const n=nodes.find(x=>(x.querySelector('span')?.textContent||x.textContent||'').toLowerCase().includes(key));
 return n?.querySelector('strong')?.textContent?.trim()||'—';
}
function addProfileBlocks(){
 if(typeof view!=='undefined'&&view!=='profile')return;
 if($('#ct31-profile-blocks'))return;
 const fav=$$('section,.ct29-section').find(x=>/séries favoritas/i.test(x.querySelector('h2')?.textContent||''));
 if(!fav)return;
 const wrap=document.createElement('div');wrap.id='ct31-profile-blocks';
 const values=[['Tempo total',statValue('tempo total')],['Tempo em séries',statValue('tempo em séries')],['Tempo em filmes',statValue('tempo em filmes')],['Episódios vistos',statValue('episódios')],['Filmes vistos',statValue('filmes')],['Séries acompanhadas',statValue('séries')]];
 const cards=values.map(([a,b])=>`<div class="ct31-mini"><span>${a}</span><strong>${b}</strong></div>`).join('');
 wrap.innerHTML=`<section class="ct31-profile-block"><div class="ct31-block-head"><button class="ct31-block-title" id="ct31-screen-full">Tempo de Tela ›</button><button class="ct31-toggle" data-target="ct31-screen-row">⌃</button></div><div class="ct31-row" id="ct31-screen-row">${cards}</div></section><section class="ct31-profile-block"><div class="ct31-block-head"><button class="ct31-block-title" id="ct31-history-full">Histórico ›</button><button class="ct31-toggle" data-target="ct31-history-row">⌃</button></div><div class="ct31-row" id="ct31-history-row"><div class="ct31-mini"><span>Últimos itens assistidos</span><strong>Abrir histórico</strong></div></div></section>`;
 fav.before(wrap);
 $$('.ct31-toggle',wrap).forEach(b=>b.onclick=()=>{const r=$('#'+b.dataset.target),hide=r.style.display==='none';r.style.display=hide?'grid':'none';b.textContent=hide?'⌃':'⌄';});
 $('#ct31-history-full').onclick=()=>{view='history';render();window.scrollTo(0,0)};
 $('#ct31-screen-full').onclick=()=>{const host=$('.content')||$('#app');host.innerHTML=`<div class="ct31-full"><div class="ct31-full-head"><button class="ct31-back" id="ct31-back">← Perfil</button><h1>Tempo de Tela</h1></div><div class="ct31-full-grid">${cards}</div></div>`;$('#ct31-back').onclick=()=>{view='profile';render();window.scrollTo(0,0)}};
}

const posterCache=new Map(), inFlight=new Set();
async function tmdb(path,params={}){const key=path+JSON.stringify(params);if(posterCache.has(key))return posterCache.get(key);const u=new URL(`${SUPA}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language','pt-BR');Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v)));const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error('TMDB '+r.status);const d=await r.json();posterCache.set(key,d);return d}
function identity(card){let id=Number(card.dataset.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0),type=String(card.dataset.apiType||card.dataset.ct29Type||'').toLowerCase();const mid=card.dataset.mediaId||'';try{const m=mediaRegistry?.get?.(mid);if(m){id=id||Number(m.tmdbId||0);type=type||String(m.apiType||m.type||'')}}catch{}const mm=mid.match(/^tmdb-(movie|tv)-(\d+)$/);if(!id&&mm){type=mm[1];id=Number(mm[2])}type=(type.includes('movie')||type.includes('filme'))?'movie':type.includes('tv')||type.includes('série')||type.includes('serie')?'tv':'';return{id,type}}
async function hydrate(card){
 const p=$('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster',card);if(!p)return;
 const h=$('h3,h2,.ct38-title,.ct30-fav-body strong,.ct30-history-body strong',card),title=(h?.textContent||'').trim();
 const hasImg=(p.style.backgroundImage||'').includes('url(');if(hasImg&&!/^tmdb\s*#/i.test(title))return;
 const {id,type}=identity(card);const key=(id?type+':'+id:'q:'+title);if(!title&&!id||inFlight.has(key))return;inFlight.add(key);
 try{let d;if(id&&type)d=await tmdb('/'+type+'/'+id);else{const q=await tmdb('/search/multi',{query:title,include_adult:false,page:1});d=(q.results||[]).find(x=>x.media_type==='movie'||x.media_type==='tv')||null}if(!d)return;const real=d.title||d.name;if(real&&h)h.textContent=real;if(d.poster_path){p.style.backgroundImage=`url('${img(d.poster_path)}')`;p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%'}}catch{}finally{inFlight.delete(key)}
}
function hydrateVisible(){if(auth())return;$$('.card,.feature,.ct38-card,.ct30-fav,.ct30-history-card').forEach(card=>{const r=card.getBoundingClientRect();if(r.bottom>-500&&r.top<innerHeight+800)hydrate(card)})}
function run(){if(auth())return;removeStatsIfMisrouted();addProfileBlocks();hydrateVisible()}
let queued=false;new MutationObserver(()=>{if(queued||auth())return;queued=true;requestAnimationFrame(()=>{queued=false;run()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;hydrateVisible()})}},{passive:true});
setTimeout(run,0);setTimeout(run,300);setTimeout(run,1000);
})();