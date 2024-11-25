package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.NotificationResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Notification;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.NotificationType;
import com.umesha_g.the_clique_backend.model.enums.Role;
import com.umesha_g.the_clique_backend.repository.NotificationRepository;
import com.umesha_g.the_clique_backend.repository.UserRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class NotificationService {
    private  NotificationRepository notificationRepository;
    private  SimpMessagingTemplate messagingTemplate;
    private  ModelMapper modelMapper;
    private  UserRepository userRepository;
    private SecurityUtils securityUtils;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, ModelMapper modelMapper, UserRepository userRepository, SecurityUtils securityUtils) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public void sendAdminNotification(String title, String message_1,String message_2, String message_3, NotificationType type, String link) {
        User admin = userRepository.findByRole(Role.ADMIN).orElse(null);
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage_1(message_1);
        notification.setMessage_2(message_2);
        notification.setMessage_3(message_3);
        notification.setType(type);
        notification.setLink(link);
        notification.setUser(admin);

        Notification savedNotification = notificationRepository.save(notification);

        NotificationResponse response = modelMapper.map(savedNotification, NotificationResponse.class);
        messagingTemplate.convertAndSend("/admin/notifications", response);
    }

    @Transactional
    public void sendUserNotification(String userId, String title, String message_1, String message_2, String message_3, NotificationType type, String link) {
        System.out.println("Sending notification to user: " + userId);
        Notification notification = new Notification();
        notification.setUser(userRepository.findById(userId).orElse(null));
        notification.setTitle(title);
        notification.setMessage_1(message_1);
        notification.setMessage_2(message_2);
        notification.setMessage_3(message_3);
        notification.setType(type);
        notification.setLink(link);

        Notification savedNotification = notificationRepository.save(notification);

        NotificationResponse response = modelMapper.map(savedNotification, NotificationResponse.class);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notifications",
                response
        );
        System.out.println("Notification sent: " + response);
    }

    @Transactional
    public void markAsRead(String notificationId) throws ResourceNotFoundException {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUnreadNotifications() throws ResourceNotFoundException {
        String userId = securityUtils.getCurrentUser().getId();
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationResponse.class))
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getAllNotifications() throws ResourceNotFoundException {
        String userId = securityUtils.getCurrentUser().getId();
        List<Notification> notifications = notificationRepository
                .findByUserId(userId);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationResponse.class))
                .collect(Collectors.toList());
    }
}