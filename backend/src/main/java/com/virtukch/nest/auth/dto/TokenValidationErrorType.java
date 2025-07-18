package com.virtukch.nest.auth.dto;

import lombok.Getter;

/**
 * JWT 토큰 검증 오류 유형을 정의하는 enum
 */
public enum TokenValidationErrorType {
    EXPIRED("토큰이 만료되었습니다."),
    INVALID("유효하지 않은 토큰입니다."),
    BLACKLISTED("사용할 수 없는 토큰입니다."),
    USER_NOT_FOUND("사용자 정보를 찾을 수 없습니다."),
    UNKNOWN("인증 처리 중 오류가 발생했습니다.");

    private final String defaultMessage;

    TokenValidationErrorType(String defaultMessage) {
        this.defaultMessage = defaultMessage;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}