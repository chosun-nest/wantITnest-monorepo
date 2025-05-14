package com.virtukch.nest.notice.exception;

/**
 * 공지사항 관련 예외의 기본 클래스
 */
public class NoticeException extends RuntimeException {

    public NoticeException(String message) {
        super(message);
    }

    public NoticeException(String message, Throwable cause) {
        super(message, cause);
    }
}
