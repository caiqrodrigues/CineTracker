(() => {
'use strict';
if(window.__ct0997R150bLoaded)return;
window.__ct0997R150bLoaded=true;
window.__ct0997R150b='r150b-realtime-sync';
window.__ctWebRevision='r150b';

const TABLES=[
  ['media_overrides','profile_id'],
  ['episode_progress','profile_id'],
  ['watch_history','profile_id'],
  ['watch_play_events_v0994','profile_id'],
  ['favorite_actors','user_id'],
  ['profiles','id']
];
const state={socket:null,topic:'',joinRef:null,ref:0,heartbeat:0,reconnect:0,retry:0,userId:'',token:'',status:'idle',lastEvent:null,lastRefresh:0};
const nextRef=()=>String(++state.ref);
const localDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function session(){
  try{if(typeof ctSession!=='undefined'&&ctSession?.access_token)return ctSession}catch{}
  try{return JSON.parse(localStorage.getItem('cinetracker_session')||'null')||null}catch{return null}
}
function jwtSub(token){
  try{let s=String(token||'').split('.')[1]||'';s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return JSON.parse(atob(s))?.sub||''}catch{return''}
}
function userId(s){
  try{if(typeof currentUser!=='undefined'&&currentUser?.id)return String(currentUser.id)}catch{}
  return String(s?.user?.id||jwtSub(s?.access_token)||'');
}
function baseUrl(){try{if(typeof SUPABASE_URL!=='undefined')return String(SUPABASE_URL||'')}catch{}return String(window.SUPABASE_URL||'')}
function apiKey(){try{if(typeof SUPABASE_KEY!=='undefined')return String(SUPABASE_KEY||'')}catch{}return String(window.SUPABASE_KEY||'')}
function clearSharedCaches(){
  try{localStorage.removeItem('ct0994_home_preload_v1')}catch{}
  try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(/home|profile|discover|calendar|watchlist/i.test(k))sessionStorage.removeItem(k)}}catch{}
  try{window.__ct0994PreloadedHome=null;window.__ct0997PreloadedHomeLive=null}catch{}
}
async function warmHome(){
  const p=window.__ct0997PersistentPreloadRpc;
  const raw=typeof p?.__ct0997Raw==='function'?p.__ct0997Raw.bind(p):null;
  const rpc=raw||(typeof window.sbRpc==='function'?window.sbRpc:null);
  if(!rpc)return;
  await Promise.allSettled([
    rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()}),
    rpc('cinetracker_profile_home_payload_v0997_r3',{p_today:localDay()})
  ]);
}
let refreshTimer=0;
function dispatchFresh(reason,payload=null){
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r150b',reason,local_date:localDay(),payload}}));
}
function revalidate(reason='manual',force=false,payload=null){
  clearTimeout(refreshTimer);
  const wait=force?0:180;
  refreshTimer=setTimeout(async()=>{
    const now=Date.now();if(!force&&now-state.lastRefresh<500)return;
    state.lastRefresh=now;clearSharedCaches();
    try{await warmHome()}catch{}
    dispatchFresh(reason,payload);
    try{if(typeof window.__ct150EnsureDiscover==='function')window.__ct150EnsureDiscover(true)}catch{}
  },wait);
}
function stopTimers(){clearInterval(state.heartbeat);clearTimeout(state.reconnect);state.heartbeat=0;state.reconnect=0}
function disconnect(reason='manual'){
  stopTimers();const ws=state.socket;state.socket=null;state.topic='';state.joinRef=null;state.status='closed';
  if(ws){try{ws.onclose=null;ws.onerror=null;ws.close(1000,reason)}catch{}}
}
function send(topic,event,payload={},joinRef=state.joinRef){
  const ws=state.socket;if(!ws||ws.readyState!==WebSocket.OPEN)return false;
  try{ws.send(JSON.stringify([joinRef,nextRef(),topic,event,payload]));return true}catch{return false}
}
function scheduleReconnect(){
  clearTimeout(state.reconnect);if(document.visibilityState==='hidden')return;
  const delay=[1000,2000,5000,10000,15000][Math.min(state.retry++,4)];
  state.reconnect=setTimeout(()=>connect(true),delay);
}
function parseFrame(data){
  try{const m=JSON.parse(data);if(Array.isArray(m))return{join_ref:m[0],ref:m[1],topic:m[2],event:m[3],payload:m[4]};return m||{}}catch{return{}}
}
function connect(force=false){
  if(typeof WebSocket!=='function')return false;
  const s=session(),token=String(s?.access_token||''),uid=userId(s),base=baseUrl(),key=apiKey();
  if(!token||!uid||!base||!key){disconnect('no-session');return false}
  const same=state.userId===uid&&state.token===token;
  if(!force&&same&&state.socket&&(state.socket.readyState===WebSocket.OPEN||state.socket.readyState===WebSocket.CONNECTING))return true;
  disconnect('reconnect');state.userId=uid;state.token=token;state.status='connecting';
  const wsUrl=`${base.replace(/^http/i,'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(key)}&vsn=2.0.0`;
  const ws=new WebSocket(wsUrl);state.socket=ws;
  ws.onopen=()=>{
    if(state.socket!==ws)return;state.status='joining';state.retry=0;state.topic=`realtime:cinetracker-user-${uid}`;state.joinRef=nextRef();
    const postgres_changes=TABLES.map(([table,column])=>({event:'*',schema:'public',table,filter:`${column}=eq.${uid}`}));
    ws.send(JSON.stringify([state.joinRef,state.joinRef,state.topic,'phx_join',{config:{broadcast:{ack:false,self:false},presence:{enabled:false},postgres_changes},access_token:token,private:false}]));
    state.heartbeat=setInterval(()=>{if(state.socket===ws&&ws.readyState===WebSocket.OPEN){try{ws.send(JSON.stringify([null,nextRef(),'phoenix','heartbeat',{}]))}catch{}}},20000);
  };
  ws.onmessage=e=>{
    if(state.socket!==ws)return;const m=parseFrame(e.data),event=String(m.event||'');
    if(event==='phx_reply'&&m.ref===state.joinRef){state.status=m.payload?.status==='ok'?'subscribed':'error';if(state.status==='error')scheduleReconnect();return}
    if(event==='postgres_changes'){
      const d=m.payload?.data||m.payload||{};state.lastEvent={table:d.table||'',type:d.type||d.eventType||'',at:Date.now()};
      revalidate('realtime',false,{table:state.lastEvent.table,type:state.lastEvent.type});return;
    }
    if(event==='phx_error'||event==='phx_close'){state.status='error';scheduleReconnect()}
  };
  ws.onerror=()=>{if(state.socket===ws)state.status='error'};
  ws.onclose=()=>{if(state.socket!==ws)return;stopTimers();state.socket=null;state.status='closed';scheduleReconnect()};
  return true;
}
function refreshTokenOrReconnect(){
  const s=session(),token=String(s?.access_token||''),uid=userId(s);
  if(!token||!uid){disconnect('signed-out');return}
  if(uid!==state.userId){connect(true);return}
  if(token!==state.token){state.token=token;if(!send(state.topic,'access_token',{access_token:token}))connect(true)}
}
function foreground(reason){refreshTokenOrReconnect();connect();revalidate(reason,true)}
window.addEventListener('focus',()=>foreground('window-focus'));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)foreground('visibility-active')});
window.addEventListener('online',()=>foreground('online'));
window.addEventListener('cinetracker:app-foreground',()=>foreground('android-foreground'));
for(const name of['cinetracker:auth-state-change','cinetracker:auth-state-changed'])window.addEventListener(name,()=>setTimeout(()=>foreground('auth-state'),50));
window.addEventListener('cinetracker:data-changed',e=>{if(e?.detail?.source!=='r150b')clearSharedCaches()});
window.addEventListener('beforeunload',()=>disconnect('unload'));
window.__ct150bRealtime={connect:()=>connect(true),disconnect,revalidate:(reason='diagnostic')=>revalidate(reason,true),get status(){return state.status},get userId(){return state.userId},get lastEvent(){return state.lastEvent}};
for(const d of[50,300,1000,3000])setTimeout(()=>{connect();if(d===300)revalidate('r150b-app-load',true)},d);
})();
