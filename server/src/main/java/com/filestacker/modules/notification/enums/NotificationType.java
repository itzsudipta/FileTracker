package com.filestacker.modules.notification.enums;

public enum NotificationType {
    INFO("info"),
    WARNING("warning"),
    ALERT("alert"),
    SYSTEM("system");

    private final String value;

    NotificationType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
