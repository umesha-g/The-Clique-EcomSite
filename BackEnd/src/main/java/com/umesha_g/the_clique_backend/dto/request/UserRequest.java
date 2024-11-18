package com.umesha_g.the_clique_backend.dto.request;

import jakarta.annotation.Nullable;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserRequest {
    private String email;
    private String newPassword;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    @Nullable
    private MultipartFile userDPFile;
    private String existingDPUrl;
    private String currentPassword;
}