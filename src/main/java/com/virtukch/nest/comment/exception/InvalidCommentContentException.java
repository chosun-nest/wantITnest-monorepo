package com.virtukch.nest.comment.exception;

public class InvalidCommentContentException extends RuntimeException {
    public InvalidCommentContentException() {
        super("댓글 내용은 비어 있을 수 없습니다.");
    }
    
    public InvalidCommentContentException(String message) {
        super(message);
    }
}
