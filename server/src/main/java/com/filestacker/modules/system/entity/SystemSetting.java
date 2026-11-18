package com.filestacker.modules.system.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
public class SystemSetting {

    @Id
    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private UUID userId;

    @Column(name = "theme", nullable = false)
    @JsonProperty("theme")
    private String theme = "light";

    @Column(name = "notifications", nullable = false)
    @JsonProperty("notifications")
    private Boolean notifications = true;

    public SystemSetting() {}

    public SystemSetting(UUID userId, String theme, Boolean notifications) {
        this.userId = userId;
        this.theme = theme != null ? theme : "light";
        this.notifications = notifications != null ? notifications : true;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public Boolean getNotifications() { return notifications; }
    public void setNotifications(Boolean notifications) { this.notifications = notifications; }
}
