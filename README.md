# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.3.1** | Produção / Supabase |
| Android | **0.0.44** | Build automatizado / Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Arquitetura

```text
CineTracker
├── apps/web                         aplicação Web e referência funcional
├── apps/android                     shell Android nativo (Java + WebView)
│   └── app/src/main/assets          módulos Android versionados ctXX.js
├── supabase                         migrations e funções compartilhadas
├── docs
│   └── releases                     documentação de cada versão Android
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
- Marcação manual de episódios assistidos com prioridade sobre inferências automáticas.
- Perfil com estatísticas e Tempo de Tela.
- Descobrir com TMDB, capas, nomes, elenco, filmografia e calendário.
- Assistir separado em Em dia, Acompanhando, Juntando poeira e Não iniciadas.
- Modos Carrossel, Grade e Lista no Android.
- Importação e exportação de dados.

## Android 0.0.44

A 0.0.44 consolida a experiência móvel de Assistir e Perfil:

- Tempo de Tela usa apenas o gráfico diário interativo em dark mode.
- Descobrir usa grade compacta com três cards por linha.
- Assistir abre posicionado em Acompanhando; Em dia fica acima, Juntando poeira e Não iniciadas abaixo.
- Carrossel é o modo inicial; Grade e Lista são alternativos persistentes.
- Cards de séries abrem detalhes, temporadas e episódios.
- Episódios possuem tela própria e podem ser marcados/desmarcados como assistidos.
- Progresso manual é persistido no Supabase e refletido no histórico.

Detalhes completos: `docs/releases/0.0.44.md`.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView e Gradle.  
**CI/CD:** GitHub Actions.

### RPCs relevantes para episódios

- `cinetracker_episode_state(tmdb_id)` — lê o estado de episódios da série para o usuário autenticado.
- `cinetracker_set_episode_watched(tmdb_id, season, episode, watched, title)` — persiste marcação manual e sincroniza `episode_progress`/`watch_history`.

## Build Android

A versão Android mantém o mesmo `applicationId` (`com.cinetracker.app`) e chave de assinatura persistente no GitHub Actions, permitindo instalar novas versões como atualização do app existente.

O workflow `.github/workflows/build-android.yml`:

1. injeta os módulos Android versionados;
2. compila com Gradle;
3. gera o APK;
4. publica o artifact;
5. cria/atualiza a Release correspondente;
6. marca `Android Build` como `success` somente após a publicação.

## Regra de publicação

Uma versão nova não é considerada concluída somente com o APK. Cada versão deve atualizar também:

- código-fonte;
- `README.md` quando arquitetura/recursos mudarem;
- `VERSIONS.md`;
- documentação em `docs/releases/<versão>.md`;
- `CHANGELOG.md` quando aplicável;
- Release do GitHub e APK;
- status do workflow de build.

## Segurança

- Navegador e Android usam somente chave publicável do Supabase.
- Dados privados ficam protegidos por autenticação/RLS.
- RPCs de progresso usam `auth.uid()` para limitar alterações ao próprio perfil.
- Decisões manuais do usuário não devem ser apagadas por novas importações.
