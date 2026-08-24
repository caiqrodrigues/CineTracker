# Arquitetura do CineTracker

## Versões de referência

- Web: **0.5.7**
- Android: **0.0.83** (`versionCode 83`)

Esta geração altera a arquitetura de carregamento/cache sem alterar layout ou funcionalidades aprovadas.

## Princípio central

O CineTracker usa uma conta única e um backend único para Web e Android.

```text
Web / Android
      │
      ├── Supabase Auth
      ├── PostgreSQL + RLS
      ├── Edge Functions
      └── TMDB via proxy/backend
```

A interface não deve depender de uma nova chamada de rede para reconstruir dados já conhecidos. O princípio operacional é:

`cache/estado local → renderização → sincronização silenciosa → atualização somente do que mudou`

## Fonte de verdade e responsabilidades

### Supabase

É a fonte consolidada do estado persistente do usuário e permite que Web e Android compartilhem a mesma conta e os mesmos dados.

Responsabilidades principais:

- autenticação;
- Watchlist e estados manuais;
- histórico;
- progresso;
- perfil e preferências;
- importações;
- dados persistentes compartilhados entre dispositivos.

### TMDB

É fonte externa de metadados de catálogo, incluindo nomes, capas, backdrops, notas e informações estruturais. TMDB não deve permanecer no caminho crítico da renderização quando uma informação válida já foi resolvida anteriormente.

Regras:

- reutilizar `poster_path`, URLs e metadados conhecidos;
- não repetir uma busca apenas porque o usuário trocou de aba;
- atualização deve ocorrer em segundo plano;
- falha temporária de rede não deve apagar dado válido em cache;
- chamadas simultâneas equivalentes devem ser evitadas/deduplicadas sempre que possível.

## Estratégia cache-first

```text
               TMDB
                │
         atualização externa
                │
             Supabase
          estado persistente
            /         \
           /           \
     Web cache       Android cache
     IndexedDB       IndexedDB/WebView
     Service Worker  WebView HTTP cache
          │               │
          └────── UI ──────┘
```

### L1 — estado em memória

Usado durante a sessão para que troca de abas reutilize objetos e resultados já carregados.

### L2 — cache persistente do dispositivo/navegador

Web usa IndexedDB e Service Worker. Android utiliza IndexedDB dentro do WebView, além do cache HTTP/WebView. Esse nível permite reaproveitar snapshots e recursos entre sessões.

### L3 — Supabase

Mantém o estado consolidado da conta. A sincronização deve atualizar o cache local sem bloquear a interface quando houver estado utilizável disponível.

## Web 0.5.7

A camada `patch-v057-cache.js` adiciona cache persistente sem criar ou modificar layout.

Snapshots locais incluem:

- continuar assistindo;
- histórico recente;
- `media_overrides`;
- estatísticas/perfil.

O Service Worker mantém cache de recursos e aplica cache-first para imagens TMDB e stale-while-revalidate para requisições de metadados compatíveis.

Capas conhecidas são pré-aquecidas silenciosamente após a inicialização.

## Android 0.0.83

Android continua sendo um aplicativo nativo com WebView apontando para a experiência Web oficial, compartilhando identidade Supabase.

A camada `ct69-cache.js` é exclusivamente de performance e não introduz DOM/layout próprio.

Ela:

- cria cache persistente via IndexedDB;
- salva snapshots de dados essenciais;
- pré-aquece capas conhecidas;
- reutiliza o cache do WebView;
- executa refresh/sincronização em segundo plano.

O runtime mantém os módulos funcionais aprovados e acrescenta `ct69-cache.js` ao final da cadeia estável.

## Dados persistidos

Principais estruturas atuais:

- `profiles`: preferências e configurações do usuário;
- `media`: catálogo normalizado dos títulos já utilizados;
- `media_overrides`: estados e decisões manuais do usuário;
- `episode_progress`: progresso por episódio;
- `watch_history`: histórico de consumo;
- `recommendation_history`: histórico de recomendação/exibição/troca para reduzir repetição;
- `daily_menus`: menus diários persistidos;
- `imports`: controle de importações;
- `import_items`: itens individuais importados e status de conciliação.

## Prioridade de estado

Decisões manuais do usuário têm prioridade sobre inferências automáticas. Uma importação, refresh TMDB ou recomposição automática não deve apagar um estado manual válido.

## Escrita e atualização otimista

A experiência desejada ao marcar um episódio/filme é:

1. atualizar imediatamente o estado exibido;
2. refletir progresso, próximo episódio, histórico e estatísticas dependentes;
3. persistir/sincronizar o estado;
4. atualizar apenas componentes afetados;
5. evitar reload completo da aplicação.

## Abertura e pré-carregamento

A abertura deve priorizar dados suficientes para compor imediatamente as telas principais. Pré-carregamento não significa buscar todo o catálogo ou todas as temporadas.

Prioridade:

- Home/continuar assistindo;
- Watchlist necessária para a interface;
- histórico recente;
- perfil/estatísticas;
- capas já conhecidas e imediatamente visíveis;
- dados necessários para Descobrir inicial.

Operações de rede adicionais devem ocorrer silenciosamente sempre que possível.

## Navegação

Troca de abas deve ser mudança de visualização sobre estado já carregado, não um gatilho para reconstrução completa do catálogo. A navegação deve reutilizar L1/L2 e solicitar atualização somente quando o dado estiver ausente ou precisar de revalidação.

## Regra anti-repetição em Descobrir

Um título não entra como novidade quando já estiver visto, acompanhado, na Watchlist ou em outro estado incompatível. O histórico de recomendações também deve ser considerado para reduzir repetição dentro da janela configurada.

## Perfil e Histórico

Perfil reúne números principais, gráfico diário, estatísticas extras e Histórico. O gráfico trabalha com atividade diária e os dias são consultáveis. Histórico deve reutilizar metadados/capas já conhecidos; séries também exibem o nome do episódio quando disponível.

## Build e validação

A Web passa por `scripts/verify.mjs` antes do build. O Android passa por validação JavaScript, Gradle, assinatura, package/version e publicação via GitHub Actions.

Uma versão somente é considerada pronta após confirmação do pipeline correspondente; commit na `main` sozinho não comprova deploy Web ou APK publicado.
