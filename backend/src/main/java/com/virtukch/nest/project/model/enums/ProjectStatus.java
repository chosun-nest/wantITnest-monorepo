package com.virtukch.nest.project.model.enums;

import lombok.Getter;

@Getter
public enum ProjectStatus {
    RECRUITING("모집 중"),
    CLOSED("모집 종료"),
    IN_PROGRESS("프로젝트 진행중"),
    COMPLETED("프로젝트 완료"),
    DELETED("프로젝트 삭제");

    private final String displayName;

    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}