# Web 1.0.68 / r277

## Correções

- Restaura a visibilidade real do controle `✓` de **Marcar como assistido** nos cards elegíveis da Home. A r276 já emitia o controle no DOM, mas os cards produzidos pelo renderer rico não recebiam a classe de host posicionada usada pelo CSS da r266; por isso o elemento absoluto podia ficar fora do card. A r277 garante o host em todos os controles existentes e injeta o `✓` quando faltar em `Continuar assistindo` ou `Juntando poeira`.
- Filmes em `Assistir a seguir / Watchlist` também recebem a correção de host quando o controle já existe.
- A barra lateral desktop passa a ser `position: fixed`, presa em `top: 0`, `bottom: 0`, largura de 136 px e altura de 100 vh. O conteúdo permanece explicitamente na segunda coluna, portanto a navegação, conta e botão `Sair` ficam imóveis enquanto somente o conteúdo principal rola verticalmente.
- Em telas móveis de até 700 px, o comportamento aprovado continua usando a navegação móvel; a barra lateral desktop permanece oculta.

## Preservado

- Histórico sem botão, renderizado acima do ponto inicial da Home e acessível ao rolar para cima.
- Metadados ricos de episódios em `Continuar assistindo`, `Juntando poeira` e `Em dia`.
- Deduplicação por TMDB, reconciliação fresca, reassistir, Descobrir, detalhes, Sports/F1.
- Android 1.0.20 / versionCode 10062 sem alterações.

## Validação

- Sintaxe e build oficial da 1.0.68 / r277.
- Regressões estáticas.
- Chromium em 420 px e 1200 px verificando `✓` dentro do card com host relativo, posição absoluta à direita e sidebar fixa durante scroll em desktop.
- Boot do bundle final exato.
- Identidade do release e Android preservado.
