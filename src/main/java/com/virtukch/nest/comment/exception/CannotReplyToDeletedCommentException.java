package com.virtukch.nest.comment.exception;

public class CannotReplyToDeletedCommentException extends RuntimeException {
    public CannotReplyToDeletedCommentException(Long parentId) {
        super("삭제된 댓글에는 대댓글을 달 수 없습니다. 부모 댓글 ID: " + parentId);
    }
}
