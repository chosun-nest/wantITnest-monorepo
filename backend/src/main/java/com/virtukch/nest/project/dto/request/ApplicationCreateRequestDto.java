package com.virtukch.nest.project.dto.request;

import lombok.Getter;

@Getter
public class ApplicationCreateRequestDto {
    private Long roleId;
    private String applicationMessage;
    private String availableStartDate;
    private String availableTimeSlots;
    private String timePreferenceNote;
}
