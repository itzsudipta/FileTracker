package com.filestacker.modules.organization.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "org")
public class Organization {

    @Id
    @Column(name = "org_id", nullable = false, updatable = false)
    @JsonProperty("org_id")
    private UUID orgId;

    @Column(name = "org_name", nullable = false)
    @JsonProperty("org_name")
    private String orgName;

    @Column(name = "domain_name", nullable = false)
    @JsonProperty("domain_name")
    private String domainName = "@abc.org";

    @Column(name = "plan_id")
    @JsonProperty("plan_id")
    private UUID planId;

    @Column(name = "created_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "storage_limit", nullable = false)
    @JsonProperty("storage_limit")
    private String storageLimit = "10GB";

    public Organization() {
        if (this.orgId == null) {
            this.orgId = UUID.randomUUID();
        }
    }

    public Organization(UUID orgId, String orgName, String domainName, UUID planId, LocalDateTime createdAt, String storageLimit) {
        this.orgId = orgId != null ? orgId : UUID.randomUUID();
        this.orgName = orgName;
        this.domainName = domainName != null ? domainName : "@abc.org";
        this.planId = planId;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.storageLimit = storageLimit != null ? storageLimit : "10GB";
    }

    public UUID getOrgId() {
        return orgId;
    }

    public void setOrgId(UUID orgId) {
        this.orgId = orgId;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public UUID getPlanId() {
        return planId;
    }

    public void setPlanId(UUID planId) {
        this.planId = planId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStorageLimit() {
        return storageLimit;
    }

    public void setStorageLimit(String storageLimit) {
        this.storageLimit = storageLimit;
    }
}
