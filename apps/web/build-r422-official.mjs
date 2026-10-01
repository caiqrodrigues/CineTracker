await import('./build-r422.mjs');
process.env.CT_R422_SKIP_BUILD='1';
await import('./test-r422.mjs');
console.log('WEB_R422_OFFICIAL_PASS');
