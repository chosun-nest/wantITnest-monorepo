package com.virtukch.nest.project_application.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.project_application")
public class ProjectApplicationsExceptionHandler {
    @ExceptionHandler(AlreadyProcessedApplicationException.class)
    public ResponseEntity<String> handleAlreadyProcessedApplication(AlreadyProcessedApplicationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage()); // 메시지: "이미 처리된 지원서입니다."
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<String> handlerApplicationNotFound(ApplicationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // 메시지 "지원서를 찾을 수 없습니다."
    }

    @ExceptionHandler(ProjectFullException.class)
    public ResponseEntity<String> handleProjectFull(ProjectFullException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(NotProjectOwnerException.class)
    public ResponseEntity<String> handleNotProjectOwner(NotProjectOwnerException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateApplicationException.class)
    public ResponseEntity<String> handleDuplicateApplication(DuplicateApplicationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<String> handleProjectNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ProjectOwnerCannotApplyException.class)
    public ResponseEntity<String> handleProjectOwnerCannotApply(ProjectOwnerCannotApplyException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
