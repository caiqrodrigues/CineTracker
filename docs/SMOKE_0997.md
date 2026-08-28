# CineTracker 0.99.7 - smoke real

Status: pre-visualizacao; ainda nao aprovado para producao.

O video de smoke real da 0.99.7 reproduziu: navegacao duplicada, busca duplicada na Home, capas ausentes, detalhes sem correspondencia TMDB, Descobrir bloqueado por validacao de exclusoes e convivencia de UI legada com a timeline nova do Perfil.

Tambem confirmou como funcionais Atores Favoritos e a timeline com Hoje centralizado e sete dias visiveis.

A branch `fix/0997-real-smoke-hotfix` adiciona a camada v119 depois da autoridade v118, normaliza/faz fallback seguro das exclusoes, aceita titulo original do TMDB para resolver detalhes, repara posters visiveis e corrige o source do enriquecimento para comparar titulos localizados e originais.

Nao publicar a Edge Function nem mergear esta branch antes do smoke da preview.
