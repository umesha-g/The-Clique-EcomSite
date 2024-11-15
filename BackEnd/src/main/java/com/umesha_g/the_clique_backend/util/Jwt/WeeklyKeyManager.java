package com.umesha_g.the_clique_backend.util.Jwt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Base64;
import java.util.Locale;

@Slf4j
@Component
public class WeeklyKeyManager {
    private final JwtKeyRepository jwtKeyRepository;
    private volatile SecretKey currentKey;
    private volatile LocalDate lastGeneratedDate;

    @Autowired
    public WeeklyKeyManager(JwtKeyRepository jwtKeyRepository) {
        this.jwtKeyRepository = jwtKeyRepository;
        initializeKey();
    }

    private synchronized void initializeKey() {
        try {
            JwtKeyData storedKeyData = jwtKeyRepository.getStoredKey();
            LocalDate currentDate = LocalDate.now();

            if (storedKeyData == null || isNewWeek(storedKeyData.getLastGeneratedDate(), currentDate)) {
                regenerateKey(currentDate);
            } else {
                currentKey = decodeKey(storedKeyData.getSecretKey());
                lastGeneratedDate = storedKeyData.getLastGeneratedDate();
                log.info("Initialized with existing key generated on: {}", lastGeneratedDate);
            }
        } catch (Exception e) {
            log.error("Error initializing JWT key", e);
            throw new RuntimeException("Could not initialize JWT key", e);
        }
    }

    public synchronized SecretKey getWeeklyKey() {
        if (currentKey == null || isNewWeek(lastGeneratedDate, LocalDate.now())) {
            regenerateKey(LocalDate.now());
        }
        return currentKey;
    }

    private synchronized void regenerateKey(LocalDate currentDate) {
        try {
            currentKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            String base64Key = Base64.getEncoder().encodeToString(currentKey.getEncoded());
            jwtKeyRepository.storeKey(base64Key, currentDate);
            lastGeneratedDate = currentDate;
            log.info("Generated new JWT key on: {}", currentDate);
        } catch (Exception e) {
            log.error("Error generating new JWT key", e);
            throw new RuntimeException("Could not generate new JWT key", e);
        }
    }

    private SecretKey decodeKey(String base64Key) {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private static boolean isNewWeek(LocalDate lastGeneratedDate, LocalDate currentDate) {
        if (lastGeneratedDate == null) return true;

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int lastWeek = lastGeneratedDate.get(weekFields.weekOfWeekBasedYear());
        int currentWeek = currentDate.get(weekFields.weekOfWeekBasedYear());

        return lastWeek != currentWeek;
    }

    private void cleanUp () {
        try {
            jwtKeyRepository.cleanupOldKeys(60);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}