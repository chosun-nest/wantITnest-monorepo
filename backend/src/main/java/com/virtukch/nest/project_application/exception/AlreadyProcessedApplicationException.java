package com.virtukch.nest.project_application.exception;

public class AlreadyProcessedApplicationException extends RuntimeException {
    public AlreadyProcessedApplicationException() {
        super("이미 처리된 지원서입니다.");
    }
}