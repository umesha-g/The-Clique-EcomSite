package com.umesha_g.the_clique_backend.model.entity.admin;

import com.umesha_g.the_clique_backend.model.enums.AdminNotificationType;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "admin_notifications")
@NoArgsConstructor
public class AdminNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    private AdminNotificationType type;

    private String referenceId;
    private String referenceType;
    private boolean isRead;
    private LocalDateTime createdAt;
}