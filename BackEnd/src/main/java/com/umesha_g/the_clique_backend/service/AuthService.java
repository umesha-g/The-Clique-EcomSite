package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.config.JwtConfig;
import com.umesha_g.the_clique_backend.util.Jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

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

        Cookie authCookie = new Cookie(jwtConfig.getCookieName(), jwt);
        authCookie.setHttpOnly(true);
        authCookie.setPath("/");
        authCookie.setMaxAge((int) (jwtConfig.getExpiration() / 1000));
        authCookie.setSecure(jwtConfig.isSecure());
        authCookie.setAttribute("SameSite", "Lax");

        response.addCookie(authCookie);

        Cookie frontendCookie = new Cookie("isAuthenticated", "true");
        frontendCookie.setHttpOnly(false);
        frontendCookie.setPath("/");
        frontendCookie.setMaxAge((int) (jwtConfig.getExpiration() / 1000));
        frontendCookie.setSecure(jwtConfig.isSecure());
        frontendCookie.setAttribute("SameSite", "Lax");

        response.addCookie(frontendCookie);

        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Origin", "http://192.168.1.100");
    }

    public void clearAuthenticationCookie(HttpServletResponse response) {
        // Clear auth cookie
        Cookie authCookie = new Cookie(jwtConfig.getCookieName(), "");
        authCookie.setHttpOnly(true);
        authCookie.setPath("/");
        authCookie.setMaxAge(0);
        authCookie.setSecure(jwtConfig.isSecure());
        response.addCookie(authCookie);

        // Clear frontend cookie
        Cookie frontendCookie = new Cookie("isAuthenticated", "false");
        frontendCookie.setHttpOnly(false);
        frontendCookie.setPath("/");
        frontendCookie.setMaxAge(0);
        frontendCookie.setSecure(jwtConfig.isSecure());
        response.addCookie(frontendCookie);
    }
}