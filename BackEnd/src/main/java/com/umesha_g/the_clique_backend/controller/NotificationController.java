package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.NotificationResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.NotificationService;
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

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications() throws ResourceNotFoundException {
        return ResponseEntity.ok(notificationService.getUnreadNotifications());
    }

    @GetMapping("/all")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() throws ResourceNotFoundException {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) throws ResourceNotFoundException {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}