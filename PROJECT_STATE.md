# CineTracker — Project State

> Documento persistente de continuidade. O estado real do projeto deve ser entendido por este arquivo e pelos documentos canônicos referenciados abaixo, sem depender do histórico de conversa.

**Última atualização:** 2026-09-01  
**Branch de produção:** `main`  
**Web:** `0.99.7` / revision **`r173-detail-left-window` — FROZEN**  
**Android alvo atual:** **`0.99.7.4` / versionCode `9974`**  
**Backend:** Supabase production compartilhado por Web/Android  
**Windows:** não lançado

## 1. Regra principal a partir da r173

A Web r173 está **congelada** e não deve mais receber alterações enquanto o trabalho atual for o porte Android.

Commit canônico da Web congelada:

`9157d436bab8619a2cfbd492d35052176654c3ff`

Revision exibida no rodapé:

`r173-detail-left-window`

Documento completo da baseline:

`docs/WEB_R173_FROZEN_BASELINE.md`

Qualquer trabalho Android deve portar/adaptar a r173 sem alterar regras de negócio Web. Mudanças futuras na Web exigem solicitação explícita e nova revision.

## 2. Estado funcional da Web r173

A r173 é a melhor baseline atual e inclui, entre outros:

- Home de Séries e Filmes com progresso e metadados de episódio;
- Descobrir com Pra Você, Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Calendário;
- preload em etapas e regras de exclusão pessoal;
- Esportes com busca global, favoritos, calendário, eventos e marcação de assistido;
- Perfil com estatísticas, coleções, favoritos e gráfico `Assistido por dia` clicável;
- detalhe rico de filme/série com hero enjanelado à esquerda;
- Watchlist, Visto/Reassistido e Favorito;
- país de produção;
- Onde Assistir limitado aos 10 streamings canônicos;
- temporadas em drawer lateral;
- episódios com estado visto/reassistido reconciliado pela identidade TMDB lógica;
- gráficos modernos por temporada com melhor episódio verde e pior vermelho;
- atores com biografia, favorito e filmografia separada;
- títulos relacionados misturando Filmes e Séries e excluindo vistos/Watchlist;
- navegação Voltar nas telas internas;
- correções de RLS/identidade de mídia e sincronização de biblioteca.

A descrição detalhada e as regras exatas ficam em `docs/WEB_R173_FROZEN_BASELINE.md`.

## 3. Streamings canônicos

Top 10 e Onde Assistir usam somente:

1. HBO Max
2. Amazon Prime Video
3. Netflix
4. Globoplay
5. Disney+
6. Apple TV+
7. Paramount+
8. Looke
9. Mubi
10. Crunchyroll

Planos/variantes e canais como `Standard with Ads`, `Premium`, `with Ads` e `Amazon Channel` são consolidados ou ignorados para evitar duplicação.

## 4. Android 0.99.7.4

Objetivo: **paridade funcional completa com a Web r173**, adaptando somente viewport, navegação e composição visual para telefone/WebView.

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7.4`;
- `versionCode`: `9974`;
- bundle: `android-v0.99.7.4-r173-parity`;
- baseline: `r173-detail-left-window`;
- builder: `scripts/prepare-android-v09974.mjs`;
- test: `scripts/test-android-v09974.mjs`;
- workflow: `.github/workflows/build-android-v09974.yml`;
- release planejada/automática após merge: `android-v0.99.7.4`.

Documento técnico completo:

`docs/ANDROID_09974_R173_PARITY.md`

## 5. Arquitetura Android 0.99.7.4

O APK continua usando WebView, mas não mantém um runtime de regras separado.

O builder:

1. executa `apps/web/build-r173.mjs`;
2. valida a revision congelada;
3. lê `app-v173.js` e `app-v173.css`;
4. injeta ambos no HTML do APK;
5. adiciona apenas adaptação mobile e bridge de navegação/back;
6. grava `assets/hotfix5/index.html` totalmente autocontido.

A barra nativa antiga fica escondida. O APK usa a navegação mobile r173 com cinco destinos: Home, Descobrir, Esportes, Perfil e Configurações.

O botão físico Voltar é conectado a `window.ct48Back` para respeitar drawers, detalhes e rotas internas.

## 6. Paridade Android obrigatória

O APK 0.99.7.4 deve conter funcionalmente tudo da Web r173, incluindo:

- Home completa;
- Descobrir completo + Top 10;
- Pra Você e regras pessoais;
- Esportes completos;
- Perfil e gráfico Assistido por dia clicável;
- Configurações/sincronização;
- filmes/séries ricos;
- Onde Assistir;
- país de produção;
- Watchlist;
- Visto/Reassistido;
- Favorito;
- temporadas/episódios;
- gráficos por temporada;
- atores/filmografia/favoritos;
- títulos relacionados;
- busca global;
- Voltar.

Não aceitar substituição por telas Android simplificadas que removam recursos da baseline r173.

## 7. Validação

Estados independentes:

- source/PR;
- Verify CI;
- build do runtime embutido;
- Gradle/APK;
- package/versionCode/versionName;
- assinatura;
- artifact;
- GitHub Release;
- smoke real no aparelho.

CI verde não equivale a UX validada. Print/vídeo real prevalece se houver divergência.

## 8. Documentos canônicos atuais

- `PROJECT_STATE.md`
- `VERSIONS.md`
- `docs/WEB_R173_FROZEN_BASELINE.md`
- `docs/ANDROID_09974_R173_PARITY.md`
- `CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
