package com.virtukch.nest.project_application.exception;

public class DuplicateApplicationException extends RuntimeException {
    public DuplicateApplicationException() {
        super("이미 해당 파트에 지원한 상태입니다.");
    }
}
