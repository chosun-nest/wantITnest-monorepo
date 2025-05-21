package com.virtukch.nest.notice.exception;

/**
 * 공지사항 처리 중 발생하는 예외
 */
public class NoticeProcessingException extends NoticeException {

    public NoticeProcessingException(String message) {
        super(message);
    }

    public NoticeProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}