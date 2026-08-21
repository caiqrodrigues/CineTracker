# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com identidade Black/Blue, conta única, biblioteca sincronizada, Watchlist, histórico de vistos, progresso, recomendações sem repetição, descoberta por ator, importação e backup.

## Versões oficiais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.2.5** | 🟢 Produção / Supabase conectado |
| Android | **0.0.1** | 🟢 Shell funcional / build automatizado |
| Windows | **—** | ⏳ Planejado após Web + Android |

## Produção

**Web oficial:** https://mycinetracker.vercel.app

## O que o projeto entrega

- Login e criação de conta via Supabase Auth.
- Entrada imediata após autenticação bem-sucedida; TMDB e consultas opcionais carregam em segundo plano.
- Dados persistentes por usuário com Row Level Security.
- Watchlist real, histórico e progresso por temporada/episódio.
- Recomendações por tipo com regra anti-repetição.
- TMDB para capas, ano, gêneros, elenco, filmografia e disponibilidade em streaming no Brasil.
- Busca por filmes, séries, animes e pessoas.
- Configurações de conta com nome, e-mail, telefone, senha, idioma e preferência de notificações.
- Importação JSON/ZIP dentro de Configurações.
- Exportação/backup em JSON ou ZIP.
- Interface responsiva Black/Blue para desktop e mobile.
- Android 0.0.1 leve, baseado em Activity + WebView nativos, usando a mesma aplicação Web e os mesmos dados Supabase.

## Notificações e calendário de lançamentos

A preferência para ativar/desativar notificações já é persistida no perfil e sincronizada entre Web e Android.

O serviço automático que consulta datas de episódios/estreias na TMDB e envia push notifications **ainda não está implementado**. Essa é uma camada posterior: consultar agenda TMDB, cruzar com Watchlist/séries em andamento e disparar notificações de novo episódio, retorno de temporada ou estreia de filme.

## Arquitetura

```text
CineTracker
├── apps/web                 Web 0.2.5 / referência funcional
├── apps/android             Android 0.0.1 / shell nativo leve
├── supabase/functions       Funções Edge compartilhadas
├── docs                     Arquitetura, segurança e produto
├── scripts                  Build e validações
└── .github/workflows        CI Web e build Android
```

Web e Android usam a mesma conta e o mesmo backend Supabase, portanto Watchlist, histórico, progresso e preferências pertencem ao usuário e não ao dispositivo.

## Tecnologias

**Frontend Web:** HTML5, CSS3 e JavaScript.  
**Backend:** Supabase Auth, PostgreSQL, RLS e Edge Functions.  
**Metadados de mídia:** TMDB.  
**Deploy Web:** Vercel conectado ao GitHub.  
**Android:** Java, Android WebView e Gradle.  
**CI/CD:** GitHub Actions.

## Segurança

- Token de leitura TMDB fica no backend/Edge Function.
- Navegador usa somente a chave publicável do Supabase.
- Tabelas de usuário usam RLS e escopo por `auth.uid()`.
- Importações não devem sobrescrever silenciosamente decisões manuais.

## Desenvolvimento Web

```bash
npm run verify
npm run build
```

A saída Web fica em `dist/` e `apps/web/dist/` para a configuração atual do Vercel.

## Deploy

A produção Web é publicada automaticamente pelo Vercel a partir da branch `main`. O Android é compilado pelo workflow `.github/workflows/build-android.yml` e gera um APK debug como artifact do GitHub Actions.
