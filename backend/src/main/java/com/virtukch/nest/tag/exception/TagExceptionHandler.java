package com.virtukch.nest.tag.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.tag")
public class TagExceptionHandler {
    // 유효하지 않은 태그 - 404 NOT_FOUND
    @ExceptionHandler(TagNotFoundException.class)
    public ResponseEntity<String> handleTagNotFound(TagNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 유효하지 않은 카테고리 - 404 NOT_FOUND
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<String> handleCategoryNotFound(CategoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
