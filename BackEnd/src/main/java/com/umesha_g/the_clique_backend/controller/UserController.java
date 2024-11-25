package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.UserRequest;
import com.umesha_g.the_clique_backend.dto.response.UserResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.UserService;
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

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getUser() throws ResourceNotFoundException {
        UserResponse response = userService.getUser();
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(
            @Valid @RequestBody UserRequest request) throws ResourceNotFoundException {
        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser() throws ResourceNotFoundException {
        userService.deleteUser();
        return ResponseEntity.ok(null);
    }
}