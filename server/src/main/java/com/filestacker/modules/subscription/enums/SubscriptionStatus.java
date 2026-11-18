package com.filestacker.modules.subscription.enums;

public enum SubscriptionStatus {
    ACTIVE("active"),
    EXPIRED("expired"),
    CANCELLED("cancelled"),
    TRIAL("trial");

    private final String value;

    SubscriptionStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
