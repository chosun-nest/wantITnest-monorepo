package com.virtukch.nest.notice.exception;

/**
 * 유효하지 않은 공지사항 유형일 때 발생하는 예외
 */
public class InvalidNoticeTypeException extends RuntimeException {
    public InvalidNoticeTypeException(String msg) {
        super(msg);
    }
}
