package com.filestacker.modules.analytics.enums;

public enum AnalyticsEventType {
    VIEW("view"),
    DOWNLOAD("download"),
    SHARE("share");

    private final String value;

    AnalyticsEventType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
