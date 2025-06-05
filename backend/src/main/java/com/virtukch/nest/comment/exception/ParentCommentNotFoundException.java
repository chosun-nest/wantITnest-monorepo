package com.virtukch.nest.comment.exception;

public class ParentCommentNotFoundException extends RuntimeException {
    public ParentCommentNotFoundException(Long parentId) {
        super("부모 댓글을 찾을 수 없습니다. ID: " + parentId);
    }
}
