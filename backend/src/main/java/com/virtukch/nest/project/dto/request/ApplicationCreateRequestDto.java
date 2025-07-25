package com.virtukch.nest.project.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 지원서 제출
 */
@Getter
public class ApplicationCreateRequestDto {
    private Long roleId;
    private String applicationMessage;
    private LocalDate availableStartDate;
    private String availableTimeSlots;
    private String timePreferenceNote;
}
