# CineTracker Web 1.0.90 / r299

## Escopo

Release exclusivamente Web para simplificar o registro presencial de eventos esportivos e transformar os contadores esportivos do Perfil em histórico navegável.

## Perfil / histórico esportivo

- `Eventos assistidos` passa a ser clicável dentro de `Esportes assistidos`.
- O clique abre uma lista com o histórico retornado por `cinetracker_sports_watch_history_v296`.
- `Jogos no Estádio` também passa a ser clicável.
- O histórico de estádio mostra somente registros com `attended_in_person = true`.
- A lista exibe evento, competição e data quando disponíveis, sem expor o nome do estádio.
- Os cartões recebem suporte a teclado (`Enter`/`Espaço`) e o modal fecha por botão, backdrop ou `Esc`.

## Marcação presencial

- O fluxo continua oferecendo duas escolhas: `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`.
- `Fui ao Estádio` salva imediatamente a presença, sem formulário intermediário.
- Novos registros enviam `p_stadium_name: null` para `cinetracker_sports_watch_set_v296`.
- O campo legado da r298 fica oculto no bundle r299 e não participa do fluxo ativo.
- Badges presenciais exibem apenas `🏟️ No Estádio`, sem nome/local.
- Dados históricos já existentes no banco não são apagados por esta release; apenas deixam de ser solicitados/exibidos pela interface r299.

## Preservações

- `Pra Você` 1+3+3 da r298 permanece intacto.
- As quatro abas de Esportes e demais regras herdadas permanecem intactas.
- Android permanece em `1.0.20 / versionCode 10062`.

## Validação

- Teste estático r299 garante ausência de entrada para nome do estádio no novo runtime.
- Regressão Chromium valida que `Eventos assistidos` e `Jogos no Estádio` ficam clicáveis, que a segunda lista filtra somente presença física e que nomes de estádio não aparecem.
- A mesma regressão valida o botão real `data-ct255-watch` e exige popover r299 sem qualquer `<input>`.
- O bundle oficial é `app-v299.js` / `app-v299.css`, revision `r299-official-1.0.90`.
