package com.filestacker.modules.analytics.repository;

import com.filestacker.modules.analytics.entity.FileAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileAnalyticsRepository extends JpaRepository<FileAnalytics, UUID> {
    Optional<FileAnalytics> findByFileId(UUID fileId);
}
