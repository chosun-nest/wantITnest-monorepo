package com.virtukch.nest.project.dto.request;

import com.virtukch.nest.project.model.enums.ApplicationStatus;

/**
 * 지원서 검토
 */
public class ApplicationReviewRequestDto {
    private ApplicationStatus status;         // ACCEPTED or REJECTED
    private String reviewComment;
}
