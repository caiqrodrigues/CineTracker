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
10. Atualizar `docs/SECURITY.md` quando houver impacto de Auth, RLS, RPC, importação ou superfície pública.
11. Mudança de banco deve possuir migration; Edge Function deve manter source versionado.
12. Não marcar build, deploy, APK, produção, aparelho real ou comportamento visual sem evidência.
13. Web/Android compartilhados mantêm a mesma release lógica, salvo decisão documentada.
14. Android sempre incrementa `versionCode` em uma nova versão publicada.
15. RPC cliente deve documentar autorização e preferir `SECURITY INVOKER`.
16. **Toda tabela nova com dados por usuário deve possuir estratégia explícita de RLS/policies antes de ser consumida pelo cliente.**
17. Automação de estados deve preservar `origin='manual'`.
18. Recurso de calendário deve declarar se é client-side, server-side ou agendado.
19. **Em runtime composto por patches, validar a ordem e também o comportamento do DOM final. Presença de arquivo/marker não prova que a camada venceu handlers/mutações legadas.**
20. **Navegação deve ser testada no desktop e em viewport móvel quando houver listeners diferentes. Um CI que apenas encontra strings não substitui teste do destino final.**
21. **Quando evidência real contradizer um CI verde, a evidência funcional bloqueia a release até a causa ser corrigida; não mascarar o problema criando nova versão se a release atual ainda não foi publicada.**
22. **Toda escrita cliente em tabela RLS deve validar os campos de escopo exigidos (`profile_id` etc.) contra o schema/policies, não apenas compilar o JavaScript.**

## Fonte de verdade e precedência

- GitHub `main`: source, docs, migrations e pipelines;
- Supabase: backend/estado persistente;
- TMDB: metadados externos, não decisões do usuário;
- decisões manuais do usuário têm prioridade.

## Release em preparação

- Web: **0.99.2 FIX**, package `0.99.2`, cache `ct-web-0.99.2`;
- Android: **0.99.2 FIX**, `versionCode 9912`, bundle `v0.99.2-fix-991-992-authoritative`;
- Backend lógico: **0.99.2**;
- Windows: não lançado.

O sufixo “FIX” é descritivo desta unidade ainda não publicada; `versionName`/package permanecem `0.99.2`.

## Estados separados

- **source/current target** — código/documentação preparados;
- **validated** — verificações realmente executadas;
- **published** — deploy/artifact/Release publicados;
- **device-validated** — instalação/smoke real quando aplicável.

Nunca usar “publicado” ou “validado” como sinônimo de “commitado”.

## Fechamento de release

Registrar separadamente: merge em `main`, Verify, deploy Web, build Android, identidade `aapt`, assinatura, artifact, GitHub Release, checksum e smoke visual. Para runtimes em camadas, a validação deve provar que a **camada final realmente controla a UI** e não apenas que seus arquivos estão presentes.
