package com.cinetracker.app;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Base64;
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
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1002;
    private static final int EXPORT_FILE_REQUEST = 1003;
    private static final String APP_VERSION = BuildConfig.VERSION_NAME;
    private static final String LOCAL_WEB_ASSET = "hotfix5/index.html";
    private static final String IMPORT_PREFS = "cinetracker_hotfix15_import";
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private String currentPickerSlot;
    private byte[] pendingExportBytes;
    private String pendingExportName;
    private String pendingExportMime;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) getWindow().setDecorFitsSystemWindows(true);
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        getWindow().setStatusBarColor(Color.rgb(9, 9, 9));
        getWindow().setNavigationBarColor(Color.rgb(9, 9, 9));
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        webView.setVisibility(View.VISIBLE);
        webView.setBackgroundColor(Color.rgb(9, 9, 9));
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
                currentPickerSlot = "legacy";
                launchImportPicker("legacy");
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost() == null ? "" : uri.getHost();
                if (host.equals("mycinetracker.vercel.app")) {
                    if (request.isForMainFrame()) {
                        loadBundledWeb();
                        return true;
                    }
                    return false;
                }
                if (host.endsWith("supabase.co")) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }

            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                applyAndroidBase();
                CookieManager.getInstance().flush();
                if (hasPendingImportFlow()) {
                    view.postDelayed(() -> view.evaluateJavascript("window.ct15Navigate&&window.ct15Navigate('settings')", null), 250);
                    view.postDelayed(() -> view.evaluateJavascript("window.ct15EnhanceNativePicker&&window.ct15EnhanceNativePicker();window.ct15RestoreNativeFiles&&window.ct15RestoreNativeFiles()", null), 850);
                } else {
                    view.postDelayed(() -> view.evaluateJavascript("window.ct15RestoreNativeFiles&&window.ct15RestoreNativeFiles()", null), 350);
                }
            }
        });

        bindNativeNavigation();
        requestNotificationPermission();
        loadBundledWeb();
    }

    private SharedPreferences importPrefs() {
        return getSharedPreferences(IMPORT_PREFS, MODE_PRIVATE);
    }

    private boolean hasPendingImportFlow() {
        SharedPreferences prefs = importPrefs();
        String slot = prefs.getString("picker_slot", "");
        if (slot != null && !slot.isEmpty()) return true;
        for (String key : new String[]{"library_path", "watches_path", "package_path"}) {
            String path = prefs.getString(key, "");
            if (path != null && !path.isEmpty() && new File(path).isFile()) return true;
        }
        return false;
    }

    private String runtimeUrl() {
        String separator = BuildConfig.WEB_URL.contains("?") ? "&" : "?";
        return BuildConfig.WEB_URL + separator + "android=1&ui=phone&apk=" + BuildConfig.VERSION_CODE + "&release=hotfix15&runtime=embedded";
    }

    private void loadBundledWeb() {
        try (InputStream in = getAssets().open(LOCAL_WEB_ASSET); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int read;
            while ((read = in.read(buf, 0, buf.length)) != -1) out.write(buf, 0, read);
            String html = new String(out.toByteArray(), StandardCharsets.UTF_8);
            String baseUrl = runtimeUrl();
            webView.loadDataWithBaseURL(baseUrl, html, "text/html", "UTF-8", baseUrl);
        } catch (Exception error) {
            showEmbeddedRuntimeFailure();
        }
    }

    private void showEmbeddedRuntimeFailure() {
        if (webView == null) return;
        String baseUrl = runtimeUrl();
        String html = "<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>CineTracker HOTFIX 15</title></head><body style='margin:0;background:#090909;color:#f4f4f5;font-family:system-ui;padding:24px'><h2>CineTracker HOTFIX 15</h2><p>O runtime interno do APK não pôde ser aberto.</p><p>Reinstale esta mesma versão. O aplicativo não carregará uma versão remota diferente como fallback.</p></body></html>";
        webView.loadDataWithBaseURL(baseUrl, html, "text/html", "UTF-8", baseUrl);
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
        String js = "(function(){try{var t='" + target + "';if(window.ct15Navigate){window.ct15Navigate(t);return true;}if(window.ct14Navigate){window.ct14Navigate(t);return true;}if(window.ct95Navigate&&window.ct95Navigate(t))return true;if(window.ct94Navigate&&window.ct94Navigate(t))return true;if(window.ct93Navigate&&window.ct93Navigate(t))return true;if(window.ct92Navigate&&window.ct92Navigate(t))return true;if(window.ct91Navigate&&window.ct91Navigate(t))return true;if(window.ct90Navigate&&window.ct90Navigate(t))return true;if(window.ct89Navigate&&window.ct89Navigate(t))return true;if(window.ct88Navigate&&window.ct88Navigate(t))return true;view=t;if(typeof render==='function'){render();window.scrollTo(0,0);return true;}if(window.ct66Navigate)return !!window.ct66Navigate(t);return false;}catch(e){return false;}})();";
        webView.evaluateJavascript(js, null);
    }

    private void applyAndroidBase() {
        if (webView == null) return;
        String js = "(function(){var m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';if(!document.getElementById('ct97-base')){var s=document.createElement('style');s.id='ct97-base';s.textContent='html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;-webkit-text-size-adjust:100%!important}body{margin:0!important}.app{display:block!important;width:100%!important;min-width:0!important}.sidebar,.mobile-nav,.cloud-bar{display:none!important}.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:14px 12px 20px!important;overflow-x:hidden!important}.toast{left:12px!important;right:12px!important;bottom:12px!important;max-width:none!important}';document.head.appendChild(s);}window.__ctAndroidBuild='" + APP_VERSION + "';})();";
        webView.evaluateJavascript(js, null);
    }

    private void launchImportPicker(String slot) {
        currentPickerSlot = slot == null ? "legacy" : slot;
        importPrefs().edit().putString("picker_slot", currentPickerSlot).apply();
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, "legacy".equals(currentPickerSlot));
        startActivityForResult(intent, FILE_CHOOSER_REQUEST);
    }

    private String displayName(Uri uri) {
        String name = null;
        try (Cursor cursor = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) name = cursor.getString(idx);
            }
        } catch (Exception ignored) { }
        if (name == null || name.trim().isEmpty()) name = uri.getLastPathSegment();
        return (name == null || name.trim().isEmpty()) ? "import.csv" : name;
    }

    private boolean cacheImportFile(String slot, Uri uri) {
        if (!("library".equals(slot) || "watches".equals(slot) || "package".equals(slot)) || uri == null) return false;
        File file = new File(getFilesDir(), "ct15-import-" + slot + ".bin");
        try (InputStream in = getContentResolver().openInputStream(uri); FileOutputStream out = new FileOutputStream(file, false)) {
            if (in == null) return false;
            byte[] buf = new byte[8192]; int read;
            while ((read = in.read(buf)) != -1) out.write(buf, 0, read);
            out.flush();
            String mime = getContentResolver().getType(uri);
            if (mime == null || mime.isEmpty()) mime = "application/octet-stream";
            importPrefs().edit()
                .putString(slot + "_path", file.getAbsolutePath())
                .putString(slot + "_name", displayName(uri))
                .putString(slot + "_mime", mime)
                .remove("picker_slot")
                .apply();
            return true;
        } catch (Exception ignored) { return false; }
    }

    private String cachedImportBase64(String slot) {
        String path = importPrefs().getString(slot + "_path", "");
        if (path == null || path.isEmpty()) return "";
        File file = new File(path); if (!file.isFile()) return "";
        try (FileInputStream in = new FileInputStream(file); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192]; int read;
            while ((read = in.read(buf)) != -1) out.write(buf, 0, read);
            return Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP);
        } catch (Exception ignored) { return ""; }
    }

    private void notifyNativeImportReady() {
        if (webView == null) return;
        webView.postDelayed(() -> webView.evaluateJavascript("window.ct15Navigate&&window.ct15Navigate('settings')", null), 80);
        webView.postDelayed(() -> webView.evaluateJavascript("window.ct15EnhanceNativePicker&&window.ct15EnhanceNativePicker();window.ct15RestoreNativeFiles&&window.ct15RestoreNativeFiles()", null), 420);
    }

    private void clearCachedImportFiles() {
        SharedPreferences prefs = importPrefs();
        for (String slot : new String[]{"library", "watches", "package"}) {
            String path = prefs.getString(slot + "_path", "");
            if (path != null && !path.isEmpty()) { try { new File(path).delete(); } catch (Exception ignored) { } }
        }
        prefs.edit().clear().apply();
    }

    public class AndroidBridge {
        @JavascriptInterface public void appReady() {
            runOnUiThread(() -> { if (webView != null) webView.setVisibility(View.VISIBLE); });
        }
        @JavascriptInterface public String getAppVersion() { return APP_VERSION; }
        @JavascriptInterface public void pickImportFile(String slot) { runOnUiThread(() -> launchImportPicker(slot)); }
        @JavascriptInterface public String getImportFileName(String slot) { return importPrefs().getString(slot + "_name", ""); }
        @JavascriptInterface public String getImportFileMime(String slot) { return importPrefs().getString(slot + "_mime", "application/octet-stream"); }
        @JavascriptInterface public String getImportFileBase64(String slot) { return cachedImportBase64(slot); }
        @JavascriptInterface public void clearImportFiles() { clearCachedImportFiles(); }

        @JavascriptInterface public void saveSession(String json) {
            try {
                JSONObject obj = new JSONObject(json == null ? "{}" : json);
                String token = obj.optString("access_token", "");
                if (token.isEmpty()) return;
                Context context = MainActivity.this.getApplicationContext();
                context.getSharedPreferences(NotificationWorker.PREFS, Context.MODE_PRIVATE).edit().putString("access_token", token).apply();
                PeriodicWorkRequest periodic = new PeriodicWorkRequest.Builder(NotificationWorker.class, 1, TimeUnit.HOURS).build();
                WorkManager.getInstance(context).enqueueUniquePeriodicWork("cinetracker_release_notifications", ExistingPeriodicWorkPolicy.KEEP, periodic);
            } catch (Exception ignored) { }
        }

        @JavascriptInterface public void exportBackup(String name, String base64, String mime) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                runOnUiThread(() -> {
                    pendingExportBytes = bytes;
                    pendingExportName = (name == null || name.isEmpty()) ? "cinetracker-backup-v97-hotfix15.json" : name;
                    pendingExportMime = (mime == null || mime.isEmpty()) ? "application/octet-stream" : mime;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType(pendingExportMime);
                    intent.putExtra(Intent.EXTRA_TITLE, pendingExportName);
                    startActivityForResult(intent, EXPORT_FILE_REQUEST);
                });
            } catch (Exception ignored) { }
        }
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript("(function(){try{return !!(window.ct48Back&&window.ct48Back());}catch(e){return false;}})();", value -> {
            if ("true".equals(value)) return;
            if (webView.canGoBack()) webView.goBack();
            else MainActivity.super.onBackPressed();
        });
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == EXPORT_FILE_REQUEST) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingExportBytes != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    if (out != null) { out.write(pendingExportBytes); out.flush(); }
                } catch (Exception ignored) { }
            }
            pendingExportBytes = null; pendingExportName = null; pendingExportMime = null; return;
        }
        if (requestCode != FILE_CHOOSER_REQUEST) return;

        ArrayList<Uri> uris = new ArrayList<>();
        if (resultCode == RESULT_OK && data != null) {
            if (data.getData() != null) uris.add(data.getData());
            ClipData clip = data.getClipData();
            if (clip != null) for (int i = 0; i < clip.getItemCount(); i++) {
                Uri u = clip.getItemAt(i).getUri(); if (u != null && !uris.contains(u)) uris.add(u);
            }
        }

        String slot = currentPickerSlot;
        if (slot == null || slot.isEmpty()) slot = importPrefs().getString("picker_slot", "");
        if (!uris.isEmpty() && ("library".equals(slot) || "watches".equals(slot) || "package".equals(slot))) {
            if (cacheImportFile(slot, uris.get(0))) notifyNativeImportReady();
        }

        if (fileChooserCallback != null) {
            Uri[] result = uris.isEmpty() ? null : uris.toArray(new Uri[0]);
            fileChooserCallback.onReceiveValue(result);
            fileChooserCallback = null;
        }
        currentPickerSlot = null;
        if (uris.isEmpty()) importPrefs().edit().remove("picker_slot").apply();
    }
}
