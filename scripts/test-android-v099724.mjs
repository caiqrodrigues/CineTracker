import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
for(const m of [
  'android-v0.99.7.24-r196-login-shell-fix',
  'auth-success-mount-home-shell-before-fast-paint',
  'session-success-home-shell-visible',
  'r190-r195-mobile-equivalents',
  'asian-scripted-tv-excluded-from-foryou',
  'ct-sports-sync-v4+ct-sports-search-v2'
])if(!html.includes(m))throw new Error('Android 0.99.7.24 test missing '+m);
const marker='<script data-ct-android="r196-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.24 embedded JS missing');
const js=html.slice(a+marker.length,b);
if(!js.includes("if(!document.querySelector('[data-home]'))"))throw new Error('login->Home shell guard missing');
if(!js.includes("setApp(shell("))throw new Error('Home shell mount missing');
if(!js.includes("return renderHomeR195(seq)"))throw new Error('fast Home delegation missing');
if(!js.includes("document.addEventListener('submit'"))throw new Error('login submit handler missing');
if(!js.includes("await login(f.email.value.trim(),f.password.value)"))throw new Error('password login flow missing');
if(!js.includes("history.replaceState({},'','/home')"))throw new Error('successful login route transition missing');
const tmp=resolve(root,'.tmp-android-v099724-bundle.js');
await writeFile(tmp,js,'utf8');
execFileSync(process.execPath,['--check',tmp],{cwd:root,stdio:'inherit'});
console.log('ANDROID_099724_TEST_OK login=auth-success-home-shell-mounted session=preserved r195=preserved');
