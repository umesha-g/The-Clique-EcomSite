package com.umesha_g.the_clique_backend.dto.response;

import com.umesha_g.the_clique_backend.model.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String phoneNumber;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // References (IDs only to prevent circular dependencies)
    private String cartId;
    private String wishlistId;
    private List<String> addressIds;
    private List<String> orderIds;
}