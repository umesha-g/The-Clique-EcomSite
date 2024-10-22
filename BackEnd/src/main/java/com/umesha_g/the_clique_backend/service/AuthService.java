package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.config.JwtConfig;
import com.umesha_g.the_clique_backend.util.Jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

@Service
@RequiredArgsConstructor
public class AuthService {
    private JwtTokenProvider tokenProvider;
    private JwtConfig jwtConfig;

    @Autowired
    public AuthService(JwtTokenProvider tokenProvider, JwtConfig jwtConfig) {
        this.tokenProvider = tokenProvider;
        this.jwtConfig = jwtConfig;
    }

    public void setAuthenticationCookie(HttpServletResponse response, Authentication authentication) {
        String jwt = tokenProvider.generateToken(authentication);
        String cookieValue = String.format("%s=%s; HttpOnly; Path=/; Max-Age=%d; SameSite=Lax",
                jwtConfig.getCookieName(),
                jwt,
                (int) (jwtConfig.getExpiration() / 1000));

        if (jwtConfig.isSecure()) {
            cookieValue += "; Secure";
        }

        response.setHeader("Set-Cookie", cookieValue);
    }

    public void clearAuthenticationCookie(HttpServletResponse response) {
        String cookieValue = String.format("%s=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure",
                jwtConfig.getCookieName());

        response.setHeader("Set-Cookie", cookieValue);
    }
}