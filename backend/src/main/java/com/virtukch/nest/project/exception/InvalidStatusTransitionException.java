package com.virtukch.nest.project.exception;

import com.virtukch.nest.project.model.enums.ProjectStatus;

/**
 * 비즈니스 규칙 위반 예외
 */
public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(ProjectStatus from, ProjectStatus to) {
        super(String.format("프로젝트 상태를 %s에서 %s로 변경할 수 없습니다.",
                from.name(), to.name()));
    }
}