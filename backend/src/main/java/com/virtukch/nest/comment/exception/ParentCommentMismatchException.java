package com.virtukch.nest.comment.exception;

public class ParentCommentMismatchException extends RuntimeException {
    public ParentCommentMismatchException(Long parentId, Long postId) {
        super(String.format("부모 댓글 [%d]과 게시글 [%d]이 일치하지 않습니다.", parentId, postId));
    }
}
