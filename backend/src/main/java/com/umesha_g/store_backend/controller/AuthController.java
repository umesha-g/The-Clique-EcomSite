package com.umesha_g.store_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            // In a real application, you would use a proper JWT library
            String token = "fake-jwt-token-" + email;
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        // In a real application, you would validate the JWT token
        String email = token.replace("Bearer fake-jwt-token-", "");
        User user = userService.findByEmail(email);
        if (user != null) {
            Map<String, String> profile = new HashMap<>();
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("fullName", user.getFullName());
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> updates) {
        String email = token.replace("Bearer fake-jwt-token-", "");
        User user = userService.findByEmail(email);
        if (user != null) {
            if (updates.containsKey("fullName")) {
                user.setFullName((String) updates.get("fullName"));
            }
            if (updates.containsKey("isSeller")) {
                user.setSeller((Boolean) updates.get("isSeller"));
            }
            if (updates.containsKey("sellerDescription")) {
                user.setSellerDescription((String) updates.get("sellerDescription"));
            }
            userService.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // In a real application, you should hash the password before saving
        user.setCreatedAt(java.time.LocalDateTime.now());
        User savedUser = userService.save(user);

        // Generate token
        String token = "fake-jwt-token-" + savedUser.getEmail();
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        return ResponseEntity.ok(response);
    }
}