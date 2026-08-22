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
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final String APP_URL = "https://appassets.androidplatform.net/assets/index.html?android=1&ui=phone&apk=28";
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
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/0.0.28");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) settings.setOffscreenPreRaster(true);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(true);
        webView.setOnTouchListener((v, event) -> event.getPointerCount() > 1);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

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
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost() == null ? "" : uri.getHost();
                if (host.equals("appassets.androidplatform.net") || host.endsWith("supabase.co") || host.equals("image.tmdb.org")) return false;
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
        if (savedInstanceState == null) webView.loadUrl(APP_URL);
        else {
            webView.restoreState(savedInstanceState);
            webView.postDelayed(this::applyAndroidRuntime, 150);
        }
    }

    private void bindNativeNavigation() {
        findViewById(R.id.nav_home).setOnClickListener(v -> navigateView("home"));
        findViewById(R.id.nav_library).setOnClickListener(v -> navigateView("library"));
        findViewById(R.id.nav_discover).setOnClickListener(v -> navigateView("discover"));
        findViewById(R.id.nav_history).setOnClickListener(v -> navigateView("history"));
        findViewById(R.id.nav_profile).setOnClickListener(v -> navigateView("profile"));
        findViewById(R.id.nav_settings).setOnClickListener(v -> openSettings());
    }

    private void navigateView(String target) {
        String js = "(function(){if(document.querySelector('.auth-page'))return false;try{view='" + target + "';render();window.scrollTo(0,0);if(window.ctAndroid28)window.ctAndroid28();return true}catch(e){return false}})();";
        webView.evaluateJavascript(js, null);
    }

    private void openSettings() {
        String js = "(function(){if(document.querySelector('.auth-page'))return false;var b=document.getElementById('ct42-settings-bridge')||document.getElementById('ct40-settings-target');if(b){b.click();window.scrollTo(0,0);return true}for(var i=0;i<2;i++){try{view=i===0?'settings':'account';render();var t=(document.body.textContent||'').toLowerCase();if(t.indexOf('segurança e acesso')>=0||t.indexOf('importar e exportar')>=0){window.scrollTo(0,0);return true}}catch(e){}}return false})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidRuntime() {
        if (webView == null) return;
        webView.evaluateJavascript(androidRuntimeScript(), null);
    }

    private String androidRuntimeScript() {
        return "(function(){" +
                "var meta=document.querySelector('meta[name=viewport]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta)}meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';" +
                "if(!document.getElementById('ct-android28-style')){var s=document.createElement('style');s.id='ct-android28-style';s.textContent=`" +
                "html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:12px 12px 18px!important;overflow-x:hidden!important}.header{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:8px!important}.grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.card,.feature,.panel,.metric{min-width:0!important;border-radius:12px!important;overflow:hidden!important}.poster,.tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important}.feature{display:grid!important;grid-template-columns:88px minmax(0,1fr)!important;gap:9px!important;padding:9px!important}.feature .poster,.feature .tmdb-poster{width:88px!important;height:132px!important;aspect-ratio:auto!important}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}.ct-home-trio,.ct36-trio{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;width:100%!important}.ct-home-trio .card,.ct36-trio .card{min-width:0!important}.ct-home-trio .card h3,.ct36-trio .card h3{font-size:10px!important}.ct-home-trio .cast,.ct-home-trio .availability,.ct36-trio .cast,.ct36-trio .availability{display:none!important}.ct29-cast{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:112px!important;grid-template-columns:none!important;gap:8px!important;overflow-x:auto!important;padding-bottom:7px!important}.ct29-person{width:112px!important}.ct41-stat{text-align:center!important;align-items:center!important}.ct41-stat span,.ct41-stat strong,.ct41-stat small{text-align:center!important;width:100%!important}#ct30-follow-calendar{display:none!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}`;document.head.appendChild(s)}" +
                "function mark(){if(document.querySelector('.auth-page'))return;var secs=[].slice.call(document.querySelectorAll('.section'));secs.forEach(function(sec){var t=(sec.querySelector('.section-title h2')||{}).textContent||'';if(/Da sua Watchlist|Fora da lista/i.test(t)){var g=sec.querySelector('.grid');if(g)g.classList.add('ct-home-trio')}});var c=document.getElementById('ct30-follow-calendar');if(c&&typeof view!=='undefined'&&view==='home')c.remove()}" +
                "window.ctAndroid28=mark;window.ctAndroid21=mark;mark();setTimeout(mark,150);setTimeout(mark,600);" +
                "})();";
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()};
        fileChooserCallback.onReceiveValue(result);
        fileChooserCallback = null;
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
