package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.config.JwtConfig;
import com.umesha_g.the_clique_backend.util.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenProvider tokenProvider;
    private final JwtConfig jwtConfig;

    public void setAuthenticationCookie(HttpServletResponse response, Authentication authentication) {
        String jwt = tokenProvider.generateToken(authentication);
        Cookie cookie = new Cookie(jwtConfig.getCookieName(), jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // set to true if using HTTPS
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtConfig.getExpiration() / 1000)); // convert milliseconds to seconds
        response.addCookie(cookie);
    }

    public void clearAuthenticationCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(jwtConfig.getCookieName(), null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}