package com.cinetracker.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import android.Manifest;
import android.content.Context;
import android.webkit.WebView;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.GrantPermissionRule;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class V95LoginBaselineTest {
    @Rule
    public GrantPermissionRule notificationPermission = GrantPermissionRule.grant(Manifest.permission.POST_NOTIFICATIONS);

    private ActivityScenario<MainActivity> scenario;
    private String baselineHtml;

    @Before
    public void setUp() throws Exception {
        Context testContext = InstrumentationRegistry.getInstrumentation().getContext();
        try (InputStream in = testContext.getAssets().open("v95/index.html"); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
            baselineHtml = out.toString(StandardCharsets.UTF_8.name());
        }
        scenario = ActivityScenario.launch(MainActivity.class);
        loadExactV95();
    }

    @After
    public void tearDown() {
        if (scenario != null) scenario.close();
    }

    private void loadExactV95() throws Exception {
        scenario.onActivity(activity -> {
            WebView web = activity.findViewById(R.id.webview);
            web.stopLoading();
            web.loadDataWithBaseURL(
                "https://mycinetracker.vercel.app/",
                baselineHtml,
                "text/html",
                "UTF-8",
                "https://mycinetracker.vercel.app/?baseline=v95"
            );
        });
        assertTrue("A tela de login da v95 não renderizou", waitForJs(
            "!!document.querySelector('#auth-form') && document.body.innerText.includes('Entrar no CineTracker')",
            15000
        ));
    }

    private String eval(String expression) throws Exception {
        AtomicReference<String> result = new AtomicReference<>("null");
        CountDownLatch latch = new CountDownLatch(1);
        scenario.onActivity(activity -> {
            WebView web = activity.findViewById(R.id.webview);
            web.evaluateJavascript(expression, value -> {
                result.set(value);
                latch.countDown();
            });
        });
        assertTrue("evaluateJavascript excedeu o tempo", latch.await(8, TimeUnit.SECONDS));
        return result.get();
    }

    private boolean waitForJs(String predicate, long timeoutMs) throws Exception {
        long deadline = System.currentTimeMillis() + timeoutMs;
        while (System.currentTimeMillis() < deadline) {
            if ("true".equals(eval("(function(){try{return !!(" + predicate + ");}catch(e){return false;}})();"))) return true;
            Thread.sleep(200);
        }
        return false;
    }

    @Test
    public void loginScreenActuallyRendersInAndroidWebView() throws Exception {
        assertTrue(waitForJs("!!document.querySelector('#auth-email') && !!document.querySelector('#auth-password')", 3000));
        assertEquals("\"0.0.95\"", eval("(window.__ctAndroidBuild || '')"));
    }

    @Test
    public void successfulSupabaseResponseReachesHome() throws Exception {
        String script = "(function(){" +
            "window.fetch=async function(url,options){" +
            "var u=String(url);" +
            "function resp(ok,status,payload,raw){return {ok:ok,status:status,json:async function(){return payload;},text:async function(){return raw!==undefined?raw:JSON.stringify(payload);},headers:{get:function(){return null;}}};}" +
            "if(u.indexOf('/auth/v1/token?grant_type=password')>=0)return resp(true,200,{access_token:'v95-test-token',refresh_token:'v95-refresh',expires_in:3600,user:{id:'v95-user',email:'baseline@cinetracker.test'}});" +
            "if(u.indexOf('/rest/v1/')>=0)return resp(true,200,[],'[]');" +
            "if(u.indexOf('/functions/v1/tmdb-proxy')>=0)return resp(true,200,{results:[],cast:[],crew:[]});" +
            "return resp(true,200,{results:[]});" +
            "};" +
            "document.querySelector('#auth-email').value='baseline@cinetracker.test';" +
            "document.querySelector('#auth-password').value='baseline-password';" +
            "document.querySelector('#auth-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));" +
            "return true;})();";
        assertEquals("true", eval(script));
        assertTrue("A v95 recebeu sessão válida mas não chegou à Home", waitForJs(
            "typeof currentUser!=='undefined' && currentUser && currentUser.id==='v95-user' && typeof view!=='undefined' && view==='home' && !document.querySelector('#auth-form')",
            12000
        ));
    }

    @Test
    public void invalidCredentialsKeepFormAndTypedValues() throws Exception {
        String script = "(function(){" +
            "window.fetch=async function(url){" +
            "var u=String(url);" +
            "if(u.indexOf('/auth/v1/token?grant_type=password')>=0)return {ok:false,status:400,json:async function(){return {message:'Invalid login credentials'};},text:async function(){return '{\\\"message\\\":\\\"Invalid login credentials\\\"}';}};" +
            "return {ok:true,status:200,json:async function(){return {};},text:async function(){return '[]';}};" +
            "};" +
            "document.querySelector('#auth-email').value='typed@example.com';" +
            "document.querySelector('#auth-password').value='typed-password';" +
            "document.querySelector('#auth-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));" +
            "return true;})();";
        assertEquals("true", eval(script));
        assertTrue(waitForJs("document.querySelector('#auth-error').innerText.includes('Invalid login credentials')", 5000));
        assertEquals("\"typed@example.com\"", eval("document.querySelector('#auth-email').value"));
        assertEquals("\"typed-password\"", eval("document.querySelector('#auth-password').value"));
        assertTrue(waitForJs("!!document.querySelector('#auth-form')", 1000));
    }
}
