package com.filestacker.modules.filemetadata.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_md")
public class FileMetadata {

    @Id
    @Column(name = "version_id", nullable = false, updatable = false)
    @JsonProperty("version_id")
    private UUID versionId;

    @Column(name = "file_id", nullable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "ver_no", nullable = false)
    @JsonProperty("ver_no")
    private Integer verNo = 1;

    @Column(name = "storage_path", nullable = false, columnDefinition = "text")
    @JsonProperty("storage_path")
    private String storagePath;

    @Column(name = "created_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "changelog", nullable = false, columnDefinition = "text")
    @JsonProperty("changelog")
    private String changelog;

    public FileMetadata() {
        if (this.versionId == null) {
            this.versionId = UUID.randomUUID();
        }
    }

    public FileMetadata(UUID versionId, UUID fileId, Integer verNo, String storagePath, LocalDateTime createdAt, String changelog) {
        this.versionId = versionId != null ? versionId : UUID.randomUUID();
        this.fileId = fileId;
        this.verNo = verNo != null ? verNo : 1;
        this.storagePath = storagePath;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.changelog = changelog;
    }

    public UUID getVersionId() { return versionId; }
    public void setVersionId(UUID versionId) { this.versionId = versionId; }

    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public Integer getVerNo() { return verNo; }
    public void setVerNo(Integer verNo) { this.verNo = verNo; }

    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getChangelog() { return changelog; }
    public void setChangelog(String changelog) { this.changelog = changelog; }
}
