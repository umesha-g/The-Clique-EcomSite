package com.umesha_g.the_clique_backend.model.entity;

import com.umesha_g.the_clique_backend.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String message;
    private String link;

    @Column(name = "is_read")  // Changed from 'read' to 'is_read'
    private boolean isRead;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)")  // Changed from ENUM to VARCHAR
    private NotificationType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at" , updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}