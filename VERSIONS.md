# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.3.1** |
| Android | **0.0.46** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Windows inicia sua linha de versão quando a implementação começar.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- Android mantém `applicationId` e chave de assinatura estáveis; toda nova APK deve ser instalável por cima da anterior. Se a chave persistente não estiver disponível, a build deve falhar em vez de gerar uma nova.

## Linha Web

- **0.1.x** — protótipos funcionais, refinamento visual, TMDB, capas, atores, streaming e recomendações.
- **0.2.0** — autenticação e persistência Supabase, importação JSON/ZIP e arquitetura de sincronização.
- **0.2.1–0.2.9** — identidade visual, configurações, calendário, detalhes de mídia, elenco, filmografia e capas TMDB.
- **0.3.0** — Home/Biblioteca/Histórico em cards com dados persistentes.
- **0.3.1** — Perfil completo com estatísticas, favoritos, histórico e calendário de acompanhamento.

## Linha Android

- **0.0.1–0.0.7** — shell Android, sincronização Web/Supabase, calendário, detalhes, perfil e histórico.
- **0.0.8–0.0.43** — ciclo iterativo de otimização móvel, navegação, Home, Assistir, Perfil, Configurações, resolução de nomes/capas e Tempo de Tela.
- **0.0.44** — tentativa de consolidação visual de Assistir/Descobrir/Tempo de Tela; posteriormente identificada como insuficiente porque o workflow ainda reescrevia uma Activity antiga e empilhava patches.
- **0.0.45** — Activity real versionada no repositório; remoção da reescrita de Java durante a build.
- **0.0.46** — atualização por sobreposição passa a ser requisito técnico do CI; notificações nativas para filme da Watchlist lançado e novo episódio de série acompanhada; WorkManager em segundo plano e sessão Supabase sincronizada com a camada nativa; runtime `ct46.js` carregado por último.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`.

- `docs/releases/0.0.44.md`
- `docs/releases/0.0.45.md`
- `docs/releases/0.0.46.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
