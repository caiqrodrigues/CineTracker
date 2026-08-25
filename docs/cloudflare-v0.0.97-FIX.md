# Cloudflare — CineTracker v0.0.97 FIX

Aplicar quando o domínio do CineTracker estiver conectado à conta Cloudflare:

1. DNS: CNAME do host do app apontando para `cname.vercel-dns.com`, Proxy ativado (nuvem laranja).
2. SSL/TLS: modo `Full (strict)` e Always Use HTTPS habilitado.
3. Cache Rule para assets estáticos `*.js`, `*.css`, `*.svg`, `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.avif`, `*.woff2`: Edge TTL 30 dias; Browser TTL respeitar origem.
4. Não cachear `/service-worker.js`, rotas `/auth/*` nem respostas autenticadas do Supabase.
5. Brotli habilitado. HTTP/2 e HTTP/3 habilitados.
6. Auto Minify para HTML/CSS/JS quando disponível no plano/conta.
7. A origem Vercel já envia `Cache-Control: public, max-age=31536000, immutable` para assets estáticos neste FIX.
8. A Edge Function `tmdb-image` já envia `Cache-Control` e `CDN-Cache-Control` com `s-maxage=2592000` e `stale-while-revalidate=86400`.

Observação: DNS/Proxy/SSL/Auto Minify são configurações da conta Cloudflare e não podem ser alteradas pelo repositório sem uma conexão/autorização Cloudflare.
