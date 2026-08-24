# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.5.0** |
| Android | **0.0.78** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- Toda nova versão Web e Android deve atualizar a versão exibida no rodapé de Configurações.

## Linha Web

- **0.1.x–0.4.8** — evolução da aplicação Web.
- **0.4.9** — pré-carregamento, paridade de Descobrir/Perfil e progresso global de séries.
- **0.5.0** — corrige navegação duplicada de Configurações, remove calendário de lançamentos da Home, estabiliza o render e mantém o padrão único `Temporada X • Episódio Y • vistos/total • Faltam N episódios` em séries, além de atualizar o rodapé da versão.

## Linha Android

- **0.0.1–0.0.71** — base e evolução funcional.
- **0.0.72–0.0.73** — versões descartadas e não usadas como base oficial.
- **0.0.74–0.0.76** — correções de estabilidade e pré-carregamento.
- **0.0.77** — pré-carregamento de dados/imagens e padrão global de progresso de séries.
- **0.0.78** — elimina looping de Home/Assistir e repetição das linhas de episódios/notas, mantém apenas uma linha padronizada de progresso e atualiza o rodapé das Configurações.

## Documentação por release

Release Android atual: `docs/releases/0.0.78.md`.
