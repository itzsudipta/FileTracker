package com.filestacker.modules.system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StatsResponse {

    @JsonProperty("total_files")
    private long totalFiles;

    @JsonProperty("storage_used")
    private long storageUsed;

    @JsonProperty("storage_unit")
    private String storageUnit = "KB";

    public StatsResponse() {}

    public StatsResponse(long totalFiles, long storageUsed, String storageUnit) {
        this.totalFiles = totalFiles;
        this.storageUsed = storageUsed;
        this.storageUnit = storageUnit != null ? storageUnit : "KB";
    }

    public long getTotalFiles() { return totalFiles; }
    public void setTotalFiles(long totalFiles) { this.totalFiles = totalFiles; }

    public long getStorageUsed() { return storageUsed; }
    public void setStorageUsed(long storageUsed) { this.storageUsed = storageUsed; }

    public String getStorageUnit() { return storageUnit; }
    public void setStorageUnit(String storageUnit) { this.storageUnit = storageUnit; }
}
