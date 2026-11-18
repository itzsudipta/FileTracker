package com.filestacker.modules.fileaccess.enums;

public enum AccessStatus {
    ACTIVE("Active"),
    EXPIRED("Expired"),
    REVOKED("Revoked");

    private final String value;

    AccessStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
