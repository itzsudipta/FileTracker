package com.filestacker.modules.filemetadata.enums;

public enum VersionChangeType {
    INITIAL_UPLOAD("Initial Upload"),
    CONTENT_UPDATE("Content Update"),
    METADATA_UPDATE("Metadata Update"),
    ROLLBACK("Rollback");

    private final String description;

    VersionChangeType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
