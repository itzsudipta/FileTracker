package com.filestacker.modules.file.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SignedUrlResponse {

    @JsonProperty("filename")
    private String filename;

    @JsonProperty("signed_url")
    private String signedUrl;

    public SignedUrlResponse() {}

    public SignedUrlResponse(String filename, String signedUrl) {
        this.filename = filename;
        this.signedUrl = signedUrl;
    }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getSignedUrl() { return signedUrl; }
    public void setSignedUrl(String signedUrl) { this.signedUrl = signedUrl; }
}
