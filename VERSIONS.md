# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9** |
| Android | **0.0.49** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- A `0.0.48` foi a migração única para a assinatura permanente comprovada pelo CI.
- A partir da `0.0.48`, toda versão futura deve ser assinada pelo certificado SHA-256 `fe69519cd5669429446e4701cd5d0ad78c5a936b3130f27e478a05c0591353d3`; o CI falha se o certificado mudar.

## Linha Web

- **0.1.x–0.4.7** — evolução da aplicação Web: autenticação, Supabase, importação, TMDB, biblioteca, histórico, perfil, estatísticas, configurações e resolvedor global de nomes/capas.
- **0.4.8** — paridade funcional com Android 0.0.48, exceto notificações nativas.
- **0.4.9** — sincroniza Home/Continuar assistindo com Assistir/Acompanhando, adiciona check do próximo episódio nas duas áreas e reforça Descobrir em três colunas.

## Linha Android

- **0.0.1–0.0.43** — shell Android e ciclo iterativo de otimização móvel.
- **0.0.44** — tentativa de consolidação visual posteriormente identificada como insuficiente.
- **0.0.45** — Activity real versionada no repositório.
- **0.0.46** — notificações nativas validadas em aparelho real.
- **0.0.47** — instalação por sobreposição falhou por incompatibilidade de assinatura e a UI ainda apresentava componentes antigos.
- **0.0.48** — migração única de assinatura e baseline permanente, runtime consolidado e paridade principal de Perfil/Descobrir/Assistir.
- **0.0.49** — Home/Continuar assistindo usa exatamente a seção Acompanhando; check do próximo episódio em Home e Assistir; Descobrir reforçado em três cards por linha; mantém a assinatura da 0.0.48.

## Documentação por release

- `docs/releases/web-0.4.8.md`
- `docs/releases/web-0.4.9.md`
- `docs/releases/0.0.44.md`
- `docs/releases/0.0.45.md`
- `docs/releases/0.0.46.md`
- `docs/releases/0.0.47.md`
- `docs/releases/0.0.48.md`
- `docs/releases/0.0.49.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
