CREATE TABLE IF NOT EXISTS jwt_keys (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        secret_key TEXT NOT NULL,
                                        last_generated_date DATE NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        INDEX idx_last_generated_date (last_generated_date)
);