# Web 1.0.67 / r276

## Home / Histórico
- Remove o botão `Ver Histórico` / `Ocultar Histórico` introduzido na r275.
- O Histórico continua renderizado fisicamente antes de `Assistir a seguir`, sem colapso e sem toggle.
- Ao entrar na Home, a viewport é ancorada imediatamente em `Assistir a seguir`; ao rolar para cima, o Histórico aparece naturalmente.
- Repinturas posteriores preservam a posição visual do usuário em vez de forçar retorno ao Histórico.

## Séries / paridade dos cards
- `Continuar assistindo` e `Juntando poeira` compartilham o mesmo renderer do próximo episódio lançado não visto, incluindo temporada/episódio, título, nota, data, quantidade disponível e ação `✓` à direita.
- `Em dia` hidrata o último episódio assistido e passa a mostrar os mesmos metadados ricos de episódio; quando houver próximo episódio anunciado, mantém também a informação `Próximo: SXXEYY - Nome • data`.
- A reconciliação, deduplicação por TMDB efetivo, Lioness/Reacher e multiplicadores de Reassistir da r275 permanecem preservados.

## Validação
- Chromium: 420 px e 1200 px.
- Sem toggle de Histórico.
- Entrada ancorada em `Assistir a seguir` e scroll para cima revelando Histórico.
- Paridade de metadados em `Continuar assistindo`, `Juntando poeira` e `Em dia`.
- Bundle oficial 1.0.67 / r276 e Android 1.0.20 / 10062 preservado.
