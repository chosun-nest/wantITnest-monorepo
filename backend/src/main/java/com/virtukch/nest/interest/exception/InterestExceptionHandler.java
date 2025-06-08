package com.virtukch.nest.interest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.interest")
public class InterestExceptionHandler {

    // 관심분야를 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(InterestNotFoundException.class)
    public ResponseEntity<String> handleInterestNotFound(InterestNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
