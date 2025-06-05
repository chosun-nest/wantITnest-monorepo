package com.virtukch.nest.common.exception;

public class ImageDirectoryCreationException extends RuntimeException {

    public ImageDirectoryCreationException(String path) {
        super("이미지 디렉터리 생성에 실패했습니다. 경로: " + path);
    }
}