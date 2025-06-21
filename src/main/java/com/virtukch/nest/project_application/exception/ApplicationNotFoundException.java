package com.virtukch.nest.project_application.exception;

public class ApplicationNotFoundException extends RuntimeException{
    public ApplicationNotFoundException() {
        super("지원서를 찾을 수 없습니다.");
    }
}
