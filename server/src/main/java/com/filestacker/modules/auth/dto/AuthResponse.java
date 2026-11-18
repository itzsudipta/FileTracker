package com.filestacker.modules.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;

public class AuthResponse {

    @JsonProperty("message")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;

    @JsonProperty("user")
    private AuthUserResponse user;

    @JsonProperty("expires_at")
    private final long expiresAt;

    public AuthResponse(String message, AuthUserResponse user, long expiresAt) {
        this.message = message;
        this.user = user;
        this.expiresAt = expiresAt;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public AuthUserResponse getUser() { return user; }
    public void setUser(AuthUserResponse user) { this.user = user; }

    public long getExpiresAt() { return expiresAt; }
}
