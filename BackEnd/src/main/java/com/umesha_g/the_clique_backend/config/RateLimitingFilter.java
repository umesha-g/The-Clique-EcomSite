package com.umesha_g.the_clique_backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitingFilter extends OncePerRequestFilter {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final int capacity;
    private final int minutes;

    public RateLimitingFilter(int capacity, int minutes) {
        this.capacity = capacity;
        this.minutes = minutes;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientId = getClientIdentifier(request);

        Bucket bucket = buckets.computeIfAbsent(clientId, this::createNewBucket);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("""
                {
                    "status": 429,
                    "error": "Too Many Requests",
                    "message": "Rate limit exceeded. Please try again later."
                }
                """);
        }
    }

    private Bucket createNewBucket(String clientId) {
        Refill refill = Refill.intervally(capacity, Duration.ofMinutes(minutes));
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket4j.builder().addLimit(limit).build();
    }

    private String getClientIdentifier(HttpServletRequest request) {
        // Get client IP, considering X-Forwarded-For header
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        }

        // might want to combine this with other identifiers
        // like user ID if authenticated, or API key
        return clientIp;
    }
}