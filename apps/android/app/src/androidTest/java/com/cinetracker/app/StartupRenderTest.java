package com.cinetracker.app;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import android.os.SystemClock;
import android.webkit.WebView;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class StartupRenderTest {
    @Test
    public void hotfix2ActuallyRendersLoginInAndroidWebView() throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> result = new AtomicReference<>();

        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            SystemClock.sleep(2500);
            scenario.onActivity(activity -> {
                WebView webView = activity.findViewById(R.id.webview);
                assertNotNull(webView);
                String js = "(function(){try{var form=document.querySelector('#auth-form');var buttons=Array.from(document.querySelectorAll('button'));var hasLogin=buttons.some(function(b){return (b.textContent||'').indexOf('Entrar no CineTracker')>=0;});return !!(form&&hasLogin&&window.__ctAuthRecovery==='v97-base');}catch(e){return false;}})();";
                webView.evaluateJavascript(js, value -> {
                    result.set(value);
                    latch.countDown();
                });
            });

            assertTrue("WebView did not answer startup probe", latch.await(10, TimeUnit.SECONDS));
            assertTrue("HOTFIX 2 did not render the login screen; probe=" + result.get(), "true".equals(result.get()));
        }
    }
}
