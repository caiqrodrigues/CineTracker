# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação, backup e notificações de lançamentos.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.3.1** | Produção / Supabase |
| Android | **0.0.46** | Build automatizado / Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Arquitetura

```text
CineTracker
├── apps/web                         aplicação Web e referência funcional
├── apps/android                     Android nativo (Java + WebView)
│   └── app/src/main/assets          runtime móvel versionado ctXX.js
├── supabase                         migrations e funções compartilhadas
├── docs/releases                    documentação de cada versão
├── scripts                          build e validações
├── CHANGELOG.md                     histórico consolidado
├── VERSIONS.md                      linha de versões por plataforma
├── PROJECT_STATE.md                 estado técnico atual
└── .github/workflows                CI/CD Web e Android
```

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e preferências pertencem à conta, não ao dispositivo.

## Principais recursos

- Supabase Auth e sessão persistente.
- Biblioteca e Watchlist por usuário.
- Histórico real de filmes e episódios.
- Progresso persistente por série, temporada e episódio.
- Marcação manual de episódios assistidos.
- Perfil com estatísticas e Tempo de Tela.
- Descobrir com TMDB, capas, nomes, elenco, filmografia e calendário.
- Assistir separado em Em dia, Acompanhando, Juntando poeira e Não iniciadas.
- Modos Carrossel, Grade e Lista no Android.
- Importação e exportação de dados.
- Notificações Android para lançamentos de filmes da Watchlist e novos episódios de séries acompanhadas.

## Android 0.0.46

A 0.0.46 adiciona uma política obrigatória de atualização por sobreposição e notificações nativas em segundo plano.

### Atualização sem desinstalar

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: sempre crescente.
- Chave de assinatura persistente e única no CI.
- Se a chave persistente estiver ausente, a build falha em vez de gerar outra chave e quebrar a atualização sobre o app existente.

### Notificações

- Permissão `POST_NOTIFICATIONS` no Android 13+.
- Canal `Lançamentos e episódios`.
- WorkManager verifica eventos em segundo plano a cada 1 hora.
- A sessão Supabase do WebView é sincronizada com a camada nativa.
- Notifica quando um filme da Watchlist/WatchLater estreia no dia atual.
- Notifica quando o próximo episódio de uma série `InProgress` é exibido no dia atual.
- Eventos são deduplicados para não repetir a mesma notificação.

Detalhes completos: `docs/releases/0.0.46.md`.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView, WorkManager e Gradle.  
**CI/CD:** GitHub Actions.

### RPCs relevantes

- `cinetracker_episode_state(tmdb_id)` — estado de episódios por usuário.
- `cinetracker_set_episode_watched(...)` — persiste marcação manual.
- `cinetracker_due_notifications()` — retorna lançamentos elegíveis para notificações do usuário autenticado.

## Build Android

O workflow `.github/workflows/build-android.yml`:

1. exige a chave de assinatura persistente já usada nas versões anteriores;
2. compila o código Android versionado no repositório;
3. gera o APK;
4. publica artifact e Release;
5. marca `Android Build` como `success` somente após a publicação.

## Regra de publicação

Uma versão nova não é considerada concluída somente com o APK. Cada versão deve atualizar também código-fonte, documentação, versionamento, Release do GitHub e status do workflow.

## Segurança

- Navegador e Android usam somente chave publicável do Supabase.
- Dados privados ficam protegidos por autenticação/RLS.
- RPCs usam `auth.uid()` para limitar dados ao próprio perfil.
- Decisões manuais do usuário não devem ser apagadas por novas importações.
