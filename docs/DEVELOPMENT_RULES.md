# Regras obrigatórias de desenvolvimento e registro

**Vigência:** 2026-08-26  
**Aplicação:** todo o repositório CineTracker, Web, Android, Supabase, banco de dados, importadores, CI/CD e documentação.

## Regra principal

**Toda atualização ou mudança do CineTracker deve gerar registro no GitHub e deve estar associada a uma versão explícita.**

Nenhuma alteração funcional, correção, migração, mudança de regra de domínio, mudança de build, alteração de importação, mudança de segurança ou modificação de comportamento pode existir apenas em conversa, console, Supabase ou ambiente local.

Uma unidade lógica de mudança pode exigir vários commits; esses commits pertencem à mesma versão enquanto a unidade não estiver encerrada. Uma nova unidade de mudança posterior exige novo incremento de versão.

## Checklist obrigatório para cada mudança

1. Definir a nova versão antes ou junto da implementação.
2. Alterar todos os identificadores afetados: pacote Web, versão exibida, namespace de cache, Android `versionName`/`versionCode`, bundle/runtime e workflow/release.
3. Registrar a mudança no `CHANGELOG.md`.
4. Atualizar `PROJECT_STATE.md`.
5. Atualizar `VERSIONS.md`.
6. Atualizar `README.md` e README(s) das plataformas afetadas.
7. Criar/atualizar `docs/releases/<versão>.md`.
8. Criar/atualizar `docs/validation/<versão>.md`.
9. Atualizar `docs/ARCHITECTURE.md` se fluxo, responsabilidade, armazenamento, integração ou runtime forem afetados.
10. Atualizar `docs/SECURITY.md` se houver impacto de autenticação, autorização, RLS, função privilegiada, upload/importação ou superfície pública.
11. Toda alteração de banco deve possuir migration em `supabase/migrations/`; mudança de Edge Function deve manter source em `supabase/functions/`.
12. Não marcar build, deploy, APK, produção, Android real ou comportamento visual como validado sem evidência real.
13. Mudanças Web/Android compartilhadas devem manter a mesma release lógica, salvo decisão arquitetural documentada.
14. Uma versão Android deve aumentar `versionCode`; nunca reutilizar código de versão publicado.
15. Toda função/RPC nova usada pelo cliente deve documentar escopo/autorização e preferir `SECURITY INVOKER` quando não houver necessidade comprovada de privilégio elevado.

## Fonte de verdade e precedência

- GitHub `main`: source, documentação, migrations e pipelines.
- Supabase: estado persistente e backend ativo.
- TMDB: metadados externos, não decisões do usuário.
- Decisões manuais do usuário têm prioridade sobre inferências/importações.

## Versionamento atual

A governança foi formalizada no `0.0.97 HOTFIX 18` e continua obrigatória.

Release lógica corrente:

- Web: **0.0.99**, package `0.0.99`, cache `ct-web-0.0.99`;
- Android: **0.0.99**, `versionCode 997`;
- Backend lógico: **0.0.99**; Edge Functions mantêm versões de deploy independentes;
- Windows: ainda não lançado.

## Publicação x versão de código

Estados obrigatoriamente separados:

- **source/current target**: código/documentação em `main`;
- **validated**: verificações executadas e aprovadas;
- **published**: deploy/artifact/Release efetivamente publicados;
- **device-validated**: instalação/teste em dispositivo real quando aplicável.

Nunca usar “publicado” ou “validado” como sinônimo de “commitado”.
