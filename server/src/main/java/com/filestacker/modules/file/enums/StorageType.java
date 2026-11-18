package com.filestacker.modules.file.enums;

public enum StorageType {
    LOCAL("local"),
    S3("s3"),
    SUPABASE("supabase");

    private final String value;

    StorageType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
