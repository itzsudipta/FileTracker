package com.filestacker.modules.webhook.controller;

import com.filestacker.modules.webhook.entity.WebhookLog;
import com.filestacker.modules.webhook.service.WebhookLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class WebhookController {

    private final WebhookLogService webhookService;

    public WebhookController(WebhookLogService webhookService) {
        this.webhookService = webhookService;
    }

    @PostMapping("/api/webhooks")
    public ResponseEntity<WebhookLog> registerWebhook(@RequestBody WebhookLog webhook) {
        WebhookLog saved = webhookService.registerWebhook(webhook);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/api/webhooks/org/{org_id}")
    public ResponseEntity<List<WebhookLog>> getWebhooksByOrg(@PathVariable("org_id") UUID orgId) {
        List<WebhookLog> list = webhookService.getWebhooksByOrg(orgId);
        return ResponseEntity.ok(list);
    }
}
