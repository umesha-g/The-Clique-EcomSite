package com.umesha_g.the_clique_backend.util;

import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.exception.UnauthorizedException;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final UserRepository userRepository;

    /**
     * Gets the current user from the SecurityContext
     *
     * @return the currently authenticated user
     * @throws UnauthorizedException if no authentication is found
     * @throws ResourceNotFoundException if user is not found in database
     */
    public User getCurrentUser() throws ResourceNotFoundException {
        Authentication authentication = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .orElseThrow(() -> new UnauthorizedException("No authentication found"));

        if (!authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }

        String userEmail = extractUserEmail(authentication);
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /**
     * Extracts user email from Authentication object
     */
    private String extractUserEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            return (String) principal;
        }

        throw new UnauthorizedException("Unable to determine user email");
    }

    /**
     * Checks if the current user is authenticated
     */
    public static boolean isAuthenticated() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::isAuthenticated)
                .orElse(false);
    }

    /**
     * Gets the current Authentication object
     */
    public static Authentication getCurrentAuthentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .orElseThrow(() -> new UnauthorizedException("No authentication found"));
    }

    /**
     * Gets all roles of the current user
     */
    public static Set<String> getCurrentUserRoles() {
        Authentication authentication = getCurrentAuthentication();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .collect(Collectors.toSet());
    }

    /**
     * Checks if the current user has any of the specified roles
     */
    public static boolean hasAnyRole(String... roles) {
        Set<String> userRoles = getCurrentUserRoles();
        return Set.of(roles).stream().anyMatch(userRoles::contains);
    }

    /**
     * Checks if the current user has all specified roles
     */
    public static boolean hasAllRoles(String... roles) {
        Set<String> userRoles = getCurrentUserRoles();
        return Set.of(roles).stream().allMatch(userRoles::contains);
    }

    /**
     * Gets authentication details including IP address
     */
    public static String getAuthenticationDetails() {
        Authentication authentication = getCurrentAuthentication();
        if (authentication.getDetails() instanceof WebAuthenticationDetails details) {
            return String.format("IP: %s, Session ID: %s",
                    details.getRemoteAddress(),
                    details.getSessionId());
        }
        return "No details available";
    }

    /**
     * Validates if the current user has access to the requested user ID
     */
    public boolean validateUserAccess(Long requestedUserId) throws ResourceNotFoundException {
        User currentUser = getCurrentUser();
        return currentUser.getId().equals(requestedUserId) ||
                hasRole("ADMIN");
    }

    /**
     * Checks if the current user has a specific role
     */
    public static boolean hasRole(String role) {
        Authentication authentication = getCurrentAuthentication();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals("ROLE_" + role));
    }
}