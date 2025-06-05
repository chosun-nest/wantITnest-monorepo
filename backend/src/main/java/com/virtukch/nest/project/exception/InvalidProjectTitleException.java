package com.virtukch.nest.project.exception;

public class InvalidProjectTitleException extends RuntimeException {
    public InvalidProjectTitleException() {
        super("게시글 제목은 비어 있을 수 없습니다.");
    }
}