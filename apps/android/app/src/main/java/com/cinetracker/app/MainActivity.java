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
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/0.0.17");
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
            webView.loadUrl(BuildConfig.WEB_URL + separator + "android=1&ui=phone&apk=17");
        } else {
            webView.restoreState(savedInstanceState);
            webView.postDelayed(this::applyAndroidRuntime, 150);
        }
    }

    private void bindNativeNavigation() {
        findViewById(R.id.nav_home).setOnClickListener(v -> navigateView("home", "home", "hoje"));
        findViewById(R.id.nav_library).setOnClickListener(v -> navigateView("library", "biblioteca"));
        findViewById(R.id.nav_discover).setOnClickListener(v -> navigateView("discover", "descobrir"));
        findViewById(R.id.nav_history).setOnClickListener(v -> navigateView("history", "histórico", "historico"));
        findViewById(R.id.nav_profile).setOnClickListener(v -> navigateView("profile", "perfil"));
        findViewById(R.id.nav_stats).setOnClickListener(v -> navigateView("stats", "estatísticas", "estatisticas", "stats"));
        findViewById(R.id.nav_settings).setOnClickListener(v -> navigateView(null, "configurações", "configuracoes", "conta"));
    }

    private void navigateView(String directView, String... terms) {
        StringBuilder words = new StringBuilder("[");
        for (int i = 0; i < terms.length; i++) {
            if (i > 0) words.append(',');
            words.append('\'').append(terms[i].replace("'", "\\'").toLowerCase()).append('\'');
        }
        words.append(']');
        String direct = directView == null ? "" : "try{view='" + directView + "';render();window.scrollTo(0,0);if(window.ctAndroid17)window.ctAndroid17();return true;}catch(e){}";
        String js = "(function(){" + direct +
                "var words=" + words + ";var els=[].slice.call(document.querySelectorAll('button[data-view],.nav button,.sidebar button,a'));" +
                "for(var i=0;i<els.length;i++){var t=((els[i].textContent||'').trim()).toLowerCase();for(var j=0;j<words.length;j++){if(t.indexOf(words[j])>=0){els[i].click();window.scrollTo(0,0);setTimeout(function(){if(window.ctAndroid17)window.ctAndroid17();},0);return true;}}}return false;})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidRuntime() {
        if (webView == null) return;
        webView.evaluateJavascript(androidRuntimeScript(), null);
    }

    private String androidRuntimeScript() {
        return "(function(){" +
                "var meta=document.querySelector('meta[name=viewport]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta);}meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';" +
                "if(!document.getElementById('ct-android17-style')){var s=document.createElement('style');s.id='ct-android17-style';s.textContent=`" +
                "html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:12px 12px 18px!important;overflow-x:hidden!important}.header{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:8px!important}.grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.card,.feature,.panel,.metric{min-width:0!important;border-radius:12px!important;overflow:hidden!important}.poster,.tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important}.card-body{padding:8px!important;min-height:0!important}.card h3{font-size:13px!important;line-height:1.2!important}.feature{display:grid!important;grid-template-columns:88px minmax(0,1fr)!important;gap:9px!important;padding:9px!important}.feature .poster,.feature .tmdb-poster{width:88px!important;height:132px!important;aspect-ratio:auto!important}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.card-actions{display:grid!important;grid-template-columns:1fr!important;gap:4px!important}.card-actions button{width:100%!important;min-height:34px!important;padding:6px!important;font-size:10px!important}.ct29-cast{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:126px!important;grid-template-columns:none!important;gap:8px!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;padding:0 0 7px!important;scroll-snap-type:x proximity}.ct29-person{width:126px!important;scroll-snap-align:start}.ct29-person-photo{aspect-ratio:3/4!important}.ct29-person-body{padding:7px!important}.ct29-person-body strong{font-size:10px!important}.ct29-person-body span{font-size:8px!important}.ct-home-trio{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;width:100%!important}.ct-home-trio .card{min-width:0!important}.ct-home-trio .poster,.ct-home-trio .tmdb-poster{aspect-ratio:2/3!important;min-height:0!important}.ct-home-trio .card-body{padding:6px!important}.ct-home-trio .card h3{font-size:10px!important;line-height:1.18!important;margin:0 0 4px!important}.ct-home-trio .media-meta{font-size:8px!important;gap:2px!important}.ct-home-trio .cast,.ct-home-trio .availability{display:none!important}.ct-home-trio .rating-row{font-size:9px!important}.ct-home-trio .card-actions{gap:3px!important;margin-top:5px!important}.ct-home-trio .card-actions button{min-height:29px!important;font-size:8px!important;padding:4px 2px!important}.ct-home-trio .eyebrow{font-size:8px!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}`;document.head.appendChild(s);}" +
                "function sectionByTitle(txt){return [].slice.call(document.querySelectorAll('.section')).find(function(sec){var h=sec.querySelector('.section-title h2,h2');return h&&h.textContent.trim().toLowerCase()===txt;});}" +
                "function markTrios(){var w=sectionByTitle('da sua watchlist');var n=sectionByTitle('fora da lista');[w,n].forEach(function(sec){if(!sec)return;var g=sec.querySelector('.grid');if(g)g.classList.add('ct-home-trio');});}" +
                "function normalizeType(x){var t=String(x&&x.type||'').toUpperCase();if(t.indexOf('ANIME')>=0)return 'ANIME';if(t.indexOf('FILME')>=0||t.indexOf('MOVIE')>=0)return 'FILME';return 'SÉRIE';}" +
                "function fixWatchlistPicker(){try{if(typeof currentWatchlistPicks!=='function'||typeof watchlist==='undefined'||typeof mediaRegistry==='undefined')return;if(window.__ct17Picker)return;window.__ct17Picker=1;currentWatchlistPicks=function(){var wanted=['FILME','SÉRIE','ANIME'];var ids=Array.from(watchlist||[]);var all=ids.map(function(id){return mediaRegistry.get(id);}).filter(Boolean);return wanted.map(function(type){return all.find(function(item){return normalizeType(item)===type;});}).filter(Boolean);};if(typeof view!=='undefined'&&view==='home'&&typeof render==='function')render();}catch(e){}}" +
                "function paintExistingPosters(){try{document.querySelectorAll('.card').forEach(function(card){var p=card.querySelector('.poster');if(!p)return;var mid=card.dataset.mediaId||'';var item=null;try{item=typeof mediaRegistry!=='undefined'?mediaRegistry.get(mid):null;}catch(e){}var url=item&&item.posterUrl;if(url&&(!p.style.backgroundImage||p.style.backgroundImage==='none')){p.style.backgroundImage=\"linear-gradient(to top,rgba(0,0,0,.55),rgba(0,0,0,.02)),url('"+url+"')\";p.style.backgroundSize='cover';p.style.backgroundPosition='center 18%';}var h=card.querySelector('h3');if(h&&item&&item.title&&(!h.textContent.trim()||/^tmdb\s*#/i.test(h.textContent.trim())))h.textContent=item.title;});}catch(e){}}" +
                "window.ctAndroid17=function(){fixWatchlistPicker();markTrios();paintExistingPosters();document.querySelectorAll('.cloud-bar').forEach(function(x){x.remove();});};" +
                "window.ctAndroid17();setTimeout(window.ctAndroid17,120);setTimeout(window.ctAndroid17,600);" +
                "})();";
    }

    @Override protected void onSaveInstanceState(Bundle outState) { webView.saveState(outState); super.onSaveInstanceState(outState); }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) { super.onActivityResult(requestCode, resultCode, data); if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return; Uri[] result = null; if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()}; fileChooserCallback.onReceiveValue(result); fileChooserCallback = null; }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
