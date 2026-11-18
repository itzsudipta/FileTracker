package com.filestacker.modules.notification.service;

import com.filestacker.modules.notification.entity.NotificationSettings;
import com.filestacker.modules.notification.repository.NotificationSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationSettingsService {

    private final NotificationSettingsRepository notificationRepository;

    public NotificationSettingsService(NotificationSettingsRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationSettings> getNotificationsByUserId(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreateAtDesc(userId);
    }

    @Transactional
    public NotificationSettings save(NotificationSettings notification) {
        if (notification.getNotificationId() == null) {
            notification.setNotificationId(UUID.randomUUID());
        }
        if (notification.getCreateAt() == null) {
            notification.setCreateAt(LocalDateTime.now());
        }
        return notificationRepository.save(notification);
    }

    @Transactional
    public NotificationSettings createSampleNotification(UUID userId, String message) {
        NotificationSettings notif = new NotificationSettings();
        notif.setNotificationId(UUID.randomUUID());
        notif.setUserId(userId);
        notif.setNotificationType("info");
        notif.setNotificationMessage(message != null ? message : "Sample notification message");
        notif.setIsRead(false);
        notif.setCreateAt(LocalDateTime.now());
        return notificationRepository.save(notif);
    }
}
