package com.filestacker.modules.file.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_data")
public class FileInfo {

    @Id
    @Column(name = "file_id", nullable = false, updatable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "owner_id", nullable = false)
    @JsonProperty("owner_id")
    private UUID ownerId;

    @Column(name = "org_id", nullable = false)
    @JsonProperty("org_id")
    private UUID orgId;

    @Column(name = "filename", nullable = false, columnDefinition = "text")
    @JsonProperty("filename")
    private String filename;

    @Column(name = "storage_path", nullable = false, columnDefinition = "text")
    @JsonProperty("storage_path")
    private String storagePath;

    @Column(name = "file_type", nullable = false, columnDefinition = "text")
    @JsonProperty("file_type")
    private String fileType;

    @Column(name = "file_size", nullable = false)
    @JsonProperty("file_size")
    private Long fileSize;

    @Column(name = "checksum", columnDefinition = "text")
    @JsonProperty("checksum")
    private String checksum;

    @Column(name = "uploaded_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column(name = "is_deleted", nullable = false)
    @JsonProperty("is_deleted")
    private Boolean isDeleted = false;

    public FileInfo() {
        if (this.fileId == null) {
            this.fileId = UUID.randomUUID();
        }
    }

    public FileInfo(UUID fileId, UUID ownerId, UUID orgId, String filename, String storagePath, String fileType, Long fileSize, String checksum, LocalDateTime uploadedAt, Boolean isDeleted) {
        this.fileId = fileId != null ? fileId : UUID.randomUUID();
        this.ownerId = ownerId;
        this.orgId = orgId;
        this.filename = filename;
        this.storagePath = storagePath;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.checksum = checksum;
        this.uploadedAt = uploadedAt != null ? uploadedAt : LocalDateTime.now();
        this.isDeleted = isDeleted != null ? isDeleted : false;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public UUID getOrgId() {
        return orgId;
    }

    public void setOrgId(UUID orgId) {
        this.orgId = orgId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public void setStoragePath(String storagePath) {
        this.storagePath = storagePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean deleted) {
        isDeleted = deleted;
    }
}
