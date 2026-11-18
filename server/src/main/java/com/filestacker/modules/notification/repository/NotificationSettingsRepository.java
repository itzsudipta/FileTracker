package com.filestacker.modules.notification.repository;

import com.filestacker.modules.notification.entity.NotificationSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, UUID> {
    List<NotificationSettings> findByUserIdOrderByCreateAtDesc(UUID userId);
}
