package com.virtukch.nest.post.exception;

public class InvalidPostTitleException extends RuntimeException {
    public InvalidPostTitleException() {
        super("게시글 제목은 비어 있을 수 없습니다.");
    }
}