package com.virtukch.nest.tag.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String categoryName) {
        super("존재하지 않는 카테고리 이름입니다 : " + categoryName);
    }
}
