package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.NotificationResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.NotificationService;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private  NotificationService notificationService;
    private  SecurityUtils securityUtils;

    @Autowired
    public NotificationController(NotificationService notificationService, SecurityUtils securityUtils) {
        this.notificationService = notificationService;
        this.securityUtils = securityUtils;
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications() throws ResourceNotFoundException {
        String userId = securityUtils.getCurrentUser().getId();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) throws ResourceNotFoundException {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}