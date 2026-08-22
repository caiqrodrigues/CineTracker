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
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/0.0.13");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) settings.setOffscreenPreRaster(true);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(true);
        webView.setOnTouchListener((v, event) -> event.getPointerCount() > 1);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
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
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost() == null ? "" : uri.getHost();
                if (host.equals("mycinetracker.vercel.app") || host.endsWith("supabase.co")) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                view.evaluateJavascript(androidPhoneLayoutScript(), null);
                CookieManager.getInstance().flush();
            }
        });

        bindNativeNavigation();
        if (savedInstanceState == null) {
            String separator = BuildConfig.WEB_URL.contains("?") ? "&" : "?";
            webView.loadUrl(BuildConfig.WEB_URL + separator + "android=1&ui=phone");
        } else webView.restoreState(savedInstanceState);
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
        String direct = directView == null ? "" :
                "try{view='" + directView + "';render();window.scrollTo(0,0);return true;}catch(e){}";
        String js = "(function(){" + direct +
                "var words=" + words + ";var els=[].slice.call(document.querySelectorAll('button[data-view],.nav button,.sidebar button,a'));" +
                "for(var i=0;i<els.length;i++){var t=((els[i].textContent||'').trim()).toLowerCase();for(var j=0;j<words.length;j++){if(t.indexOf(words[j])>=0){els[i].click();window.scrollTo(0,0);return true;}}}return false;})();";
        webView.evaluateJavascript(js, null);
    }

    private String androidPhoneLayoutScript() {
        return "(function(){" +
                "var meta=document.querySelector('meta[name=viewport]');if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta);}" +
                "meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';" +
                "document.documentElement.classList.add('ct-android-phone');document.body.classList.add('ct-android-phone');" +
                "if(!document.getElementById('ct-android-phone-style')){var s=document.createElement('style');s.id='ct-android-phone-style';s.textContent=`" +
                "html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important;}" +
                "body{margin:0!important;padding:0!important;}*{max-width:100%;}.app{display:block!important;grid-template-columns:1fr!important;width:100%!important;min-width:0!important;min-height:100%!important;}" +
                ".sidebar,.mobile-nav,.ct-bottom-nav,.ct-more-sheet,.cloud-bar{display:none!important;}" +
                ".content{box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:12px 12px 20px!important;overflow-x:hidden!important;}" +
                ".header{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important;margin-bottom:16px!important;}.h1{font-size:22px!important;line-height:1.18!important;margin:3px 0 5px!important;}.subtitle{font-size:12px!important;line-height:1.4!important;}" +
                ".section{margin-bottom:18px!important;}.section-title{align-items:flex-start!important;margin-bottom:9px!important;}.section-title h2{font-size:16px!important;}" +
                ".grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;width:100%!important;}.card,.feature,.panel,.metric{min-width:0!important;border-radius:13px!important;overflow:hidden!important;}" +
                ".poster,.tmdb-poster{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center 18%!important;padding:8px!important;}" +
                ".card-body{padding:9px!important;min-height:0!important;}.card h3{font-size:14px!important;line-height:1.25!important;margin:0 0 5px!important;word-break:break-word!important;}.media-meta{font-size:10.5px!important;line-height:1.3!important;gap:4px!important;}" +
                ".cast{font-size:10px!important;line-height:1.35!important;margin-top:6px!important;}.availability{font-size:10px!important;line-height:1.35!important;margin-top:6px!important;padding-top:6px!important;}.availability small{font-size:8.5px!important;}" +
                ".card-footer{padding-top:8px!important;}.rating-row{font-size:11px!important;}.card-actions{display:grid!important;grid-template-columns:1fr!important;gap:5px!important;margin-top:7px!important;}.card-actions button{width:100%!important;min-width:0!important;min-height:38px!important;padding:8px 5px!important;font-size:10.5px!important;}" +
                ".feature{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:10px!important;padding:10px!important;width:100%!important;}.feature .poster,.feature .tmdb-poster{width:92px!important;height:138px!important;aspect-ratio:auto!important;border-radius:10px!important;}.feature h2{font-size:18px!important;line-height:1.2!important;margin:5px 0!important;}" +
                ".actions{gap:6px!important;margin-top:8px!important;}.actions button,.btn-primary,.btn-secondary{min-height:42px!important;padding:9px 10px!important;font-size:12px!important;}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;}.metric{padding:11px!important;}.metric strong{font-size:20px!important;}" +
                ".search{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:7px!important;}.search input{min-width:0!important;height:44px!important;}.list-item{gap:8px!important;padding:10px 0!important;align-items:center!important;}.person-filmography{grid-template-columns:1fr!important;}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important;}img,video,canvas,svg{max-width:100%!important;height:auto;}" +
                "@media(max-width:360px){.content{padding-left:9px!important;padding-right:9px!important}.grid{gap:7px!important}.card-body{padding:7px!important}.cast,.availability{font-size:9px!important}}`;
                document.head.appendChild(s);}" +
                "document.querySelectorAll('.cloud-bar').forEach(function(x){x.style.display='none';});" +
                "})();";
    }

    @Override protected void onSaveInstanceState(Bundle outState) { webView.saveState(outState); super.onSaveInstanceState(outState); }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) { super.onActivityResult(requestCode, resultCode, data); if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return; Uri[] result = null; if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()}; fileChooserCallback.onReceiveValue(result); fileChooserCallback = null; }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
