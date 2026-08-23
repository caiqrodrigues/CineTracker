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
import java.util.Locale;
import java.util.Set;

public class NotificationWorker extends Worker {
    static final String PREFS = "cinetracker_native";
    static final String CHANNEL_ID = "cinetracker_releases";
    private static final String SUPABASE_URL = "https://pjmkxryboypluleuuupp.supabase.co";
    private static final String SUPABASE_KEY = "sb_publishable_UERbQXkZk4rnnu6Y8XJSgw_vcZd_V_Q";
    private static final int NOTIFICATION_SCHEMA = 3;

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters params) { super(context, params); }

    @NonNull @Override public Result doWork() {
        try {
            SharedPreferences prefs = getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String token = prefs.getString("access_token", null);
            if (token == null || token.isEmpty()) return Result.success();

            URL url = new URL(SUPABASE_URL + "/rest/v1/rpc/cinetracker_due_notifications");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(12000);
            conn.setReadTimeout(12000);
            conn.setRequestProperty("apikey", SUPABASE_KEY);
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) { os.write("{}".getBytes(StandardCharsets.UTF_8)); }
            int code = conn.getResponseCode();
            if (code < 200 || code >= 300) return Result.retry();

            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line; while ((line = br.readLine()) != null) sb.append(line);
            }

            JSONArray rows = new JSONArray(sb.toString());
            ensureChannel();

            Set<String> delivered = new HashSet<>(prefs.getStringSet("delivered_notifications_v3", new HashSet<>()));
            Set<String> current = new HashSet<>();
            boolean firstRunOnSchema = prefs.getInt("notification_schema", 0) < NOTIFICATION_SCHEMA;

            for (int i = 0; i < rows.length(); i++) {
                JSONObject row = rows.getJSONObject(i);
                String eventKey = clean(row.optString("event_key", ""));
                String title = clean(row.optString("title", "CineTracker"));
                String message = clean(row.optString("message", "Novo conteúdo disponível"));
                String canonical = canonical(row, eventKey, title, message);
                if (canonical.isEmpty() || current.contains(canonical)) continue;
                current.add(canonical);

                // Ao migrar a regra de deduplicação, o backlog atual vira baseline e não é notificado novamente.
                if (firstRunOnSchema) {
                    delivered.add(canonical);
                    continue;
                }
                if (delivered.contains(canonical)) continue;

                show(title, message, canonical.hashCode());
                delivered.add(canonical);
            }

            prefs.edit()
                    .putInt("notification_schema", NOTIFICATION_SCHEMA)
                    .putStringSet("delivered_notifications_v3", new HashSet<>(delivered))
                    .apply();
            return Result.success();
        } catch (Exception e) {
            return Result.retry();
        }
    }

    private static String canonical(JSONObject row, String eventKey, String title, String message) {
        String tmdb = clean(row.optString("tmdb_id", ""));
        String season = clean(row.optString("season_number", row.optString("season", "")));
        String episode = clean(row.optString("episode_number", row.optString("episode", "")));
        String date = clean(row.optString("air_date", row.optString("release_date", row.optString("event_date", ""))));
        String media = clean(row.optString("media_type", row.optString("kind", "")));
        if (!tmdb.isEmpty() || !season.isEmpty() || !episode.isEmpty() || !date.isEmpty()) {
            return String.join("|", media, tmdb, season, episode, date, normalize(title));
        }
        if (!eventKey.isEmpty()) return "event|" + normalize(eventKey);
        return "text|" + normalize(title) + "|" + normalize(message);
    }

    private static String normalize(String value) {
        return clean(value).toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    }

    private static String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Lançamentos e episódios", NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("Filmes da Watchlist e novos episódios de séries acompanhadas");
            nm.createNotificationChannel(channel);
        }
    }

    private void show(String title, String message, int id) {
        Context c = getApplicationContext();
        Intent intent = new Intent(c, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(c, id, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(c, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setAutoCancel(true)
                .setContentIntent(pi)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setOnlyAlertOnce(true);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(id, b.build());
    }
}
