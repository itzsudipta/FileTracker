package com.filestacker.modules.notification.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification")
public class NotificationSettings {

    @Id
    @Column(name = "notification_id", nullable = false, updatable = false)
    @JsonProperty("notification_id")
    private UUID notificationId;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private UUID userId;

    @Column(name = "notification_type", nullable = false, columnDefinition = "text")
    @JsonProperty("notification_type")
    private String notificationType;

    @Column(name = "notification_message", nullable = false, columnDefinition = "text")
    @JsonProperty("notification_message")
    private String notificationMessage;

    @Column(name = "is_read", nullable = false)
    @JsonProperty("is_read")
    private Boolean isRead = false;

    @Column(name = "create_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("create_at")
    private LocalDateTime createAt = LocalDateTime.now();

    public NotificationSettings() {
        if (this.notificationId == null) {
            this.notificationId = UUID.randomUUID();
        }
    }

    public NotificationSettings(UUID notificationId, UUID userId, String notificationType, String notificationMessage, Boolean isRead, LocalDateTime createAt) {
        this.notificationId = notificationId != null ? notificationId : UUID.randomUUID();
        this.userId = userId;
        this.notificationType = notificationType;
        this.notificationMessage = notificationMessage;
        this.isRead = isRead != null ? isRead : false;
        this.createAt = createAt != null ? createAt : LocalDateTime.now();
    }

    public UUID getNotificationId() { return notificationId; }
    public void setNotificationId(UUID notificationId) { this.notificationId = notificationId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }

    public String getNotificationMessage() { return notificationMessage; }
    public void setNotificationMessage(String notificationMessage) { this.notificationMessage = notificationMessage; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean read) { isRead = read; }

    public LocalDateTime getCreateAt() { return createAt; }
    public void setCreateAt(LocalDateTime createAt) { this.createAt = createAt; }
}
