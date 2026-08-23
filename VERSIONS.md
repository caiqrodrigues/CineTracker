# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.3.1** |
| Android | **0.0.48** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- Android mantém `applicationId` e chave de assinatura estáveis; toda nova APK deve ser instalável por cima da anterior.
- A partir da 0.0.48, o CI compara o certificado do APK novo com o APK publicado da 0.0.46 e recusa a publicação se houver divergência.

## Linha Web

- **0.1.x–0.3.1** — evolução da aplicação Web, autenticação, Supabase, importação, TMDB, biblioteca, histórico, perfil e estatísticas.

## Linha Android

- **0.0.1–0.0.43** — shell Android e ciclo iterativo de otimização móvel.
- **0.0.44** — tentativa de consolidação visual posteriormente identificada como insuficiente.
- **0.0.45** — Activity real versionada no repositório.
- **0.0.46** — notificações nativas e política inicial de atualização por sobreposição; notificações validadas em aparelho real.
- **0.0.47** — tentativa de runtime final, mas a instalação por sobreposição falhou no aparelho e a UI ainda mostrava versão/configurações antigas.
- **0.0.48** — reduz a carga Android para `ct41 + ct47 + ct48`, remove patches legados da inicialização, corrige versão duplicada em Configurações, força Perfil sem gráfico de horário, Descobrir em 3 colunas e preserva Assistir com Carrossel/Grade/Lista e série → temporada → episódio. CI valida assinatura e package id contra 0.0.46 antes da Release.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`.

- `docs/releases/0.0.44.md`
- `docs/releases/0.0.45.md`
- `docs/releases/0.0.46.md`
- `docs/releases/0.0.47.md`
- `docs/releases/0.0.48.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
