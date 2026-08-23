(() => {
  'use strict';
  if (window.__ct51Loaded) return;
  window.__ct51Loaded = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
  const poster = (p) => p ? `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=w342` : '';

  let assistKind = 'series';
  let assistMode = localStorage.getItem('ct51_mode') || 'carousel';
  let seriesRows = [];
  let movieRows = [];
  let current = { screen: null, type: null, id: 0, season: 0, episode: 0 };
  const navStack = [];

  const css = document.createElement('style');
  css.id = 'ct51-style';
  css.textContent = `
    :root{color-scheme:dark}
    .ct51-scroll{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:82%!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;padding-bottom:6px!important}
    .ct51-scroll::-webkit-scrollbar,.ct51-pills::-webkit-scrollbar{display:none}
    .ct51-card{display:grid;grid-template-columns:88px minmax(0,1fr);min-height:132px;border:1px solid #1d3040;border-radius:14px;overflow:hidden;background:#10161b;scroll-snap-align:start;cursor:pointer}
    .ct51-poster{background:#0a1720 center/cover no-repeat;min-height:132px}
    .ct51-body{padding:11px;min-width:0}.ct51-title{font-size:14px;font-weight:700;line-height:1.2}.ct51-meta,.ct51-sub{font-size:10px;color:#8a98a5;margin-top:7px}
    .ct51-check{margin-top:10px;padding:8px 10px;border-radius:10px;border:1px solid #385269;background:#0b141b;color:#e8f1f7;font-size:10px}.ct51-check:disabled{opacity:.55}
    .ct51-section{margin:22px 0}.ct51-section h2{font-size:20px;margin:0 0 4px}.ct51-section>p{font-size:11px;color:#7f8c97;margin:0 0 10px}
    .ct51-pills{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:8px 0 13px}.ct51-pill{white-space:nowrap;padding:8px 14px;border-radius:999px;border:1px solid #294053;background:#0b1218;color:#bcd0df}.ct51-pill.active{background:#123c61;border-color:#4b9bd7;color:#fff}
    .ct51-list{display:grid;gap:10px}.ct51-empty{padding:15px;border:1px solid #1e3140;border-radius:13px;background:#0c1217;color:#8999a6}
    .ct51-mode-carousel .ct51-list{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:82%!important;grid-template-columns:none!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important}
    .ct51-mode-grid .ct51-list{grid-template-columns:repeat(2,minmax(0,1fr))}.ct51-mode-grid .ct51-card{display:block;min-height:0}.ct51-mode-grid .ct51-poster{aspect-ratio:2/3;min-height:0}.ct51-mode-list .ct51-list{grid-template-columns:1fr}
    .ct51-back{padding:9px 12px;border-radius:11px;border:1px solid #294052;background:#0d151b;color:#fff;margin:0 0 14px}
    .ct51-hero{display:grid;grid-template-columns:110px minmax(0,1fr);gap:13px}.ct51-hero-poster{aspect-ratio:2/3;border-radius:13px;background:#0b1720 center/cover no-repeat}.ct51-hero h1{font-size:22px;line-height:1.15;margin:0}.ct51-overview{font-size:12px;line-height:1.5;color:#a9b5be}
    .ct51-season{border:1px solid #1d3040;border-radius:12px;margin:9px 0;overflow:hidden}.ct51-season-btn{width:100%;border:0;background:#0d151c;color:#fff;text-align:left;padding:12px;font-weight:700}.ct51-eps{padding:0 11px 9px}
    .ct51-ep{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center;border-top:1px solid #20303b;padding:10px 0;cursor:pointer}.ct51-seen{width:34px;height:34px;border-radius:50%;border:1px solid #375168;background:#0b131b;color:#9aa8b2}.ct51-seen.on{background:#153a25;border-color:#39754d;color:#a7dfb5}
    .ct51-provider{margin-top:12px;font-size:11px;color:#9badba}.ct51-chip{display:inline-block;margin:5px 4px 0 0;padding:5px 8px;border:1px solid #294052;border-radius:999px;background:#0b141b;color:#c5d5e1;font-size:9px}
    body.ct51-discover .content .grid,body.ct51-discover .content [class*="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
    body.ct51-discover .content .card{min-width:0!important;width:auto!important;margin:0!important}body.ct51-discover .content .poster,body.ct51-discover .content .tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important}
    body.ct51-discover .content .card-body{padding:6px!important}body.ct51-discover .content .card h3{font-size:10px!important;line-height:1.15!important}body.ct51-discover .content .card-actions,body.ct51-discover .content .cast,body.ct51-discover .content .availability{display:none!important}
  `;
  document.head.appendChild(css);

  function rpc(name, args = {}) { return sbRpc(name, args); }
  function headers() { return typeof authHeaders === 'function' ? authHeaders() : {}; }

  async function tmdb(type, id, extra = '') {
    const url = new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);
    url.searchParams.set('path', `/${type}/${id}${extra}`);
    url.searchParams.set('language', 'pt-BR');
    const response = await fetch(url, { headers: headers() });
    if (!response.ok) throw new Error(`TMDB ${response.status}`);
    return response.json();
  }

  async function loadSeries() {
    seriesRows = await rpc('cinetracker_continue_items_v2', {}) || [];
    seriesRows.sort((a, b) => Date.parse(b.last_watched_at || 0) - Date.parse(a.last_watched_at || 0));
    return seriesRows;
  }

  async function loadMovies() {
    const pending = await sbApi('media_overrides?select=state,media_id,updated_at,media:media(id,tmdb_id,media_type,title,poster_path,release_year,raw_tmdb)&state=in.(AddedToWatchlist,WatchLater)&order=updated_at.desc&limit=1000');
    const seenRows = await sbApi('media_overrides?select=media_id&state=in.(AlreadySeen,Completed)&limit=1000');
    const seen = new Set((seenRows || []).map((x) => x.media_id));
    movieRows = (pending || []).map((x) => x.media).filter((m) => m?.media_type === 'movie' && !seen.has(m.id));
    return movieRows;
  }

  function seriesMeta(row) {
    return `${row.media_kind === 'anime' ? 'ANIME' : 'SÉRIE'} · ${Number(row.watched_episodes || 0)}/${row.total_episodes || '?'}`;
  }

  function statusText(row) {
    if (row.status === 'up_to_date') return 'Em dia';
    if (row.status === 'dusty') return 'Juntando poeira';
    if (row.status === 'not_started') return 'Não iniciada';
    return 'Acompanhando';
  }

  function card(row, type = 'tv', withCheck = false) {
    const title = row.title || `TMDB #${row.tmdb_id}`;
    return `<article class="ct51-card" data-type="${type}" data-id="${Number(row.tmdb_id || 0)}">
      <div class="ct51-poster"${row.poster_path ? ` style="background-image:url('${poster(row.poster_path)}')"` : ''}></div>
      <div class="ct51-body">
        <div class="ct51-title">${esc(title)}</div>
        <div class="ct51-meta">${type === 'movie' ? 'FILME' : seriesMeta(row)}</div>
        <div class="ct51-sub">${type === 'movie' ? 'Na Watchlist' : statusText(row)}</div>
        ${withCheck ? `<button class="ct51-check" data-check="${Number(row.tmdb_id)}">✓ Próximo episódio</button>` : ''}
      </div>
    </article>`;
  }

  async function episodeState(id) {
    try { return await rpc('cinetracker_episode_state', { p_tmdb_id: id }) || []; }
    catch { return []; }
  }

  async function findNext(row) {
    const id = Number(row.tmdb_id);
    const detail = await tmdb('tv', id);
    const state = await episodeState(id);
    const watched = new Set(state.filter((x) => x.watched).map((x) => `${Number(x.season_number)}:${Number(x.episode_number)}`));
    const seasons = (detail.seasons || []).filter((x) => x.season_number > 0).sort((a, b) => a.season_number - b.season_number);
    for (const season of seasons) {
      for (let episode = 1; episode <= Number(season.episode_count || 0); episode++) {
        if (!watched.has(`${season.season_number}:${episode}`)) return { season: season.season_number, episode };
      }
    }
    return null;
  }

  async function markEpisode(id, season, episode, watched, title) {
    if (watched) {
      const state = await episodeState(id);
      const seen = new Set(state.filter((x) => x.watched).map((x) => `${Number(x.season_number)}:${Number(x.episode_number)}`));
      const missing = [];
      for (let n = 1; n < episode; n++) if (!seen.has(`${season}:${n}`)) missing.push(n);
      if (missing.length && confirm(`Você marcou o episódio ${episode}. Já assistiu também os ${missing.length} episódio(s) anterior(es) desta temporada?`)) {
        await rpc('cinetracker_mark_episode_through', { p_tmdb_id: id, p_season: season, p_episode: episode });
        return;
      }
    }
    await rpc('cinetracker_set_episode_watched', {
      p_tmdb_id: id, p_season: season, p_episode: episode, p_watched: watched, p_title: title || null
    });
  }

  async function refreshData() {
    seriesRows = [];
    movieRows = [];
    try { window.dispatchEvent(new CustomEvent('cinetracker:data-changed')); } catch {}
  }

  async function markNext(button, row) {
    button.disabled = true;
    try {
      const next = await findNext(row);
      if (!next) throw new Error('Sem próximo episódio');
      await markEpisode(Number(row.tmdb_id), next.season, next.episode, true, null);
      await refreshData();
      button.textContent = '✓ Marcado';
      if (current.screen === 'assist') setTimeout(renderAssist, 150);
      else setTimeout(fixHome, 150);
    } catch {
      button.textContent = 'Falha';
    } finally {
      setTimeout(() => { button.disabled = false; }, 600);
    }
  }

  function bindCards(root = document) {
    $$('.ct51-card[data-id]', root).forEach((node) => {
      node.onclick = (event) => {
        if (event.target.closest('button')) return;
        openDetail(node.dataset.type, Number(node.dataset.id));
      };
    });
    $$('[data-check]', root).forEach((button) => {
      button.onclick = (event) => {
        event.stopPropagation();
        const row = seriesRows.find((x) => Number(x.tmdb_id) === Number(button.dataset.check));
        if (row) markNext(button, row);
      };
    });
  }

  async function fixHome() {
    if (typeof view === 'undefined' || view !== 'home') return;
    if (!current.screen) current = { screen: 'home', type: null, id: 0, season: 0, episode: 0 };
    await loadSeries();
    const rows = seriesRows.filter((x) => x.status === 'following');
    const section = $$('section,.section').find((s) => /Continuar assistindo/i.test(s.querySelector('h2')?.textContent || ''));
    if (!section) return;
    section.innerHTML = `<div class="section-title"><h2>Continuar assistindo</h2><span class="eyebrow">ACOMPANHANDO</span></div>
      ${rows.length ? `<div class="ct51-scroll">${rows.map((r) => card(r, 'tv', true)).join('')}</div>` : '<div class="ct51-empty">Nenhum título em andamento.</div>'}`;
    bindCards(section);
  }

  function section(key, title, description, rows) {
    return `<section class="ct51-section" data-section="${key}">
      <h2>${title}</h2><p>${description}</p>
      <div class="ct51-list">${rows.length ? rows.map((r) => card(r, 'tv', key === 'following')).join('') : '<div class="ct51-empty">Nenhuma série nesta seção.</div>'}</div>
    </section>`;
  }

  async function renderAssist() {
    current = { screen: 'assist', type: null, id: 0, season: 0, episode: 0 };
    const root = $('#app');
    root.innerHTML = `<div class="app"><main class="content">
      <h1>Assistir</h1>
      <div class="ct51-pills">
        <button class="ct51-pill ${assistKind === 'series' ? 'active' : ''}" data-kind="series">Séries</button>
        <button class="ct51-pill ${assistKind === 'movies' ? 'active' : ''}" data-kind="movies">Filmes</button>
      </div>
      <div class="ct51-pills">
        <button class="ct51-pill ${assistMode === 'carousel' ? 'active' : ''}" data-mode="carousel">Carrossel</button>
        <button class="ct51-pill ${assistMode === 'grid' ? 'active' : ''}" data-mode="grid">Grade</button>
        <button class="ct51-pill ${assistMode === 'list' ? 'active' : ''}" data-mode="list">Lista</button>
      </div>
      <div id="ct51-assist" class="ct51-mode-${assistMode}"><div class="ct51-empty">Carregando…</div></div>
    </main></div>`;

    $$('[data-kind]').forEach((button) => {
      button.onclick = () => { assistKind = button.dataset.kind; renderAssist(); };
    });
    $$('[data-mode]').forEach((button) => {
      button.onclick = () => {
        assistMode = button.dataset.mode;
        localStorage.setItem('ct51_mode', assistMode);
        renderAssist();
      };
    });

    const box = $('#ct51-assist');
    try {
      if (assistKind === 'series') {
        await loadSeries();
        const up = seriesRows.filter((x) => x.status === 'up_to_date');
        const following = seriesRows.filter((x) => x.status === 'following');
        const dusty = seriesRows.filter((x) => x.status === 'dusty');
        const notStarted = seriesRows.filter((x) => x.status === 'not_started');
        box.innerHTML = section('up', 'Em dia', 'Tudo disponível já foi visto; aguardando próximo episódio ou temporada.', up)
          + section('following', 'Acompanhando', 'Séries que você está assistindo atualmente.', following)
          + section('dusty', 'Juntando poeira', 'Sem atividade há mais de 30 dias.', dusty)
          + section('not', 'Não iniciadas', 'Séries que ainda não começaram.', notStarted);
        bindCards(box);
        setTimeout(() => box.querySelector('[data-section="following"]')?.scrollIntoView({ block: 'start' }), 80);
      } else {
        await loadMovies();
        box.innerHTML = `<section class="ct51-section"><h2>Filmes para assistir</h2><div class="ct51-list">
          ${movieRows.length ? movieRows.map((r) => card(r, 'movie', false)).join('') : '<div class="ct51-empty">Nenhum filme pendente.</div>'}
        </div></section>`;
        bindCards(box);
      }
    } catch (error) {
      box.innerHTML = `<div class="ct51-empty">Falha ao carregar: ${esc(error.message || error)}</div>`;
    }
  }

  async function providers(type, id) {
    try {
      const data = await tmdb(type, id, '/watch/providers');
      const br = data.results?.BR || {};
      const all = [...(br.flatrate || []), ...(br.free || []), ...(br.ads || []), ...(br.rent || []), ...(br.buy || [])];
      const names = [];
      for (const p of all) if (p.provider_name && !names.includes(p.provider_name)) names.push(p.provider_name);
      return names.slice(0, 8);
    } catch { return []; }
  }

  function pushCurrent() {
    if (current.screen) navStack.push({ ...current });
  }

  async function openDetail(type, id) {
    if (!id) return;
    pushCurrent();
    current = { screen: 'detail', type, id, season: 0, episode: 0 };
    $('#app').innerHTML = '<div class="app"><main class="content"><div class="ct51-empty">Carregando detalhes…</div></main></div>';

    try {
      const detail = await tmdb(type, id);
      const providerNames = await providers(type, id);
      const content = $('.content');
      content.innerHTML = `<button class="ct51-back" id="ct51-back">← Voltar</button>
        <div class="ct51-hero">
          <div class="ct51-hero-poster"${detail.poster_path ? ` style="background-image:url('${poster(detail.poster_path)}')"` : ''}></div>
          <div><h1>${esc(detail.title || detail.name || 'Sem título')}</h1>
            <div class="ct51-meta">${type === 'movie' ? 'FILME' : `SÉRIE · ${detail.number_of_seasons || 0} temporadas · ${detail.number_of_episodes || 0} episódios`}</div>
            ${providerNames.length ? `<div class="ct51-provider"><b>Onde assistir:</b><br>${providerNames.map((x) => `<span class="ct51-chip">${esc(x)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
        <p class="ct51-overview">${esc(detail.overview || 'Sem sinopse disponível.')}</p>
        <div id="ct51-extra"></div>`;
      $('#ct51-back').onclick = back;

      if (type === 'tv') await renderSeasons(id, detail);
    } catch (error) {
      $('.content').innerHTML = `<button class="ct51-back" id="ct51-back">← Voltar</button><div class="ct51-empty">Falha ao carregar detalhes: ${esc(error.message || error)}</div>`;
      $('#ct51-back').onclick = back;
    }
  }

  async function renderSeasons(id, detail) {
    const state = await episodeState(id);
    const seen = new Map(state.map((x) => [`${Number(x.season_number)}:${Number(x.episode_number)}`, !!x.watched]));
    const extra = $('#ct51-extra');
    const seasons = (detail.seasons || []).filter((s) => s.season_number > 0);
    extra.innerHTML = seasons.map((s) => `<div class="ct51-season">
      <button class="ct51-season-btn" data-season="${s.season_number}">Temporada ${s.season_number} · ${s.episode_count || 0} episódios</button>
      <div class="ct51-eps" id="ct51-s${s.season_number}" hidden></div>
    </div>`).join('');

    $$('[data-season]', extra).forEach((button) => {
      button.onclick = async () => {
        const season = Number(button.dataset.season);
        const box = $(`#ct51-s${season}`);
        box.hidden = !box.hidden;
        if (box.hidden || box.dataset.loaded) return;
        box.textContent = 'Carregando episódios…';
        try {
          const seasonData = await tmdb('tv', id, `/season/${season}`);
          box.innerHTML = (seasonData.episodes || []).map((ep) => {
            const watched = !!seen.get(`${season}:${ep.episode_number}`);
            return `<div class="ct51-ep" data-episode="${ep.episode_number}" data-name="${esc(ep.name || 'Episódio')}">
              <div><strong>E${ep.episode_number} · ${esc(ep.name || 'Episódio')}</strong><span class="ct51-sub">${ep.air_date ? new Date(ep.air_date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem data'}</span></div>
              <button class="ct51-seen ${watched ? 'on' : ''}" data-seen="${watched ? '1' : '0'}">${watched ? '✓' : '○'}</button>
            </div>`;
          }).join('');
          box.dataset.loaded = '1';
          bindEpisodes(box, id, season);
        } catch {
          box.textContent = 'Falha ao carregar episódios.';
        }
      };
    });
  }

  function bindEpisodes(box, id, season) {
    $$('.ct51-ep', box).forEach((row) => {
      const episode = Number(row.dataset.episode);
      row.onclick = (event) => {
        if (event.target.closest('button')) return;
        openEpisode(id, season, episode);
      };
      const button = $('.ct51-seen', row);
      button.onclick = async (event) => {
        event.stopPropagation();
        const watched = button.dataset.seen !== '1';
        button.disabled = true;
        try {
          await markEpisode(id, season, episode, watched, row.dataset.name || null);
          button.dataset.seen = watched ? '1' : '0';
          button.classList.toggle('on', watched);
          button.textContent = watched ? '✓' : '○';
          await refreshData();
        } finally {
          button.disabled = false;
        }
      };
    });
  }

  async function openEpisode(id, season, episode) {
    pushCurrent();
    current = { screen: 'episode', type: 'tv', id, season, episode };
    $('#app').innerHTML = '<div class="app"><main class="content"><div class="ct51-empty">Carregando episódio…</div></main></div>';
    try {
      const seasonData = await tmdb('tv', id, `/season/${season}`);
      const ep = (seasonData.episodes || []).find((x) => Number(x.episode_number) === episode);
      const state = await episodeState(id);
      const watched = state.some((x) => Number(x.season_number) === season && Number(x.episode_number) === episode && x.watched);
      const content = $('.content');
      content.innerHTML = `<button class="ct51-back" id="ct51-back">← Temporada ${season}</button>
        <h1>T${season}E${episode} · ${esc(ep?.name || 'Episódio')}</h1>
        ${ep?.still_path ? `<div style="aspect-ratio:16/9;border-radius:14px;background:url('${poster(ep.still_path)}') center/cover"></div>` : ''}
        <p class="ct51-overview">${esc(ep?.overview || 'Sem sinopse disponível.')}</p>
        <button class="ct51-check" id="ct51-epcheck">${watched ? '✓ Assistido' : 'Marcar como assistido'}</button>`;
      $('#ct51-back').onclick = back;
      $('#ct51-epcheck').onclick = async () => {
        await markEpisode(id, season, episode, !watched, ep?.name || null);
        await refreshData();
        navStack.pop();
        await openEpisode(id, season, episode);
      };
    } catch {
      $('.content').innerHTML = '<button class="ct51-back" id="ct51-back">← Voltar</button><div class="ct51-empty">Falha ao carregar episódio.</div>';
      $('#ct51-back').onclick = back;
    }
  }

  function forceDiscover() {
    const active = typeof view !== 'undefined' && view === 'discover';
    document.body.classList.toggle('ct51-discover', active);
    if (!active) return;
    const root = $('.content');
    if (!root) return;
    for (const container of $$('div,section', root)) {
      const cards = [...container.children].filter((child) => child.classList?.contains('card'));
      if (cards.length >= 2) {
        container.style.setProperty('display', 'grid', 'important');
        container.style.setProperty('grid-template-columns', 'repeat(3,minmax(0,1fr))', 'important');
        container.style.setProperty('gap', '7px', 'important');
      }
    }
  }

  function fixVersion() {
    if (typeof view === 'undefined' || view !== 'settings') return;
    for (const el of $$('#app *')) {
      if (el.children.length) continue;
      const text = (el.textContent || '').trim();
      if (/^0\.0\.\d+$/.test(text) && /Build/i.test(el.parentElement?.textContent || '')) el.textContent = '0.0.51';
      if (/^CineTracker (Web|Android).*build/i.test(text)) el.textContent = 'CineTracker Android • build 0.0.51';
    }
    const labels = $$('#app *').filter((x) => /CineTracker Android.*build 0\.0\.51/i.test(x.textContent || ''));
    labels.slice(1).forEach((x) => x.remove());
  }

  function back() {
    const previous = navStack.pop();
    if (!previous) {
      if (typeof view !== 'undefined' && view !== 'home') {
        view = 'home';
        current = { screen: 'home', type: null, id: 0, season: 0, episode: 0 };
        render();
        setTimeout(refresh, 80);
        return true;
      }
      return false;
    }
    if (previous.screen === 'assist') { renderAssist(); return true; }
    if (previous.screen === 'detail') { openDetail(previous.type, previous.id); return true; }
    if (previous.screen === 'episode') { openEpisode(previous.id, previous.season, previous.episode); return true; }
    if (['home', 'discover', 'history', 'profile', 'settings'].includes(previous.screen)) {
      view = previous.screen;
      current = previous;
      render();
      setTimeout(refresh, 80);
      return true;
    }
    return false;
  }

  window.ct51Back = back;
  window.ct51Navigate = function (target) {
    if (target === 'assist' || target === 'library') {
      if (current.screen && current.screen !== 'assist') navStack.push({ ...current });
      renderAssist();
      return true;
    }
    try {
      if (current.screen && current.screen !== target) navStack.push({ ...current });
      view = target;
      current = { screen: target, type: null, id: 0, season: 0, episode: 0 };
      render();
      window.scrollTo(0, 0);
      setTimeout(refresh, 80);
      return true;
    } catch { return false; }
  };

  async function refresh() {
    if (typeof view === 'undefined') return;
    if (!current.screen && ['home', 'discover', 'history', 'profile', 'settings'].includes(view)) current.screen = view;
    forceDiscover();
    fixVersion();
    if (view === 'home') await fixHome();
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  }).observe($('#app') || document.documentElement, { childList: true, subtree: true });

  setTimeout(refresh, 120);
  setTimeout(refresh, 600);
  window.ct51Refresh = refresh;
})();
