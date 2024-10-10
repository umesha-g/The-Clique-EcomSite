package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.NotificationResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.NotificationService;
import com.umesha_g.the_clique_backend.service.UserService;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications() throws ResourceNotFoundException {
        String userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) throws ResourceNotFoundException {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}