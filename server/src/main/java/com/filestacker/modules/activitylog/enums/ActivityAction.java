package com.filestacker.modules.activitylog.enums;

public enum ActivityAction {
    FILE_UPLOADED("File uploaded successfully"),
    FILE_DOWNLOADED("File downloaded successfully"),
    FILE_DELETED("File deleted successfully"),
    FILE_VIEWED("File viewed successfully"),
    USER_LOGIN("User logged in"),
    USER_LOGOUT("User logged out");

    private final String description;

    ActivityAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
