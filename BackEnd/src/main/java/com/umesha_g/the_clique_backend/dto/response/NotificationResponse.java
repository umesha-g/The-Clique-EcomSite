package com.umesha_g.the_clique_backend.dto.response;

import com.umesha_g.the_clique_backend.model.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private String id;
    private String title;
    private String message;
    private String link;
    private boolean read;
    private NotificationType type;
    private LocalDateTime createdAt;
}