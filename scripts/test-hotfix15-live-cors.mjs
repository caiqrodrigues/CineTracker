const url='https://pjmkxryboypluleuuupp.supabase.co/functions/v1/ct-import-bingers-user';
const origin='https://mycinetracker.vercel.app';
const response=await fetch(url,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,apikey,content-type,x-client-info'}});
const allowOrigin=response.headers.get('access-control-allow-origin')||'';
const allowHeaders=(response.headers.get('access-control-allow-headers')||'').toLowerCase();
const allowMethods=(response.headers.get('access-control-allow-methods')||'').toUpperCase();
if(response.status!==204)throw new Error(`HOTFIX15 live CORS: expected 204 OPTIONS, got ${response.status}`);
if(allowOrigin!=='*'&&!allowOrigin.includes('mycinetracker.vercel.app'))throw new Error(`HOTFIX15 live CORS: bad allow-origin ${allowOrigin}`);
for(const h of ['authorization','apikey','content-type'])if(!allowHeaders.includes(h))throw new Error(`HOTFIX15 live CORS: missing ${h} in ${allowHeaders}`);
if(!allowMethods.includes('POST')||!allowMethods.includes('OPTIONS'))throw new Error(`HOTFIX15 live CORS: bad methods ${allowMethods}`);

// The gateway must allow browser preflight, while the function itself still requires a real user Bearer token.
const anonymous=await fetch(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({action:'begin',filename:'security-probe.csv',total_items:0})});
const anonText=await anonymous.text();
const anonOrigin=anonymous.headers.get('access-control-allow-origin')||'';
if(anonymous.status!==400)throw new Error(`HOTFIX15 live auth: anonymous POST expected 400, got ${anonymous.status}: ${anonText.slice(0,200)}`);
if(!/Sessão ausente|Sessao ausente/i.test(anonText))throw new Error(`HOTFIX15 live auth: anonymous request was not rejected by function auth: ${anonText.slice(0,200)}`);
if(anonOrigin!=='*'&&!anonOrigin.includes('mycinetracker.vercel.app'))throw new Error(`HOTFIX15 live auth: missing CORS on rejected POST: ${anonOrigin}`);
console.log(`HOTFIX15_LIVE_CORS_OK preflight=${response.status}; anonymous=${anonymous.status}; origin=${allowOrigin}; headers=${allowHeaders}; methods=${allowMethods}`);