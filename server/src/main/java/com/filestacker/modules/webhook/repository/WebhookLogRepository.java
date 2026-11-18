package com.filestacker.modules.webhook.repository;

import com.filestacker.modules.webhook.entity.WebhookLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookLogRepository extends JpaRepository<WebhookLog, UUID> {
    List<WebhookLog> findByOrgId(UUID orgId);
}
