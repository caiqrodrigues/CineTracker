(() => {
'use strict';
if(window.__ct0997DeepLink132TailLoaded)return;
window.__ct0997DeepLink132TailLoaded=true;
window.__ct0997DeepLink132Tail='v132-single-runtime-nav-integrity';

const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const web=location.protocol==='http:'||location.protocol==='https:';
const href=p=>web?p:`#${p}`;
const path=()=>web?(location.pathname||'/'):(String(location.hash||'').replace(/^#/,'')||'/home');
const primary=()=>{const p=path();if(p.startsWith('/discover'))return'discover';if(p.startsWith('/profile'))return'profile';if(p.startsWith('/configs'))return'settings';return'home'};
const items=[['home','⌂ Home','/home'],['discover','✦ Descobrir','/discover'],['profile','◉ Perfil','/profile'],['settings','⚙ Configurações','/configs']];
let scheduled=false,repairing=false;

const css=document.createElement('style');
css.id='ct132-nav-integrity-style';
css.textContent=`
.sidebar>.nav{display:none!important}.ct132-router-nav{display:grid!important;gap:4px}.ct132-router-nav a{display:flex;align-items:center;gap:7px;text-decoration:none;color:inherit;padding:10px 12px;border:1px solid transparent;border-radius:10px;cursor:pointer}.ct132-router-nav a.active{background:#0d2a3c;color:#dff7ff;border-color:#34779b}.ct132-mobile-router-nav{display:none}.ct132-profile-preview{grid-template-columns:none!important;grid-auto-flow:column!important;grid-auto-columns:142px!important;overflow-x:auto!important;overflow-y:hidden!important;width:100%!important;max-width:100%!important}#ct120-profile [data-ct120-slot="series"] .ct120-row.ct132-profile-preview,#ct120-profile [data-ct120-slot="movies"] .ct120-row.ct132-profile-preview{grid-template-columns:none!important;grid-auto-flow:column!important;grid-auto-columns:142px!important;overflow-x:auto!important;overflow-y:hidden!important}.ct132-profile-preview>.ct120-card{min-width:0!important;width:auto!important}.ct132-route-shell{min-height:calc(100vh - 44px)}
@media(max-width:850px){.ct132-router-nav{display:none!important}.mobile-nav{display:none!important}.ct132-mobile-router-nav{display:flex!important;position:sticky;bottom:0;z-index:60;gap:4px;overflow-x:auto;background:#061018f2;border-top:1px solid #1d4053;padding:7px;backdrop-filter:blur(12px)}.ct132-mobile-router-nav a{flex:1 0 auto;text-align:center;text-decoration:none;color:#b9ccd6;border:1px solid transparent;border-radius:9px;padding:8px 9px;font-size:10px}.ct132-mobile-router-nav a.active{background:#0d2a3c;color:#fff;border-color:#34779b}#ct120-profile [data-ct120-slot="series"] .ct120-row.ct132-profile-preview,#ct120-profile [data-ct120-slot="movies"] .ct120-row.ct132-profile-preview,.ct132-profile-preview{grid-auto-columns:132px!important}}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function links(cls){const a=primary();return items.map(([k,l,p])=>`<a class="${k===a?'active':''}" data-ct132-link href="${href(p)}"${k===a?' aria-current="page"':''}>${l}</a>`).join('')}
function ensureNav(){
  const side=$('.sidebar');if(side){let nav=$(':scope>.ct132-router-nav',side);if(!nav){nav=document.createElement('nav');nav.className='ct132-router-nav';side.appendChild(nav)}const html=links('');if(nav.innerHTML!==html)nav.innerHTML=html}
  const content=$('.content');if(content){let nav=$(':scope>.ct132-mobile-router-nav',content);if(!nav){nav=document.createElement('nav');nav.className='ct132-mobile-router-nav';nav.setAttribute('data-ct120-keep','');content.appendChild(nav)}const html=links('');if(nav.innerHTML!==html)nav.innerHTML=html}
}
function routeMismatch(){const p=path(),h=String($('.content h1')?.textContent||'').toLowerCase();if(p==='/profile'&&!h.includes('perfil'))return true;if(p==='/discover'&&!h.includes('descobrir'))return true;if(p==='/configs'&&!h.includes('config'))return true;return false}
function enforce(){scheduled=false;ensureNav();if(!repairing&&routeMismatch()&&typeof window.__ct132Go==='function'){repairing=true;Promise.resolve(window.__ct132Go(path())).finally(()=>setTimeout(()=>{repairing=false},80))}}
function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(enforce)}

window.addEventListener('click',e=>{const p=e.target.closest?.('[data-ct131-person]');if(!p)return;const id=Number(p.dataset.ct131Person||0);if(id<=0||typeof window.__ct132Go!=='function')return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void window.__ct132Go(`/person/${id}`)},true);
window.addEventListener('popstate',schedule);if(!web)window.addEventListener('hashchange',schedule);
window.addEventListener('cinetracker:auth-state-change',()=>setTimeout(enforce,80));
window.addEventListener('cinetracker:data-changed',schedule);
const host=$('#app')||document.documentElement;new MutationObserver(schedule).observe(host,{childList:true,subtree:true});
for(const d of[0,80,240,700,1600])setTimeout(enforce,d);
})();
