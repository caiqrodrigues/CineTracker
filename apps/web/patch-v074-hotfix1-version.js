(() => {
'use strict';
if (window.__ctHotfix18Version) return;
window.__ctHotfix18Version = true;
const VERSION = '0.0.97 HOTFIX 18';
function applyHotfixVersion() {
  window.__ctAndroidBuild = VERSION;
  const host = document.querySelector('.content') || document.querySelector('#app');
  if (!host) return;
  for (const el of host.querySelectorAll('.ct95-version,.ct94-version,.ct-version-footer,#ct56-version')) {
    if (/CineTracker|versão|v\d/i.test(el.textContent || '') || el.classList?.contains('ct95-version')) {
      const next = `CineTracker • v${VERSION}`;
      if (el.textContent !== next) el.textContent = next;
    }
  }
}
window.__ctApplyHotfixVersion18 = applyHotfixVersion;
const oldRender = window.render;
if (typeof oldRender === 'function' && !window.__ctHotfix18Render) {
  window.__ctHotfix18Render = oldRender;
  window.render = function(...args) {
    const out = window.__ctHotfix18Render.apply(this, args);
    setTimeout(applyHotfixVersion, 0);
    return out;
  };
}
setTimeout(applyHotfixVersion, 0);
setTimeout(applyHotfixVersion, 250);
})();

(() => {
'use strict';
if (window.__ctProfileStatsHotfix17) return;
window.__ctProfileStatsHotfix17 = true;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function fmt17(minutes) {
  let h = Math.max(0, Math.floor(Number(minutes || 0) / 60));
  const months = Math.floor(h / 720);
  h -= months * 720;
  const days = Math.floor(h / 24);
  h -= days * 24;
  return `${months} ${months === 1 ? 'mês' : 'meses'} ${days} ${days === 1 ? 'dia' : 'dias'} ${h} ${h === 1 ? 'hora' : 'horas'}`;
}

function statByLabel(profile, pattern) {
  return $$('.ct94-stat,.ct93-stat,.ct92-stat', profile).find(card => pattern.test($('.l', card)?.textContent || '')) || null;
}

function setStat(profile, pattern, value) {
  const card = statByLabel(profile, pattern);
  const node = card && $('.v', card);
  if (node) node.textContent = value;
}

function ensureSeriesStatusCards17(profile) {
  const grid = $('.ct94-extra', profile);
  if (!grid) return;
  let upToDate = statByLabel(profile, /^Em dia$/i);
  if (!upToDate) {
    upToDate = document.createElement('div');
    upToDate.className = 'ct94-stat';
    upToDate.dataset.ct17Status = 'up-to-date';
    upToDate.innerHTML = '<div class="l">Em dia</div><div class="v">0</div>';
    const inProgress = statByLabel(profile, /^Em andamento$/i);
    if (inProgress?.nextSibling) grid.insertBefore(upToDate, inProgress.nextSibling);
    else grid.appendChild(upToDate);
  }
  const notStarted = statByLabel(profile, /^(Séries na Watchlist|Não iniciadas)$/i);
  const label = notStarted && $('.l', notStarted);
  if (label) label.textContent = 'Não iniciadas';
}

function localDay17(value) {
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

async function replaceGraph17(profile) {
  const rows = await sbRpc('cinetracker_consumption_daily', { p_limit_days: 19 }).catch(() => []);
  const daily = Array.isArray(rows) ? rows : [];
  const mx = Math.max(1, ...daily.map(x => Number(x.plays || 0)));
  const html = `<h3>Histórico diário</h3><div class="ct95-daily" id="ct17-daily"><div class="ct95-daily-track">${daily.map(x => {
    const n = Number(x.plays || 0);
    const h = Math.max(4, Math.round(n / mx * 130));
    return `<button class="ct95-day" data-day17="${x.day}" data-items17="${Number(x.items || 0)}" data-plays17="${n}"><b>${n.toLocaleString('pt-BR')}</b><span class="ct95-bar" style="height:${h}px"></span><small>${localDay17(x.day)}</small></button>`;
  }).join('') || '<div class="ct91-muted">Sem consumo registrado.</div>'}</div></div>`;

  profile.querySelectorAll('.ct94-chart,.ct93-chart,.ct91-daily,.ct95-daily').forEach(x => {
    const h = x.previousElementSibling;
    if (h && /Gráfico de Consumo|Histórico diário/i.test(h.textContent || '')) h.remove();
    x.remove();
  });

  const extras = [...profile.querySelectorAll('h3')].find(x => /Estatísticas Extras/i.test(x.textContent || ''));
  if (extras) extras.insertAdjacentHTML('beforebegin', html);
  else profile.insertAdjacentHTML('beforeend', html);

  $$('[data-day17]', profile).forEach(btn => {
    btn.onclick = () => alert(`${btn.dataset.plays17} reproduções em ${localDay17(btn.dataset.day17)} (${btn.dataset.items17} registros de histórico).`);
  });
  profile.dataset.graph95 = '1';
  profile.dataset.graph17 = '1';
}

async function refreshProfile17() {
  const profile = $('#ct94-profile,#ct93-profile,#ct92-profile');
  if (!profile || profile.dataset.sync17 === 'loading') return;
  profile.dataset.sync17 = 'loading';
  try {
    const [st0, ss0] = await Promise.all([
      sbRpc('cinetracker_profile_stats', {}).catch(() => ({})),
      sbRpc('cinetracker_series_state_stats', {}).catch(() => ({}))
    ]);
    const s = Array.isArray(st0) ? st0[0] || {} : st0 || {};
    const ss = Array.isArray(ss0) ? ss0[0] || {} : ss0 || {};

    ensureSeriesStatusCards17(profile);
    setStat(profile, /^Episódios$/i, Number(s.episodes_watched || 0).toLocaleString('pt-BR'));
    const epCard = statByLabel(profile, /^Episódios$/i);
    const sub = epCard && $('.s', epCard);
    if (sub) sub.textContent = `de ${Number(ss.history_series ?? s.series_watched ?? 0).toLocaleString('pt-BR')} séries com histórico`;
    setStat(profile, /^Filmes$/i, Number(s.movies_watched || 0).toLocaleString('pt-BR'));
    setStat(profile, /Tempo em séries/i, fmt17(s.series_minutes || 0));
    setStat(profile, /Tempo em filmes/i, fmt17(s.movie_minutes || 0));
    setStat(profile, /Tempo total/i, fmt17(s.total_minutes || 0));
    setStat(profile, /Séries concluídas/i, Number(ss.completed_series || 0).toLocaleString('pt-BR'));
    setStat(profile, /^Em andamento$/i, Number(ss.in_progress_series || 0).toLocaleString('pt-BR'));
    setStat(profile, /^Em dia$/i, Number(ss.up_to_date_series || 0).toLocaleString('pt-BR'));
    setStat(profile, /^(Não iniciadas|Séries na Watchlist)$/i, Number(ss.not_started_series || 0).toLocaleString('pt-BR'));
    setStat(profile, /Filmes na Watchlist/i, Number(ss.watchlist_movies || 0).toLocaleString('pt-BR'));

    await replaceGraph17(profile);
    profile.dataset.sync17 = '1';
    window.__ctApplyHotfixVersion18?.();
  } catch (error) {
    delete profile.dataset.sync17;
    console.warn('CineTracker HOTFIX18: falha ao sincronizar Perfil.', error);
  }
}

let timer17 = null;
function schedule17(delay = 140) {
  clearTimeout(timer17);
  timer17 = setTimeout(() => void refreshProfile17(), delay);
}

new MutationObserver(() => {
  let v = '';
  try { v = String(view || ''); } catch {}
  if (v === 'profile' || $('#ct94-profile,#ct93-profile,#ct92-profile')) schedule17(180);
}).observe($('#app') || document.documentElement, { subtree: true, childList: true });

document.addEventListener('click', e => {
  const n = e.target.closest('[data-view]');
  if (n?.dataset.view === 'profile') schedule17(220);
}, true);

window.addEventListener('cinetracker:data-changed', () => {
  const p = $('#ct94-profile,#ct93-profile,#ct92-profile');
  if (p) {
    delete p.dataset.sync17;
    delete p.dataset.graph17;
    schedule17(220);
  }
});

setTimeout(() => schedule17(0), 250);
})();
