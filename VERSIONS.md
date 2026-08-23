# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.8** |
| Android | **0.0.48** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` é sempre crescente.
- A `0.0.48` é a migração única para a assinatura permanente comprovada pelo CI.
- A partir da `0.0.48`, toda versão futura deve ser assinada pelo certificado SHA-256 `063e4ebc59d652a9972422dc04a815e549aad94fee4b351636ca55badc46e17b`; o CI falha se o certificado mudar.

## Linha Web

- **0.1.x–0.4.7** — evolução da aplicação Web: autenticação, Supabase, importação, TMDB, biblioteca, histórico, perfil, estatísticas, configurações e resolvedor global de nomes/capas.
- **0.4.8** — paridade funcional com Android 0.0.48, exceto notificações nativas: Tempo de Tela diário interativo, Assistir com seções Em dia/Acompanhando/Juntando poeira/Não iniciadas, Carrossel padrão com Grade/Lista, série → temporada → episódio com marcação persistente, Descobrir compacto em três colunas e Configurações com conta, segurança e backup.

## Linha Android

- **0.0.1–0.0.43** — shell Android e ciclo iterativo de otimização móvel.
- **0.0.44** — tentativa de consolidação visual posteriormente identificada como insuficiente.
- **0.0.45** — Activity real versionada no repositório.
- **0.0.46** — notificações nativas; notificações validadas em aparelho real. Posteriormente foi comprovado que o APK publicado usa certificado diferente da chave privada disponível atualmente.
- **0.0.47** — instalação por sobreposição falhou no aparelho por incompatibilidade de assinatura e a UI ainda apresentava componentes antigos.
- **0.0.48** — migração única de assinatura e novo baseline permanente; reduz a carga Android para `ct41 + ct47 + ct48`, remove patches legados da inicialização, corrige versão duplicada em Configurações, remove gráfico de horário, força Descobrir em 3 colunas e preserva Assistir com Carrossel/Grade/Lista e série → temporada → episódio. Após instalar a 0.0.48, as próximas versões devem atualizar por sobreposição.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`.

- `docs/releases/web-0.4.8.md`
- `docs/releases/0.0.44.md`
- `docs/releases/0.0.45.md`
- `docs/releases/0.0.46.md`
- `docs/releases/0.0.47.md`
- `docs/releases/0.0.48.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
