# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.68** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- A `0.0.48` é a migração única para a assinatura permanente comprovada pelo CI.
- A partir da `0.0.48`, toda versão futura deve preservar a assinatura baseline do app.

## Linha Web

- **0.1.x–0.4.7** — evolução da aplicação Web.
- **0.4.8** — paridade funcional com Android 0.0.48, exceto notificações nativas.

## Linha Android

- **0.0.1–0.0.48** — shell Android, consolidação móvel e baseline permanente de assinatura.
- **0.0.49–0.0.58** — evolução de navegação, perfil, ações e progresso absoluto de séries.
- **0.0.59** — botão `Assistido`, episódios restantes, filtro inicial de Descobrir, Perfil e build.
- **0.0.60** — padrão visual de detalhes, notas e disponibilidade.
- **0.0.61** — Descobrir reforçado por ID+título; provedores deduplicados por família.
- **0.0.62** — gráfico do Perfil auto-recuperável, botão `Assistido` apagado por padrão e verde somente quando visto, correção de metadados e limpeza de carregamentos residuais.
- **0.0.63** — build de publicação das correções da 0.0.62.
- **0.0.64** — remove repetição de notas, compacta cards, corrige estados de `Assistido`/`Acompanhando`, elimina `Carregando perfil...` residual e unifica notas no detalhe.
- **0.0.65** — remove duplicação acidental entre `ct53`/`ct54`, corrige metadados da Watchlist, cálculo de episódios restantes, notas duplicadas e carregamento residual do Perfil.
- **0.0.66** — tentativa de estabilização dos loaders; ficou com desalinhamento entre Gradle e Activity e não é considerada release final.
- **0.0.67** — consolida o runtime, alinha todas as referências de versão e carrega `ct56.js` com recuperação controlada das telas.
- **0.0.68** — deduplica notificações por conteúdo, evita workers imediatos concorrentes, torna a marcação do próximo episódio otimista/imediata e reforça limpeza de notas/loaders residuais.

## Documentação por release

Release Android atual: `docs/releases/0.0.68.md`.
