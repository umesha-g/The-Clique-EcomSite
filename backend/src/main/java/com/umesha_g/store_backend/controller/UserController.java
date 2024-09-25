package com.umesha_g.store_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.service.UserService;
import com.umesha_g.store_backend.util.CookieUtil;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> registerRequest,
            HttpServletResponse response) {
        if (userService.existsByEmail(registerRequest.get("email"))) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("isSuccess", "false", "error", "Email already exists"));
        }
        User savedUser = userService.register(registerRequest.get("email"), registerRequest.get("password"),
                registerRequest.get("fullName"));
        String token = jwtUtil.generateToken(savedUser.getEmail());
        userService.setTokenCookie(response, token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("isSuccess", "true", "message", "User registered successfully", "email",
                        savedUser.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest,
            HttpServletResponse response) {
        Map<String, Object> result = userService.login(loginRequest.get("email"), loginRequest.get("password"));

        if ((Boolean) result.get("isSuccess")) {
            userService.setTokenCookie(response, (String) result.get("userAuthToken"));
            return ResponseEntity.ok(Map.of("isSuccess", "true", "message", "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("isSuccess", "false", "error", "Invalid credentials"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile(HttpServletRequest request) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token is missing"));
        }
        String email = jwtUtil.extractEmail(token);
        Map<String, String> profile = userService.getUserProfile(email);
        return profile.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"))
                : ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(HttpServletRequest request,
            @RequestBody Map<String, String> updateRequest) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token is missing"));
        }
        String email = jwtUtil.extractEmail(token);
        boolean updated = userService.updateUserProfile(email, updateRequest.get("fullName"));
        return updated
                ? ResponseEntity.ok(Map.of("message", "Profile updated successfully"))
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        userService.clearTokenCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}