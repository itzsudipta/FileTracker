package com.filestacker.modules.user.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_data")
public class User {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    @JsonProperty("user_id")
    private UUID userId;

    @Column(name = "org_id", nullable = false)
    @JsonProperty("org_id")
    private UUID orgId;

    @Column(name = "user_name", nullable = false, columnDefinition = "text")
    @JsonProperty("user_name")
    private String userName;

    @Column(name = "user_email", nullable = false, columnDefinition = "text")
    @JsonProperty("user_email")
    private String userEmail;

    @Column(name = "u_role", nullable = false, columnDefinition = "text")
    @JsonProperty("u_role")
    private String role = "admin";

    @Column(name = "joined_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("joined_at")
    private LocalDateTime joinedAt = LocalDateTime.now();

    @Column(name = "login_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("login_at")
    private LocalDateTime loginAt = LocalDateTime.now();

    @Column(name = "is_active", nullable = false)
    @JsonProperty("is_active")
    private Boolean isActive = true;

    public User() {
        if (this.userId == null) {
            this.userId = UUID.randomUUID();
        }
    }

    public User(UUID userId, UUID orgId, String userName, String userEmail, String role, LocalDateTime joinedAt, Boolean isActive) {
        this.userId = userId != null ? userId : UUID.randomUUID();
        this.orgId = orgId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.role = role != null ? role : "admin";
        this.joinedAt = joinedAt != null ? joinedAt : LocalDateTime.now();
        this.loginAt = LocalDateTime.now();
        this.isActive = isActive != null ? isActive : true;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getOrgId() {
        return orgId;
    }

    public void setOrgId(UUID orgId) {
        this.orgId = orgId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }

    public void setLoginAt(LocalDateTime loginAt) {
        this.loginAt = loginAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

}
