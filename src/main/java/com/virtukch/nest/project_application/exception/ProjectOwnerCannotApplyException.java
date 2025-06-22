package com.virtukch.nest.project_application.exception;

public class ProjectOwnerCannotApplyException extends RuntimeException {
    public ProjectOwnerCannotApplyException() {
        super("프로젝트 작성자는 해당 프로젝트에 지원할 수 없습니다.");
    }
}
