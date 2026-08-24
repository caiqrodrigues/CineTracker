# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.72** |
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
- **0.0.69** — notificações e carregamento resiliente de temporadas com nota por episódio.
- **0.0.70** — carregamento de Continuar assistindo/Assistir, próximo episódio e botão Assistido centralizado.
- **0.0.71** — base oficial estável: reduz tremor, atualiza Home/Assistir por navegação, restaura gráfico do Perfil e recolhe Carrossel/Grade/Lista.
- **0.0.72** — nova linha oficial criada diretamente da 0.0.71: gráfico único acima de Histórico, Descobrir 100% novidade, Home/Assistir estabilizados e remoção do conflito de `ct52`.

## Documentação por release

Release Android atual: `docs/releases/0.0.72.md`.