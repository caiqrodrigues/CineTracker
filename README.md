# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com identidade Dark/Gold, conta única, biblioteca sincronizada, Watchlist, histórico de vistos, progresso, recomendações sem repetição, descoberta por ator e importação de dados.

## Versões oficiais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.2.0** | 🟡 Base oficial / Supabase conectado |
| Android | **0.0.1** | 🟡 Estrutura inicial |
| Windows | **—** | ⏳ Planejado após Web + Android |

> As versões são independentes por plataforma. Alterações em uma plataforma não obrigam incremento nas demais.

## O que o projeto entrega

- Login e criação de conta via Supabase Auth.
- Dados persistentes por usuário com Row Level Security.
- Watchlist real e histórico de títulos vistos.
- Estados: visto, concluído, em andamento, sem interesse, gostei, não gostei, ver depois e Watchlist.
- Progresso por temporada e episódio.
- Recomendações separadas por tipo: filme → filme, série → série e anime → anime.
- Regra anti-repetição para impedir recomendações já vistas, rejeitadas, adicionadas ou recentemente exibidas.
- Capas oficiais, ano, gêneros, principais atores e disponibilidade em streaming no Brasil via TMDB.
- Atores clicáveis, perfil e filmografia.
- Busca por filmes, séries, animes e pessoas.
- Importação de `.json` e `.zip` com prévia, conciliação e histórico da importação.
- Interface responsiva Dark/Gold para desktop e mobile.
- Base Android preparada para usar a mesma conta e os mesmos dados do Web.

## Arquitetura

```text
CineTracker
├── apps/web                 Web 0.2.0 / referência funcional
├── apps/android             Android 0.0.1 / wrapper nativo inicial
├── supabase/functions       Funções Edge compartilhadas
├── docs                     Arquitetura, segurança e produto
├── scripts                  Build e validações
└── .github/workflows        CI e build Android
```

O **Web é a implementação funcional de referência**. O Android utiliza uma camada nativa ao redor do Web responsivo e acessa o mesmo backend Supabase, mantendo a mesma identidade de usuário e os mesmos dados sincronizados.

## Tecnologias

**Frontend Web:** HTML5, CSS3 e JavaScript.  
**Backend:** Supabase Auth, PostgreSQL, RLS e Edge Functions.  
**Metadados de mídia:** TMDB.  
**Deploy Web:** Vercel conectado ao GitHub.  
**Android:** Java, Android WebView e Gradle.  
**CI/CD:** GitHub Actions.

## Segurança

- O token de leitura da TMDB fica no backend/Edge Function, nunca exposto como segredo no navegador.
- O navegador usa apenas a chave publicável do Supabase.
- As tabelas de usuário usam RLS e escopo por `auth.uid()`.
- Importações não devem sobrescrever silenciosamente decisões manuais do usuário.

Mais detalhes em `docs/SECURITY.md` e `docs/ARCHITECTURE.md`.

## Desenvolvimento Web

```bash
npm run verify
npm run build
```

A saída Web fica em `dist/`.

## Deploy

A produção Web deve ser publicada pelo Vercel a partir do GitHub. O diretório de referência é `apps/web` ou a saída `dist`, de acordo com a configuração do projeto Vercel.

## Regra de validação

Uma funcionalidade só é marcada como validada quando o fluxo real correspondente foi testado. Deploy criado não é tratado como deploy funcional sem verificação da URL publicada.
