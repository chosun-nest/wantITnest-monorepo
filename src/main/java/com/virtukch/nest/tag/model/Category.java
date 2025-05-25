package com.virtukch.nest.tag.model;

public enum Category {
    DEVELOPMENT_PROGRAMMING("🖥️ 개발•프로그래밍"),
    ARTIFICIAL_INTELLIGENCE("🤖 인공지능"),
    DATA_SCIENCE("🥼 데이터 사이언스"),
    GAME_DEVELOPMENT("🎮 게임 개발"),
    SECURITY_NETWORK("🛡️ 보안•네트워크"),
    HARDWARE("💽 하드웨어"),
    DESIGN_ART("🎨 디자인•아트"),
    UNCATEGORIZED("미분류");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
