package com.filestacker.modules.plan.enums;

public enum PlanTier {
    FREE("Free"),
    PRO("Pro Plan"),
    ENTERPRISE("Enterprise");

    private final String tierName;

    PlanTier(String tierName) {
        this.tierName = tierName;
    }

    public String getTierName() {
        return tierName;
    }
}
