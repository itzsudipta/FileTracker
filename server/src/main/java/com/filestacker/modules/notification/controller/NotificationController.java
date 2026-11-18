package com.filestacker.modules.notification.controller;

import com.filestacker.modules.notification.entity.NotificationSettings;
import com.filestacker.modules.notification.service.NotificationSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class NotificationController {

    private final NotificationSettingsService notificationService;

    public NotificationController(NotificationSettingsService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/api/notifications/user/{user_id}")
    public ResponseEntity<List<NotificationSettings>> getUserNotifications(@PathVariable("user_id") UUID userId) {
        List<NotificationSettings> list = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/api/notifications")
    public ResponseEntity<NotificationSettings> createNotification(@RequestBody NotificationSettings notification) {
        NotificationSettings saved = notificationService.save(notification);
        return ResponseEntity.ok(saved);
    }
}
