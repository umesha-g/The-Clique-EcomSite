package com.umesha_g.the_clique_backend.util.Jwt;

import com.umesha_g.the_clique_backend.config.JwtConfig;
import com.umesha_g.the_clique_backend.service.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final JwtConfig jwtConfig;

    private final List<String> PUBLIC_PATHS = Arrays.asList(
            "/api/v1/auth",
            "/api/v1/brands",
            "/api/v1/categories",
            "/api/v1/products",
            "/api/v1/files"
    );

    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            CustomUserDetailsService userDetailsService,
            JwtConfig jwtConfig) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain) throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String remoteIP = request.getRemoteAddr();

        try {
            String jwt = getJwtFromRequest(request);

            if (jwt != null) {
                processToken(jwt, request);
            }

            // Add security headers
            addSecurityHeaders(response);

        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token from IP: {} accessing URI: {}", remoteIP, requestURI);
            response.setHeader("Token-Expired", "true");
            clearAuthenticationContext();
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token from IP: {} accessing URI: {}", remoteIP, requestURI);
            clearAuthenticationContext();
        } catch (SignatureException e) {
            log.warn("Invalid JWT signature from IP: {} accessing URI: {}", remoteIP, requestURI);
            clearAuthenticationContext();
        } catch (Exception e) {
            log.error("Authentication error from IP: {} accessing URI: {}: {}",
                    remoteIP, requestURI, e.getMessage());
            clearAuthenticationContext();
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // First try to get from cookie
        String jwt = getJwtFromCookie(request);

        // If not in cookie, try Authorization header
        if (jwt == null) {
            jwt = getJwtFromHeader(request);
        }

        return jwt;
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        return Optional.ofNullable(request.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(cookie -> jwtConfig.getCookieName().equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findFirst())
                .orElse(null);
    }

    private String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void processToken(String jwt, HttpServletRequest request) {
        if (tokenProvider.validateToken(jwt)) {
            Claims claims = tokenProvider.getClaimsFromToken(jwt);
            String username = claims.getSubject();

            // Extract roles from claims
            List<SimpleGrantedAuthority> authorities = extractAuthorities(claims);

            // Load user details and verify account status
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails != null && userDetails.isEnabled()) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Log successful authentication
                log.debug("Authenticated user: {}", username);
            }
        }
    }

    private List<SimpleGrantedAuthority> extractAuthorities(Claims claims) {
        return Arrays.stream(claims.get("role", String.class).split(","))
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    private void addSecurityHeaders(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        response.setHeader("Pragma", "no-cache");
    }

    private void clearAuthenticationContext() {
        SecurityContextHolder.clearContext();
    }
}