(() => {
'use strict';
if(window.__ct0994FluidityLoaded)return;
window.__ct0994FluidityLoaded=true;
window.__ct0994Fluidity='v113-cache-first-tabs-activity';

const ACTIVITY_RPC='cinetracker_profile_activity_v0994';
const ACTIVITY_KEY='ct0994_activity_snapshot_v1';
const ACTIVITY_TTL=6*60*60*1000;
let activityDays=30;
let activityBusy=null;

const css=document.createElement('style');
css.id='ct0994-fluidity-v113-style';
css.textContent=`
.ct113-activity-host{min-height:210px}.ct113-activity-controls{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:10px}.ct113-range{border:1px solid #294e65;background:#091822;color:#cfe1ec;border-radius:999px;padding:6px 10px;font-size:10px;cursor:pointer}.ct113-range.active{background:#164160;border-color:#63b4df;color:#fff}.ct113-chart-scroll{overflow-x:auto;overflow-y:hidden;border:1px solid #18374a;background:linear-gradient(180deg,#07131c,#091922);border-radius:14px;padding:12px 10px 8px;scrollbar-width:thin}.ct113-chart{height:190px;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(26px,1fr);gap:5px;align-items:end;min-width:max(100%,calc(var(--ct113-days)*30px))}.ct113-day{height:100%;display:grid;grid-template-rows:18px 1fr 28px;gap:5px;align-items:end;text-align:center;color:#dcecf6;min-width:0}.ct113-count{font-size:10px;font-weight:850}.ct113-barbox{height:132px;display:flex;align-items:end;justify-content:center;position:relative;background:linear-gradient(#4ca5d313 1px,transparent 1px);background-size:100% 25%}.ct113-bar{width:min(22px,72%);min-height:3px;height:var(--ct113-h);border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,#6ed5ff,#2486bd);box-shadow:0 0 12px #29a4e444;transition:.14s ease}.ct113-day:hover .ct113-bar{filter:brightness(1.2);transform:scaleX(1.08)}.ct113-label{font-size:8px;color:#7f99aa;line-height:1.15;white-space:nowrap}.ct113-note{margin-top:8px;color:#708b9b;font-size:9px;line-height:1.4}.ct113-loading{min-height:170px;display:grid;place-items:center;color:#7892a4;font-size:11px}@media(max-width:700px){.ct113-chart{grid-auto-columns:28px}.ct113-chart-scroll{padding-left:8px;padding-right:8px}}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function uid113(){try{if(currentUser?.id)return String(currentUser.id)}catch{}try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return s?.user?.id?String(s.user.id):''}catch{return ''}}
function read113(days){try{const x=JSON.parse(localStorage.getItem(ACTIVITY_KEY)||'null'),u=uid113();if(!x?.data||!u||x.uid!==u||Number(x.days)!==Number(days)||Date.now()-Number(x.at||0)>ACTIVITY_TTL)return null;return x.data}catch{return null}}
function write113(days,data){try{const u=uid113();if(u&&Array.isArray(data))localStorage.setItem(ACTIVITY_KEY,JSON.stringify({uid:u,days:Number(days),at:Date.now(),data}))}catch{}}
function localDate113(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function fill113(rows,days){const map=new Map((rows||[]).map(x=>[String(x.activity_day),x])),today=new Date();today.setHours(0,0,0,0);const out=[];for(let i=days-1;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);const k=localDate113(d),r=map.get(k)||{};out.push({day:k,date:d,events:Number(r.activity_events||0),raw:Number(r.raw_rows||0),baseline:Number(r.imported_baseline_rows||0),episodes:Number(r.episode_rows||0),movies:Number(r.movie_rows||0)})}return out}
function host113(){return document.getElementById('ct113-activity-host')||document.getElementById('ct991-timeline')}
function panel113(host){return host?.closest?.('.ct991-panel')||null}
function render113(rows,days){const host=host113();if(!host)return false;host.id='ct113-activity-host';host.className='ct113-activity-host';const panel=panel113(host),head=panel?.querySelector('.ct991-panel-head');if(head){const h=head.querySelector('h3'),s=head.querySelector('small');if(h)h.textContent='Atividade assistida';if(s)s.textContent='Sessões por dia · importações em lote consolidadas'}const data=fill113(rows,days),max=Math.max(1,...data.map(x=>x.events));host.innerHTML=`<div class="ct113-activity-controls"><button class="ct113-range ${days===7?'active':''}" data-ct113-days="7">7 dias</button><button class="ct113-range ${days===30?'active':''}" data-ct113-days="30">30 dias</button><button class="ct113-range ${days===90?'active':''}" data-ct113-days="90">90 dias</button></div><div class="ct113-chart-scroll"><div class="ct113-chart" style="--ct113-days:${days}">${data.map(x=>{const pct=Math.max(2,Math.round(x.events/max*126)),title=`${x.date.toLocaleDateString('pt-BR')} · ${x.events} sessão(ões)${x.baseline?` · ${x.baseline} registros importados consolidados`:''}${x.raw!==x.events?` · ${x.raw} registros brutos`:''}`;return `<div class="ct113-day" title="${title.replaceAll('"','&quot;')}"><div class="ct113-count">${x.events||''}</div><div class="ct113-barbox"><div class="ct113-bar" style="--ct113-h:${pct}px"></div></div><div class="ct113-label">${x.date.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</div></div>`}).join('')}</div></div><div class="ct113-note">O gráfico mede sessões registradas. Históricos importados em lote com o mesmo título e dia são consolidados para não criar picos artificiais de centenas de episódios.</div>`;host.querySelectorAll('[data-ct113-days]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.ct113Days);activityDays=n;void load113(n,true)});return true}
async function fetch113(days){const raw=await window.sbRpc(ACTIVITY_RPC,{p_days:Number(days)});const rows=Array.isArray(raw)?raw:[];write113(days,rows);return rows}
async function load113(days=activityDays,userRequested=false){activityDays=days;const cached=read113(days);if(cached)render113(cached,days);else{const host=host113();if(host)host.innerHTML='<div class="ct113-loading">Carregando atividade…</div>'}if(activityBusy&&!userRequested)return activityBusy;const job=fetch113(days).then(rows=>{if(activityDays===days)render113(rows,days);return rows}).catch(error=>{console.warn('[CineTracker 0.99.4] atividade do Perfil',error);return cached||[]}).finally(()=>{if(activityBusy===job)activityBusy=null});activityBusy=job;return job}
function current113(){let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{}return v==='history'?'profile':v}
function decorate113(){if(current113()==='profile')void load113(activityDays,false)}
const rawNav113=window.__ct0994Navigate;if(typeof rawNav113==='function'&&!rawNav113.__ct113Wrapped){const fn=async function(target){const result=await rawNav113.apply(this,arguments);if(String(target)==='profile'||String(target)==='history')queueMicrotask(decorate113);return result};fn.__ct113Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct0992Navigate=fn;window.ct991Navigate=fn;window.ct98Navigate=fn}
window.__ct113PreloadActivity=()=>load113(30,false);
window.addEventListener('cinetracker:data-changed',()=>{try{localStorage.removeItem(ACTIVITY_KEY)}catch{}if(current113()==='profile')void load113(activityDays,true)});
for(const d of [40,180,500])setTimeout(decorate113,d);
setTimeout(()=>void load113(30,false),250);
})();
