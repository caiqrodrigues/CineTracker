(() => {
  'use strict';
  const VERSION = '0.2.2';
  let applying = false;

  function profileLanguage() {
    try {
      const raw = localStorage.getItem('cinetracker_session');
      const session = raw ? JSON.parse(raw) : null;
      return session?.user?.user_metadata?.language || document.documentElement.lang || 'pt-BR';
    } catch {
      return 'pt-BR';
    }
  }

  function replaceExact(root, from, to) {
    if (!root?.body) return;
    const walker = document.createTreeWalker(root.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const value = node.nodeValue?.trim();
      if (value === from) node.nodeValue = node.nodeValue.replace(from, to);
    }
  }

  function applyEnglish() {
    if (profileLanguage() !== 'en') return;
    document.documentElement.lang = 'en';
    const pairs = [
      ['Hoje','Today'],['Biblioteca','Library'],['Descobrir','Discover'],['Importar','Import'],['Estatísticas','Stats'],
      ['Configurações','Settings'],['Conta','Account'],['Seu universo de mídia','Your media universe'],['Perfil principal','Main profile'],
      ['Sair','Sign out'],['MENU DIÁRIO','DAILY MENU'],['O que vamos assistir hoje?','What are we watching today?'],
      ['Continuar assistindo','Continue watching'],['Da sua Watchlist','From your Watchlist'],['Fora da lista','Outside your list'],
      ['Gerar novo menu','Generate new menu'],['MINHA BIBLIOTECA','MY LIBRARY'],['DESCOBRIR','DISCOVER'],
      ['IMPORTAR DADOS','IMPORT DATA'],['ESTATÍSTICAS','STATISTICS']
    ];
    for (const [from,to] of pairs) replaceExact(document, from, to);
  }

  function applyVersion() {
    document.querySelectorAll('.cloud-bar .small.muted').forEach(el => {
      if (el.textContent?.includes('CineTracker Oficial')) el.textContent = `CineTracker Oficial v${VERSION}`;
    });
  }

  function apply() {
    if (applying) return;
    applying = true;
    try {
      applyVersion();
      applyEnglish();
    } finally {
      applying = false;
    }
  }

  new MutationObserver(() => queueMicrotask(apply)).observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(async () => {
    try {
      if (typeof currentUser !== 'undefined' && currentUser && typeof loadCloudState === 'function') {
        await loadCloudState();
        if (typeof render === 'function') render();
      }
    } catch (err) {
      console.warn('CineTracker v0.2.2 bootstrap refresh:', err);
    }
    apply();
  }, 700);

  apply();
})();
