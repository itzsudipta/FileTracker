package com.filestacker.modules.user.enums;

public enum UserRole {
    ADMIN("admin"),
    USER("user");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserRole fromString(String text) {
        for (UserRole b : UserRole.values()) {
            if (b.value.equalsIgnoreCase(text)) {
                return b;
            }
        }
        return USER;
    }
}
