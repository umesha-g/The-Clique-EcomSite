package com.umesha_g.the_clique_backend.config;

import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.Data;

@Configuration
@Data
public class JwtConfig {
    Dotenv dotenv = Dotenv.load();

    // private String secret = dotenv.get("JWT_SECRET");
    private long expiration = Long.parseLong(dotenv.get("JWT_EXPIRATION"));
    private String tokenPrefix = "Bearer ";
    private String headerString = "Authorization";
    private String cookieName = "THE_CLIQUE_TOKEN";
    private boolean isSecure = false;
}