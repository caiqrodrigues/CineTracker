(() => {
'use strict';
if (window.__ct0993WebLoaded) return;
window.__ct0993WebLoaded = true;
window.__ct0993Web = 'web-0.99.3-sidebar-discover-footer';
window.__ctWebBuild = '0.99.3';

const definitions993 = [
  { view:'home', label:'Home', mobile:'Home', legacy:'⌂ ', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>' },
  { view:'discover', label:'Descobrir', mobile:'Descobrir', legacy:'✦ ', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>' },
  { view:'profile', label:'Perfil', mobile:'Perfil', legacy:'◉ ', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"/></svg>' },
  { view:'settings', label:'Configurações', mobile:'Config.', legacy:'⚙ ', icon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h8M16 7h4M4 17h4M12 17h8"/><circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>' }
];

const style993 = document.createElement('style');
style993.id = 'ct0993-web-style';
style993.textContent = `
.ct992-version,.ct991-version,.ct99-version,.ct98-version,.ct95-version,.ct94-version,.ct93-version,.ct92-version,.ct91-version,.ct90-version,.ct89-version,.ct-version-footer,#ct56-version{display:none!important}
.ct993-version{text-align:center;color:#6f8798;font-size:11px;margin:28px 0 8px}
.sidebar .nav{display:grid!important;gap:6px!important;width:100%!important}
.sidebar .nav button[data-view]{position:relative!important;width:100%!important;min-width:0!important;min-height:44px!important;margin:0!important;padding:10px 12px!important;border:1px solid transparent!important;border-radius:10px!important;display:grid!important;grid-template-columns:20px minmax(0,1fr)!important;align-items:center!important;column-gap:10px!important;background:transparent!important;color:#e7edf3!important;text-align:left!important;text-decoration:none!important;font-size:13px!important;font-weight:650!important;line-height:1.2!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important;transition:background .16s ease,border-color .16s ease,color .16s ease!important}
.sidebar .nav button[data-view]:hover{background:#0b1822!important;border-color:#1c3d54!important;color:#fff!important}
.sidebar .nav button[data-view].active{background:#0d2638!important;border-color:#2f8bc8!important;color:#69bdff!important}
.sidebar .nav button[data-view]:focus-visible,.mobile-nav button[data-view]:focus-visible{outline:2px solid #69bdff!important;outline-offset:2px!important}
.ct993-nav-icon{width:19px!important;height:19px!important;display:block!important;color:currentColor!important;flex:none!important}
.ct993-nav-icon svg{width:100%!important;height:100%!important;display:block!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
.ct993-nav-label{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.ct993-nav-legacy{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.mobile-nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
.mobile-nav button[data-view]{min-width:0!important;min-height:52px!important;padding:6px 3px!important;border-radius:10px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;color:#aebbc5!important;font-size:10px!important;line-height:1.1!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important}
.mobile-nav button[data-view] .ct993-nav-icon{width:19px!important;height:19px!important}
.mobile-nav button[data-view].active{background:#0d2638!important;border-color:#2f8bc8!important;color:#69bdff!important}
.ct991-discover-tabs,#ct991-discover-controls,.ct991-discover-filters{position:relative!important;z-index:240!important;pointer-events:auto!important;isolation:isolate!important}
.ct991-tab,.ct991-filter{position:relative!important;z-index:241!important;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}
.ct993-discover-empty{border:1px dashed #2d5269;border-radius:14px;padding:18px;background:#08131b;color:#b9cedb}
.ct993-discover-empty strong{display:block;color:#edf7fd;margin-bottom:6px}
.ct993-discover-empty p{margin:0 0 12px;line-height:1.5;font-size:12px}
.ct993-discover-empty .actions{display:flex;gap:8px;flex-wrap:wrap}
.ct993-discover-empty button{border:1px solid #315b75;background:#0d2230;color:#eaf7ff;border-radius:10px;padding:8px 11px;cursor:pointer;pointer-events:auto!important}
`;
document.head.appendChild(style993);

function normalized993(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function history993(element) {
  const target = String(element?.dataset?.view || element?.dataset?.view99 || element?.dataset?.view991 || '').toLowerCase();
  if (target === 'history') return true;
  const href = normalized993(element?.getAttribute?.('href'));
  if (href.includes('historico') || href.includes('history')) return true;
  const text = normalized993(element?.textContent);
  return text === 'historico' || text.endsWith(' historico') || text === 'history' || text.endsWith(' history');
}
function purgeHistory993() {
  document.querySelectorAll('.sidebar .nav,.mobile-nav').forEach(nav => {
    nav.querySelectorAll('button,a,[data-view],[data-view99],[data-view991]').forEach(element => {
      if (history993(element)) element.remove();
    });
  });
}
function current993() {
  let value = '';
  try { value = String(typeof view !== 'undefined' ? view : window.view || ''); } catch {}
  if (!value) value = document.querySelector('.sidebar .nav button.active,.mobile-nav button.active')?.dataset.view || 'home';
  return value === 'history' ? 'profile' : value;
}
function button993(definition, mobile, active) {
  const visible = mobile ? definition.mobile : definition.label;
  const legacy = mobile ? '' : `<span class="ct993-nav-legacy" aria-hidden="true">${definition.legacy}</span>`;
  return `<button type="button" data-view="${definition.view}" data-ct0993-nav="1" class="${active === definition.view ? 'active' : ''}" aria-label="${definition.label}"${active === definition.view ? ' aria-current="page"' : ''}>${legacy}<span class="ct993-nav-icon">${definition.icon}</span><span class="ct993-nav-label">${visible}</span></button>`;
}
function expected993(definition, mobile) {
  return mobile ? definition.mobile : `${definition.legacy}${definition.label}`;
}
function enhance993(nav, mobile) {
  if (!nav) return;
  const active = current993();
  const existing = [...nav.querySelectorAll(':scope > button')];
  const valid = existing.length === definitions993.length && existing.every((item, index) => {
    const definition = definitions993[index];
    return item.dataset.view === definition.view && item.dataset.ct0993Nav === '1' && (item.textContent || '').trim() === expected993(definition, mobile).trim();
  });
  if (!valid) {
    nav.innerHTML = definitions993.map(definition => button993(definition, mobile, active)).join('');
    return;
  }
  existing.forEach(item => {
    const selected = item.dataset.view === active;
    item.classList.toggle('active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}
function repairForYou993() {
  const host = document.querySelector('#ct991-discover-results');
  if (!host || host.querySelector('.ct993-discover-empty')) return;
  const root = host.querySelector('.ct991-rec');
  if (!root || host.querySelector('.ct991-media-card')) return;
  const empties = [...host.querySelectorAll('.ct991-empty')];
  if (!empties.length) return;
  if (!empties.every(item => /Nenhum título elegível/i.test(item.textContent || ''))) return;
  host.innerHTML = `<div class="ct993-discover-empty"><strong>Ainda não há dados suficientes para montar o Pra Você.</strong><p>Atualize as recomendações ou importe/sincronize seu histórico para liberar sugestões personalizadas. As outras abas do Descobrir continuam disponíveis normalmente.</p><div class="actions"><button type="button" data-ct0993-refresh-for-you>Atualizar recomendações</button><button type="button" data-ct0993-go-settings>Importar / sincronizar dados</button></div></div>`;
}
function footer993() {
  const host = document.querySelector('.content');
  if (!host) return;
  let footer = host.querySelector('.ct993-version');
  if (!footer) {
    footer = document.createElement('div');
    footer.className = 'ct993-version';
    host.appendChild(footer);
  }
  if (footer.textContent !== 'CineTracker • v0.99.3') footer.textContent = 'CineTracker • v0.99.3';
}
function enhanceAll993() {
  purgeHistory993();
  enhance993(document.querySelector('.sidebar .nav'), false);
  enhance993(document.querySelector('.mobile-nav'), true);
  repairForYou993();
  footer993();
}
let pending993 = 0;
function schedule993() {
  window.clearTimeout(pending993);
  pending993 = window.setTimeout(enhanceAll993, 25);
}
for (const delay of [0, 60, 180, 420, 900]) window.setTimeout(enhanceAll993, delay);
window.addEventListener('cinetracker:data-changed', schedule993);
window.addEventListener('popstate', schedule993);
window.setTimeout(() => {
  const app = document.querySelector('#app');
  if (!app) return;
  const observer = new MutationObserver(schedule993);
  observer.observe(app, { childList:true, subtree:true });
  window.__ct0993Observer = observer;
}, 200);
})();
