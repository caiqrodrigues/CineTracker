# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versão oficial

**CineTracker 1.0.0** é a primeira release oficial estável do projeto.

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.0** | `r204-official-1.0.0`, base funcional r203 | oficial |
| Android | **1.0.0** | `versionCode 10042`, base funcional 0.99.7.71 / r243 | oficial |
| Backend | produção compartilhada | Supabase | oficial |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## O que a 1.0.0 consolida

- Home de séries e filmes com progresso, Assistir a seguir, estados de biblioteca e interação otimista;
- Descobrir/Pra Você com indicação diária, itens da Watchlist e títulos 100% novos;
- exclusões pessoais para evitar recomendar itens vistos, em andamento ou já presentes na Watchlist;
- filtros e modos de visualização do Descobrir;
- Top 10 e streamings com rolagem horizontal nativa no Android;
- botão `Trocar` independente para Filme/Série/Anime na Watchlist e em 100% novos;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, elenco e pessoas;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Baseline Android 1.0.0

A 1.0.0 **não reescreve o comportamento da 0.99.7.71**. Ela promove exatamente a cadeia validada no aparelho pelo usuário:

- Watchlist `Trocar` usa o mesmo `wmPool/wsPool/waPool` selecionado pelo renderer ativo `ct186`;
- `r237` continua como autoridade única de `pointerup/click` do Trocar;
- `100% novos` permanece no comportamento já funcional;
- Top 10/streamings preserva scroll horizontal nativo, sem `touchmove` manual;
- a mudança da 1.0.0 é de identidade, documentação, pipeline e apresentação do número da versão.

## Baseline Web 1.0.0

A Web 1.0.0 preserva integralmente a r203 e cria a identidade `r204-official-1.0.0`. O rodapé visível, `window.__ctWebBuild`, snapshot de backup, `release.json`, package e assets passam a declarar **1.0.0**.

## Arquitetura

- `apps/web` — Web/PWA e build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/release-v1.yml` — pipeline oficial 1.0.0;
- `docs/releases/1.0.0.md` — contrato da release;
- `docs/validation/1.0.0.md` — evidências de validação.

## Regra de validação

Build, CI, deploy, APK, assinatura e smoke em aparelho são evidências separadas. Teste real no aparelho/navegador prevalece sobre asserts de CI quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md`, `docs/SECURITY.md`, `docs/releases/1.0.0.md` e `docs/validation/1.0.0.md`.
