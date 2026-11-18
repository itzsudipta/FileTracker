package com.filestacker.modules.system.controller;

import com.filestacker.modules.system.dto.StatsResponse;
import com.filestacker.modules.system.service.SystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
public class SystemController {

    private final SystemService systemService;

    public SystemController(SystemService systemService) {
        this.systemService = systemService;
    }

    // Matches GET /DBtest
    @GetMapping("/DBtest")
    public ResponseEntity<Map<String, Object>> testDatabase() {
        Map<String, Object> result = systemService.testDatabaseConnection();
        return ResponseEntity.ok(result);
    }

    // 11. GET /api/stats - Dashboard statistics
    @GetMapping("/api/stats")
    public ResponseEntity<StatsResponse> getDashboardStats() {
        StatsResponse stats = systemService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // 12. GET /api/settings - Get user settings
    @GetMapping("/api/settings")
    public ResponseEntity<Map<String, Object>> getSettings(@RequestParam("user_id") UUID userId) {
        Map<String, Object> settings = systemService.getSettings(userId);
        return ResponseEntity.ok(settings);
    }

    // 12. PUT /api/settings - Update user settings
    @PutMapping("/api/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(
            @RequestParam("user_id") UUID userId,
            @RequestParam(value = "theme", required = false) String theme,
            @RequestParam(value = "notifications", required = false) Boolean notifications
    ) {
        Map<String, Object> res = systemService.updateSettings(userId, theme, notifications);
        return ResponseEntity.ok(res);
    }
}
