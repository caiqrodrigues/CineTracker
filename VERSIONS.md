# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.61** |
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
- **0.0.61** — filtro de Descobrir reforçado por ID e título em todos os filtros/rerenders; `Onde assistir` consolida variantes do mesmo serviço em um único provedor.

## Documentação por release

Release Android atual: `docs/releases/0.0.61.md`.

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
