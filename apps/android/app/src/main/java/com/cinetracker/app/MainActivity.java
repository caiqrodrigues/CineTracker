package com.cinetracker.app;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1002;
    private static final String APP_VERSION = "0.0.74";
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;

    @Override protected void onCreate(Bundle savedInstanceState) {
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
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setLoadsImagesAutomatically(true);
        settings.setBlockNetworkImage(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " CineTrackerAndroid/" + APP_VERSION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) settings.setOffscreenPreRaster(true);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(true);
        webView.setOnTouchListener((v, event) -> event.getPointerCount() > 1);
        webView.addJavascriptInterface(new AndroidBridge(this), "CineTrackerNative");

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
                applyAndroidBase();
                applyStableModules();
                CookieManager.getInstance().flush();
            }
        });

        bindNativeNavigation();
        requestNotificationPermission();
        if (savedInstanceState == null) {
            String separator = BuildConfig.WEB_URL.contains("?") ? "&" : "?";
            webView.loadUrl(BuildConfig.WEB_URL + separator + "android=1&ui=phone&apk=74");
        } else {
            webView.restoreState(savedInstanceState);
            webView.postDelayed(() -> { applyAndroidBase(); applyStableModules(); }, 180);
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
        }
    }

    private void bindNativeNavigation() {
        findViewById(R.id.nav_home).setOnClickListener(v -> navigate("home"));
        findViewById(R.id.nav_library).setOnClickListener(v -> navigate("library"));
        findViewById(R.id.nav_discover).setOnClickListener(v -> navigate("discover"));
        findViewById(R.id.nav_history).setOnClickListener(v -> navigate("history"));
        findViewById(R.id.nav_profile).setOnClickListener(v -> navigate("profile"));
        findViewById(R.id.nav_settings).setOnClickListener(v -> navigate("settings"));
    }

    private void navigate(String target) {
        String js = "(function(){try{" +
                "if(window.ct71Navigate&&window.ct71Navigate('" + target + "'))return true;" +
                "if(window.ct48Navigate&&window.ct48Navigate('" + target + "'))return true;" +
                "if(window.ct47Navigate&&window.ct47Navigate('" + target + "'))return true;" +
                "view='" + target + "';render();window.scrollTo(0,0);return true;" +
                "}catch(e){return false;}})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidBase() {
        if (webView == null) return;
        String js = "(function(){" +
                "var m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';" +
                "if(!document.getElementById('ct48-base')){var s=document.createElement('style');s.id='ct48-base';s.textContent='html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:14px 12px 20px!important;overflow-x:hidden!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}';document.head.appendChild(s);}" +
                "window.__ctAndroidBuild='0.0.74';" +
                "})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyStableModules() {
        String[] assets = {"ct41.js", "ct47.js", "ct48.js", "ct49.js", "ct50.js", "ct51.js", "ct58.js", "ct59.js", "ct60.js"};
        for (String asset : assets) applyAsset(asset);
    }

    private void applyAsset(String asset) {
        try (InputStream in = getAssets().open(asset)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192]; int read;
            while ((read = in.read(buf, 0, buf.length)) != -1) out.write(buf, 0, read);
            webView.evaluateJavascript(new String(out.toByteArray(), StandardCharsets.UTF_8), null);
        } catch (Exception ignored) { }
    }

    public static class AndroidBridge {
        private final Context context;
        AndroidBridge(Context context) { this.context = context.getApplicationContext(); }

        @JavascriptInterface public void saveSession(String json) {
            try {
                JSONObject obj = new JSONObject(json == null ? "{}" : json);
                String token = obj.optString("access_token", "");
                if (token.isEmpty()) return;
                context.getSharedPreferences(NotificationWorker.PREFS, Context.MODE_PRIVATE).edit().putString("access_token", token).apply();
                PeriodicWorkRequest periodic = new PeriodicWorkRequest.Builder(NotificationWorker.class, 1, TimeUnit.HOURS).build();
                WorkManager.getInstance(context).enqueueUniquePeriodicWork("cinetracker_release_notifications", ExistingPeriodicWorkPolicy.KEEP, periodic);
            } catch (Exception ignored) { }
        }
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState); super.onSaveInstanceState(outState);
    }

    @Override public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript("(function(){try{return !!(window.ct48Back&&window.ct48Back());}catch(e){return false;}})();", value -> {
            if ("true".equals(value)) return;
            if (webView.canGoBack()) webView.goBack(); else MainActivity.super.onBackPressed();
        });
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()};
        fileChooserCallback.onReceiveValue(result); fileChooserCallback = null;
    }
}
