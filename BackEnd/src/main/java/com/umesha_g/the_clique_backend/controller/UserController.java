package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.UserRequest;
import com.umesha_g.the_clique_backend.dto.response.UserResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.service.UserService;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private UserService userService;
    private SecurityUtils securityUtils;

    @Autowired
    public UserController(UserService userService, SecurityUtils securityUtils) {
        this.userService = userService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getUser() throws ResourceNotFoundException {
        User currentUser = securityUtils.getCurrentUser();
        UserResponse response = userService.getUser(currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(
            @Valid @RequestBody UserRequest request) throws ResourceNotFoundException {
        User currentUser = securityUtils.getCurrentUser();
        UserResponse response = userService.updateUser(request , currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser() throws ResourceNotFoundException {
        User currentUser = securityUtils.getCurrentUser();
        userService.deleteUser(currentUser);
        return ResponseEntity.ok(null);
    }
}