package com.virtukch.nest.tag.model;

public enum Category {
    DEVELOPMENT_PROGRAMMING("🖥️ 개발•프로그래밍", "development-programming"),
    ARTIFICIAL_INTELLIGENCE("🤖 인공지능", "artificial-intelligence"),
    DATA_SCIENCE("🥼 데이터 사이언스", "data-science"),
    GAME_DEVELOPMENT("🎮 게임 개발", "game-development"),
    SECURITY_NETWORK("🛡️ 보안•네트워크", "security-network"),
    HARDWARE("💽 하드웨어", "hardware"),
    DESIGN_ART("🎨 디자인•아트", "design-art"),
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
