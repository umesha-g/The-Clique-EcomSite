package com.umesha_g.the_clique_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    @Email(message = "Invalid email format")
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    @NotBlank(message = "Current Password is required")
    private String currentPassword;
    private String newPassword;
}