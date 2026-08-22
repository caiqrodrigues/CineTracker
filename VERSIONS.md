# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.3.1** |
| Android | **0.0.44** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Windows inicia sua linha de versão quando a implementação começar.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.

## Linha Web

- **0.1.x** — protótipos funcionais, refinamento visual, TMDB, capas, atores, streaming e recomendações.
- **0.2.0** — autenticação e persistência Supabase, importação JSON/ZIP e arquitetura de sincronização.
- **0.2.1–0.2.9** — identidade visual, configurações, calendário, detalhes de mídia, elenco, filmografia e capas TMDB.
- **0.3.0** — Home/Biblioteca/Histórico em cards com dados persistentes.
- **0.3.1** — Perfil completo com estatísticas, favoritos, histórico e calendário de acompanhamento.

## Linha Android

- **0.0.1–0.0.7** — shell Android, sincronização Web/Supabase, calendário, detalhes, perfil e histórico.
- **0.0.8–0.0.43** — ciclo iterativo de otimização móvel, navegação, Home, Assistir, Perfil, Configurações, resolução de nomes/capas e Tempo de Tela.
- **0.0.44** — consolidação da experiência Assistir: Carrossel padrão, Grade/Lista, ordenação Em dia → Acompanhando → Juntando poeira → Não iniciadas; detalhes de série/temporada/episódio; marcação persistente de episódios; Descobrir com três cards por linha; gráfico diário único em dark mode.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`. A versão 0.0.44 está documentada em `docs/releases/0.0.44.md`.

O histórico detalhado permanece em `CHANGELOG.md` e no histórico de commits/releases do GitHub.
