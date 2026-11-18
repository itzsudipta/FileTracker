package com.filestacker.modules.analytics.service;

import com.filestacker.modules.analytics.entity.FileAnalytics;
import com.filestacker.modules.analytics.repository.FileAnalyticsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileAnalyticsService {

    private final FileAnalyticsRepository fileAnalyticsRepository;

    public FileAnalyticsService(FileAnalyticsRepository fileAnalyticsRepository) {
        this.fileAnalyticsRepository = fileAnalyticsRepository;
    }

    public Optional<FileAnalytics> getAnalyticsByFileId(UUID fileId) {
        return fileAnalyticsRepository.findByFileId(fileId);
    }

    @Transactional
    public FileAnalytics save(FileAnalytics fileAnalytics) {
        if (fileAnalytics.getAnlyId() == null) {
            fileAnalytics.setAnlyId(UUID.randomUUID());
        }
        return fileAnalyticsRepository.save(fileAnalytics);
    }

    @Transactional
    public FileAnalytics createSampleFileAnalytics() {
        FileAnalytics newAnly = new FileAnalytics();
        newAnly.setAnlyId(UUID.randomUUID());
        newAnly.setFileId(UUID.fromString("09c99e53-af45-4bdd-a90f-9150d9653fe9"));
        newAnly.setViewCount(150);
        newAnly.setDownloadCount(100);
        newAnly.setLastAccesed(LocalDateTime.parse("2024-06-15T10:30:00"));
        newAnly.setUniqueUsers(1000);
        return fileAnalyticsRepository.save(newAnly);
    }
}
