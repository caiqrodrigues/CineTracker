package com.cinetracker.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

public class NotificationWorker extends Worker {
    static final String PREFS = "cinetracker_native";
    static final String CHANNEL_ID = "cinetracker_releases";
    private static final String SUPABASE_URL = "https://pjmkxryboypluleuuupp.supabase.co";
    private static final String SUPABASE_KEY = "sb_publishable_UERbQXkZk4rnnu6Y8XJSgw_vcZd_V_Q";
    private static final long DUPLICATE_WINDOW_MS = 7L * 24L * 60L * 60L * 1000L;

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters params) { super(context, params); }

    @NonNull @Override public Result doWork() {
        try {
            SharedPreferences prefs = getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String token = prefs.getString("access_token", null);
            if (token == null || token.isEmpty()) return Result.success();

            URL url = new URL(SUPABASE_URL + "/rest/v1/rpc/cinetracker_due_notifications");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST"); conn.setConnectTimeout(12000); conn.setReadTimeout(12000);
            conn.setRequestProperty("apikey", SUPABASE_KEY); conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/json"); conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) { os.write("{}".getBytes(StandardCharsets.UTF_8)); }
            if (conn.getResponseCode() < 200 || conn.getResponseCode() >= 300) return Result.retry();

            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line; while ((line = br.readLine()) != null) sb.append(line);
            }

            JSONArray rows = new JSONArray(sb.toString()); ensureChannel();
            long now = System.currentTimeMillis(); Set<String> runFingerprints = new HashSet<>();
            SharedPreferences.Editor editor = prefs.edit();
            for (int i = 0; i < rows.length(); i++) {
                JSONObject row = rows.getJSONObject(i);
                String eventKey = row.optString("event_key", "").trim();
                String title = row.optString("title", "CineTracker").trim();
                String message = row.optString("message", "Novo conteúdo disponível").trim();
                String fingerprint = (title + "\n" + message).toLowerCase().replaceAll("\\s+", " ").trim();
                String fpKey = "notified_fp_" + fingerprint.hashCode();
                long lastFp = prefs.getLong(fpKey, 0L);
                if (runFingerprints.contains(fingerprint)) continue;
                if (!eventKey.isEmpty() && prefs.getBoolean("notified_" + eventKey, false)) continue;
                if (lastFp > 0L && now - lastFp < DUPLICATE_WINDOW_MS) continue;
                runFingerprints.add(fingerprint);
                show(title, message, fingerprint.hashCode());
                if (!eventKey.isEmpty()) editor.putBoolean("notified_" + eventKey, true);
                editor.putLong(fpKey, now);
            }
            editor.apply();
            return Result.success();
        } catch (Exception e) { return Result.retry(); }
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Lançamentos e episódios", NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("Filmes da Watchlist e novos episódios de séries acompanhadas"); nm.createNotificationChannel(channel);
        }
    }

    private void show(String title, String message, int id) {
        Context c = getApplicationContext(); Intent intent = new Intent(c, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(c, id, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(c, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher).setContentTitle(title).setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message)).setAutoCancel(true)
                .setContentIntent(pi).setPriority(NotificationCompat.PRIORITY_DEFAULT).setOnlyAlertOnce(true);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE); nm.notify(id, b.build());
    }
}
