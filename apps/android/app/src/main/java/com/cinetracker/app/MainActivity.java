package com.cinetracker.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getWindow().setDecorFitsSystemWindows(true);
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        getWindow().setStatusBarColor(Color.rgb(9, 9, 9));
        getWindow().setNavigationBarColor(Color.rgb(9, 9, 9));
        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.webview);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setBlockNetworkImage(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/0.0.27");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) settings.setOffscreenPreRaster(true);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(true);
        webView.setOnTouchListener((v, event) -> event.getPointerCount() > 1);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileChooserCallback != null) fileChooserCallback.onReceiveValue(null);
                fileChooserCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "application/zip", "application/octet-stream"});
                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost() == null ? "" : uri.getHost();
                if (host.equals("mycinetracker.vercel.app") || host.endsWith("supabase.co")) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                applyAndroidRuntime();
                CookieManager.getInstance().flush();
            }
        });

        bindNativeNavigation();
        if (savedInstanceState == null) {
            String separator = BuildConfig.WEB_URL.contains("?") ? "&" : "?";
            webView.loadUrl(BuildConfig.WEB_URL + separator + "android=1&ui=phone&apk=27");
        } else {
            webView.restoreState(savedInstanceState);
            webView.postDelayed(this::applyAndroidRuntime, 150);
        }
    }

    private void bindNativeNavigation() {
        findViewById(R.id.nav_home).setOnClickListener(v -> navigateView("home", "home", "hoje"));
        findViewById(R.id.nav_library).setOnClickListener(v -> navigateView("library", "assistir", "biblioteca"));
        findViewById(R.id.nav_discover).setOnClickListener(v -> navigateView("discover", "descobrir"));
        findViewById(R.id.nav_history).setOnClickListener(v -> navigateView("history", "histórico", "historico"));
        findViewById(R.id.nav_profile).setOnClickListener(v -> navigateView("profile", "perfil"));
        findViewById(R.id.nav_settings).setOnClickListener(v -> openSettings());
    }

    private void openSettings() {
        String js = "(function(){" +
                "try{view='account';render();window.scrollTo(0,0);setTimeout(function(){if(window.ctAndroid27)window.ctAndroid27();},0);return true;}catch(e){}" +
                "var hidden=document.getElementById('ct40-settings-target');if(hidden){hidden.click();window.scrollTo(0,0);return true;}" +
                "var exact=document.querySelector('[data-view=account],[data-view=settings]');if(exact){exact.click();window.scrollTo(0,0);return true;}" +
                "var els=[].slice.call(document.querySelectorAll('button,a'));for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').trim().toLowerCase();if(t==='configurações'||t==='configuracoes'){els[i].click();window.scrollTo(0,0);return true;}}return false;})();";
        webView.evaluateJavascript(js, null);
    }

    private void navigateView(String directView, String... terms) {
        StringBuilder words = new StringBuilder("[");
        for (int i = 0; i < terms.length; i++) {
            if (i > 0) words.append(',');
            words.append('\'').append(terms[i].replace("'", "\\'").toLowerCase()).append('\'');
        }
        words.append(']');
        String direct = directView == null ? "" : "try{view='" + directView + "';render();window.scrollTo(0,0);if(window.ctAndroid27)window.ctAndroid27();return true;}catch(e){}";
        String js = "(function(){" + direct +
                "var words=" + words + ";var els=[].slice.call(document.querySelectorAll('button[data-view],.nav button,.sidebar button,a'));" +
                "for(var i=0;i<els.length;i++){var t=((els[i].textContent||'').trim()).toLowerCase();for(var j=0;j<words.length;j++){if(t.indexOf(words[j])>=0){els[i].click();window.scrollTo(0,0);setTimeout(function(){if(window.ctAndroid27)window.ctAndroid27();},0);return true;}}}return false;})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidRuntime() {
        if (webView == null) return;
        webView.evaluateJavascript(androidRuntimeScript(), null);
    }

    private String androidRuntimeScript() {
        return "(function(){" +
                "var meta=document.querySelector('meta[name=viewport]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta);}meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';" +
                "if(!document.getElementById('ct-android27-style')){var s=document.createElement('style');s.id='ct-android27-style';s.textContent=`" +
                "html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:12px 12px 18px!important;overflow-x:hidden!important}.header{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:8px!important}.grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.card,.feature,.panel,.metric{min-width:0!important;border-radius:12px!important;overflow:hidden!important}.poster,.tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important}.card-body{padding:8px!important;min-height:0!important}.card h3{font-size:13px!important;line-height:1.2!important}.feature{display:grid!important;grid-template-columns:88px minmax(0,1fr)!important;gap:9px!important;padding:9px!important}.feature .poster,.feature .tmdb-poster{width:88px!important;height:132px!important;aspect-ratio:auto!important}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.card-actions{display:grid!important;grid-template-columns:1fr!important;gap:4px!important}.card-actions button{width:100%!important;min-height:34px!important;padding:6px!important;font-size:10px!important}.ct29-cast{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:112px!important;grid-template-columns:none!important;gap:8px!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;padding:0 0 7px!important;scroll-snap-type:x proximity}.ct29-person{width:112px!important;scroll-snap-align:start}.ct29-person-photo{aspect-ratio:3/4!important}.ct29-person-body{padding:6px!important}.ct29-person-body strong{font-size:10px!important}.ct29-person-body span{font-size:8px!important}.ct-home-trio{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;width:100%!important}.ct-home-trio .card{min-width:0!important}.ct-home-trio .poster,.ct-home-trio .tmdb-poster{aspect-ratio:2/3!important;min-height:0!important}.ct-home-trio .card-body{padding:6px!important}.ct-home-trio .card h3{font-size:10px!important;line-height:1.18!important;margin:0 0 4px!important}.ct-home-trio .media-meta{font-size:8px!important;gap:2px!important}.ct-home-trio .cast,.ct-home-trio .availability{display:none!important}.ct-home-trio .rating-row{font-size:9px!important}.ct-home-trio .card-actions{gap:3px!important;margin-top:5px!important}.ct-home-trio .card-actions button{min-height:29px!important;font-size:8px!important;padding:4px 2px!important}.ct-home-trio .eyebrow{font-size:8px!important}#ct30-follow-calendar{display:none!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}.ct41-stat{text-align:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}.ct41-stat span,.ct41-stat strong,.ct41-stat small{text-align:center!important;width:100%!important}.ct27-build{margin:28px 0 6px;padding:14px 0 4px;border-top:1px solid #252525;color:#7f8790;font-size:11px;text-align:center}`;document.head.appendChild(s);}" +
                "function isAuth(){return !!document.querySelector('.auth-page,#auth-form,#auth-email,#auth-password');}" +
                "function sectionByTitle(txt){return [].slice.call(document.querySelectorAll('.section')).find(function(sec){var h=sec.querySelector('.section-title h2,h2');return h&&h.textContent.trim().toLowerCase()===txt;});}" +
                "function markTrios(){var w=sectionByTitle('da sua watchlist');var n=sectionByTitle('fora da lista');[w,n].forEach(function(sec){if(!sec)return;var g=sec.querySelector('.grid');if(g)g.classList.add('ct-home-trio');});}" +
                "function normalizeType(x){var t=String(x&&x.type||'').toUpperCase();if(t.indexOf('ANIME')>=0)return 'ANIME';if(t.indexOf('FILME')>=0||t.indexOf('MOVIE')>=0)return 'FILME';return 'SÉRIE';}" +
                "function fixWatchlistPicker(){try{if(isAuth()||typeof currentWatchlistPicks!=='function'||typeof watchlist==='undefined'||typeof mediaRegistry==='undefined')return;if(window.__ct27Picker)return;window.__ct27Picker=1;currentWatchlistPicks=function(){var wanted=['FILME','SÉRIE','ANIME'];var ids=Array.from(watchlist||[]);var all=ids.map(function(id){return mediaRegistry.get(id);}).filter(Boolean);return wanted.map(function(type){return all.find(function(item){return normalizeType(item)===type;});}).filter(Boolean);};}catch(e){}}" +
                "function paintExistingPosters(){if(isAuth())return;try{document.querySelectorAll('.card,.feature,.ct38-card,.ct30-fav,.ct30-history-card').forEach(function(card){var p=card.querySelector('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster');if(!p)return;var mid=card.dataset.mediaId||'';var item=null;try{item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(mid):null;}catch(e){}var posterUrl=item&&item.posterUrl;if(posterUrl&&(!p.style.backgroundImage||p.style.backgroundImage==='none')){p.style.backgroundImage='url(\"'+posterUrl+'\")';p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%';}var h=card.querySelector('h3,h2,.ct38-title,.ct30-fav-body strong,.ct30-history-body strong');if(h&&item&&item.title&&(!h.textContent.trim()||/^tmdb\\s*#/i.test(h.textContent.trim())))h.textContent=item.title;});}catch(e){}}" +
                "var ct27Q=[],ct27Active=0,ct27Cache={};function ct27Pump(){while(ct27Active<3&&ct27Q.length){var job=ct27Q.shift();ct27Active++;Promise.resolve().then(job).catch(function(){}).finally(function(){ct27Active--;ct27Pump();});}}function ct27Enqueue(fn){ct27Q.push(fn);ct27Pump();}" +
                "function fastPosters(){if(isAuth())return;var cards=[].slice.call(document.querySelectorAll('.card,.feature,.ct38-card,.ct30-fav,.ct30-history-card')).filter(function(c){return !c.dataset.ct27Poster;}).slice(0,18);cards.forEach(function(card){var p=card.querySelector('.poster,.tmdb-poster,.ct38-poster,.ct30-fav-poster,.ct30-history-poster');if(!p)return;var rect=card.getBoundingClientRect();if(rect.bottom<-250||rect.top>innerHeight+450)return;var mid=card.dataset.mediaId||'';var item=null;try{item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(mid):null;}catch(e){}var id=Number((item&&item.tmdbId)||card.dataset.tmdbId||card.dataset.ct29Id||card.dataset.ct30Id||0),type=String((item&&item.apiType)||card.dataset.apiType||card.dataset.ct29Type||'').toLowerCase();var m=mid.match(/^tmdb-(movie|tv)-(\\d+)$/);if(!id&&m){type=m[1];id=Number(m[2]);}type=(type.indexOf('movie')>=0||type.indexOf('filme')>=0)?'movie':'tv';if(!id)return;card.dataset.ct27Poster='1';var key=type+':'+id;ct27Enqueue(async function(){try{var d=ct27Cache[key];if(!d){var raw=sessionStorage.getItem('ct27:'+key);if(raw){try{d=JSON.parse(raw);}catch(e){}}}if(!d){var u=new URL('https://pjmkxryboypluleuuupp.supabase.co/functions/v1/tmdb-proxy');u.searchParams.set('path','/'+type+'/'+id);u.searchParams.set('language','pt-BR');var headers=typeof authHeaders==='function'?authHeaders():{};var r=await fetch(u,{headers:headers});if(!r.ok)throw new Error('tmdb');d=await r.json();ct27Cache[key]=d;try{sessionStorage.setItem('ct27:'+key,JSON.stringify(d));}catch(e){}}var title=d.title||d.name;var h=card.querySelector('h3,h2,.ct38-title,.ct30-fav-body strong,.ct30-history-body strong');if(title&&h&&(!h.textContent.trim()||/^tmdb\\s*#/i.test(h.textContent.trim())))h.textContent=title;if(d.poster_path){p.style.backgroundImage='url(https://image.tmdb.org/t/p/w342'+d.poster_path+')';p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%';}}catch(e){card.dataset.ct27Poster='';}});});}" +
                "function buildFooter(){if(isAuth())return;var text=(document.body.textContent||'').toLowerCase();if(text.indexOf('importar')<0&&text.indexOf('segurança')<0&&text.indexOf('seguranca')<0)return;if(document.getElementById('ct27-build'))return;var host=document.querySelector('.content')||document.getElementById('app');if(!host)return;var f=document.createElement('div');f.id='ct27-build';f.className='ct27-build';f.textContent='CineTracker Android • build 0.0.27';host.appendChild(f);}" +
                "function removeHomeCalendar(){try{if(typeof view!=='undefined'&&view==='home'){var c=document.getElementById('ct30-follow-calendar');if(c)c.remove();}}catch(e){}}" +
                "window.ctAndroid27=function(){if(isAuth())return;fixWatchlistPicker();markTrios();paintExistingPosters();fastPosters();removeHomeCalendar();buildFooter();document.querySelectorAll('.cloud-bar').forEach(function(x){x.remove();});};" +
                "window.ctAndroid27();setTimeout(window.ctAndroid27,120);setTimeout(window.ctAndroid27,500);" +
                "if(!window.__ct27Observer){window.__ct27Observer=1;var q=false;new MutationObserver(function(){if(isAuth()||q)return;q=true;requestAnimationFrame(function(){q=false;window.ctAndroid27();});}).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});}" +
                "})();";
    }

    @Override protected void onSaveInstanceState(Bundle outState) { webView.saveState(outState); super.onSaveInstanceState(outState); }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) { super.onActivityResult(requestCode, resultCode, data); if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return; Uri[] result = null; if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()}; fileChooserCallback.onReceiveValue(result); fileChooserCallback = null; }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
