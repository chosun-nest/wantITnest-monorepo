package com.virtukch.nest.project.exception;

public class CannotDeleteProjectException extends RuntimeException {
    public CannotDeleteProjectException(Long postId) {
        super("게시글을 삭제할 수 없습니다. ID: " + postId);
    }
}