package com.filestacker.modules.activitylog.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "actv_log")
public class ActivityLog {

    @Id
    @Column(name = "log_id", nullable = false, updatable = false)
    @JsonProperty("log_id")
    private UUID logId;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private UUID userId;

    @Column(name = "file_id", nullable = false)
    @JsonProperty("file_id")
    private UUID fileId;

    @Column(name = "action_log", nullable = false, columnDefinition = "text")
    @JsonProperty("action_log")
    private String actionLog;

    @Column(name = "log_time", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("log_time")
    private LocalDateTime logTime = LocalDateTime.now();

    @Column(name = "ip_add", columnDefinition = "text")
    @JsonProperty("ip_add")
    private String ipAdd;

    @Column(name = "descrp", columnDefinition = "text")
    @JsonProperty("descrp")
    private String descrp;

    public ActivityLog() {
        if (this.logId == null) {
            this.logId = UUID.randomUUID();
        }
    }

    public ActivityLog(UUID logId, UUID userId, UUID fileId, String actionLog, LocalDateTime logTime, String ipAdd, String descrp) {
        this.logId = logId != null ? logId : UUID.randomUUID();
        this.userId = userId;
        this.fileId = fileId;
        this.actionLog = actionLog;
        this.logTime = logTime != null ? logTime : LocalDateTime.now();
        this.ipAdd = ipAdd;
        this.descrp = descrp;
    }

    public UUID getLogId() { return logId; }
    public void setLogId(UUID logId) { this.logId = logId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getFileId() { return fileId; }
    public void setFileId(UUID fileId) { this.fileId = fileId; }

    public String getActionLog() { return actionLog; }
    public void setActionLog(String actionLog) { this.actionLog = actionLog; }

    public LocalDateTime getLogTime() { return logTime; }
    public void setLogTime(LocalDateTime logTime) { this.logTime = logTime; }

    public String getIpAdd() { return ipAdd; }
    public void setIpAdd(String ipAdd) { this.ipAdd = ipAdd; }

    public String getDescrp() { return descrp; }
    public void setDescrp(String descrp) { this.descrp = descrp; }
}
