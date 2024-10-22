import java.sql.*;
import java.time.LocalDate;

public class JwtKeyRepository {

    // JDBC URL, username and password of MySQL server
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/your_database";
    private static final String JDBC_USER = "username";
    private static final String JDBC_PASSWORD = "password";

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
