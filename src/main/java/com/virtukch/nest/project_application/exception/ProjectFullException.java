package com.virtukch.nest.project_application.exception;


public class ProjectFullException extends RuntimeException {
    public ProjectFullException() {
        super("모집 인원을 초과하여 수락할 수 없습니다.");
    }
}
