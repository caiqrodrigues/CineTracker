# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.3.1** |
| Android | **0.0.47** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Uma versão Android só é considerada concluída quando código, documentação, workflow, Release e APK estiverem publicados.
- Compilação bem-sucedida não equivale a validação visual/funcional; a validação exige instalação e teste real.
- Android mantém `applicationId` e chave de assinatura estáveis; toda nova APK deve ser instalável por cima da anterior. Se a chave persistente não estiver disponível, a build deve falhar em vez de gerar uma nova.

## Linha Web

- **0.1.x–0.3.1** — evolução da aplicação Web, autenticação, Supabase, importação, TMDB, biblioteca, histórico, perfil e estatísticas.

## Linha Android

- **0.0.1–0.0.43** — shell Android e ciclo iterativo de otimização móvel.
- **0.0.44** — tentativa de consolidação visual posteriormente identificada como insuficiente.
- **0.0.45** — Activity real versionada no repositório; removida reescrita de Java durante a build.
- **0.0.46** — atualização por sobreposição obrigatória no CI e notificações nativas para lançamentos/episódios; notificações validadas em aparelho real.
- **0.0.47** — runtime móvel final `ct47.js` assume explicitamente Assistir e pós-processa Perfil/Descobrir. Remove gráfico de horário do Tempo de Tela; aplica gráfico diário em dark mode; força 3 cards por linha em Descobrir; Assistir abre em Acompanhando com Em dia acima, Juntando poeira e Não iniciadas abaixo; Carrossel padrão com Grade/Lista; série → temporada → episódio com marcação persistente de visto. Notificações da 0.0.46 são preservadas.

## Documentação por release

Cada release nova recebe arquivo próprio em `docs/releases/`.

- `docs/releases/0.0.44.md`
- `docs/releases/0.0.45.md`
- `docs/releases/0.0.46.md`
- `docs/releases/0.0.47.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico de commits/releases do GitHub.
