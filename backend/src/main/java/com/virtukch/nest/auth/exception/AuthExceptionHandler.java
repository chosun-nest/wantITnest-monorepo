package com.virtukch.nest.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.auth")
public class AuthExceptionHandler {

    // 이메일 전송 실패 - 500 INTERNAL_SERVER_ERROR
    @ExceptionHandler(EmailCannotSendException.class)
    public ResponseEntity<String> handleEmailCannotSend(EmailCannotSendException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    // 이메일 인증 코드 만료 - 400 BAD_REQUEST
    @ExceptionHandler(EmailCodeExpiredException.class)
    public ResponseEntity<String> handleEmailCodeExpired(EmailCodeExpiredException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 유효하지 않은 토큰 - 401 UNAUTHORIZED
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<String> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }
}
