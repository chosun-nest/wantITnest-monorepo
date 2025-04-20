package com.virtukch.nest.common.exception;

public class ImageUploadFailedException extends RuntimeException {

    public ImageUploadFailedException(String filename, Throwable cause) {
        super("이미지 업로드에 실패했습니다: " + filename, cause);
    }
}