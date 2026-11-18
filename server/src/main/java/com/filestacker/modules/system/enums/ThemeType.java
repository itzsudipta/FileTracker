package com.filestacker.modules.system.enums;

public enum ThemeType {
    LIGHT("light"),
    DARK("dark"),
    SYSTEM("system");

    private final String value;

    ThemeType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
