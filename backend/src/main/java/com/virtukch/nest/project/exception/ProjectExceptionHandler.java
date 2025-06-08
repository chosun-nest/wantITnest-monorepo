package com.virtukch.nest.project.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.project")
public class ProjectExceptionHandler {

    // 프로젝트를 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<String> handleProjectNotFound(ProjectNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 프로젝트 권한 없음 - 403 FORBIDDEN
    @ExceptionHandler(NoProjectAuthorityException.class)
    public ResponseEntity<String> handleNoProjectAuthority(NoProjectAuthorityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 유효하지 않은 프로젝트 제목 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidProjectTitleException.class)
    public ResponseEntity<String> handleInvalidProjectTitle(InvalidProjectTitleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 프로젝트 삭제 불가 - 400 BAD_REQUEST
    @ExceptionHandler(CannotDeleteProjectException.class)
    public ResponseEntity<String> handleCannotDeleteProject(CannotDeleteProjectException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
