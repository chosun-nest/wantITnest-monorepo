package com.virtukch.nest.project.dto.request;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class ApplicationSearchRequestDto {
    private ApplicationStatus status;
    private Long roleId;
    private LocalDate appliedDateFrom;
    private LocalDate appliedDateTo;
    private Integer minTechStackMatch;        // 최소 기술스택 매칭도 (%)
    private List<Long> requiredTechStackIds;  // 필수 기술스택 필터
}
