package com.umesha_g.the_clique_backend.util.Jwt;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;

@Slf4j
@Repository
public class JwtKeyRepository {
    private final String JDBC_URL;
    private final String JDBC_USER;
    private final String JDBC_PASSWORD;

    private static final String SELECT_KEY_QUERY =
            "SELECT secret_key, last_generated_date FROM jwt_keys " +
                    "WHERE last_generated_date = (SELECT MAX(last_generated_date) FROM jwt_keys)";

    private static final String INSERT_KEY_QUERY =
            "INSERT INTO jwt_keys (secret_key, last_generated_date) VALUES (?, ?)";

    public JwtKeyRepository() {
        Dotenv dotenv = Dotenv.load();
        this.JDBC_URL = dotenv.get("MYSQL_URL");
        this.JDBC_USER = dotenv.get("MYSQL_USER");
        this.JDBC_PASSWORD = dotenv.get("MYSQL_PASSWORD");
    }

    public JwtKeyData getStoredKey() throws SQLException {
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement ps = conn.prepareStatement(SELECT_KEY_QUERY)) {

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String secretKey = rs.getString("secret_key");
                Date lastGeneratedDate = rs.getDate("last_generated_date");

                // Return null if the key is empty or dates don't match expectations
                if (secretKey == null || secretKey.isEmpty()) {
                    log.debug("No valid key found in database");
                    return null;
                }

                log.debug("Retrieved key generated on: {}", lastGeneratedDate);
                return new JwtKeyData(secretKey, lastGeneratedDate.toLocalDate());
            }
            log.debug("No key found in database");
            return null;
        } catch (SQLException e) {
            log.error("Error retrieving JWT key from database", e);
            throw e;
        }
    }

    public void storeKey(String secretKey, LocalDate lastGeneratedDate) throws SQLException {
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement ps = conn.prepareStatement(INSERT_KEY_QUERY)) {

            ps.setString(1, secretKey);
            ps.setDate(2, Date.valueOf(lastGeneratedDate));
            ps.executeUpdate();

            log.info("Successfully stored new JWT key with generation date: {}", lastGeneratedDate);
        } catch (SQLException e) {
            log.error("Error storing JWT key in database", e);
            throw e;
        }
    }

    public void cleanupOldKeys(int keepDays) throws SQLException {
        String cleanupQuery =
                "DELETE FROM jwt_keys WHERE last_generated_date < DATE_SUB(CURRENT_DATE, INTERVAL ? DAY) " +
                        "AND last_generated_date < (SELECT MAX(last_generated_date) FROM jwt_keys)";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement ps = conn.prepareStatement(cleanupQuery)) {

            ps.setInt(1, keepDays);
            int deletedCount = ps.executeUpdate();

            if (deletedCount > 0) {
                log.info("Cleaned up {} old JWT keys", deletedCount);
            }
        } catch (SQLException e) {
            log.error("Error cleaning up old JWT keys", e);
            throw e;
        }
    }
}