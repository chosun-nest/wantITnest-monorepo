package com.virtukch.nest.comment.exception;

public class CannotDeleteCommentException extends RuntimeException {
    public CannotDeleteCommentException(Long commentId) {
        super("댓글을 삭제할 수 없습니다. commentId=" + commentId);
    }

    public CannotDeleteCommentException(Long commentId, Throwable cause) {
        super("댓글을 삭제할 수 없습니다. commentId=" + commentId, cause);
    }
}
