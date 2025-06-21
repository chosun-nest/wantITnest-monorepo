package com.virtukch.nest.follow.exception;

import com.virtukch.nest.member.exception.MemberNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.virtukch.nest.follow")
public class FollowExceptionHandler {

    // 자기 자신 팔로우 시도 - 400 BAD_REQUEST
    @ExceptionHandler(SelfFollowException.class)
    public ResponseEntity<String> handleSelfFollow(SelfFollowException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 이미 팔로우 중인 사용자 팔로우 시도 - 409 CONFLICT
    @ExceptionHandler(AlreadyFollowingException.class)
    public ResponseEntity<String> handleAlreadyFollowing(AlreadyFollowingException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 팔로우 관계가 존재하지 않음 - 404 NOT_FOUND
    @ExceptionHandler(FollowRelationshipNotFoundException.class)
    public ResponseEntity<String> handleFollowRelationshipNotFound(FollowRelationshipNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 회원을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<String> handleMemberNotFound(MemberNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 팔로우 관련 일반 예외 - 400 BAD_REQUEST
    @ExceptionHandler(FollowException.class)
    public ResponseEntity<String> handleFollowException(FollowException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
