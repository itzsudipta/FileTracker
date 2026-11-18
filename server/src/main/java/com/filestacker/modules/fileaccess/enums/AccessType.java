package com.filestacker.modules.fileaccess.enums;

public enum AccessType {
    PUBLIC("public"),
    PRIVATE("private"),
    RESTRICTED("restricted");

    private final String value;

    AccessType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
