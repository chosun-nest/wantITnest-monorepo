package com.virtukch.nest.tag.model;

public enum Category {
    PROGRAMMING("프로그래밍", "programming"),
    AI("인공지능", "ai"),
    WEB_DEVELOPMENT("웹개발", "web-development"),
    DATABASE("데이터베이스", "database"),
    GAME_DEVELOPMENT("게임개발", "game-development"),
    COMPUTER_SCIENCE("컴퓨터과학", "computer-science"),
    UNCATEGORIZED("미분류", "uncategorized");

    private final String displayName;
    private final String pathName;

    Category(String displayName, String pathName) {
        this.displayName = displayName;
        this.pathName = pathName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPathName() {
        return pathName;
    }

    // PathVariable로 들어온 경로명으로 Category 찾기
    public static Category findByPathName(String pathName) {
        for (Category category : values()) {
            if (category.getPathName().equalsIgnoreCase(pathName)) {
                return category;
            }
        }
        return UNCATEGORIZED;
    }
}