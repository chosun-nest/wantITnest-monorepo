package com.virtukch.nest.project.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

/**
 * 지원서 수정
 */
@Getter
public class ApplicationUpdateRequestDto {
    private String applicationMessage;
    private LocalDate availableStartDate;
    private String availableTimeSlots;
    private String timePreferenceNote;
    private List<Long> memberTechStackIds;
}
