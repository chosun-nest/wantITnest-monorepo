package com.virtukch.nest.history.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HistoryResponseDto {

    private Long historyId;

    private Long memberId; // 개발 단계에서만 사용

    private String content;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean important;
}
