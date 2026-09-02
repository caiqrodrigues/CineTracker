import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099724.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r196-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.25: embedded r196 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r196-android-login-shell-fix';"))throw new Error('Android 0.99.7.25 requires 0.99.7.24 runtime');
if(!js.includes("setTimeout(()=>void checkRelease161('boot'),2500);"))throw new Error('Android 0.99.7.25 expected Web release checker missing');
if(!js.includes("location.replace(u.toString())"))throw new Error('Android 0.99.7.25 expected Web auto-refresh hazard missing');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.25 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r197-auth-isolation.js'),'utf8');
js=js.replace("const REVISION='r196-android-login-shell-fix';","const REVISION='r197-android-auth-runtime-isolation';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.25-r197-auth-runtime-isolation';
window.__ctAndroidWebRevision='r195-no-dorama-sports-profile-density';
window.__ctAndroidPortedWebRange='r190-r195';
window.__ctAndroidLoginFix='embedded-runtime-no-web-auto-refresh';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r197-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.24-r196-login-shell-fix','android-v0.99.7.25-r197-auth-runtime-isolation');
html=html.replace('name="ct-android-v099724" content="r196-login-shell-fix"','name="ct-android-v099725" content="r197-auth-runtime-isolation"');
for(const m of [
  'android-v0.99.7.25-r197-auth-runtime-isolation','r197-android-auth-runtime-isolation',
  'disable-web-release-refresh-and-service-worker','embedded-apk-never-reloads-from-web-release-json',
  'unregister-web-service-workers','embedded-runtime-no-web-auto-refresh','auth-success-mount-home-shell-before-fast-paint',
  'r190-r195-mobile-equivalents','asian-scripted-tv-excluded-from-foryou','ct-sports-sync-v4+ct-sports-search-v2'
])if(!html.includes(m))throw new Error('Android 0.99.7.25 missing '+m);
await writeFile(indexPath,html,'utf8');

/* Native belt-and-suspenders: same-host main-frame navigations must stay inside the
   currently loaded bundled runtime. Never call loadBundledWeb() as a response to a
   Web-origin location.replace(), because that resets the login document. */
const activityPath=resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
let activity=await readFile(activityPath,'utf8');
const oldBlock=`                if (host.equals("mycinetracker.vercel.app")) {
                    if (request.isForMainFrame()) {
                        loadBundledWeb();
                        return true;
                    }
                    return false;
                }`;
const newBlock=`                if (host.equals("mycinetracker.vercel.app")) {
                    if (request.isForMainFrame()) {
                        String path = uri.getEncodedPath();
                        if (path == null || path.isEmpty()) path = "/";
                        final String routePath = JSONObject.quote(path);
                        view.evaluateJavascript("(function(){try{history.replaceState({},''," + routePath + ");if(typeof render==='function')void render();}catch(e){}})();", null);
                        return true;
                    }
                    return false;
                }`;
if(!activity.includes(oldBlock))throw new Error('Android 0.99.7.25 native same-host reload block missing');
activity=activity.replace(oldBlock,newBlock);
await writeFile(activityPath,activity,'utf8');
console.log('ANDROID_099725_READY base=099724 auth=isolated web-release=disabled service-worker=unregistered native-same-host=no-reload');
