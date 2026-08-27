# Regras obrigatórias de desenvolvimento e registro

**Vigência:** 2026-08-26  
**Atualizado:** 2026-08-27  
**Aplicação:** todo o repositório CineTracker, Web, Android, Supabase, banco, importadores, CI/CD e documentação.

## Regra principal

**Toda atualização ou mudança do CineTracker deve gerar registro no GitHub e deve estar associada a uma versão explícita.**

Nenhuma alteração pode existir apenas em conversa, console, Supabase ou ambiente local. Uma unidade lógica pode exigir vários commits enquanto não for encerrada; uma nova unidade posterior exige novo incremento.

## Checklist obrigatório

1. Definir a versão.
2. Atualizar package Web, rodapé, cache, Android `versionName`/`versionCode`, bundle/runtime e workflow/release aplicáveis.
3. Atualizar `CHANGELOG.md`.
4. Atualizar `PROJECT_STATE.md`.
5. Atualizar `VERSIONS.md`.
6. Atualizar README geral e das plataformas afetadas.
7. Criar/atualizar `docs/releases/<versão>.md`.
8. Criar/atualizar `docs/validation/<versão>.md`.
9. Atualizar `docs/ARCHITECTURE.md` quando o fluxo/runtime mudar.
10. Atualizar `docs/SECURITY.md` quando houver impacto de Auth, RLS, RPC, importação, disponibilidade ou superfície pública.
11. Mudança de banco deve possuir migration; Edge Function deve manter source versionado.
12. Não marcar build, deploy, APK, produção, aparelho real ou comportamento visual sem evidência.
13. Web/Android compartilhados mantêm a mesma release lógica, salvo decisão documentada.
14. Android nunca reutiliza `versionCode` já publicado. Se uma release lógica ainda aberta precisar substituir um APK defeituoso, manter `versionName` quando apropriado e incrementar `versionCode`.
15. RPC cliente deve documentar autorização e preferir `SECURITY INVOKER`.
16. **Toda tabela nova com dados por usuário deve possuir estratégia explícita de RLS/policies antes de ser consumida pelo cliente.**
17. Automação de estados deve preservar `origin='manual'`.
18. Recurso de calendário deve declarar se é client-side, server-side ou agendado.
19. **Em runtime composto por patches, validar a ordem e também o comportamento do DOM final. Presença de arquivo/marker não prova que a camada venceu handlers/mutações legadas.**
20. **Navegação deve ser testada no desktop e em viewport móvel quando houver listeners diferentes. Um CI que apenas encontra strings não substitui teste do destino final.**
21. **Quando evidência real contradizer um CI verde, a evidência funcional bloqueia a release até a causa ser corrigida; não mascarar o problema criando nova versão se a unidade lógica atual ainda não foi funcionalmente encerrada.**
22. **Toda escrita cliente em tabela RLS deve validar os campos de escopo exigidos (`profile_id` etc.) contra schema/policies, não apenas compilar JavaScript.**
23. **Todo `MutationObserver` deve ter callback idempotente: não escrever no DOM quando o estado/texto/atributo desejado já é igual ao atual.**
24. **É proibido usar `MutationObserver` que observa uma árvore e, sem guarda de igualdade/reentrância, modifica essa mesma árvore em toda notificação.**
25. **Mudança envolvendo observers, polling, render reativo ou reconciliação deve possuir teste de estabilidade/responsividade; o critério inclui ausência de loop de mutações/CPU runaway por pelo menos 60 s em smoke real.**
26. **Monkey-patch global de API DOM só pode ser usado como correção compatível/transitória, com semântica restrita, documentação de impacto e plano de remoção quando o legado for refatorado.**
27. **Se Web e WebView reproduzem o mesmo congelamento, tratar primeiro a camada compartilhada do runtime; não duplicar correções divergentes por plataforma sem evidência.**
28. **Quando o usuário solicitar explicitamente evolução de apenas uma plataforma, a divergência de versão Web/Android é permitida desde que seja declarada em `VERSIONS.md`, `PROJECT_STATE.md`, release notes e CI, e que a plataforma fora do escopo não seja republicada silenciosamente.**

## Fonte de verdade e precedência

- GitHub `main`: source, docs, migrations e pipelines;
- Supabase: backend/estado persistente;
- TMDB: metadados externos, não decisões do usuário;
- decisões manuais do usuário têm prioridade.

## Releases atuais

- Web: **0.99.3**, package `0.99.3`, cache `ct-web-0.99.3`, pre-gate `patch-v097-v0993-nav-pre.js`, final `patch-v098-v0993-web.js`;
- Android: **0.99.2.3**, `versionName 0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative`;
- Backend lógico: **0.99.2**;
- Windows: não lançado.

A divergência Web/Android acima é deliberada: a unidade 0.99.3 foi solicitada exclusivamente para navegador Web desktop. Nenhum APK é reconstruído ou republicado nessa unidade.

## Estados separados

- **source/current target** — código/documentação preparados;
- **validated** — verificações realmente executadas;
- **published** — deploy/artifact/Release publicados;
- **device-validated** — instalação/smoke real quando aplicável.

Nunca usar “publicado” ou “validado” como sinônimo de “commitado” ou de “funciona no uso real”.

## Fechamento de release

Registrar separadamente: merge em `main`, Verify, deploy Web, build Android quando aplicável, identidade `aapt`, assinatura, artifact, GitHub Release, checksum e smoke visual. Para runtimes em camadas, a validação deve provar que a **camada final realmente controla a UI**, que observers/reconciliações não entram em churn e que a interface permanece responsiva no ambiente real.
