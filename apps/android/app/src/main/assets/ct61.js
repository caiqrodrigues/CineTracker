(() => {
'use strict';
if(window.__ct61Loaded)return;window.__ct61Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
window.__ctAndroidBuild='0.0.72';
let lastView='',blockedBusy=false,blockedAt=0,blockedIds=new Set(),blockedTitles=new Set();
const style=document.createElement('style');style.id='ct61-style';style.textContent=`
html,body,#app,.app,.content{scroll-behavior:auto!important}.ct47-card,.ct48-home-card,.ct41-wrap,.ct60-profile-chart{animation:none!important;transition:none!important;transform:none!important}
.ct61-hidden{display:none!important}.ct47-modes{display:none!important}
.ct48-home-nextname,.ct59-nextname{font-size:13px!important;line-height:1.35!important;white-space:normal!important;color:#d5dde3!important}
.ct48-home-actions,.ct59-actions{align-items:center!important}.ct48-next,.ct59-seen{min-width:132px!important;text-align:center!important;margin-left:auto!important;margin-right:auto!important}
`;
document.head.appendChild(style);
function cur(){try{return typeof view==='undefined'?'':String(view||'')}catch{return''}}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function titleOf(card){return norm($('.card-title,h3,.ct47-title,.ct48-home-title',card)?.textContent||'')}
async function refreshBlocked(force=false){if(blockedBusy||(!force&&Date.now()-blockedAt<5000))return;blockedBusy=true;try{const [cont,over]=await Promise.all([sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]),sbApi('media_overrides?select=state,media:media(tmdb_id,media_type,title)&limit=5000').catch(()=>[])]);const ids=new Set(),titles=new Set();for(const r of cont||[]){if(r?.tmdb_id)ids.add(`tmdb-tv-${Number(r.tmdb_id)}`);if(r?.title)titles.add(norm(r.title))}for(const r of over||[]){const m=r?.media;if(m?.tmdb_id&&m?.media_type)ids.add(`tmdb-${m.media_type}-${Number(m.tmdb_id)}`);if(m?.title)titles.add(norm(m.title))}blockedIds=ids;blockedTitles=titles;blockedAt=Date.now()}finally{blockedBusy=false}}
async function strictDiscover(){if(cur()!=='discover')return;await refreshBlocked();for(const c of $$('.card[data-media-id],#tmdb-results .card,.tmdb-grid .card,.discover-grid .card')){const id=String(c.dataset.mediaId||''),t=titleOf(c);c.classList.toggle('ct61-hidden',!!((id&&blockedIds.has(id))||(t&&blockedTitles.has(t))))}}
function cleanMeta(){for(const el of $$('.ct47-meta,.ct48-home-meta')){let t=(el.textContent||'').replace(/\s+/g,' ').trim();if(!t)continue;const kind=(t.match(/\b(ANIME|SÉRIE|FILME)\b/i)||[])[1];const prog=(t.match(/\b\d{1,4}\s*\/\s*\d{1,4}\b/)||[])[0];const falt=(t.match(/Faltam\s+\d{1,4}\s+episódios?/i)||[])[0];const score=(t.match(/★\s*\d{1,2}(?:[.,]\d)?/)||[])[0];const bits=[kind&&kind.toUpperCase(),prog,falt,score].filter(Boolean);if(bits.length)el.textContent=bits.join(' · ')}}
function placeChart(){if(cur()!=='profile')return;const chart=$('.ct41-wrap')||$('.ct60-profile-chart');if(!chart)return;const leaves=$$('*').filter(x=>x.children.length===0&&/^Histórico$/i.test((x.textContent||'').trim()));const h=leaves[0];if(!h)return;let sec=h.closest('section,.panel,.card,div');if(!sec||sec===chart||sec.contains(chart))return;sec.parentElement?.insertBefore(chart,sec)}
function stabilizeHome(){if(cur()!=='home')return;cleanMeta();$$('.ct48-home-nextname').forEach(x=>x.style.fontSize='13px');$$('.ct48-home-actions').forEach(a=>a.style.alignItems='center')}
function stabilizeAssist(){if(cur()!=='library')return;cleanMeta();const box=$('#ct47-content');if(box&&/Carregando/i.test(box.textContent||'')&&typeof window.ct47Navigate==='function'&&!box.dataset.ct61retry){box.dataset.ct61retry='1';setTimeout(()=>{if(cur()==='library'&&/Carregando/i.test(box.textContent||''))window.ct47Navigate('library')},1200)}}
function fixBuild(){if(cur()!=='settings')return;const f=$('#ct49-build-footer');if(f)f.textContent='CineTracker Android • build 0.0.72'}
function apply(){const v=cur();if(v==='profile')placeChart();if(v==='discover')void strictDiscover();if(v==='home')stabilizeHome();if(v==='library')stabilizeAssist();fixBuild()}
window.ct72Navigate=(target)=>{try{if(target==='library'&&typeof window.ct47Navigate==='function')window.ct47Navigate(target);else{view=target;render();window.scrollTo(0,0)}setTimeout(apply,80);setTimeout(apply,700);return true}catch{return false}};
let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,120)}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(apply,100);setTimeout(apply,900);setInterval(()=>{const v=cur();if(v!==lastView){lastView=v;apply()}else if(v==='profile')placeChart()},1800);
})();