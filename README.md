# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, pensado para substituir o acompanhamento central de serviços como Trakt, Showly, TV Time e Bingers, sem foco em rede social. A conta é única entre plataformas e concentra biblioteca, Watchlist, histórico, progresso de episódios, descoberta, recomendações, perfil, estatísticas, importação e backup.

## Versões atuais

| Plataforma | Versão | Estado |
|---|---:|---|
| Web | **0.5.7** | Código final no GitHub; deploy de produção depende da Vercel |
| Android | **0.0.83** (`versionCode 83`) | Código final + pipeline GitHub Actions; APK depende do build/release |

## Produção

Web: `https://mycinetracker.vercel.app`

Android: APK distribuído pelas Releases do GitHub após validação do workflow.

## Objetivo de estabilidade

O ciclo principal do CineTracker deve ser:

`abre → dados aparecem → navega instantaneamente → marca episódio → tudo atualiza → fecha → abre → continua exatamente correto`

As versões Web 0.5.7 e Android 0.0.83 são uma etapa exclusivamente de arquitetura e performance. **Não alteram o layout nem as funcionalidades aprovadas nas versões anteriores.**

## Web 0.5.7

- preserva integralmente layout e comportamento da Web 0.5.6;
- adiciona IndexedDB para snapshots locais de dados essenciais;
- mantém em cache continuar assistindo, histórico, overrides e perfil;
- adiciona Service Worker para cache persistente;
- imagens TMDB usam estratégia cache-first;
- metadados TMDB usam stale-while-revalidate;
- capas conhecidas são pré-aquecidas silenciosamente;
- Supabase continua sendo a fonte consolidada do estado do usuário;
- sincronização ocorre em segundo plano sem bloquear a interface;
- dados e imagens já conhecidos são reutilizados em vez de baixados novamente;
- troca de abas deve reutilizar estado/cache já disponível.

## Android 0.0.83

- preserva integralmente layout e comportamento do Android 0.0.82;
- `versionName 0.0.83` e `versionCode 83`;
- mantém WebView nativa apontando para a experiência oficial;
- adiciona `ct69-cache.js` como camada exclusiva de performance;
- usa cache persistente via IndexedDB dentro do WebView;
- mantém snapshots de continuar assistindo, histórico, overrides e perfil;
- pré-carrega silenciosamente capas conhecidas;
- reaproveita cache do WebView e metadados já resolvidos;
- atualiza dados em segundo plano;
- mantém Supabase como fonte consolidada do estado do usuário;
- TMDB permanece como fonte externa de metadados, fora do caminho crítico sempre que houver informação válida em cache;
- GitHub Actions valida módulos, pacote, assinatura e versão antes de publicar o APK.

## Arquitetura de dados e cache

A regra desta geração é **local/cache primeiro, sincronização depois**.

```text
                         TMDB
                          │
                  metadados / imagens
                          │
                     Supabase
                 estado consolidado
                    /           \
                   /             \
        Web 0.5.7                  Android 0.0.83
        IndexedDB                  IndexedDB/WebView
        Service Worker             cache WebView
             │                           │
             └────── UI imediata ────────┘
```

### Níveis de responsabilidade

1. **Interface:** deve renderizar usando o estado já disponível e não esperar uma nova chamada TMDB para desenhar um card conhecido.
2. **Cache local:** guarda snapshots e recursos necessários para reabertura e navegação rápidas.
3. **Supabase:** mantém o estado persistente e compartilhado da conta entre Web e Android.
4. **TMDB:** fornece capas, nomes, notas e demais metadados; dados já resolvidos devem ser reutilizados e atualizados em segundo plano.

## Capas e metadados TMDB

Uma capa conhecida não deve ser procurada novamente a cada troca de aba. O sistema mantém `poster_path`/URLs já resolvidos e reutiliza o cache disponível. Falhas temporárias de rede ou TMDB não devem apagar uma informação válida já armazenada.

A mesma regra vale para nomes, notas e metadados: a interface usa a última informação válida e a atualização ocorre de forma assíncrona.

## Sincronização

Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta e devem permanecer coerentes entre Web e Android. Alterações feitas pelo usuário devem refletir imediatamente na interface e ser persistidas no backend sem exigir reconstrução completa da tela.

Estados manuais do usuário têm prioridade sobre inferências automáticas e não devem ser apagados por nova importação ou atualização de metadados.

## Perfil e histórico

O Perfil mantém números principais, gráfico diário, estatísticas extras e histórico. O gráfico apresenta episódios vistos por dia e permite consultar a atividade do dia. O Histórico utiliza capa da mídia e, para séries, também identifica o episódio correspondente.

## Descobrir

Conteúdo apresentado como novidade deve excluir títulos já vistos, acompanhados ou presentes na Watchlist/estados incompatíveis. Recomendações e sugestões devem respeitar o histórico para reduzir repetição.

## Build e validação

### Web

`npm run verify`

`npm run build`

O build executa validações antes de gerar `dist` e inclui os módulos de cache e Service Worker da 0.5.7.

### Android

O workflow `.github/workflows/build-android.yml`:

1. valida os módulos JavaScript usados pelo aplicativo;
2. configura Java/Gradle e a chave de assinatura dedicada;
3. compila o APK;
4. verifica assinatura, package `com.cinetracker.app` e versão `0.0.83`;
5. envia o artifact;
6. publica/atualiza a Release `android-v0.0.83`;
7. marca `Android Build` como sucesso ou falha.

## Regra de publicação

Uma versão não é considerada concluída apenas porque o código chegou à `main`.

Para Web: código + validação + build + deploy de produção confirmado.

Para Android: código + validação + build + APK válido + Release publicada.

Código-fonte, documentação, versionamento e pipeline devem permanecer sincronizados.

## Documentação

- `docs/ARCHITECTURE.md` — arquitetura e responsabilidades das camadas.
- `docs/SECURITY.md` — princípios de segurança.
- `docs/releases/0.5.7.md` — release Web atual.
- `docs/releases/0.0.83.md` — release Android atual.
- `docs/validation/` — registros e materiais de validação.
- `docs/notes/` — notas técnicas e históricas.
