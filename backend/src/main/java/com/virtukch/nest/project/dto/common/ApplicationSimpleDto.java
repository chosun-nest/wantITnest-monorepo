package com.virtukch.nest.project.dto.common;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApplicationSimpleDto {
    private Long applicationId;
    private String applicantName;
    private ApplicationStatus status;
    private String appliedAt;
}
