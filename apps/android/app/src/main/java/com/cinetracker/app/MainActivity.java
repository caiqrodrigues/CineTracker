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
import android.util.Base64;
import android.util.Log;
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
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1002;
    private static final int EXPORT_FILE_REQUEST = 1003;
    private static final String APP_VERSION = BuildConfig.VERSION_NAME;
    private static final String BUNDLED_INDEX = "hotfix3/index.html";
    private static final String STARTUP_TAG = "CineTrackerStartup";
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private byte[] pendingExportBytes;
    private String pendingExportName;
    private String pendingExportMime;
    private boolean startupVerified = false;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getWindow().setDecorFitsSystemWindows(true);
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        getWindow().setStatusBarColor(Color.rgb(9, 9, 9));
        getWindow().setNavigationBarColor(Color.rgb(9, 9, 9));
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        webView.setVisibility(View.VISIBLE);
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
        webView.addJavascriptInterface(new AndroidBridge(), "CineTrackerNative");
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
                CookieManager.getInstance().flush();
                verifyStartupRendered();
            }
        });

        bindNativeNavigation();
        requestNotificationPermission();
        if (savedInstanceState == null) loadBundledHotfix3();
        else {
            webView.restoreState(savedInstanceState);
            webView.postDelayed(this::verifyStartupRendered, 400);
        }
    }

    private String webBaseUrl() {
        String base = BuildConfig.WEB_URL == null ? "https://mycinetracker.vercel.app" : BuildConfig.WEB_URL.trim();
        return base.endsWith("/") ? base : base + "/";
    }

    private String readAssetText(String asset) throws Exception {
        try (InputStream in = getAssets().open(asset); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int read;
            while ((read = in.read(buf)) != -1) out.write(buf, 0, read);
            return out.toString(StandardCharsets.UTF_8.name());
        }
    }

    private void loadBundledHotfix3() {
        try {
            String html = readAssetText(BUNDLED_INDEX);
            String base = webBaseUrl();
            String history = base + "?android=1&ui=phone&apk=" + BuildConfig.VERSION_CODE + "&release=hotfix3";
            Log.i(STARTUP_TAG, "HOTFIX3_BUNDLE_LOAD");
            webView.loadDataWithBaseURL(base, html, "text/html", "UTF-8", history);
        } catch (Exception error) {
            Log.e(STARTUP_TAG, "HOTFIX3_BUNDLE_ERROR", error);
            showStartupError("Não foi possível abrir o HOTFIX 3 empacotado.");
        }
    }

    private void verifyStartupRendered() {
        if (startupVerified || webView == null) return;
        webView.postDelayed(() -> {
            if (startupVerified || webView == null) return;
            String js = "(function(){try{var b=document.querySelector('meta[name=cinetracker-android-bundle][content=\\\"hotfix3-v95-inline\\\"]');if(!b)return 'fail';if(document.querySelector('#auth-form'))return 'auth';var a=document.getElementById('app');var t=(a&&a.innerText||'').trim();if(document.querySelector('.content')||document.querySelector('.app')||t.length>20)return 'app';return 'fail';}catch(e){return 'fail';}})();";
            webView.evaluateJavascript(js, value -> {
                if ("\"auth\"".equals(value) || "\"app\"".equals(value)) {
                    startupVerified = true;
                    Log.i(STARTUP_TAG, "HOTFIX3_RENDER_OK:" + value);
                } else {
                    startupVerified = true;
                    Log.e(STARTUP_TAG, "HOTFIX3_RENDER_FAIL:" + value);
                    showStartupError("O HOTFIX 3 abriu, mas a interface da versão 0.0.95 não foi renderizada.");
                }
            });
        }, 1800);
    }

    private void showStartupError(String message) {
        if (webView == null) return;
        startupVerified = true;
        String safe = message.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
        String html = "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='margin:0;background:#090909;color:#f4f4f5;font-family:sans-serif;display:grid;place-items:center;min-height:100vh'><div style='max-width:420px;padding:28px;text-align:center'><h2>CineTracker</h2><p>" + safe + "</p></div></body></html>";
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
    }

    private void bindNativeNavigation() {
        findViewById(R.id.nav_home).setOnClickListener(v -> navigate("home"));
        findViewById(R.id.nav_discover).setOnClickListener(v -> navigate("discover"));
        findViewById(R.id.nav_history).setOnClickListener(v -> navigate("history"));
        findViewById(R.id.nav_profile).setOnClickListener(v -> navigate("profile"));
        findViewById(R.id.nav_settings).setOnClickListener(v -> navigate("settings"));
    }

    private void navigate(String target) {
        String js = "(function(){try{var t='" + target + "';if(window.ct95Navigate&&window.ct95Navigate(t))return true;if(window.ct94Navigate&&window.ct94Navigate(t))return true;if(window.ct93Navigate&&window.ct93Navigate(t))return true;if(window.ct92Navigate&&window.ct92Navigate(t))return true;if(window.ct91Navigate&&window.ct91Navigate(t))return true;if(window.ct90Navigate&&window.ct90Navigate(t))return true;if(window.ct89Navigate&&window.ct89Navigate(t))return true;if(window.ct88Navigate&&window.ct88Navigate(t))return true;view=t;if(typeof render==='function'){render();window.scrollTo(0,0);return true;}if(window.ct66Navigate)return !!window.ct66Navigate(t);return false;}catch(e){return false;}})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidBase() {
        if (webView == null) return;
        String js = "(function(){var m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';if(!document.getElementById('ct95-base')){var s=document.createElement('style');s.id='ct95-base';s.textContent='html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:14px 12px 20px!important;overflow-x:hidden!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}';document.head.appendChild(s);}window.__ctAndroidBuild='" + APP_VERSION + "';})();";
        webView.evaluateJavascript(js, null);
    }

    public class AndroidBridge {
        @JavascriptInterface public void appReady() { runOnUiThread(() -> { if (webView != null) webView.setVisibility(View.VISIBLE); }); }
        @JavascriptInterface public String getAppVersion() { return APP_VERSION; }
        @JavascriptInterface public void saveSession(String json) {
            try {
                JSONObject obj = new JSONObject(json == null ? "{}" : json);
                String token = obj.optString("access_token", "");
                if (token.isEmpty()) return;
                Context context = MainActivity.this.getApplicationContext();
                context.getSharedPreferences(NotificationWorker.PREFS, Context.MODE_PRIVATE).edit().putString("access_token", token).apply();
                PeriodicWorkRequest periodic = new PeriodicWorkRequest.Builder(NotificationWorker.class, 1, TimeUnit.HOURS).build();
                WorkManager.getInstance(context).enqueueUniquePeriodicWork("cinetracker_release_notifications", ExistingPeriodicWorkPolicy.KEEP, periodic);
            } catch (Exception ignored) {}
        }
        @JavascriptInterface public void exportBackup(String name, String base64, String mime) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                runOnUiThread(() -> {
                    pendingExportBytes = bytes;
                    pendingExportName = (name == null || name.isEmpty()) ? "cinetracker-backup-v97-hotfix3.json" : name;
                    pendingExportMime = (mime == null || mime.isEmpty()) ? "application/octet-stream" : mime;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType(pendingExportMime);
                    intent.putExtra(Intent.EXTRA_TITLE, pendingExportName);
                    startActivityForResult(intent, EXPORT_FILE_REQUEST);
                });
            } catch (Exception ignored) {}
        }
    }

    @Override protected void onSaveInstanceState(Bundle outState) { webView.saveState(outState); super.onSaveInstanceState(outState); }
    @Override public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript("(function(){try{return !!(window.ct48Back&&window.ct48Back());}catch(e){return false;}})();", value -> {
            if ("true".equals(value)) return;
            if (webView.canGoBack()) webView.goBack(); else MainActivity.super.onBackPressed();
        });
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == EXPORT_FILE_REQUEST) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingExportBytes != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    if (out != null) { out.write(pendingExportBytes); out.flush(); }
                } catch (Exception ignored) {}
            }
            pendingExportBytes = null; pendingExportName = null; pendingExportMime = null; return;
        }
        if (requestCode != FILE_CHOOSER_REQUEST || fileChooserCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null && data.getData() != null) result = new Uri[]{data.getData()};
        fileChooserCallback.onReceiveValue(result);
        fileChooserCallback = null;
    }
}
