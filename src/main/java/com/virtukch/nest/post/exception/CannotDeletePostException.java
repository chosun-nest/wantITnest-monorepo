package com.virtukch.nest.post.exception;

public class CannotDeletePostException extends RuntimeException {
    public CannotDeletePostException(Long postId) {
        super("게시글을 삭제할 수 없습니다. ID: " + postId);
    }
}