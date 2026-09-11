# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.43** | `r252-official-1.0.43` | recuperação da source UI aprovada + correções lógicas isoladas |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r252 |
| Backend | produção compartilhada | Supabase | produção; inclui persistência `shown_recommendations` com RLS |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.43 / r252

A r252 corrige a regressão visual da r251 sem redesenhar novamente a aplicação. O build volta a usar a **source UI** comprovada da r248 como autoridade estrutural e aplica somente correções de regra e de carregamento. As camadas r249/r250/r251 não são importadas na cadeia final da r252.

- **Home:** preserva a estrutura anterior e o Histórico escondido de filmes/séries. Série nunca iniciada permanece em `Não iniciada`; série iniciada sem episódio assistido há **30 dias** vai para `Juntando Poeira`; episódio recente liberado e não visto tem prioridade e coloca a série em `Continue assistindo`; quando não existe lançamento atual pendente, a série fica `Em dia`.
- **Séries longas:** WWE Raw, WWE SmackDown, Fórmula 1 e Super Bowl ignoram backlog legado para classificação atual. Episódios antigos continuam não vistos no banco; não existe marcação retroativa artificial. Só um lançamento atual/recentemente liberado e não visto tira o item de `Em dia`.
- **Descobrir:** volta a usar os cards e proporções nativos da interface anterior. Mantém nove sub-abas (`Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados`, `Calendário`) e os três blocos de `Pra você`: `Indicação do Dia`, `Da sua Watchlist` e `100% Novos`.
- **Regras de recomendação:** TMDB >= 7,5, ano > 1990, exclusão de Drama/Documentário puro, vistos, em andamento, `NotInterested`, WWE e Watchlist fora do bloco próprio. `shown_recommendations` impede repetição por 7 dias; `Trocar` funciona sem reload global. `100% Novos` usa lançamentos dos últimos 30 dias também para Anime.
- **Esportes:** preserva exatamente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, usando `cinetracker_sports_payload_v1`; o bundle não chama `cinetracker_sports_events_v0997`.
- **F1 Hub:** volta ao padrão escuro da r248 com seis áreas e minimizar/expandir persistido pelo usuário, sem autoexpansão.
- **Perfil:** volta à composição e ordem estabelecidas anteriormente, sem a reorganização visual da r251.
- **Configurações:** a tela estável é montada imediatamente; a leitura opcional do nome de perfil ocorre em segundo plano, eliminando o loading bloqueante.
- **Navegação:** os dois `MutationObserver` permanentes herdados da r248 são desativados no bundle final para evitar reconstruções concorrentes e custo repetido entre abas.
- **Rolagem:** overflow horizontal global continua bloqueado; trilhos, temporadas, gráficos e demais áreas largas mantêm rolagem horizontal somente no próprio componente.
- **Validação:** o CI exige que a r252 preserve marcadores/estrutura r248, não carregue a autoridade visual r251, passe regressões de Home/Descobrir/Configurações em lógica + Chromium e gere assets `app-v252` com identidade 1.0.43.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
