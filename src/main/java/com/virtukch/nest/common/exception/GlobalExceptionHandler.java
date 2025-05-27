package com.virtukch.nest.common.exception;

import com.virtukch.nest.auth.exception.EmailAlreadyExistException;
import com.virtukch.nest.comment.exception.*;
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

    // 댓글을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<String> handleCommentNotFound(CommentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 댓글 권한 없음 - 403 FORBIDDEN
    @ExceptionHandler(NoCommentAuthorityException.class)
    public ResponseEntity<String> handleNoCommentAuthority(NoCommentAuthorityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    // 유효하지 않은 댓글 내용 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidCommentContentException.class)
    public ResponseEntity<String> handleInvalidCommentContent(InvalidCommentContentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 유효하지 않은 게시판 타입 - 400 BAD_REQUEST
    @ExceptionHandler(InvalidBoardTypeException.class)
    public ResponseEntity<String> handleInvalidBoardType(InvalidBoardTypeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 부모 댓글을 찾을 수 없음 - 404 NOT_FOUND
    @ExceptionHandler(ParentCommentNotFoundException.class)
    public ResponseEntity<String> handleParentCommentNotFound(ParentCommentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // 부모 댓글과 게시글 불일치 - 400 BAD_REQUEST
    @ExceptionHandler(ParentCommentMismatchException.class)
    public ResponseEntity<String> handleParentCommentMismatch(ParentCommentMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // 삭제된 댓글에 대댓글 불가 - 400 BAD_REQUEST
    @ExceptionHandler(CannotReplyToDeletedCommentException.class)
    public ResponseEntity<String> handleCannotReplyToDeletedComment(CannotReplyToDeletedCommentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
