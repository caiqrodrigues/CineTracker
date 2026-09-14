# Web 1.0.74 / r283

Data: 2026-09-14

## Ground truth

O vídeo posterior à r282 confirmou dois problemas na Home. Ao clicar em `↻ Reassistir`, a nova visualização era registrada, porém o handler genérico do card também abria a tela da série. `↶ Desfazer visto` tinha o mesmo risco estrutural. Além disso, séries com metadata fresco divergente do payload r6 — Lioness, Magnatas do Crime, Raw e SmackDown — podiam exibir apenas `1 episódio disponível` embora existissem vários episódios já lançados não vistos.

## Causa raiz

Os handlers de Reassistir/Desfazer estavam em `document` capture, no mesmo nível do handler genérico de `data-media` porém registrados depois dele; impedir propagação já era tarde para evitar a navegação. Na contagem, a r275 promovia corretamente uma série ao encontrar um episódio fresco, mas fazia `available_episodes = Math.max(1, valor_antigo)`, sem recomputar todos os lançamentos. O seletor genérico do primeiro não visto também voltava a varrer Raw/SmackDown desde a temporada 1.

## Correção

- Reassistir e Desfazer são interceptados em `window` capture e consomem o evento antes da navegação genérica.
- A disponibilidade fresca é `episódios lançados até last_episode_to_air - chaves canônicas assistidas`, ignorando temporada 0.
- A contagem é compartilhada pelos cards ativos e pelo Histórico.
- Raw/SmackDown preservam backlog não assistido na contagem, porém o próximo episódio é escolhido somente depois da maior temporada/episódio realmente assistida.
- Nenhum backlog antigo é marcado artificialmente como visto.
- A janela de reconciliação e a concorrência limitada já existentes são preservadas; não é criado `MutationObserver` nem polling permanente.

## Regressões obrigatórias

Chromium em 420 px e 1200 px deve provar simultaneamente: `↻` e `↶` executam sem navegação; Lioness calcula 2 disponíveis no fixture de T3E05 com E06/E07 lançados; Magnatas calcula 8 quando a T2 completa está liberada; Raw e SmackDown mantêm contagens superiores a mil e nunca escolhem S01 como próximo quando a fronteira assistida já está nas temporadas atuais; bundle exato inicializa sem erro; Android permanece 1.0.20/10062.
