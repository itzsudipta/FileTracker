package com.filestacker.modules.subscription.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscrip")
public class Subscription {

    @Id
    @Column(name = "subscrip_id", nullable = false, updatable = false)
    @JsonProperty("subscrip_id")
    private UUID subscripId;

    @Column(name = "org_id", nullable = false)
    @JsonProperty("org_id")
    private UUID orgId;

    @Column(name = "plan_id", nullable = false)
    @JsonProperty("plan_id")
    private UUID planId;

    @Column(name = "start_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("start_date")
    private LocalDateTime startDate = LocalDateTime.now();

    @Column(name = "end_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("end_date")
    private LocalDateTime endDate;

    @Column(name = "status", nullable = false, columnDefinition = "text")
    @JsonProperty("status")
    private String status = "active";

    public Subscription() {
        if (this.subscripId == null) {
            this.subscripId = UUID.randomUUID();
        }
    }

    public Subscription(UUID subscripId, UUID orgId, UUID planId, LocalDateTime startDate, LocalDateTime endDate, String status) {
        this.subscripId = subscripId != null ? subscripId : UUID.randomUUID();
        this.orgId = orgId;
        this.planId = planId;
        this.startDate = startDate != null ? startDate : LocalDateTime.now();
        this.endDate = endDate;
        this.status = status != null ? status : "active";
    }

    public UUID getSubscripId() { return subscripId; }
    public void setSubscripId(UUID subscripId) { this.subscripId = subscripId; }

    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
