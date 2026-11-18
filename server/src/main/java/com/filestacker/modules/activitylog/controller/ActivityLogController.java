package com.filestacker.modules.activitylog.controller;

import com.filestacker.modules.activitylog.entity.ActivityLog;
import com.filestacker.modules.activitylog.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    // Matches POST /createactivitylog/
    @PostMapping("/createactivitylog/")
    public ResponseEntity<ActivityLog> createActivityLog() {
        ActivityLog newLog = activityLogService.createSampleActivityLog();
        System.out.println("Activity log created successfully");
        return ResponseEntity.ok(newLog);
    }

    @GetMapping("/api/activity/user/{user_id}")
    public ResponseEntity<List<ActivityLog>> getUserActivityLogs(@PathVariable("user_id") UUID userId) {
        List<ActivityLog> logs = activityLogService.getLogsByUserId(userId);
        return ResponseEntity.ok(logs);
    }
}
