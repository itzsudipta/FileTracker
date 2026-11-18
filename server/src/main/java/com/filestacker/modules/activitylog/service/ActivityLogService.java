package com.filestacker.modules.activitylog.service;

import com.filestacker.modules.activitylog.entity.ActivityLog;
import com.filestacker.modules.activitylog.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public List<ActivityLog> getLogsByUserId(UUID userId) {
        return activityLogRepository.findByUserIdOrderByLogTimeDesc(userId);
    }

    public List<ActivityLog> getLogsByFileId(UUID fileId) {
        return activityLogRepository.findByFileIdOrderByLogTimeDesc(fileId);
    }

    @Transactional
    public ActivityLog save(ActivityLog log) {
        if (log.getLogId() == null) {
            log.setLogId(UUID.randomUUID());
        }
        if (log.getLogTime() == null) {
            log.setLogTime(LocalDateTime.now());
        }
        return activityLogRepository.save(log);
    }

    @Transactional
    public ActivityLog createSampleActivityLog() {
        ActivityLog newLog = new ActivityLog();
        newLog.setLogId(UUID.randomUUID());
        newLog.setUserId(UUID.fromString("d05215f1-63be-49b9-8188-b6bf59e8b540"));
        newLog.setFileId(UUID.fromString("09c99e53-af45-4bdd-a90f-9150d9653fe9"));
        newLog.setActionLog("File uploaded successfully");
        newLog.setLogTime(LocalDateTime.parse("2024-06-15T10:30:00"));
        newLog.setIpAdd("192.168.1.1");
        newLog.setDescrp("File uploaded successfully");
        return activityLogRepository.save(newLog);
    }
}
