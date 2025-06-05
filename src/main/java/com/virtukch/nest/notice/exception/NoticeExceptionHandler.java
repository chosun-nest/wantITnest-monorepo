package com.virtukch.nest.notice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.notice")
public class NoticeExceptionHandler {
    // 유효하지 않은 공지사항 데이터 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidNoticeDataException.class)
    public ResponseEntity<String> handleInvalidNoticeData(InvalidNoticeDataException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 유효하지 않은 공지사항 유형 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidNoticeTypeException.class)
    public ResponseEntity<String> handleInvalidNoticeType(InvalidNoticeTypeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 유효하지 않은 날짜 형식 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidDateFormatException.class)
    public ResponseEntity<String> handleInvalidDateFormat(InvalidDateFormatException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
