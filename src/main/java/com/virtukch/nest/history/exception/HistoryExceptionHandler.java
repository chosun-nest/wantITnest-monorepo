package com.virtukch.nest.history.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.history")
public class HistoryExceptionHandler {

    // 히스토리를 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(HistoryNotFoundException.class)
    public ResponseEntity<String> handleHistoryNotFound(HistoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 히스토리 접근 거부 - 403 FORBIDDEN
    @ExceptionHandler(HistoryAccessDeniedException.class)
    public ResponseEntity<String> handleHistoryAccessDenied(HistoryAccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 중복 히스토리 생성 - 409 CONFLICT
    @ExceptionHandler(DuplicateHistoryCreationException.class)
    public ResponseEntity<String> handleDuplicateHistoryCreation(DuplicateHistoryCreationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 중복 히스토리 ID - 409 CONFLICT
    @ExceptionHandler(DuplicateHistoryIdException.class)
    public ResponseEntity<String> handleDuplicateHistoryId(DuplicateHistoryIdException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 빈 히스토리 생성 - 400 BAD_REQUEST
    @ExceptionHandler(EmptyHistoryCreationException.class)
    public ResponseEntity<String> handleEmptyHistoryCreation(EmptyHistoryCreationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 빈 히스토리 수정 - 400 BAD_REQUEST
    @ExceptionHandler(EmptyHistoryUpdateException.class)
    public ResponseEntity<String> handleEmptyHistoryUpdate(EmptyHistoryUpdateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 빈 히스토리 삭제 - 400 BAD_REQUEST
    @ExceptionHandler(EmptyHistoryDeleteException.class)
    public ResponseEntity<String> handleEmptyHistoryDelete(EmptyHistoryDeleteException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
