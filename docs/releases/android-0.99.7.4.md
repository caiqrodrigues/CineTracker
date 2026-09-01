# CineTracker Android 0.99.7.4 — r173 Parity

## Base

- Web congelada: `r173-detail-left-window`
- commit Web canônico: `9157d436bab8619a2cfbd492d35052176654c3ff`
- Android: `versionName 0.99.7.4`
- Android: `versionCode 9974`
- bundle: `android-v0.99.7.4-r173-parity`

## Escopo

Esta release substitui a defasagem funcional do APK anterior. Em vez de continuar evoluindo uma pilha Android própria baseada em revisões Web antigas, o APK 0.99.7.4 empacota diretamente a autoridade r173 congelada e aplica somente adaptação mobile.

## Funcionalidades portadas

- Home completa de Séries e Filmes;
- nome, nota e data do episódio na Home;
- Descobrir completo;
- Pra Você com regras pessoais;
- Top 10 por streaming;
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados;
- Calendário;
- Esportes completos, busca global e assistidos;
- Perfil e todas as coleções/favoritos;
- gráfico Assistido por dia somando episódios, filmes e esportes;
- clique no dia para abrir itens vistos;
- detalhe rico de Filme e Série;
- painel hero enjanelado à esquerda;
- Watchlist, Visto/Reassistido e Favorito;
- país de produção;
- Onde Assistir;
- temporadas em drawer;
- episódios com check visto correto;
- gráficos por temporada com melhor/pior episódio;
- atores, biografia, filmografia e favoritos;
- títulos relacionados misturando filmes e séries;
- busca global;
- Voltar.

## Streamings permitidos

- HBO Max
- Amazon Prime Video
- Netflix
- Globoplay
- Disney+
- Apple TV+
- Paramount+
- Looke
- Mubi
- Crunchyroll

Variantes de planos e canais são consolidadas/ignoradas para não duplicar o serviço.

## Adaptações Android

- WebView com runtime r173 embutido e autocontido;
- navegação inferior mobile da própria r173;
- suporte a Home, Descobrir, Esportes, Perfil e Configurações;
- layout responsivo de detalhes;
- drawer de temporada em tela cheia no telefone;
- carrosséis e gráficos com swipe horizontal;
- botão físico Voltar conectado à navegação interna;
- file chooser nativo preservado;
- sessão/notificações do shell Android preservadas.

## Build e release

Workflow: `.github/workflows/build-android-v09974.yml`

Artifact esperado:

`cinetracker-android-0.99.7.4-r173-parity-debug.apk`

Release esperada:

`android-v0.99.7.4`

O workflow valida package, versionName, versionCode, assinatura, markers da r173 e SHA-256 antes de publicar.

## Validação final

A release só é considerada visualmente aprovada após smoke em aparelho real. CI verde prova build/identidade/markers, não prova UX completa.
