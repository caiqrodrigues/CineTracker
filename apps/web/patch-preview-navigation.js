(() => {
'use strict';
if (window.__ctPreviewNavigationButtons) return;
window.__ctPreviewNavigationButtons = 'web-0.99.2-fix2-buttons-discover-v2';

const definitions = [
  {
    view: 'home',
    label: 'Home',
    mobile: 'Home',
    legacy: '⌂ ',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>'
  },
  {
    view: 'discover',
    label: 'Descobrir',
    mobile: 'Descobrir',
    legacy: '✦ ',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>'
  },
  {
    view: 'profile',
    label: 'Perfil',
    mobile: 'Perfil',
    legacy: '◉ ',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"/></svg>'
  },
  {
    view: 'settings',
    label: 'Configurações',
    mobile: 'Config.',
    legacy: '⚙ ',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h8M16 7h4M4 17h4M12 17h8"/><circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'
  }
];

const style = document.createElement('style');
style.id = 'ct-preview-navigation-buttons-style';
style.textContent = `
.sidebar .nav{display:grid!important;gap:6px!important;width:100%!important}
.sidebar .nav button[data-view]{
  position:relative!important;width:100%!important;min-width:0!important;min-height:44px!important;
  margin:0!important;padding:10px 12px!important;border:1px solid transparent!important;border-radius:10px!important;
  display:grid!important;grid-template-columns:20px minmax(0,1fr)!important;align-items:center!important;column-gap:10px!important;
  background:transparent!important;color:#e7edf3!important;text-align:left!important;text-decoration:none!important;
  font-size:13px!important;font-weight:650!important;line-height:1.2!important;cursor:pointer!important;
  pointer-events:auto!important;touch-action:manipulation!important;transition:background .16s ease,border-color .16s ease,color .16s ease!important;
}
.sidebar .nav button[data-view]:hover{background:#0b1822!important;border-color:#1c3d54!important;color:#fff!important}
.sidebar .nav button[data-view].active{background:#0d2638!important;border-color:#2f8bc8!important;color:#69bdff!important}
.sidebar .nav button[data-view]:focus-visible,.mobile-nav button[data-view]:focus-visible{outline:2px solid #69bdff!important;outline-offset:2px!important}
.ct-nav-icon{width:19px!important;height:19px!important;display:block!important;color:currentColor!important;flex:none!important}
.ct-nav-icon svg{width:100%!important;height:100%!important;display:block!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
.ct-nav-label{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.ct-nav-legacy{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.mobile-nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
.mobile-nav button[data-view]{
  min-width:0!important;min-height:52px!important;padding:6px 3px!important;border-radius:10px!important;
  display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;
  color:#aebbc5!important;font-size:10px!important;line-height:1.1!important;cursor:pointer!important;pointer-events:auto!important;touch-action:manipulation!important;
}
.mobile-nav button[data-view] .ct-nav-icon{width:19px!important;height:19px!important}
.mobile-nav button[data-view].active{background:#0d2638!important;border-color:#2f8bc8!important;color:#69bdff!important}

/* Descobrir: mantém pílulas acima de camadas históricas e com hit-area real. */
.ct991-discover-tabs,#ct991-discover-controls,.ct991-discover-filters{
  position:relative!important;z-index:240!important;pointer-events:auto!important;isolation:isolate!important;
}
.ct991-tab,.ct991-filter{
  position:relative!important;z-index:241!important;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important;
}
.ct-preview-discover-empty{
  border:1px dashed #2d5269;border-radius:14px;padding:18px;background:#08131b;color:#b9cedb;
}
.ct-preview-discover-empty strong{display:block;color:#edf7fd;margin-bottom:6px}
.ct-preview-discover-empty p{margin:0 0 12px;line-height:1.5;font-size:12px}
.ct-preview-discover-empty .actions{display:flex;gap:8px;flex-wrap:wrap}
.ct-preview-discover-empty button{
  border:1px solid #315b75;background:#0d2230;color:#eaf7ff;border-radius:10px;padding:8px 11px;cursor:pointer;pointer-events:auto!important;
}
`;
document.head.appendChild(style);

function normalizedText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function isHistoryNavigation(element) {
  const target = String(element?.dataset?.view || element?.dataset?.view99 || element?.dataset?.view991 || '').toLowerCase();
  if (target === 'history') return true;
  const href = normalizedText(element?.getAttribute?.('href'));
  if (href.includes('historico') || href.includes('history')) return true;
  const text = normalizedText(element?.textContent);
  return text === 'historico' || text.endsWith(' historico') || text === 'history' || text.endsWith(' history');
}

function purgeHistory() {
  document.querySelectorAll('.sidebar .nav,.mobile-nav').forEach(nav => {
    nav.querySelectorAll('button,a,[data-view],[data-view99],[data-view991]').forEach(element => {
      if (isHistoryNavigation(element)) element.remove();
    });
  });
}

function currentView() {
  let value = '';
  try { value = String(typeof view !== 'undefined' ? view : window.view || ''); } catch {}
  if (!value) value = document.querySelector('.sidebar .nav button.active,.mobile-nav button.active')?.dataset.view || 'home';
  return value === 'history' ? 'profile' : value;
}

function button(definition, mobile, active) {
  const visibleLabel = mobile ? definition.mobile : definition.label;
  const legacy = mobile ? '' : `<span class="ct-nav-legacy" aria-hidden="true">${definition.legacy}</span>`;
  return `<button type="button" data-view="${definition.view}" data-ct-preview-nav="1" class="${active === definition.view ? 'active' : ''}" aria-label="${definition.label}"${active === definition.view ? ' aria-current="page"' : ''}>${legacy}<span class="ct-nav-icon">${definition.icon}</span><span class="ct-nav-label">${visibleLabel}</span></button>`;
}

function expectedText(definition, mobile) {
  return mobile ? definition.mobile : `${definition.legacy}${definition.label}`;
}

function enhance(nav, mobile) {
  if (!nav) return;
  purgeHistory();
  const active = currentView();
  const existing = [...nav.querySelectorAll(':scope > button')];
  const valid = existing.length === definitions.length && existing.every((item, index) => {
    const definition = definitions[index];
    return item.dataset.view === definition.view &&
      item.dataset.ctPreviewNav === '1' &&
      (item.textContent || '').trim() === expectedText(definition, mobile).trim();
  });
  if (!valid) {
    nav.innerHTML = definitions.map(definition => button(definition, mobile, active)).join('');
    return;
  }
  existing.forEach(item => {
    const selected = item.dataset.view === active;
    item.classList.toggle('active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function repairDiscoverFallback() {
  const host = document.querySelector('#ct991-discover-results');
  if (!host || host.querySelector('.ct-preview-discover-empty')) return;
  const recommendationRoot = host.querySelector('.ct991-rec');
  if (!recommendationRoot) return;
  if (host.querySelector('.ct991-media-card')) return;

  const empties = [...host.querySelectorAll('.ct991-empty')];
  if (!empties.length) return;
  const eligibleOnly = empties.every(item => /Nenhum título elegível/i.test(item.textContent || ''));
  if (!eligibleOnly) return;

  host.innerHTML = `<div class="ct-preview-discover-empty">
    <strong>Ainda não há dados suficientes para montar o Pra Você.</strong>
    <p>Atualize as recomendações ou importe/sincronize seu histórico para liberar sugestões personalizadas. As outras abas do Descobrir continuam disponíveis normalmente.</p>
    <div class="actions">
      <button type="button" data-preview-refresh-for-you>Atualizar recomendações</button>
      <button type="button" data-preview-go-settings>Importar / sincronizar dados</button>
    </div>
  </div>`;
}

function enhanceAll() {
  purgeHistory();
  enhance(document.querySelector('.sidebar .nav'), false);
  enhance(document.querySelector('.mobile-nav'), true);
  repairDiscoverFallback();
}

let pending = 0;
function schedule() {
  window.clearTimeout(pending);
  pending = window.setTimeout(enhanceAll, 25);
}

for (const delay of [0, 60, 180, 420, 900]) window.setTimeout(enhanceAll, delay);
window.addEventListener('cinetracker:data-changed', schedule);
window.addEventListener('popstate', schedule);

window.setTimeout(() => {
  const app = document.querySelector('#app');
  if (!app) return;
  const observer = new MutationObserver(schedule);
  observer.observe(app, { childList: true, subtree: true });
  window.__ctPreviewNavigationObserver = observer;
}, 200);
})();
