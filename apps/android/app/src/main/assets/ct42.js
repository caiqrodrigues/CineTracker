(() => {
'use strict';
if(window.__ct42Loaded)return;window.__ct42Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const css=document.createElement('style');css.id='ct42-style';css.textContent=`
/* Tempo de Tela: apenas gráfico diário, sempre dark */
.ct41-window,.ct41-track{background:#090e12!important}
.ct41-day{appearance:none!important;-webkit-appearance:none!important;border:0!important;background:transparent!important;color:#eef4f8!important;box-shadow:none!important;outline:0!important}
.ct41-day.today{background:#102331!important;box-shadow:inset 0 0 0 1px #37566e!important}
.ct41-bar{background:#5d93ba!important}.ct41-day.today .ct41-bar{background:#6aa7d2!important}
.ct41-count{color:#eef4f8!important}.ct41-label{color:#81909d!important}.ct41-today{color:#6aa7d2!important}
.ct43-full .ct33-chart,.ct43-full .ct36-hourchart,.ct43-full .ct36-carousel,.ct43-full .ct39-carousel,.ct43-full .ct39-dots,.ct43-full .ct36-dots,.ct43-full .ct39-full-analytics,.ct43-full .ct36-peakline{display:none!important}
/* Descobrir: três cards por linha em qualquer filtro */
body.ct42-discover .content .grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
body.ct42-discover .content .grid .card{min-width:0!important;border-radius:12px!important}
body.ct42-discover .content .grid .card .poster,body.ct42-discover .content .grid .card .tmdb-poster{height:auto!important;min-height:0!important;aspect-ratio:2/3!important;padding:6px!important}
body.ct42-discover .content .grid .card .card-body{padding:7px!important;min-height:86px!important}
body.ct42-discover .content .grid .card h3{font-size:11px!important;line-height:1.2!important;margin:0 0 5px!important}
body.ct42-discover .content .grid .media-meta{font-size:8px!important;gap:3px!important}
body.ct42-discover .content .grid .cast,body.ct42-discover .content .grid .availability,body.ct42-discover .content .grid .card-actions{display:none!important}
/* Assistir: seletor de visualização */
.ct42-viewmodes{display:flex;gap:7px;margin:0 0 14px;overflow-x:auto;scrollbar-width:none}.ct42-viewmodes::-webkit-scrollbar{display:none}
.ct42-vbtn{white-space:nowrap;border:1px solid #263b4e;background:#0a1119;color:#bcd0e1;border-radius:999px;padding:8px 13px;font-size:11px}
.ct42-vbtn.active{background:#113455;border-color:#4297df;color:white}
#ct40-content.ct42-carousel .ct40-list{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(78%,78%)!important;grid-template-columns:none!important;overflow-x:auto!important;gap:9px!important;scroll-snap-type:x mandatory!important;padding-bottom:6px!important;scrollbar-width:none}
#ct40-content.ct42-carousel .ct40-list::-webkit-scrollbar{display:none}
#ct40-content.ct42-carousel .ct40-card{scroll-snap-align:start!important}
#ct40-content.ct42-grid .ct40-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
#ct40-content.ct42-grid .ct40-card{grid-template-columns:1fr!important;min-height:0!important}
#ct40-content.ct42-grid .ct40-poster{aspect-ratio:2/3!important;min-height:0!important}
#ct40-content.ct42-grid .ct40-go{display:none!important}
#ct40-content.ct42-list .ct40-list{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}
@media(max-width:390px){body.ct42-discover .content .grid{gap:6px!important}body.ct42-discover .content .grid .card-body{padding:6px!important}.ct42-vbtn{padding:7px 11px}}
`;document.head.appendChild(css);
let assistView=localStorage.getItem('ct42_assist_view')||'carousel';
function cleanupOldFullGraph(){const full=$('.ct43-full');if(!full)return;full.querySelectorAll('.ct33-chart,.ct36-hourchart,.ct36-carousel,.ct39-carousel,.ct39-dots,.ct36-dots,.ct39-full-analytics,.ct36-peakline').forEach(x=>x.remove());[...full.querySelectorAll('div,section')].forEach(x=>{const t=(x.textContent||'').trim().toLowerCase();if((t==='atividade por horário'||t.startsWith('atividade por horário pico'))&&!x.querySelector('.ct41-wrap')){const p=x.closest('.ct33-chart,.ct36-hourchart,.ct39-chart')||x.parentElement;if(p&&!p.querySelector('.ct41-wrap'))p.remove()}})}
function discoverLayout(){document.body.classList.toggle('ct42-discover',typeof view!=='undefined'&&view==='discover')}
function sectionByTitle(root,title){return [...root.querySelectorAll('.ct40-section')].find(s=>(s.querySelector('h2')?.textContent||'').trim().toLowerCase()===title.toLowerCase())}
function reorderAssist(root){const box=$('#ct40-content',root||document);if(!box)return;const up=sectionByTitle(box,'Em dia'),following=sectionByTitle(box,'Acompanhando'),dusty=sectionByTitle(box,'Juntando poeira'),notStarted=sectionByTitle(box,'Não iniciadas');if(up&&following&&dusty&&notStarted){box.append(up,following,dusty,notStarted);if(!box.dataset.ct42Positioned){box.dataset.ct42Positioned='1';setTimeout(()=>following.scrollIntoView({block:'start',behavior:'auto'}),80)}}}
function setAssistMode(mode){assistView=mode;localStorage.setItem('ct42_assist_view',mode);const box=$('#ct40-content');if(!box)return;box.classList.remove('ct42-carousel','ct42-grid','ct42-list');box.classList.add('ct42-'+mode);$$('.ct42-vbtn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode))}
function installAssistControls(){if(typeof view==='undefined'||view!=='library')return;const content=$('.content');const box=$('#ct40-content');const kinds=$('.ct40-kinds');if(!content||!box||!kinds)return;if(!$('#ct42-viewmodes')){const bar=document.createElement('div');bar.id='ct42-viewmodes';bar.className='ct42-viewmodes';bar.innerHTML='<button class="ct42-vbtn" data-mode="carousel">Carrossel</button><button class="ct42-vbtn" data-mode="grid">Grade</button><button class="ct42-vbtn" data-mode="list">Lista</button>';kinds.after(bar);$$('.ct42-vbtn',bar).forEach(b=>b.onclick=()=>setAssistMode(b.dataset.mode))}setAssistMode(assistView);reorderAssist(content)}
function run(){discoverLayout();cleanupOldFullGraph();installAssistControls()}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;run()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(run,50);setTimeout(run,350);setTimeout(run,900);
})();