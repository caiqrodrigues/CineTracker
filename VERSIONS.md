# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.59** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- A `0.0.48` é a migração única para a assinatura permanente comprovada pelo CI.
- A partir da `0.0.48`, toda versão futura deve manter o certificado permanente definido pelo pipeline; o CI deve falhar se a assinatura mudar.

## Linha Web

- **0.1.x–0.4.7** — evolução da aplicação Web: autenticação, Supabase, importação, TMDB, biblioteca, histórico, perfil, estatísticas, configurações e resolvedor global de nomes/capas.
- **0.4.8** — paridade funcional com o baseline Android, exceto notificações nativas: Tempo de Tela diário interativo, Assistir com seções Em dia/Acompanhando/Juntando poeira/Não iniciadas, Carrossel padrão com Grade/Lista, série → temporada → episódio com marcação persistente, Descobrir compacto em três colunas e Configurações com conta, segurança e backup.

## Linha Android

- **0.0.1–0.0.43** — shell Android e ciclo iterativo de otimização móvel.
- **0.0.44–0.0.48** — consolidação da Activity, notificações, migração única de assinatura e baseline permanente.
- **0.0.49–0.0.58** — evolução incremental sobre o baseline, incluindo navegação, feedback de ações e progresso absoluto/próximo episódio.
- **0.0.59** — corrige consistência de séries e Perfil: botão de avanço passa a exibir `Assistido`, progresso de séries mostra `Faltam X episódios`, Descobrir oculta vistos/concluídos/em progresso/acompanhados/Watchlist e o gráfico do Perfil volta a permanecer visível. Configurações passa a exibir build `0.0.59`.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`.

- `docs/releases/web-0.4.8.md`
- `docs/releases/0.0.44.md` … `docs/releases/0.0.48.md`
- `docs/releases/0.0.56.md`
- `docs/releases/0.0.57.md`
- `docs/releases/0.0.58.md`
- `docs/releases/0.0.59.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
