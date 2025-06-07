package com.virtukch.nest.tech_stack.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.tech_stack")
public class TechStackExceptionHandler {

    // 기술스택을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(TechStackNotFoundException.class)
    public ResponseEntity<String> handleTechStackNotFound(TechStackNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}