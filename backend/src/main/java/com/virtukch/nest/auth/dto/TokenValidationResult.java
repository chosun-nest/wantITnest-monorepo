package com.virtukch.nest.auth.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TokenValidationResult {

    private final boolean valid;
    private final String message;
    private final TokenValidationErrorType errorType;
    private final Long memberId;

    /**
     * 성공 결과 생성
     */
    public static TokenValidationResult success(Long memberId) {
        return new TokenValidationResult(true, null, null, memberId);
    }

    /**
     * 실패 결과 생성 (기본 메시지 사용)
     */
    public static TokenValidationResult failure(TokenValidationErrorType errorType) {
        return new TokenValidationResult(false, errorType.getDefaultMessage(), errorType, null);
    }

    /**
     * 실패 결과 생성 (커스텀 메시지)
     */
    public static TokenValidationResult failure(TokenValidationErrorType errorType, String customMessage) {
        return new TokenValidationResult(false, customMessage, errorType, null);
    }
}