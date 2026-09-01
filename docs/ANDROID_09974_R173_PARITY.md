# CineTracker Android 0.99.7.4 — Paridade Web r173

**Versão:** `0.99.7.4`  
**versionCode:** `9974`  
**Bundle:** `android-v0.99.7.4-r173-parity`  
**Baseline Web:** `r173-detail-left-window`  
**Commit Web congelado:** `9157d436bab8619a2cfbd492d35052176654c3ff`

## Objetivo

Levar para o APK Android toda a funcionalidade existente na Web r173 sem alterar a Web. O Android usa o mesmo runtime e as mesmas regras de negócio, adicionando somente a camada necessária para telefone/WebView.

## Estratégia técnica

- `scripts/prepare-android-v09974.mjs` executa `apps/web/build-r173.mjs`;
- lê exatamente `app-v173.js` e `app-v173.css`;
- injeta o runtime e CSS diretamente em `assets/hotfix5/index.html`;
- o APK não depende de `/app-v173.js` ou `/app-v173.css` externos;
- base URL continua apontando para o domínio do CineTracker para preservar navegação SPA/origem;
- Supabase/TMDB continuam sendo consumidos pelos mesmos contratos da Web;
- regras de negócio permanecem no runtime r173, não em uma implementação Android paralela.

## Adaptação mobile

- sidebar desktop escondida;
- navegação mobile Web r173 usada como barra inferior do APK;
- cinco destinos: Home, Descobrir, Esportes, Perfil e Configurações;
- barra nativa antiga permanece apenas por compatibilidade binária e fica invisível;
- busca global fica sticky no topo;
- carrosséis usam toque/scroll horizontal;
- detalhes de filme/série usam painel compacto em duas colunas no telefone;
- temporadas usam drawer em largura total no celular;
- gráficos mantêm scroll horizontal;
- filtros esportivos se reorganizam em linhas menores;
- toast fica acima da barra inferior;
- botão físico Voltar usa `window.ct48Back` e respeita drawer/detalhes/rotas internas.

## Paridade funcional exigida

### Home
- Séries e Filmes;
- Assistir a seguir;
- Watchlist;
- histórico;
- progresso;
- nome, nota e data do episódio;
- marcação rápida de episódio.

### Descobrir
- Pra você;
- Top 10;
- Em alta;
- Populares;
- Novidades;
- Lançamentos;
- Mais Aguardados;
- Mais bem avaliados;
- Calendário;
- filtros de tipo;
- carrossel/scroll/Ver mais;
- regras de exclusão de vistos/Watchlist/progresso.

### Top 10 / Onde Assistir
Somente:
- HBO Max;
- Amazon Prime Video;
- Netflix;
- Globoplay;
- Disney+;
- Apple TV+;
- Paramount+;
- Looke;
- Mubi;
- Crunchyroll.

### Esportes
- busca global de times/jogos/competições;
- calendário;
- favoritos;
- eventos das ligas;
- esportes assistidos;
- marcar/desmarcar jogo como assistido;
- filtros por modalidade/data;
- estatísticas esportivas.

### Perfil
- 10 cards estatísticos na ordem canônica;
- coleções e favoritos;
- botões Ver mais;
- adicionar série/filme/ator;
- gráfico Assistido por dia;
- 15 dias terminando em Hoje;
- soma episódios + filmes + esportes;
- clique no dia abre os itens vistos.

### Filmes e séries
- painel hero enjanelado à esquerda;
- backdrop;
- Watchlist;
- Visto/Reassistido;
- Favorito;
- país de produção;
- Onde Assistir;
- atores;
- relacionados mistos;
- relacionados excluem vistos/Watchlist.

### Séries
- temporadas;
- drawer lateral/mobile full-width;
- check correto dos episódios vistos;
- Reassistido;
- gráfico moderno por temporada;
- melhor episódio verde;
- pior episódio vermelho;
- scroll horizontal.

### Pessoas
- biografia;
- fallback inglês;
- favorito de ator;
- filmografia separada em Filmes e Séries.

### Configurações
- sincronização/reconciliação da biblioteca;
- importação via file picker do WebView;
- sessão e persistência já existentes no shell Android.

## Arquivos Android 0.99.7.4

- `apps/android/app/build.gradle`
- `apps/android/app/src/main/res/layout/activity_main.xml`
- `scripts/prepare-android-v09974.mjs`
- `scripts/test-android-v09974.mjs`
- `.github/workflows/build-android-v09974.yml`
- `ci-status/android-v09974-trigger.txt`

## Validação

Estados separados:
1. source/CI;
2. preparação do runtime embutido;
3. build Gradle;
4. identidade package/version;
5. assinatura APK;
6. artifact GitHub Actions;
7. GitHub Release;
8. smoke real no aparelho.

O CI não substitui o smoke visual no aparelho. Se print/vídeo divergir, o comportamento real prevalece.
