# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9** |
| Android | **0.0.77** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.

## Linha Web

- **0.1.x–0.4.8** — evolução da aplicação Web.
- **0.4.9** — pré-carregamento de dados/imagens, padrão global de progresso de séries, Home com trio da Watchlist, correção de imagens da Biblioteca, Descobrir alinhado ao filtro Android, Perfil com gráfico acima do histórico e remoção de Horário de pico, Importar removido da navegação principal.

## Linha Android

- **0.0.1–0.0.71** — base e evolução funcional.
- **0.0.72–0.0.73** — versões descartadas e não usadas como base oficial.
- **0.0.74–0.0.76** — correções de estabilidade e pré-carregamento.
- **0.0.77** — pré-carregamento de dados/imagens e padrão global `Temporada X • Episódio Y • vistos/total • Faltam N episódios` para séries.

## Documentação por release

Release Android atual: `docs/releases/0.0.77.md`.
