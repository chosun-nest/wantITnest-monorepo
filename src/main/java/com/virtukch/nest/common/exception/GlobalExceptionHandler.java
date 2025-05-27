package com.virtukch.nest.common.exception;

import com.virtukch.nest.auth.exception.EmailAlreadyExistException;
import com.virtukch.nest.member.exception.MemberNotFoundException;
import com.virtukch.nest.post.exception.InvalidPostTitleException;
import com.virtukch.nest.post.exception.NoPostAuthorityException;
import com.virtukch.nest.post.exception.PostNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<String> handleEmailAlreadyExists(EmailAlreadyExistException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 게시글을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<String> handlePostNotFound(PostNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 게시글 권한 없음 - 403 FORBIDDEN
    @ExceptionHandler(NoPostAuthorityException.class)
    public ResponseEntity<String> handleNoPostAuthority(NoPostAuthorityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 유효하지 않은 게시글 제목 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidPostTitleException.class)
    public ResponseEntity<String> handleInvalidPostTitle(InvalidPostTitleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 회원을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<String> handleMemberNotFound(MemberNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
