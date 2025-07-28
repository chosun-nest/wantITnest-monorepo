package com.virtukch.nest.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * API 공통 응답 DTO
 * 모든 API 응답에 일관된 형태를 제공합니다.
 *
 * @param <T> 응답 데이터 타입
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDto<T> {

    /**
     * 요청 성공 여부
     */
    private boolean success;

    /**
     * 응답 메시지
     */
    private String message;

    /**
     * 응답 데이터
     */
    private T data;

    /**
     * 에러 코드 (실패시에만)
     */
    private String errorCode;

    /**
     * 응답 시간
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    // ==================== 성공 응답 팩토리 메서드 ====================

    /**
     * 데이터가 있는 성공 응답
     */
    public static <T> ApiResponseDto<T> success(String message, T data) {
        return new ApiResponseDto<>(
                true,
                message,
                data,
                null,
                LocalDateTime.now()
        );
    }

    /**
     * 데이터가 없는 성공 응답 (Void용)
     */
    public static ApiResponseDto<Void> success(String message) {
        return success(message, null);
    }

    /**
     * 기본 성공 응답 (메시지도 기본값)
     */
    public static <T> ApiResponseDto<T> success(T data) {
        return success("요청이 성공적으로 처리되었습니다.", data);
    }

    /**
     * 메시지와 데이터 모두 기본값인 성공 응답
     */
    public static ApiResponseDto<Void> success() {
        return success("요청이 성공적으로 처리되었습니다.");
    }

    // ==================== 실패 응답 팩토리 메서드 ====================

    /**
     * 에러 코드와 메시지가 있는 실패 응답
     */
    public static <T> ApiResponseDto<T> failure(String errorCode, String message, T data) {
        return new ApiResponseDto<>(
                false,
                message,
                data,
                errorCode,
                LocalDateTime.now()
        );
    }

    /**
     * 에러 코드와 메시지만 있는 실패 응답
     */
    public static ApiResponseDto<Void> failure(String errorCode, String message) {
        return failure(errorCode, message, null);
    }

    /**
     * 메시지만 있는 실패 응답 (에러 코드 기본값)
     */
    public static ApiResponseDto<Void> failure(String message) {
        return failure("INTERNAL_SERVER_ERROR", message);
    }

    // ==================== 편의 메서드 ====================

    /**
     * 생성 성공 응답
     */
    public static <T> ApiResponseDto<T> created(String message, T data) {
        return success(message, data);
    }

    /**
     * 생성 성공 응답 (기본 메시지)
     */
    public static <T> ApiResponseDto<T> created(T data) {
        return success("리소스가 성공적으로 생성되었습니다.", data);
    }

    /**
     * 생성 성공 응답 (데이터 없음, 기본 메시지)
     */
    public static ApiResponseDto<Void> created() {
        return success("리소스가 성공적으로 생성되었습니다.");
    }

    /**
     * 수정 성공 응답
     */
    public static ApiResponseDto<Void> updated(String message) {
        return success(message);
    }

    /**
     * 수정 성공 응답 (기본 메시지)
     */
    public static ApiResponseDto<Void> updated() {
        return success("리소스가 성공적으로 수정되었습니다.");
    }

    /**
     * 삭제 성공 응답
     */
    public static ApiResponseDto<Void> deleted(String message) {
        return success(message);
    }

    /**
     * 삭제 성공 응답 (기본 메시지)
     */
    public static ApiResponseDto<Void> deleted() {
        return success("리소스가 성공적으로 삭제되었습니다.");
    }

    // ==================== 상태 확인 메서드 ====================

    /**
     * 성공 응답인지 확인
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * 실패 응답인지 확인
     */
    public boolean isFailure() {
        return !success;
    }

    /**
     * 에러 코드가 있는지 확인
     */
    public boolean hasErrorCode() {
        return errorCode != null && !errorCode.trim().isEmpty();
    }

    /**
     * 데이터가 있는지 확인
     */
    public boolean hasData() {
        return data != null;
    }
}