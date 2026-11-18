package com.filestacker.modules.webhook.service;

import com.filestacker.modules.webhook.entity.WebhookLog;
import com.filestacker.modules.webhook.repository.WebhookLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class WebhookLogService {

    private final WebhookLogRepository webhookLogRepository;

    public WebhookLogService(WebhookLogRepository webhookLogRepository) {
        this.webhookLogRepository = webhookLogRepository;
    }

    public List<WebhookLog> getWebhooksByOrg(UUID orgId) {
        return webhookLogRepository.findByOrgId(orgId);
    }

    @Transactional
    public WebhookLog registerWebhook(WebhookLog webhook) {
        if (webhook.getWebhookId() == null) {
            webhook.setWebhookId(UUID.randomUUID());
        }
        return webhookLogRepository.save(webhook);
    }
}
