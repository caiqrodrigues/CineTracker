package com.cinetracker.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
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

        getWindow().setStatusBarColor(Color.rgb(9, 9, 9));
        getWindow().setNavigationBarColor(Color.rgb(9, 9, 9));
        getWindow().getDecorView().setSystemUiVisibility(0);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);

        webView.setOnApplyWindowInsetsListener((view, insets) -> {
            int top;
            int bottom;
            int left;
            int right;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars());
                top = bars.top;
                bottom = bars.bottom;
                left = bars.left;
                right = bars.right;
            } else {
                top = insets.getSystemWindowInsetTop();
                bottom = insets.getSystemWindowInsetBottom();
                left = insets.getSystemWindowInsetLeft();
                right = insets.getSystemWindowInsetRight();
            }
            view.setPadding(left, top, right, bottom);
            return insets;
        });

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/0.0.10");

        webView.setInitialScale(100);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(false);
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
                view.evaluateJavascript(androidMobileUiScript(), null);
            }
        });

        if (savedInstanceState == null) {
            String separator = BuildConfig.WEB_URL.contains("?") ? "&" : "?";
            webView.loadUrl(BuildConfig.WEB_URL + separator + "android=1");
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private String androidMobileUiScript() {
        return "(function(){" +
                "var meta=document.querySelector('meta[name=viewport]');" +
                "if(!meta){meta=document.createElement('meta');meta.name='viewport';document.head.appendChild(meta);}" +
                "meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';" +
                "document.documentElement.classList.add('ct-android');" +
                "document.body.classList.add('ct-android');" +
                "document.documentElement.style.touchAction='pan-y';" +
                "if(!document.getElementById('ct-android-style')){" +
                "var s=document.createElement('style');s.id='ct-android-style';s.textContent=`" +
                "html,body{width:100%;max-width:100%;overflow-x:hidden!important;background:#090909!important;}" +
                "body{padding:0!important;margin:0!important;}" +
                ".app{display:block!important;grid-template-columns:1fr!important;min-height:100vh!important;width:100%!important;}" +
                ".sidebar{display:none!important;}" +
                ".content{width:100%!important;max-width:none!important;margin:0!important;padding:14px 12px 104px!important;overflow-x:hidden!important;}" +
                ".cloud-bar{margin:0 0 12px!important;padding:8px 10px!important;font-size:11px!important;border-radius:10px!important;}" +
                ".cloud-bar>span:last-child{display:none!important;}" +
                ".header{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important;margin-bottom:16px!important;}" +
                ".h1{font-size:22px!important;line-height:1.16!important;margin:3px 0 5px!important;}" +
                ".subtitle{font-size:12px!important;line-height:1.45!important;}" +
                ".section{margin-bottom:18px!important;}" +
                ".section-title{align-items:flex-start!important;gap:8px!important;margin-bottom:9px!important;}" +
                ".section-title h2{font-size:16px!important;}" +
                ".grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;}" +
                ".card,.feature,.panel,.metric{border-radius:13px!important;}" +
                ".card{min-width:0!important;}" +
                ".poster,.tmdb-poster{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/3!important;padding:8px!important;background-size:cover!important;background-position:center!important;}" +
                ".card-body{padding:9px!important;min-height:0!important;}" +
                ".card h3{font-size:14px!important;line-height:1.25!important;margin:0 0 5px!important;}" +
                ".media-meta{font-size:10.5px!important;gap:4px!important;line-height:1.3!important;}" +
                ".cast{font-size:10px!important;line-height:1.35!important;margin-top:6px!important;}" +
                ".availability{font-size:10px!important;line-height:1.35!important;margin-top:6px!important;padding-top:6px!important;}" +
                ".availability small{font-size:8.5px!important;}" +
                ".card-footer{padding-top:8px!important;}" +
                ".rating-row{font-size:11px!important;}" +
                ".card-actions{gap:5px!important;margin-top:7px!important;display:grid!important;grid-template-columns:1fr!important;}" +
                ".card-actions button{width:100%!important;min-width:0!important;font-size:10.5px!important;padding:8px 5px!important;min-height:38px!important;}" +
                ".feature{display:grid!important;grid-template-columns:88px minmax(0,1fr)!important;gap:10px!important;padding:10px!important;}" +
                ".feature .poster,.feature .tmdb-poster{width:88px!important;height:132px!important;aspect-ratio:auto!important;border-radius:10px!important;}" +
                ".feature h2{font-size:18px!important;margin:6px 0!important;}" +
                ".feature .availability{font-size:9.5px!important;}" +
                ".actions{gap:6px!important;margin-top:8px!important;}" +
                ".actions button,.btn-primary,.btn-secondary{min-height:42px!important;font-size:12px!important;padding:9px 10px!important;}" +
                ".metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;}" +
                ".metric{padding:11px!important;}" +
                ".metric strong{font-size:20px!important;}" +
                ".list-item{gap:8px!important;padding:10px 0!important;align-items:center!important;}" +
                ".search{display:grid!important;grid-template-columns:1fr auto!important;gap:7px!important;}" +
                ".search input{min-width:0!important;height:44px!important;}" +
                ".drop-zone{padding:22px 12px!important;}" +
                ".person-panel{padding:10px!important;}" +
                ".person-filmography{grid-template-columns:1fr!important;}" +
                ".mobile-nav{display:none!important;}" +
                ".toast{left:12px!important;right:12px!important;bottom:84px!important;max-width:none!important;}" +
                ".ct-bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:2147483640;height:72px;background:rgba(9,9,9,.98);border-top:1px solid #292929;display:grid;grid-template-columns:repeat(5,1fr);padding:7px 6px 9px;box-shadow:0 -8px 30px rgba(0,0,0,.35);}" +
                ".ct-bottom-nav button{appearance:none;border:0;background:transparent;color:#aaa;border-radius:10px;font-size:10px;line-height:1.15;padding:5px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:0;}" +
                ".ct-bottom-nav button .ct-ico{font-size:19px;line-height:1;}" +
                ".ct-bottom-nav button.ct-active{color:#58a6ff;background:#0f1c2a;}" +
                ".ct-more-sheet{position:fixed;z-index:2147483641;left:10px;right:10px;bottom:78px;background:#111;border:1px solid #303842;border-radius:16px;padding:8px;display:none;box-shadow:0 20px 60px #000;}" +
                ".ct-more-sheet.ct-open{display:grid;gap:6px;}" +
                ".ct-more-sheet button{appearance:none;border:1px solid #29323d;background:#0d141c;color:#eee;border-radius:12px;padding:13px 14px;text-align:left;font-size:14px;}" +
                "@media(max-width:360px){.content{padding-left:9px!important;padding-right:9px!important}.grid{gap:7px!important}.card-body{padding:7px!important}.cast,.availability{font-size:9px!important}.ct-bottom-nav button{font-size:9px!important}}" +
                "`;document.head.appendChild(s);}" +
                "function txt(el){return ((el&&el.textContent)||'').trim();}" +
                "function allNavButtons(){return Array.prototype.slice.call(document.querySelectorAll('button[data-view],.sidebar button,.nav button'));}" +
                "function clickMatch(words){var bs=allNavButtons();for(var i=0;i<bs.length;i++){var t=txt(bs[i]).toLowerCase();for(var j=0;j<words.length;j++){if(t.indexOf(words[j])>=0){bs[i].click();return true;}}}return false;}" +
                "function normalizeLabels(){var els=document.querySelectorAll('a,button,span,div');for(var i=0;i<els.length;i++){if(txt(els[i])==='Conta')els[i].textContent='Configurações';}}" +
                "function makeButton(label,icon,words,key){var b=document.createElement('button');b.type='button';b.dataset.ctkey=key;b.innerHTML='<span class=\"ct-ico\">'+icon+'</span><span>'+label+'</span>';b.onclick=function(){document.querySelector('.ct-more-sheet')?.classList.remove('ct-open');clickMatch(words);setTimeout(syncActive,60);};return b;}" +
                "function syncActive(){var nav=document.querySelector('.ct-bottom-nav');if(!nav)return;var active=Array.prototype.slice.call(document.querySelectorAll('button[data-view].active,.nav button.active'));var text=active.map(txt).join(' ').toLowerCase();var key=text.indexOf('biblioteca')>=0?'library':text.indexOf('descob')>=0?'discover':text.indexOf('estat')>=0||text.indexOf('stats')>=0?'stats':text.indexOf('config')>=0||text.indexOf('conta')>=0||text.indexOf('perfil')>=0||text.indexOf('hist')>=0||text.indexOf('import')>=0?'more':'home';nav.querySelectorAll('button').forEach(function(b){b.classList.toggle('ct-active',b.dataset.ctkey===key);});}" +
                "function buildNav(){if(document.querySelector('.ct-bottom-nav')){syncActive();return;}var nav=document.createElement('nav');nav.className='ct-bottom-nav';nav.appendChild(makeButton('Home','⌂',['home','hoje'],'home'));nav.appendChild(makeButton('Biblioteca','▤',['biblioteca'],'library'));nav.appendChild(makeButton('Descobrir','✦',['descobrir'],'discover'));nav.appendChild(makeButton('Stats','◫',['estatísticas','estatisticas','stats'],'stats'));var more=document.createElement('button');more.type='button';more.dataset.ctkey='more';more.innerHTML='<span class=\"ct-ico\">☰</span><span>Mais</span>';more.onclick=function(){document.querySelector('.ct-more-sheet')?.classList.toggle('ct-open');};nav.appendChild(more);document.body.appendChild(nav);var sheet=document.createElement('div');sheet.className='ct-more-sheet';sheet.appendChild(makeButton('Configurações','⚙',['configurações','configuracoes','conta'],'more'));sheet.appendChild(makeButton('Histórico','◷',['histórico','historico'],'more'));sheet.appendChild(makeButton('Perfil','●',['perfil'],'more'));sheet.appendChild(makeButton('Importar dados','⇧',['importar'],'more'));document.body.appendChild(sheet);syncActive();}" +
                "normalizeLabels();buildNav();" +
                "var mo=new MutationObserver(function(){normalizeLabels();buildNav();});mo.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});" +
                "})();";
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()};
        fileChooserCallback.onReceiveValue(result);
        fileChooserCallback = null;
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript("(function(){var s=document.querySelector('.ct-more-sheet.ct-open');if(s){s.classList.remove('ct-open');return 'closed';}return 'open';})()", value -> {
                if ("\"closed\"".equals(value)) return;
                if (webView.canGoBack()) webView.goBack();
                else MainActivity.super.onBackPressed();
            });
        } else {
            super.onBackPressed();
        }
    }
}
