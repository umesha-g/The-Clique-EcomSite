package com.umesha_g.the_clique_backend.util.Jwt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Base64;
import java.util.Locale;

public class WeeklyKeyManager {
    private static JwtKeyRepository jwtKeyRepository = new JwtKeyRepository();

    public static SecretKey getWeeklyKey() {
        JwtKeyData storedKeyData = jwtKeyRepository.getStoredKey();
        LocalDate currentDate = LocalDate.now();

        // Check if the key needs to be regenerated
        if (storedKeyData == null || isNewWeek(storedKeyData.getLastGeneratedDate(), currentDate)) {
            // Generate a new key
            SecretKey newKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            String base64Key = Base64.getEncoder().encodeToString(newKey.getEncoded());

            // Store the new key and generation date
            jwtKeyRepository.storeKey(base64Key, currentDate);

            return newKey;
        }

        // Return the stored key
        byte[] decodedKey = Base64.getDecoder().decode(storedKeyData.getSecretKey());
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private static boolean isNewWeek(LocalDate lastGeneratedDate, LocalDate currentDate) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        return lastGeneratedDate == null || lastGeneratedDate.get(weekFields.weekOfWeekBasedYear()) != currentDate.get(weekFields.weekOfWeekBasedYear());
    }
}
