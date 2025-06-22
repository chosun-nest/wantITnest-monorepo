package com.virtukch.nest.project.exception;

public class CanNotRemoveCreatorException extends RuntimeException {
    public CanNotRemoveCreatorException() {
        super("작성자는 프로젝트 멤버에서 제거될 수 없습니다.");
    }
}
