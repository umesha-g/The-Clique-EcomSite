package com.umesha_g.the_clique_backend.config;

import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.Data;

@Configuration
@Data
public class JwtConfig {
    private final long expiration;
    private final String tokenPrefix = "Bearer ";
    private final String headerString = "Authorization";
    private final String cookieName = "authToken";
    private final boolean isSecure = false;

    public JwtConfig() {
        Dotenv dotenv = Dotenv.load();
        this.expiration = Long.parseLong(dotenv.get("JWT_EXPIRATION"));
    }
}