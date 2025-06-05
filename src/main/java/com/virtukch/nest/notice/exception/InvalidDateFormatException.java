package com.virtukch.nest.notice.exception;

/**
 * 날짜 형식이 올바르지 않을 때 발생하는 예외
 */
public class InvalidDateFormatException extends RuntimeException {
    public InvalidDateFormatException(String dateString, Throwable cause) {
        super("날짜 형식이 올바르지 않습니다: " + dateString);
    }
}
