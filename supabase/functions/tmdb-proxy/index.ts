import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const TOKEN_TTL=15*60*1000;
let tokenCache:{value:string;at:number}|null=null;
let tokenInflight:Promise<string>|null=null;

async function tmdbToken(){
  if(tokenCache&&Date.now()-tokenCache.at<TOKEN_TTL)return tokenCache.value;
  if(tokenInflight)return tokenInflight;
  tokenInflight=(async()=>{
    const {data,error}=await sb.rpc('cinetracker_tmdb_token');
    if(error||!data)throw new Error('token TMDB indisponível');
    const value=String(data);
    tokenCache={value,at:Date.now()};
    return value;
  })();
  try{return await tokenInflight}finally{tokenInflight=null}
}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  try{
    const u=new URL(req.url);
    const path=u.searchParams.get('path');
    if(!path||!path.startsWith('/'))return Response.json({error:'path inválido'},{status:400,headers:cors});
    const token=await tmdbToken();
    const target=new URL('https://api.themoviedb.org/3'+path);
    for(const [k,v] of u.searchParams)if(k!=='path')target.searchParams.set(k,v);
    if(!target.searchParams.has('language'))target.searchParams.set('language','pt-BR');
    const r=await fetch(target,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
    return new Response(await r.text(),{status:r.status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'public, max-age=300'}});
  }catch(e){return Response.json({error:String(e)},{status:500,headers:cors})}
});
