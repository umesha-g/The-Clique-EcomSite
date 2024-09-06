package com.umesha_g.store_backend.controller;

import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userService.findByEmail(loginUser.getEmail());
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok().body("Login successful");
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}