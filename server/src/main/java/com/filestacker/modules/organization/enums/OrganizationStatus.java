package com.filestacker.modules.organization.enums;

public enum OrganizationStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    SUSPENDED("Suspended");

    private final String value;

    OrganizationStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
