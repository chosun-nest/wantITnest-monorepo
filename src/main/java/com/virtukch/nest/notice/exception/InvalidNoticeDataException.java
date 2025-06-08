package com.virtukch.nest.notice.exception;

/**
 * 유효하지 않은 공지사항 데이터에 대한 예외
 */
public class InvalidNoticeDataException extends RuntimeException {

    public InvalidNoticeDataException(String message) {
        super(message);
    }
}