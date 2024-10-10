package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.LoginRequest;
import com.umesha_g.the_clique_backend.dto.request.RegisterRequest;
import com.umesha_g.the_clique_backend.dto.response.JwtAuthResponse;
import com.umesha_g.the_clique_backend.dto.response.UserResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.service.UserService;
import com.umesha_g.the_clique_backend.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(
            @RequestHeader(name = "Authorization") String bearerToken) throws ResourceNotFoundException {
        // Validate existing token and generate new one if valid
        String token = bearerToken.substring(7);
        if (tokenProvider.validateToken(token)) {
            String email = tokenProvider.getUsernameFromToken(token);
            User user = userService.loadUserByEmail(email);


            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(), user.getPassword());

            String newToken = tokenProvider.generateToken(authentication);
            return ResponseEntity.ok(new JwtAuthResponse(newToken));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}