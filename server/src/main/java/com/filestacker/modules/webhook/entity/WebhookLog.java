package com.filestacker.modules.webhook.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "webhookstable")
public class WebhookLog {

    @Id
    @Column(name = "webhook_id", nullable = false, updatable = false)
    @JsonProperty("webhook_id")
    private UUID webhookId;

    @Column(name = "org_id", nullable = false)
    @JsonProperty("org_id")
    private UUID orgId;

    @Column(name = "url", nullable = false, columnDefinition = "text")
    @JsonProperty("url")
    private String url;

    @Column(name = "event_type", nullable = false, columnDefinition = "text")
    @JsonProperty("event_type")
    private String eventType;

    @Column(name = "secret_token", nullable = false, columnDefinition = "text")
    @JsonProperty("secret_token")
    private String secretToken;

    @Column(name = "is_active", nullable = false)
    @JsonProperty("is_active")
    private Boolean isActive = true;

    public WebhookLog() {
        if (this.webhookId == null) {
            this.webhookId = UUID.randomUUID();
        }
    }

    public WebhookLog(UUID webhookId, UUID orgId, String url, String eventType, String secretToken, Boolean isActive) {
        this.webhookId = webhookId != null ? webhookId : UUID.randomUUID();
        this.orgId = orgId;
        this.url = url;
        this.eventType = eventType;
        this.secretToken = secretToken;
        this.isActive = isActive != null ? isActive : true;
    }

    public UUID getWebhookId() { return webhookId; }
    public void setWebhookId(UUID webhookId) { this.webhookId = webhookId; }

    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getSecretToken() { return secretToken; }
    public void setSecretToken(String secretToken) { this.secretToken = secretToken; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
