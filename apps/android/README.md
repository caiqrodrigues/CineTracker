# CineTracker Android 0.0.1

App Android leve baseado em `Activity + WebView`, sem framework híbrido pesado.

## Produção

- URL padrão: `https://mycinetracker.vercel.app`
- Conta e dados: Supabase compartilhado com o Web
- Importação: seletor nativo para JSON/ZIP
- Navegação externa: abre no navegador do sistema
- Sessão: DOM Storage/WebView preserva o login da aplicação

## Objetivo da 0.0.1

Entregar a mesma experiência funcional do Web com APK pequeno e baixo consumo, deixando recursos nativos específicos (push notifications, widgets, atalhos e downloads nativos) para versões posteriores quando agregarem valor real.

## Build

O GitHub Actions executa `gradle assembleDebug` e publica o APK debug como artifact `cinetracker-android-0.0.1-debug`.
