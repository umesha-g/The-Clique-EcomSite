package com.umesha_g.the_clique_backend.util.Jwt;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;

import java.sql.*;
import java.time.LocalDate;

public class JwtKeyRepository {
    Dotenv dotenv = Dotenv.load();

    // JDBC URL, username and password of MySQL server
    private final String JDBC_URL = dotenv.get("MYSQL_URL");
    private final String JDBC_USER = dotenv.get("MYSQL_USER");
    private final String JDBC_PASSWORD = dotenv.get("MYSQL_PASSWORD");

    // SQL queries
    private static final String SELECT_KEY_QUERY = "SELECT secret_key, last_generated_date FROM jwt_keys WHERE id = 1";
    private static final String INSERT_KEY_QUERY = "INSERT INTO jwt_keys (secret_key, last_generated_date) VALUES (?, ?) ON DUPLICATE KEY UPDATE secret_key = ?, last_generated_date = ?";

    // Method to get the stored key and last generated date
    public JwtKeyData getStoredKey() {
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement ps = conn.prepareStatement(SELECT_KEY_QUERY)) {
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String secretKey = rs.getString("secret_key");
                Date lastGeneratedDate = rs.getDate("last_generated_date");
                return new JwtKeyData(secretKey, lastGeneratedDate.toLocalDate());
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // No key found
    }

    // Method to store the key and generation date
    public void storeKey(String secretKey, LocalDate lastGeneratedDate) {
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement ps = conn.prepareStatement(INSERT_KEY_QUERY)) {
            ps.setString(1, secretKey);
            ps.setDate(2, Date.valueOf(lastGeneratedDate));
            ps.setString(3, secretKey);
            ps.setDate(4, Date.valueOf(lastGeneratedDate));
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

// Data class to hold the key and date
@RequiredArgsConstructor
class JwtKeyData {
    private String secretKey;
    private LocalDate lastGeneratedDate;

    public JwtKeyData(String secretKey, LocalDate lastGeneratedDate) {
        this.secretKey = secretKey;
        this.lastGeneratedDate = lastGeneratedDate;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public LocalDate getLastGeneratedDate() {
        return lastGeneratedDate;
    }
}
