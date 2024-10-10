package com.umesha_g.the_clique_backend.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    @Email(message = "Invalid email format")
    private String email;
    private String name;
    private String phoneNumber;
    private String currentPassword;
    private String newPassword;
}