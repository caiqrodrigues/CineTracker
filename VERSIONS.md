# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.70** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- A partir da `0.0.48`, toda versão futura deve preservar a assinatura baseline do app.

## Linha Web

- **0.1.x–0.4.7** — evolução da aplicação Web.
- **0.4.8** — paridade funcional com Android 0.0.48, exceto notificações nativas.

## Linha Android

- **0.0.1–0.0.58** — base Android e evolução inicial.
- **0.0.59–0.0.68** — progresso, Descobrir, detalhes, streaming, Perfil, loaders, botões e notificações.
- **0.0.69** — elimina repetição do backlog de notificações, remove disparo de worker em cada sessão e torna o carregamento de temporadas resiliente, com nota TMDB por episódio.
- **0.0.70** — estabiliza o carregamento de `Continuar assistindo`/Assistir, mostra o nome do próximo episódio em ambas as áreas e centraliza o botão `Assistido` abaixo dele.

## Documentação por release

Release Android atual: `docs/releases/0.0.70.md`.
