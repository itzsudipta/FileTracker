package com.filestacker.modules.filemetadata.controller;

import com.filestacker.modules.filemetadata.entity.FileMetadata;
import com.filestacker.modules.filemetadata.service.FileMetadataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class FileMetadataController {

    private final FileMetadataService fileMetadataService;

    public FileMetadataController(FileMetadataService fileMetadataService) {
        this.fileMetadataService = fileMetadataService;
    }

    // Matches POST /createfilemetadata/
    @PostMapping("/createfilemetadata/")
    public ResponseEntity<FileMetadata> createFileMetadata() {
        FileMetadata newMd = fileMetadataService.createSampleFileMetadata();
        System.out.println("File metadata created successfully");
        return ResponseEntity.ok(newMd);
    }

    @GetMapping("/api/files/{file_id}/versions")
    public ResponseEntity<List<FileMetadata>> getVersions(@PathVariable("file_id") UUID fileId) {
        List<FileMetadata> versions = fileMetadataService.getVersionsByFileId(fileId);
        return ResponseEntity.ok(versions);
    }
}
