package com.filestacker.modules.webhook.enums;

public enum WebhookEventType {
    FILE_UPLOADED("file.uploaded"),
    FILE_DELETED("file.deleted"),
    USER_REGISTERED("user.registered"),
    SUBSCRIPTION_UPDATED("subscription.updated");

    private final String eventName;

    WebhookEventType(String eventName) {
        this.eventName = eventName;
    }

    public String getEventName() {
        return eventName;
    }
}
