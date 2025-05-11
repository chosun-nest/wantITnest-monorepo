package com.virtukch.nest.tag.exception;

public class TagNotFoundException extends RuntimeException {
    public TagNotFoundException(String tagName) {
        super("존재하지 않는 태그입니다 : " + tagName);
    }

    public TagNotFoundException(Long tagId) {
        super("존재하지 않는 태그입니다 (기존에 존재했으나, 삭제되었을 가능성이 존재합니다.) : " + tagId);
    }
}
