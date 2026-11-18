package com.filestacker.modules.fileaccess.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fileacces")
public class FileAccess {

    @Id
    @Column(name = "acces_id", nullable = false, updatable = false)
    @JsonProperty("acces_id")
    private UUID accesId;

    @Column(name = "file_id", nullable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "access_type", nullable = false, columnDefinition = "text")
    @JsonProperty("access_type")
    private String accessType = "private";

    @Column(name = "shared_with", nullable = false)
    @JsonProperty("shared_with")
    private UUID sharedWith;

    @Column(name = "expiry_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "max_download")
    @JsonProperty("max_download")
    private Integer maxDownload;

    @Column(name = "pwd_protect", nullable = false)
    @JsonProperty("pwd_protect")
    private Boolean pwdProtect = false;

    @Column(name = "access_status", nullable = false, columnDefinition = "text")
    @JsonProperty("access_status")
    private String accessStatus = "Active";

    public FileAccess() {
        if (this.accesId == null) {
            this.accesId = UUID.randomUUID();
        }
    }

    public FileAccess(UUID accesId, UUID fileId, String accessType, UUID sharedWith, LocalDateTime expiryDate, Integer maxDownload, Boolean pwdProtect, String accessStatus) {
        this.accesId = accesId != null ? accesId : UUID.randomUUID();
        this.fileId = fileId;
        this.accessType = accessType != null ? accessType : "private";
        this.sharedWith = sharedWith;
        this.expiryDate = expiryDate;
        this.maxDownload = maxDownload;
        this.pwdProtect = pwdProtect != null ? pwdProtect : false;
        this.accessStatus = accessStatus != null ? accessStatus : "Active";
    }

    public UUID getAccesId() { return accesId; }
    public void setAccesId(UUID accesId) { this.accesId = accesId; }

    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }

    public UUID getSharedWith() { return sharedWith; }
    public void setSharedWith(UUID sharedWith) { this.sharedWith = sharedWith; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public Integer getMaxDownload() { return maxDownload; }
    public void setMaxDownload(Integer maxDownload) { this.maxDownload = maxDownload; }

    public Boolean getPwdProtect() { return pwdProtect; }
    public void setPwdProtect(Boolean pwdProtect) { this.pwdProtect = pwdProtect; }

    public String getAccessStatus() { return accessStatus; }
    public void setAccessStatus(String accessStatus) { this.accessStatus = accessStatus; }
}
