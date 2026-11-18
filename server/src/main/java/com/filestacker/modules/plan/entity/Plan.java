package com.filestacker.modules.plan.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plan")
public class Plan {

    @Id
    @Column(name = "plan_id", nullable = false, updatable = false)
    @JsonProperty("plan_id")
    private UUID planId;

    @Column(name = "plan_name", nullable = false, columnDefinition = "text")
    @JsonProperty("plan_name")
    private String planName;

    @Column(name = "storage_limit", nullable = false)
    @JsonProperty("storage_limit")
    private Integer storageLimit;

    @Column(name = "api_limit")
    @JsonProperty("api_limit")
    private Integer apiLimit;

    @Column(name = "price_per_mnth", nullable = false, precision = 10, scale = 2)
    @JsonProperty("price_per_mnth")
    private BigDecimal pricePerMnth;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "plan_ai_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature", columnDefinition = "text")
    @JsonProperty("ai_feature")
    private List<String> aiFeature;

    public Plan() {
        if (this.planId == null) {
            this.planId = UUID.randomUUID();
        }
    }

    public Plan(UUID planId, String planName, Integer storageLimit, Integer apiLimit, BigDecimal pricePerMnth, List<String> aiFeature) {
        this.planId = planId != null ? planId : UUID.randomUUID();
        this.planName = planName;
        this.storageLimit = storageLimit;
        this.apiLimit = apiLimit;
        this.pricePerMnth = pricePerMnth;
        this.aiFeature = aiFeature;
    }

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public Integer getStorageLimit() { return storageLimit; }
    public void setStorageLimit(Integer storageLimit) { this.storageLimit = storageLimit; }

    public Integer getApiLimit() { return apiLimit; }
    public void setApiLimit(Integer apiLimit) { this.apiLimit = apiLimit; }

    public BigDecimal getPricePerMnth() { return pricePerMnth; }
    public void setPricePerMnth(BigDecimal pricePerMnth) { this.pricePerMnth = pricePerMnth; }

    public List<String> getAiFeature() { return aiFeature; }
    public void setAiFeature(List<String> aiFeature) { this.aiFeature = aiFeature; }
}
