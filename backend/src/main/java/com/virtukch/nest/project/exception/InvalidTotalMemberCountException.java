package com.virtukch.nest.project.exception;

public class InvalidTotalMemberCountException extends RuntimeException {
  public InvalidTotalMemberCountException(Integer providedCount) {
    super(String.format("프로젝트 총 모집 인원이 유효하지 않습니다. (입력값: %d명)", providedCount));
  }
}