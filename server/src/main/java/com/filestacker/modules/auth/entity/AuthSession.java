package com.filestacker.modules.auth.entity;

import java.time.LocalDateTime;
import java.util.UUID;

public class AuthSession {
    private String accessToken;
    private String refreshToken;
    private UUID userId;
    private String email;
    private LocalDateTime expiresAt;

    public AuthSession() {}

    public AuthSession(String accessToken, String refreshToken, UUID userId, String email, LocalDateTime expiresAt) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.email = email;
        this.expiresAt = expiresAt;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
