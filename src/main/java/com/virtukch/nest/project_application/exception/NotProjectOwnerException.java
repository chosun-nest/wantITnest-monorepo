package com.virtukch.nest.project_application.exception;

public class NotProjectOwnerException extends RuntimeException{
    public NotProjectOwnerException() {
        super("해당 프로젝트의 작성자만 지원서를 처리할 수 있습니다.");
    }
}
