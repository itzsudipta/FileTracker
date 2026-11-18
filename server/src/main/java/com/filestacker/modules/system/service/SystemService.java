package com.filestacker.modules.system.service;

import com.filestacker.modules.file.repository.FileInfoRepository;
import com.filestacker.modules.system.dto.StatsResponse;
import com.filestacker.modules.system.entity.SystemSetting;
import com.filestacker.modules.system.repository.SystemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SystemService {

    private final SystemRepository systemRepository;
    private final FileInfoRepository fileInfoRepository;

    public SystemService(SystemRepository systemRepository, FileInfoRepository fileInfoRepository) {
        this.systemRepository = systemRepository;
        this.fileInfoRepository = fileInfoRepository;
    }

    public Map<String, Object> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        try {
            String dbName = systemRepository.getCurrentDatabase();
            response.put("Database connected successfully", dbName != null ? dbName : "postgres");
        } catch (Exception e) {
            response.put("message", "Database connection failed");
            response.put("error", e.getMessage());
        }
        return response;
    }

    public StatsResponse getDashboardStats() {
        long totalFiles = fileInfoRepository.countByIsDeletedFalse();
        Long totalStorage = fileInfoRepository.sumStorageUsed();
        return new StatsResponse(totalFiles, totalStorage != null ? totalStorage : 0L, "KB");
    }

    public Map<String, Object> getSettings(UUID userId) {
        Optional<SystemSetting> settingOpt = systemRepository.findById(userId);
        Map<String, Object> res = new HashMap<>();
        if (settingOpt.isPresent()) {
            SystemSetting s = settingOpt.get();
            res.put("theme", s.getTheme());
            res.put("notifications", s.getNotifications());
        } else {
            res.put("theme", "light");
            res.put("notifications", true);
        }
        res.put("user_id", userId.toString());
        return res;
    }

    @Transactional
    public Map<String, Object> updateSettings(UUID userId, String theme, Boolean notifications) {
        SystemSetting s = systemRepository.findById(userId).orElse(new SystemSetting(userId, "light", true));
        if (theme != null && !theme.trim().isEmpty()) {
            s.setTheme(theme.trim());
        }
        if (notifications != null) {
            s.setNotifications(notifications);
        }
        systemRepository.save(s);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Settings updated successfully");
        res.put("theme", s.getTheme());
        res.put("notifications", s.getNotifications());
        return res;
    }
}
