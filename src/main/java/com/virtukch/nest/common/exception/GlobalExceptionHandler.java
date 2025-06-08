package com.virtukch.nest.common.exception;

import com.virtukch.nest.auth.exception.EmailAlreadyExistException;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 이메일 중복 - 409 CONFLICT
    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<String> handleEmailAlreadyExists(EmailAlreadyExistException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 회원을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<String> handleMemberNotFound(MemberNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 이미지 업로드 실패 - 500 INTERNAL_SERVER_ERROR
    @ExceptionHandler(ImageUploadFailedException.class)
    public ResponseEntity<String> handleImageUploadFailed(ImageUploadFailedException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    // 이미지 디렉토리 생성 실패 - 500 INTERNAL_SERVER_ERROR
    @ExceptionHandler(ImageDirectoryCreationException.class)
    public ResponseEntity<String> handleImageDirectoryCreationFailed(ImageDirectoryCreationException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
