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
public class HistoryRequestDto {

    private String content;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean important;
}