(() => {
'use strict';
window.__ctAndroidBuild='0.0.90';
if(window.__ct90Loaded)return;
fetch('/patch-v060-v090.js',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('v90 '+r.status);return r.text()}).then(code=>(0,eval)(code)).catch(()=>{});
})();
