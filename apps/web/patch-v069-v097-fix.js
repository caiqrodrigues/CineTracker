(() => {
'use strict';
if (window.__ct097FixLoaded) return;
window.__ct097FixLoaded = true;
window.__ctAndroidBuild = '0.0.97 FIX';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const AUTH_TIMEOUT_MS=12000;
function timeoutError(){const e=new Error('Tempo limite de autenticação excedido. Verifique sua conexão e tente novamente.');e.name='TimeoutError';return e;}
async function fetchWithTimeout(url,options={},ms=AUTH_TIMEOUT_MS){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);try{return await fetch(url,{...options,signal:ctrl.signal});}catch(e){if(e?.name==='AbortError')throw timeoutError();throw e;}finally{clearTimeout(timer)}}
function setLoginLoading(loading){const form=$('.auth-card form');if(!form)return;const btn=$('.auth-submit',form)||$('button[type="submit"]',form);if(btn){if(!btn.dataset.ctFixLabel)btn.dataset.ctFixLabel=btn.textContent||'Entrar';btn.disabled=!!loading;btn.setAttribute('aria-busy',loading?'true':'false');btn.textContent=loading?'Entrando...':btn.dataset.ctFixLabel}form.dataset.loading=loading?'1':'0'}
function setAuthError(msg=''){const el=$('.auth-error');if(el)el.textContent=msg}
function persistNativeSession(session){try{window.CineTrackerNative?.saveSession?.(JSON.stringify(session||{}))}catch{}}
async function signInFix(email,password){const r=await fetchWithTimeout(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.msg||d.message||d.error_description||d.error||'E-mail ou senha inválidos');if(!d?.access_token)throw new Error('Sessão não retornada pelo Supabase');if(typeof saveSession==='function')saveSession(d);else{const expiresAt=Math.floor(Date.now()/1000)+Number(d.expires_in||3600);localStorage.setItem('cinetracker_session',JSON.stringify({...d,expires_at:expiresAt}))}try{ctSession={...d,expires_at:Math.floor(Date.now()/1000)+Number(d.expires_in||3600)};currentUser=d.user||currentUser}catch{}persistNativeSession(d);return d}
function goHomeFix(){try{if(typeof view!=='undefined')view='home';if(typeof cloudConnected!=='undefined')cloudConnected=true;if(typeof render==='function'){render();window.scrollTo(0,0);return}if(window.ct97Navigate?.('home'))return;if(window.ct95Navigate?.('home'))return}catch{}location.hash='';}
async function handleAuthSubmit(ev){const form=ev.target.closest?.('.auth-card form');if(!form)return;let mode='signin';try{if(typeof authMode!=='undefined')mode=authMode}catch{}if(mode!=='signin')return;ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();if(form.dataset.loading==='1')return;const email=($('input[type="email"]',form)?.value||'').trim(),password=$('input[type="password"]',form)?.value||'';setAuthError('');if(!email||!password){setAuthError('Informe e-mail e senha.');setLoginLoading(false);return}setLoginLoading(true);try{await signInFix(email,password);setAuthError('');goHomeFix()}catch(e){setAuthError(e?.message||'Falha ao entrar. Tente novamente.')}finally{setLoginLoading(false)}}
document.addEventListener('submit',handleAuthSubmit,true);
function recoverStuckAuth(){const form=$('.auth-card form');if(!form)return;const btn=$('.auth-submit',form)||$('button[type="submit"]',form);if(btn?.disabled||form.dataset.loading==='1')setLoginLoading(false)}
setInterval(recoverStuckAuth,4000);
async function restoreSavedSessionFix(){let raw;try{raw=localStorage.getItem('cinetracker_session');if(!raw)return false;const saved=JSON.parse(raw);if(!saved?.access_token)return false;const r=await fetchWithTimeout(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${saved.access_token}`}},8000);if(!r.ok)return false;const u=await r.json();try{ctSession=saved;currentUser=u}catch{}persistNativeSession(saved);goHomeFix();return true}catch{return false}}
setTimeout(()=>{const app=$('#app');if(!app)return;if($('.auth-card')){recoverStuckAuth();restoreSavedSessionFix().catch(()=>{})}},300);
setTimeout(()=>{if(!$('.app')&&!$('.auth-card')&&typeof renderAuth==='function'){try{renderAuth()}catch{}}recoverStuckAuth()},9000);
function footerFix(){const host=$('.content');if(!host)return;$$('.ct097-fix-version',host).slice(1).forEach(x=>x.remove());let f=$('.ct097-fix-version',host);if(!f){f=document.createElement('div');f.className='ct097-fix-version';f.style.cssText='text-align:center;color:#71808b;font-size:11px;margin:26px 0 8px';host.appendChild(f)}f.textContent='CineTracker • v0.0.97 FIX';$$('[class*="version"]',host).forEach(x=>{if(x!==f&&/CineTracker.*(?:v|0\.0\.)\d+/i.test(x.textContent||''))x.style.display='none'})}
window.ct097FixNavigate=function(target){try{if(window.ct97Navigate?.(target)){setTimeout(footerFix,50);return true}}catch{}return false};
window.addEventListener('cinetracker:data-changed',()=>setTimeout(footerFix,60));
const mo=new MutationObserver(()=>footerFix());mo.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(footerFix,100);
})();
