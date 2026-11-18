package com.filestacker.modules.analytics.controller;

import com.filestacker.modules.analytics.entity.FileAnalytics;
import com.filestacker.modules.analytics.service.FileAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
public class FileAnalyticsController {

    private final FileAnalyticsService fileAnalyticsService;

    public FileAnalyticsController(FileAnalyticsService fileAnalyticsService) {
        this.fileAnalyticsService = fileAnalyticsService;
    }

    // Matches POST /createfileanalytics/
    @PostMapping("/createfileanalytics/")
    public ResponseEntity<FileAnalytics> createFileAnalytics() {
        FileAnalytics newAnly = fileAnalyticsService.createSampleFileAnalytics();
        System.out.println("File analytics created successfully");
        return ResponseEntity.ok(newAnly);
    }

    @GetMapping("/api/files/{file_id}/analytics")
    public ResponseEntity<?> getAnalytics(@PathVariable("file_id") UUID fileId) {
        Optional<FileAnalytics> anly = fileAnalyticsService.getAnalyticsByFileId(fileId);
        if (anly.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(anly.get());
    }
}
