package com.virtukch.nest.project.dto.request;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 지원서 검토
 */
@Getter
@Setter
public class ApplicationReviewRequestDto {
    private ApplicationStatus status;         // ACCEPTED or REJECTED
    private String reviewComment;
}
