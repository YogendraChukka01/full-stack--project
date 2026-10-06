package com.surplusfood.platform.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    @ConditionalOnProperty(name = "app.firebase.enabled", havingValue = "true")
    public FirebaseAuth firebaseAuth() throws IOException {
        String configuredPath = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
        if (configuredPath != null && !configuredPath.isBlank()) {
            FirebaseApp firebaseApp = getOrInitializeAppFromFile(configuredPath);
            return FirebaseAuth.getInstance(firebaseApp);
        }

        if (new ClassPathResource("firebase-service-account.json").exists()) {
            FirebaseApp firebaseApp = getOrInitializeAppFromFile("classpath:firebase-service-account.json");
            return FirebaseAuth.getInstance(firebaseApp);
        }

        throw new IllegalStateException("Firebase is enabled but no service account credentials were found.");
    }

    private FirebaseApp getOrInitializeAppFromFile(String path) throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream credentialsStream;
        if (path.startsWith("classpath:")) {
            credentialsStream = new ClassPathResource(path.replace("classpath:", "")).getInputStream();
        } else {
            credentialsStream = java.nio.file.Files.newInputStream(java.nio.file.Path.of(path));
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
