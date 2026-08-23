# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação, backup e notificações de lançamentos.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.3.1** | Produção / Supabase |
| Android | **0.0.48** | Build automatizado / Release GitHub |
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
- Perfil com estatísticas e Tempo de Tela diário.
- Descobrir com TMDB, capas, nomes, elenco, filmografia e calendário.
- Assistir separado em Em dia, Acompanhando, Juntando poeira e Não iniciadas.
- Modos Carrossel, Grade e Lista no Android.
- Importação e exportação de dados.
- Notificações Android para lançamentos de filmes da Watchlist e novos episódios de séries acompanhadas.

## Android 0.0.48

A 0.0.48 consolida a camada Android e remove da inicialização a cadeia de patches antigos que continuava reintroduzindo telas desatualizadas.

### Runtime

A Activity passa a carregar somente `ct41.js`, `ct47.js` e `ct48.js`.

- `ct41.js`: gráfico diário interativo.
- `ct47.js`: Assistir, temporadas e episódios.
- `ct48.js`: correções finais de Perfil, Descobrir, Configurações e navegação.

### Interface

- Perfil: remove gráfico antigo por horário e card Horário de pico; mantém gráfico diário em dark mode.
- Descobrir: três cards por linha em todas as categorias e filtros.
- Assistir: Carrossel como padrão, com Grade e Lista.
- Assistir abre em Acompanhando; Em dia fica acima; Juntando poeira e Não iniciadas ficam abaixo.
- Séries abrem temporadas e episódios; episódios têm tela própria e marcação de assistido.
- Configurações exibe uma única versão de build: 0.0.48.

### Atualização sem desinstalar

- `applicationId`: `com.cinetracker.app`.
- `versionCode`: sempre crescente.
- Chave de assinatura persistente no CI.
- O workflow baixa o APK publicado da 0.0.46 e compara o certificado SHA-256 e o package id com o APK novo antes de publicar. Se houver divergência, a Release falha.

### Notificações

A infraestrutura nativa validada na 0.0.46 é preservada: WorkManager, canal `Lançamentos e episódios`, sessão Supabase nativa e deduplicação de eventos.

Detalhes completos: `docs/releases/0.0.48.md`.

## Backend

**Supabase:** Auth, PostgreSQL, RLS e RPCs autenticadas.  
**Metadados:** TMDB via funções/proxy de backend.  
**Deploy Web:** Vercel.  
**Android:** Java, Android WebView, WorkManager e Gradle.  
**CI/CD:** GitHub Actions.

### RPCs relevantes

- `cinetracker_episode_state(tmdb_id)` — estado de episódios por usuário.
- `cinetracker_set_episode_watched(...)` — persiste marcação manual.
- `cinetracker_due_notifications()` — retorna lançamentos elegíveis para notificações.

## Regra de publicação

Uma versão nova não é considerada concluída somente com o APK. Cada versão deve atualizar código-fonte, documentação, versionamento, Release do GitHub e status do workflow.

## Segurança

- Navegador e Android usam somente chave publicável do Supabase.
- Dados privados ficam protegidos por autenticação/RLS.
- RPCs usam `auth.uid()` para limitar dados ao próprio perfil.
- Decisões manuais do usuário não devem ser apagadas por novas importações.
