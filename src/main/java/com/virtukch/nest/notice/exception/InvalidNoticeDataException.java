package com.virtukch.nest.notice.exception;

/**
 * 유효하지 않은 공지사항 데이터에 대한 예외
 */
public class InvalidNoticeDataException extends NoticeException {

  public InvalidNoticeDataException(String message) {
    super(message);
  }

  public InvalidNoticeDataException(String field, Object value) {
    super(String.format("유효하지 않은 공지사항 데이터입니다. %s: %s", field, value));
  }
}