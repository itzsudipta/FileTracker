package com.filestacker.modules.embedding.service;

import com.filestacker.modules.embedding.entity.EmbeddedData;
import com.filestacker.modules.embedding.repository.EmbeddedDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EmbeddedDataService {

    private final EmbeddedDataRepository embeddedDataRepository;

    public EmbeddedDataService(EmbeddedDataRepository embeddedDataRepository) {
        this.embeddedDataRepository = embeddedDataRepository;
    }

    public List<EmbeddedData> getEmbeddingsByFileId(UUID fileId) {
        return embeddedDataRepository.findByFileId(fileId);
    }

    @Transactional
    public EmbeddedData save(EmbeddedData data) {
        if (data.getEmbedId() == null) {
            data.setEmbedId(UUID.randomUUID());
        }
        if (data.getCreatedAt() == null) {
            data.setCreatedAt(LocalDateTime.now());
        }
        return embeddedDataRepository.save(data);
    }

    @Transactional
    public EmbeddedData createSampleEmbeddedData() {
        EmbeddedData newEmbed = new EmbeddedData();
        newEmbed.setEmbedId(UUID.randomUUID());
        newEmbed.setFileId(UUID.fromString("09c99e53-af45-4bdd-a90f-9150d9653fe9"));
        newEmbed.setVectorData("{\"embedding\": [0.1, 0.2, 0.3]}");
        newEmbed.setModelUsed("text-embedding-ada-002");
        newEmbed.setCreatedAt(LocalDateTime.parse("2024-06-15T10:30:00"));
        return embeddedDataRepository.save(newEmbed);
    }
}
