package com.filestacker.modules.embedding.controller;

import com.filestacker.modules.embedding.entity.EmbeddedData;
import com.filestacker.modules.embedding.service.EmbeddedDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class EmbeddedDataController {

    private final EmbeddedDataService embeddedDataService;

    public EmbeddedDataController(EmbeddedDataService embeddedDataService) {
        this.embeddedDataService = embeddedDataService;
    }

    // Matches POST /createembeddeddata/
    @PostMapping("/createembeddeddata/")
    public ResponseEntity<EmbeddedData> createEmbeddedData() {
        EmbeddedData newEmbed = embeddedDataService.createSampleEmbeddedData();
        System.out.println("Embedded data created successfully");
        return ResponseEntity.ok(newEmbed);
    }

    @GetMapping("/api/embedding/file/{file_id}")
    public ResponseEntity<List<EmbeddedData>> getEmbeddingsByFile(@PathVariable("file_id") UUID fileId) {
        List<EmbeddedData> list = embeddedDataService.getEmbeddingsByFileId(fileId);
        return ResponseEntity.ok(list);
    }
}
