package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.NotificationResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Notification;
import com.umesha_g.the_clique_backend.model.entity.Order;
import com.umesha_g.the_clique_backend.model.enums.NotificationType;
import com.umesha_g.the_clique_backend.repository.NotificationRepository;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private  NotificationRepository notificationRepository;
    private  SimpMessagingTemplate messagingTemplate;
    private  ModelMapper modelMapper;
    private  UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, ModelMapper modelMapper, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

    public void sendAdminNotification(String title, String message, NotificationType type, String link) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLink(link);

        Notification savedNotification = notificationRepository.save(notification);

        // Send WebSocket message to admin dashboard
        NotificationResponse response = modelMapper.map(savedNotification, NotificationResponse.class);
        messagingTemplate.convertAndSend("/topic/admin-notifications", response);
    }

    public void sendUserNotification(String userId, String title, String message,
                                     NotificationType type, String link) throws ResourceNotFoundException {
        Notification notification = new Notification();
        notification.setUser(userRepository.findById(userId).orElse(null));
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLink(link);

        Notification savedNotification = notificationRepository.save(notification);

        // Send WebSocket message to specific user
        NotificationResponse response = modelMapper.map(savedNotification, NotificationResponse.class);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                response
        );
    }

    public void markAsRead(String notificationId) throws ResourceNotFoundException {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUnreadNotifications(String userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationResponse.class))
                .collect(Collectors.toList());
    }

    public void sendOrderStatusUpdate(Order updatedOrder) {
    }
}