# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.5.2** |
| Android | **0.0.81** |
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
- **0.5.0** — navegação e versão.
- **0.5.1** — coordenador estável de lifecycle.
- **0.5.2** — remove patches conflitantes de progresso, corrige navegação/Configurações duplicada, adiciona nota e detalhe de episódios e reinicia a resolução global de capas.

## Linha Android

- **0.0.1–0.0.71** — base e evolução funcional.
- **0.0.72–0.0.73** — versões descartadas e não usadas como base oficial.
- **0.0.74–0.0.79** — ciclo de estabilização e consolidação progressiva.
- **0.0.80** — runtime reduzido aos módulos ativos e lifecycle consolidado.
- **0.0.81** — corrige duplicação/loop de progresso, episódios com nota + Assistido + detalhe e reboot global de capas com fallback TMDB.

## Documentação por release

Release Android atual: `docs/releases/0.0.81.md`.
