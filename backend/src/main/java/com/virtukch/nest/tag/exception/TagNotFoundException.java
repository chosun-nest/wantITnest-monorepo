package com.virtukch.nest.tag.exception;

public class TagNotFoundException extends RuntimeException {
    public TagNotFoundException(String tagName) {
        super("존재하지 않는 태그입니다 : " + tagName);
    }

    public TagNotFoundException(Long tagId) {
        super("존재하지 않는 태그입니다 : " + tagId);
    }
}
