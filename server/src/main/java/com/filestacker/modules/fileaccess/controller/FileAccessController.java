package com.filestacker.modules.fileaccess.controller;

import com.filestacker.modules.fileaccess.entity.FileAccess;
import com.filestacker.modules.fileaccess.service.FileAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class FileAccessController {

    private final FileAccessService fileAccessService;

    public FileAccessController(FileAccessService fileAccessService) {
        this.fileAccessService = fileAccessService;
    }

    // Matches POST /createfileaccess/
    @PostMapping("/createfileaccess/")
    public ResponseEntity<FileAccess> createFileAccess() {
        FileAccess access = fileAccessService.createSampleFileAccess();
        System.out.println("File access created successfully");
        return ResponseEntity.ok(access);
    }

    @GetMapping("/api/files/{file_id}/access")
    public ResponseEntity<List<FileAccess>> getFileAccess(@PathVariable("file_id") UUID fileId) {
        List<FileAccess> accessList = fileAccessService.findByFileId(fileId);
        return ResponseEntity.ok(accessList);
    }
}
