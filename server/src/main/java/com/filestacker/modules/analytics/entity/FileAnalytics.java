package com.filestacker.modules.analytics.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_analytics")
public class FileAnalytics {

    @Id
    @Column(name = "anly_id", nullable = false, updatable = false)
    @JsonProperty("anly_id")
    private UUID anlyId;

    @Column(name = "file_id", nullable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "view_count", nullable = false)
    @JsonProperty("view_count")
    private Integer viewCount = 0;

    @Column(name = "download_count", nullable = false)
    @JsonProperty("download_count")
    private Integer downloadCount = 0;

    @Column(name = "last_accesed")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("last_accesed")
    private LocalDateTime lastAccesed;

    @Column(name = "unique_users")
    @JsonProperty("unique_users")
    private Integer uniqueUsers;

    public FileAnalytics() {
        if (this.anlyId == null) {
            this.anlyId = UUID.randomUUID();
        }
    }

    public FileAnalytics(UUID anlyId, UUID fileId, Integer viewCount, Integer downloadCount, LocalDateTime lastAccesed, Integer uniqueUsers) {
        this.anlyId = anlyId != null ? anlyId : UUID.randomUUID();
        this.fileId = fileId;
        this.viewCount = viewCount != null ? viewCount : 0;
        this.downloadCount = downloadCount != null ? downloadCount : 0;
        this.lastAccesed = lastAccesed;
        this.uniqueUsers = uniqueUsers;
    }

    public UUID getAnlyId() { return anlyId; }
    public void setAnlyId(UUID anlyId) { this.anlyId = anlyId; }

    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }

    public LocalDateTime getLastAccesed() { return lastAccesed; }
    public void setLastAccesed(LocalDateTime lastAccesed) { this.lastAccesed = lastAccesed; }

    public Integer getUniqueUsers() { return uniqueUsers; }
    public void setUniqueUsers(Integer uniqueUsers) { this.uniqueUsers = uniqueUsers; }
}
