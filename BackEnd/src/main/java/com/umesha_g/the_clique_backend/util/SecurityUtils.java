package com.umesha_g.the_clique_backend.util;

import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.exception.UnauthorizedException;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    private UserService userService;
    private SecurityUtils() {
        // Private constructor to prevent instantiation
    }

    /**
     * Gets the current user's ID from the SecurityContext
     *
     * @return the user ID of the currently authenticated user
     * @throws UnauthorizedException if no authentication is found
     */
    public User getCurrentUser() throws ResourceNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authentication found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            return userService.getUserByEmail(((UserDetails) principal).getUsername());
        } else if (principal instanceof String) {
            return userService.getUserByEmail((String) principal);
        }

        throw new UnauthorizedException("Unable to determine current user ID");
    }

    /**
     * Checks if the current user is authenticated
     *
     * @return true if the user is authenticated, false otherwise
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }

    /**
     * Gets the current user's Authentication object
     *
     * @return the Authentication object
     * @throws UnauthorizedException if no authentication is found
     */
    public static Authentication getCurrentAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new UnauthorizedException("No authentication found");
        }

        return authentication;
    }

    /**
     * Checks if the current user has a specific role
     *
     * @param role the role to check
     * @return true if the user has the role, false otherwise
     */
    public static boolean hasRole(String role) {
        Authentication authentication = getCurrentAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority ->
                        grantedAuthority.getAuthority().equals("ROLE_" + role));
    }
}