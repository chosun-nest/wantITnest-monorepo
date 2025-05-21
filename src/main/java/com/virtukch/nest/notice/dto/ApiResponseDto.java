package com.virtukch.nest.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponseDto {
    private String status;
    private String message;
    private int processedCount;
    private String noticeType;

    // 편의를 위한 정적 팩토리 메서드
    public static ApiResponseDto success(String noticeType, int count) {
        return ApiResponseDto.builder()
                .status("success")
                .message(noticeType + " 공지사항을 성공적으로 받았습니다.")
                .processedCount(count)
                .noticeType(noticeType)
                .build();
    }
}