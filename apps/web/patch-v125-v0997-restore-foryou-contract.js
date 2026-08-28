(() => {
'use strict';
if (window.__ct0997RestoreForYou125Loaded) return;
window.__ct0997RestoreForYou125Loaded = true;
window.__ct0997RestoreForYou125 = 'v125-restore-foryou-only-no-other-tabs';

const norm125 = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const style125 = document.createElement('style');
style125.id = 'ct0997-restore-foryou125-style';
style125.textContent = `
.ct125-fresh-row{display:grid;grid-template-columns:repeat(3,minmax(0,152px));gap:10px;align-items:start}.ct125-fresh-slot{min-width:0}.ct125-fresh-slot>small{display:block;margin:0 0 6px;color:#819aaa;font-size:9px;font-weight:800;text-transform:uppercase}@media(max-width:520px){.ct125-fresh-row{grid-template-columns:repeat(3,132px);overflow-x:auto;padding-bottom:7px}}
`;
document.getElementById(style125.id)?.remove();
document.head.appendChild(style125);

function section125(root, title) {
  const wanted = norm125(title);
  return [...root.querySelectorAll('.ct124-section')].find(s => norm125(s.querySelector('h2')?.textContent) === wanted) || null;
}
function slot125(label, card) {
  if (!card) return null;
  const slot = document.createElement('div');
  slot.className = 'ct125-fresh-slot';
  const small = document.createElement('small');
  small.textContent = label;
  slot.append(small, card);
  return slot;
}
function apply125() {
  const root = document.querySelector('#ct120-page[data-ct120-route="discover"] #ct120-discover');
  if (!root) return false;
  const active = root.querySelector('.ct124-tab.active[data-ct124-tab="foryou"]');
  if (!active) return false;
  const out = root.querySelector('[data-ct124-results]');
  if (!out || out.dataset.ct125ForYouContract === '1') return false;
  const loading = out.querySelector('.ct124-loading');
  if (loading) return false;

  const daily = section125(out, 'Indicação do dia');
  const movies = section125(out, 'Filmes para você');
  const series = section125(out, 'Séries para você');
  const anime = section125(out, 'Animes para você');
  const movieCard = movies?.querySelector('.ct124-card') || null;
  const seriesCard = series?.querySelector('.ct124-card') || null;
  const animeCard = anime?.querySelector('.ct124-card') || null;
  if (!daily && !movieCard && !seriesCard && !animeCard) return false;

  const fresh = document.createElement('section');
  fresh.className = 'ct124-section ct125-fresh';
  fresh.innerHTML = '<div class="ct124-head"><h2>100% novos</h2><small>fora da Watchlist e histórico</small></div><div class="ct125-fresh-row"></div>';
  const row = fresh.querySelector('.ct125-fresh-row');
  const type = root.querySelector('.ct124-chip.active[data-ct124-type]')?.dataset?.ct124Type || 'all';
  const slots = type === 'movie'
    ? [['Filme', movieCard]]
    : type === 'tv'
      ? [['Série', seriesCard], ['Anime', animeCard]]
      : [['Filme', movieCard], ['Série', seriesCard], ['Anime', animeCard]];
  for (const [label, card] of slots) {
    const slot = slot125(label, card);
    if (slot) row.appendChild(slot);
  }
  if (!row.children.length) fresh.innerHTML += '<div class="ct124-empty">Nenhum título novo elegível agora.</div>';

  const fragment = document.createDocumentFragment();
  if (daily && type !== 'tv') fragment.appendChild(daily);
  fragment.appendChild(fresh);
  out.replaceChildren(fragment);
  out.dataset.ct125ForYouContract = '1';
  return true;
}
function schedule125() {
  for (const delay of [0, 60, 180, 500, 1100]) setTimeout(apply125, delay);
}

document.addEventListener('click', e => {
  if (e.target.closest?.('[data-ct124-tab="foryou"],[data-ct124-type]')) schedule125();
}, false);
window.addEventListener('cinetracker:data-changed', schedule125);
window.addEventListener('cinetracker:auth-state-change', schedule125);
window.__ct0997ApplyForYouContract = apply125;
schedule125();
})();
