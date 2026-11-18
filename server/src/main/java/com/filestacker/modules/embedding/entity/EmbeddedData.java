package com.filestacker.modules.embedding.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "embedd_index")
public class EmbeddedData {

    @Id
    @Column(name = "embed_id", nullable = false, updatable = false)
    @JsonProperty("embed_id")
    private UUID embedId;

    @Column(name = "file_id", nullable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "vector_data", nullable = false, columnDefinition = "json")
    @JsonProperty("vector_data")
    @JsonRawValue
    private String vectorData;

    @Column(name = "model_used", nullable = false, columnDefinition = "text")
    @JsonProperty("model_used")
    private String modelUsed;

    @Column(name = "created_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public EmbeddedData() {
        if (this.embedId == null) {
            this.embedId = UUID.randomUUID();
        }
    }

    public EmbeddedData(UUID embedId, UUID fileId, String vectorData, String modelUsed, LocalDateTime createdAt) {
        this.embedId = embedId != null ? embedId : UUID.randomUUID();
        this.fileId = fileId;
        this.vectorData = vectorData;
        this.modelUsed = modelUsed;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public UUID getEmbedId() { return embedId; }
    public void setEmbedId(UUID embedId) { this.embedId = embedId; }

    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public String getVectorData() { return vectorData; }
    public void setVectorData(String vectorData) { this.vectorData = vectorData; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
