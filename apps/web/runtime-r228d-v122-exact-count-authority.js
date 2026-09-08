/* CineTracker 1.0.22 — final exact Profile Watchlist counter authority. */
(()=>{'use strict';if(window.__ctR228dV122)return;window.__ctR228dV122='exact-watchlist-counter-final-pass';
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let task=null,last=null,lastAt=0;
async function data(force=false){if(!force&&last&&Date.now()-lastAt<60000)return last;if(task)return task;const fn=window.__ctV121FullWatchlist;task=Promise.resolve().then(()=>typeof fn==='function'?fn(force):rpc('cinetracker_watchlist_full_v119',{})).then(d=>{last=d||{rows:[]};lastAt=Date.now();return last}).finally(()=>task=null);return task}
function statNodes(root,kind){return [...root.querySelectorAll('.stat,button.stat')].filter(el=>{const label=norm(el.querySelector('small')?.textContent||'');return kind==='movie'?label==='filmes watchlist':label==='series watchlist'})}
async function sync(force=false){const root=document.querySelector('[data-profile]');if(!root)return null;const d=await data(force);for(const kind of ['movie','series']){const rows=typeof window.__ctV122Rows==='function'?window.__ctV122Rows(d,kind):[];const count=rows.length;for(const el of statNodes(root,kind)){el.dataset.ct122Watchlist=kind;const b=el.querySelector('b');if(b)b.textContent=count.toLocaleString('pt-BR')}}return d}
window.__ctV122SyncCounts=sync;
let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(()=>void sync(false).catch(()=>{}),40)}try{new MutationObserver(queue).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}setInterval(()=>void sync(false).catch(()=>{}),1500);queue();
})();
